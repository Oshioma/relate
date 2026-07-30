"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { savePushSubscription, removePushSubscription } from "./push-actions";

// Web Push's applicationServerKey wants the VAPID public key as a Uint8Array.
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) output[i] = raw.charCodeAt(i);
  return output;
}

export function PushToggle({ vapidPublicKey }: { vapidPublicKey: string | null }) {
  const [supported, setSupported] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ok = typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
    // One-time read of a browser capability + any existing subscription — a
    // legitimate effect-driven sync with an external system.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSupported(ok);
    if (!ok) return;
    navigator.serviceWorker.getRegistration().then(async (reg) => {
      const sub = reg ? await reg.pushManager.getSubscription() : null;
      setEnabled(Boolean(sub));
    });
  }, []);

  async function enable() {
    if (!vapidPublicKey) return;
    setBusy(true);
    setError(null);
    try {
      const reg = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setError("Notifications are blocked for this site — allow them in your browser settings, then try again.");
        setBusy(false);
        return;
      }
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as BufferSource,
      });
      const json = subscription.toJSON();
      const keys = json.keys ?? {};
      const result = await savePushSubscription({
        endpoint: subscription.endpoint,
        p256dh: keys.p256dh ?? "",
        auth: keys.auth ?? "",
      });
      if (result.error) {
        setError(result.error);
        setBusy(false);
        return;
      }
      setEnabled(true);
    } catch (err) {
      setError((err as Error).message || "Couldn't enable push.");
    }
    setBusy(false);
  }

  async function disable() {
    setBusy(true);
    setError(null);
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      const subscription = reg ? await reg.pushManager.getSubscription() : null;
      if (subscription) {
        await removePushSubscription(subscription.endpoint);
        await subscription.unsubscribe();
      }
      setEnabled(false);
    } catch (err) {
      setError((err as Error).message || "Couldn't disable push.");
    }
    setBusy(false);
  }

  if (!vapidPublicKey) {
    return <p className="text-sm text-muted-foreground">Push notifications aren&apos;t configured on this platform yet.</p>;
  }
  if (!supported) {
    return <p className="text-sm text-muted-foreground">This browser doesn&apos;t support push notifications.</p>;
  }

  return (
    <div>
      <Button
        type="button"
        variant={enabled ? "secondary" : "primary"}
        className="w-auto"
        onClick={enabled ? disable : enable}
        disabled={busy}
      >
        {busy ? "Working…" : enabled ? "Disable push on this device" : "Enable push on this device"}
      </Button>
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
    </div>
  );
}
