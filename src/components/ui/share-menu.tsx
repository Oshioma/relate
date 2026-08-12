"use client";

import { useEffect, useRef, useState } from "react";
import { Share2, Copy, Check, MessageCircle, Mail, Send } from "lucide-react";

// A small "Share" button that opens a menu of ways to pass a link on: the
// device's native share sheet (phones), copy-to-clipboard, WhatsApp, Facebook,
// X, Telegram and email. It's deliberately generic — hand it whatever page it
// sits on and it shares that. When `url` isn't given it shares the current
// page (window.location.href), which is already the clean, canonical link on a
// community's own host because the proxy strips the /c/<slug> prefix there.
export function ShareMenu({
  url,
  title,
  text,
  variant = "button",
}: {
  // The link to share. Defaults to the current page URL, resolved in the
  // browser so it's correct across custom domains, subdomains and the apex.
  url?: string;
  // A human title for the thing being shared (e.g. the business name). Used as
  // the native-share title and folded into the WhatsApp/X/email message.
  title?: string;
  // Optional longer blurb (e.g. a short description) for channels that take
  // free text. Falls back to the title.
  text?: string;
  // "button" — a bordered icon + "Share" label, for action rows. "icon" — an
  // icon-only toolbar button that sits alongside things like save/edit/delete.
  variant?: "button" | "icon";
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Resolve the link and native-share support in the browser. Both are read
  // straight off window/navigator rather than held in effect-set state: the
  // menu that uses them is only rendered once `open` is true, which can only
  // happen after a client-side click, so there's no SSR/hydration mismatch and
  // window.location.href is always the live, canonical URL of this page.
  const shareUrl = url ?? (typeof window !== "undefined" ? window.location.href : "");
  const canNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  // Close the menu on an outside click or Escape, matching the app's other
  // popovers.
  useEffect(() => {
    if (!open) return;
    function onClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const shareTitle = title ?? "";
  const shareText = text ?? title ?? "";
  // A one-line message that carries the name and the link, for channels that
  // take a single blob of text (WhatsApp, Telegram, email body).
  const message = shareTitle ? `${shareTitle} — ${shareUrl}` : shareUrl;

  const enc = encodeURIComponent;
  const links = {
    whatsapp: `https://wa.me/?text=${enc(message)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${enc(shareUrl)}`,
    x: `https://twitter.com/intent/tweet?text=${enc(shareText)}&url=${enc(shareUrl)}`,
    telegram: `https://t.me/share/url?url=${enc(shareUrl)}&text=${enc(shareText)}`,
    email: `mailto:?subject=${enc(shareTitle || "Check this out")}&body=${enc(message)}`,
  };

  async function copyLink() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        // Fallback for insecure contexts / older browsers without the async
        // Clipboard API.
        const el = document.createElement("textarea");
        el.value = shareUrl;
        el.style.position = "fixed";
        el.style.opacity = "0";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // If copying fails there's nothing sensible to recover to; leave the menu
      // open so the user can pick another channel.
    }
  }

  async function nativeShare() {
    try {
      await navigator.share({ title: shareTitle || undefined, text: shareText || undefined, url: shareUrl });
      setOpen(false);
    } catch {
      // The user dismissed the sheet, or it isn't allowed — no-op.
    }
  }

  const itemClass =
    "flex w-full items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted";

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        title="Share"
        className={
          variant === "icon"
            ? "rounded-md p-1.5 text-muted-foreground hover:bg-muted"
            : "inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:border-accent"
        }
      >
        <Share2 className="h-4 w-4" />
        {variant === "button" && " Share"}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-56 max-w-[calc(100vw-2rem)] overflow-hidden rounded-lg border border-border bg-card py-1 shadow-lg"
        >
          {canNativeShare && (
            <button type="button" role="menuitem" onClick={nativeShare} className={itemClass}>
              <Share2 className="h-4 w-4 text-muted-foreground" /> Share…
            </button>
          )}

          <button type="button" role="menuitem" onClick={copyLink} className={itemClass}>
            {copied ? (
              <>
                <Check className="h-4 w-4 text-accent" /> Link copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-muted-foreground" /> Copy link
              </>
            )}
          </button>

          <a
            href={links.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            role="menuitem"
            onClick={() => setOpen(false)}
            className={itemClass}
          >
            <MessageCircle className="h-4 w-4 text-muted-foreground" /> WhatsApp
          </a>

          <a
            href={links.facebook}
            target="_blank"
            rel="noopener noreferrer"
            role="menuitem"
            onClick={() => setOpen(false)}
            className={itemClass}
          >
            <span className="flex h-4 w-4 items-center justify-center text-[15px] font-semibold text-muted-foreground">f</span> Facebook
          </a>

          <a
            href={links.x}
            target="_blank"
            rel="noopener noreferrer"
            role="menuitem"
            onClick={() => setOpen(false)}
            className={itemClass}
          >
            {/* lucide dropped the bird; a plain glyph reads as X/Twitter. */}
            <span className="flex h-4 w-4 items-center justify-center text-[13px] font-semibold text-muted-foreground">𝕏</span> X
          </a>

          <a
            href={links.telegram}
            target="_blank"
            rel="noopener noreferrer"
            role="menuitem"
            onClick={() => setOpen(false)}
            className={itemClass}
          >
            <Send className="h-4 w-4 text-muted-foreground" /> Telegram
          </a>

          <a href={links.email} role="menuitem" onClick={() => setOpen(false)} className={itemClass}>
            <Mail className="h-4 w-4 text-muted-foreground" /> Email
          </a>
        </div>
      )}
    </div>
  );
}
