"use client";

import { useEffect, useRef, useState } from "react";

// Phase 1 uses Jitsi's free public server. It needs no account or API key: we
// load their External API script and embed a meeting iframe in-page. Access is
// gated by our own RLS (only viewers who can see the space get the room name);
// the room name itself is the join secret at this layer. Swapping this file for
// a LiveKit/Daily embed later is the Phase 2 upgrade — nothing else changes.
const JITSI_DOMAIN = "meet.jit.si";
const SCRIPT_SRC = `https://${JITSI_DOMAIN}/external_api.js`;

type JitsiApi = {
  dispose: () => void;
  addEventListener: (event: string, listener: () => void) => void;
  executeCommand: (command: string, ...args: unknown[]) => void;
};

declare global {
  interface Window {
    JitsiMeetExternalAPI?: new (domain: string, options: Record<string, unknown>) => JitsiApi;
  }
}

// Load the external_api.js script once per page and share the promise across
// mounts, so re-opening a room doesn't inject it again.
let scriptPromise: Promise<void> | null = null;
function loadJitsiScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.JitsiMeetExternalAPI) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null; // let a later mount retry
      reject(new Error("Couldn't load the video service. Check your connection and try again."));
    };
    document.body.appendChild(script);
  });
  return scriptPromise;
}

export function JitsiRoom({
  roomName,
  displayName,
  subject,
  onClose,
}: {
  roomName: string;
  displayName?: string | null;
  subject?: string;
  // Called when the participant hangs up inside the meeting.
  onClose?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Keep the latest onClose in a ref so the meeting effect doesn't re-run (and
  // rebuild the whole iframe) just because the parent passed a new closure.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let api: JitsiApi | null = null;

    loadJitsiScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.JitsiMeetExternalAPI) return;
        api = new window.JitsiMeetExternalAPI(JITSI_DOMAIN, {
          roomName,
          parentNode: containerRef.current,
          width: "100%",
          height: "100%",
          userInfo: displayName ? { displayName } : undefined,
          configOverwrite: {
            prejoinPageEnabled: false,
            disableDeepLinking: true,
            startWithAudioMuted: false,
          },
          interfaceConfigOverwrite: {
            MOBILE_APP_PROMO: false,
            SHOW_JITSI_WATERMARK: false,
          },
        });
        if (subject) api.executeCommand("subject", subject);
        api.addEventListener("videoConferenceLeft", () => onCloseRef.current?.());
        api.addEventListener("readyToClose", () => onCloseRef.current?.());
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Couldn't start the meeting.");
      });

    return () => {
      cancelled = true;
      try {
        api?.dispose();
      } catch {
        // ignore — the iframe may already be gone
      }
    };
    // Only re-init when the room actually changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomName]);

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-border bg-muted px-4 text-center text-sm text-muted-foreground">
        {error}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-[70vh] min-h-[420px] w-full overflow-hidden rounded-lg border border-border bg-black"
    />
  );
}
