"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { ImageLightbox } from "./image-lightbox";

// The minimal shape the carousel and lightbox need. BusinessImage satisfies it
// structurally, and accommodation maps its photo_urls onto it, so both features
// share one carousel.
export type CarouselImage = { id: string; url: string; position: string | null };

// A lightweight, dependency-free photo carousel: a horizontal scroll-snap track
// you can swipe or drag, with prev/next arrows, dot indicators, a photo counter
// and arrow-key support. Keeping it hand-rolled matches the rest of the app,
// which pulls in no carousel library.
export function ImageCarousel({ images, alt }: { images: CarouselImage[]; alt: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
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

  // Follow the carousel with the strip: swiping the main image should bring the
  // matching thumbnail into view rather than leaving the highlight off-screen.
  // "nearest" everywhere so this never scrolls the page itself.
  useEffect(() => {
    const thumb = stripRef.current?.children[index];
    thumb?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
  }, [index]);

  function scrollTo(next: number) {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(count - 1, next));
    track.scrollTo({ left: clamped * track.clientWidth, behavior: "smooth" });
    setIndex(clamped);
  }

  if (count === 0) return null;

  return (
    <div className="w-full">
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
            <button
              key={image.id}
              type="button"
              onClick={() => {
                setIndex(i);
                setLightbox(true);
              }}
              aria-label="Open photo full screen"
              className="aspect-[16/10] w-full shrink-0 cursor-zoom-in snap-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt={count > 1 ? `${alt} — photo ${i + 1} of ${count}` : alt}
                className="h-full w-full object-cover"
                style={{ objectPosition: image.position ?? "50% 50%" }}
                draggable={false}
              />
            </button>
          ))}
        </div>

        <span className="pointer-events-none absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/45 px-2 py-0.5 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
          <Expand className="h-3 w-3" /> Click to expand
        </span>

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

      {/* Thumbnail strip. The arrows and dots only hint that more photos exist;
          showing them outright is what makes a gallery worth scrolling through,
          so every photo gets a tappable thumbnail under the main image. */}
      {count > 1 && (
        <div
          ref={stripRef}
          aria-label={`${alt} thumbnails`}
          className="flex gap-2 overflow-x-auto px-3 py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((image, i) => (
            <button
              key={image.id}
              type="button"
              onClick={() => scrollTo(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === index}
              className={`h-20 w-28 shrink-0 overflow-hidden rounded-md border transition sm:h-24 sm:w-36 ${
                i === index ? "border-accent opacity-100 ring-1 ring-accent" : "border-border opacity-70 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt=""
                className="h-full w-full object-cover"
                style={{ objectPosition: image.position ?? "50% 50%" }}
                draggable={false}
              />
            </button>
          ))}
        </div>
      )}

      {lightbox && <ImageLightbox images={images} startIndex={index} alt={alt} onClose={() => setLightbox(false)} />}
    </div>
  );
}
