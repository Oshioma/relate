"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { isPlatformHost } from "@/lib/custom-domain";

// NEXT_PUBLIC_SITE_URL is inlined into the client bundle, so it is readable
// here (same trick the custom-domain admin section uses).
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "";

/**
 * The footer's link home to the platform itself.
 *
 * A plain href="/" is wrong on a community's own host: the proxy rewrites "/"
 * on naturesgardeners.relate.click (or on a verified custom domain) to that
 * community's feed, so the platform credit just reloaded the page you were
 * already on. The absolute platform URL is the only href that means
 * "relate.click" from inside a community.
 *
 * The host is only knowable in the browser, so it's read through
 * useSyncExternalStore: the server (and the hydration pass) renders the
 * absolute URL, which is correct from anywhere, and the browser then relaxes it
 * to "/" on a platform host so the apex client-navigates and a preview
 * deployment doesn't bounce the visitor to production. The host never changes
 * under a mounted page, so the subscribe callback has nothing to listen to.
 */
const subscribe = () => () => {};

export function PlatformHomeLink({ className, children }: { className?: string; children: React.ReactNode }) {
  const platformUrl = SITE_URL || "/";
  const href = useSyncExternalStore(
    subscribe,
    () => (isPlatformHost(window.location.host) ? "/" : platformUrl),
    () => platformUrl
  );

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
