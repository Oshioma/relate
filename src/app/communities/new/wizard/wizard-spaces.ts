// The wizard's spaces under an access preset, and the same spaces as the
// access model sees them for the three-viewer preview. Pure, so the preview
// and the tests next to this file agree on what each viewer gets.

import {
  PREMIUM_SPACE,
  WELCOME_SPACE,
  getAccessPreset,
  launchCommunitySettings,
  launchVisibility,
  seededAccess,
  type AccessPreset,
} from "@/lib/access/presets";
import type { AccessCommunity, AccessSpace, AccessTier } from "@/lib/access/model";
import type { SpaceType } from "@/types/database";
import { nextId, type WizardSpace, type WizardState } from "./types";

// Re-seed who can open each space for a newly picked preset. Spaces the
// creator set by hand keep their answer; the preset's own extra spaces come
// and go with it.
export function applyPresetToSpaces(spaces: WizardSpace[], preset: AccessPreset | undefined, defaultType: SpaceType): WizardSpace[] {
  if (!preset) return spaces;
  const kept = spaces
    .filter((s) => (s.seed === "welcome" ? preset.addsWelcomeSpace : s.seed === "premium" ? preset.addsPremiumSpace : true))
    .map((s) => (s.accessTouched || s.seed ? s : { ...s, access: seededAccess(preset, s.templateVisibility) }));

  const result = [...kept];
  if (preset.addsWelcomeSpace && !kept.some((s) => s.seed === "welcome")) {
    result.unshift({
      id: nextId("space"),
      ...WELCOME_SPACE,
      show_in_nav: true,
      space_type: defaultType,
      staff_post_only: true,
      access: "everyone",
      seed: "welcome",
    });
  }
  if (preset.addsPremiumSpace && !kept.some((s) => s.seed === "premium")) {
    result.push({
      id: nextId("space"),
      ...PREMIUM_SPACE,
      show_in_nav: true,
      space_type: defaultType,
      staff_post_only: false,
      access: "paid",
      seed: "premium",
    });
  }
  return result;
}

// The community row the wizard will create, as the access model reads it.
export function wizardCommunity(state: Pick<WizardState, "presetKey" | "hideCompletely" | "custom">): AccessCommunity {
  const preset = getAccessPreset(state.presetKey) ?? getAccessPreset("open")!;
  const settings = launchCommunitySettings(preset, { hideCompletely: state.hideCompletely, custom: state.custom });
  // No payments yet, but nothing launches locked behind them either, so this
  // stays unset rather than raising "payments aren't connected" everywhere.
  return {
    privacy: settings.privacy,
    feed_public: settings.feed_public,
    events_public: settings.events_public,
    members_visibility: settings.members_visibility,
  };
}

// A stand-in for the first membership, used only by the "paid member" preview
// to show what the creator's paid spaces will do once one exists.
export const FUTURE_MEMBERSHIP: AccessTier = { id: "future-membership", name: "Your membership", price_cents: 0, archived_at: null };

// The spaces as they launch ("today"), or as they'll be once the first
// membership is set up ("withMembership": paid spaces join it).
export function wizardAccessSpaces(spaces: WizardSpace[], when: "today" | "withMembership"): AccessSpace[] {
  return spaces.map((s) => {
    const paidLater = when === "withMembership" && s.access === "paid";
    return {
      id: s.id,
      name: s.name || "Untitled space",
      visibility: paidLater ? "members" : launchVisibility(s.access),
      price_cents: 0,
      show_in_nav: s.show_in_nav,
      tierIds: paidLater ? [FUTURE_MEMBERSHIP.id] : [],
    };
  });
}

// The spaces still waiting for a membership, for Preview and Launch.
export function spacesWaitingForMembership(spaces: WizardSpace[]): WizardSpace[] {
  return spaces.filter((s) => s.access === "paid");
}
