// Sidebar sections.
//
// A community's nav is a flat list in the admin's own order. That reads fine
// with six spaces and badly with sixteen: by then a parent is scanning a column
// of similar-looking links for the one they want. Sections give the eye
// somewhere to land — the things you do together, the things you learn from,
// the things that are simply here.
//
// THREE RULES THIS FOLLOWS
//
// 1. Grouping is opt-in per community. A community where no space has a group
//    renders exactly the flat list it always did — no headings, no reordering,
//    nothing to notice. Nobody's nav changes without somebody choosing it.
//
// 2. The admin's order is never overridden, only sectioned. Spaces keep their
//    sort_order within a group, so a drag still does what it looks like it does.
//
// 3. A space with no group is not hidden. Ungrouped spaces fall to the end in
//    their own unlabelled section, so assigning groups can be done a few at a
//    time without anything disappearing in the meantime.

//
// WHICH SECTIONS EXIST
// Each community has its own, in community_nav_groups, which admins add to,
// rename and reorder in Admin. Every community starts with the three below; a
// growing community may add "My growing", a school "Projects". A space points
// at a section by key, and keys never change — only labels do — so renaming a
// section moves nothing.

export type NavGroupOption = { key: string; label: string };

// What every community starts with (the migration seeds these as rows), and
// what the nav falls back to if the community's sections cannot be read.
export const DEFAULT_NAV_GROUPS: NavGroupOption[] = [
  { key: "home", label: "Home" },
  { key: "learn", label: "Learn" },
  { key: "connect", label: "Connect" },
];

export type NavGroup = string;

// A stable key for a new section, from its label: "My growing" → my_growing.
// Taken keys get a numeric suffix so two sections may share a label.
export function navGroupKeyFor(label: string, takenKeys: string[]): string {
  const base =
    label
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 32) || "section";
  let key = base;
  for (let n = 2; takenKeys.includes(key); n++) key = `${base}_${n}`;
  return key;
}

// The group a space type falls into when nobody has said otherwise. Used to
// pre-select the dropdown in Admin, and by the one-time backfill for school
// communities — never to override a choice already made.
//
// The split is by what the space is FOR, not by what it contains. A Q&A space
// is Learn because you go there to find something out; a club is Connect
// because you go there to be with people. Anything genuinely ambiguous is left
// out and defaults to ungrouped rather than guessed at.
//
// It only names one of the three starting keys. If a community has removed
// that section, there is simply no suggestion.
const DEFAULTS: Record<string, NavGroup> = {
  // Home — the community talking to itself.
  discussion: "home",
  gallery: "home",
  growth_journey: "home",
  custom: "home",

  // Learn — you came here to find something out or to be taught it.
  lessons: "learn",
  books_media: "learn",
  course: "learn",
  guides: "learn",
  resources: "learn",
  qa: "learn",
  challenges: "learn",
  crop_guides: "learn",
  plant_scanner: "learn",
  plant_id: "learn",
  journal: "learn",
  my_crops: "learn",

  // Connect — other people are the point.
  clubs: "connect",
  meetups: "connect",
  directory: "connect",
  live: "connect",
  business_directory: "connect",
  marketplace: "connect",
  jobs: "connect",
  accommodation: "connect",
  recommendations: "connect",
  volunteer_hub: "connect",
  guided_journey: "connect",
  map: "connect",
};

export function defaultNavGroup(spaceType: string): NavGroup | null {
  return DEFAULTS[spaceType] ?? null;
}
