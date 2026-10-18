"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { photoObjectPosition } from "@/lib/photo-position";

export interface CategorySlide {
  href: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  imagePosition?: string | null;
}

// A space card that is really several: a directory's featured categories
// (Taxis, Restaurants, Fundis…) one at a time, each with a real listing's
// photo, and dots along the foot to move between them. It advances on its own
// every few seconds until someone hovers, focuses or swipes it — and never on
// its own for anyone who has asked for reduced motion.
export function CategoryCarouselCard({ slides, icon }: { slides: CategorySlide[]; icon: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((i: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: i * track.clientWidth, behavior: "smooth" });
  }, []);

  // The track scrolls (swipe, trackpad or goTo); the dots follow it.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => setIndex(Math.round(track.scrollLeft / Math.max(track.clientWidth, 1)));
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => goTo((index + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, [paused, index, slides.length, goTo]);

  const current = slides[Math.min(index, slides.length - 1)];

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_-12px_rgba(0,0,0,0.18)] ring-1 ring-black/5 transition-shadow hover:shadow-[0_2px_6px_rgba(0,0,0,0.08),0_16px_32px_-12px_rgba(0,0,0,0.25)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
    >
      <div
        ref={trackRef}
        className="flex flex-1 snap-x snap-mandatory overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide, i) => (
          <Link
            key={slide.href}
            href={slide.href}
            aria-hidden={i !== index}
            tabIndex={i === index ? 0 : -1}
            className="flex w-full shrink-0 snap-start flex-col"
          >
            <span className="relative block aspect-[4/3] w-full overflow-hidden bg-accent-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.imageUrl}
                alt=""
                className="h-full w-full object-cover"
                style={{ objectPosition: photoObjectPosition(slide.imagePosition) }}
              />
            </span>
            <span className="relative -mt-4 flex flex-1 flex-col rounded-t-2xl bg-card px-4 pb-14 pt-4">
              <span className="flex gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground [&_svg]:h-[18px] [&_svg]:w-[18px]">
                  {icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-semibold leading-tight text-foreground">{slide.title}</span>
                  <span className="mt-1.5 line-clamp-3 block text-[13px] leading-relaxed text-muted-foreground">
                    {slide.subtitle}
                  </span>
                </span>
              </span>
            </span>
          </Link>
        ))}
      </div>

      {/* Dots and the arrow sit over the panel's foot, outside the slides, so
          they stay put while the slides move beneath them. */}
      <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-center justify-between">
        <div className="pointer-events-auto flex items-center gap-1.5" role="tablist" aria-label="Categories">
          {slides.map((slide, i) => (
            <button
              key={slide.href}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={slide.title}
              onClick={() => goTo(i)}
              className={cn(
                "h-2 rounded-full transition-all",
                i === index ? "w-5 bg-accent" : "w-2 bg-accent/25 hover:bg-accent/50"
              )}
            />
          ))}
        </div>
        <Link
          href={current.href}
          aria-label={`Open ${current.title}`}
          className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
