"use client";

import { useState } from "react";
import { photoObjectPosition } from "@/lib/photo-position";

// The cover image for a feed card, with a broken-image guard. A scraped or
// otherwise external cover can 404 or hotlink-block once loaded in a browser,
// and the feed card is a server component that can't catch that itself — so the
// image lives here, and on error the whole strip collapses, leaving a clean
// card that reads exactly like a feed item that never had a cover.
export function FeedItemImage({
  src,
  alt,
  position,
}: {
  src: string;
  alt: string;
  position?: string | null;
}) {
  const [broken, setBroken] = useState(false);
  if (broken) return null;
  return (
    <div className="h-40 w-full bg-muted">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        style={{ objectPosition: photoObjectPosition(position) }}
        onError={() => setBroken(true)}
      />
    </div>
  );
}
