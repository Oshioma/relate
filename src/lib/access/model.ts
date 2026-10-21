// Who can open what, in the creator's words.
//
// Relate's real lock is in the database: can_see_space_shell / has_space_access
// (see supabase/migrations/*_access_security_fixes.sql). This module is the
// same rule written in TypeScript so screens can explain and preview it — the
// creation wizard's "see it as" preview, the access picker, the settings
// summary and the access overview all ask here, so they always agree with each
// other. It never grants anything: pages still read through RLS.
//
// supabase/tests/access_security.sql checks the database side of every case the
// tests next to this file check here; when one rule changes, change both.

import type { CommunityPrivacy, SpaceVisibility } from "@/types/database";

// --- Inputs ------------------------------------------------------------------

export type AccessCommunity = {
  privacy: CommunityPrivacy;
  feed_public: boolean;
  events_public: boolean;
  members_visibility: SpaceVisibility;
  // Payments are connected and taking charges (Stripe Connect).
  stripe_charges_enabled?: boolean;
};

export type AccessTier = {
  id: string;
  name: string;
  price_cents: number;
  currency?: string;
  // Archived tiers keep their subscribers but take no new ones.
  archived_at: string | null;
};

export type AccessSpace = {
  id: string;
  name: string;
  visibility: SpaceVisibility;
  price_cents: number;
  currency?: string;
  show_in_nav?: boolean;
  // Every tier this space is in (tier_spaces), archived ones included.
  tierIds: string[];
};

// The person looking. "paid" carries what they hold, so a preview can show a
// member on one tier but not another.
export type AccessViewer =
  | { kind: "visitor" }
  | { kind: "outsider" }
  | { kind: "member" }
  | { kind: "paid"; tierIds: string[]; spaceIds?: string[] }
  | { kind: "team" };

// What that person gets: they can open it, they can see it but it asks them to
// join or pay, or it isn't there for them at all.
export type AccessState = "open" | "locked" | "hidden";

// --- The rule (mirrors can_see_space_shell + has_space_access) ---------------

// A space counts as paid when it has its own price or belongs to any tier —
// except a public space, which is always open (has_space_access says the same).
export function isGated(space: AccessSpace): boolean {
  return space.visibility !== "public" && (space.price_cents > 0 || space.tierIds.length > 0);
}

function isMember(viewer: AccessViewer): boolean {
  return viewer.kind === "member" || viewer.kind === "paid" || viewer.kind === "team";
}

// Can they see that the space exists (and so be shown its paywall)?
function seesShell(community: AccessCommunity, space: AccessSpace, viewer: AccessViewer): boolean {
  if (viewer.kind === "team") return true;
  if (space.visibility === "public") return community.privacy !== "invite_only" || isMember(viewer);
  if (space.visibility === "members") return isMember(viewer);
  return false;
}

function holdsAccess(space: AccessSpace, viewer: AccessViewer): boolean {
  if (viewer.kind !== "paid") return false;
  return space.tierIds.some((id) => viewer.tierIds.includes(id)) || Boolean(viewer.spaceIds?.includes(space.id));
}

export function spaceAccessFor(community: AccessCommunity, space: AccessSpace, viewer: AccessViewer): AccessState {
  if (viewer.kind === "team") return "open";
  if (!seesShell(community, space, viewer)) return "hidden";
  if (!isGated(space)) return "open";
  return holdsAccess(space, viewer) ? "open" : "locked";
}

// --- The creator's choices ----------------------------------------------------

// The five answers to "who can open it?". They are a way of reading and writing
// visibility + price + tier links, not a separate setting.
export type AccessChoice = "everyone" | "members" | "paid" | "tiers" | "team";

export const ACCESS_CHOICES: { value: AccessChoice; label: string; description: string }[] = [
  { value: "everyone", label: "Everyone", description: "Including people who aren't signed in. Always free." },
  { value: "members", label: "All members", description: "Anyone who has joined." },
  { value: "paid", label: "Paid members", description: "Anyone on any membership." },
  { value: "tiers", label: "Selected memberships", description: "Only the memberships you choose, or people who buy this space on its own." },
  { value: "team", label: "Admins only", description: "You, admins and moderators." },
];

export function onSaleTiers(tiers: AccessTier[]): AccessTier[] {
  return tiers.filter((t) => !t.archived_at);
}

// Read a space's settings back as one of the five choices. "Paid members" is a
// space in every tier on sale (and no price of its own); any other gated mix is
// "Selected memberships". A team-only space is "Admins only" whatever tiers
// still list it — nobody but the team can open it.
export function accessChoiceOf(space: AccessSpace, tiers: AccessTier[]): AccessChoice {
  if (space.visibility === "public") return "everyone";
  if (space.visibility === "private") return "team";
  if (!isGated(space)) return "members";
  const selling = onSaleTiers(tiers);
  const inEveryTier = selling.length > 0 && selling.every((t) => space.tierIds.includes(t.id));
  return inEveryTier && space.price_cents === 0 ? "paid" : "tiers";
}

export type SpaceAccessSettings = {
  visibility: SpaceVisibility;
  price_cents: number;
  tierIds: string[];
};

// Turn a choice back into settings. Tiers not on sale are kept for "Selected
// memberships" (their subscribers keep access) and dropped for every other
// choice, which is the creator saying the space works differently now.
export function settingsForChoice(
  choice: AccessChoice,
  tiers: AccessTier[],
  options: { tierIds?: string[]; priceCents?: number } = {}
): SpaceAccessSettings {
  switch (choice) {
    case "everyone":
      return { visibility: "public", price_cents: 0, tierIds: [] };
    case "members":
      return { visibility: "members", price_cents: 0, tierIds: [] };
    case "paid":
      return { visibility: "members", price_cents: 0, tierIds: onSaleTiers(tiers).map((t) => t.id) };
    case "tiers": {
      const known = new Set(tiers.map((t) => t.id));
      return {
        visibility: "members",
        price_cents: Math.max(0, Math.round(options.priceCents ?? 0)),
        tierIds: [...new Set(options.tierIds ?? [])].filter((id) => known.has(id)),
      };
    }
    case "team":
      return { visibility: "private", price_cents: 0, tierIds: [] };
  }
}

// --- Plain English --------------------------------------------------------------

export function formatMonthly(priceCents: number, currency = "usd"): string {
  const amount = priceCents / 100;
  let text: string;
  try {
    text = new Intl.NumberFormat("en", { style: "currency", currency: currency.toUpperCase(), maximumFractionDigits: amount % 1 ? 2 : 0 }).format(amount);
  } catch {
    text = `${amount.toFixed(2)} ${currency.toUpperCase()}`;
  }
  return `${text}/month`;
}

// One line saying who can open a space, for chips and summaries.
export function describeSpaceAccess(space: AccessSpace, tiers: AccessTier[]): string {
  const choice = accessChoiceOf(space, tiers);
  if (choice === "everyone") return "Everyone";
  if (choice === "members") return "All members";
  if (choice === "team") return "Admins only";
  if (choice === "paid") return "Paid members";
  const names = tiers.filter((t) => space.tierIds.includes(t.id)).map((t) => t.name);
  const ownPrice = space.price_cents > 0 ? `${formatMonthly(space.price_cents, space.currency)} on its own` : null;
  if (names.length && ownPrice) return `Members on ${names.join(", ")}, or ${ownPrice}`;
  if (names.length) return `Members on ${names.join(", ")}`;
  return ownPrice ? `Paid: ${ownPrice}` : "Selected memberships";
}

export function describeDiscoverability(community: AccessCommunity): string {
  if (community.privacy === "public") return "Listed on Relate. Anyone can find it and join for free.";
  if (community.privacy === "private") return "Not listed. People with the link can ask to join, and you approve them.";
  return "Hidden. Only people you invite can get in.";
}

// A short plain-English summary of the whole community, one sentence a line.
export function describeCommunityAccess(community: AccessCommunity, spaces: AccessSpace[], tiers: AccessTier[]): string[] {
  const lines = [describeDiscoverability(community)];
  const byChoice = (c: AccessChoice) => spaces.filter((s) => accessChoiceOf(s, tiers) === c).map((s) => s.name);
  const list = (names: string[]) => (names.length <= 3 ? names.join(", ") : `${names.slice(0, 3).join(", ")} and ${names.length - 3} more`);

  const visitorReadable = community.privacy !== "invite_only" && (community.privacy === "public" || community.feed_public);
  const publicSpaces = byChoice("everyone");
  if (community.privacy === "invite_only") {
    lines.push("Visitors see nothing until they're invited.");
  } else if (publicSpaces.length) {
    lines.push(`Visitors can read ${list(publicSpaces)}${community.events_public && visitorReadable ? " and see upcoming events" : ""}.`);
  } else {
    lines.push("Visitors can't read any spaces before joining.");
  }

  const members = byChoice("members");
  if (members.length) lines.push(`Members can use ${list(members)}.`);
  const paid = [...byChoice("paid"), ...byChoice("tiers")];
  if (paid.length) {
    lines.push(
      onSaleTiers(tiers).length
        ? `${list(paid)} ${paid.length === 1 ? "is" : "are"} for paid members.`
        : `${list(paid)} ${paid.length === 1 ? "is" : "are"} set for paid members, but no membership is on sale yet.`
    );
  }
  const team = byChoice("team");
  if (team.length) lines.push(`Only you and your team can see ${list(team)}.`);
  const selling = onSaleTiers(tiers);
  if (selling.length) lines.push(`${selling.length} ${selling.length === 1 ? "membership is" : "memberships are"} on sale.`);
  return lines;
}

// --- Things worth a second look -----------------------------------------------------

export type AccessIssue = {
  code:
    | "locked_no_tier_on_sale"
    | "price_without_payments"
    | "feed_public_no_public_spaces"
    | "switch_has_no_effect"
    | "tier_without_spaces"
    | "public_space_in_tier"
    | "public_space_not_in_nav";
  severity: "problem" | "check";
  message: string;
  spaceId?: string;
  tierId?: string;
};

export function findAccessIssues(community: AccessCommunity, spaces: AccessSpace[], tiers: AccessTier[]): AccessIssue[] {
  const issues: AccessIssue[] = [];
  const selling = new Set(onSaleTiers(tiers).map((t) => t.id));

  for (const space of spaces) {
    // Only a members space is ever sold: public is free and team-only is the
    // team's whatever tiers say.
    const sold = space.visibility === "members" && isGated(space);
    if (space.visibility === "public" && space.tierIds.length) {
      issues.push({ code: "public_space_in_tier", severity: "check", spaceId: space.id, message: `"${space.name}" is open to everyone, so the memberships that list it don't unlock anything there.` });
    }
    if (sold && space.price_cents === 0 && !space.tierIds.some((id) => selling.has(id))) {
      issues.push({ code: "locked_no_tier_on_sale", severity: "problem", spaceId: space.id, message: `Nobody new can get into "${space.name}": none of its memberships are on sale.` });
    }
    if (sold && community.stripe_charges_enabled === false) {
      issues.push({ code: "price_without_payments", severity: "problem", spaceId: space.id, message: `"${space.name}" is for paid members, but payments aren't connected yet.` });
    }
    if (space.visibility === "public" && space.show_in_nav === false && community.privacy !== "invite_only") {
      issues.push({ code: "public_space_not_in_nav", severity: "check", spaceId: space.id, message: `"${space.name}" isn't in the sidebar, but anyone with the link can still open it.` });
    }
  }

  for (const tier of onSaleTiers(tiers)) {
    if (!spaces.some((s) => s.tierIds.includes(tier.id) && s.visibility !== "public")) {
      issues.push({ code: "tier_without_spaces", severity: "check", tierId: tier.id, message: `The "${tier.name}" membership doesn't unlock any spaces.` });
    }
  }

  if (community.privacy === "private" && community.feed_public && !spaces.some((s) => s.visibility === "public")) {
    issues.push({ code: "feed_public_no_public_spaces", severity: "check", message: "Visitors can open the feed, but no space is open to everyone, so it looks empty to them." });
  }
  if (community.privacy === "invite_only" && (community.feed_public || community.events_public)) {
    issues.push({ code: "switch_has_no_effect", severity: "check", message: "Showing the feed or events to visitors does nothing while the community is invitation only." });
  } else if (community.privacy === "private" && community.events_public && !community.feed_public) {
    issues.push({ code: "switch_has_no_effect", severity: "check", message: "Events only show to visitors once the feed is shown to them too." });
  }

  return issues;
}
