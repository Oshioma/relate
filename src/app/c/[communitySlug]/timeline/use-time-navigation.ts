"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";
import { clampWindow, panWindow, zoomWindow, type TimeWindow } from "@/lib/timeline/time";

// Moving through time: drag to pan, wheel or pinch to zoom, arrow keys for the
// keyboard. Shared by the main canvas and by Compare mode's lanes so both feel
// like the same object — a lane that panned differently from the strip above it
// would read as a bug however well each behaved alone.
//
// Everything is computed in YEARS from the window it started with, never
// accumulated in pixels, so a long drag doesn't drift and a pinch that starts
// at 13 billion years wide behaves the same as one at ten years wide.

const WHEEL_SENSITIVITY = 0.0016;

export function useTimeNavigation(
  containerRef: RefObject<HTMLElement | null>,
  view: TimeWindow,
  onWindowChange: (next: TimeWindow) => void
) {
  // A drag must read the window it began with, without re-subscribing its
  // listeners every time the window moves. Written in an effect rather than in
  // render: a ref is not render output, and touching it during render is what
  // makes a component's result depend on how often it happened to re-render.
  const viewRef = useRef(view);
  useEffect(() => {
    viewRef.current = view;
  }, [view]);

  const pointers = useRef(new Map<number, { x: number }>());
  const pinch = useRef<{ distance: number; window: TimeWindow; centre: number } | null>(null);
  const drag = useRef<{ x: number; window: TimeWindow; moved: boolean } | null>(null);

  // React's synthetic wheel handler is passive, and a passive listener cannot
  // preventDefault — so without this the page scrolls underneath every zoom.
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    function handleWheel(nativeEvent: WheelEvent) {
      const el = containerRef.current;
      if (!el) return;
      nativeEvent.preventDefault();
      const rect = el.getBoundingClientRect();
      const anchor = rect.width > 0 ? (nativeEvent.clientX - rect.left) / rect.width : 0.5;

      // A trackpad's horizontal swipe is a pan; everything else is a zoom about
      // the cursor. Matching what maps do matters more here than being clever.
      if (!nativeEvent.ctrlKey && Math.abs(nativeEvent.deltaX) > Math.abs(nativeEvent.deltaY)) {
        onWindowChange(panWindow(viewRef.current, nativeEvent.deltaX / Math.max(1, rect.width)));
        return;
      }
      onWindowChange(zoomWindow(viewRef.current, Math.exp(nativeEvent.deltaY * WHEEL_SENSITIVITY), anchor));
    }

    element.addEventListener("wheel", handleWheel, { passive: false });
    return () => element.removeEventListener("wheel", handleWheel);
  }, [containerRef, onWindowChange]);

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const element = containerRef.current;
      if (!element) return;
      element.setPointerCapture?.(event.pointerId);
      pointers.current.set(event.pointerId, { x: event.clientX });

      if (pointers.current.size === 2) {
        const [a, b] = [...pointers.current.values()];
        const rect = element.getBoundingClientRect();
        pinch.current = {
          distance: Math.max(1, Math.abs(a.x - b.x)),
          window: viewRef.current,
          centre: rect.width > 0 ? ((a.x + b.x) / 2 - rect.left) / rect.width : 0.5,
        };
        drag.current = null;
      } else {
        drag.current = { x: event.clientX, window: viewRef.current, moved: false };
      }
    },
    [containerRef]
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const element = containerRef.current;
      if (!element || !pointers.current.has(event.pointerId)) return;
      pointers.current.set(event.pointerId, { x: event.clientX });

      if (pinch.current && pointers.current.size >= 2) {
        const [a, b] = [...pointers.current.values()];
        const distance = Math.max(1, Math.abs(a.x - b.x));
        // Fingers apart means zoom in, which is a NARROWER window — hence the
        // reciprocal rather than the ratio.
        onWindowChange(zoomWindow(pinch.current.window, pinch.current.distance / distance, pinch.current.centre));
        return;
      }

      if (!drag.current) return;
      const rect = element.getBoundingClientRect();
      const dx = event.clientX - drag.current.x;
      if (Math.abs(dx) > 3) drag.current.moved = true;
      const span = drag.current.window.to - drag.current.window.from;
      const shift = (-dx / Math.max(1, rect.width)) * span;
      onWindowChange(clampWindow({ from: drag.current.window.from + shift, to: drag.current.window.to + shift }));
    },
    [containerRef, onWindowChange]
  );

  const onPointerUp = useCallback((event: React.PointerEvent<HTMLElement>) => {
    pointers.current.delete(event.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    if (pointers.current.size === 0) {
      // Cleared on the next tick so the click that follows a drag can still ask
      // whether it was a drag — otherwise every pan ends by opening an event.
      const wasDragging = drag.current;
      setTimeout(() => {
        if (drag.current === wasDragging) drag.current = null;
      }, 0);
    }
  }, []);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      const step = event.shiftKey ? 0.5 : 0.15;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onWindowChange(panWindow(viewRef.current, -step));
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        onWindowChange(panWindow(viewRef.current, step));
      } else if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        onWindowChange(zoomWindow(viewRef.current, 1 / 1.6));
      } else if (event.key === "-" || event.key === "_") {
        event.preventDefault();
        onWindowChange(zoomWindow(viewRef.current, 1.6));
      }
    },
    [onWindowChange]
  );

  const onDoubleClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect || rect.width === 0) return;
      onWindowChange(zoomWindow(viewRef.current, 1 / 2.5, (event.clientX - rect.left) / rect.width));
    },
    [containerRef, onWindowChange]
  );

  /** True when the gesture that just ended was a pan, so a click can decline to also select. */
  const wasDragged = useCallback(() => Boolean(drag.current?.moved), []);

  return { onPointerDown, onPointerMove, onPointerUp, onKeyDown, onDoubleClick, wasDragged };
}
