"use client";

import { useEffect, useState } from "react";
import { Mic, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

// Camera/mic access for the video embed. The meeting runs inside a cross-origin
// iframe, so its own settings dialog can only say "permissions not granted" —
// it can't ask again. This bar sits above the meeting and asks from our page;
// the browser then delegates the grant to the iframe. Browsers don't let a page
// link straight to their site settings, so when access is blocked we show how
// to unblock it instead.
type Access = "granted" | "prompt" | "denied" | "unknown";

const combine = (a: Access, b: Access): Access => {
  if (a === "denied" || b === "denied") return "denied";
  if (a === "granted" && b === "granted") return "granted";
  if (a === "unknown" || b === "unknown") return "unknown";
  return "prompt";
};

export function MediaPermissions({ onGranted }: { onGranted: () => void }) {
  const [camera, setCamera] = useState<Access>("unknown");
  const [mic, setMic] = useState<Access>("unknown");
  const [asking, setAsking] = useState(false);
  const [askedOnce, setAskedOnce] = useState(false);

  // Watch the live permission state where the browser supports querying it
  // (Firefox and older Safari throw for camera/microphone — we stay "unknown").
  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.permissions?.query) return;
    const cleanups: (() => void)[] = [];
    const watch = (name: "camera" | "microphone", set: (a: Access) => void) => {
      navigator.permissions
        .query({ name: name as PermissionName })
        .then((status) => {
          set(status.state);
          const onChange = () => set(status.state);
          status.addEventListener("change", onChange);
          cleanups.push(() => status.removeEventListener("change", onChange));
        })
        .catch(() => set("unknown"));
    };
    watch("camera", setCamera);
    watch("microphone", setMic);
    return () => cleanups.forEach((fn) => fn());
  }, []);

  const access = combine(camera, mic);
  if (access === "granted") return null;

  async function grant() {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCamera("denied");
      return;
    }
    setAsking(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      // We only wanted the permission; the meeting opens its own devices.
      stream.getTracks().forEach((t) => t.stop());
      setCamera("granted");
      setMic("granted");
      onGranted();
    } catch (e) {
      const name = e instanceof DOMException ? e.name : "";
      if (name === "NotAllowedError" || name === "SecurityError") {
        setCamera("denied");
      } else if (name === "NotFoundError") {
        // No camera (or no mic) plugged in — retry with whatever exists.
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach((t) => t.stop());
          setMic("granted");
          onGranted();
        } catch {
          setCamera("denied");
        }
      }
    } finally {
      setAsking(false);
      setAskedOnce(true);
    }
  }

  // Browsers that can't report the state: only offer the button, quietly, until
  // it's been used once.
  if (access === "unknown" && askedOnce) return null;

  return (
    <div className="mb-3 rounded-lg border border-border bg-muted px-4 py-3 text-sm">
      {access === "denied" ? (
        <>
          <p className="font-medium">Your browser is blocking the camera or microphone for this site.</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-muted-foreground">
            <li>Click the icon at the left of the address bar (a padlock or sliders).</li>
            <li>Set Camera and Microphone to Allow (in Chrome, under Site settings if they aren&apos;t listed).</li>
            <li>Reload this page and open the room again.</li>
          </ol>
          <p className="mt-2 text-muted-foreground">
            On a phone, also check the browser has camera and microphone access in your phone&apos;s Settings.
          </p>
          <Button size="sm" variant="secondary" className="mt-3" onClick={() => window.location.reload()}>
            I&apos;ve allowed it, reload
          </Button>
        </>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Video className="h-4 w-4" />
            <Mic className="h-4 w-4" />
            {access === "unknown"
              ? "Camera or mic not working in the room?"
              : "The room can't use your camera or microphone yet."}
          </span>
          <Button size="sm" onClick={grant} disabled={asking}>
            {asking ? "Waiting for your browser…" : "Allow camera and mic"}
          </Button>
        </div>
      )}
    </div>
  );
}
