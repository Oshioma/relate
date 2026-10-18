// WHEN A PRESS ON THE STRIP STOPS BEING A CLICK.
//
// Kept apart from use-time-navigation.ts so it can be tested without a browser.

/**
 * How far a press must travel sideways before it is a drag rather than a
 * click. A fingertip is larger and less steady than a mouse pointer, so a tap
 * needs more room before it stops being a tap.
 */
export function dragThreshold(pointerType: string): number {
  return pointerType === "touch" ? 8 : 4;
}

/** True once a press that has moved `dx` pixels sideways is a drag. */
export function isDrag(dx: number, pointerType: string): boolean {
  return Math.abs(dx) >= dragThreshold(pointerType);
}
