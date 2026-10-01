"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// An <img> that never shows as broken.
//
// Pictures here come from third-party catalogues (Openverse, Wikimedia, the
// Met, Pexels…) and are stored as links, so one can vanish at any time — a
// deleted Flickr photo, a moved file, a thumbnail service that answers with
// JSON. The browser's broken-image icon is the worst thing to show for that.
//
// So: try each candidate link in turn (a thumbnail, then the full image), and
// when none loads, render the fallback instead — the lesson's subject icon, a
// plain tile, or nothing at all.
//
// The mount check matters. A server-rendered <img> can fail before React has
// attached onError, and then the error event is simply missed. After mount we
// look at the element itself: complete with no width means it already failed.
export function SafeImage({
  srcs,
  alt,
  className,
  loading = "lazy",
  fallback = null,
  onAllFailed,
}: {
  srcs: (string | null | undefined)[];
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  fallback?: ReactNode;
  // For a caller that wants to drop its whole frame (a captioned figure)
  // rather than show a fallback inside it.
  onAllFailed?: () => void;
}) {
  const candidates = [...new Set(srcs.filter((s): s is string => Boolean(s && s.trim())))];
  const key = candidates.join("|");
  const [state, setState] = useState({ key, index: 0 });
  const index = state.key === key ? state.index : 0;
  const ref = useRef<HTMLImageElement>(null);

  const failed = index >= candidates.length;

  function next() {
    setState({ key, index: index + 1 });
  }

  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) next();
    // Re-checked whenever the image being tried changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, index]);

  useEffect(() => {
    if (failed) onAllFailed?.();
  }, [failed, onAllFailed]);

  if (failed) return <>{fallback}</>;

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      ref={ref}
      key={candidates[index]}
      src={candidates[index]}
      alt={alt}
      loading={loading}
      className={className}
      onError={next}
    />
  );
}
