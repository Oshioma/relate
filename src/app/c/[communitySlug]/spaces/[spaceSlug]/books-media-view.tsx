"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Download, Library, Loader2, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { cn, formatRelativeTime } from "@/lib/utils";
import { MEDIA_KINDS, mediaSearchText, suitsAge, type MediaItemRow, type SharedMediaItem } from "@/lib/media/media-types";
import { lessonLinkKey } from "@/lib/school/lesson-link-key";
import type { MediaKind } from "@/types/database";
import { MediaItemForm } from "./media-item-form";
import { MediaCard } from "./media-item-card";
import { deleteMediaItem, importSharedMediaItem, importSharedShelf, loadSharedMediaItems } from "./books-media-actions";

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
  // A child's age, to narrow the shelf to what was reviewed as suiting them.
  const [childAge, setChildAge] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [shared, setShared] = useState<SharedMediaItem[] | null>(null);
  const [sharedError, setSharedError] = useState<string | null>(null);
  const [loadingShared, startLoadingShared] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  // The card whose review is open beneath it. One at a time: the shelf is for
  // comparing, and two open reviews push everything else off the screen.
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [importNotice, setImportNotice] = useState<string | null>(null);

  const q = query.trim().toLowerCase();
  const age = childAge.trim() === "" ? null : Number(childAge);
  const matches = (item: { kind: MediaKind; title: string; creator: string | null; description: string; themes: string[]; reason: string | null; age_min: number | null; age_max: number | null }) =>
    (kind === "all" || item.kind === kind) &&
    (!q || mediaSearchText(item).includes(q)) &&
    (age == null || !Number.isFinite(age) || suitsAge(item, age));

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

  // Everything one community has shared that isn't on our shelf yet, in one
  // go. The server skips duplicates by link, so pressing it twice is safe.
  async function copyInShelf(communityId: string, label: string) {
    setActionError(null);
    setImportNotice(null);
    setBusyId(`shelf:${communityId}`);
    const result = await importSharedShelf(communityId, spaceId, communitySlug, spaceSlug);
    setBusyId(null);
    if (result.error) {
      setActionError(result.error);
      return;
    }
    setImportNotice(
      result.added === 0
        ? `Nothing new from ${label} — everything they've shared is already here.`
        : `Brought in ${result.added} ${result.added === 1 ? "item" : "items"} from ${label}${result.skipped > 0 ? `, skipped ${result.skipped} already here` : ""}.`
    );
    router.refresh();
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
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <div className="relative min-w-[12rem] max-w-xs flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the shelf…"
              className="w-full rounded-md border border-border bg-card py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="whitespace-nowrap">For a child aged</span>
            <input
              type="number"
              min={0}
              max={21}
              inputMode="numeric"
              value={childAge}
              onChange={(e) => setChildAge(e.target.value)}
              placeholder="any"
              aria-label="Child's age"
              className="w-16 rounded-md border border-border bg-card px-2 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
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
        <div className="space-y-3">
          {visible.map((item) =>
            editingId === item.id ? (
              <div key={item.id}>
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
                href={`/c/${communitySlug}/spaces/${spaceSlug}/media/${item.id}`}
                expanded={expandedId === item.id}
                onToggle={() => setExpandedId((current) => (current === item.id ? null : item.id))}
                details={<AiWriteUp analysis={item.ai_analysis} />}
                byline={
                  <span className="flex items-center gap-2">
                    <Avatar src={item.creatorProfile?.avatar_url} name={item.creatorProfile?.full_name || item.creatorProfile?.username} size={20} />
                    <span className="truncate">
                      {item.creatorProfile?.full_name || item.creatorProfile?.username || "A member"} · {formatRelativeTime(item.created_at)}
                      {item.imported_from && " · brought in"}
                    </span>
                  </span>
                }
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
          {importNotice && <p className="mt-2 text-sm text-accent">{importNotice}</p>}
          {sharedVisible.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              {shared.length === 0 ? "No other community has shared anything yet." : "Nothing more on this shelf from other communities."}
            </p>
          ) : (
            <div className="mt-4 space-y-6">
              {groupByCommunity(sharedVisible).map((group) => (
                <div key={group.communityId}>
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-foreground">
                      {group.slug ? (
                        <a href={`/c/${group.slug}`} className="hover:underline">
                          {group.label}
                        </a>
                      ) : (
                        group.label
                      )}
                      <span className="ml-2 font-normal text-muted-foreground">
                        {group.items.length} not yet on your shelf
                      </span>
                    </h3>
                    {canPost && group.items.length > 1 && (
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => copyInShelf(group.communityId, group.label)}
                        disabled={busyId === `shelf:${group.communityId}`}
                        className="w-auto"
                      >
                        {busyId === `shelf:${group.communityId}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                        Bring in everything from {group.label}
                      </Button>
                    )}
                  </div>
                  <div className="space-y-3">
                    {group.items.map((item) => (
                      <MediaCard
                        key={item.id}
                        data={item}
                        expanded={expandedId === item.id}
                        onToggle={() => setExpandedId((current) => (current === item.id ? null : item.id))}
                        byline={<span>From {group.label}</span>}
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
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

// Shared items by the community that shared them, in the order they first
// appear (newest sharer first, since the list is newest-first). An
// invite-only community is unlisted, so its rows carry no name or slug and
// are shown as "another community".
function groupByCommunity(items: SharedMediaItem[]): { communityId: string; label: string; slug: string | null; items: SharedMediaItem[] }[] {
  const groups = new Map<string, { communityId: string; label: string; slug: string | null; items: SharedMediaItem[] }>();
  for (const item of items) {
    const group = groups.get(item.community_id) ?? {
      communityId: item.community_id,
      label: item.community_name ?? "another community",
      slug: item.community_slug,
      items: [],
    };
    group.items.push(item);
    groups.set(item.community_id, group);
  }
  return [...groups.values()];
}

// The full write-up Claude gave when the item was reviewed, if it was.
function AiWriteUp({ analysis }: { analysis: unknown }) {
  if (!analysis || typeof analysis !== "object") return null;
  const a = analysis as { summary_for_parents?: unknown; sources?: unknown; confidence?: unknown };
  const summary = typeof a.summary_for_parents === "string" ? a.summary_for_parents : null;
  const sources = Array.isArray(a.sources) ? a.sources.filter((s): s is string => typeof s === "string") : [];
  if (!summary && sources.length === 0) return null;
  return (
    <section className="rounded-md bg-muted/40 px-3 py-2">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        The AI review{typeof a.confidence === "string" ? ` · ${a.confidence} confidence` : ""}
      </h4>
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
    </section>
  );
}
