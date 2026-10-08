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
  headline,
  name = null,
  description,
  cover,
  stats,
  actions,
  coverControl,
}: {
  headline: string;
  // The community's name, when the headline is a tagline rather than the name
  // itself: set in the headline's type on the right of the cover (above the
  // headline on narrower screens, where there's no right side to use).
  name?: string | null;
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
          // Heavier than a typical scrim on purpose: covers are often banners
          // with their own lettering baked in, and that has to recede behind
          // the headline rather than compete with it.
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/60 to-black/30 xl:bg-gradient-to-r xl:from-black/85 xl:via-black/45 xl:to-black/70" />
        )}
        <div
          className={cn(
            "mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 xl:flex-row xl:items-center xl:justify-between xl:gap-10",
            onPhoto ? "min-h-[340px] justify-end py-8 sm:min-h-[400px] sm:py-10 xl:py-12" : "py-8 sm:py-12"
          )}
        >
          <div className="min-w-0 max-w-3xl">
            {name && (
              <p
                className={cn(
                  "mb-4 break-words text-4xl font-bold leading-none tracking-tight sm:text-5xl xl:hidden",
                  onPhoto ? "text-white drop-shadow-sm" : "text-foreground"
                )}
              >
                {name}
              </p>
            )}
            <h1
              className={cn(
                "break-words text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl xl:text-6xl",
                onPhoto ? "text-white drop-shadow-sm" : "text-foreground"
              )}
            >
              {headline}
            </h1>
            {description && (
              <p
                className={cn(
                  "mt-4 line-clamp-4 max-w-2xl text-base leading-relaxed sm:text-lg",
                  onPhoto ? "text-white/90" : "text-foreground/80"
                )}
              >
                {description}
              </p>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-3">{actions}</div>
          </div>

          {(name || stats.length > 0) && (
            <div className="flex shrink-0 flex-col gap-6 xl:max-w-md xl:items-end">
              {name && (
                <p
                  className={cn(
                    "hidden break-words text-right text-7xl font-bold leading-[0.95] tracking-tight xl:block 2xl:text-8xl",
                    onPhoto ? "text-white drop-shadow-sm" : "text-foreground"
                  )}
                >
                  {name}
                </p>
              )}
              {stats.length > 0 && (
                <div
                  className={cn(
                    "flex w-fit shrink-0 flex-wrap gap-x-8 gap-y-3 rounded-2xl px-5 py-4 xl:w-56 xl:flex-col xl:gap-5 xl:p-6",
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
  external = false,
}: {
  href: string;
  children: ReactNode;
  variant?: "solid" | "glass";
  onPhoto?: boolean;
  // Off-site links (a video) open in a new tab.
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
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
