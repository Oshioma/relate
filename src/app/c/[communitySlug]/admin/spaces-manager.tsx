"use client";

import { useMemo, useState, type DragEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, GraduationCap, Home, LayoutGrid, List, ListFilter, Move, Pin, Plus, Search, Users } from "lucide-react";
import { SpaceCard } from "./space-card";
import { BuiltinNavRow, type NextEventSummary } from "./builtin-nav-row";
import { reorderNavItems } from "./actions";
import { AccessBox, DragHandle, ROW_ABOUT, ROW_GRID, TypeChip } from "./space-row-parts";
import { cn } from "@/lib/utils";
import type { Space, SpaceJournalField, FeatureKey, SpaceType } from "@/types/database";
import type { NavGroupOption } from "@/lib/nav-groups";
import type { AccessCommunity, AccessTier } from "@/lib/access/model";

// A space's nav sub-links — the indented items that render under it in the
// sidebar. Today the only source is a business directory's featured categories
// (kind "featured_category", `ref` = the category value), but the shape is
// deliberately generic: a new space type that grows sub-links just contributes
// its own kind here and a matching branch in reorderSpaceSubNav (admin actions),
// and the manager renders and reorders it with no further changes.
export type NavSubItemKind = "featured_category";
export type NavSubItem = { kind: NavSubItemKind; ref: string; label: string };

// One draggable sidebar row: either a real space, or a built-in feature link
// (Events, Search). Both live in the same ordered list so an admin can place
// the built-in links anywhere among the spaces. `key` is a stable React/DnD
// key; `sort` is only used to pre-sort the incoming list. A space carries its
// nav sub-links so they can be expanded and reordered inline under its row.
export type NavManagerItem =
  | { kind: "space"; key: string; sort: number; space: Space; subItems: NavSubItem[] }
  | { kind: "builtin"; key: string; sort: number; itemKey: FeatureKey; label: string; showInNav: boolean };

type Tab = "all" | "spaces" | "events" | "courses";
const EVENT_TYPES: SpaceType[] = ["live", "meetups"];
const COURSE_TYPES: SpaceType[] = ["course", "lessons"];

function tabOf(item: NavManagerItem): Exclude<Tab, "all"> {
  if (item.kind === "builtin") return item.itemKey === "events" ? "events" : "spaces";
  if (EVENT_TYPES.includes(item.space.space_type)) return "events";
  if (COURSE_TYPES.includes(item.space.space_type)) return "courses";
  return "spaces";
}

function nameOf(item: NavManagerItem): string {
  return item.kind === "space" ? item.space.name : item.label;
}

// "Spaces & Content" in Admin: every space and built-in link as one row each,
// on the same columns (picture, about, who can open it, sidebar settings,
// menu). Filter by kind, search, pick a section, or see them grouped by
// sidebar section. Dragging reorders the sidebar and saves straight away; it
// only works on the full list, where the order on screen is the real order.
export function SpacesManager({
  items,
  communityId,
  communitySlug,
  journalFieldsBySpaceId,
  allowedTypes,
  paymentsEnabled,
  navGroups,
  tiers,
  tierIdsBySpaceId,
  accessCommunity,
  statsBySpaceId,
  eventsCoverUrl,
  nextEvent,
  previewButton,
}: {
  items: NavManagerItem[];
  communityId: string;
  communitySlug: string;
  journalFieldsBySpaceId: Record<string, SpaceJournalField[]>;
  // Space types the super admin permits for this community — the choices in a
  // space's Type dropdown.
  allowedTypes: SpaceType[];
  // Whether the community's Stripe account can take charges — gates the
  // per-space price control in the editor.
  paymentsEnabled: boolean;
  navGroups: NavGroupOption[];
  // For each space's "Who can open it?" picker.
  tiers: AccessTier[];
  tierIdsBySpaceId: Record<string, string[]>;
  accessCommunity: AccessCommunity;
  // Short counts per space ("124 posts").
  statsBySpaceId: Record<string, string[]>;
  eventsCoverUrl: string | null;
  nextEvent: NextEventSummary | null;
  // "Preview as member", when the viewer can use it.
  previewButton?: ReactNode;
}) {
  const router = useRouter();
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [tab, setTab] = useState<Tab>("all");
  const [query, setQuery] = useState("");
  const [section, setSection] = useState<string>("all");
  const [view, setView] = useState<"list" | "sections">("list");

  const sectionOf = (item: NavManagerItem) => (item.kind === "space" ? (item.space.nav_group ?? "") : "builtin");
  const counts = useMemo(() => {
    const c = { all: items.length + 1, spaces: 0, events: 0, courses: 0 };
    for (const item of items) c[tabOf(item)] += 1;
    return c;
  }, [items]);

  const q = query.trim().toLowerCase();
  const visible = items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => tab === "all" || tabOf(item) === tab)
    .filter(({ item }) => !q || nameOf(item).toLowerCase().includes(q))
    .filter(({ item }) => section === "all" || sectionOf(item) === section);
  const canDrag = tab === "all" && !q && section === "all" && view === "list";
  const showFeed = (tab === "all" || tab === "spaces") && (!q || "community feed".includes(q)) && section === "all";

  async function handleDrop(targetIndex: number) {
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      return;
    }
    const reordered = [...items];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(targetIndex, 0, moved);
    setDragIndex(null);
    await reorderNavItems(
      reordered.map((item, i) =>
        item.kind === "space"
          ? { kind: "space" as const, ref: item.space.id, sort_order: i }
          : { kind: "builtin" as const, ref: item.itemKey, sort_order: i }
      ),
      communityId,
      communitySlug
    );
    router.refresh();
  }

  function renderRow(item: NavManagerItem, i: number) {
    const dragHandlers = canDrag
      ? {
          draggable: true,
          onDragStart: () => setDragIndex(i),
          onDragOver: (e: DragEvent) => e.preventDefault(),
          onDrop: () => handleDrop(i),
          onDragEnd: () => setDragIndex(null),
        }
      : { draggable: false, onDragStart: () => {}, onDragOver: () => {}, onDrop: () => {}, onDragEnd: () => {} };
    return item.kind === "space" ? (
      <SpaceCard
        key={item.key}
        space={item.space}
        communitySlug={communitySlug}
        journalFields={journalFieldsBySpaceId[item.space.id] ?? []}
        subItems={item.subItems}
        allowedTypes={allowedTypes}
        paymentsEnabled={paymentsEnabled}
        navGroups={navGroups}
        tiers={tiers}
        tierIds={tierIdsBySpaceId[item.space.id] ?? []}
        accessCommunity={accessCommunity}
        isDragging={dragIndex === i}
        dragHandlers={dragHandlers}
        stats={statsBySpaceId[item.space.id] ?? []}
      />
    ) : (
      <BuiltinNavRow
        key={item.key}
        itemKey={item.itemKey}
        label={item.label}
        showInNav={item.showInNav}
        communityId={communityId}
        communitySlug={communitySlug}
        isDragging={dragIndex === i}
        dragHandlers={dragHandlers}
        eventsPublic={accessCommunity.privacy === "public" || accessCommunity.events_public}
        eventsCoverUrl={eventsCoverUrl}
        nextEvent={nextEvent}
      />
    );
  }

  const tabs: { key: Tab; label: string; icon: typeof List }[] = [
    { key: "all", label: "All", icon: List },
    { key: "spaces", label: "Spaces", icon: Users },
    { key: "events", label: "Events", icon: CalendarDays },
    { key: "courses", label: "Courses", icon: GraduationCap },
  ];

  const groupsForView = [
    ...navGroups.map((g) => ({ key: g.key, label: g.label })),
    { key: "", label: "Ungrouped" },
    { key: "builtin", label: "Built-in links" },
  ];

  return (
    <div className="space-y-4 @container">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 id="spaces" className="scroll-mt-20 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Spaces &amp; Content
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Organise your spaces, events and content. Drag to reorder. Your feed always stays at the top.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {previewButton}
          <a
            href="#add-space"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
          >
            <Plus className="h-4 w-4" />
            Add space
          </a>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Show">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded-lg border px-3.5 text-sm font-medium transition-colors",
                tab === key ? "border-accent bg-accent text-accent-foreground" : "border-border bg-card text-foreground hover:bg-muted"
              )}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {label} ({counts[key]})
            </button>
          ))}
        </div>
        <div className="flex w-full flex-wrap gap-2 sm:w-auto">
          <label className="relative min-w-0 flex-1 sm:w-56 sm:flex-none">
            <span className="sr-only">Search spaces</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search spaces…"
              className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <label className="relative">
            <span className="sr-only">Sidebar section</span>
            <ListFilter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="h-10 rounded-lg border border-border bg-card pl-9 pr-8 text-sm text-foreground"
            >
              <option value="all">All sections</option>
              {groupsForView.map((g) => (
                <option key={g.key || "ungrouped"} value={g.key}>
                  {g.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-accent-soft/60 px-4 py-2.5">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Move className="h-4 w-4" aria-hidden />
          {canDrag ? "Drag to reorder. Changes save automatically." : "Changes save automatically. Clear the filters to drag rows into a new order."}
        </p>
        <div className="flex gap-1" role="group" aria-label="Layout">
          {(
            [
              ["list", "List", List],
              ["sections", "Sections", LayoutGrid],
            ] as const
          ).map(([key, label, Icon]) => (
            <button
              key={key}
              type="button"
              aria-pressed={view === key}
              onClick={() => setView(key)}
              className={cn(
                "inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium transition-colors",
                view === key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {label}
            </button>
          ))}
        </div>
      </div>

      {showFeed && (
        <div className="rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <div className={ROW_GRID}>
            <DragHandle disabled />
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-muted text-foreground @5xl:h-20 @5xl:w-20">
              <Home className="h-7 w-7" aria-hidden />
            </div>
            <div className={ROW_ABOUT}>
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <p className="text-base font-semibold text-foreground">Community Feed</p>
                <TypeChip tone="pinned">Always at top</TypeChip>
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">Main feed for all community activity</p>
            </div>
            <AccessBox
              choice={accessCommunity.privacy === "invite_only" ? "members" : accessCommunity.privacy === "public" || accessCommunity.feed_public ? "everyone" : "members"}
              title={accessCommunity.privacy === "public" || (accessCommunity.feed_public && accessCommunity.privacy !== "invite_only") ? "Everyone" : "Members"}
              detail={accessCommunity.privacy === "public" || (accessCommunity.feed_public && accessCommunity.privacy !== "invite_only") ? "Open to visitors" : "Visitors see the front page"}
            />
            <div className="col-span-3 flex items-start gap-3 rounded-xl bg-accent-soft/60 px-4 py-3 @2xl:col-span-2">
              <Pin className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
              <div>
                <p className="text-sm font-medium text-foreground">Fixed at top</p>
                <p className="text-xs text-muted-foreground">Your feed always stays at the top.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {view === "list" ? (
        <div className="space-y-3">{visible.map(({ item, index }) => renderRow(item, index))}</div>
      ) : (
        <div className="space-y-6">
          {groupsForView.map((group) => {
            const rows = visible.filter(({ item }) => sectionOf(item) === group.key);
            if (rows.length === 0) return null;
            return (
              <section key={group.key || "ungrouped"} className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{group.label}</h3>
                {rows.map(({ item, index }) => renderRow(item, index))}
              </section>
            );
          })}
        </div>
      )}

      {visible.length === 0 && !showFeed && <p className="py-6 text-center text-sm text-muted-foreground">Nothing matches. Try another search or section.</p>}
    </div>
  );
}
