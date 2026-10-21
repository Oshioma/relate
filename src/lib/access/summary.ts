// The four groups community access settings are arranged in, each with a one
// line answer to "what is it set to now?", for the "Who can see what?" card at
// the top of Admin. Built on the same model the access picker and the creation
// wizard use, so the card can't disagree with them.

import { accessChoiceOf, onSaleTiers, type AccessChoice, type AccessCommunity, type AccessSpace, type AccessTier } from "./model";
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
