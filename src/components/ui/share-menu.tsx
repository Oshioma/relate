"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Share2, Copy, Check, MessageCircle, Mail, Send } from "lucide-react";

const MENU_WIDTH = 224; // w-56

// A small "Share" button that opens a menu of ways to pass a link on: the
// device's native share sheet (phones), copy-to-clipboard, WhatsApp, Facebook,
// X, Telegram and email. It's deliberately generic — hand it whatever page it
// sits on and it shares that. When `url` isn't given it shares the current
// page (window.location.href), which is already the clean, canonical link on a
// community's own host because the proxy strips the /c/<slug> prefix there.
//
// The dropdown is rendered in a portal with fixed positioning so it's never
// clipped by an `overflow-hidden` ancestor (e.g. a directory card). Channels
// open via window.open rather than <a> tags, and clicks are swallowed, so the
// button is safe to drop inside a larger clickable element (a card wrapped in a
// Link) without triggering that element's navigation.
export function ShareMenu({
  url,
  title,
  text,
  variant = "button",
  triggerClassName,
  menuAlign = "right",
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
  // Fully overrides the trigger button's styling (e.g. to match a card's
  // on-photo overlay controls). The "Share" label is dropped when set.
  triggerClassName?: string;
  // Which edge of the trigger the dropdown aligns to.
  menuAlign?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Resolve the link and native-share support in the browser. Read straight off
  // window/navigator rather than held in effect-set state: they're only used
  // once the menu is open, which can only happen after a client-side click, so
  // there's no SSR/hydration mismatch and window.location.href is always the
  // live, canonical URL of this page.
  const shareUrl = url ?? (typeof window !== "undefined" ? window.location.href : "");
  const canNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  // Position the fixed dropdown just under the trigger, aligned to the chosen
  // edge and clamped to stay on screen.
  function place() {
    const r = triggerRef.current?.getBoundingClientRect();
    if (!r) return;
    let left = menuAlign === "left" ? r.left : r.right - MENU_WIDTH;
    left = Math.max(8, Math.min(left, window.innerWidth - MENU_WIDTH - 8));
    setCoords({ top: r.bottom + 8, left });
  }

  // Close on outside click or Escape, and keep the dropdown pinned to the
  // trigger as the page scrolls or resizes.
  useEffect(() => {
    if (!open) return;
    function onPointer(event: MouseEvent) {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    function reposition() {
      place();
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, menuAlign]);

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

  function toggle() {
    if (open) {
      setOpen(false);
    } else {
      place();
      setOpen(true);
    }
  }

  // Open a share channel in a new tab (or hand a mailto: to the OS). Called from
  // a user click, so the popup isn't blocked.
  function openChannel(target: string) {
    if (target.startsWith("mailto:")) {
      window.location.href = target;
    } else {
      window.open(target, "_blank", "noopener,noreferrer");
    }
    setOpen(false);
  }

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

  const itemClass = "flex w-full items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted";

  return (
    // Swallow clicks so the component works inside a larger Link/clickable card
    // without triggering its navigation. Harmless when it stands alone.
    <span
      className="inline-flex"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        aria-haspopup="menu"
        aria-expanded={open}
        title="Share"
        className={
          triggerClassName ??
          (variant === "icon"
            ? "rounded-md p-1.5 text-muted-foreground hover:bg-muted"
            : "inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:border-accent")
        }
      >
        <Share2 className="h-4 w-4" />
        {variant === "button" && !triggerClassName && " Share"}
      </button>

      {open &&
        coords &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            style={{ position: "fixed", top: coords.top, left: coords.left, width: MENU_WIDTH }}
            className="z-[60] overflow-hidden rounded-lg border border-border bg-card py-1 shadow-lg"
            onClick={(e) => e.stopPropagation()}
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

            <button type="button" role="menuitem" onClick={() => openChannel(links.whatsapp)} className={itemClass}>
              <MessageCircle className="h-4 w-4 text-muted-foreground" /> WhatsApp
            </button>

            <button type="button" role="menuitem" onClick={() => openChannel(links.facebook)} className={itemClass}>
              <span className="flex h-4 w-4 items-center justify-center text-[15px] font-semibold text-muted-foreground">f</span> Facebook
            </button>

            <button type="button" role="menuitem" onClick={() => openChannel(links.x)} className={itemClass}>
              {/* lucide dropped the bird; a plain glyph reads as X/Twitter. */}
              <span className="flex h-4 w-4 items-center justify-center text-[13px] font-semibold text-muted-foreground">𝕏</span> X
            </button>

            <button type="button" role="menuitem" onClick={() => openChannel(links.telegram)} className={itemClass}>
              <Send className="h-4 w-4 text-muted-foreground" /> Telegram
            </button>

            <button type="button" role="menuitem" onClick={() => openChannel(links.email)} className={itemClass}>
              <Mail className="h-4 w-4 text-muted-foreground" /> Email
            </button>
          </div>,
          document.body,
        )}
    </span>
  );
}
