"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";

/**
 * One entry in the nav. Most are sections of the page (`id` is the anchor);
 * one with an `href` is a link to another page instead (the admin page's
 * Analytics, Inbox, ...) and takes no part in the scroll-spy.
 */
export type NavSection = { id: string; label: string; group?: string; href?: string };

// How far below the top of the window a section's heading has to have scrolled
// for it to count as the one being read. Just under the sticky mobile bar, and
// in step with the scroll-mt-20 the pages put on their headings.
const ACTIVE_OFFSET = 96;

// Section navigation for long pages (the admin page, long-form posts). The
// admin page used to have a single row of chips that scrolled sideways with a
// hidden scrollbar, so most sections sat off-screen and nobody knew they
// existed. Now every section is always listed:
//
//   - lg and up: a sticky sidebar showing every section, grouped under headings
//                (sections without a group are listed without one).
//   - below lg:  a sticky "Jump to" bar naming the current section; tapping it
//                opens the full grouped list.
//
// Both highlight the section currently in view. Renders as two siblings so the
// page can drop the sidebar into a grid column (the mobile bar is display:none
// there and takes no cell).
//
// Keeping it smooth: the highlight is worked out from scroll position (the
// last heading above the line), so it only ever steps forward as you scroll
// down and back as you scroll up. While a click is smooth-scrolling the page
// the highlight stays on the section clicked instead of flicking through every
// one in between, and the sidebar scrolls itself to keep the highlight in view.
// List sections in page order, or the highlight jumps around the list.
export function SectionNav({
  sections,
  label = "Sections",
}: {
  sections: NavSection[];
  /** Accessible name for the nav, e.g. "Admin sections". */
  label?: string;
}) {
  const anchors = sections.filter((s) => !s.href);
  const [active, setActive] = useState<string>(anchors[0]?.id ?? "");
  const [menuOpen, setMenuOpen] = useState(false);
  const mobileRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  // Set while a click is smooth-scrolling to a section, so the scroll-spy
  // leaves the highlight on the target.
  const lockedTo = useRef<string | null>(null);
  const unlockTimer = useRef<number | undefined>(undefined);
  const menuId = useId();
  const anchorKey = anchors.map((s) => s.id).join(" ");

  useEffect(() => {
    const ids = anchorKey ? anchorKey.split(" ") : [];
    if (ids.length === 0) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      if (lockedTo.current) return;
      // The heading that has most recently passed the line.
      let current: string | null = null;
      let currentTop = -Infinity;
      for (const id of ids) {
        const top = document.getElementById(id)?.getBoundingClientRect().top;
        if (top !== undefined && top <= ACTIVE_OFFSET && top > currentTop) {
          current = id;
          currentTop = top;
        }
      }
      // At the very bottom the last short sections can never reach the line,
      // so the last one wins once there's nowhere further to scroll.
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) {
        for (let i = ids.length - 1; i >= 0; i--) {
          if (document.getElementById(ids[i])) {
            current = ids[i];
            break;
          }
        }
      }
      setActive(current ?? ids[0]);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    // Opened with a #section in the address: highlight it straight away.
    const fromHash = window.location.hash.slice(1);
    if (ids.includes(fromHash)) setActive(fromHash);
    else update();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [anchorKey]);

  useEffect(() => () => window.clearTimeout(unlockTimer.current), []);

  // Keep the highlighted link in view inside the sidebar's own scroll area,
  // without moving the page itself (scrollIntoView would).
  useEffect(() => {
    const list = sidebarRef.current;
    if (!list || !active) return;
    const link = list.querySelector<HTMLElement>(`[data-section="${CSS.escape(active)}"]`);
    if (!link) return;
    const margin = 24;
    const top = link.getBoundingClientRect().top - list.getBoundingClientRect().top + list.scrollTop;
    const bottom = top + link.offsetHeight;
    if (top - margin < list.scrollTop) {
      list.scrollTo({ top: Math.max(0, top - margin), behavior: "smooth" });
    } else if (bottom + margin > list.scrollTop + list.clientHeight) {
      list.scrollTo({ top: bottom + margin - list.clientHeight, behavior: "smooth" });
    }
  }, [active]);

  // Close the mobile menu on Escape or a tap outside it.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const onPointer = (event: PointerEvent) => {
      if (!mobileRef.current?.contains(event.target as Node))
        setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [menuOpen]);

  const jumpTo = useCallback((event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (!el) return;
    setActive(id);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    lockedTo.current = id;
    window.clearTimeout(unlockTimer.current);
    const unlock = () => {
      window.clearTimeout(unlockTimer.current);
      window.removeEventListener("scrollend", unlock);
      lockedTo.current = null;
    };
    // scrollend where the browser has it; the timer covers Safari, and a
    // section already in place that never scrolls at all.
    window.addEventListener("scrollend", unlock, { once: true });
    unlockTimer.current = window.setTimeout(unlock, reduceMotion ? 100 : 1200);

    el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    // Reflect the location without triggering the browser's own jump.
    history.replaceState(null, "", `#${id}`);
  }, []);

  if (sections.length <= 1) return null;

  // Groups in first-appearance order, so the page decides the order.
  const groups: { name: string; items: NavSection[] }[] = [];
  for (const section of sections) {
    const name = section.group ?? "";
    const group = groups.find((g) => g.name === name);
    if (group) group.items.push(section);
    else groups.push({ name, items: [section] });
  }

  const activeIndex = Math.max(
    0,
    anchors.findIndex((s) => s.id === active),
  );
  const activeLabel = anchors[activeIndex]?.label ?? "";

  const groupedList = (
    <div className="space-y-4">
      {groups.map((group) => (
        <div key={group.name}>
          {group.name && (
            <p className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {group.name}
            </p>
          )}
          <ul className="space-y-0.5">
            {group.items.map((section) => {
              if (section.href) {
                return (
                  <li key={section.id}>
                    <Link
                      href={section.href}
                      className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {section.label}
                      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden />
                    </Link>
                  </li>
                );
              }
              const isActive = active === section.id;
              return (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    data-section={section.id}
                    onClick={(event) => jumpTo(event, section.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={`block rounded-md px-2 py-1.5 text-sm transition-colors duration-200 ${
                      isActive
                        ? "bg-accent font-medium text-accent-foreground"
                        : section.id === "danger"
                          ? "text-danger hover:bg-muted"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {section.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Mobile / tablet: sticky bar that opens the full list. */}
      <div
        ref={mobileRef}
        className="sticky top-0 z-30 -mx-4 mb-8 border-b border-border bg-background/85 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/70 sm:-mx-6 sm:px-6 lg:hidden"
      >
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls={menuId}
          className="flex w-full items-center justify-between gap-3 rounded-md border border-border bg-card px-3 py-2 text-left"
        >
          <span className="min-w-0">
            <span className="block text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Jump to section · {activeIndex + 1} of {anchors.length}
            </span>
            <span className="block truncate text-sm font-medium text-foreground">
              {activeLabel}
            </span>
          </span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${menuOpen ? "rotate-180" : ""}`}
            aria-hidden
          />
        </button>
        {menuOpen && (
          <nav
            id={menuId}
            aria-label={label}
            className="absolute inset-x-4 top-full mt-1 max-h-[70vh] overflow-y-auto overscroll-contain rounded-md border border-border bg-card p-3 shadow-lg sm:inset-x-6"
          >
            {groupedList}
          </nav>
        )}
      </div>

      {/* Desktop: every section always visible in a sticky sidebar. Its list
          scrolls on its own (overscroll-contain keeps a scroll at its end from
          carrying on into the page). */}
      <aside className="hidden lg:block">
        <nav
          ref={sidebarRef}
          aria-label={label}
          className="sticky top-6 max-h-[calc(100dvh-3rem)] overflow-y-auto overscroll-contain pb-6"
        >
          {groupedList}
        </nav>
      </aside>
    </>
  );
}
