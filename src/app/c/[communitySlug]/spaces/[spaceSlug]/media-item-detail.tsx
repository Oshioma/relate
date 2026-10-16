"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, Pencil, Share2, Trash2 } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/safe-image";
import { cn, formatRelativeTime } from "@/lib/utils";
import {
  ageRangeLabel,
  concernLabel,
  mediaKindLabel,
  mediaVerdictLabel,
  profanityLabel,
  type MediaItemRow,
  type MediaMarks,
} from "@/lib/media/media-types";
import { MediaItemForm } from "./media-item-form";
import { FamilyNotes, MarkToggle } from "./media-marks";
import { linkHost } from "./media-item-card";
import { deleteMediaItem } from "./books-media-actions";

// The page for one item on the shelf. Everything the card shows, in full,
// plus the AI's own write-up and sources — and the way out to the shop or
// platform as a button that says where it goes.

export function MediaItemDetail({
  item,
  communitySlug,
  spaceSlug,
  spaceName,
  canManage,
  canMark,
  marks,
  aiConfigured,
}: {
  item: MediaItemRow;
  communitySlug: string;
  spaceSlug: string;
  spaceName: string;
  canManage: boolean;
  // An active member: may tick it and leave a note.
  canMark: boolean;
  marks: MediaMarks;
  aiConfigured: boolean;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shelfHref = `/c/${communitySlug}/spaces/${spaceSlug}`;
  const age = ageRangeLabel(item.age_min, item.age_max);
  const analysis = (item.ai_analysis && typeof item.ai_analysis === "object" ? item.ai_analysis : null) as {
    summary_for_parents?: unknown;
    sources?: unknown;
    confidence?: unknown;
  } | null;
  const summary = typeof analysis?.summary_for_parents === "string" ? analysis.summary_for_parents : null;
  const sources = Array.isArray(analysis?.sources) ? analysis.sources.filter((s): s is string => typeof s === "string") : [];
  const confidence = typeof analysis?.confidence === "string" ? analysis.confidence : null;
  const verdictTone =
    item.verdict === "not_suitable" ? "bg-danger/10 text-danger" : item.verdict === "caution" ? "bg-muted text-foreground" : "bg-accent-soft text-accent";

  async function remove() {
    if (!window.confirm(`Remove "${item.title}" from the shelf?`)) return;
    setError(null);
    setBusy(true);
    const result = await deleteMediaItem(item.id, communitySlug, spaceSlug);
    setBusy(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.push(shelfHref);
    router.refresh();
  }

  return (
    <div>
      <Link href={shelfHref} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        {spaceName}
      </Link>

      {editing ? (
        <div className="mt-4">
          <MediaItemForm
            communitySlug={communitySlug}
            spaceId={item.space_id}
            spaceSlug={spaceSlug}
            item={item}
            aiConfigured={aiConfigured}
            onDone={() => {
              setEditing(false);
              router.refresh();
            }}
            onCancel={() => setEditing(false)}
          />
        </div>
      ) : (
        <article className="mt-4">
          <div className="flex flex-col gap-5 sm:flex-row">
            <SafeImage
              srcs={[item.image_url]}
              alt=""
              loading="eager"
              className="h-64 w-44 shrink-0 rounded-lg bg-muted object-cover shadow-sm"
              fallback={<div className="flex h-64 w-44 shrink-0 items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground">No picture yet</div>}
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", verdictTone)}>{mediaVerdictLabel(item.verdict)}</span>
                {age && (
                <Badge tone="neutral" className="normal-case">
                  {age}
                </Badge>
              )}
                <Badge tone="neutral" className="normal-case">
                  {mediaKindLabel(item.kind)}
                </Badge>
              </div>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">{item.title}</h1>
              {item.creator && <p className="mt-1 text-base text-muted-foreground">{item.creator}</p>}

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open on {linkHost(item.url)}
                </a>
                {canManage && (
                  <>
                    <Button type="button" variant="secondary" onClick={() => setEditing(true)} disabled={busy} className="w-auto">
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button type="button" variant="ghost" onClick={remove} disabled={busy} className="w-auto text-muted-foreground hover:text-danger">
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
                  </>
                )}
              </div>
              {error && <p className="mt-2 text-sm text-danger">{error}</p>}
              <div className="mt-3 text-xs text-muted-foreground">
                <MarkToggle itemId={item.id} kind={item.kind} marks={marks} canMark={canMark} communitySlug={communitySlug} spaceSlug={spaceSlug} />
              </div>
            </div>
          </div>

          {item.description && <p className="mt-6 text-base leading-relaxed text-foreground">{item.description}</p>}

          {item.reason && (
            <div className={cn("mt-5 rounded-lg px-4 py-3 text-sm", verdictTone)}>
              <p className="font-semibold">{item.verdict === "not_suitable" ? "Why it isn't suitable" : "Worth knowing first"}</p>
              <p className="mt-1">{item.reason}</p>
            </div>
          )}

          <section className="mt-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">What a parent should know</h2>
            <ul className="mt-2 space-y-1.5 text-sm">
              <li>
                <span className="font-medium text-foreground">Language</span>
                <span className="text-muted-foreground"> — {profanityLabel(item.profanity)}</span>
              </li>
              {item.concerns.map((c, i) => (
                <li key={`${c.category}-${i}`}>
                  <span className="font-medium text-foreground">{concernLabel(c.category)}</span>
                  <span className="text-muted-foreground"> — {c.level}</span>
                  {c.note && <span className="text-foreground">. {c.note}</span>}
                </li>
              ))}
              {item.concerns.length === 0 && <li className="text-muted-foreground">Nothing else noted.</li>}
            </ul>
          </section>

          {item.themes.length > 0 && (
            <section className="mt-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">What&apos;s good about it</h2>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {item.themes.map((t) => (
                  <Badge key={t} tone="accent" className="normal-case">
                    {t}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          <div className="mt-6">
            <FamilyNotes itemId={item.id} kind={item.kind} marks={marks} canMark={canMark} communitySlug={communitySlug} spaceSlug={spaceSlug} />
          </div>

          {(summary || sources.length > 0) && (
            <section className="mt-6 rounded-lg border border-border bg-muted/40 px-4 py-3">
              <h2 className="text-sm font-semibold text-foreground">
                The AI review{confidence ? <span className="font-normal text-muted-foreground"> · {confidence} confidence</span> : null}
              </h2>
              {summary && <p className="mt-2 text-sm text-foreground">{summary}</p>}
              {sources.length > 0 && (
                <ul className="mt-2 space-y-1 text-xs">
                  {sources.map((s) => (
                    <li key={s} className="truncate">
                      <a href={s} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                        {s}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <Avatar src={item.creatorProfile?.avatar_url} name={item.creatorProfile?.full_name || item.creatorProfile?.username} size={20} />
              Added by {item.creatorProfile?.full_name || item.creatorProfile?.username || "a member"} · {formatRelativeTime(item.created_at)}
              {item.imported_from && " · brought in from another community"}
            </span>
            {item.share_with_other_communities && (
              <span className="inline-flex items-center gap-1">
                <Share2 className="h-3 w-3" />
                Shared with other communities
              </span>
            )}
          </div>
        </article>
      )}
    </div>
  );
}
