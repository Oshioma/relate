import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Space } from "@/types/database";
import { SPACE_TYPES } from "@/lib/space-types";
import { toPlainText } from "@/components/ui/rich-text";
import { spaceImage } from "@/lib/space-images";
import { CategoryCarouselCard, type CategorySlide } from "./category-carousel-card";

// The row of photo cards under the feed hero: the community's headline spaces,
// each a one-click way in. It's the desktop twin of the mobile DiscoverStrip —
// hidden below `md`, where the strip already does this job — and it shows at
// most five so the row stays one row; the sidebar lists the rest.
//
// Each card: the space's photo across the top, then a white panel that
// overlaps the photo's foot with rounded corners, a solid accent circle
// carrying the type icon beside a bold title, the blurb indented under the
// title, and a soft round arrow button in the bottom-right corner.
export function SpaceCards({
  spaces,
  base,
  carousels = {},
  showOnMobile = false,
}: {
  spaces: Space[];
  base: string;
  // space id → its featured-category slides. A space with two or more shows
  // them one at a time (CategoryCarouselCard) instead of a single card.
  carousels?: Record<string, CategorySlide[]>;
  // The feed hides this row on phones (the DiscoverStrip does the job there);
  // the signed-out landing page has no strip, so it shows the cards stacked.
  showOnMobile?: boolean;
}) {
  const shown = spaces.slice(0, 5);
  if (shown.length === 0) return null;

  return (
    // auto-fit rather than fixed counts: the content column's width depends
    // on the sidebar as well as the screen, and a fixed three-up left a laptop
    // with three oversized cards and the other two pushed to a second row.
    //
    // With only a few spaces, though, auto-fit stretches each card to fill the
    // row — one space became a single card the width of the page. So a short
    // row uses auto-fill, which keeps the empty columns and the cards card-sized.
    <div
      className={`${showOnMobile ? "grid sm:grid-cols-2" : "hidden md:grid"} gap-4 ${
        shown.length >= 4
          ? "md:grid-cols-[repeat(auto-fit,minmax(185px,1fr))]"
          : "md:grid-cols-[repeat(auto-fill,minmax(185px,1fr))] xl:grid-cols-5"
      }`}
    >
      {shown.map((space) => {
        const Icon = SPACE_TYPES[space.space_type].icon;
        const slides = carousels[space.id] ?? [];
        if (slides.length >= 2) {
          return <CategoryCarouselCard key={space.id} slides={slides} icon={<Icon />} />;
        }
        // A custom page's description *is* the page (HTML, often with its own
        // <style>), so it never makes a blurb. Everything else is rich text,
        // shown as a plain excerpt.
        const blurb = space.space_type === "custom" || !space.description ? null : toPlainText(space.description);
        return (
          <Link
            key={space.id}
            href={`${base}/spaces/${space.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_-12px_rgba(0,0,0,0.18)] ring-1 ring-black/5 transition-shadow hover:shadow-[0_2px_6px_rgba(0,0,0,0.08),0_16px_32px_-12px_rgba(0,0,0,0.25)]"
          >
            <span className="relative block aspect-[4/3] w-full overflow-hidden bg-accent-soft">
              {/* The space's own photo, or its type's default — never a blank. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={spaceImage(space)}
                alt=""
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </span>

            {/* The panel rides up over the photo's foot, so the card reads as
                one object rather than a picture stacked on a box. */}
            <span className="relative -mt-4 flex flex-1 flex-col rounded-t-2xl bg-card px-4 pb-4 pt-4">
              <span className="flex gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-semibold leading-tight text-foreground">{space.name}</span>
                  {blurb && (
                    <span className="mt-1.5 line-clamp-3 block break-words text-[13px] leading-relaxed text-muted-foreground">
                      {blurb}
                    </span>
                  )}
                </span>
              </span>
              <span className="mt-auto flex justify-end pt-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
