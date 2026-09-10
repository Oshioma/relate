import type { TimelineSource } from "@/types/database";

// THE CITATION CHAIN.
//
//   Wikipedia
//     ↓ cites
//   Academic book
//     ↓ references
//   Excavation report
//
// One column carries this — `cited_by_source_id` on each source points at the
// source somebody found it THROUGH. Reading downwards from a Wikipedia article
// therefore means asking "what did this article lead people to?", which is a
// scan of sources the community already has loaded.
//
// Building it in the browser rather than in a query is deliberate: the timeline
// page already holds every source in the community, so a chain costs nothing,
// and the drawer and the standalone event page can't disagree about it.

/** Absolute ceiling on how far the walk goes. A chain longer than this is a research project. */
export const MAX_CHAIN_DEPTH = 6;

/**
 * Everything found THROUGH this source, deepest last.
 *
 * The cycle guard is not theoretical. `cited_by_source_id` is a plain
 * self-reference; the database refuses only a source citing itself, so A→B→A is
 * storable and would otherwise be an infinite loop in a render. The seen-set
 * stops it, and the depth cap stops anything the seen-set somehow doesn't.
 */
export function sourceChain(
  sourceId: string,
  sources: Iterable<TimelineSource>,
  maxDepth = MAX_CHAIN_DEPTH
): TimelineSource[] {
  // Which source each one was found through — built once, walked many times.
  const byCitedBy = new Map<string, TimelineSource>();
  for (const source of sources) {
    if (!source.cited_by_source_id) continue;
    // First one wins, so the chain is stable rather than dependent on the order
    // rows came back in.
    if (!byCitedBy.has(source.cited_by_source_id)) byCitedBy.set(source.cited_by_source_id, source);
  }

  const chain: TimelineSource[] = [];
  const seen = new Set<string>([sourceId]);
  let cursor: string | undefined = sourceId;

  while (cursor && chain.length < maxDepth) {
    const next: TimelineSource | undefined = byCitedBy.get(cursor);
    if (!next || seen.has(next.id)) break;
    seen.add(next.id);
    chain.push(next);
    cursor = next.id;
  }

  return chain;
}

/**
 * The word for what one source did to the next.
 *
 * "Cites" is what an encyclopedia does to a book; "references" is what a book
 * does to a report; "draws on" is the honest fallback when we don't know what
 * kind of link it is. Nothing here is a judgement — it is the sentence a person
 * would say out loud while pointing at the chain.
 */
export function chainVerb(from: TimelineSource, to: TimelineSource): string {
  if (from.source_type === "wikipedia" || from.source_type === "encyclopedia") return "cites";
  if (to.source_type === "archaeological" || to.source_type === "primary" || to.source_type === "historical_document") {
    return "references";
  }
  return "draws on";
}
