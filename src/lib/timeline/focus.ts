import type { TimeWindow } from "./time";

// ONE TOPIC, ON ITS OWN.
//
// The timeline used to offer this for a single track — the Okomilo family —
// through a bar of its own. Every track, category, civilisation, shared tag and
// person is the same idea: show only the records filed under it, framed on the
// span they cover. So the bar is now one dropdown over all of them, and each
// choice is one of the filters the page already has, set on its own.

export type FocusKind = "track" | "category" | "civilisation" | "tag" | "person";

export type FocusChoice = { kind: FocusKind; value: string };

const KINDS: readonly FocusKind[] = ["track", "category", "civilisation", "tag", "person"];

/** The URL parameter each kind is written to — the same ones the filters use. */
export const FOCUS_PARAM: Record<FocusKind, string> = {
  track: "track",
  category: "category",
  civilisation: "civilisation",
  tag: "tag",
  person: "person",
};

export function isFocusKind(value: unknown): value is FocusKind {
  return typeof value === "string" && (KINDS as readonly string[]).includes(value);
}

/** One string per choice, for a <select>'s value. The kind never contains a colon, so the first one splits it. */
export function encodeFocus(choice: FocusChoice): string {
  return `${choice.kind}:${choice.value}`;
}

export function decodeFocus(encoded: string): FocusChoice | null {
  const at = encoded.indexOf(":");
  if (at < 0) return null;
  const kind = encoded.slice(0, at);
  const value = encoded.slice(at + 1);
  if (!isFocusKind(kind) || !value) return null;
  return { kind, value };
}

type FocusFilters = { trackId: string; category: string; civilisation: string; tag: string; person: string };

/**
 * The topic being shown on its own, when exactly one of these filters is set.
 * Two at once is a combination made in the filter drawer, not one topic, so the
 * dropdown says "Everything" rather than picking one of them to name.
 */
export function currentFocus(filters: FocusFilters): FocusChoice | null {
  const set: FocusChoice[] = [];
  if (filters.trackId) set.push({ kind: "track", value: filters.trackId });
  if (filters.category) set.push({ kind: "category", value: filters.category });
  if (filters.civilisation) set.push({ kind: "civilisation", value: filters.civilisation });
  if (filters.tag) set.push({ kind: "tag", value: filters.tag });
  if (filters.person) set.push({ kind: "person", value: filters.person });
  return set.length === 1 ? set[0] : null;
}

/** The filters that show this choice alone: its own one set, every other one cleared. */
export function filtersForFocus(choice: FocusChoice | null): FocusFilters {
  return {
    trackId: choice?.kind === "track" ? choice.value : "",
    category: choice?.kind === "category" ? choice.value : "",
    civilisation: choice?.kind === "civilisation" ? choice.value : "",
    tag: choice?.kind === "tag" ? choice.value : "",
    person: choice?.kind === "person" ? choice.value : "",
  };
}

export type FocusGroup = { label: string; options: { value: string; label: string }[] };

/** The dropdown's groups, in the order a reader is most likely to want them. Empty groups are left out. */
export function buildFocusGroups(input: {
  tracks: readonly { id: string; name: string }[];
  categories: readonly { key: string; label: string }[];
  civilisations: readonly string[];
  tags: readonly string[];
  people: readonly string[];
}): FocusGroup[] {
  const byLabel = (a: { label: string }, b: { label: string }) => a.label.localeCompare(b.label);
  const named = (kind: FocusKind, names: readonly string[]) =>
    names.map((name) => ({ value: encodeFocus({ kind, value: name }), label: name })).sort(byLabel);
  const groups: FocusGroup[] = [
    {
      label: "Tracks and datasets",
      options: input.tracks.map((track) => ({ value: encodeFocus({ kind: "track", value: track.id }), label: track.name })).sort(byLabel),
    },
    {
      label: "Topics",
      options: input.categories.map((meta) => ({ value: encodeFocus({ kind: "category", value: meta.key }), label: meta.label })),
    },
    { label: "Civilisations", options: named("civilisation", input.civilisations) },
    { label: "Related (shared tags)", options: named("tag", input.tags) },
    { label: "People", options: named("person", input.people) },
  ];
  return groups.filter((group) => group.options.length > 0);
}

/**
 * The address that opens the timeline on one topic: its filter and the window
 * that frames it. A track is named by slug, which is the same in every
 * community it is seeded into; everything else is named by its own text.
 */
export function focusLinkSearch(kind: FocusKind, linkValue: string, window: TimeWindow): string {
  const params = new URLSearchParams({
    [FOCUS_PARAM[kind]]: linkValue,
    from: String(Math.floor(window.from)),
    to: String(Math.ceil(window.to)),
  });
  return `?${params.toString()}`;
}
