import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface HeroStat {
  icon: LucideIcon;
  value: number;
  label: string;
}

// The feed's landing hero: the community's name set big over its cover photo,
// the description under it, the calls to action, and (when the owner has
// turned stats on) a frosted panel of counts on the right.
//
// Over a photo the darkening runs from the side the text sits on — left on
// desktop, bottom on a phone where the text stacks low — so the far side of
// the picture stays as shot while white type always has a dark backing.
// Without a cover the same layout sits on a soft accent wash in the page's own
// colours.
export function FeedHero({
  name,
  description,
  cover,
  stats,
  actions,
  coverControl,
}: {
  name: string;
  description: string | null;
  // The cover <img>, already cropped; null for the no-cover header.
  cover: ReactNode | null;
  stats: HeroStat[];
  actions: ReactNode;
  // Staff-only cover picker, pinned to the hero's top-right corner.
  coverControl?: ReactNode;
}) {
  const onPhoto = cover !== null;

  return (
    // The control sits on a wrapper outside the clipped section so its popover
    // can hang over the page below instead of being cut off at the hero's edge.
    <div className="relative">
      <section
        className={cn(
          "relative isolate overflow-hidden border-b border-border",
          !onPhoto && "bg-gradient-to-br from-accent/15 via-background to-background"
        )}
      >
        {cover}
        {onPhoto && (
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/45 to-black/10 lg:bg-gradient-to-r lg:from-black/75 lg:via-black/40 lg:to-black/0" />
        )}
        <div
          className={cn(
            "mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between",
            onPhoto ? "min-h-[380px] justify-end py-10 sm:min-h-[460px] lg:py-14" : "py-10 sm:py-14"
          )}
        >
          <div className="min-w-0 max-w-2xl">
            <h1
              className={cn(
                "break-words text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl",
                onPhoto ? "text-white drop-shadow-sm" : "text-foreground"
              )}
            >
              {name}
            </h1>
            {description && (
              <p
                className={cn(
                  "mt-4 max-w-xl text-base leading-relaxed sm:text-lg",
                  onPhoto ? "text-white/90" : "text-foreground/80"
                )}
              >
                {description}
              </p>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-3">{actions}</div>
          </div>

          {stats.length > 0 && (
            <div
              className={cn(
                "grid shrink-0 grid-cols-2 gap-x-6 gap-y-4 rounded-2xl p-5 sm:grid-cols-4 lg:w-60 lg:grid-cols-1 lg:gap-5 lg:p-6",
                onPhoto
                  ? "border border-white/15 bg-black/45 text-white backdrop-blur-md"
                  : "border border-border bg-card text-foreground shadow-sm"
              )}
            >
              {stats.map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <Icon className={cn("h-5 w-5 shrink-0", onPhoto ? "text-white/90" : "text-accent")} />
                  <div className="min-w-0 leading-tight">
                    <p className="text-lg font-semibold">{value.toLocaleString()}</p>
                    <p className={cn("text-xs", onPhoto ? "text-white/70" : "text-muted-foreground")}>{label}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      {coverControl}
    </div>
  );
}

// A pill-shaped hero button. "solid" is the accent call to action; "glass" is
// the quieter second choice, frosted over a photo and outlined without one.
export function HeroLink({
  href,
  children,
  variant = "solid",
  onPhoto = true,
}: {
  href: string;
  children: ReactNode;
  variant?: "solid" | "glass";
  onPhoto?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition sm:text-base",
        variant === "solid"
          ? "bg-accent text-accent-foreground shadow-sm hover:opacity-90"
          : onPhoto
            ? "border border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
            : "border border-border bg-card text-foreground hover:bg-muted"
      )}
    >
      {children}
    </Link>
  );
}
