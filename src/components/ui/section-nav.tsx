"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export type NavSection = { id: string; label: string; group: string };

// Section navigation for long pages (the community admin page, editorial
// guides). On admin, the old version was a single row
// of chips that scrolled sideways with a hidden scrollbar, so most sections sat
// off-screen and nobody knew they existed. Now every section is always listed:
//
//   - lg and up: a sticky sidebar showing every section, grouped under headings.
//   - below lg:  a sticky "Jump to" bar naming the current section; tapping it
//                opens the full grouped list.
//
// Both highlight the section currently in view via an IntersectionObserver
// scroll-spy. Renders as two siblings so the page can drop the sidebar into a
// grid column (the mobile bar is display:none there and takes no cell).
export function SectionNav({ sections, label = "Sections" }: { sections: NavSection[]; label?: string }) {
  const [active, setActive] = useState<string>(sections[0]?.id ?? "");
  const [menuOpen, setMenuOpen] = useState(false);
  const mobileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observed = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (observed.length === 0) return;

    // Track every intersecting section; the one nearest the top of the
    // viewport (just below the sticky bar) is treated as active.
    const tops = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) tops.set(entry.target.id, entry.boundingClientRect.top);
          else tops.delete(entry.target.id);
        }
        let best: string | null = null;
        let bestTop = Infinity;
        for (const [id, top] of tops) {
          if (top < bestTop) {
            bestTop = top;
            best = id;
          }
        }
        if (best) setActive(best);
      },
      // Bias the band toward the top so "active" is the section being read,
      // not one just entering from the bottom.
      { rootMargin: "-72px 0px -55% 0px", threshold: 0 },
    );

    observed.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  // Close the mobile menu on Escape or a tap outside it.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const onPointer = (event: PointerEvent) => {
      if (!mobileRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [menuOpen]);

  if (sections.length <= 1) return null;

  // Groups in first-appearance order, so the page decides the order.
  const groups: { name: string; items: NavSection[] }[] = [];
  for (const section of sections) {
    const group = groups.find((g) => g.name === section.group);
    if (group) group.items.push(section);
    else groups.push({ name: section.group, items: [section] });
  }

  const activeIndex = Math.max(
    0,
    sections.findIndex((s) => s.id === active),
  );
  const activeLabel = sections[activeIndex]?.label ?? "";

  const jumpTo = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (!el) return;
    setActive(id);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    // Reflect the location without triggering the browser's own jump.
    history.replaceState(null, "", `#${id}`);
  };

  const groupedList = (
    <div className="space-y-4">
      {groups.map((group) => (
        <div key={group.name}>
          <p className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {group.name}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((section) => {
              const isActive = active === section.id;
              return (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    onClick={(event) => jumpTo(event, section.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={`block rounded-md px-2 py-1.5 text-sm transition-colors ${
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
          aria-controls="section-nav-menu"
          className="flex w-full items-center justify-between gap-3 rounded-md border border-border bg-card px-3 py-2 text-left"
        >
          <span className="min-w-0">
            <span className="block text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Jump to section · {activeIndex + 1} of {sections.length}
            </span>
            <span className="block truncate text-sm font-medium text-foreground">{activeLabel}</span>
          </span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${menuOpen ? "rotate-180" : ""}`}
            aria-hidden
          />
        </button>
        {menuOpen && (
          <nav
            id="section-nav-menu"
            aria-label={label}
            className="absolute inset-x-4 top-full mt-1 max-h-[70vh] overflow-y-auto rounded-md border border-border bg-card p-3 shadow-lg sm:inset-x-6"
          >
            {groupedList}
          </nav>
        )}
      </div>

      {/* Desktop: every section always visible in a sticky sidebar. */}
      <aside className="hidden lg:block">
        <nav
          aria-label={label}
          className="sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto pb-6"
        >
          {groupedList}
        </nav>
      </aside>
    </>
  );
}
