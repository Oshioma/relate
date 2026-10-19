"use client";

import { useEffect, useRef, useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  pictureComparisonFor,
  picturesShowing,
  wheelZoomFactor,
  type PictureReading,
} from "@/lib/timeline/picture-comparisons";

// COMPARE PICTURES, ONE FEATURE AT A TIME.
//
// The record's own gallery still follows; this panel only appears on records
// that have a comparison written for them (see picture-comparisons.ts). Each
// feature is a button with a count of the pictures it can be seen in; a
// feature no picture shows is greyed out, so nobody has to press it to find
// out there is nothing there. Pressing a picture opens it full screen, where
// it zooms with the wheel, a trackpad or the buttons, and drags to pan.

type MediaItem = { url: string; caption?: string; credit?: string; fileName?: string; sourcePageUrl?: string };

function Markers({ reading, large = false }: { reading: PictureReading; large?: boolean }) {
  if (reading.notVisible) return null;
  return (
    <>
      {(reading.points ?? []).map(([x, y], index) => (
        <span
          key={`${x}-${y}`}
          aria-hidden
          className={cn(
            "pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-danger text-center font-mono font-semibold text-danger-foreground shadow-[0_0_0_3px_rgba(0,0,0,0.25)]",
            large ? "h-7 w-7 text-xs leading-7" : "h-6 w-6 text-xs leading-6"
          )}
          style={{ left: `${x}%`, top: `${y}%` }}
        >
          {index + 1}
        </span>
      ))}
    </>
  );
}

export function PictureComparison({ eventSlug, media }: { eventSlug: string; media: MediaItem[] }) {
  const comparison = pictureComparisonFor(eventSlug);
  const [current, setCurrent] = useState(() => {
    if (!comparison) return 0;
    const first = comparison.features.findIndex((_, index) => picturesShowing(comparison, index) > 0);
    return Math.max(0, first);
  });
  const [zoomed, setZoomed] = useState<number | null>(null);

  if (!comparison) return null;
  const byFile = new Map(media.filter((item) => item.fileName).map((item) => [item.fileName!, item]));
  const columns = comparison.columns
    .map((column) => ({ ...column, item: byFile.get(column.fileName) }))
    .filter((column): column is typeof column & { item: MediaItem } => Boolean(column.item));
  // Without every picture there is no comparison to draw; the gallery below still shows what there is.
  if (columns.length < comparison.columns.length) return null;

  const feature = comparison.features[current];
  const counts = comparison.features.map((_, index) => picturesShowing(comparison, index));

  const step = (direction: 1 | -1) => {
    let next = current;
    for (let tries = 0; tries < comparison.features.length; tries++) {
      next = (next + direction + comparison.features.length) % comparison.features.length;
      if (counts[next] > 0) break;
    }
    setCurrent(next);
  };

  return (
    <section className="mt-5 rounded-xl border border-border bg-card p-4 sm:p-5" aria-labelledby="compare-pictures-title">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="compare-pictures-title" className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Compare pictures
        </h2>
        <p className="max-w-xl text-xs text-muted-foreground">
          Each button says in how many pictures the feature can be seen. Grey means none of them shows it.
        </p>
      </div>

      <div
        role="toolbar"
        aria-label="Feature to compare"
        className="mt-3 flex flex-wrap gap-1.5"
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") step(1);
          else if (event.key === "ArrowLeft") step(-1);
        }}
      >
        {comparison.features.map((item, index) => (
          <button
            key={item.label}
            type="button"
            disabled={counts[index] === 0}
            aria-pressed={index === current}
            title={counts[index] === 0 ? "Not seen in any of the pictures" : undefined}
            onClick={() => setCurrent(index)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
              index === current
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border bg-background text-foreground hover:bg-muted",
              "disabled:cursor-not-allowed disabled:border-muted disabled:bg-muted disabled:text-muted-foreground disabled:opacity-70"
            )}
          >
            {item.label}
            <span className="ml-1.5 font-mono text-[11px] opacity-75">
              {counts[index]} of {comparison.columns.length}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {columns.map((column, index) => {
          const reading = feature.readings[column.fileName];
          return (
            <div key={column.fileName} className="grid min-w-0 content-start gap-2">
              <div>
                <h3 className="text-sm font-semibold">{column.title}</h3>
                <p className="font-mono text-xs text-muted-foreground">{column.meta}</p>
              </div>
              <div className="relative overflow-hidden rounded-lg bg-muted">
                <button
                  type="button"
                  onClick={() => setZoomed(index)}
                  aria-label={`Open ${column.title} full screen`}
                  className="block w-full cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={column.item.url} alt={column.item.caption ?? column.title} loading="lazy" className="block h-auto w-full" />
                </button>
                <Markers reading={reading} />
              </div>
              <p className={cn("text-sm", reading.notVisible && "italic text-muted-foreground")}>{reading.text}</p>
              <p className="break-words text-[11px] leading-snug text-muted-foreground">
                {column.item.credit}
                {column.item.sourcePageUrl && (
                  <>
                    {column.item.credit ? " · " : ""}
                    <a href={column.item.sourcePageUrl} target="_blank" rel="noopener noreferrer" className="underline">
                      Open the original
                    </a>
                  </>
                )}
              </p>
            </div>
          );
        })}
      </div>

      {zoomed !== null && (
        <ZoomView
          title={`${columns[zoomed].title} · ${feature.label}`}
          src={columns[zoomed].item.url}
          alt={columns[zoomed].item.caption ?? columns[zoomed].title}
          reading={feature.readings[columns[zoomed].fileName]}
          onClose={() => setZoomed(null)}
        />
      )}
    </section>
  );
}

function ZoomView({ title, src, alt, reading, onClose }: { title: string; src: string; alt: string; reading: PictureReading; onClose: () => void }) {
  const stage = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  // Scale and the offset of the picture's top-left corner from the stage's centre.
  const [view, setView] = useState({ scale: 1, x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number } | null>(null);

  const fit = () => {
    const box = stage.current, img = image.current;
    if (!box || !img || !img.naturalWidth) return;
    const scale = Math.min(box.clientWidth / img.naturalWidth, box.clientHeight / img.naturalHeight) * 0.95;
    setView({ scale, x: (-img.naturalWidth * scale) / 2, y: (-img.naturalHeight * scale) / 2 });
  };

  // Zoom about the stage's centre, so what is in the middle stays there.
  const zoomBy = (factor: number) =>
    setView((v) => {
      const scale = Math.min(8, Math.max(0.1, v.scale * factor));
      const k = scale / v.scale;
      return { scale, x: v.x * k, y: v.y * k };
    });

  useEffect(() => {
    closeButton.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    // A wheel listener has to be non-passive to stop the page scrolling under the picture.
    const box = stage.current;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      zoomBy(wheelZoomFactor(event.deltaY, event.deltaMode));
    };
    box?.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      document.removeEventListener("keydown", onKey);
      box?.removeEventListener("wheel", onWheel);
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 grid grid-rows-[auto_1fr] bg-black/90 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
    >
      <div className="flex items-center justify-between gap-2 px-4 py-2.5 text-sm text-white">
        <span className="min-w-0 truncate">{title}</span>
        <div className="flex gap-1.5">
          <button type="button" onClick={() => zoomBy(1.4)} className="rounded-md border border-white/30 bg-white/10 p-1.5" aria-label="Zoom in">
            <Plus className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => zoomBy(1 / 1.4)} className="rounded-md border border-white/30 bg-white/10 p-1.5" aria-label="Zoom out">
            <Minus className="h-4 w-4" />
          </button>
          <button ref={closeButton} type="button" onClick={onClose} className="rounded-md border border-white/30 bg-white/10 p-1.5" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div
        ref={stage}
        className="relative cursor-grab touch-none overflow-hidden active:cursor-grabbing"
        onPointerDown={(event) => {
          drag.current = { x: event.clientX - view.x, y: event.clientY - view.y };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (!drag.current) return;
          const start = drag.current;
          setView((v) => ({ ...v, x: event.clientX - start.x, y: event.clientY - start.y }));
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
      >
        <div
          className="absolute left-1/2 top-1/2 origin-top-left"
          style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={image} src={src} alt={alt} onLoad={fit} draggable={false} className="block max-w-none select-none" />
          <Markers reading={reading} large />
        </div>
      </div>
    </div>
  );
}
