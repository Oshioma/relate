import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCommunityBySlug } from "@/lib/data/community";
import {
  getOutline,
  getSourcesByIds,
  getWorkByKey,
  getWorkClaims,
  getWorkImages,
  getWorkManuscripts,
  type OutlinePassage,
} from "@/lib/data/timeline-texts";
import { communityHasTimeline, timelineEventPath } from "@/lib/timeline/availability";
import { formatYear } from "@/lib/timeline/time";
import { inventoryWork } from "@/lib/timeline/texts/inventory";
import { passagePath } from "@/lib/timeline/texts/paths";
import { buildOutline, readingOrder, type OutlineNode } from "@/lib/timeline/texts/reading";
import { divisionKindLabel, passageVerificationLabel } from "@/lib/timeline/texts/taxonomy";
import { CompletenessBadge, FiveDates, ImageFigure, TraditionBadge } from "../archive-ui";
import { TextsNav } from "../texts-nav";
import { InlinePassageRow } from "./inline-passage";

// ONE TEXT: what it is, its five kinds of date, its witnesses, and its whole
// table of contents. A passage opens in place under its line in the contents;
// its own page is a link away.

type Params = { communitySlug: string; workKey: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { workKey } = await params;
  return { title: inventoryWork(decodeURIComponent(workKey))?.title ?? "Ancient text" };
}

export default async function WorkPage({ params }: { params: Promise<Params> }) {
  const { communitySlug, workKey: rawKey } = await params;
  const workKey = decodeURIComponent(rawKey);
  const supabase = await createClient();
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community || !communityHasTimeline(community)) notFound();
  const work = await getWorkByKey(supabase, community.id, workKey).catch(() => null);
  if (!work) notFound();
  const inventory = inventoryWork(workKey);

  const [outline, claims, manuscripts, images] = await Promise.all([
    getOutline(supabase, community.id, work.id),
    work.event_id ? getWorkClaims(supabase, work.event_id) : Promise.resolve([]),
    getWorkManuscripts(supabase, community.id, work.id),
    getWorkImages(supabase, community.id, work.id),
  ]);
  const sourcesById = await getSourcesByIds(supabase, [
    ...claims.map((c) => c.source_id ?? ""),
    ...manuscripts.map((m) => m.source_id ?? ""),
  ]);
  const { data: event } = work.event_id
    ? await supabase.from("timeline_events").select("slug").eq("id", work.event_id).maybeSingle()
    : { data: null };
  const first = readingOrder(outline.filter((row) => row.passage_key))[0];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <TextsNav communitySlug={community.slug} active={null} />

      <div className="mt-5 flex flex-wrap items-start gap-2">
        <h1 className="mr-auto text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{work.title}</h1>
        <CompletenessBadge status={work.completeness_status} />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <TraditionBadge traditionClass={work.tradition_class} />
        {[work.civilisation, work.original_language, work.attribution].filter(Boolean).join(" · ")}
      </div>
      {work.summary && <p className="mt-3 max-w-3xl text-base text-foreground">{work.summary}</p>}
      {work.attribution_note && <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{work.attribution_note}</p>}

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
        {first?.passage_key && (
          <Link
            href={passagePath(community.slug, workKey, first.passage_key)}
            className="rounded-lg bg-accent px-3 py-1.5 font-medium text-accent-foreground"
          >
            Start reading
          </Link>
        )}
        {event?.slug && (
          <Link href={timelineEventPath(community.slug, event.slug)} className="self-center text-accent hover:underline">
            See it on the timeline
          </Link>
        )}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
        <section aria-labelledby="contents">
          <h2 id="contents" className="text-lg font-semibold text-foreground">
            Contents
          </h2>
          <p className="text-sm text-muted-foreground">
            {outline.length} passage records. Counted on {work.reference_edition ?? "the reference edition"}.
          </p>
          {outline.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">No passages have been imported for this text yet.</p>
          ) : (
            <Outline nodes={buildOutline(outline)} communitySlug={community.slug} workKey={workKey} />
          )}
        </section>

        <aside className="space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-foreground">Dates</h2>
            <p className="mb-2 text-sm text-muted-foreground">Five different questions, answered separately.</p>
            <FiveDates claims={claims} sourcesById={sourcesById} />
          </section>

          {images.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-foreground">Manuscripts and early prints</h2>
              <div className="mt-2 space-y-4">
                {images.map((image) => (
                  <ImageFigure key={image.id} image={image} />
                ))}
              </div>
            </section>
          )}

          {manuscripts.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-foreground">Witnesses</h2>
              <ul className="mt-2 space-y-3">
                {manuscripts.map((m) => (
                  <li key={m.id} className="text-sm">
                    <p className="font-medium text-foreground">
                      {m.siglum ? `${m.siglum} · ` : ""}
                      {m.catalogue_url ? (
                        <a href={m.catalogue_url} target="_blank" rel="noreferrer" className="hover:underline">
                          {m.name}
                        </a>
                      ) : (
                        m.name
                      )}
                    </p>
                    <p className="text-muted-foreground">
                      {m.original_date_text ??
                        (m.start_year != null ? formatYear(m.start_year) : "Date not recorded here")}
                    </p>
                    {m.notes && <p className="text-xs text-muted-foreground">{m.notes}</p>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="text-sm">
            <h2 className="text-lg font-semibold text-foreground">The inventory</h2>
            <p className="mt-1 text-foreground">{work.inventory_basis}</p>
            <h2 className="mt-4 text-lg font-semibold text-foreground">What may be reproduced</h2>
            <p className="mt-1 text-foreground">{work.copyright_summary}</p>
            {inventory && inventory.referenceOnlyEditions.length > 0 && (
              <p className="mt-1 text-muted-foreground">Cited but not reproduced: {inventory.referenceOnlyEditions.join("; ")}.</p>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}

function Outline({
  nodes,
  communitySlug,
  workKey,
}: {
  nodes: OutlineNode<OutlinePassage>[];
  communitySlug: string;
  workKey: string;
}) {
  return (
    <ul className="mt-3 space-y-1">
      {nodes.map((node) => (
        <li key={node.id}>
          {node.children.length > 0 ? (
            <details open={node.depth === 0 && nodes.length <= 6} className="group">
              <summary className="cursor-pointer list-none rounded-md px-2 py-1 hover:bg-muted">
                <span className="text-sm font-medium text-foreground">{node.label}</span>{" "}
                <span className="text-xs text-muted-foreground">
                  {divisionKindLabel(node.division_kind) ?? ""} · {node.children.length}
                </span>{" "}
                <Link href={passagePath(communitySlug, workKey, node.passage_key!)} className="text-xs text-accent hover:underline">
                  open
                </Link>
              </summary>
              <div className="ml-3 border-l border-border pl-2">
                <Outline nodes={node.children} communitySlug={communitySlug} workKey={workKey} />
              </div>
            </details>
          ) : (
            <InlinePassageRow
              communitySlug={communitySlug}
              passageKey={node.passage_key!}
              href={passagePath(communitySlug, workKey, node.passage_key!)}
              label={node.label}
              summary={node.summary}
              unverifiedLabel={
                node.verification_status === "unverified" ? passageVerificationLabel(node.verification_status) ?? null : null
              }
            />
          )}
        </li>
      ))}
    </ul>
  );
}
