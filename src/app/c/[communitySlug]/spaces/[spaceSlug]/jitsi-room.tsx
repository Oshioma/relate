"use client";

import { useEffect, useRef, useState } from "react";
import { getJitsiToken } from "./live-events-actions";

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

export function JitsiRoom({
  roomName,
  communityId,
  displayName,
  subject,
  onClose,
}: {
  roomName: string;
  communityId: string;
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

    (async () => {
      const config = await getJitsiToken({ communityId, roomName });
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
          prejoinPageEnabled: false,
          disableDeepLinking: true,
          startWithAudioMuted: false,
        },
        interfaceConfigOverwrite: {
          MOBILE_APP_PROMO: false,
          SHOW_JITSI_WATERMARK: false,
        },
      };
      if (jaas) options.jwt = config.token;

      api = new window.JitsiMeetExternalAPI(domain, options);
      if (subject) api.executeCommand("subject", subject);
      api.addEventListener("videoConferenceLeft", () => onCloseRef.current?.());
      api.addEventListener("readyToClose", () => onCloseRef.current?.());
    })().catch((e: unknown) => {
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
  }, [roomName, communityId]);

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
