"use client";

import { useEffect, useMemo, useState, useSyncExternalStore, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { clearFormDraft, readJsonDraft, writeJsonDraft } from "@/lib/use-form-draft";
import { ART_COUNT, ART_THEMES, SIXTY_FOUR_ARTS, type Art, type ArtTheme } from "@/lib/arts/sixty-four-arts";
import type { ArtsBoardMarks } from "@/lib/data/arts-board";
import { setArtMark } from "./arts-board-actions";

// The 64 Arts board: an 8×8 grid of the classical arts (4×16 on a phone).
// Tapping a square flips it open to say what the art was and what to try; a
// family marks it done and the board circles it. Marks are the family's own
// (see the arts_board_marks migration), so the board is a private progress
// card, not a leaderboard.
//
// The original telling of each art is the default. The Under 15s switch swaps
// in the child-friendly version; it's a per-viewer reading preference, so it
// lives in this browser rather than on the account.

const THEME_COLOURS: Record<ArtTheme, string> = {
  music: "#8a5a83",
  art: "#c0704d",
  words: "#4f6d8f",
  craft: "#8b6b3e",
  nature: "#4d7a52",
  home: "#b0862a",
  body: "#b5627a",
  play: "#3f8a86",
};

const THEME_LABELS = Object.fromEntries(ART_THEMES.map((t) => [t.key, t.label])) as Record<ArtTheme, string>;

// --- The Under 15s preference ------------------------------------------------

const KIDS_KEY = "arts-board:under-15s";
const kidsListeners = new Set<() => void>();

function readKids(): boolean {
  try {
    return window.localStorage.getItem(KIDS_KEY) === "1";
  } catch {
    return false;
  }
}

function writeKids(on: boolean) {
  try {
    window.localStorage.setItem(KIDS_KEY, on ? "1" : "0");
  } catch {
    // Blocked storage: the switch still works for this visit.
  }
  kidsFallback = on;
  kidsListeners.forEach((l) => l());
}

// When storage is blocked the switch still has to move, so the last value set
// is kept here too.
let kidsFallback: boolean | null = null;

function useUnder15s(): [boolean, (on: boolean) => void] {
  const on = useSyncExternalStore(
    (listener) => {
      kidsListeners.add(listener);
      return () => kidsListeners.delete(listener);
    },
    () => kidsFallback ?? readKids(),
    () => false
  );
  return [on, writeKids];
}

function titleOf(art: Art, kids: boolean) {
  return kids ? art.kidsTitle : art.title;
}

// --- The board ---------------------------------------------------------------

type Filter = "all" | "todo" | ArtTheme;

export function ArtsBoardView({
  marks: savedMarks,
  spaceId,
  spaceName,
  spaceDescription,
  communitySlug,
  spaceSlug,
  canMark,
}: {
  marks: ArtsBoardMarks;
  spaceId: string;
  spaceName: string;
  spaceDescription: string | null;
  communitySlug: string;
  spaceSlug: string;
  canMark: boolean;
}) {
  const [kids, setKids] = useUnder15s();
  const [filter, setFilter] = useState<Filter>("all");
  const [openArt, setOpenArt] = useState<number | null>(null);
  // Optimistic copy of the family's marks: a tick shows the circle at once,
  // and the server's answer replaces it on refresh.
  const [optimistic, setOptimistic] = useState<ArtsBoardMarks>({});
  const marks = useMemo(() => ({ ...savedMarks, ...optimistic }), [savedMarks, optimistic]);

  const doneCount = SIXTY_FOUR_ARTS.filter((a) => marks[a.n]?.done).length;
  const visible = (art: Art) =>
    filter === "all" ? true : filter === "todo" ? !marks[art.n]?.done : art.theme === filter;
  const open = openArt ? SIXTY_FOUR_ARTS[openArt - 1] : null;

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">The 64 arts</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{spaceName}</h1>

      <section className="mt-4 rounded-[var(--radius)] border border-border border-l-4 border-l-accent bg-card px-5 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Why 64 arts?</p>
        <div className="mt-1.5 max-w-3xl space-y-2 text-[15px] leading-relaxed text-foreground">
          <p>
            In ancient India, a well-educated person was expected to learn 64 arts. They were not separate subjects.
            Music, poetry, carpentry, cooking, gardening, architecture, languages and good conversation all belonged to
            one education, the making of a complete person.
          </p>
          <p>
            Today we split those skills up: the arts and humanities in one place, science in another, practical trades
            somewhere else, and games and social skills left to playtime. The 64 arts put them back together.
          </p>
          <p className="font-semibold text-accent">
            So here is the question this board asks your family: what would learning look like if music, woodwork,
            poetry, gardening and the art of conversation were all part of the same school day?
          </p>
        </div>
      </section>

      <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
        {spaceDescription || "Tap a square to flip it, try the activity together, and mark it done to circle it on your family's board."}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-[var(--radius)] border border-border bg-card px-4 py-3">
        <p className="text-sm">
          <span className="font-semibold text-foreground">
            {doneCount} of {ART_COUNT}
          </span>{" "}
          <span className="text-muted-foreground">arts done</span>
        </p>
        <div className="h-2 min-w-32 flex-1 overflow-hidden rounded-full bg-muted" aria-hidden>
          <div className="h-full rounded-full bg-accent transition-[width]" style={{ width: `${(doneCount / ART_COUNT) * 100}%` }} />
        </div>
        {!canMark && <p className="w-full text-xs text-muted-foreground">Join the community to keep your family&apos;s board.</p>}
      </div>

      <div className="mt-4 flex flex-col-reverse gap-3 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Show">
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
            All 64
          </FilterChip>
          {ART_THEMES.map((t) => (
            <FilterChip key={t.key} active={filter === t.key} onClick={() => setFilter(t.key)} colour={THEME_COLOURS[t.key]}>
              {t.label}
            </FilterChip>
          ))}
          {canMark && (
            <FilterChip active={filter === "todo"} onClick={() => setFilter("todo")}>
              Not done yet
            </FilterChip>
          )}
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={kids}
          onClick={() => setKids(!kids)}
          className="flex shrink-0 items-center gap-2.5 self-start rounded-lg border border-border bg-card px-3 py-2 text-left"
        >
          <span className={cn("relative h-[22px] w-10 rounded-full transition-colors", kids ? "bg-accent" : "bg-border")}>
            <span
              className={cn(
                "absolute top-[3px] h-4 w-4 rounded-full bg-white shadow transition-[left]",
                kids ? "left-[21px]" : "left-[3px]"
              )}
            />
          </span>
          <span>
            <span className="block text-sm font-semibold text-foreground">Under 15s</span>
            <span className="block text-xs text-muted-foreground">
              {kids ? "On: activities reworked for children" : "Off: the original 64 arts"}
            </span>
          </span>
        </button>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-1.5 rounded-2xl border border-border bg-muted p-2 sm:grid-cols-8 sm:gap-2 sm:p-3">
        {SIXTY_FOUR_ARTS.map((art) => {
          const done = Boolean(marks[art.n]?.done);
          const colour = THEME_COLOURS[art.theme];
          return (
            <button
              key={art.n}
              type="button"
              onClick={() => setOpenArt(art.n)}
              aria-label={`${art.n}. ${titleOf(art, kids)}${done ? ", done" : ""}`}
              className={cn(
                "relative flex aspect-square flex-col justify-between overflow-hidden rounded-lg border border-border p-1.5 text-left transition-[transform,opacity] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:rounded-xl sm:p-2",
                done ? "bg-accent-soft" : "bg-card",
                !visible(art) && "opacity-25"
              )}
            >
              <span className="absolute inset-x-0 top-0 h-1" style={{ background: colour }} aria-hidden />
              {done && <DoneCircle />}
              <span className="relative text-[10px] font-semibold sm:text-[11px]" style={{ color: colour }}>
                {art.n}
              </span>
              <span className="relative">
                <span className="block text-[11px] font-semibold leading-tight text-foreground [overflow-wrap:anywhere] sm:text-[13px]">
                  {titleOf(art, kids)}
                </span>
                <span className="block truncate text-[8px] italic text-muted-foreground sm:text-[9.5px]">{art.sanskrit}</span>
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <span className="inline-block h-3.5 w-3.5 rounded-full border-2 border-accent" aria-hidden />
        Circled means your family has done it. Your board is only visible to your family.
      </p>

      {open && (
        <ArtCard
          key={open.n}
          art={open}
          kids={kids}
          mark={marks[open.n] ?? null}
          canMark={canMark}
          spaceId={spaceId}
          communitySlug={communitySlug}
          spaceSlug={spaceSlug}
          onClose={() => setOpenArt(null)}
          onMarked={(m) => setOptimistic((prev) => ({ ...prev, [open.n]: m }))}
        />
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  colour,
  children,
}: {
  active: boolean;
  onClick: () => void;
  colour?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[13px] transition-colors",
        active ? "border-foreground bg-foreground text-background" : "border-border bg-card text-foreground hover:bg-muted"
      )}
    >
      {colour && <span className="h-2 w-2 rounded-full" style={{ background: colour }} aria-hidden />}
      {children}
    </button>
  );
}

// A hand-drawn circle around a done square, with a tick in the corner.
function DoneCircle() {
  return (
    <>
      <svg className="pointer-events-none absolute inset-1 h-[calc(100%-0.5rem)] w-[calc(100%-0.5rem)]" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <path
          d="M50 4 C78 3 97 22 96 50 C95 78 76 97 49 96 C22 95 3 77 4 49 C5 24 24 6 54 5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          className="text-accent/75"
        />
      </svg>
      <span className="absolute right-1 top-1.5 grid h-4 w-4 place-items-center rounded-full bg-accent text-accent-foreground sm:right-1.5 sm:h-[18px] sm:w-[18px]" aria-hidden>
        <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
      </span>
    </>
  );
}

// --- The flipped card ----------------------------------------------------------

function ArtCard({
  art,
  kids,
  mark,
  canMark,
  spaceId,
  communitySlug,
  spaceSlug,
  onClose,
  onMarked,
}: {
  art: Art;
  kids: boolean;
  mark: { done: boolean; note: string | null } | null;
  canMark: boolean;
  spaceId: string;
  communitySlug: string;
  spaceSlug: string;
  onClose: () => void;
  onMarked: (mark: { done: boolean; note: string | null }) => void;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const draftKey = `arts-board:${spaceId}:${art.n}`;
  const savedNote = mark?.note ?? "";
  // A half-typed note survives a refresh (see use-form-draft); it is only
  // rendered after a tap, so reading storage here can't break hydration.
  const [note, setNote] = useState(() => {
    const draft = readJsonDraft(draftKey);
    if (!draft) return savedNote;
    try {
      const parsed: unknown = JSON.parse(draft);
      return typeof parsed === "string" ? parsed : savedNote;
    } catch {
      return savedNote;
    }
  });
  const done = mark?.done ?? false;
  const colour = THEME_COLOURS[art.theme];
  const noteChanged = note.trim() !== savedNote.trim();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function save(nextDone: boolean) {
    setError(null);
    start(async () => {
      const result = await setArtMark(spaceId, art.n, { done: nextDone, note }, communitySlug, spaceSlug);
      if (result.error) {
        setError(result.error);
        return;
      }
      clearFormDraft(draftKey);
      onMarked({ done: nextDone, note: note.trim() || null });
      router.refresh();
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/45 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg [perspective:1600px]">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={`art-${art.n}-title`}
          className="max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl bg-card shadow-2xl motion-safe:animate-[art-flip_450ms_cubic-bezier(.2,.7,.3,1)]"
        >
          <div
            className="relative border-b border-border px-6 pb-4 pt-5"
            style={{ background: `color-mix(in srgb, ${colour} 14%, var(--card))` }}
          >
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: colour }}>
              Art {art.n} of {ART_COUNT} · {THEME_LABELS[art.theme]}
            </p>
            <h2 id={`art-${art.n}-title`} className="mt-1 pr-10 text-2xl font-semibold text-foreground">
              {titleOf(art, kids)}
            </h2>
            <p className="text-sm italic text-muted-foreground">{art.sanskrit}</p>
            <button
              type="button"
              onClick={onClose}
              autoFocus
              aria-label="Flip back"
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-card/80 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="px-6 pb-6 pt-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">What it is</p>
            <p className="mt-1.5 text-[15px] leading-relaxed text-foreground">{kids ? art.kidsAbout : art.about}</p>

            <div className="mt-4 rounded-xl bg-accent-soft px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">Try this together</p>
              <p className="mt-1.5 text-[15px] leading-relaxed text-foreground">{kids ? art.kidsTask : art.task}</p>
            </div>

            {art.reframed && (
              <p className="mt-3 rounded-lg bg-muted px-3 py-2 text-[13px] text-muted-foreground">
                {kids ? `Reworked for under 15s: ${art.reframed}` : "Switch on Under 15s for a child-friendly version of this art."}
              </p>
            )}

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {kids ? "Under 15s" : "Teens and adults"}
              </span>
              {kids && art.grownUpHelp && (
                <span className="rounded-full bg-[#f6e9d3] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-[#8a5d17]">
                  Grown-up help
                </span>
              )}
            </div>

            {canMark && (
              <div className="mt-4">
                <label htmlFor={`art-${art.n}-note`} className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Our notes (optional)
                </label>
                <Textarea
                  id={`art-${art.n}-note`}
                  value={note}
                  onChange={(e) => {
                    setNote(e.target.value);
                    writeJsonDraft(draftKey, e.target.value);
                  }}
                  rows={3}
                  maxLength={1000}
                  placeholder="What you made, who loved it, what you'd try next"
                  disabled={pending}
                  className="mt-1.5"
                  data-no-draft
                />
                {noteChanged && (
                  <div className="mt-1.5 flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">Draft kept on this device</span>
                    <Button type="button" size="sm" variant="secondary" onClick={() => save(done)} disabled={pending} className="w-auto">
                      Save note
                    </Button>
                  </div>
                )}
              </div>
            )}

            {error && <p className="mt-2 text-sm text-danger">{error}</p>}

            <div className="mt-5 flex gap-2.5">
              <Button type="button" variant="ghost" onClick={onClose} className="w-auto border border-border">
                Flip back
              </Button>
              {canMark && (
                <Button type="button" onClick={() => save(!done)} disabled={pending} className="flex-1" aria-pressed={done}>
                  {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" strokeWidth={3} />}
                  {done ? "Done. Tap to undo" : "We did this"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
