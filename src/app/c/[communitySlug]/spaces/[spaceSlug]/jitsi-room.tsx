"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { getJitsiToken } from "./live-events-actions";
import { MediaPermissions } from "./media-permissions";
import { Button } from "@/components/ui/button";
import { looksBlank, SNAPSHOT_TIMES_SECONDS, SNAPSHOT_WIDTH } from "@/lib/live-snapshot";

// The video embed. In production it points at JaaS (8x8.vc) with a signed,
// per-participant JWT — no time limit, no demo banner. When JaaS isn't
// configured (local dev), getJitsiToken returns mode:"public" and we fall back
// to the free meet.jit.si server. Either way this component is the only place
// that talks to the video provider — swapping it for LiveKit/Daily later
// touches nothing else.
const PUBLIC_DOMAIN = "meet.jit.si";
const JAAS_DOMAIN = "8x8.vc";

type JitsiApi = {
  dispose: () => void;
  addEventListener: (event: string, listener: () => void) => void;
  executeCommand: (command: string, ...args: unknown[]) => void;
  // A picture of the main (large) video as a data: URL.
  captureLargeVideoScreenshot?: () => Promise<{ dataURL?: string } | undefined>;
};

declare global {
  interface Window {
    JitsiMeetExternalAPI?: new (domain: string, options: Record<string, unknown>) => JitsiApi;
  }
}

// Load external_api.js once per domain and share the promise across mounts.
const scriptPromises: Record<string, Promise<void>> = {};
function loadJitsiScript(domain: string): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.JitsiMeetExternalAPI) return Promise.resolve();
  if (domain in scriptPromises) return scriptPromises[domain];
  scriptPromises[domain] = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://${domain}/external_api.js`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      delete scriptPromises[domain]; // let a later mount retry
      reject(new Error("Couldn't load the video service. Check your connection and try again."));
    };
    document.body.appendChild(script);
  });
  return scriptPromises[domain];
}

const noSubscribe = () => () => {};

// Turns a screenshot of the meeting into a small JPEG data: URL, or null when
// it couldn't be read or is just a flat black/grey frame.
async function shrinkScreenshot(dataUrl: string): Promise<string | null> {
  const img = new Image();
  img.src = dataUrl;
  await img.decode();
  if (!img.naturalWidth || !img.naturalHeight) return null;
  const width = Math.min(SNAPSHOT_WIDTH, img.naturalWidth);
  const height = Math.round((img.naturalHeight / img.naturalWidth) * width);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(img, 0, 0, width, height);
  if (looksBlank(ctx.getImageData(0, 0, width, height).data)) return null;
  return canvas.toDataURL("image/jpeg", 0.8);
}

// The token config the embed needs — either the public demo server or an
// authenticated JaaS room. Whatever action mints it (community live events or
// direct-message calls) returns this same shape.
export type JitsiJoinConfig =
  | { mode: "public" }
  | { mode: "jaas"; appId: string; token: string }
  | { error: string };

export function JitsiRoom({
  roomName,
  communityId,
  displayName,
  subject,
  onClose,
  getToken,
  onSnapshot,
}: {
  roomName: string;
  // Community live events pass this; direct-message calls pass `getToken`
  // instead (a DM isn't scoped to a community).
  communityId?: string;
  displayName?: string | null;
  subject?: string;
  // Called when the participant hangs up inside the meeting.
  onClose?: () => void;
  // Custom token provider. Defaults to the community live-events token when a
  // communityId is given. Lets other surfaces (DM calls) reuse this embed.
  getToken?: () => Promise<JitsiJoinConfig>;
  // Given a small JPEG still of the main video a few times during the call
  // (SNAPSHOT_TIMES_SECONDS after joining). Hosts pass it so the session gets
  // a picture for its Past sessions card.
  onSnapshot?: (jpegDataUrl: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Wraps the meeting so it (and the permissions bar) can go full screen.
  const frameRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  // iPhone Safari can't put a page element full screen, so no button there.
  const canFullscreen = useSyncExternalStore(
    noSubscribe,
    () => Boolean(document.fullscreenEnabled),
    () => false,
  );
  useEffect(() => {
    const onChange = () => setIsFullscreen(document.fullscreenElement === frameRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);
  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void frameRef.current?.requestFullscreen().catch(() => {});
  };
  // Keep the latest onClose in a ref so the meeting effect doesn't re-run (and
  // rebuild the whole iframe) just because the parent passed a new closure.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });
  // Same treatment for getToken — a fresh closure each render must not tear
  // down and rebuild the iframe.
  const getTokenRef = useRef(getToken);
  useEffect(() => {
    getTokenRef.current = getToken;
  });
  const onSnapshotRef = useRef(onSnapshot);
  useEffect(() => {
    onSnapshotRef.current = onSnapshot;
  });
  const [error, setError] = useState<string | null>(null);
  // Bumped when camera/mic access is granted from our page, so the meeting
  // rebuilds and picks the newly allowed devices up.
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let api: JitsiApi | null = null;
    const snapshotTimers: ReturnType<typeof setTimeout>[] = [];

    // Asks the meeting for a still of the main video and hands it on. Any
    // failure just means no picture this time.
    const takeSnapshot = async () => {
      if (cancelled || !api?.captureLargeVideoScreenshot || !onSnapshotRef.current) return;
      try {
        const shot = await api.captureLargeVideoScreenshot();
        if (cancelled || !shot?.dataURL) return;
        const jpeg = await shrinkScreenshot(shot.dataURL);
        if (jpeg && !cancelled) onSnapshotRef.current?.(jpeg);
      } catch {
        // ignore — no picture this time
      }
    };

    (async () => {
      const config: JitsiJoinConfig = getTokenRef.current
        ? await getTokenRef.current()
        : await getJitsiToken({ communityId: communityId!, roomName });
      if (cancelled) return;
      if ("error" in config) {
        setError(config.error);
        return;
      }

      const jaas = config.mode === "jaas";
      const domain = jaas ? JAAS_DOMAIN : PUBLIC_DOMAIN;
      // JaaS rooms are namespaced under the AppID: "<appId>/<room>".
      const room = jaas ? `${config.appId}/${roomName}` : roomName;

      await loadJitsiScript(domain);
      if (cancelled || !containerRef.current || !window.JitsiMeetExternalAPI) return;

      const options: Record<string, unknown> = {
        roomName: room,
        parentNode: containerRef.current,
        width: "100%",
        height: "100%",
        userInfo: displayName ? { displayName } : undefined,
        configOverwrite: {
          // Go straight into the call: no "Join meeting" screen asking for a
          // name. Our name comes from the JaaS token (or userInfo), and the
          // camera/mic bar above already handles device access. JaaS only
          // honours the newer prejoinConfig; the old flag stays for meet.jit.si.
          prejoinConfig: { enabled: false },
          prejoinPageEnabled: false,
          requireDisplayName: false,
          disableDeepLinking: true,
          startWithAudioMuted: false,
          // The side strip of small videos starts at twice Jitsi's 120px, and
          // its drag handle always shows so people can widen it further (Jitsi
          // only allows that when the room is at least ~920px wide).
          filmstrip: { initialWidth: 240, alwaysShowResizeBar: true },
        },
        interfaceConfigOverwrite: {
          MOBILE_APP_PROMO: false,
          // Show each person's whole picture (letterboxed) instead of
          // cropping it to fill the frame, where faces end up cut off or
          // hidden behind the toolbar.
          VIDEO_LAYOUT_FIT: "nocrop",
          SHOW_JITSI_WATERMARK: false,
        },
      };
      if (jaas) options.jwt = config.token;

      api = new window.JitsiMeetExternalAPI(domain, options);
      if (subject) api.executeCommand("subject", subject);
      api.addEventListener("videoConferenceLeft", () => onCloseRef.current?.());
      api.addEventListener("readyToClose", () => onCloseRef.current?.());
      api.addEventListener("videoConferenceJoined", () => {
        if (!onSnapshotRef.current) return;
        for (const seconds of SNAPSHOT_TIMES_SECONDS) {
          snapshotTimers.push(setTimeout(() => void takeSnapshot(), seconds * 1000));
        }
      });
    })().catch((e: unknown) => {
      if (!cancelled) setError(e instanceof Error ? e.message : "Couldn't start the meeting.");
    });

    return () => {
      cancelled = true;
      snapshotTimers.forEach(clearTimeout);
      try {
        api?.dispose();
      } catch {
        // ignore — the iframe may already be gone
      }
    };
    // Only re-init when the room actually changes (or access was just granted).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomName, communityId, reloadKey]);

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-border bg-muted px-4 text-center text-sm text-muted-foreground">
        {error}
      </div>
    );
  }

  return (
    <div ref={frameRef} className={isFullscreen ? "flex h-full flex-col bg-black p-2" : undefined}>
      <MediaPermissions onGranted={() => setReloadKey((k) => k + 1)} />
      {canFullscreen && (
        <div className="mb-2 flex justify-end">
          <Button size="sm" variant="secondary" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            {isFullscreen ? "Exit full screen" : "Full screen"}
          </Button>
        </div>
      )}
      <div
        ref={containerRef}
        className={
          isFullscreen
            ? "min-h-0 w-full flex-1 overflow-hidden rounded-lg bg-black"
            : "h-[70vh] min-h-[420px] w-full overflow-hidden rounded-lg border border-border bg-black"
        }
      />
    </div>
  );
}
