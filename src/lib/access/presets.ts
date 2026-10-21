// The five ways to start a community, as presets of settings Relate already
// has. Choosing one fills in privacy, the "show to visitors" switches and what
// new spaces default to; it never creates a membership, a price or a post.
// Everything a preset sets can be changed one by one afterwards.

import type { CommunityPrivacy, SpaceVisibility } from "@/types/database";
import type { AccessChoice, AccessCommunity, AccessSpace, AccessTier } from "./model";
import { accessChoiceOf } from "./model";

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
  // A space set aside for paid members. Until a membership exists it opens to
  // all members — a space nobody can open looks broken.
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
      "Listed on Relate. Anyone can join for free, but every space is for paid members, so people pay to open them. Nothing is charged until you set a price.",
    community: { privacy: "public", feed_public: true, events_public: false, members_visibility: "private" },
    defaultSpaceChoice: "paid",
    addsWelcomeSpace: true,
    addsPremiumSpace: false,
    nextStep: "Set your membership price. Until then, members can open every space.",
  },
  {
    key: "premium",
    label: "Free + premium",
    description: "Free to join, with paid spaces for those who want more.",
    explainer:
      "Listed on Relate and free to join. You get a Premium space ready for paid members. Nothing is charged until you create a membership.",
    community: { privacy: "public", feed_public: true, events_public: true, members_visibility: "members" },
    defaultSpaceChoice: "members",
    addsWelcomeSpace: true,
    addsPremiumSpace: true,
    nextStep: "Create your first membership to start charging for Premium.",
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

// What a seeded space's visibility becomes under a preset. "Paid members" can't
// lock anything at launch (there's no membership yet), so it seeds as members
// and is marked for paid members by the first membership the creator makes.
export function seededVisibility(preset: AccessPreset, templateVisibility: SpaceVisibility | undefined): SpaceVisibility {
  if (templateVisibility === "private") return "private";
  if (preset.defaultSpaceChoice === "everyone") return "public";
  return "members";
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
