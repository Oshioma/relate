import type { CommunityPrivacy, SpaceType, SpaceVisibility } from "@/types/database";
import type { StarterActivity } from "@/lib/community-templates";

export interface WizardSpace {
  id: string;
  name: string;
  description: string;
  show_in_nav: boolean;
  space_type: SpaceType;
  staff_post_only: boolean;
  // Seeded from the template. Not editable in the wizard — same as
  // staff_post_only — because both are refined in Admin afterward.
  visibility: SpaceVisibility;
}

export interface WizardState {
  name: string;
  slug: string;
  slugTouched: boolean;
  description: string;
  privacy: CommunityPrivacy;
  templateKey: string;
  // Place-Based Community only: "what kind of place is this?" plus the name
  // of the place itself (e.g. "Zanzibar, Tanzania"). Both stay empty for
  // every other template.
  locationType: string;
  locationName: string;
  // Musician / Artist template only: "fan" (around one artist) or "collective"
  // (a community of artists). Empty for every other template, and until picked.
  artistMode: string;
  // Activity template only: which activity the community is built around
  // (ACTIVITY_KINDS). Empty for every other template, and until picked.
  activityKind: string;
  // School template only: what kind of school this is (SCHOOL_KINDS). Empty
  // for every other template, and until picked.
  schoolKind: string;
  // Craft & Makers template only: which craft the community is built around
  // (CRAFT_KINDS). Empty for every other template, and until picked.
  craftKind: string;
  // The rituals the chosen kind suggests running in the first month. Shown at
  // setup and on the launch summary; the server re-derives them from craftKind
  // rather than trusting this, so it is display state only.
  starterActivities: StarterActivity[];
  // What the owner said their community is FOR, from COMMUNITY_INTENTS. Filters
  // the type grid and nothing else — it is never stored on the community, so an
  // owner who picks the "wrong" intent loses nothing by changing their mind.
  intents: string[];
  mapLayers: string[];
  rationale: string[];
  spaces: WizardSpace[];
}

export const INITIAL_WIZARD_STATE: WizardState = {
  name: "",
  slug: "",
  slugTouched: false,
  description: "",
  privacy: "public",
  templateKey: "",
  locationType: "",
  locationName: "",
  artistMode: "",
  activityKind: "",
  schoolKind: "",
  craftKind: "",
  starterActivities: [],
  intents: [],
  mapLayers: [],
  rationale: [],
  spaces: [],
};

let counter = 0;
export function nextId(prefix: string): string {
  counter += 1;
  return `${prefix}-${Date.now()}-${counter}`;
}

export function reorder<T>(list: T[], from: number, to: number): T[] {
  const copy = [...list];
  const [moved] = copy.splice(from, 1);
  copy.splice(to, 0, moved);
  return copy;
}
