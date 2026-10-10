"use client";

import { useState, type ReactNode } from "react";
import { BookOpen, Clapperboard, ExternalLink, Gamepad2, Globe, Headphones, Smartphone, Package, ShieldAlert, ShieldCheck, ShieldQuestion, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SafeImage } from "@/components/ui/safe-image";
import { cn } from "@/lib/utils";
import { ageRangeLabel, concernLabel, mediaKindLabel, mediaVerdictLabel, notableConcerns, profanityLabel } from "@/lib/media/media-types";
import type { MediaConcern, MediaKind, MediaProfanity, MediaVerdict } from "@/types/database";

// One reviewed item, as a card. Shared by the community's own shelf and the
// "from other communities" list — they carry the same facts and differ only
// in what the footer offers (edit/remove, or "add to our shelf").

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

export function MediaCard({
  data,
  byline,
  footer,
  details,
}: {
  data: MediaCardData;
  // "Added by Sam · 2 days ago", or "From Riverside Homeschool".
  byline?: ReactNode;
  // Buttons for the bottom-right corner.
  footer?: ReactNode;
  // Extra content for the expandable panel (the full AI write-up).
  details?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const KindIcon = KIND_ICONS[data.kind] ?? Package;
  const verdict = VERDICT_STYLE[data.verdict] ?? VERDICT_STYLE.suitable;
  const VerdictIcon = verdict.icon;
  const age = ageRangeLabel(data.age_min, data.age_max);
  const concerns = notableConcerns(data.concerns);
  const hasMore = concerns.length > 0 || Boolean(details) || data.themes.length > 0;

  return (
    <article className="flex gap-4 rounded-xl border border-border bg-card p-4">
      <a href={data.url} target="_blank" rel="noreferrer" className="shrink-0" tabIndex={-1} aria-hidden>
        <SafeImage
          srcs={[data.image_url]}
          alt=""
          className="h-28 w-20 rounded-md bg-muted object-cover"
          fallback={
            <div className="flex h-28 w-20 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <KindIcon className="h-7 w-7" />
            </div>
          }
        />
      </a>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium", verdict.className)}>
            <VerdictIcon className="h-3.5 w-3.5" />
            {mediaVerdictLabel(data.verdict)}
          </span>
          {age && <Badge tone="neutral">{age}</Badge>}
          <Badge tone="neutral" className="normal-case">
            {mediaKindLabel(data.kind)}
          </Badge>
        </div>

        <h3 className="mt-2 text-base font-semibold leading-snug text-foreground">
          <a href={data.url} target="_blank" rel="noreferrer" className="hover:underline">
            {data.title}
            <ExternalLink className="ml-1 inline h-3.5 w-3.5 text-muted-foreground" />
          </a>
        </h3>
        {data.creator && <p className="text-sm text-muted-foreground">{data.creator}</p>}

        {data.description && <p className="mt-2 text-sm text-foreground">{data.description}</p>}

        {data.reason && (
          <p className={cn("mt-2 rounded-md px-3 py-2 text-sm", data.verdict === "not_suitable" ? "bg-danger/10 text-danger" : "bg-muted text-foreground")}>
            <span className="font-medium">{data.verdict === "not_suitable" ? "Why not: " : "Worth knowing: "}</span>
            {data.reason}
          </p>
        )}

        <p className="mt-2 text-xs text-muted-foreground">{profanityLabel(data.profanity)}</p>

        {hasMore && (
          <button type="button" onClick={() => setOpen((v) => !v)} className="mt-1 text-xs font-medium text-accent hover:underline">
            {open ? "Less" : "More detail"}
          </button>
        )}

        {open && (
          <div className="mt-2 space-y-3 text-sm">
            {concerns.length > 0 && (
              <ul className="space-y-1">
                {concerns.map((c, i) => (
                  <li key={`${c.category}-${i}`}>
                    <span className="font-medium text-foreground">{concernLabel(c.category)}</span>
                    <span className="text-muted-foreground"> · {c.level}</span>
                    {c.note && <span className="text-foreground"> — {c.note}</span>}
                  </li>
                ))}
              </ul>
            )}
            {data.themes.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {data.themes.map((t) => (
                  <Badge key={t} tone="accent" className="normal-case">
                    {t}
                  </Badge>
                ))}
              </div>
            )}
            {details}
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
          <div className="min-w-0 text-xs text-muted-foreground">{byline}</div>
          <div className="flex shrink-0 items-center gap-2">{footer}</div>
        </div>
      </div>
    </article>
  );
}
