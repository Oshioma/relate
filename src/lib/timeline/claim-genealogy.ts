import {
  citationBreaksChain,
  genealogyHasAncientBase,
  genealogyStageOrder,
} from "./taxonomy";

// READING A CLAIM'S GENEALOGY.
//
// The questions a reader actually has about a claim like "Horus was crucified"
// are not "is it true?". They are:
//
//   Is there anything ancient at the bottom of this at all?
//   Where does the claim, in the form I heard it, first appear?
//   Does the chain hold, or does it end in a citation nobody can follow?
//
// Each of those is a function here rather than a sentence in a description,
// because a sentence can be written without checking and a function cannot.

export type GenealogyLinkLike = {
  stage: string;
  who: string;
  year?: number;
  says?: string;
  saysAbsentReason?: string;
  adds?: string;
  citationStatus?: string;
};

/** Oldest stage first, and within a stage, oldest year first. */
export function orderedLinks<T extends GenealogyLinkLike>(links: readonly T[]): T[] {
  return [...links].sort((a, b) => {
    const byStage = genealogyStageOrder(a.stage) - genealogyStageOrder(b.stage);
    if (byStage !== 0) return byStage;
    return (a.year ?? Number.POSITIVE_INFINITY) - (b.year ?? Number.POSITIVE_INFINITY);
  });
}

/**
 * IS THERE ANYTHING ANCIENT UNDER THIS CLAIM?
 *
 * The first question, and one a reading list does not answer on its face — a
 * genealogy can run through four confident books and never touch an object.
 */
export function hasAncientBase(links: readonly GenealogyLinkLike[]): boolean {
  return genealogyHasAncientBase(links.map((l) => l.stage));
}

/**
 * WHERE THE CHAIN STOPS CARRYING WEIGHT.
 *
 * Returns the first link whose own citation is broken or misattributed, in
 * chain order. Everything after it rests on that link and therefore on nothing,
 * which is a far more useful thing to tell a reader than a verdict.
 */
export function firstBrokenLink<T extends GenealogyLinkLike>(links: readonly T[]): T | null {
  return orderedLinks(links).find((l) => citationBreaksChain(l.citationStatus)) ?? null;
}

/**
 * WHERE THE CLAIM ACTUALLY ENTERS.
 *
 * The earliest link that ADDS something, at a stage later than the ancient
 * evidence. This is the answer to "who first said this?", and it is usually a
 * named person at a datable moment rather than an ancient anything.
 */
export function whereClaimEnters<T extends GenealogyLinkLike>(links: readonly T[]): T | null {
  return (
    orderedLinks(links).find(
      (l) => Boolean(l.adds) && l.stage !== "ancient_primary" && l.stage !== "later_antiquity"
    ) ?? null
  );
}

/**
 * A link that has not been read cannot be reported as saying anything.
 *
 * The same rule the rest of this timeline runs on, applied to the one place it
 * is most tempting to break: the link everybody cites and nobody opens.
 */
export function linkIsUnread(link: GenealogyLinkLike): boolean {
  return !link.says?.trim();
}

/** Every link that has not been read, in chain order. */
export function unreadLinks<T extends GenealogyLinkLike>(links: readonly T[]): T[] {
  return orderedLinks(links).filter(linkIsUnread);
}

/**
 * THE ONE-LINE SUMMARY A READER GETS BEFORE THEY OPEN ANYTHING.
 *
 * Deliberately not a verdict. It answers the structural questions and leaves
 * the judgement to the verdict field and to the reader.
 */
export function genealogyShape(links: readonly GenealogyLinkLike[]): {
  ancientBase: boolean;
  entersAt: GenealogyLinkLike | null;
  breaksAt: GenealogyLinkLike | null;
  unread: number;
  linkCount: number;
} {
  return {
    ancientBase: hasAncientBase(links),
    entersAt: whereClaimEnters(links),
    breaksAt: firstBrokenLink(links),
    unread: unreadLinks(links).length,
    linkCount: links.length,
  };
}
