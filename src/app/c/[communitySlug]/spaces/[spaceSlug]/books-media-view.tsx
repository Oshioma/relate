"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Download, Library, Loader2, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { cn, formatRelativeTime } from "@/lib/utils";
import { MEDIA_KINDS, mediaSearchText, type MediaItemRow, type SharedMediaItem } from "@/lib/media/media-types";
import { lessonLinkKey } from "@/lib/school/lesson-link-key";
import type { MediaKind } from "@/types/database";
import { MediaItemForm } from "./media-item-form";
import { MediaCard } from "./media-item-card";
import { deleteMediaItem, importSharedMediaItem, loadSharedMediaItems } from "./books-media-actions";

// The family media shelf.
//
// Two shelves, on purpose: what we'd happily hand to the children, and what
// we wouldn't — with the reason beside each. The second is as useful as the
// first: a parent who knows WHY a book was put back doesn't have to read it
// to find out.
//
// A community's shelf starts empty. "Bring in from other communities" shows
// what other shelves have shared, item by item, and each can be copied over
// with one tap — so a new homeschool isn't starting from nothing, and nobody's
// shelf fills up with reviews they didn't choose.

type Shelf = "good" | "not_suitable";

const CHIP = "rounded-full border px-3 py-1 text-xs font-medium";
const CHIP_ON = "border-accent bg-accent-soft text-accent";
const CHIP_OFF = "border-border text-muted-foreground hover:border-muted-foreground/40";

export function BooksMediaView({
  items,
  communityId,
  communitySlug,
  spaceId,
  spaceSlug,
  canPost,
  isStaff,
  userId,
  aiConfigured,
}: {
  items: MediaItemRow[];
  communityId: string;
  communitySlug: string;
  spaceId: string;
  spaceSlug: string;
  canPost: boolean;
  isStaff: boolean;
  userId: string;
  aiConfigured: boolean;
}) {
  const router = useRouter();
  const [shelf, setShelf] = useState<Shelf>("good");
  const [kind, setKind] = useState<MediaKind | "all">("all");
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [shared, setShared] = useState<SharedMediaItem[] | null>(null);
  const [sharedError, setSharedError] = useState<string | null>(null);
  const [loadingShared, startLoadingShared] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const q = query.trim().toLowerCase();
  const matches = (item: { kind: MediaKind; title: string; creator: string | null; description: string; themes: string[]; reason: string | null }) =>
    (kind === "all" || item.kind === kind) && (!q || mediaSearchText(item).includes(q));

  const good = useMemo(() => items.filter((i) => i.verdict !== "not_suitable"), [items]);
  const notSuitable = useMemo(() => items.filter((i) => i.verdict === "not_suitable"), [items]);
  const visible = (shelf === "good" ? good : notSuitable).filter(matches);

  const countByKind = useMemo(() => {
    const counts = new Map<string, number>();
    for (const i of items) counts.set(i.kind, (counts.get(i.kind) ?? 0) + 1);
    return counts;
  }, [items]);

  // Shared items already on our shelf (by link) aren't offered again.
  const ownKeys = useMemo(() => new Set(items.map((i) => i.link_key)), [items]);
  const sharedVisible = (shared ?? []).filter((s) => {
    const key = lessonLinkKey(s.url);
    return (!key || !ownKeys.has(key)) && matches(s) && (shelf === "good" ? s.verdict !== "not_suitable" : s.verdict === "not_suitable");
  });

  function bringIn() {
    setSharedError(null);
    startLoadingShared(async () => {
      const result = await loadSharedMediaItems(communityId);
      setShared(result.items);
      setSharedError(result.error);
    });
  }

  async function copyIn(item: SharedMediaItem) {
    setActionError(null);
    setBusyId(item.id);
    const result = await importSharedMediaItem(item.id, spaceId, communitySlug, spaceSlug);
    setBusyId(null);
    if (result.error) setActionError(result.error);
    else router.refresh();
  }

  async function remove(item: MediaItemRow) {
    if (!window.confirm(`Remove "${item.title}" from the shelf?`)) return;
    setActionError(null);
    setBusyId(item.id);
    const result = await deleteMediaItem(item.id, communitySlug, spaceSlug);
    setBusyId(null);
    if (result.error) setActionError(result.error);
    else router.refresh();
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the shelf…"
            className="w-full rounded-md border border-border bg-card py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={bringIn} disabled={loadingShared} className="w-auto shrink-0">
            {loadingShared ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {shared ? "Refresh other communities" : "Bring in from other communities"}
          </Button>
          {canPost && (
            <Button
              type="button"
              onClick={() => {
                setEditingId(null);
                setShowForm((v) => !v);
              }}
              className="w-auto shrink-0"
            >
              {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {showForm ? "Cancel" : "Add a book or video"}
            </Button>
          )}
        </div>
      </div>

      {showForm && !editingId && (
        <div className="mb-5">
          <MediaItemForm communitySlug={communitySlug} spaceId={spaceId} spaceSlug={spaceSlug} aiConfigured={aiConfigured} onDone={() => setShowForm(false)} />
        </div>
      )}

      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        <button type="button" onClick={() => setShelf("good")} className={cn(CHIP, shelf === "good" ? CHIP_ON : CHIP_OFF)}>
          Good for kids ({good.length})
        </button>
        <button type="button" onClick={() => setShelf("not_suitable")} className={cn(CHIP, shelf === "not_suitable" ? "border-danger bg-danger/10 text-danger" : CHIP_OFF)}>
          Not suitable ({notSuitable.length})
        </button>
        <span className="mx-1 hidden h-4 w-px bg-border sm:block" />
        <button type="button" onClick={() => setKind("all")} className={cn(CHIP, kind === "all" ? CHIP_ON : CHIP_OFF)}>
          Everything
        </button>
        {MEDIA_KINDS.map((k) => {
          const count = countByKind.get(k.value) ?? 0;
          if (count === 0 && !shared) return null;
          return (
            <button key={k.value} type="button" onClick={() => setKind(kind === k.value ? "all" : k.value)} className={cn(CHIP, kind === k.value ? CHIP_ON : CHIP_OFF)}>
              {k.plural}
              {count > 0 ? ` (${count})` : ""}
            </button>
          );
        })}
      </div>

      {actionError && <p className="mb-3 text-sm text-danger">{actionError}</p>}

      {visible.length === 0 ? (
        <EmptyState
          icon={<Library className="h-6 w-6" />}
          title={
            items.length === 0
              ? "The shelf is empty"
              : shelf === "not_suitable"
                ? notSuitable.length === 0
                  ? "Nothing on the not-suitable shelf yet"
                  : "Nothing matches"
                : "Nothing matches"
          }
          description={
            items.length === 0
              ? canPost
                ? "Paste a link to a book, video or show and the review fills itself in — or bring in what other homeschool communities have already checked."
                : "Books, videos and shows this community has checked for its children will show up here."
              : shelf === "not_suitable" && notSuitable.length === 0
                ? "When something is filed as not suitable, it lands here with the reason why."
                : "Try a different search or shelf."
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {visible.map((item) =>
            editingId === item.id ? (
              <div key={item.id} className="md:col-span-2">
                <MediaItemForm
                  communitySlug={communitySlug}
                  spaceId={spaceId}
                  spaceSlug={spaceSlug}
                  item={item}
                  aiConfigured={aiConfigured}
                  onDone={() => {
                    setEditingId(null);
                    router.refresh();
                  }}
                  onCancel={() => setEditingId(null)}
                />
              </div>
            ) : (
              <MediaCard
                key={item.id}
                data={item}
                byline={
                  <span className="flex items-center gap-2">
                    <Avatar src={item.creatorProfile?.avatar_url} name={item.creatorProfile?.full_name || item.creatorProfile?.username} size={20} />
                    <span className="truncate">
                      {item.creatorProfile?.full_name || item.creatorProfile?.username || "A member"} · {formatRelativeTime(item.created_at)}
                      {item.imported_from && " · brought in"}
                    </span>
                  </span>
                }
                details={<AiWriteUp analysis={item.ai_analysis} />}
                footer={
                  (isStaff || item.created_by === userId) && (
                    <>
                      <button
                        type="button"
                        title="Edit"
                        onClick={() => {
                          setShowForm(false);
                          setEditingId(item.id);
                        }}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button type="button" title="Remove" onClick={() => remove(item)} disabled={busyId === item.id} className="text-muted-foreground hover:text-danger disabled:opacity-60">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )
                }
              />
            )
          )}
        </div>
      )}

      {shared && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-foreground">From other homeschool communities</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Reviews other communities chose to share. {canPost ? "Add any to your own shelf — it becomes yours to edit." : "Join this community to add them to its shelf."}
          </p>
          {sharedError && <p className="mt-2 text-sm text-danger">{sharedError}</p>}
          {sharedVisible.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              {shared.length === 0 ? "No other community has shared anything yet." : "Nothing more on this shelf from other communities."}
            </p>
          ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {sharedVisible.map((item) => (
                <MediaCard
                  key={item.id}
                  data={item}
                  byline={
                    item.community_name ? (
                      item.community_slug ? (
                        <a href={`/c/${item.community_slug}`} className="hover:underline">
                          From {item.community_name}
                        </a>
                      ) : (
                        <span>From {item.community_name}</span>
                      )
                    ) : (
                      <span>From another community</span>
                    )
                  }
                  footer={
                    canPost && (
                      <Button type="button" size="sm" variant="secondary" onClick={() => copyIn(item)} disabled={busyId === item.id} className="w-auto">
                        {busyId === item.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                        Add to our shelf
                      </Button>
                    )
                  }
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

// The full write-up Claude gave when the item was reviewed, if it was.
function AiWriteUp({ analysis }: { analysis: unknown }) {
  if (!analysis || typeof analysis !== "object") return null;
  const a = analysis as { summary_for_parents?: unknown; sources?: unknown; confidence?: unknown };
  const summary = typeof a.summary_for_parents === "string" ? a.summary_for_parents : null;
  const sources = Array.isArray(a.sources) ? a.sources.filter((s): s is string => typeof s === "string") : [];
  if (!summary && sources.length === 0) return null;
  return (
    <div className="rounded-md bg-muted/40 px-3 py-2">
      <p className="text-xs font-medium text-muted-foreground">
        AI review{typeof a.confidence === "string" ? ` · ${a.confidence} confidence` : ""}
      </p>
      {summary && <p className="mt-1 text-sm text-foreground">{summary}</p>}
      {sources.length > 0 && (
        <ul className="mt-1 space-y-0.5 text-xs">
          {sources.map((s) => (
            <li key={s} className="truncate">
              <a href={s} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                {s}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
