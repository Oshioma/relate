"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Maximize2, Minus, Plus, RotateCcw, X } from "lucide-react";

// LOOK AT THE ACTUAL ARTEFACT.
//
// A thumbnail opens full-screen, where it can be zoomed (buttons, wheel, pinch
// or double-click) and dragged. The caption and provenance stay on screen the
// whole time — a manuscript photo with its credit scrolled away is a picture
// with no provenance. Optional `aside` content (the translation) sits beside
// the image on a wide screen and below it on a phone, so a reader can follow
// the words on the papyrus and the words in English together.

export type ViewerImage = {
  url: string;
  caption: string;
  credit?: string | null;
  sourcePageUrl?: string | null;
  meta?: string[];
};

const MIN = 1;
const MAX = 8;

export function ZoomableImage({ image, aside, thumbClassName }: { image: ViewerImage; aside?: React.ReactNode; thumbClassName?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          thumbClassName ??
          "group relative block w-full overflow-hidden rounded-lg border border-border bg-muted focus:outline-none focus:ring-2 focus:ring-accent"
        }
        aria-label={`Open the image full-screen: ${image.caption}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- remote archive images; see event-detail.tsx */}
        <img src={image.url} alt={image.caption} loading="lazy" className="max-h-80 w-full object-contain" />
        <span className="absolute right-2 top-2 rounded-md bg-background/85 p-1.5 text-foreground opacity-80 group-hover:opacity-100">
          <Maximize2 className="h-4 w-4" />
        </span>
      </button>
      {open && <Viewer image={image} aside={aside} onClose={() => setOpen(false)} />}
    </>
  );
}

function Viewer({ image, aside, onClose }: { image: ViewerImage; aside?: React.ReactNode; onClose: () => void }) {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ distance: number; scale: number } | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const zoomTo = useCallback((next: number) => {
    const clamped = Math.min(MAX, Math.max(MIN, next));
    setScale(clamped);
    if (clamped === 1) setOffset({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "+" || event.key === "=") setScale((s) => Math.min(MAX, s * 1.5));
      if (event.key === "-") setScale((s) => Math.max(MIN, s / 1.5));
    };
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  return (
    <div role="dialog" aria-modal="true" aria-label={image.caption} className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-sm lg:flex-row">
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div
          className="flex h-full w-full touch-none select-none items-center justify-center"
          style={{ cursor: scale > 1 ? "grab" : "zoom-in" }}
          onWheel={(event) => zoomTo(scale * (event.deltaY < 0 ? 1.15 : 1 / 1.15))}
          onDoubleClick={() => zoomTo(scale > 1 ? 1 : 2.5)}
          onPointerDown={(event) => {
            (event.target as HTMLElement).setPointerCapture?.(event.pointerId);
            pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
            if (pointers.current.size === 2) {
              const [a, b] = [...pointers.current.values()];
              pinch.current = { distance: Math.hypot(a.x - b.x, a.y - b.y), scale };
              drag.current = null;
            } else {
              drag.current = { x: event.clientX, y: event.clientY, ox: offset.x, oy: offset.y };
              setDragging(true);
            }
          }}
          onPointerMove={(event) => {
            if (!pointers.current.has(event.pointerId)) return;
            pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
            if (pinch.current && pointers.current.size === 2) {
              const [a, b] = [...pointers.current.values()];
              zoomTo((pinch.current.scale * Math.hypot(a.x - b.x, a.y - b.y)) / pinch.current.distance);
              return;
            }
            if (drag.current && scale > 1) {
              setOffset({ x: drag.current.ox + event.clientX - drag.current.x, y: drag.current.oy + event.clientY - drag.current.y });
            }
          }}
          onPointerUp={(event) => {
            pointers.current.delete(event.pointerId);
            if (pointers.current.size < 2) pinch.current = null;
            drag.current = null;
            setDragging(false);
          }}
          onPointerCancel={(event) => {
            pointers.current.delete(event.pointerId);
            pinch.current = null;
            drag.current = null;
            setDragging(false);
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- remote archive images; see event-detail.tsx */}
          <img
            src={image.url}
            alt={image.caption}
            draggable={false}
            className="max-h-full max-w-full object-contain"
            style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`, transition: dragging ? "none" : "transform 80ms" }}
          />
        </div>
        <div className="absolute left-3 top-3 flex gap-1.5">
          <button type="button" onClick={() => zoomTo(scale * 1.5)} className="rounded-md border border-border bg-card p-2 text-foreground" aria-label="Zoom in">
            <Plus className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => zoomTo(scale / 1.5)} className="rounded-md border border-border bg-card p-2 text-foreground" aria-label="Zoom out">
            <Minus className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => zoomTo(1)} className="rounded-md border border-border bg-card p-2 text-foreground" aria-label="Reset zoom">
            <RotateCcw className="h-4 w-4" />
          </button>
          <span className="self-center rounded-md bg-card/80 px-2 py-1 text-xs tabular-nums text-muted-foreground">{Math.round(scale * 100)}%</span>
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-md border border-border bg-card p-2 text-foreground"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <aside className="max-h-[45vh] shrink-0 overflow-y-auto border-t border-border bg-card p-4 text-sm lg:max-h-none lg:w-[26rem] lg:border-l lg:border-t-0">
        <p className="text-foreground">{image.caption}</p>
        {image.meta?.map((line) => (
          <p key={line} className="mt-1 text-xs text-muted-foreground">
            {line}
          </p>
        ))}
        {image.credit && <p className="mt-1 text-xs text-muted-foreground">{image.credit}</p>}
        {image.sourcePageUrl && (
          <a href={image.sourcePageUrl} target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs text-accent hover:underline">
            Catalogue or file page, with the licence
          </a>
        )}
        {aside && <div className="mt-4 border-t border-border pt-4">{aside}</div>}
      </aside>
    </div>
  );
}
