import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

export interface DiscoverShortcut {
  href: string;
  label: string;
  icon: ReactNode;
  /** Optional one-word qualifier, e.g. the parent space for a category. */
  hint?: string | null;
  /** Featured categories render with an accent tint to stand out from spaces. */
  accent?: boolean;
}

/**
 * A horizontally-scrollable row of shortcut tiles surfaced at the top of the
 * community feed on mobile. Mobile has no sidebar (it's `hidden md:flex`), so
 * without this a visitor can't tell a Business Directory, Restaurants,
 * Marketplace etc. even exist until they drill Spaces → space → filter. This
 * puts every destination one tap away, right where they land. Hidden from `md`
 * up, where the sidebar already does this job.
 */
export function DiscoverStrip({ title, shortcuts, allHref }: { title: string; shortcuts: DiscoverShortcut[]; allHref: string }) {
  if (shortcuts.length === 0) return null;

  return (
    <section className="border-b border-border bg-muted/20 md:hidden">
      <div className="flex items-center justify-between px-4 pt-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>
      </div>
      <div className="flex snap-x gap-2.5 overflow-x-auto px-4 pb-4 pt-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {shortcuts.map((s, i) => (
          <Link
            key={`${s.href}-${i}`}
            href={s.href}
            className="group flex w-[112px] shrink-0 snap-start flex-col gap-2 rounded-xl border border-border bg-card p-3 transition-colors hover:border-accent/40 hover:bg-accent-soft/40 active:scale-[0.98]"
          >
            <span
              className={
                s.accent
                  ? "flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent"
                  : "flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-foreground/70"
              }
            >
              {s.icon}
            </span>
            <span className="min-w-0">
              <span className="line-clamp-2 text-[13px] font-semibold leading-tight text-foreground">{s.label}</span>
              {s.hint && <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">{s.hint}</span>}
            </span>
          </Link>
        ))}
        <Link
          href={allHref}
          className="flex w-[72px] shrink-0 snap-start flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-border text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent"
        >
          <ChevronRight className="h-5 w-5" />
          <span className="text-[11px] font-medium">All</span>
        </Link>
      </div>
    </section>
  );
}
