// Rules for the "We're live" pop-up (src/components/layout/live-now-popup.tsx),
// kept here as plain functions so they can be tested without a browser.

// How many session ids each remembered list keeps (dismissed / announced). Old
// sessions never come back, so the oldest are dropped first.
export const MAX_REMEMBERED_SESSIONS = 20;

// The pop-up shows for a live session unless the viewer is the host who
// started it, is already on that space's page (where the room is), or has
// pressed "Not now" for this session.
export function livePopupVisible({
  sessionId,
  startedBy,
  viewerId,
  pathname,
  spacePath,
  dismissedIds,
}: {
  sessionId: string;
  startedBy: string | null;
  viewerId: string | null;
  pathname: string;
  spacePath: string;
  dismissedIds: readonly string[];
}): boolean {
  if (viewerId && startedBy === viewerId) return false;
  if (onPath(pathname, spacePath)) return false;
  return !dismissedIds.includes(sessionId);
}

function onPath(pathname: string, path: string): boolean {
  const clean = (p: string) => p.replace(/\/+$/, "");
  const current = clean(pathname);
  const target = clean(path);
  // On a custom domain the /c/<slug> prefix isn't in the address bar.
  const short = target.replace(/^\/c\/[^/]+/, "");
  return [target, short].some((t) => t !== "" && (current === t || current.startsWith(`${t}/`)));
}

// The desktop notification only adds something when the viewer can't see the
// page, and is left to Web Push when this browser already gets the push copy of
// the same "we're live" notification (otherwise they'd get two).
export function shouldShowDesktopNotification({
  permission,
  pushSubscribed,
  pageVisible,
}: {
  permission: "granted" | "denied" | "default" | "unsupported";
  pushSubscribed: boolean;
  pageVisible: boolean;
}): boolean {
  return permission === "granted" && !pushSubscribed && !pageVisible;
}

// Adds an id to a remembered list, newest last, keeping it short.
export function rememberId(ids: readonly string[], id: string, max = MAX_REMEMBERED_SESSIONS): string[] {
  return [...ids.filter((x) => x !== id), id].slice(-max);
}

// Reads a remembered list back from storage, ignoring anything malformed.
export function parseIds(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) ? value.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}
