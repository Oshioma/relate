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

export const NAV_GROUPS = [
  { key: "home", label: "Home" },
  { key: "learn", label: "Learn" },
  { key: "connect", label: "Connect" },
] as const;

export type NavGroup = (typeof NAV_GROUPS)[number]["key"];

export const NAV_GROUP_KEYS = NAV_GROUPS.map((g) => g.key) as NavGroup[];

export function isNavGroup(value: string | null | undefined): value is NavGroup {
  return Boolean(value) && (NAV_GROUP_KEYS as string[]).includes(value as string);
}

export function navGroupLabel(key: string | null | undefined): string | null {
  return NAV_GROUPS.find((g) => g.key === key)?.label ?? null;
}

// The group a space type falls into when nobody has said otherwise. Used to
// pre-select the dropdown in Admin, and by the one-time backfill for school
// communities — never to override a choice already made.
//
// The split is by what the space is FOR, not by what it contains. A Q&A space
// is Learn because you go there to find something out; a club is Connect
// because you go there to be with people. Anything genuinely ambiguous is left
// out and defaults to ungrouped rather than guessed at.
const DEFAULTS: Record<string, NavGroup> = {
  // Home — the community talking to itself.
  discussion: "home",
  gallery: "home",
  growth_journey: "home",
  custom: "home",

  // Learn — you came here to find something out or to be taught it.
  lessons: "learn",
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
  map: "connect",
};

export function defaultNavGroup(spaceType: string): NavGroup | null {
  return DEFAULTS[spaceType] ?? null;
}
