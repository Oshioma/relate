"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Share2, Link2, Check, Mail } from "lucide-react";

// A small "Share" button that drops down a menu of ways to share a listing:
// the native share sheet (on devices that support it), WhatsApp, Facebook, X,
// email, and a plain "copy link". Brand logos are inlined as SVG so the menu
// doesn't depend on brand glyphs being present in the icon set.
//
// Pass `path` as an app-relative URL (e.g. `/c/acme/spaces/shops/biz-123`).
// The absolute URL is resolved from the browser's own origin at share time, so
// it comes out right on custom domains too. `title` seeds the share text and
// the native sheet; `text` is an optional longer blurb.
export function ShareMenu({
  path,
  title,
  text,
  className,
}: {
  path: string;
  title: string;
  text?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Resolved lazily in the browser: `window` isn't available during SSR, and
  // the origin is what makes the link absolute (and correct on custom domains).
  // The menu panel only ever renders after a click, so this always runs
  // client-side — no need for effect state or a hydration guard.
  function resolveUrl(): string {
    try {
      return new URL(path, window.location.origin).toString();
    } catch {
      return path;
    }
  }
  const canNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const shareText = text ? `${title} — ${text}` : title;

  async function handleNativeShare() {
    setOpen(false);
    try {
      await navigator.share({ title, text, url: resolveUrl() });
    } catch {
      // The user dismissed the sheet, or sharing was blocked — nothing to do.
    }
  }

  async function handleCopy() {
    const shareUrl = resolveUrl();
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (insecure context / permissions) — fall back to a
      // prompt so the link is still selectable.
      window.prompt("Copy this link:", shareUrl);
    }
  }

  // Built inside the panel render (which only happens on the client, after a
  // click) so `resolveUrl()` has a real origin to work from.
  function socialTargets(): { label: string; href: string; icon: ReactNode }[] {
    const shareUrl = resolveUrl();
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);
    return [
      {
        label: "WhatsApp",
        href: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
        icon: <WhatsAppIcon />,
      },
      {
        label: "Facebook",
        href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        icon: <FacebookIcon />,
      },
      {
        label: "X",
        href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
        icon: <XIcon />,
      },
    ];
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        title="Share"
        className={
          className ??
          "rounded-md p-1.5 text-muted-foreground hover:bg-muted"
        }
      >
        <Share2 className="h-4 w-4" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-lg border border-border bg-card py-1 shadow-lg"
        >
          {canNativeShare && (
            <MenuItem onClick={handleNativeShare} icon={<Share2 className="h-4 w-4" />} label="Share…" />
          )}
          {socialTargets().map((t) => (
            <a
              key={t.label}
              role="menuitem"
              href={t.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted"
            >
              <span className="flex h-4 w-4 items-center justify-center text-muted-foreground">{t.icon}</span>
              {t.label}
            </a>
          ))}
          <MenuItem
            as="a"
            href={`mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(`${shareText}\n\n${resolveUrl()}`)}`}
            onClick={() => setOpen(false)}
            icon={<Mail className="h-4 w-4" />}
            label="Email"
          />
          <div className="my-1 border-t border-border" />
          <MenuItem
            onClick={handleCopy}
            icon={copied ? <Check className="h-4 w-4 text-accent" /> : <Link2 className="h-4 w-4" />}
            label={copied ? "Copied!" : "Copy link"}
          />
        </div>
      )}
    </div>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  as,
  href,
}: {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  as?: "a";
  href?: string;
}) {
  const className =
    "flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-foreground hover:bg-muted";
  const inner = (
    <>
      <span className="flex h-4 w-4 items-center justify-center text-muted-foreground">{icon}</span>
      {label}
    </>
  );
  if (as === "a") {
    return (
      <a role="menuitem" href={href} onClick={onClick} className={className}>
        {inner}
      </a>
    );
  }
  return (
    <button type="button" role="menuitem" onClick={onClick} className={className}>
      {inner}
    </button>
  );
}

// Brand marks, inlined so they render regardless of which glyphs ship with the
// icon library. Sized to the surrounding 1rem icon slot; `currentColor` keeps
// them tinted like the neighbouring lucide icons.
function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35zM12.04 21.5h-.01a9.4 9.4 0 01-4.79-1.31l-.34-.2-3.56.93.95-3.47-.22-.36a9.38 9.38 0 01-1.44-5.01c0-5.18 4.22-9.4 9.42-9.4 2.51 0 4.88.98 6.65 2.76a9.35 9.35 0 012.75 6.65c0 5.18-4.22 9.41-9.4 9.41zm8-17.4A11.32 11.32 0 0012.04.75C5.8.75.73 5.82.73 12.05c0 1.99.52 3.94 1.51 5.66L.64 23.25l5.68-1.49a11.3 11.3 0 005.42 1.38h.01c6.23 0 11.3-5.07 11.3-11.3a11.23 11.23 0 00-3.31-8.04z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.46l8.6-9.83L0 1.15h7.6l5.24 6.93 6.06-6.93zm-1.29 19.5h2.04L6.49 3.24H4.3L17.61 20.65z" />
    </svg>
  );
}
