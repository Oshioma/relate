"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";
import { panWindow, zoomWindow, type TimeScale, type TimeWindow } from "@/lib/timeline/time";
import { wheelIntent, type WheelAxis } from "@/lib/timeline/wheel-intent";

// Moving through time: drag or swipe sideways to pan, pinch or Ctrl/Cmd+wheel
// to zoom, Shift+wheel to pan, arrow keys for the keyboard. A plain vertical
// wheel is the page's, not ours — see wheel-intent.ts.
//
// Shared by the main canvas and by Compare mode's lanes so both feel like the
// same object — a lane that panned differently from the strip above it would
// read as a bug however well each behaved alone.
//
// Everything is computed in YEARS from the window it started with, never
// accumulated in pixels, so a long drag doesn't drift and a pinch that starts
// at 13 billion years wide behaves the same as one at ten years wide.

const WHEEL_GESTURE_GAP_MS = 200;

export function useTimeNavigation(
  containerRef: RefObject<HTMLElement | null>,
  view: TimeWindow,
  onWindowChange: (next: TimeWindow) => void,
  // Every gesture below moves the PICTURE, so each has to be expressed in the
  // space the picture is drawn in. On a log axis a drag that shifted a fixed
  // number of years would crawl at the deep end and bolt at the shallow one.
  scale: TimeScale = "linear"
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

  // The axis the current run of wheel events was first read on, and when the
  // last one arrived. A trackpad swipe is a stream of events with momentum
  // tail; a gap this long means the fingers lifted and a new gesture began.
  const wheelAxis = useRef<{ axis: WheelAxis; at: number } | null>(null);

  // React's synthetic wheel handler is passive, and a passive listener cannot
  // preventDefault — so this is attached natively. Only the gestures the strip
  // claims are prevented; a plain vertical scroll is left alone so the page
  // scrolls through the strip to the record, evidence and sources below it.
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    function handleWheel(nativeEvent: WheelEvent) {
      const el = containerRef.current;
      if (!el) return;

      // An uncancelable wheel event is the browser telling us this gesture is
      // already scrolling something — usually the page, which carried the
      // strip under a stationary pointer mid-scroll. Joining in would move
      // the strip AND the page with one swipe.
      if (!nativeEvent.cancelable) return;

      const now = nativeEvent.timeStamp;
      const locked = wheelAxis.current && now - wheelAxis.current.at < WHEEL_GESTURE_GAP_MS ? wheelAxis.current.axis : null;
      const intent = wheelIntent(nativeEvent, nativeEvent.ctrlKey || nativeEvent.metaKey || nativeEvent.shiftKey ? null : locked);
      if (!nativeEvent.ctrlKey && !nativeEvent.metaKey && !nativeEvent.shiftKey) {
        wheelAxis.current = { axis: locked ?? (intent.kind === "pan" ? "x" : "y"), at: now };
      }

      if (intent.kind === "page") return;
      nativeEvent.preventDefault();
      const rect = el.getBoundingClientRect();

      if (intent.kind === "pan") {
        onWindowChange(panWindow(viewRef.current, intent.pixels / Math.max(1, rect.width), scale));
        return;
      }
      // Zoom about the pointer: the date under it stays under it.
      const anchor = rect.width > 0 ? (nativeEvent.clientX - rect.left) / rect.width : 0.5;
      onWindowChange(zoomWindow(viewRef.current, intent.factor, anchor, scale));
    }

    element.addEventListener("wheel", handleWheel, { passive: false });
    return () => element.removeEventListener("wheel", handleWheel);
  }, [containerRef, onWindowChange, scale]);

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const element = containerRef.current;
      if (!element) return;
      pointers.current.set(event.pointerId, { x: event.clientX });

      if (pointers.current.size === 2) {
        const [a, b] = [...pointers.current.values()];
        const rect = element.getBoundingClientRect();
        // A second finger is unambiguously a pinch, never a tap, so capturing
        // here costs nothing and keeps the gesture alive if a finger leaves the
        // element mid-zoom.
        element.setPointerCapture?.(event.pointerId);
        pinch.current = {
          distance: Math.max(1, Math.abs(a.x - b.x)),
          window: viewRef.current,
          centre: rect.width > 0 ? ((a.x + b.x) / 2 - rect.left) / rect.width : 0.5,
        };
        drag.current = null;
      } else {
        // DELIBERATELY NOT capturing the pointer yet.
        //
        // A press on this surface is still ambiguous: it might become a pan, or
        // it might be somebody tapping an event to open it. Capturing on
        // pointerdown resolves that ambiguity the wrong way — with a capture
        // active, the browser dispatches the subsequent `click` to the CAPTURE
        // ELEMENT rather than to whatever was actually pressed, so every event
        // marker on the strip became unclickable and the detail panel could
        // only be reached from the list.
        //
        // Capture is taken in onPointerMove instead, the moment the press turns
        // into a real drag — which is the only moment it is needed, and by then
        // there is no click left to lose.
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
        onWindowChange(zoomWindow(pinch.current.window, pinch.current.distance / distance, pinch.current.centre, scale));
        return;
      }

      if (!drag.current) return;
      const rect = element.getBoundingClientRect();
      const dx = event.clientX - drag.current.x;
      if (Math.abs(dx) > 3 && !drag.current.moved) {
        drag.current.moved = true;
        // Now it is a drag. Capture so the pan survives the pointer leaving the
        // strip — and only now, so a tap keeps its click (see onPointerDown).
        element.setPointerCapture?.(event.pointerId);
      }
      onWindowChange(panWindow(drag.current.window, -dx / Math.max(1, rect.width), scale));
    },
    [containerRef, onWindowChange, scale]
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
        onWindowChange(panWindow(viewRef.current, -step, scale));
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        onWindowChange(panWindow(viewRef.current, step, scale));
      } else if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        onWindowChange(zoomWindow(viewRef.current, 1 / 1.6, 0.5, scale));
      } else if (event.key === "-" || event.key === "_") {
        event.preventDefault();
        onWindowChange(zoomWindow(viewRef.current, 1.6, 0.5, scale));
      }
    },
    [onWindowChange, scale]
  );

  const onDoubleClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect || rect.width === 0) return;
      onWindowChange(zoomWindow(viewRef.current, 1 / 2.5, (event.clientX - rect.left) / rect.width, scale));
    },
    [containerRef, onWindowChange, scale]
  );

  /** True when the gesture that just ended was a pan, so a click can decline to also select. */
  const wasDragged = useCallback(() => Boolean(drag.current?.moved), []);

  return { onPointerDown, onPointerMove, onPointerUp, onKeyDown, onDoubleClick, wasDragged };
}
