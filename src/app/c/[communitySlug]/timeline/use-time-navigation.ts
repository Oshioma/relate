"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";
import { panWindow, zoomWindow, type TimeScale, type TimeWindow } from "@/lib/timeline/time";
import { fingerDistance, pinchWindow, type PinchStart } from "@/lib/timeline/pinch";
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

  const pointers = useRef(new Set<number>());
  const drag = useRef<{ x: number; window: TimeWindow; moved: boolean } | null>(null);
  // A two-finger touch in progress, and whether one has happened since the
  // last time every finger was lifted. The second matters at the END of a
  // pinch: the finger still down would otherwise resume the one-finger pan it
  // started before the pinch, from the window it started with, and the strip
  // would leap back.
  const pinch = useRef<PinchStart | null>(null);
  const pinchedSinceLift = useRef(false);

  // TOUCH PINCH, ON TOUCH EVENTS RATHER THAN POINTER EVENTS.
  //
  // The strip is touch-pan-y so the browser keeps vertical swipes for the page
  // (see timeline-canvas.tsx). Pointer events cannot overrule that: once the
  // browser reads two fingers moving as a vertical pan it cancels both
  // pointers, and a pinch whose fingers happen to sit one above the other is
  // exactly that. A non-passive touchmove CAN overrule it — preventDefault on
  // a two-finger move stops the browser scrolling or zooming the page — so the
  // pinch lives here, and pointer events keep the one-finger pan and the mouse.
  //
  // Measured as a straight-line distance, not a horizontal one: fingers placed
  // one above the other are still a pinch, and a horizontal-only distance read
  // them as touching and zoomed by a factor of a hundred.
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const fingers = (event: TouchEvent) => {
      const rect = element.getBoundingClientRect();
      const [a, b] = [event.touches[0], event.touches[1]];
      const pa = { x: a.clientX, y: a.clientY };
      const pb = { x: b.clientX, y: b.clientY };
      const midX = (pa.x + pb.x) / 2;
      return {
        distance: fingerDistance(pa, pb),
        anchor: rect.width > 0 ? Math.max(0, Math.min(1, (midX - rect.left) / rect.width)) : 0.5,
      };
    };

    function handleTouchStart(event: TouchEvent) {
      if (event.touches.length !== 2) return;
      const { distance, anchor } = fingers(event);
      pinch.current = { window: viewRef.current, distance, anchor };
      pinchedSinceLift.current = true;
      // Whatever the first finger had started is over: this is a pinch now.
      drag.current = null;
      if (event.cancelable) event.preventDefault();
    }

    function handleTouchMove(event: TouchEvent) {
      if (!pinch.current || event.touches.length < 2) return;
      // An uncancelable move means the browser is already scrolling the page
      // (the first finger got there first). Moving the strip as well would be
      // one gesture moving two things.
      if (!event.cancelable) return;
      event.preventDefault();
      const { distance, anchor } = fingers(event);
      onWindowChange(pinchWindow(pinch.current, distance, anchor, scale));
    }

    function handleTouchEnd(event: TouchEvent) {
      if (event.touches.length < 2) pinch.current = null;
      if (event.touches.length === 0) pinchedSinceLift.current = false;
    }

    element.addEventListener("touchstart", handleTouchStart, { passive: false });
    element.addEventListener("touchmove", handleTouchMove, { passive: false });
    element.addEventListener("touchend", handleTouchEnd);
    element.addEventListener("touchcancel", handleTouchEnd);
    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("touchend", handleTouchEnd);
      element.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [containerRef, onWindowChange, scale]);

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
      pointers.current.add(event.pointerId);

      // A second finger is a pinch, which the touch listeners above own. Two
      // mouse buttons or a pen and a finger are not anything; ignore the extra.
      if (pointers.current.size > 1 || pinchedSinceLift.current) {
        drag.current = null;
        return;
      }

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
    },
    [containerRef]
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const element = containerRef.current;
      if (!element || !pointers.current.has(event.pointerId)) return;
      // Mid-pinch, or the finger left over after one: the pinch decided where
      // the strip is, and this finger's old pan must not overrule it.
      if (pinch.current || pinchedSinceLift.current || !drag.current) return;

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
