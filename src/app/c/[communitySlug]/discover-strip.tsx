"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

export interface DiscoverShortcut {
  href: string;
  label: string;
  icon: ReactNode;
  /** Optional one-word qualifier, e.g. the parent space for a category. */
  hint?: string | null;
  /** Featured categories render with an accent tint to stand out from spaces. */
  accent?: boolean;
  /** A space's cover image. When set, the tile leads with the photo and the
   *  icon becomes a small overlaid badge; otherwise it falls back to the icon. */
  imageUrl?: string | null;
}

/**
 * A horizontally-scrollable row of shortcut tiles surfaced at the top of the
 * community feed on mobile. Mobile has no sidebar (it's `hidden md:flex`), so
 * without this a visitor can't tell a Business Directory, Restaurants,
 * Marketplace etc. even exist until they drill Spaces → space → filter. This
 * puts every destination one tap away, right where they land. Hidden from `md`
 * up, where the sidebar already does this job.
 *
 * The scrollbar is hidden (it reads as clutter on a phone, and iOS doesn't draw
 * one at rest anyway), which left the row looking like a static, complete list —
 * people never discovered the destinations parked off the right edge. Three cues
 * fix that, all driven by where the track is actually scrolled: a "Swipe" hint
 * beside the heading, tap targets on either edge, and a fade that cuts the tiles
 * off mid-shape so the row visibly continues past the viewport.
 */
export function DiscoverStrip({ title, shortcuts, allHref }: { title: string; shortcuts: DiscoverShortcut[]; allHref: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  // Both default to "nothing more that way" so the server render and the first
  // client paint agree, and no arrow flashes on a row that isn't overflowing.
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    // A pixel of slack: fractional layout widths mean scrollLeft rarely lands
    // exactly on 0 or on the maximum.
    const max = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft >= max - 1);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    // Rotating the phone (or the address bar collapsing) changes how much of the
    // row fits, which changes whether there's anything left to scroll to.
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", measure);
      observer.disconnect();
    };
  }, [measure]);

  const nudge = useCallback((direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    // Just under a full viewport, so the tile you were looking at stays partly
    // in frame and the jump reads as continuous.
    el.scrollBy({ left: direction * Math.round(el.clientWidth * 0.8), behavior: "smooth" });
  }, []);

  if (shortcuts.length === 0) return null;

  // Fading the tiles themselves (rather than laying a coloured gradient over
  // them) keeps this correct on any background, in either theme.
  const maskImage = `linear-gradient(to right, ${atStart ? "#000 0" : "transparent 0, #000 32px"}, ${
    atEnd ? "#000 100%" : "#000 calc(100% - 48px), transparent 100%"
  })`;

  return (
    <section className="border-b border-border bg-muted/20 md:hidden">
      <div className="flex items-center justify-between gap-3 px-4 pt-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>
        {/* Decorative twin of the edge arrows — hidden from screen readers, which
            get the whole row as links regardless of scroll position. */}
        {!atEnd && (
          <span aria-hidden="true" className="flex shrink-0 items-center gap-0.5 text-[11px] font-medium text-muted-foreground">
            Swipe
            <ChevronRight className="swipe-nudge h-3.5 w-3.5" />
          </span>
        )}
      </div>
      <div className="relative">
        <div
          ref={trackRef}
          style={{ maskImage, WebkitMaskImage: maskImage }}
          // `scroll-px-4` matches the track's own padding: without it the snap
          // points sit at each tile's edge, so the browser snaps the row 16px in
          // on load — clipping the first tile and lighting up the back arrow on a
          // row nobody has scrolled yet.
          className="flex snap-x gap-2.5 overflow-x-auto scroll-px-4 scroll-smooth px-4 pb-4 pt-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {shortcuts.map((s, i) =>
            s.imageUrl ? (
              // Cover-art tile: photo band with the type icon as a small badge.
              <Link
                key={`${s.href}-${i}`}
                href={s.href}
                className="group flex w-[128px] shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-sm active:scale-[0.98]"
              >
                <span className="relative block h-[72px] w-full bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.imageUrl} alt="" className="h-full w-full object-cover" />
                  <span className="absolute left-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-lg bg-card/85 text-foreground backdrop-blur-sm [&_svg]:h-4 [&_svg]:w-4">
                    {s.icon}
                  </span>
                </span>
                <span className="min-w-0 p-2.5">
                  <span className="line-clamp-2 text-[13px] font-semibold leading-tight text-foreground">{s.label}</span>
                  {s.hint && <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">{s.hint}</span>}
                </span>
              </Link>
            ) : (
              // Icon tile: fallback when a space has no cover, and for categories.
              <Link
                key={`${s.href}-${i}`}
                href={s.href}
                className="group flex w-[112px] shrink-0 snap-start flex-col gap-2 rounded-xl border border-border bg-card p-3 transition-colors hover:border-accent/40 hover:bg-accent-soft/40 active:scale-[0.98]"
              >
                <span
                  className={
                    s.accent
                      ? "flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent"
                      : "flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-foreground/70"
                  }
                >
                  {s.icon}
                </span>
                <span className="min-w-0">
                  <span className="line-clamp-2 text-[13px] font-semibold leading-tight text-foreground">{s.label}</span>
                  {s.hint && <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">{s.hint}</span>}
                </span>
              </Link>
            )
          )}
          <Link
            href={allHref}
            className="flex w-[72px] shrink-0 snap-start flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-border text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent"
          >
            <ChevronRight className="h-5 w-5" />
            <span className="text-[11px] font-medium">All</span>
          </Link>
        </div>

        {/* Edge arrows: a tap target for anyone who doesn't think to swipe, and a
            second static signal that the row runs past the edge. */}
        {!atStart && (
          <button
            type="button"
            onClick={() => nudge(-1)}
            aria-label="Scroll shortcuts left"
            className="absolute left-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/95 text-foreground shadow-md backdrop-blur transition active:scale-95"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        {!atEnd && (
          <button
            type="button"
            onClick={() => nudge(1)}
            aria-label="Scroll shortcuts right"
            className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/95 text-foreground shadow-md backdrop-blur transition active:scale-95"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>
    </section>
  );
}
