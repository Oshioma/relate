// Suggestions, not an enum — a club's category is free text (see the Club
// type in database.ts) since the set of possible interests is unbounded.
// These just save typing for the common cases from the product brief.
export const CLUB_CATEGORY_PRESETS = [
  "Photography",
  "Parents",
  "Running",
  "Fishing",
  "Gardening",
  "Cycling",
  "Book Club",
  "Business Networking",
  "Language Exchange",
  "Dog Owners",
  "Artists",
  "Board Games",
] as const;
