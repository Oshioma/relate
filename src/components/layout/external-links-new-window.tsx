"use client";

import { useEffect } from "react";
import { EXTERNAL_LINK_REL, isExternalHref } from "@/lib/external-links";

// Makes every link to another site open in a new window (see
// lib/external-links). Mounted once in the root layout. It listens in the
// capture phase, before Next's <Link> handler, and only sets target and rel
// on the clicked link, so the browser's own navigation does the rest: a link
// that already says where to open (any target), a download link, and
// modified clicks (cmd/ctrl/shift/middle) are left as they are.
export function ExternalLinksInNewWindow() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest?.("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.hasAttribute("target") || anchor.hasAttribute("download")) return;
      if (!isExternalHref(anchor.getAttribute("href") ?? "", window.location.host)) return;
      anchor.target = "_blank";
      const rel = new Set((anchor.rel || "").split(/\s+/).filter(Boolean));
      for (const value of EXTERNAL_LINK_REL.split(" ")) rel.add(value);
      anchor.rel = [...rel].join(" ");
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return null;
}
