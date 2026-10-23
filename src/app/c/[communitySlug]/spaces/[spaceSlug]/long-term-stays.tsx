import { BedDouble, ExternalLink } from "lucide-react";
import { ZanzibarRoomsStayCards } from "@/components/editorial-guide/zanzibar-rooms-stays";
import { getLongTermStays, LIST_YOUR_ROOM_URL } from "@/lib/zanzibar-rooms/long-term";

// "Long Term": monthly lets from Zanzibar Rooms at the foot of Mzungu
// Zanzibar's accommodation directory (the page gates it; see
// lib/zanzibar-rooms/long-term). Separate from the directory's own grid and
// untouched by its filters. Render inside <Suspense> so a slow feed never
// holds up the page. With no stays to show (feed off, failed or empty) it is
// just the heading and the link for hosts to list their room.
export async function LongTermStays() {
  const stays = await getLongTermStays();
  if (!stays) {
    return (
      <section aria-labelledby="zr-long-term-stays" className="mt-10 rounded-lg border border-border bg-card p-4">
        <h2 id="zr-long-term-stays" className="flex items-center gap-2 text-base font-semibold text-foreground">
          <BedDouble className="h-4 w-4 text-accent" aria-hidden /> Long Term
        </h2>
        <ListYourRoom />
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
      action={<ListYourRoom />}
      className="mt-10"
    />
  );
}

function ListYourRoom() {
  return (
    <p className="mt-3 text-sm text-foreground">
      Have a room or home to let long term?{" "}
      <a
        href={LIST_YOUR_ROOM_URL}
        target="_blank"
        rel="noopener"
        className="inline-flex items-center gap-1 font-medium text-accent hover:underline"
      >
        Add your room to ZanzibarRooms.com <ExternalLink className="h-3 w-3" aria-hidden />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </p>
  );
}
