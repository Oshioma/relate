"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, ImageOff, X } from "lucide-react";
import type { GuidePhoto } from "@/lib/guides/where-to-stay/types";
import { commonsSrcSet } from "./guide-image";
import { PhotoCredit } from "./photo-credit";

// Full-screen photo viewer for a guide's galleries (a hotel's photos, a
// destination's photos). <PhotoGallery> holds one set of photos; every
// <PhotoOpener> inside it opens the viewer at its photo, and the arrows (or
// arrow keys, or a swipe) step through the whole set, wrapping at the ends.
// Area photos keep their "The area, not the hotel" label in the viewer too.

export type ViewerPhoto = GuidePhoto & { area?: boolean };

const OpenContext = createContext<((index: number, from: HTMLElement) => void) | null>(null);

export function PhotoGallery({ photos, title, children }: { photos: ViewerPhoto[]; title: string; children: React.ReactNode }) {
  const [index, setIndex] = useState<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const open = useCallback((i: number, from: HTMLElement) => {
    opener.current = from;
    setIndex(i);
  }, []);
  const close = useCallback(() => {
    setIndex(null);
    opener.current?.focus();
  }, []);

  return (
    <OpenContext.Provider value={photos.length > 0 ? open : null}>
      {children}
      {index !== null && <PhotoViewer photos={photos} title={title} start={index} onClose={close} />}
    </OpenContext.Provider>
  );
}

// An invisible button laid over a photo (its parent must be `relative`), so
// the photo itself stays a plain image and only gains a click target.
export function PhotoOpener({ index, alt }: { index: number; alt: string }) {
  const open = useContext(OpenContext);
  if (!open) return null;
  return (
    <button
      type="button"
      onClick={(e) => open(index, e.currentTarget)}
      aria-label={`View larger: ${alt}`}
      className="absolute inset-0 z-[1] cursor-zoom-in rounded-[inherit] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    />
  );
}

function PhotoViewer({ photos, title, start, onClose }: { photos: ViewerPhoto[]; title: string; start: number; onClose: () => void }) {
  const count = photos.length;
  const [index, setIndex] = useState(Math.min(Math.max(start, 0), count - 1));
  const [failed, setFailed] = useState<Set<string>>(() => new Set());
  const closeButton = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);

  const step = useCallback((by: number) => setIndex((i) => (i + by + count) % count), [count]);

  useEffect(() => {
    closeButton.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    }
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose, step]);

  // Warm the neighbours so the arrows feel instant.
  useEffect(() => {
    if (count < 2) return;
    for (const i of [(index + 1) % count, (index - 1 + count) % count]) {
      const { src, srcSet } = commonsSrcSet(photos[i].src, photos[i].width);
      const img = new Image();
      if (srcSet) {
        img.sizes = "100vw";
        img.srcset = srcSet;
      }
      img.src = src;
    }
  }, [index, count, photos]);

  const photo = photos[index];
  const { src, srcSet } = commonsSrcSet(photo.src, photo.width);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} photos`}
      className="fixed inset-0 z-[100] flex flex-col bg-black text-white"
      onClick={onClose}
      onTouchStart={(e) => {
        touchX.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        const from = touchX.current;
        const to = e.changedTouches[0]?.clientX;
        touchX.current = null;
        if (from === null || to === undefined || count < 2) return;
        if (Math.abs(to - from) > 50) step(to < from ? 1 : -1);
      }}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3" onClick={(e) => e.stopPropagation()}>
        <p className="min-w-0 truncate text-sm font-medium">
          {title}
          {count > 1 && (
            <span className="ml-2 text-white/70" aria-live="polite">
              {index + 1} / {count}
            </span>
          )}
        </p>
        <button ref={closeButton} type="button" onClick={onClose} aria-label="Close" className="rounded-full bg-white/10 p-2 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-16">
        {failed.has(photo.src) ? (
          <div className="flex flex-col items-center gap-2 text-white/70" onClick={(e) => e.stopPropagation()}>
            <ImageOff className="h-8 w-8" aria-hidden />
            <p className="text-sm">This photo couldn&apos;t be loaded.</p>
          </div>
        ) : (
          <div className="relative max-h-full" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element -- same right-sized sources as GuideImage */}
            <img
              key={photo.src}
              src={src}
              srcSet={srcSet}
              sizes={srcSet ? "100vw" : undefined}
              alt={photo.alt}
              referrerPolicy="no-referrer"
              onError={() => setFailed((f) => new Set(f).add(photo.src))}
              className="max-h-[calc(100dvh-11rem)] w-auto max-w-full rounded object-contain"
            />
            {photo.area && <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-0.5 text-[11px] font-semibold">The area, not the hotel</span>}
          </div>
        )}

        {count > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={(e) => {
                e.stopPropagation();
                step(-1);
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2.5 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-4"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={(e) => {
                e.stopPropagation();
                step(1);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2.5 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-4"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      <p className="mx-auto max-w-3xl px-4 pb-5 pt-3 text-center text-xs leading-snug text-white/80" onClick={(e) => e.stopPropagation()}>
        <PhotoCredit photo={photo} />
      </p>
    </div>,
    document.body
  );
}
