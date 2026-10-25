"use client";

import { useEffect, useSyncExternalStore } from "react";
import Link from "@/components/ui/link";
import { usePathname, useRouter } from "next/navigation";
import { BellRing, X } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { SafeImage } from "@/components/ui/safe-image";
import type { CommunityLiveSession } from "@/lib/data/live-events";
import { livePopupVisible, parseIds, rememberId, shouldShowDesktopNotification } from "@/lib/live-popup";

// A "We're live" card in the bottom corner of every page of the community while
// a session is live. LiveSessionWatcher refreshes the layout the moment a
// session starts or ends, so the card appears (and goes) without a reload. The
// first time this browser sees a session it plays a short chime and, if the
// tab isn't in view and desktop alerts are allowed, shows a desktop
// notification. "Not now" hides the card for that session only.

const DISMISSED_KEY = "relate:live-popup:dismissed";
const ANNOUNCED_KEY = "relate:live-popup:announced";
const CHANGE_EVENT = "relate:live-popup-change";

function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeIds(key: string, ids: string[]) {
  try {
    window.localStorage.setItem(key, JSON.stringify(ids));
  } catch {
    // Storage blocked (private mode): the card just comes back next page.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

// The server snapshot is a marker, so nothing renders until the browser's
// storage has been read (no flash of a card that was already dismissed).
const SERVER = "__server__";

function permissionNow(): "granted" | "denied" | "default" | "unsupported" {
  return typeof Notification === "undefined" ? "unsupported" : Notification.permission;
}

// Two soft rising notes from Web Audio, so there's no sound file to load.
// Browsers keep audio muted until the visitor has clicked or typed on the page,
// so when it's blocked the chime waits for that first touch instead.
function playChime() {
  const AudioCtx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return;
  const ctx = new AudioCtx();
  const play = () => {
    const now = ctx.currentTime;
    [660, 880].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const start = now + i * 0.18;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.25, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.45);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.5);
    });
    window.setTimeout(() => void ctx.close(), 1200);
  };
  void ctx.resume().then(() => {
    if (ctx.state === "running") {
      play();
      return;
    }
    const onFirstTouch = () => {
      window.removeEventListener("pointerdown", onFirstTouch);
      window.removeEventListener("keydown", onFirstTouch);
      void ctx.resume().then(play);
    };
    window.addEventListener("pointerdown", onFirstTouch);
    window.addEventListener("keydown", onFirstTouch);
  });
}

// True when this browser already receives the Web Push copy of the "we're
// live" notification, which shows on the desktop by itself.
async function hasPushSubscription(): Promise<boolean> {
  try {
    if (!("serviceWorker" in navigator)) return false;
    const reg = await navigator.serviceWorker.getRegistration();
    return Boolean(reg && (await reg.pushManager.getSubscription()));
  } catch {
    return false;
  }
}

export function LiveNowPopup({
  session,
  base,
  viewerId,
}: {
  session: CommunityLiveSession | null;
  base: string;
  viewerId: string | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const dismissedRaw = useSyncExternalStore(subscribe, () => readStorage(DISMISSED_KEY), () => SERVER);
  const permission = useSyncExternalStore(subscribe, permissionNow, () => "unsupported" as const);

  const spacePath = session ? `${base}/spaces/${session.spaceSlug}` : "";
  // ?join=1 opens the room on arrival, so there's no second Join click.
  const joinHref = `${spacePath}?join=1`;
  const visible =
    session !== null &&
    dismissedRaw !== SERVER &&
    livePopupVisible({
      sessionId: session.id,
      startedBy: session.startedBy,
      viewerId,
      pathname,
      spacePath,
      dismissedIds: parseIds(dismissedRaw),
    });

  // Chime + desktop notification, once per session per browser (other open
  // tabs see the id in storage and stay quiet).
  useEffect(() => {
    if (!visible || !session) return;
    const announced = parseIds(readStorage(ANNOUNCED_KEY));
    if (announced.includes(session.id)) return;
    writeIds(ANNOUNCED_KEY, rememberId(announced, session.id));
    playChime();

    void hasPushSubscription().then((pushSubscribed) => {
      if (
        !shouldShowDesktopNotification({
          permission: permissionNow(),
          pushSubscribed,
          pageVisible: document.visibilityState === "visible" && document.hasFocus(),
        })
      ) {
        return;
      }
      const note = new Notification(`${session.title} is live now`, {
        body: session.starterName ? `${session.starterName} has started a live session. Click to join.` : "A live session has started. Click to join.",
        icon: session.imageUrl ?? session.starterAvatarUrl ?? undefined,
        tag: `live-${session.id}`,
      });
      note.onclick = () => {
        window.focus();
        router.push(joinHref);
        note.close();
      };
    });
  }, [visible, session, joinHref, router]);

  if (!visible || !session) return null;

  function dismiss() {
    if (!session) return;
    writeIds(DISMISSED_KEY, rememberId(parseIds(readStorage(DISMISSED_KEY)), session.id));
  }

  async function enableDesktopAlerts() {
    try {
      await Notification.requestPermission();
    } finally {
      window.dispatchEvent(new Event(CHANGE_EVENT));
    }
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-4 bottom-4 z-50 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-96"
    >
      <div className="overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-2xl">
        {session.imageUrl && (
          <SafeImage srcs={[session.imageUrl]} alt="" className="h-28 w-full object-cover" loading="eager" />
        )}
        <div className="p-4">
          <div className="flex items-start gap-3">
            <Avatar src={session.starterAvatarUrl} name={session.starterName} size={40} className="shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-danger">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
                </span>
                Live now
              </p>
              <p className="mt-0.5 truncate font-semibold">{session.title}</p>
              {session.starterName && (
                <p className="truncate text-sm text-muted-foreground">{session.starterName} has started a live session</p>
              )}
            </div>
            <button
              type="button"
              onClick={dismiss}
              aria-label="Close"
              className="-mr-1 -mt-1 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-4 flex gap-2">
            <Link
              href={joinHref}
              className="inline-flex flex-1 items-center justify-center rounded-md bg-danger px-4 py-2 text-sm font-medium text-danger-foreground hover:opacity-90"
            >
              Join now
            </Link>
            <button
              type="button"
              onClick={dismiss}
              className="inline-flex items-center justify-center rounded-md bg-muted px-4 py-2 text-sm font-medium text-foreground hover:bg-border"
            >
              Not now
            </button>
          </div>
          {permission === "default" && (
            <button
              type="button"
              onClick={enableDesktopAlerts}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              <BellRing className="h-3.5 w-3.5" />
              Tell me on my desktop next time a session goes live
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
