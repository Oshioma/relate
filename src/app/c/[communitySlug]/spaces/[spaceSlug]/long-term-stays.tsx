import { BedDouble } from "lucide-react";
import { ListYourRoom, ZanzibarRoomsStayCards } from "@/components/editorial-guide/zanzibar-rooms-stays";
import { getLongTermStays } from "@/lib/zanzibar-rooms/long-term";

// "Long Term": monthly lets from Zanzibar Rooms at the foot of Mzungu
// Zanzibar's accommodation directory (the page gates it; see
// lib/zanzibar-rooms/long-term). Separate from the directory's own grid and
// untouched by its filters. Render inside <Suspense> so a slow feed never
// holds up the page. With no stays to show (feed off, failed or empty) it is
// just the heading and the link for hosts to list their room.
const LONG_TERM_PROMPT = "Have a room or home to let long term?";

export async function LongTermStays() {
  const stays = await getLongTermStays();
  if (!stays) {
    return (
      <section aria-labelledby="zr-long-term-stays" className="mt-10 rounded-lg border border-border bg-card p-4">
        <h2 id="zr-long-term-stays" className="flex items-center gap-2 text-base font-semibold text-foreground">
          <BedDouble className="h-4 w-4 text-accent" aria-hidden /> Long Term
        </h2>
        <ListYourRoom prompt={LONG_TERM_PROMPT} />
      </section>
    );
  }
  return (
    <ZanzibarRoomsStayCards
      stays={stays}
      heading="Long Term"
      headingId="zr-long-term-stays"
      headingLevel="h2"
      note="Partner listings from Zanzibar Rooms, a separate site; listed and priced by their hosts."
      action={<ListYourRoom prompt={LONG_TERM_PROMPT} />}
      className="mt-10"
    />
  );
}
