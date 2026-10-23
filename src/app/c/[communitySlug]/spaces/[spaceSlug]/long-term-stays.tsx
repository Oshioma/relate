import { ZanzibarRoomsStayCards } from "@/components/editorial-guide/zanzibar-rooms-stays";
import { getLongTermStays } from "@/lib/zanzibar-rooms/long-term";

// "Long Term": monthly lets from Zanzibar Rooms at the foot of Mzungu
// Zanzibar's accommodation directory (the page gates it; see
// lib/zanzibar-rooms/long-term). Separate from the directory's own grid and
// untouched by its filters. Render inside <Suspense> so a slow feed never
// holds up the page; any failure renders nothing.
export async function LongTermStays() {
  const stays = await getLongTermStays();
  if (!stays) return null;
  return (
    <ZanzibarRoomsStayCards
      stays={stays}
      heading="Long Term"
      headingId="zr-long-term-stays"
      headingLevel="h2"
      note="Partner listings from Zanzibar Rooms, a separate site; listed and priced by their hosts."
      className="mt-10"
    />
  );
}
