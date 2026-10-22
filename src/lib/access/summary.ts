// The four groups community access settings are arranged in, each with a one
// line answer to "what is it set to now?", for the "Who can see what?" card at
// the top of Admin. Built on the same model the access picker and the creation
// wizard use, so the card can't disagree with them.

import { accessChoiceOf, onSaleTiers, spaceAccessFor, type AccessChoice, type AccessCommunity, type AccessSpace, type AccessTier } from "./model";
import { describeJoining } from "@/lib/join-policy";
import type { JoinPolicy } from "@/types/database";

export type AccessGroupKey = "discoverability" | "joining" | "memberships" | "spaces";

export type AccessGroupSummary = {
  key: AccessGroupKey;
  label: string;
  // Where the settings for this group live on the Admin page.
  anchor: string;
  now: string;
};

export const ACCESS_GROUP_LABELS: Record<AccessGroupKey, string> = {
  discoverability: "Discoverability",
  joining: "Joining rules",
  memberships: "Memberships & payments",
  spaces: "Spaces & content access",
};

export function describeListing(community: AccessCommunity): string {
  if (community.privacy === "invite_only") return "Hidden: only members can open the link.";
  const listing = community.privacy === "public" ? "Listed on Relate." : "Unlisted: people need the link.";
  // A public community's feed is always readable (is_community_guest_readable).
  const feed = community.privacy === "public" || community.feed_public;
  const events = feed && community.events_public;
  if (feed && events) return `${listing} Visitors can read the feed and see events.`;
  if (feed) return `${listing} Visitors can read the feed.`;
  return `${listing} Visitors see the front page only.`;
}

const CHOICE_WORDS: Record<AccessChoice, string> = {
  everyone: "open to everyone",
  members: "for all members",
  paid: "for paid members",
  tiers: "for selected memberships",
  team: "Admins only",
};

export function describeSpaceMix(spaces: AccessSpace[], tiers: AccessTier[]): string {
  if (!spaces.length) return "No spaces yet.";
  const counts = new Map<AccessChoice, number>();
  for (const s of spaces) {
    const c = accessChoiceOf(s, tiers);
    counts.set(c, (counts.get(c) ?? 0) + 1);
  }
  const order: AccessChoice[] = ["everyone", "members", "paid", "tiers", "team"];
  return `${order.filter((c) => counts.has(c)).map((c) => `${counts.get(c)} ${CHOICE_WORDS[c]}`).join(", ")}.`;
}

export function describeMemberships(community: AccessCommunity, tiers: AccessTier[], canCharge: boolean): string {
  const selling = onSaleTiers(tiers);
  const archived = tiers.length - selling.length;
  const payments = community.stripe_charges_enabled ? "Payments connected." : canCharge ? "Payments not connected yet." : "Charging needs a paid plan.";
  if (!tiers.length) return `No memberships yet. ${payments}`;
  const names = selling.map((t) => t.name).join(", ");
  const onSale = selling.length ? `On sale: ${names}.` : "None on sale.";
  return `${onSale}${archived ? ` ${archived} archived (subscribers keep access).` : ""} ${payments}`;
}

export function summarizeAccessGroups(input: {
  community: AccessCommunity;
  joinPolicy: JoinPolicy;
  spaces: AccessSpace[];
  tiers: AccessTier[];
  canCharge: boolean;
}): AccessGroupSummary[] {
  const { community, joinPolicy, spaces, tiers, canCharge } = input;
  return [
    { key: "discoverability", label: ACCESS_GROUP_LABELS.discoverability, anchor: "discoverability", now: describeListing(community) },
    { key: "joining", label: ACCESS_GROUP_LABELS.joining, anchor: "joining", now: describeJoining(joinPolicy) },
    { key: "memberships", label: ACCESS_GROUP_LABELS.memberships, anchor: "set-up-membership", now: describeMemberships(community, tiers, canCharge) },
    { key: "spaces", label: ACCESS_GROUP_LABELS.spaces, anchor: "spaces", now: describeSpaceMix(spaces, tiers) },
  ];
}

// --- Three audiences -----------------------------------------------------------

export type AudienceLine = {
  who: "Visitors" | "Free members" | "Paid members";
  // One plain sentence; space names are listed separately as chips.
  text: string;
  open: string[];
  locked: string[];
};

// What each kind of person gets, in three lines, worked out per space by the
// same rule as everything else (spaceAccessFor) so the lines can't contradict
// each other or the tiles below them.
export function describeAudiences(community: AccessCommunity, spaces: AccessSpace[], tiers: AccessTier[]): AudienceLine[] {
  const names = (viewer: Parameters<typeof spaceAccessFor>[2], state: "open" | "locked") =>
    spaces.filter((s) => spaceAccessFor(community, s, viewer) === state).map((s) => s.name);

  // Visitors.
  let visitorText: string;
  const visitorOpen = names({ kind: "visitor" }, "open");
  // Teasers: members spaces shown to visitors locked.
  const visitorLocked = names({ kind: "visitor" }, "locked");
  if (community.privacy === "invite_only") {
    visitorText = "Can't open the community at all. They need an invitation.";
  } else {
    const feed = community.privacy === "public" || community.feed_public;
    const events = feed && community.events_public;
    const extras = [feed ? "the feed" : null, events ? "upcoming events" : null].filter(Boolean).join(" and ");
    if (visitorOpen.length) visitorText = `Can read these spaces before joining${extras ? `, plus ${extras}` : ""}${visitorLocked.length ? ", and see the locked ones" : ""}:`;
    else if (visitorLocked.length) visitorText = `${feed ? `Can open ${extras}. ` : ""}No space is open to everyone, but they see these locked until they join:`;
    else if (feed) visitorText = `Can open ${extras}, but no space is open to everyone, so the feed looks empty to them until they join.`;
    else visitorText = "See the front page only. Every space needs them to join first.";
  }

  // Free members.
  const memberOpen = names({ kind: "member" }, "open");
  const memberLocked = names({ kind: "member" }, "locked");
  const memberText = memberOpen.length
    ? memberLocked.length
      ? "Can open these, and see the paid ones locked:"
      : "Can open these:"
    : memberLocked.length
      ? "Can't open any space for free. They see the paid ones locked:"
      : "Can't open any space yet.";

  // Paid members: everything a membership on sale unlocks beyond free members.
  const selling = onSaleTiers(tiers);
  const paidOpen = selling.length
    ? names({ kind: "paid", tierIds: selling.map((t) => t.id) }, "open").filter((n) => !memberOpen.includes(n))
    : [];
  const paidText = !selling.length
    ? memberLocked.length
      ? "No membership is on sale yet, so nobody new can open the paid spaces."
      : "No membership is on sale."
    : paidOpen.length
      ? `On ${selling.map((t) => t.name).join(" or ")}, they also open:`
      : `${selling.map((t) => t.name).join(", ")} ${selling.length === 1 ? "doesn't" : "don't"} unlock any extra space yet.`;

  return [
    { who: "Visitors", text: visitorText, open: visitorOpen, locked: visitorLocked },
    { who: "Free members", text: memberText, open: memberOpen, locked: memberLocked },
    { who: "Paid members", text: paidText, open: paidOpen, locked: [] },
  ];
}
