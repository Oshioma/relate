import { isAlternativeViewpoint, isMainstreamViewpoint } from "./taxonomy";

// =============================================================================
// READING THE TIMELINE UNDER ONE CHRONOLOGY AT A TIME
//
// A record can carry several date claims that disagree. Tiwanaku has an
// excavated chronology and Posnansky's astronomical one. Giza has Spence's
// ±5 years and Bauval's Orion epoch. Madjedbebe has three readings of the same
// deposit. That coexistence is the point of the whole data model.
//
// But a reader sometimes wants one question answered: WHAT DOES THE EXCAVATED
// RECORD ALONE SAY? This is the lens that answers it.
//
// WHY IT FILTERS CLAIMS AND NOT RECORDS, which is the whole design.
//
// There is already a viewpoint dropdown, and it filters RECORDS: a record shows
// if any one of its claims matches. That is not enough here, and the reason is
// worth stating plainly, because the obvious implementation is wrong. An event's
// position on the strip, its date label and its "these claims disagree" notice
// are all computed from its claims ARRAY. Filter only the records and a
// mainstream view would still show Tiwanaku sitting at 15,000 BCE — the
// alternative claim would go on placing a record the reader had asked to see
// without it. Worse than useless: quietly wrong.
//
// So a lens narrows each record's claims, and everything downstream follows for
// free — eventDateLabel, compareClaims, claimsDisagree and the layout all take
// the claims array they are given. A record left with nothing drops out.
//
// WHAT GOES IN WHICH GROUP, and the one decision that needed making.
//
// NEITHER POLE IS INVENTED HERE. taxonomy.ts already has isMainstreamViewpoint
// and isAlternativeViewpoint, with their exclusions argued one by one and a test
// saying each one "would be a specific lie". This module asks those helpers
// rather than keeping a second list, so the two cannot drift.
//
// The harder half is everything else, because a literal mainstream/alternative
// split puts Aboriginal oral tradition, Hindu cosmology and biblical chronology
// in one bucket with Atlantis. That is a judgement about those accounts, and it
// is exactly the judgement this dataset declines to make everywhere else. So
// traditional, Indigenous and religious chronologies get a group of their own.
// They are not a weaker version of an alternative claim; they are a different
// kind of claim, held by people about their own past.
//
// AND ANYTHING THIS MODULE DOES NOT RECOGNISE STAYS VISIBLE. `chronology` is a
// free string — a community can invent a viewpoint key, and several have. A
// lens that hid what it could not classify would silently delete their work the
// moment somebody clicked a filter, and they would have no way of knowing. The
// unclassified are shown under every lens and never counted as hidden.
//
// NOTHING HERE RANKS ANYTHING. There is no better or worse group, no score, and
// no default that implies one reading is the true one: the default is ALL.
// =============================================================================

export type ChronologyLens = "all" | "mainstream" | "alternative" | "traditional";

/** Which group a viewpoint belongs to. "unclassified" is always shown. */
export type ViewpointGroup = "mainstream" | "alternative" | "traditional" | "unclassified";

/**
 * A people's or a faith's own account of their past.
 *
 * The one group this module adds, because the vocabulary does not already name
 * it. It is deliberately NOT folded into "alternative": taxonomy.ts already
 * refuses that, and its reasoning holds here — a traditional account is not
 * competing for the same job as an alternative chronology, and a filter label
 * that lumped Aboriginal oral tradition in with Atlantis would be making
 * exactly the judgement this dataset declines to make everywhere else.
 */
const TRADITIONAL_VIEWPOINTS = new Set([
  "traditional",
  "oral_tradition",
  "indigenous",
  "religious",
  "biblical",
  "islamic",
  "hindu",
]);

/**
 * WHICH GROUP A VIEWPOINT BELONGS TO, ASKED OF THE VOCABULARY ITSELF.
 *
 * The mainstream and alternative answers come from isMainstreamViewpoint and
 * isAlternativeViewpoint rather than from a list kept here, so this module
 * cannot drift away from the rest of the app — and so the careful exclusions
 * those helpers already make are inherited rather than re-argued.
 *
 * "unclassified" is not a leftover bin, and three of its members are there on
 * purpose. `hypothesis` is a proposal inside science; `disputed` has
 * specialists on both sides; `historical` dates a document or an excavation
 * rather than taking a position about the past. None of the three belongs to
 * one pole, and all three stay visible under every lens — which is also why a
 * mainstream reading still shows the Dorchester record its 1852 report date,
 * the firmest claim it has.
 */
export function viewpointGroup(chronology: string | null | undefined): ViewpointGroup {
  if (!chronology) return "unclassified";
  if (isMainstreamViewpoint(chronology)) return "mainstream";
  if (isAlternativeViewpoint(chronology)) return "alternative";
  if (TRADITIONAL_VIEWPOINTS.has(chronology)) return "traditional";
  return "unclassified";
}

export const CHRONOLOGY_LENSES: {
  key: ChronologyLens;
  /** On the button. */
  short: string;
  /** Said in full where there is room for it. */
  label: string;
  /** What this lens does, in words a reader can act on. */
  hint: string;
}[] = [
  {
    key: "all",
    short: "All",
    label: "Every claim",
    hint: "Every date claim on every record, disagreements included. This is the default, and the timeline's own position: the claims are what there is.",
  },
  {
    key: "mainstream",
    short: "Mainstream",
    label: "The established account only",
    hint: "Only claims from the conventional, archaeological, scientific and geological viewpoints. Records placed solely by an alternative or traditional claim drop out, and records that carry both move to where the established claim puts them. Claims that date a document or an excavation stay, because they take no position about the past.",
  },
  {
    key: "alternative",
    short: "Alternative",
    label: "Proposed alternatives only",
    hint: "Only claims explicitly offered as alternatives to the established account. A disputed specialist position or a live hypothesis is not one of these and stays visible throughout — being argued about inside a field is not the same as being outside it.",
  },
  {
    key: "traditional",
    short: "Traditional",
    label: "Traditional and religious accounts only",
    hint: "Only a people's or a faith's own account of their past — oral tradition, Indigenous knowledge, and religious chronologies. A separate reading rather than a weaker one.",
  },
];

/** Whether one claim survives a lens. Unclassified viewpoints always do. */
export function claimPassesLens(chronology: string | null | undefined, lens: ChronologyLens): boolean {
  if (lens === "all") return true;
  const group = viewpointGroup(chronology);
  if (group === "unclassified") return true;
  return group === lens;
}

export type LensResult<T> = {
  /** The records, each with its claims narrowed. Order is preserved. */
  events: T[];
  /** How many claims the lens removed — shown to the reader, never silent. */
  hiddenClaims: number;
  /** How many records fell out entirely because nothing of theirs survived. */
  hiddenEvents: number;
  /**
   * Records whose position MOVED because the claim placing them was filtered
   * out. The interesting number: it is how many records read differently under
   * this lens rather than simply vanishing.
   */
  movedEvents: number;
};

/**
 * Narrow every record's claims to one lens.
 *
 * Pure, and generic over the event shape, so it can be tested without a
 * database or a browser — the claim only needs a `chronology`.
 */
export function applyLens<C extends { chronology: string | null }, T extends { claims: C[] }>(
  events: readonly T[],
  lens: ChronologyLens
): LensResult<T> {
  if (lens === "all") {
    return { events: [...events], hiddenClaims: 0, hiddenEvents: 0, movedEvents: 0 };
  }

  const kept: T[] = [];
  let hiddenClaims = 0;
  let hiddenEvents = 0;
  let movedEvents = 0;

  for (const event of events) {
    const claims = event.claims.filter((claim) => claimPassesLens(claim.chronology, lens));
    hiddenClaims += event.claims.length - claims.length;
    if (claims.length === 0) {
      // Nothing of this record survives the lens. It is not drawn, and it is
      // counted so the reader is told rather than left to notice.
      hiddenEvents += 1;
      continue;
    }
    // A record whose FIRST claim changed is a record the lens has repositioned,
    // because the first claim is the one the label and the layout lead with.
    if (claims[0] !== event.claims[0]) movedEvents += 1;
    kept.push(claims.length === event.claims.length ? event : { ...event, claims });
  }

  return { events: kept, hiddenClaims, hiddenEvents, movedEvents };
}

/**
 * One sentence saying what a lens is currently hiding, or null when it hides
 * nothing. The counts exist so a filtered timeline can never pass itself off as
 * the whole of what the community recorded.
 */
export function describeLens(result: LensResult<unknown>, lens: ChronologyLens): string | null {
  if (lens === "all") return null;
  if (result.hiddenClaims === 0 && result.hiddenEvents === 0) return null;
  const parts: string[] = [];
  if (result.hiddenClaims > 0) {
    parts.push(`${result.hiddenClaims} date claim${result.hiddenClaims === 1 ? "" : "s"}`);
  }
  if (result.hiddenEvents > 0) {
    parts.push(`${result.hiddenEvents} record${result.hiddenEvents === 1 ? "" : "s"} entirely`);
  }
  const moved =
    result.movedEvents > 0
      ? ` ${result.movedEvents} record${result.movedEvents === 1 ? " sits" : "s sit"} at a different date under this reading.`
      : "";
  return `Hiding ${parts.join(" and ")}.${moved}`;
}
