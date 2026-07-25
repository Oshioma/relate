"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { BusinessImage } from "@/types/database";

// A lightweight, dependency-free photo carousel: a horizontal scroll-snap track
// you can swipe or drag, with prev/next arrows, dot indicators, a photo counter
// and arrow-key support. Keeping it hand-rolled matches the rest of the app,
// which pulls in no carousel library.
export function ImageCarousel({ images, alt }: { images: BusinessImage[]; alt: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const count = images.length;

  // Keep the active dot/counter in sync with wherever the user scrolls to.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    function onScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = trackRef.current;
        if (!el) return;
        const width = el.clientWidth || 1;
        setIndex(Math.round(el.scrollLeft / width));
      });
    }
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  function scrollTo(next: number) {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(count - 1, next));
    track.scrollTo({ left: clamped * track.clientWidth, behavior: "smooth" });
    setIndex(clamped);
  }

  if (count === 0) return null;

  return (
    <div
      className="group relative w-full overflow-hidden rounded-lg bg-muted"
      role="region"
      aria-roledescription="carousel"
      aria-label={`${alt} photos`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          scrollTo(index + 1);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          scrollTo(index - 1);
        }
      }}
    >
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((image, i) => (
          <div key={image.id} className="aspect-[16/10] w-full shrink-0 snap-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.url}
              alt={count > 1 ? `${alt} — photo ${i + 1} of ${count}` : alt}
              className="h-full w-full object-cover"
              style={{ objectPosition: image.position ?? "50% 50%" }}
              draggable={false}
            />
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={() => scrollTo(index - 1)}
            disabled={index === 0}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/45 p-1.5 text-white opacity-0 transition group-hover:opacity-100 focus-visible:opacity-100 disabled:cursor-default disabled:opacity-0 hover:bg-black/65"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={() => scrollTo(index + 1)}
            disabled={index === count - 1}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/45 p-1.5 text-white opacity-0 transition group-hover:opacity-100 focus-visible:opacity-100 disabled:cursor-default disabled:opacity-0 hover:bg-black/65"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute right-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-xs font-medium text-white">
            {index + 1} / {count}
          </div>

          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((image, i) => (
              <button
                key={image.id}
                type="button"
                aria-label={`Go to photo ${i + 1}`}
                aria-current={i === index}
                onClick={() => scrollTo(i)}
                className={`h-1.5 rounded-full transition-all ${i === index ? "w-4 bg-white" : "w-1.5 bg-white/60 hover:bg-white/80"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
