import type { ProfileFieldType, CommunityPrivacy } from "@/types/database";

export interface WizardSpace {
  id: string;
  name: string;
  description: string;
  show_in_nav: boolean;
}

export interface WizardProfileField {
  id: string;
  label: string;
  field_type: ProfileFieldType;
  options: string[];
}

export interface WizardState {
  name: string;
  slug: string;
  slugTouched: boolean;
  description: string;
  privacy: CommunityPrivacy;
  templateKey: string;
  transformationGoal: string;
  rationale: string[];
  spaces: WizardSpace[];
  profileFields: WizardProfileField[];
}

export const INITIAL_WIZARD_STATE: WizardState = {
  name: "",
  slug: "",
  slugTouched: false,
  description: "",
  privacy: "public",
  templateKey: "",
  transformationGoal: "",
  rationale: [],
  spaces: [],
  profileFields: [],
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
