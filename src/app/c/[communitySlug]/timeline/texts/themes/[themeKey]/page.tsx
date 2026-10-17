import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { getCommunityBySlug } from "@/lib/data/community";
import { getThemePassages, type ThemePassage } from "@/lib/data/timeline-texts";
import { communityHasTimeline } from "@/lib/timeline/availability";
import { formatYear } from "@/lib/timeline/time";
import { comparePath, passagePath, themePath } from "@/lib/timeline/texts/paths";
import { archiveThemeHint, archiveThemeLabel, connectionClassLabel, connectionIsDocumented, isArchiveTheme } from "@/lib/timeline/texts/taxonomy";
import { TraditionBadge } from "../../archive-ui";
import { TextsNav } from "../../texts-nav";

// ONE IDEA, THROUGH TIME.
//
// Passages under a theme, grouped by text and ordered by each text's oldest
// evidence. Connections between passages on the page are listed beneath,
// solid for documented relationships and dashed for resemblance — so the
// reader sees which lines of descent are evidenced and which are not.

type Params = { communitySlug: string; themeKey: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { themeKey } = await params;
  return { title: `Trace an idea: ${archiveThemeLabel(decodeURIComponent(themeKey)) ?? "theme"}` };
}

export default async function ThemePage({ params }: { params: Promise<Params> }) {
  const { communitySlug, themeKey: raw } = await params;
  const themeKey = decodeURIComponent(raw);
  if (!isArchiveTheme(themeKey)) notFound();
  const supabase = await createClient();
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community || !communityHasTimeline(community)) notFound();
  const { passages, links } = await getThemePassages(supabase, community.id, themeKey).catch(() => ({ passages: [] as ThemePassage[], links: [] }));

  const groups: { workKey: string; workTitle: string; traditionClass: string; year: number | null; dateText: string | null; passages: ThemePassage[] }[] = [];
  for (const p of passages) {
    let group = groups.find((g) => g.workKey === p.workKey);
    if (!group) {
      group = { workKey: p.workKey, workTitle: p.workTitle, traditionClass: p.traditionClass, year: p.year, dateText: p.dateText, passages: [] };
      groups.push(group);
    }
    group.passages.push(p);
  }
  const headOf = new Map(passages.map((p) => [p.passageKey, p]));

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
      <TextsNav communitySlug={community.slug} active="themes" />
      <Link href={themePath(community.slug)} className="mt-4 inline-block text-sm text-muted-foreground hover:text-foreground hover:underline">
        All themes
      </Link>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{archiveThemeLabel(themeKey)}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{archiveThemeHint(themeKey)} A navigation aid: appearing here is not evidence of a shared source.</p>

      {groups.length === 0 ? (
        <p className="mt-6 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">No imported passage carries this theme yet.</p>
      ) : (
        <ol className="relative mt-6 space-y-6 border-l-2 border-border pl-5">
          {groups.map((group) => (
            <li key={group.workKey}>
              <span className="absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full border-2 border-background bg-accent" aria-hidden />
              <p className="text-xs tabular-nums text-muted-foreground">
                {group.year != null ? `Oldest evidence: ${formatYear(group.year)}` : "No dated evidence recorded"}
                {group.dateText ? ` · ${group.dateText}` : ""}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-semibold text-foreground">{group.workTitle}</h2>
                <TraditionBadge traditionClass={group.traditionClass} />
              </div>
              <ul className="mt-2 space-y-2">
                {group.passages.map((p) => (
                  <li key={p.passageKey} className="rounded-lg border border-border bg-card p-3">
                    <Link href={passagePath(community.slug, p.workKey, p.passageKey)} className="text-sm font-medium text-accent hover:underline">
                      {p.label}
                    </Link>
                    {p.summary && <p className="text-sm text-foreground">{p.summary}</p>}
                    <p className="text-xs text-muted-foreground">{p.note}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      )}

      {links.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-foreground">Connections argued between these passages</h2>
          <ul className="mt-2 space-y-2">
            {links.map((link) => (
              <li
                key={link.id}
                className={cn("rounded-lg border-2 p-3 text-sm", connectionIsDocumented(link.connection_class) ? "border-solid border-border" : "border-dashed border-border")}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground">{connectionClassLabel(link.connection_class)}</p>
                <p className="text-foreground">
                  {headOf.get(link.from_passage_key)?.workTitle}: {headOf.get(link.from_passage_key)?.label} ↔ {headOf.get(link.to_passage_key)?.workTitle}:{" "}
                  {headOf.get(link.to_passage_key)?.label}
                </p>
                <p className="text-muted-foreground">{link.transmission_evidence}</p>
                <Link href={comparePath(community.slug, [link.from_passage_key, link.to_passage_key])} className="text-xs text-accent hover:underline">
                  Compare side by side
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
