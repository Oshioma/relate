import { getZanzibarRoomsStays, type ZanzibarRoomsStay } from "./stays";

// The "Long Term" section at the foot of a community's accommodation
// directory: monthly lets from Zanzibar Rooms, shown on their own and never
// mixed into the directory's grid, filters or counts.

// The one space that shows it: Mzungu Zanzibar's accommodation directory. The
// spaces page is shared by every community, so this is gated by slug rather
// than by space type.
export const LONG_TERM_SPACE = { communitySlug: "mzunguzanzibar", spaceSlug: "accomodation" } as const;
export const LONG_TERM_LIMIT = 24;

export function showsLongTermStays(communitySlug: string, spaceSlug: string): boolean {
  return communitySlug === LONG_TERM_SPACE.communitySlug && spaceSlug === LONG_TERM_SPACE.spaceSlug;
}

type Options = NonNullable<Parameters<typeof getZanzibarRoomsStays>[1]>;

// Monthly stays in every area, or null to render nothing (feed off, failed or
// with no monthly lets). Anything priced by the night is dropped too, in case
// the feed ever ignores type=monthly, so the section only ever shows "/ month".
export async function getLongTermStays(options: Omit<Options, "limit"> = {}): Promise<ZanzibarRoomsStay[] | null> {
  const stays = await getZanzibarRoomsStays({ by: "all", monthly: true }, { ...options, limit: LONG_TERM_LIMIT });
  const monthly = stays?.filter((s) => s.priceUnit === "month") ?? [];
  return monthly.length > 0 ? monthly : null;
}
