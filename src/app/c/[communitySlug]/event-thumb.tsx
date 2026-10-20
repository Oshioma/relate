"use client";

import { useState } from "react";
import { DEFAULT_EVENT_IMAGE_URL } from "@/lib/events/default-image";

// An event's small photo for lists. Falls back to the default event photo
// when the event has none, when its image fails to load, or when it loads as
// a tracking pixel (anything 2px or smaller) — never a broken-image icon.
export function EventThumb({ src, className }: { src: string | null; className?: string }) {
  const [failed, setFailed] = useState(false);
  const url = !src || failed ? DEFAULT_EVENT_IMAGE_URL : src;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt=""
      className={className}
      onError={() => setFailed(true)}
      onLoad={(e) => {
        if (e.currentTarget.naturalWidth <= 2 || e.currentTarget.naturalHeight <= 2) setFailed(true);
      }}
    />
  );
}
