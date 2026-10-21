// The five ways to start a community, as presets of settings Relate already
// has. Choosing one fills in privacy, how people join, the "show to visitors"
// switches and who can open each seeded space; it never creates a membership,
// a price or a post. Everything a preset sets can be changed one by one
// afterwards.

import type { CommunityPrivacy, JoinPolicy, SpaceVisibility } from "@/types/database";
import type { AccessChoice, AccessCommunity, AccessSpace, AccessTier } from "./model";
import { accessChoiceOf } from "./model";
import { defaultJoinPolicy, storedJoinPolicy } from "@/lib/join-policy";

export type AccessPresetKey = "open" | "private" | "paid" | "premium" | "custom";

export type AccessPreset = {
  key: AccessPresetKey;
  label: string;
  description: string;
  // Shown under the cards once picked: what this means in practice.
  explainer: string;
  community: Pick<AccessCommunity, "privacy" | "feed_public" | "events_public" | "members_visibility">;
  // Who can open a space the template seeds, unless the template asks for
  // something tighter (a staff room stays Admins only).
  defaultSpaceChoice: AccessChoice;
  // A first space open to everyone, so visitors have something to read.
  addsWelcomeSpace: boolean;
  // A space set aside for paid members. With no membership yet it starts
  // Admins only and says it's waiting for one: a paid space must never open
  // to everyone just because nobody has set a price.
  addsPremiumSpace: boolean;
  // The first thing the launch summary suggests doing next.
  nextStep: string | null;
};

export const ACCESS_PRESETS: AccessPreset[] = [
  {
    key: "open",
    label: "Open community",
    description: "Anyone can find it and join for free.",
    explainer: "Listed on Relate and free to join. Visitors can read your Start here space and see upcoming events before joining.",
    community: { privacy: "public", feed_public: true, events_public: true, members_visibility: "members" },
    defaultSpaceChoice: "members",
    addsWelcomeSpace: true,
    addsPremiumSpace: false,
    nextStep: null,
  },
  {
    key: "private",
    label: "Private community",
    description: "Only people you invite or approve.",
    explainer: "Not listed. People with the link ask to join and you approve them. Choose \"Hide it completely\" to make it invitation only.",
    community: { privacy: "private", feed_public: false, events_public: false, members_visibility: "members" },
    defaultSpaceChoice: "members",
    addsWelcomeSpace: false,
    addsPremiumSpace: false,
    nextStep: "Invite your first members from the Members page.",
  },
  {
    key: "paid",
    label: "Paid membership",
    description: "Visitors see your page and prices. Members pay to get in.",
    explainer:
      "Listed on Relate and free to join, with every space for paid members. Until you set up a membership those spaces are Admins only, so nothing opens for free by accident. Nothing is charged until you do.",
    community: { privacy: "public", feed_public: true, events_public: false, members_visibility: "private" },
    defaultSpaceChoice: "paid",
    addsWelcomeSpace: true,
    addsPremiumSpace: false,
    nextStep: "Set up your membership. Your paid spaces stay Admins only until you do.",
  },
  {
    key: "premium",
    label: "Free + premium",
    description: "Free to join, with paid spaces for those who want more.",
    explainer:
      "Listed on Relate and free to join. You also get a Premium space for paid members, kept Admins only until you set up a membership. Nothing is charged until you do.",
    community: { privacy: "public", feed_public: true, events_public: true, members_visibility: "members" },
    defaultSpaceChoice: "members",
    addsWelcomeSpace: true,
    addsPremiumSpace: true,
    nextStep: "Set up a membership for Premium. It stays Admins only until you do.",
  },
  {
    key: "custom",
    label: "Custom setup",
    description: "Pick listing, joining and access yourself.",
    explainer: "Choose who can find the community, how people join and who can open each space. You can still preview it next.",
    community: { privacy: "public", feed_public: false, events_public: false, members_visibility: "members" },
    defaultSpaceChoice: "members",
    addsWelcomeSpace: false,
    addsPremiumSpace: false,
    nextStep: null,
  },
];

export function getAccessPreset(key: string | null | undefined): AccessPreset | undefined {
  return ACCESS_PRESETS.find((p) => p.key === key);
}

// The privacy a preset launches with. "Private" has one extra question, whether
// to hide the community completely (invite-only) rather than just unlist it.
export function presetPrivacy(preset: AccessPreset, hideCompletely = false): CommunityPrivacy {
  return preset.key === "private" && hideCompletely ? "invite_only" : preset.community.privacy;
}

// --- Seeded spaces ----------------------------------------------------------

// Who can open a space in the wizard. There's no membership yet, so "paid"
// can't be a real tier link: it means "for paid members once a membership
// exists" and launches as Admins only (see launchVisibility).
export type WizardAccess = "everyone" | "members" | "paid" | "team";

export const WIZARD_ACCESS_OPTIONS: { value: WizardAccess; label: string; description: string }[] = [
  { value: "everyone", label: "Everyone", description: "Including people who aren't signed in." },
  { value: "members", label: "All members", description: "Anyone who has joined." },
  { value: "paid", label: "Paid members", description: "Admins only until you set up a membership." },
  { value: "team", label: "Admins only", description: "You, admins and moderators." },
];

// What a seeded space starts as under a preset. A template's team-only room
// (a school's Staff Room) stays team-only whatever the preset says.
export function seededAccess(preset: AccessPreset, templateVisibility: SpaceVisibility | undefined): WizardAccess {
  if (templateVisibility === "private") return "team";
  if (templateVisibility === "public") return "everyone";
  const choice = preset.defaultSpaceChoice;
  if (choice === "tiers") return "paid";
  return choice;
}

// The visibility a wizard space is saved with. "Paid members" is private until
// the first membership is set up, so the space is never free by accident.
export function launchVisibility(access: WizardAccess): SpaceVisibility {
  if (access === "everyone") return "public";
  if (access === "members") return "members";
  return "private";
}

// The extra spaces a preset adds on top of the template's own.
export const WELCOME_SPACE = { name: "Start here", description: "What this community is and how to get the most from it." };
export const PREMIUM_SPACE = { name: "Premium", description: "For paid members." };

// --- Community settings -----------------------------------------------------

// Listing, joining and visitor switches as a creator can set them under Custom
// setup. Every other preset fills these in itself.
export type CustomCommunityChoice = {
  privacy: CommunityPrivacy;
  joinPolicy: JoinPolicy;
  feedPublic: boolean;
  eventsPublic: boolean;
};

export type LaunchCommunitySettings = {
  privacy: CommunityPrivacy;
  // What to write to communities.join_policy: null when privacy implies it.
  join_policy: JoinPolicy | null;
  feed_public: boolean;
  events_public: boolean;
  members_visibility: SpaceVisibility;
};

// The community row a preset launches with. Used by the wizard's preview and
// summary and, with the same inputs, by the server action that creates the
// community, so what the creator saw is what gets saved.
export function launchCommunitySettings(
  preset: AccessPreset,
  options: { hideCompletely?: boolean; custom?: Partial<CustomCommunityChoice> } = {}
): LaunchCommunitySettings {
  if (preset.key === "custom") {
    const c = options.custom ?? {};
    const privacy: CommunityPrivacy = c.privacy === "private" || c.privacy === "invite_only" ? c.privacy : "public";
    const join: JoinPolicy = c.joinPolicy === "open" || c.joinPolicy === "approval" ? c.joinPolicy : defaultJoinPolicy(privacy);
    // Nothing shows to visitors of a hidden community, so the switches stay off
    // rather than saved as settings that do nothing.
    const hidden = privacy === "invite_only";
    return {
      privacy,
      join_policy: storedJoinPolicy(privacy, join),
      feed_public: !hidden && Boolean(c.feedPublic),
      events_public: !hidden && Boolean(c.eventsPublic),
      members_visibility: preset.community.members_visibility,
    };
  }
  const privacy = presetPrivacy(preset, options.hideCompletely);
  const hidden = privacy === "invite_only";
  return {
    privacy,
    join_policy: null,
    feed_public: !hidden && preset.community.feed_public,
    events_public: !hidden && preset.community.events_public,
    members_visibility: preset.community.members_visibility,
  };
}

// Which preset an existing community matches, for the settings summary. Most
// communities predate presets and match none: they read as "custom".
export function matchPreset(community: AccessCommunity, spaces: AccessSpace[], tiers: AccessTier[]): AccessPresetKey {
  const gated = spaces.some((s) => {
    const c = accessChoiceOf(s, tiers);
    return c === "paid" || c === "tiers";
  });
  const allGated = spaces.filter((s) => s.visibility === "members").every((s) => {
    const c = accessChoiceOf(s, tiers);
    return c === "paid" || c === "tiers";
  });
  if (community.privacy !== "public") return community.feed_public || community.events_public || gated ? "custom" : "private";
  if (gated && allGated) return "paid";
  if (gated) return "premium";
  return "open";
}
