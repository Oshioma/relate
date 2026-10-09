import type { JourneyMilestoneSeed } from "@/types/database";

// A guided-journey space's configuration: every word, picture and option that
// makes one space "Adopt a Beginner" (gardening) and another "Adopt a New
// Sailor". The application code reads only this shape, never a community name.
//
// Stored as a preset key plus partial overrides (guided_journey_spaces.config):
// resolveConfig() layers the overrides over the preset, keeping only keys the
// preset defines and values of the right type, so a malformed or stale row can
// never break the page — it just falls back to the preset's wording.

export type ChoiceOption = { value: string; label: string };

export type ChoiceQuestion = {
  label: string;
  help: string;
  options: ChoiceOption[];
};

export type JourneyStage = {
  title: string;
  text: string;
  imageUrl: string | null;
  imageAlt: string;
};

export type TemplateSeed = {
  title: string;
  subject: string;
  summary: string;
  coverImageUrl: string | null;
  durationLabel: string;
  expectedWeeks: number | null;
  milestones: JourneyMilestoneSeed[];
};

export type GuidedJourneyConfig = {
  // Shown as a small label above the hero and used to group spaces.
  category: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string | null;
  heroImageAlt: string;
  terms: {
    beginner: string; // "beginner"
    beginners: string;
    mentor: string; // "mentor"
    mentors: string;
    journey: string; // "growing journey"
    subject: string; // "crop" — what a journey is about
    requestButton: string; // "Request Adoption"
    firstSuccessHelper: string; // "First-harvest helper"
  };
  beginnerCard: { title: string; description: string; button: string };
  mentorCard: { title: string; description: string; button: string };
  stagesTitle: string;
  stagesSubtitle: string;
  stages: JourneyStage[];
  // The five onboarding slots. Labels and options are configurable per space;
  // the slots themselves are fixed because matching relies on what they mean.
  questions: {
    location: { label: string; help: string };
    setting: ChoiceQuestion;
    interests: ChoiceQuestion;
    experience: ChoiceQuestion;
    helpMode: { label: string; help: string };
  };
  mentorQuestions: {
    experienceLabel: string;
    topicsLabel: string;
    climateLabel: string;
    photosLabel: string;
    introPlaceholder: string;
  };
  capacityOptions: number[];
  defaultUpdateFrequency: string;
  defaultJourneyTitle: string;
  defaultMilestones: JourneyMilestoneSeed[];
  completion: {
    title: string;
    subtitle: string;
    againButton: string;
    helpButton: string;
    mentorInvite: string;
  };
  gallery: {
    title: string;
    subtitle: string;
    methodLabel: string;
    methodOptions: ChoiceOption[];
  };
  safety: {
    adviceDisclaimer: string;
    inPersonNote: string;
  };
  // Future-ready: only 'free' does anything today. No payments are taken.
  participation: string;
};

export type GuidedJourneyPreset = {
  key: string;
  label: string;
  description: string;
  spaceName: string;
  config: GuidedJourneyConfig;
  templates: TemplateSeed[];
};

type Json = unknown;

function isPlainObject(value: Json): value is Record<string, Json> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Merge `override` onto `base`, accepting only what `base` already describes:
// same keys, same primitive types, arrays whose items look like base's items.
// Image URL keys (ending in "Url") may also be cleared to null.
export function mergeLike<T>(base: T, override: Json, key = ""): T {
  if (override === undefined) return base;

  if (base === null) {
    // Only the optional image fields are null in a preset.
    return (typeof override === "string" || override === null ? override : base) as T;
  }

  if (typeof base === "string") {
    if (typeof override === "string") return override as T;
    if (override === null && key.endsWith("Url")) return null as T;
    return base;
  }
  if (typeof base === "number") {
    return (typeof override === "number" && Number.isFinite(override) ? override : base) as T;
  }
  if (typeof base === "boolean") {
    return (typeof override === "boolean" ? override : base) as T;
  }

  if (Array.isArray(base)) {
    if (!Array.isArray(override)) return base;
    // An empty preset list gives nothing to compare items against; accept only
    // primitives that match typeof of the first override item.
    const sample = base[0];
    const items = override
      .map((item) => {
        if (sample === undefined) return typeof item === "string" || typeof item === "number" ? item : undefined;
        if (isPlainObject(sample)) {
          if (!isPlainObject(item)) return undefined;
          // Each item is merged over an "empty" version of the sample so that
          // missing optional fields fall back to blanks, not to item 0's text.
          return mergeLike(blankLike(sample), item);
        }
        return typeof item === typeof sample ? item : undefined;
      })
      .filter((item) => item !== undefined);
    return items as T;
  }

  if (isPlainObject(base)) {
    if (!isPlainObject(override)) return base;
    const out: Record<string, Json> = {};
    for (const k of Object.keys(base)) {
      out[k] = mergeLike((base as Record<string, Json>)[k], override[k], k);
    }
    return out as T;
  }

  return base;
}

// The same shape as `value` with strings emptied (and image URLs nulled),
// numbers zeroed and lists emptied — the base for a list item override.
function blankLike<T>(value: T): T {
  if (typeof value === "string") return "" as T;
  if (typeof value === "number") return 0 as T;
  if (typeof value === "boolean") return false as T;
  if (value === null) return null as T;
  if (Array.isArray(value)) return [] as T;
  if (isPlainObject(value)) {
    const out: Record<string, Json> = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = k.endsWith("Url") ? null : blankLike(v);
    }
    return out as T;
  }
  return value;
}

export function resolveConfig(preset: GuidedJourneyPreset, overrides: Json): GuidedJourneyConfig {
  return mergeLike(preset.config, isPlainObject(overrides) ? overrides : {});
}

// Small helpers used by the UI so labels are always read from config.
export function optionLabel(options: ChoiceOption[], value: string | null | undefined): string {
  if (!value) return "";
  return options.find((o) => o.value === value)?.label ?? value;
}

export function capitalise(text: string): string {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : text;
}

// Help-mode wording is the same everywhere; only the question label varies.
// Stored as one value; "either" means the person picked both.
export const HELP_MODE_OPTIONS: ChoiceOption[] = [
  { value: "online", label: "Online" },
  { value: "local", label: "Local, in person" },
  { value: "either", label: "Online and local" },
];

// What the forms offer: two chips people can tick one or both of.
export const HELP_MODE_CHOICES: ChoiceOption[] = HELP_MODE_OPTIONS.filter((o) => o.value !== "either");

export function helpModeFromChoices(values: string[]): "online" | "local" | "either" | null {
  const online = values.includes("online");
  const local = values.includes("local");
  if (online && local) return "either";
  if (online) return "online";
  if (local) return "local";
  return null;
}

export function helpModeToChoices(mode: string | null | undefined): string[] {
  if (mode === "online" || mode === "local") return [mode];
  return ["online", "local"];
}

export const MENTOR_LEVELS: { value: "experienced" | "community" | "first_harvest"; label: string; description: string }[] = [
  { value: "experienced", label: "Experienced mentor", description: "Several seasons of hands-on practice to share." },
  { value: "community", label: "Community mentor", description: "A member who's happy to help with what they know." },
  { value: "first_harvest", label: "First-success helper", description: "Has completed one journey here and can help with exactly that." },
];

export function mentorLevelLabel(level: string, config?: GuidedJourneyConfig): string {
  if (level === "first_harvest" && config) return config.terms.firstSuccessHelper;
  return MENTOR_LEVELS.find((l) => l.value === level)?.label ?? level;
}

export const REPORT_REASONS: { value: string; label: string }[] = [
  { value: "harassment", label: "Harassment or bullying" },
  { value: "unsafe", label: "Unsafe behaviour or pressure to meet" },
  { value: "inappropriate", label: "Inappropriate content" },
  { value: "misleading_advice", label: "Dangerous or misleading advice" },
  { value: "spam", label: "Spam or selling" },
  { value: "other", label: "Something else" },
];
