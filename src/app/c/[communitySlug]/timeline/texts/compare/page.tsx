import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { getCommunityBySlug } from "@/lib/data/community";
import { getPassagesForComparison, getWorkClaims, type ReaderPassage } from "@/lib/data/timeline-texts";
import { communityHasTimeline } from "@/lib/timeline/availability";
import { evidenceLayerLabel } from "@/lib/timeline/taxonomy";
import { workForPassageKey } from "@/lib/timeline/texts/inventory";
import { comparePath, passagePath } from "@/lib/timeline/texts/paths";
import { historicalGap, roleLabel, type DatedStatement } from "@/lib/timeline/texts/reading";
import { connectionClassLabel, connectionIsDocumented, dateRoleFromWhatIsDated } from "@/lib/timeline/texts/taxonomy";
import { TextsNav } from "../texts-nav";

// COMPARE THIS PASSAGE.
//
// Up to four passages side by side, in the order given, with the historical
// gap between each neighbouring pair measured from their OLDEST EVIDENCE —
// never from the date a text claims for itself — and any connection argued
// between them. The address carries the passages (?p=…&p=…), so a comparison
// can be sent to somebody.

export const metadata: Metadata = { title: "Compare texts" };

const MAX_LANES = 4;

export default async function ComparePage({
  params,
  searchParams,
}: {
  params: Promise<{ communitySlug: string }>;
  searchParams: Promise<{ p?: string | string[] }>;
}) {
  const { communitySlug } = await params;
  const query = await searchParams;
  const keys = [...new Set((Array.isArray(query.p) ? query.p : query.p ? [query.p] : []).map((k) => k.trim()).filter(Boolean))].slice(0, MAX_LANES);

  const supabase = await createClient();
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community || !communityHasTimeline(community)) notFound();

  const passages = keys.length ? await getPassagesForComparison(supabase, community.id, keys).catch(() => keys.map(() => null)) : [];

  // Each passage's dated statements: its own, then its work's marker.
  const statements: DatedStatement[][] = await Promise.all(
    passages.map(async (passage) => {
      if (!passage) return [];
      const own = passage.dates.map((d) => ({ role: d.date_role, start_year: d.start_year, end_year: d.end_year, original_date_text: d.original_date_text }));
      const { data: work } = await supabase.from("timeline_text_works").select("event_id").eq("id", passage.work_id ?? "").maybeSingle();
      const claims = work?.event_id ? await getWorkClaims(supabase, work.event_id) : [];
      return [
        ...own,
        ...claims.map((c) => ({ role: dateRoleFromWhatIsDated(c.what_is_dated), start_year: c.start_year, end_year: c.end_year, original_date_text: c.original_date_text })),
      ];
    })
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <TextsNav communitySlug={community.slug} active="compare" />
      <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Compare texts</h1>
      <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
        Put passages side by side. The gap between them is measured from the oldest surviving evidence for each text, not
        from the date a text claims for itself. A resemblance shown here is not a claim that one text knew the other;
        where a connection has been argued, it is shown with its evidence.
      </p>

      <form method="get" className="mt-4 flex flex-wrap items-end gap-2">
        {Array.from({ length: Math.min(MAX_LANES, keys.length + 1) }, (_, i) => (
          <label key={i} className="text-xs text-muted-foreground">
            Passage {i + 1}
            <input
              name="p"
              defaultValue={keys[i] ?? ""}
              placeholder="e.g. greek.tim.25d"
              className="mt-1 block w-44 rounded-lg border border-border bg-background px-2 py-1.5 font-mono text-sm text-foreground"
            />
          </label>
        ))}
        <button type="submit" className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground">
          Compare
        </button>
      </form>

      {keys.length === 0 ? (
        <p className="mt-6 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
          Open any passage and press “Compare this passage”, or enter passage IDs above. Try{" "}
          <Link href={comparePath(community.slug, ["arab.tab.arabic.02", "arab.tab.vulgate.02", "arab.tab.newton.02"])} className="text-accent hover:underline">
            the Emerald Tablet&apos;s “above and below” in three versions
          </Link>{" "}
          or{" "}
          <Link href={comparePath(community.slug, ["greek.tim.25a", "greek.crit.113c"])} className="text-accent hover:underline">
            Atlantis in the Timaeus and the Critias
          </Link>
          .
        </p>
      ) : (
        <div className="-mx-4 mt-6 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${keys.length}, minmax(16rem, 1fr))` }}>
            {keys.map((key, i) => (
              <Lane
                key={key}
                passageKey={key}
                passage={passages[i]}
                statements={statements[i]}
                communitySlug={community.slug}
                removeHref={comparePath(community.slug, keys.filter((k) => k !== key))}
              />
            ))}
          </div>
        </div>
      )}

      {keys.length > 1 && (
        <section className="mt-6 space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Between them</h2>
          {keys.slice(1).map((key, i) => {
            const a = keys[i];
            const gap = historicalGap(statements[i] ?? [], statements[i + 1] ?? []);
            const links = (passages[i]?.links ?? []).filter(
              (l) => (l.from_passage_key === a && l.to_passage_key === key) || (l.from_passage_key === key && l.to_passage_key === a)
            );
            return (
              <div key={`${a}-${key}`} className="rounded-xl border border-border bg-card p-4 text-sm">
                <p className="font-mono text-xs text-muted-foreground">
                  {a} ↔ {key}
                </p>
                <p className="mt-1 text-foreground">{gap ? gap.text : "The gap cannot be measured: one of these has no dated evidence recorded."}</p>
                {links.length === 0 ? (
                  <p className="mt-1 text-muted-foreground">No connection between these two has been argued.</p>
                ) : (
                  links.map((link) => (
                    <div key={link.id} className={cn("mt-2 rounded-lg border-2 p-3", connectionIsDocumented(link.connection_class) ? "border-solid border-border" : "border-dashed border-border")}>
                      <p className="text-xs font-semibold uppercase tracking-wide text-foreground">{connectionClassLabel(link.connection_class)}</p>
                      <p className="mt-1 text-foreground">{link.similarities}</p>
                      <p className="mt-1 text-muted-foreground">Different: {link.differences}</p>
                      <p className="mt-1 text-muted-foreground">Evidence of transmission: {link.transmission_evidence}</p>
                      {link.contradiction_note && <p className="mt-1 text-muted-foreground">Contradiction: {link.contradiction_note}</p>}
                    </div>
                  ))
                )}
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
}

function Lane({
  passageKey,
  passage,
  statements,
  communitySlug,
  removeHref,
}: {
  passageKey: string;
  passage: ReaderPassage | null;
  statements: DatedStatement[] | undefined;
  communitySlug: string;
  removeHref: string;
}) {
  const work = workForPassageKey(passageKey);
  const oldest = (statements ?? []).filter((s) => s.start_year != null);
  return (
    <article className="flex min-w-0 flex-col rounded-xl border border-border bg-card p-4">
      <header className="flex items-start gap-2">
        <div className="mr-auto min-w-0">
          <p className="text-xs text-muted-foreground">{work?.title ?? "Unknown work"}</p>
          {passage && work ? (
            <Link href={passagePath(communitySlug, work.workKey, passageKey)} className="font-semibold text-foreground hover:underline">
              {passage.label}
            </Link>
          ) : (
            <p className="font-semibold text-foreground">{passageKey}</p>
          )}
        </div>
        <Link href={removeHref} aria-label="Remove from comparison" className="rounded p-1 text-muted-foreground hover:bg-muted">
          <X className="h-4 w-4" />
        </Link>
      </header>
      {!passage ? (
        <p className="mt-3 text-sm text-muted-foreground">This passage is not in the archive yet.</p>
      ) : (
        <>
          {passage.summary && <p className="mt-2 text-sm text-muted-foreground">{passage.summary}</p>}
          {passage.layers
            .filter((l) => l.content)
            .map((layer) => (
              <div key={layer.id} className="mt-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {evidenceLayerLabel(layer.layer)}
                  {layer.language ? ` · ${layer.language}` : ""}
                </p>
                <p dir={layer.language === "Arabic" ? "rtl" : undefined} className="mt-0.5 whitespace-pre-line text-sm text-foreground">
                  {layer.content}
                </p>
              </div>
            ))}
          {passage.layers.every((l) => !l.content) && (
            <p className="mt-3 text-sm italic text-muted-foreground">{passage.layers[0]?.content_absent_reason ?? "No text recorded."}</p>
          )}
          <div className="mt-auto pt-3 text-xs text-muted-foreground">
            {oldest.slice(0, 3).map((s, i) => (
              <p key={i}>
                {roleLabel(s.role)}: {s.original_date_text}
              </p>
            ))}
          </div>
        </>
      )}
    </article>
  );
}
