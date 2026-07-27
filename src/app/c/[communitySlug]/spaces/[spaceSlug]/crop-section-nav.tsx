"use client";

import { useEffect, useRef, useState } from "react";

export type CropNavSection = { id: string; label: string };

// Sticky jump-nav for the (very long) crop guide. Renders a horizontally
// scrollable row of chips, one per on-page section, and highlights the section
// currently under the nav via an IntersectionObserver scroll-spy.
export function CropSectionNav({ sections }: { sections: CropNavSection[] }) {
  const [active, setActive] = useState<string>(sections[0]?.id ?? "");
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observed = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (observed.length === 0) return;

    // Track every intersecting section; the one nearest the top of the
    // viewport (just below the sticky nav) is treated as active.
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
      // Bias the band toward the top so "active" is the section under the nav,
      // not one just entering from the bottom.
      { rootMargin: "-72px 0px -55% 0px", threshold: 0 },
    );

    observed.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  // Keep the active chip scrolled into view within the nav rail.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const chip = nav.querySelector<HTMLElement>(`[data-chip="${active}"]`);
    chip?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [active]);

  if (sections.length <= 1) return null;

  const jumpTo = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    setActive(id);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    // Reflect the location without triggering the browser's own jump.
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <nav
      ref={navRef}
      aria-label="Crop guide sections"
      className="sticky top-0 z-30 -mx-4 border-b border-border bg-background/85 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/70 sm:-mx-6 sm:px-6"
    >
      <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {sections.map((section) => {
          const isActive = active === section.id;
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              data-chip={section.id}
              onClick={(event) => jumpTo(event, section.id)}
              aria-current={isActive ? "true" : undefined}
              className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                isActive
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {section.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
