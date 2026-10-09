"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { Pause, Play } from "lucide-react";

// The muted clip that loops behind the feed hero's headline, over the cover
// photo. Only mounted where it's worth the bandwidth and won't bother anyone:
// a screen at least `md` wide, and no "reduce motion" preference. Everywhere
// else (phones, reduced motion, the server render) the cover photo underneath
// is the hero, unchanged — the video never even starts downloading.
//
// A pause button sits in the corner: moving content that runs for more than a
// few seconds has to be stoppable (WCAG 2.2.2).

const QUERY = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

export function HeroBackgroundVideo({
  src,
  poster,
  layerClassName = "-z-20",
}: {
  src: string;
  poster: string | null;
  // Where the video sits in the hero's stack. The feed hero layers by z-index
  // (cover at -z-20, scrim at -z-10); the landing pages stack by DOM order, so
  // they pass "" and place it between the photo and the gradient.
  layerClassName?: string;
}) {
  const show = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  );
  const ref = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);

  if (!show) return null;

  function toggle() {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
      setPaused(false);
    } else {
      video.pause();
      setPaused(true);
    }
  }

  return (
    <>
      <video
        ref={ref}
        src={src}
        poster={poster ?? undefined}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full object-cover ${layerClassName}`}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={paused ? "Play background video" : "Pause background video"}
        className="absolute bottom-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white/90 backdrop-blur-sm transition hover:bg-black/60"
      >
        {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
      </button>
    </>
  );
}
