// Suggestions, not an enum — a project's cause is free text (see the
// VolunteerProject type in database.ts) since the set of possible causes
// is unbounded, same reasoning as club categories.
export const VOLUNTEER_CATEGORY_PRESETS = [
  "Beach Cleanup",
  "Fundraising",
  "Tree Planting",
  "Animal Rescue",
  "Community Request",
  "Food Drive",
  "Disaster Relief",
  "Education",
] as const;
