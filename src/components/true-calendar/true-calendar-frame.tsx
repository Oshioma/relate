import type { ReactNode } from "react";
import Link from "@/components/ui/link";
import { cn } from "@/lib/utils";

// The True Calendar's outer frame, shared by its pages: the strapline, the
// space's name, and the switch between Calendar ("what does today mean for
// me?") and History ("why?"). Research appears only to researchers.

export type TrueCalendarPage = "calendar" | "history" | "research";

export function TrueCalendarFrame({
  title,
  description,
  basePath,
  active,
  showResearch,
  children,
}: {
  title: string;
  description?: string | null;
  basePath: string;
  active: TrueCalendarPage;
  showResearch?: boolean;
  children: ReactNode;
}) {
  const tabs: Array<{ key: TrueCalendarPage; label: string; href: string }> = [
    { key: "calendar", label: "Calendar", href: basePath },
    { key: "history", label: "History", href: `${basePath}/history` },
    ...(showResearch ? [{ key: "research" as const, label: "Research", href: `${basePath}/research` }] : []),
  ];
  return (
    <div className="true-calendar -mx-4 rounded-none bg-[var(--tc-bg)] px-4 py-6 text-[var(--tc-ink)] sm:mx-0 sm:rounded-xl sm:px-6 sm:py-7">
      <header className="flex flex-col gap-1 pb-4">
        <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[var(--tc-gold)]">Two calendars. One day. Many civilisations.</p>
        <h1 className="font-serif text-4xl leading-tight tracking-tight sm:text-5xl">{title}</h1>
        {description ? <p className="max-w-3xl text-base text-[var(--tc-muted)]">{description}</p> : null}
      </header>
      <nav aria-label={`${title} pages`} className="mb-5 flex gap-1 border-b border-[var(--tc-line)]">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={t.href}
            aria-current={active === t.key ? "page" : undefined}
            className={cn(
              "-mb-px border-b-2 px-3 py-2 text-base font-medium transition-colors",
              active === t.key ? "border-[var(--tc-gold)] text-[var(--tc-ink)]" : "border-transparent text-[var(--tc-muted)] hover:text-[var(--tc-ink)]"
            )}
          >
            {t.label}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
