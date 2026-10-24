"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { LocateFixed, MapPin, X } from "lucide-react";
import { GuideImage } from "./guide-image";
import { byDistance, FAR_AWAY_KM, formatDistance, type LatLng } from "@/lib/guides/place-guide/distance";

// "What's around me?" on a place guide (beach bars, restaurants): area cards
// at the top of the page, and the guide's entries below filtered to the area
// picked, or sorted nearest-first from the reader's location. The cards and
// the list sit far apart on the page, so they talk through the URL hash
// (#area-nungwi, #near-me — shareable) and a window event; the server renders
// every entry, so the full guide is what search engines and no-JS readers get.

const SELECT_EVENT = "guide-area-select";

type Selection = { type: "all" } | { type: "area"; id: string } | { type: "near" };

function selectionFromHash(hash: string): Selection | null {
  const h = hash.replace(/^#/, "");
  if (h === "near-me") return { type: "near" };
  if (h.startsWith("area-")) return { type: "area", id: h.slice(5) };
  return null;
}

function select(hash: string) {
  // replaceState: switching areas shouldn't fill the back button.
  history.replaceState(null, "", hash ? `#${hash}` : location.pathname + location.search);
  window.dispatchEvent(new CustomEvent(SELECT_EVENT, { detail: hash }));
}

export type AreaCard = { id: string; label: string; count: number; photo: { src: string; alt: string; width?: number } | null };

export function AreaCards({ areas, noun }: { areas: AreaCard[]; noun: string }) {
  return (
    <section aria-labelledby="area-cards-title" className="mt-6">
      <h2 id="area-cards-title" className="text-base font-semibold text-foreground">
        Where are you?
      </h2>
      <p className="text-sm text-muted-foreground">Tap your area to see just the {noun} around you.</p>
      <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        <li>
          <button
            type="button"
            onClick={() => select("near-me")}
            className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-md border border-accent/40 bg-accent-soft p-3 text-center text-accent hover:bg-accent/15"
          >
            <LocateFixed className="h-7 w-7" aria-hidden />
            <span className="text-sm font-semibold">Near me</span>
            <span className="text-xs text-muted-foreground">Closest {noun} first</span>
          </button>
        </li>
        {areas.map((a) => (
          <li key={a.id} className="min-w-0">
            <button type="button" onClick={() => select(`area-${a.id}`)} className="group relative block w-full overflow-hidden rounded-md text-left">
              {a.photo ? (
                <GuideImage src={a.photo.src} alt="" width={a.photo.width} sizes="(min-width: 1024px) 230px, (min-width: 640px) 25vw, 50vw" className="aspect-[4/3] transition-transform group-hover:scale-105" />
              ) : (
                <div className="aspect-[4/3] bg-muted" />
              )}
              <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" aria-hidden />
              <span className="absolute inset-x-0 bottom-0 p-2.5 text-white">
                <span className="block text-sm font-semibold leading-tight">{a.label}</span>
                <span className="block text-xs text-white/85">
                  {a.count} {noun}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

type NearState = { status: "locating" } | { status: "ok"; from: LatLng } | { status: "error"; message: string };

export function AreaFilteredPlaces({
  index,
  items,
  areas,
  coords,
  noun,
}: {
  // The numbered list of every entry, shown when nothing is filtered.
  index: ReactNode;
  // Every entry, server-rendered, in the guide's order.
  items: { key: string; node: ReactNode }[];
  areas: { id: string; label: string; placeKeys: string[] }[];
  coords: Record<string, LatLng | undefined>;
  noun: string;
}) {
  const [selection, setSelection] = useState<Selection>({ type: "all" });
  const [near, setNear] = useState<NearState | null>(null);
  // The element to scroll to once the filtered list has rendered; the tick
  // re-renders even when the selection is unchanged (the same card twice).
  const scrollTarget = useRef<string | null>(null);
  const [scrollTick, setScrollTick] = useState(0);
  const scrollAfterRender = useCallback((id: string) => {
    scrollTarget.current = id;
    setScrollTick((t) => t + 1);
  }, []);

  const apply = useCallback((next: Selection, scroll: boolean) => {
    setSelection(next);
    if (next.type === "near") {
      if (!("geolocation" in navigator)) {
        setNear({ status: "error", message: "Your browser can't share its location — pick your area instead." });
      } else {
        setNear({ status: "locating" });
        navigator.geolocation.getCurrentPosition(
          (pos) => setNear({ status: "ok", from: { lat: pos.coords.latitude, lng: pos.coords.longitude } }),
          (err) =>
            setNear({
              status: "error",
              message: err.code === err.PERMISSION_DENIED ? "Location is turned off for this site — pick your area instead." : "We couldn't find your location — pick your area instead.",
            }),
          { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
        );
      }
    }
    if (scroll) scrollAfterRender("place-filter");
  }, [scrollAfterRender]);

  useEffect(() => {
    // Arriving on a shared #area-… or #near-me link.
    const initial = selectionFromHash(location.hash);
    const frame = initial ? requestAnimationFrame(() => apply(initial, true)) : 0;
    const onSelect = (e: Event) => apply(selectionFromHash((e as CustomEvent<string>).detail) ?? { type: "all" }, true);
    // A link to an entry the filter is hiding (the section nav, "Find your
    // spot") shows everything again, then scrolls to it.
    const onHash = () => {
      const h = location.hash.slice(1);
      const s = selectionFromHash(h);
      if (s) return apply(s, true);
      if (items.some((i) => i.key === h)) {
        setSelection({ type: "all" });
        scrollAfterRender(h);
      }
    };
    window.addEventListener(SELECT_EVENT, onSelect);
    window.addEventListener("hashchange", onHash);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener(SELECT_EVENT, onSelect);
      window.removeEventListener("hashchange", onHash);
    };
  }, [apply, items, scrollAfterRender]);

  useEffect(() => {
    if (!scrollTarget.current) return;
    document.getElementById(scrollTarget.current)?.scrollIntoView({ block: "start" });
    scrollTarget.current = null;
  }, [scrollTick]);

  const byKey = useMemo(() => new Map(items.map((i) => [i.key, i.node])), [items]);
  const area = selection.type === "area" ? areas.find((a) => a.id === selection.id) : undefined;

  let shown: { key: string; km: number | null }[];
  if (selection.type === "near" && near?.status === "ok") {
    shown = byDistance(
      items.map((i) => i.key),
      coords,
      near.from,
    );
  } else if (area) {
    const keys = new Set(area.placeKeys);
    shown = items.filter((i) => keys.has(i.key)).map((i) => ({ key: i.key, km: null }));
  } else {
    shown = items.map((i) => ({ key: i.key, km: null }));
  }
  const farAway = selection.type === "near" && near?.status === "ok" && (shown[0]?.km ?? 0) > FAR_AWAY_KM;
  const filtered = selection.type !== "all";

  return (
    <>
      <div id="place-filter" className="mt-6 flex scroll-mt-24 flex-wrap items-center gap-2" role="group" aria-label={`Show ${noun} in`}>
        <Chip active={!filtered} onClick={() => select("")}>
          All
        </Chip>
        <Chip active={selection.type === "near"} onClick={() => select("near-me")}>
          <LocateFixed className="h-3.5 w-3.5" aria-hidden /> Near me
        </Chip>
        {areas.map((a) => (
          <Chip key={a.id} active={area?.id === a.id} onClick={() => select(`area-${a.id}`)}>
            {a.label}
          </Chip>
        ))}
      </div>

      <p className="mt-3 text-sm text-muted-foreground" aria-live="polite">
        {selection.type === "near" && near?.status === "locating" && <>Finding where you are…</>}
        {selection.type === "near" && near?.status === "error" && near.message}
        {selection.type === "near" && near?.status === "ok" && !farAway && <>All {items.length} {noun}, nearest to you first (as the crow flies).</>}
        {farAway && <>You seem to be away from Zanzibar, so these are sorted by distance from where you are now.</>}
        {area && (
          <>
            {shown.length} {noun} in {area.label}.
          </>
        )}
        {filtered && (
          <button type="button" onClick={() => select("")} className="ml-2 inline-flex items-center gap-1 font-medium text-accent hover:underline">
            <X className="h-3.5 w-3.5" aria-hidden /> {selection.type === "near" ? "Back to guide order" : `Show all ${items.length}`}
          </button>
        )}
      </p>

      {!filtered && index}

      <div className="mt-10 space-y-16">
        {shown.map(({ key, km }) => (
          // With a distance, the badge moves inside the entry's top rule.
          <div key={key} className={km !== null ? "border-t border-border pt-10 [&>section]:border-t-0 [&>section]:pt-3" : undefined}>
            {km !== null && (
              <p className="mb-2 inline-flex items-center gap-1 rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-semibold text-accent">
                <MapPin className="h-3.5 w-3.5" aria-hidden /> {formatDistance(km)} from you
              </p>
            )}
            {byKey.get(key)}
          </div>
        ))}
      </div>
    </>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-medium ${active ? "border-accent bg-accent text-white" : "border-border bg-card text-foreground hover:bg-muted"}`}
    >
      {children}
    </button>
  );
}
