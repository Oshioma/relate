"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Clapperboard, ExternalLink, Gamepad2, Globe, Headphones, Smartphone, Package, ShieldAlert, ShieldCheck, ShieldQuestion, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SafeImage } from "@/components/ui/safe-image";
import { cn } from "@/lib/utils";
import { ageRangeLabel, mediaKindLabel, mediaVerdictLabel, profanityLabel } from "@/lib/media/media-types";
import type { MediaConcern, MediaKind, MediaProfanity, MediaVerdict } from "@/types/database";

// One reviewed item, as a wide, shallow card: cover on the left, the facts a
// parent scans for on the right, one item per row. The full write-up lives on
// the item's own page, so the card clamps the description and the note to a
// couple of lines each rather than printing the whole review on the shelf.
//
// Shared by the community's own shelf and the "from other communities" list —
// they carry the same facts and differ only in what the corner offers
// (edit/remove, or "add to our shelf").

export type MediaCardData = {
  url: string;
  kind: MediaKind;
  title: string;
  creator: string | null;
  description: string;
  image_url: string | null;
  age_min: number | null;
  age_max: number | null;
  verdict: MediaVerdict;
  reason: string | null;
  profanity: MediaProfanity;
  concerns: MediaConcern[];
  themes: string[];
};

const KIND_ICONS: Record<MediaKind, LucideIcon> = {
  book: BookOpen,
  video: Clapperboard,
  audio: Headphones,
  game: Gamepad2,
  app: Smartphone,
  website: Globe,
  other: Package,
};

const VERDICT_STYLE: Record<MediaVerdict, { icon: LucideIcon; className: string }> = {
  suitable: { icon: ShieldCheck, className: "bg-accent-soft text-accent" },
  caution: { icon: ShieldQuestion, className: "bg-muted text-foreground" },
  not_suitable: { icon: ShieldAlert, className: "bg-danger/10 text-danger" },
};

// Where the link a review is about actually lives: "amazon.co.uk",
// "youtube.com". Shown beside the external link so a parent knows before
// tapping.
export function linkHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^(www|m)\./, "");
  } catch {
    return "the link";
  }
}

export function MediaCard({
  data,
  href,
  byline,
  footer,
}: {
  data: MediaCardData;
  // The item's own page in this app. When given, the title and picture open
  // it and the outside link is a smaller, labelled affair underneath; when
  // absent (another community's shelf, which has no page here) they open the
  // outside link directly.
  href?: string;
  // "Added by Sam · 2 days ago", or "From Riverside Homeschool".
  byline?: ReactNode;
  // Buttons for the top-right corner.
  footer?: ReactNode;
}) {
  const KindIcon = KIND_ICONS[data.kind] ?? Package;
  const verdict = VERDICT_STYLE[data.verdict] ?? VERDICT_STYLE.suitable;
  const VerdictIcon = verdict.icon;
  const age = ageRangeLabel(data.age_min, data.age_max);
  const picture = (
    <SafeImage
      srcs={[data.image_url]}
      alt=""
      className="h-36 w-24 rounded-md bg-muted object-cover sm:h-40 sm:w-28"
      fallback={
        <div className="flex h-36 w-24 items-center justify-center rounded-md bg-muted text-muted-foreground sm:h-40 sm:w-28">
          <KindIcon className="h-8 w-8" />
        </div>
      }
    />
  );

  return (
    <article className="flex gap-4 rounded-xl border border-border bg-card p-4 sm:gap-5">
      {href ? (
        <Link href={href} className="shrink-0" tabIndex={-1} aria-hidden>
          {picture}
        </Link>
      ) : (
        <a href={data.url} target="_blank" rel="noreferrer" className="shrink-0" tabIndex={-1} aria-hidden>
          {picture}
        </a>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium", verdict.className)}>
              <VerdictIcon className="h-3.5 w-3.5" />
              {mediaVerdictLabel(data.verdict)}
            </span>
            {age && (
              <Badge tone="neutral" className="normal-case">
                {age}
              </Badge>
            )}
            <Badge tone="neutral" className="normal-case">
              {mediaKindLabel(data.kind)}
            </Badge>
          </div>
          {footer && <div className="flex shrink-0 items-center gap-2">{footer}</div>}
        </div>

        <h3 className="mt-2 text-lg font-semibold leading-snug text-foreground">
          {href ? (
            <Link href={href} className="hover:underline">
              {data.title}
            </Link>
          ) : (
            <a href={data.url} target="_blank" rel="noreferrer" className="hover:underline">
              {data.title}
              <ExternalLink className="ml-1 inline h-3.5 w-3.5 text-muted-foreground" />
            </a>
          )}
        </h3>
        {data.creator && <p className="truncate text-sm text-muted-foreground">{data.creator}</p>}

        {data.description && <p className="mt-2 line-clamp-2 text-sm text-foreground">{data.description}</p>}

        {data.reason && (
          // The clamp sits on the text, not the padded box: clamping the box
          // itself let a sliver of the third line show through its padding.
          <div className={cn("mt-2 rounded-md px-3 py-1.5 text-sm", data.verdict === "not_suitable" ? "bg-danger/10 text-danger" : "bg-muted text-foreground")}>
            <p className="line-clamp-2">
              <span className="font-medium">{data.verdict === "not_suitable" ? "Why not: " : "Worth knowing: "}</span>
              {data.reason}
            </p>
          </div>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-3 text-xs text-muted-foreground">
          <span>{profanityLabel(data.profanity)}</span>
          {href && (
            <Link href={href} className="inline-flex items-center gap-1 font-medium text-accent hover:underline">
              Full review
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
          <a href={data.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-accent hover:underline">
            <ExternalLink className="h-3 w-3" />
            Open on {linkHost(data.url)}
          </a>
          {byline && <span className="ml-auto flex min-w-0 items-center">{byline}</span>}
        </div>
      </div>
    </article>
  );
}
