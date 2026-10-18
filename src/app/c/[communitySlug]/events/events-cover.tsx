import { DEFAULT_EVENT_IMAGE_URL } from "@/lib/events/default-image";

// A full-width cover across the top of the Events page, the same height as the
// feed page's hero and the space covers, so Events opens with a picture like
// every space does. It uses the default event photo the event cards fall back to.
export function EventsCover() {
  return (
    <div className="relative h-[340px] w-full overflow-hidden border-b border-border bg-muted sm:h-[400px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={DEFAULT_EVENT_IMAGE_URL} alt="" className="h-full w-full object-cover" />
    </div>
  );
}
