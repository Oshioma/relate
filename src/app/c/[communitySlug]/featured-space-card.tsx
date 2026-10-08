import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Space } from "@/types/database";
import { toPlainText } from "@/components/ui/rich-text";

// The sidebar's photo promo for the space an admin chose to feature (Admin →
// Landing page). The space's own image fills the card, darkened from the
// bottom so its name and description stay legible; without an image it sits
// on the community accent instead.
export function FeaturedSpaceCard({ space, href }: { space: Space; href: string }) {
  // Same rule as the space cards: a custom page's description is its HTML.
  const blurb = space.space_type === "custom" || !space.description ? null : toPlainText(space.description);
  return (
    <Link
      href={href}
      className="group relative isolate flex min-h-[220px] flex-col justify-end overflow-hidden rounded-xl bg-accent p-5 text-white shadow-sm"
    >
      {space.image_url && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={space.image_url}
            alt=""
            className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />
        </>
      )}
      <h2 className="text-2xl font-bold leading-tight">{space.name}</h2>
      {blurb && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/85">{blurb}</p>}
      <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-neutral-900 transition group-hover:gap-2.5">
        Get started
        <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  );
}
