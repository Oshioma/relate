"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useMemo, useRef, useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Map as MapGL, Marker, Popup, NavigationControl, GeolocateControl, type MapRef } from "react-map-gl/maplibre";
import type { Map as MaplibreMap, Offset, StyleSpecification } from "maplibre-gl";
import { MapPin, Plus, Search, X, Maximize2, Minimize2, Satellite, Map as MapStyleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { colorForCategory } from "@/lib/map-pin-colors";
import { businessCategoryLabel } from "@/lib/business-categories";
import { createLandmark, deleteLandmark } from "./map-actions";
import { MapItemPopup, isEventSoon } from "./map-item-popup";
import { MAP_ITEM_KINDS, MAP_ITEM_KIND_ORDER, type MapItem } from "@/lib/map-item-kinds";
import { UNGUJA_BOUNDS_LNGLAT } from "@/lib/map-bounds";
import type { MapCategory, Landmark } from "@/types/database";
import type { MapPinnedBusiness } from "@/lib/data/map";

// Vector basemaps from OpenFreeMap — free, no API key, GPU-rendered by
// MapLibre for fractional zoom, rotation and crisp labels. Both get
// brand-tinted at runtime (see tintBasemap). Satellite stays raster (Esri).
const STYLE_LIGHT = "https://tiles.openfreemap.org/styles/positron";
const STYLE_DARK = "https://tiles.openfreemap.org/styles/dark";

const SATELLITE_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    esri: {
      type: "raster",
      tiles: ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
      tileSize: 256,
      maxzoom: 18,
      attribution: "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
    },
  },
  layers: [{ id: "esri", type: "raster", source: "esri" }],
};

// Recolor the basemap to the app's palette — cream land and sage water in
// light mode, true app-background land in dark — so the map reads as part
// of the product rather than a third-party embed. Layer ids vary between
// styles, so match loosely and ignore misses.
function tintBasemap(map: MaplibreMap, dark: boolean) {
  const style = map.getStyle();
  if (!style?.layers) return;
  const land = dark ? "#17181a" : "#faf9f5";
  const water = dark ? "#132125" : "#b9d3cc";
  for (const layer of style.layers) {
    try {
      if (layer.type === "background") map.setPaintProperty(layer.id, "background-color", land);
      if (layer.type === "fill" && /water|ocean/i.test(layer.id)) map.setPaintProperty(layer.id, "fill-color", water);
    } catch {
      // Style variations — skip layers that reject the property.
    }
  }
}

// Keyed by slug rather than the full BusinessCategory union — custom
// categories fall through to the shopfront default in businessIcon.
const BUSINESS_CATEGORY_EMOJI: Record<string, string> = {
  restaurant: "🍽️",
  cafe: "☕",
  shop: "🛍️",
  accommodation: "🛏️",
  service: "🛠️",
  health: "🩺",
  fitness: "🏋️",
  coworking: "💻",
  activity: "🏄",
  taxi: "🚕",
  other: "🏪",
};

// Classic teardrop marker, 24×34 viewBox scaled to 30×40, tip at bottom
// center — markers anchor "bottom" so the tip sits on the coordinate.
const PIN_PATH = "M12 .5C5.6.5.5 5.6.5 12c0 8.9 11.5 21.5 11.5 21.5S23.5 20.9 23.5 12C23.5 5.6 18.4.5 12 .5z";

function Pin({ color, inner, pulseColor, delay, highlight }: { color: string; inner: ReactNode; pulseColor?: string; delay: number; highlight?: boolean }) {
  return (
    <span className={`map-pin map-pin-enter ${highlight ? "map-pin-highlight" : ""}`} style={{ animationDelay: `${delay}ms` }}>
      {pulseColor && <span className="map-pin-pulse" style={{ top: 2, left: 2, width: 26, height: 26, background: pulseColor }} />}
      <svg width="30" height="40" viewBox="0 0 24 34" style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,.35))" }}>
        <path d={PIN_PATH} fill={color} stroke="#fff" strokeWidth="1.5" />
      </svg>
      <span className="map-pin-inner">{inner}</span>
    </span>
  );
}

// Cluster bubble: a conic-gradient ring segmented by the colors of the pins
// inside — a glanceable "what's here" donut — around a count.
function ClusterBubble({ count, colors, delay }: { count: number; colors: string[]; delay: number }) {
  const byColor = new Map<string, number>();
  for (const color of colors) byColor.set(color, (byColor.get(color) ?? 0) + 1);
  let acc = 0;
  const stops: string[] = [];
  for (const [color, n] of byColor) {
    const next = acc + (n / colors.length) * 100;
    stops.push(`${color} ${acc}% ${next}%`);
    acc = next;
  }
  const size = count >= 50 ? 52 : count >= 10 ? 46 : 40;
  return (
    <span
      className="map-cluster map-pin-enter"
      style={{ width: size, height: size, background: `conic-gradient(${stops.join(",")})`, animationDelay: `${delay}ms` }}
    >
      <span className="map-cluster-count">{count}</span>
    </span>
  );
}

// Below lg the list panel hides and pin taps open a bottom sheet instead of
// an anchored popup — cramped popups are the fastest way to feel dated on
// mobile.
function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const compute = () => setMobile(mq.matches);
    compute();
    mq.addEventListener("change", compute);
    return () => mq.removeEventListener("change", compute);
  }, []);

  return mobile;
}

// The app's dual theme strategy (globals.css): explicit data-theme wins,
// otherwise the OS preference. Watch both so the basemap flips live.
function useIsDarkTheme(): boolean {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const compute = () => {
      const theme = root.dataset.theme;
      setDark(theme === "dark" || (theme !== "light" && mq.matches));
    };
    compute();
    const observer = new MutationObserver(compute);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    mq.addEventListener("change", compute);
    return () => {
      observer.disconnect();
      mq.removeEventListener("change", compute);
    };
  }, []);

  return dark;
}

type PinDef = {
  key: string;
  lat: number;
  lng: number;
  color: string;
  inner: ReactNode;
  pulseColor?: string;
  searchText: string;
  // For the synced list panel beside the map.
  title: string;
  subtitle: string;
  thumbUrl: string | null;
  thumbIcon: ReactNode;
  // A pin with an href navigates on click (businesses → their detail page)
  // rather than opening a popup, so popup is null for those.
  href?: string;
  popup: ReactNode;
};

// Web-Mercator world-pixel projection — clustering runs on pure math, no
// map instance needed, so it's immune to rotation and mid-animation camera
// states.
function projectMercator(lat: number, lng: number, zoom: number): { x: number; y: number } {
  const scale = 512 * Math.pow(2, zoom);
  const sin = Math.sin((lat * Math.PI) / 180);
  return {
    x: ((lng + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale,
  };
}

function unprojectMercator(x: number, y: number, zoom: number): { lat: number; lng: number } {
  const scale = 512 * Math.pow(2, zoom);
  const n = Math.PI - 2 * Math.PI * (y / scale);
  return {
    lng: (x / scale) * 360 - 180,
    lat: (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))),
  };
}

type Cluster = { sumX: number; sumY: number; pins: PinDef[] };

// Greedy centroid clustering: pins within ~52px at the current zoom merge
// into one bubble. Past zoom 16.5 everything renders individually.
function clusterPins(pins: PinDef[], zoom: number): Cluster[] {
  if (zoom >= 16.5) return pins.map((pin) => ({ sumX: 0, sumY: 0, pins: [pin] }));

  const RADIUS = 52;
  const result: Cluster[] = [];
  for (const pin of pins) {
    const pt = projectMercator(pin.lat, pin.lng, zoom);
    const hit = result.find((c) => Math.hypot(c.sumX / c.pins.length - pt.x, c.sumY / c.pins.length - pt.y) < RADIUS);
    if (hit) {
      hit.sumX += pt.x;
      hit.sumY += pt.y;
      hit.pins.push(pin);
    } else {
      result.push({ sumX: pt.x, sumY: pt.y, pins: [pin] });
    }
  }
  return result;
}

// Popup sits above the pin head (bottom anchors) but MapLibre auto-picks
// the anchor near edges, so give every direction a sane offset.
const POPUP_OFFSET: Offset = {
  center: [0, 0],
  top: [0, 10],
  "top-left": [0, 10],
  "top-right": [0, 10],
  bottom: [0, -44],
  "bottom-left": [0, -44],
  "bottom-right": [0, -44],
  left: [14, -20],
  right: [-14, -20],
};

function LandmarkPopup({
  landmark,
  communitySlug,
  spaceSlug,
  canDelete,
}: {
  landmark: Landmark;
  communitySlug: string;
  spaceSlug: string;
  canDelete: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    if (!window.confirm(`Remove "${landmark.name}" from the map?`)) return;
    startTransition(async () => {
      await deleteLandmark(landmark.id, communitySlug, spaceSlug);
      router.refresh();
    });
  }

  return (
    <div className="min-w-[180px] p-3">
      <p className="text-sm font-semibold text-foreground">{landmark.name}</p>
      {landmark.description && <p className="mt-1 text-xs text-muted-foreground">{landmark.description}</p>}
      {canDelete && (
        <button type="button" disabled={isPending} onClick={handleDelete} className="mt-2 text-xs font-medium text-danger hover:underline disabled:opacity-60">
          Remove
        </button>
      )}
    </div>
  );
}

function NewLandmarkForm({
  communityId,
  communitySlug,
  spaceId,
  spaceSlug,
  categories,
  pending,
  onDone,
  onCancel,
}: {
  communityId: string;
  communitySlug: string;
  spaceId: string;
  spaceSlug: string;
  categories: MapCategory[];
  pending: { lat: number; lng: number };
  onDone: () => void;
  onCancel: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createLandmark(undefined, formData);
      if (result?.error) {
        setError(result.error);
      } else {
        router.refresh();
        onDone();
      }
    });
  }

  return (
    <form action={handleSubmit} className="mt-3 space-y-3 rounded-lg border border-border bg-card p-4">
      <input type="hidden" name="community_id" value={communityId} />
      <input type="hidden" name="community_slug" value={communitySlug} />
      <input type="hidden" name="space_id" value={spaceId} />
      <input type="hidden" name="space_slug" value={spaceSlug} />
      <input type="hidden" name="lat" value={pending.lat} />
      <input type="hidden" name="lng" value={pending.lng} />

      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">Add a pin here</p>
        <button type="button" onClick={onCancel} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div>
        <Label htmlFor="landmark_name">Name</Label>
        <Input id="landmark_name" name="name" placeholder="Sunset Viewpoint" required />
      </div>

      {categories.length > 0 && (
        <div>
          <Label htmlFor="landmark_category">Layer (optional)</Label>
          <select
            id="landmark_category"
            name="category_id"
            defaultValue=""
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Uncategorized</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <Label htmlFor="landmark_description">Description (optional)</Label>
        <Textarea id="landmark_description" name="description" rows={2} />
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <Button type="submit" disabled={isPending} className="w-auto">
        {isPending ? "Adding…" : "Add pin"}
      </Button>
    </form>
  );
}

export default function ExploreMap({
  communityId,
  communitySlug,
  spaceId,
  spaceSlug,
  categories,
  landmarks,
  businesses,
  items,
  canPost,
  isAdmin,
  userId,
}: {
  communityId: string;
  communitySlug: string;
  spaceId: string;
  spaceSlug: string;
  categories: MapCategory[];
  landmarks: Landmark[];
  businesses: MapPinnedBusiness[];
  items: MapItem[];
  canPost: boolean;
  isAdmin: boolean;
  userId: string;
}) {
  const router = useRouter();
  const [hiddenKeys, setHiddenKeys] = useState<Set<string>>(new Set());
  const [businessCategory, setBusinessCategory] = useState<string>("all");
  const [location, setLocation] = useState<string>("all");
  const [localOnly, setLocalOnly] = useState(false);
  const [addMode, setAddMode] = useState(false);
  const [pending, setPending] = useState<{ lat: number; lng: number } | null>(null);
  const [satellite, setSatellite] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [zoom, setZoom] = useState(9.5);
  const [query, setQuery] = useState("");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [hoverKey, setHoverKey] = useState<string | null>(null);
  const [viewBounds, setViewBounds] = useState<[[number, number], [number, number]] | null>(null);
  const [sheetDragY, setSheetDragY] = useState(0);
  const [sheetDragging, setSheetDragging] = useState(false);
  const sheetStartY = useRef<number | null>(null);
  const isMobile = useIsMobile();
  const isDark = useIsDarkTheme();
  const mapRef = useRef<MapRef>(null);
  // setPaintProperty itself fires styledata — remember what's applied so the
  // tint pass doesn't re-trigger itself forever.
  const tintedRef = useRef("");

  const mapStyle = satellite ? SATELLITE_STYLE : isDark ? STYLE_DARK : STYLE_LIGHT;

  function handleStyleData() {
    const map = mapRef.current?.getMap();
    if (!map || satellite) return;
    const signature = `${isDark}`;
    if (tintedRef.current === signature) return;
    tintedRef.current = signature;
    tintBasemap(map, isDark);
  }

  // A style switch (satellite round-trip, theme flip) rebuilds all layers —
  // forget the previous tint so the next styledata pass reapplies it.
  useEffect(() => {
    tintedRef.current = "";
  }, [satellite, isDark]);

  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullscreen]);

  // Only kinds with pins get a filter pill — an empty "Jobs" toggle is noise.
  const presentKinds = MAP_ITEM_KIND_ORDER.filter((kind) => items.some((i) => i.kind === kind));

  // Only businesses that actually sit on the map (have coordinates) can be
  // filtered or counted — the directory-style chips mirror those.
  const mappableBusinesses = useMemo(
    () => businesses.filter((b) => b.lat !== null && b.lng !== null),
    [businesses]
  );

  // Directory-style category chips: every business category present on the
  // map, with a count, sorted by label. The map spans the whole community
  // rather than one directory space, so labels come from the slug (custom
  // per-space relabellings aren't in scope here — see businessCategoryLabel).
  const businessCategories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const b of mappableBusinesses) counts.set(b.category, (counts.get(b.category) ?? 0) + 1);
    return [...counts.entries()]
      .map(([value, count]) => ({ value, count, label: businessCategoryLabel(value) }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [mappableBusinesses]);

  const localCount = useMemo(() => mappableBusinesses.filter((b) => b.is_local).length, [mappableBusinesses]);

  // Location chips, also directory-style: each distinct location_label with a
  // count. Clicking one filters and flies the map to that area (selectLocation).
  const locations = useMemo(() => {
    const counts = new Map<string, number>();
    for (const b of mappableBusinesses) {
      if (!b.location_label) continue;
      counts.set(b.location_label, (counts.get(b.location_label) ?? 0) + 1);
    }
    return [...counts.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [mappableBusinesses]);

  function toggleKey(key: string) {
    setHiddenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  // Picking a directory filter — a specific business category, or Local —
  // means "show me these businesses": the map and the synced list narrow to
  // just them, setting aside landmarks and the living-map layers (events,
  // stays, …). "All" restores the full map.
  const businessFilterActive = businessCategory !== "all" || localOnly;

  const pins: PinDef[] = useMemo(() => {
    // Landmarks are reference points, not directory listings; they show
    // alongside everything on the full map but step aside once a business
    // filter narrows the view.
    const visibleLandmarks = businessFilterActive ? [] : landmarks;
    const visibleBusinesses = mappableBusinesses.filter((b) => {
      if (businessCategory !== "all" && b.category !== businessCategory) return false;
      if (location !== "all" && b.location_label !== location) return false;
      if (localOnly && !b.is_local) return false;
      return true;
    });
    const visibleItems = businessFilterActive
      ? []
      : items.filter((i) => !hiddenKeys.has(`__kind:${i.kind}`) && (location === "all" || i.locationLabel === location));

    return [
      ...visibleLandmarks.map((landmark) => ({
        key: `landmark:${landmark.id}`,
        lat: landmark.lat,
        lng: landmark.lng,
        color: colorForCategory(landmark.category_id),
        inner: <span style={{ display: "block", width: 8, height: 8, borderRadius: 9999, background: "#fff" }} />,
        searchText: `${landmark.name} ${landmark.description ?? ""}`.toLowerCase(),
        title: landmark.name,
        subtitle: categories.find((c) => c.id === landmark.category_id)?.name ?? "Landmark",
        thumbUrl: null,
        thumbIcon: <MapPin className="h-4 w-4" style={{ color: colorForCategory(landmark.category_id) }} />,
        popup: <LandmarkPopup landmark={landmark} communitySlug={communitySlug} spaceSlug={spaceSlug} canDelete={isAdmin || landmark.created_by === userId} />,
      })),
      ...visibleBusinesses.flatMap((business) =>
        business.lat !== null && business.lng !== null
          ? [{
              key: `business:${business.id}`,
              lat: business.lat,
              lng: business.lng,
              color: "#0f172a",
              inner: BUSINESS_CATEGORY_EMOJI[business.category] ?? "🏪",
              searchText: `${business.name} ${businessCategoryLabel(business.category)} ${business.description ?? ""}`.toLowerCase(),
              title: business.name,
              subtitle:
                business.google_rating !== null
                  ? `★ ${Number(business.google_rating).toFixed(1)} · ${businessCategoryLabel(business.category)}`
                  : businessCategoryLabel(business.category),
              thumbUrl: business.image_url,
              thumbIcon: BUSINESS_CATEGORY_EMOJI[business.category] ?? "🏪",
              // Clicking a business goes straight to its listing (under its own
              // directory space), so it carries an href instead of a popup.
              href: business.space_slug ? `/c/${communitySlug}/spaces/${business.space_slug}/businesses/${business.id}` : undefined,
              popup: null,
            }]
          : []
      ),
      ...visibleItems.map((item) => ({
        key: `${item.kind}:${item.id}`,
        lat: item.lat,
        lng: item.lng,
        color: MAP_ITEM_KINDS[item.kind].color,
        inner: MAP_ITEM_KINDS[item.kind].emoji,
        pulseColor: isEventSoon(item) ? MAP_ITEM_KINDS[item.kind].color : undefined,
        searchText: `${item.title} ${MAP_ITEM_KINDS[item.kind].label} ${item.description ?? ""}`.toLowerCase(),
        title: item.title,
        subtitle: item.meta ? `${MAP_ITEM_KINDS[item.kind].label} · ${item.meta}` : MAP_ITEM_KINDS[item.kind].label,
        thumbUrl: item.imageUrl,
        thumbIcon: MAP_ITEM_KINDS[item.kind].emoji,
        popup: <MapItemPopup item={item} />,
      })),
    ];
  }, [landmarks, mappableBusinesses, businessCategory, location, localOnly, businessFilterActive, items, hiddenKeys, categories, communitySlug, spaceSlug, isAdmin, userId]);

  const q = query.trim().toLowerCase();
  const filteredPins = useMemo(() => (q ? pins.filter((p) => p.searchText.includes(q)) : pins), [pins, q]);
  const clusters = useMemo(() => clusterPins(filteredPins, zoom), [filteredPins, zoom]);
  const selected = filteredPins.find((p) => p.key === selectedKey) ?? null;

  // The list panel mirrors the viewport — pan/zoom the map and the list
  // follows, like map-first browsing surfaces do.
  const inView = useMemo(() => {
    const within = viewBounds
      ? filteredPins.filter(
          (p) => p.lng >= viewBounds[0][0] && p.lng <= viewBounds[1][0] && p.lat >= viewBounds[0][1] && p.lat <= viewBounds[1][1]
        )
      : filteredPins;
    return [...within].sort((a, b) => a.title.localeCompare(b.title));
  }, [filteredPins, viewBounds]);

  // Selection and the sheet's drag state travel together — a fresh selection
  // must never inherit a half-dragged sheet transform.
  function selectPin(key: string | null) {
    setSelectedKey(key);
    setSheetDragY(0);
    setSheetDragging(false);
    sheetStartY.current = null;
  }

  function focusPin(pin: PinDef) {
    selectPin(pin.key);
    mapRef.current?.flyTo({ center: [pin.lng, pin.lat], zoom: Math.max(zoom, 14.5), duration: 650 });
  }

  // Selecting a location chip filters to it and flies the map to fit every
  // business there — "click a location, the map zooms to the area".
  function selectLocation(label: string) {
    const next = location === label ? "all" : label;
    setLocation(next);
    if (next === "all") return;
    const here = mappableBusinesses.filter((b) => b.location_label === next);
    if (here.length === 0) return;
    let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity;
    for (const b of here) {
      minLat = Math.min(minLat, b.lat as number);
      maxLat = Math.max(maxLat, b.lat as number);
      minLng = Math.min(minLng, b.lng as number);
      maxLng = Math.max(maxLng, b.lng as number);
    }
    mapRef.current?.fitBounds(
      [[minLng, minLat], [maxLng, maxLat]],
      { padding: 90, duration: 700, maxZoom: 15 }
    );
  }

  // Glide to the matching pins as the user types.
  useEffect(() => {
    if (!q || filteredPins.length === 0) return;
    const timer = setTimeout(() => {
      let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity;
      for (const pin of filteredPins) {
        minLat = Math.min(minLat, pin.lat);
        maxLat = Math.max(maxLat, pin.lat);
        minLng = Math.min(minLng, pin.lng);
        maxLng = Math.max(maxLng, pin.lng);
      }
      mapRef.current?.fitBounds(
        [[minLng, minLat], [maxLng, maxLat]],
        { padding: 90, duration: 700, maxZoom: 15 }
      );
    }, 350);
    return () => clearTimeout(timer);
  }, [q, filteredPins]);

  const glassButton = "rounded-md border border-border bg-card/85 p-2 text-foreground shadow-sm backdrop-blur hover:bg-card";
  const pillBase = "rounded-full border px-2.5 py-1 text-xs font-medium";

  return (
    <div>
      {/* Directory-style filters, front and centre: a category chip per
          business type on the map, then a location row that flies the map to
          the area. The living-map content types (events, stays, …) follow. */}
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => setBusinessCategory("all")}
          className={`${pillBase} ${businessCategory === "all" ? "border-accent bg-accent-soft text-accent" : "border-border text-muted-foreground hover:border-muted-foreground/40"}`}
        >
          All ({mappableBusinesses.length})
        </button>
        {localCount > 0 && (
          <button
            type="button"
            onClick={() => setLocalOnly((v) => !v)}
            className={`inline-flex items-center gap-1 ${pillBase} ${localOnly ? "border-accent bg-accent-soft text-accent" : "border-border text-muted-foreground hover:border-muted-foreground/40"}`}
          >
            <MapPin className={`h-3 w-3 ${localOnly ? "fill-accent" : ""}`} />
            Local ({localCount})
          </button>
        )}
        {businessCategories.map((c) => {
          const isActive = businessCategory === c.value;
          return (
            <button
              key={c.value}
              type="button"
              onClick={() => setBusinessCategory(isActive ? "all" : c.value)}
              className={`${pillBase} ${isActive ? "border-accent bg-accent-soft text-accent" : "border-border text-muted-foreground hover:border-muted-foreground/40"}`}
            >
              {c.label} ({c.count})
            </button>
          );
        })}
        {/* The living-map layers only make sense on the full map — a business
            filter sets them aside, so hide the (now inert) toggles. */}
        {!businessFilterActive &&
          presentKinds.map((kind) => {
            const key = `__kind:${kind}`;
            const cfg = MAP_ITEM_KINDS[kind];
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleKey(key)}
                className={`${pillBase} ${hiddenKeys.has(key) ? "border-border text-muted-foreground" : ""}`}
                style={hiddenKeys.has(key) ? undefined : { borderColor: cfg.color, color: cfg.color }}
              >
                {cfg.emoji} {cfg.label}
              </button>
            );
          })}

        <div className="ml-auto flex items-center gap-1.5">
          {canPost && (
            <Button type="button" size="sm" variant={addMode ? "secondary" : "primary"} onClick={() => setAddMode((v) => !v)} className="w-auto">
              <Plus className="h-3.5 w-3.5" />
              {addMode ? "Cancel" : "Add pin"}
            </Button>
          )}
        </div>
      </div>

      {locations.length > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setLocation("all")}
            className={`${pillBase} ${location === "all" ? "border-accent bg-accent-soft text-accent" : "border-border text-muted-foreground hover:border-muted-foreground/40"}`}
          >
            All locations
          </button>
          {locations.map(([label, count]) => {
            const isActive = location === label;
            return (
              <button
                key={label}
                type="button"
                onClick={() => selectLocation(label)}
                className={`${pillBase} ${isActive ? "border-accent bg-accent-soft text-accent" : "border-border text-muted-foreground hover:border-muted-foreground/40"}`}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>
      )}

      {addMode && <p className="mb-2 text-xs text-muted-foreground">Click anywhere on the map to place a pin.</p>}

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-3">
      <div
        className={
          fullscreen
            ? "fixed inset-0 z-[9999] bg-background"
            : "relative h-[65vh] min-h-[420px] overflow-hidden rounded-lg border border-border"
        }
      >
        <MapGL
          ref={mapRef}
          initialViewState={{ bounds: UNGUJA_BOUNDS_LNGLAT, fitBoundsOptions: { padding: 24 } }}
          mapStyle={mapStyle}
          maxZoom={satellite ? 18 : 19}
          cursor={addMode ? "crosshair" : "auto"}
          onLoad={(e) => {
            setZoom(e.target.getZoom());
            setViewBounds(e.target.getBounds().toArray() as [[number, number], [number, number]]);
            handleStyleData();
          }}
          onStyleData={handleStyleData}
          onError={(e) => console.error("Explore Map:", e.error)}
          onMoveEnd={(e) => {
            setZoom(e.viewState.zoom);
            setViewBounds(e.target.getBounds().toArray() as [[number, number], [number, number]]);
          }}
          onClick={(e) => {
            if (addMode) setPending({ lat: e.lngLat.lat, lng: e.lngLat.lng });
          }}
          attributionControl={{ compact: true }}
          style={{ height: "100%", width: "100%" }}
        >
          <NavigationControl position="bottom-right" visualizePitch />
          <GeolocateControl position="bottom-right" trackUserLocation />

          {clusters.map((cluster, i) => {
            if (cluster.pins.length === 1) {
              const pin = cluster.pins[0];
              const active = hoverKey === pin.key || selectedKey === pin.key;
              return (
                <Marker
                  key={pin.key}
                  longitude={pin.lng}
                  latitude={pin.lat}
                  anchor="bottom"
                  style={active ? { zIndex: 5 } : undefined}
                  onClick={(e) => {
                    e.originalEvent.stopPropagation();
                    if (addMode) return;
                    if (pin.href) router.push(pin.href);
                    else selectPin(pin.key);
                  }}
                >
                  <Pin color={pin.color} inner={pin.inner} pulseColor={pin.pulseColor} delay={Math.min(i * 25, 500)} highlight={active} />
                </Marker>
              );
            }
            const center = unprojectMercator(cluster.sumX / cluster.pins.length, cluster.sumY / cluster.pins.length, zoom);
            return (
              <Marker
                key={cluster.pins.map((p) => p.key).join("|")}
                longitude={center.lng}
                latitude={center.lat}
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  mapRef.current?.flyTo({ center: [center.lng, center.lat], zoom: Math.min(zoom + 2, 17), duration: 650 });
                }}
              >
                <ClusterBubble count={cluster.pins.length} colors={cluster.pins.map((p) => p.color)} delay={Math.min(i * 25, 500)} />
              </Marker>
            );
          })}

          {selected && !isMobile && (
            <Popup
              longitude={selected.lng}
              latitude={selected.lat}
              offset={POPUP_OFFSET}
              maxWidth="300px"
              closeOnClick
              onClose={() => selectPin(null)}
            >
              <div className="max-h-[380px] overflow-y-auto">{selected.popup}</div>
            </Popup>
          )}
        </MapGL>

        {/* On phones an anchored popup is cramped — pin taps open a bottom
            sheet instead, swipe-down (or backdrop tap) to dismiss. */}
        {isMobile && selected && (
          <>
            <button type="button" aria-label="Close" onClick={() => selectPin(null)} className="absolute inset-0 z-10 bg-black/25" />
            <div
              className={`map-sheet-enter absolute inset-x-0 bottom-0 z-20 rounded-t-2xl border-x border-t border-border bg-card shadow-2xl ${sheetDragging ? "" : "transition-transform duration-200"}`}
              style={{ transform: sheetDragY ? `translateY(${sheetDragY}px)` : undefined }}
            >
              <div
                className="flex touch-none justify-center py-2.5"
                onTouchStart={(e) => {
                  sheetStartY.current = e.touches[0].clientY;
                  setSheetDragging(true);
                }}
                onTouchMove={(e) => {
                  if (sheetStartY.current === null) return;
                  const delta = e.touches[0].clientY - sheetStartY.current;
                  if (delta > 0) setSheetDragY(delta);
                }}
                onTouchEnd={() => {
                  const shouldClose = sheetDragY > 80;
                  sheetStartY.current = null;
                  setSheetDragging(false);
                  setSheetDragY(0);
                  if (shouldClose) selectPin(null);
                }}
              >
                <span className="h-1 w-10 rounded-full bg-border" />
              </div>
              <div className="max-h-[60vh] overflow-y-auto pb-[max(1rem,env(safe-area-inset-bottom))] [&>div]:w-full">{selected.popup}</div>
            </div>
          </>
        )}

        <div className="absolute left-3 top-3 z-10">
          <div className="flex items-center gap-1.5 rounded-full border border-border bg-card/85 py-1.5 pl-3 pr-2 shadow-sm backdrop-blur">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the map"
              className="w-36 bg-transparent text-sm text-foreground outline-none transition-[width] duration-200 placeholder:text-muted-foreground focus:w-52"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground" title="Clear search">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          {q && (
            <p className="mt-1.5 inline-block rounded-full border border-border bg-card/85 px-2.5 py-0.5 text-[11px] text-muted-foreground shadow-sm backdrop-blur">
              {filteredPins.length === 0 ? "No matches" : `${filteredPins.length} ${filteredPins.length === 1 ? "match" : "matches"}`}
            </p>
          )}
        </div>

        <div className="absolute right-3 top-3 z-10 flex flex-col gap-1.5">
          <button type="button" onClick={() => setSatellite((v) => !v)} className={glassButton} title={satellite ? "Map view" : "Satellite view"}>
            {satellite ? <MapStyleIcon className="h-4 w-4" /> : <Satellite className="h-4 w-4" />}
          </button>
          <button type="button" onClick={() => setFullscreen((v) => !v)} className={glassButton} title={fullscreen ? "Exit fullscreen" : "Fullscreen"}>
            {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Airbnb-style synced list: what's in the viewport, hover to spotlight
          the pin, click to fly to it. Hidden below lg (the sheet covers
          mobile). */}
      <aside className="mt-3 hidden h-[65vh] min-h-[420px] flex-col overflow-hidden rounded-lg border border-border bg-card lg:mt-0 lg:flex">
        <div className="border-b border-border px-3 py-2">
          <p className="text-xs font-medium text-muted-foreground">
            {inView.length} {inView.length === 1 ? "place" : "places"} in view
            {q && " · filtered"}
          </p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {inView.length === 0 ? (
            <p className="px-3 py-6 text-center text-xs text-muted-foreground">Nothing in view — move the map or clear filters.</p>
          ) : (
            inView.map((pin) => (
              <button
                key={pin.key}
                type="button"
                onClick={() => (pin.href ? router.push(pin.href) : focusPin(pin))}
                onMouseEnter={() => setHoverKey(pin.key)}
                onMouseLeave={() => setHoverKey(null)}
                className={`flex w-full items-center gap-2.5 border-b border-border px-3 py-2.5 text-left last:border-b-0 hover:bg-muted ${selectedKey === pin.key ? "bg-muted" : ""}`}
              >
                {pin.thumbUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={pin.thumbUrl} alt="" className="h-9 w-9 shrink-0 rounded-md object-cover" />
                ) : (
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-sm" style={{ background: `${pin.color}22` }}>
                    {pin.thumbIcon}
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-foreground">{pin.title}</span>
                  <span className="block truncate text-xs text-muted-foreground">{pin.subtitle}</span>
                </span>
              </button>
            ))
          )}
        </div>
      </aside>
      </div>

      {pending && (
        <NewLandmarkForm
          communityId={communityId}
          communitySlug={communitySlug}
          spaceId={spaceId}
          spaceSlug={spaceSlug}
          categories={categories}
          pending={pending}
          onDone={() => {
            setPending(null);
            setAddMode(false);
          }}
          onCancel={() => setPending(null)}
        />
      )}
    </div>
  );
}
