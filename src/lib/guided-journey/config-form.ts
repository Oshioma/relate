import type { ChoiceOption, GuidedJourneyConfig } from "./config";
import type { JourneyMilestoneSeed } from "@/types/database";

// Turning the Manage → Settings form into config overrides and back.
//
// Field names are the config path prefixed with "cfg." ("cfg.terms.mentor",
// "cfg.stages.2.title"). Lists an admin edits as text use one line per item:
//   options     "Balcony"                      (value kept stable by label)
//   milestones  "Plant your seeds :: Sow a few seeds indoors…"
//   numbers     "1, 3, 5"
// Only what differs from the preset is stored, so improvements to a preset
// still reach spaces that never changed that part.

type Json = unknown;
type FormLike = { get(name: string): FormDataEntryValue | null };

export function slugifyOption(label: string): string {
  return (
    label
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 40) || "option"
  );
}

const isOptionList = (value: Json): value is ChoiceOption[] =>
  Array.isArray(value) && value.length > 0 && typeof value[0] === "object" && value[0] !== null && "value" in value[0] && "label" in value[0];
const isMilestoneList = (value: Json): value is JourneyMilestoneSeed[] =>
  Array.isArray(value) && value.length > 0 && typeof value[0] === "object" && value[0] !== null && "title" in value[0] && !("text" in value[0]);
const isNumberList = (value: Json): value is number[] => Array.isArray(value) && value.every((v) => typeof v === "number");

export function optionsToText(options: ChoiceOption[]): string {
  return options.map((o) => o.label).join("\n");
}

export function textToOptions(text: string, previous: ChoiceOption[]): ChoiceOption[] {
  const seen = new Set<string>();
  const out: ChoiceOption[] = [];
  for (const raw of text.split("\n")) {
    const label = raw.trim().slice(0, 80);
    if (!label) continue;
    const existing = previous.find((o) => o.label.toLowerCase() === label.toLowerCase());
    let value = existing?.value ?? slugifyOption(label);
    while (seen.has(value)) value = `${value}_2`;
    seen.add(value);
    out.push({ value, label });
    if (out.length >= 20) break;
  }
  return out;
}

export function milestonesToText(milestones: JourneyMilestoneSeed[]): string {
  return milestones.map((m) => (m.description ? `${m.title} :: ${m.description}` : m.title)).join("\n");
}

export function textToMilestones(text: string): JourneyMilestoneSeed[] {
  return text
    .split("\n")
    .map((line) => {
      const [title, ...rest] = line.split("::");
      const description = rest.join("::").trim();
      return { title: title.trim().slice(0, 160), description: description.slice(0, 2000) };
    })
    .filter((m) => m.title)
    .slice(0, 40);
}

// Read the whole config from a submitted form, starting from `current` so any
// field the form didn't include keeps its value.
export function configFromForm(current: GuidedJourneyConfig, form: FormLike): GuidedJourneyConfig {
  function walk(value: Json, path: string): Json {
    const field = form.get(`cfg.${path}`);
    if (typeof value === "string" || value === null) {
      if (field === null) return value;
      const text = String(field).trim();
      return path.endsWith("Url") ? (text ? text : null) : text.slice(0, 2000);
    }
    if (typeof value === "number") {
      const n = Number(field);
      return field !== null && Number.isFinite(n) ? n : value;
    }
    if (Array.isArray(value)) {
      if (isOptionList(value)) return field === null ? value : textToOptions(String(field), value);
      if (isMilestoneList(value)) return field === null ? value : textToMilestones(String(field));
      if (isNumberList(value)) {
        if (field === null) return value;
        const nums = String(field)
          .split(/[,\s]+/)
          .map(Number)
          .filter((n) => Number.isInteger(n) && n >= 1 && n <= 20);
        return nums.length > 0 ? Array.from(new Set(nums)).sort((a, b) => a - b) : value;
      }
      // Fixed-length lists edited item by item (the five stages).
      return value.map((item, i) => walk(item, `${path}.${i}`));
    }
    if (typeof value === "object" && value !== null) {
      const out: Record<string, Json> = {};
      for (const [k, v] of Object.entries(value)) out[k] = walk(v, path ? `${path}.${k}` : k);
      return out;
    }
    return value;
  }
  return walk(current, "") as GuidedJourneyConfig;
}

// The parts of `next` that differ from `base` — what gets stored.
export function diffConfig(base: Json, next: Json): Json {
  if (typeof base === "object" && base !== null && !Array.isArray(base) && typeof next === "object" && next !== null && !Array.isArray(next)) {
    const out: Record<string, Json> = {};
    for (const [k, v] of Object.entries(next)) {
      const d = diffConfig((base as Record<string, Json>)[k], v);
      if (d !== undefined) out[k] = d;
    }
    return Object.keys(out).length > 0 ? out : undefined;
  }
  return JSON.stringify(base) === JSON.stringify(next) ? undefined : next;
}
