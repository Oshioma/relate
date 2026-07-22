"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useRef, useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { Plus, Settings, Trash2, X, Maximize2, Minimize2, Satellite, Map as MapStyleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { colorForCategory } from "@/lib/map-pin-colors";
import { createLandmark, deleteLandmark, createMapCategory, toggleMapCategory, deleteMapCategory } from "./map-actions";
import { BusinessMapPopup } from "./business-map-popup";
import { MapItemPopup, isEventSoon } from "./map-item-popup";
import { MAP_ITEM_KINDS, MAP_ITEM_KIND_ORDER, type MapItem, type MapItemKind } from "@/lib/map-item-kinds";
import { UNGUJA_BOUNDS } from "@/lib/map-bounds";
import type { MapCategory, Landmark, Business, BusinessCategory } from "@/types/database";

// Free basemaps, no API key — CARTO requires attribution; Voyager/Dark Matter
// track the app theme so the map itself goes dark in dark mode.
const TILES = {
  light: {
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19,
  },
  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19,
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
    maxZoom: 18,
  },
} as const;

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
// center — iconAnchor points the tip at the coordinate.
const PIN_PATH = "M12 .5C5.6.5.5 5.6.5 12c0 8.9 11.5 21.5 11.5 21.5S23.5 20.9 23.5 12C23.5 5.6 18.4.5 12 .5z";

function pinIcon(color: string, inner: string, pulseColor?: string): L.DivIcon {
  const pulse = pulseColor
    ? `<span class="map-pin-pulse" style="top:2px;left:2px;width:26px;height:26px;background:${pulseColor}"></span>`
    : "";
  return L.divIcon({
    className: "",
    html: `<span class="map-pin">${pulse}<svg width="30" height="40" viewBox="0 0 24 34" style="filter:drop-shadow(0 2px 3px rgba(0,0,0,.35))"><path d="${PIN_PATH}" fill="${color}" stroke="#fff" stroke-width="1.5"/></svg><span class="map-pin-inner">${inner}</span></span>`,
    iconSize: [30, 40],
    iconAnchor: [15, 38],
    popupAnchor: [0, -36],
  });
}

function landmarkIcon(color: string): L.DivIcon {
  return pinIcon(color, `<span style="display:block;width:8px;height:8px;border-radius:9999px;background:#fff"></span>`);
}

function businessIcon(category: BusinessCategory): L.DivIcon {
  return pinIcon("#0f172a", BUSINESS_CATEGORY_EMOJI[category] ?? "🏪");
}

function itemIcon(kind: MapItemKind, pulse: boolean): L.DivIcon {
  const { emoji, color } = MAP_ITEM_KINDS[kind];
  return pinIcon(color, emoji, pulse ? color : undefined);
}

// Cluster bubble: a conic-gradient ring segmented by the colors of the pins
// inside — a glanceable "what's here" donut — around a count.
function clusterIcon(count: number, colors: string[]): L.DivIcon {
  const total = colors.length;
  const byColor = new Map<string, number>();
  for (const color of colors) byColor.set(color, (byColor.get(color) ?? 0) + 1);
  let acc = 0;
  const stops: string[] = [];
  for (const [color, n] of byColor) {
    const next = acc + (n / total) * 100;
    stops.push(`${color} ${acc}% ${next}%`);
    acc = next;
  }
  const size = count >= 50 ? 52 : count >= 10 ? 46 : 40;
  return L.divIcon({
    className: "",
    html: `<span class="map-cluster" style="width:${size}px;height:${size}px;background:conic-gradient(${stops.join(",")})"><span class="map-cluster-count">${count}</span></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

// The app's dual theme strategy (globals.css): explicit data-theme wins,
// otherwise the OS preference. Watch both so tiles flip live with the toggle.
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

function MapClickHandler({ active, onPick }: { active: boolean; onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      if (active) onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

type PinDef = {
  key: string;
  lat: number;
  lng: number;
  color: string;
  icon: L.DivIcon;
  popup: ReactNode;
};

// Dependency-free clustering: pins within ~52px of a cluster's running
// centroid at the current zoom merge into one bubble; clicking zooms in two
// levels. Past zoom 16 everything renders individually.
function ClusterLayer({ pins }: { pins: PinDef[] }) {
  const map = useMap();
  const [zoom, setZoom] = useState(() => map.getZoom());
  useMapEvents({ zoomend: () => setZoom(map.getZoom()) });

  const clusters = useMemo(() => {
    type Cluster = { sumX: number; sumY: number; pins: PinDef[] };
    if (zoom >= 17) return pins.map((pin) => ({ sumX: 0, sumY: 0, pins: [pin] }) as Cluster);

    const RADIUS = 52;
    const result: Cluster[] = [];
    for (const pin of pins) {
      const pt = map.project([pin.lat, pin.lng], zoom);
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
  }, [pins, zoom, map]);

  return (
    <>
      {clusters.map((cluster) => {
        if (cluster.pins.length === 1) {
          const pin = cluster.pins[0];
          return (
            <Marker key={pin.key} position={[pin.lat, pin.lng]} icon={pin.icon}>
              <Popup maxWidth={300}>{pin.popup}</Popup>
            </Marker>
          );
        }
        const center = map.unproject([cluster.sumX / cluster.pins.length, cluster.sumY / cluster.pins.length], zoom);
        return (
          <Marker
            key={cluster.pins.map((p) => p.key).join("|")}
            position={center}
            icon={clusterIcon(cluster.pins.length, cluster.pins.map((p) => p.color))}
            eventHandlers={{ click: () => map.setView(center, Math.min(zoom + 2, 17)) }}
          />
        );
      })}
    </>
  );
}

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

function LayerManager({
  communityId,
  communitySlug,
  spaceSlug,
  categories,
}: {
  communityId: string;
  communitySlug: string;
  spaceSlug: string;
  categories: MapCategory[];
}) {
  const [isPending, startTransition] = useTransition();
  const [newName, setNewName] = useState("");
  const router = useRouter();

  function addLayer() {
    if (!newName.trim()) return;
    startTransition(async () => {
      await createMapCategory(communityId, newName, communitySlug, spaceSlug);
      setNewName("");
      router.refresh();
    });
  }

  function toggle(categoryId: string, enabled: boolean) {
    startTransition(async () => {
      await toggleMapCategory(categoryId, enabled, communitySlug, spaceSlug);
      router.refresh();
    });
  }

  function remove(categoryId: string, name: string) {
    if (!window.confirm(`Delete the "${name}" layer? Pins in it become uncategorized.`)) return;
    startTransition(async () => {
      await deleteMapCategory(categoryId, communitySlug, spaceSlug);
      router.refresh();
    });
  }

  return (
    <div className="mt-3 rounded-lg border border-border bg-card p-4">
      <p className="text-sm font-medium text-foreground">Manage layers</p>
      <div className="mt-2 space-y-1.5">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between gap-2 text-sm">
            <label className="flex items-center gap-2 text-foreground">
              <input type="checkbox" checked={c.enabled} disabled={isPending} onChange={(e) => toggle(c.id, e.target.checked)} className="h-4 w-4 rounded border-border" />
              {c.name}
            </label>
            <button type="button" disabled={isPending} onClick={() => remove(c.id, c.name)} className="text-muted-foreground hover:text-danger disabled:opacity-60">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="New layer name" className="text-sm" />
        <Button type="button" size="sm" variant="secondary" disabled={isPending || !newName.trim()} onClick={addLayer} className="w-auto shrink-0">
          Add
        </Button>
      </div>
    </div>
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
  businesses: Business[];
  items: MapItem[];
  canPost: boolean;
  isAdmin: boolean;
  userId: string;
}) {
  const [hiddenKeys, setHiddenKeys] = useState<Set<string>>(new Set());
  const [addMode, setAddMode] = useState(false);
  const [pending, setPending] = useState<{ lat: number; lng: number } | null>(null);
  const [showLayerManager, setShowLayerManager] = useState(false);
  const [satellite, setSatellite] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const isDark = useIsDarkTheme();
  const mapRef = useRef<L.Map | null>(null);

  // Leaflet only measures its container on mount — nudge it when the
  // container jumps between inline and fullscreen.
  useEffect(() => {
    const timer = setTimeout(() => mapRef.current?.invalidateSize(), 220);
    return () => clearTimeout(timer);
  }, [fullscreen]);

  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullscreen]);

  const enabledCategories = categories.filter((c) => c.enabled || isAdmin);
  // Only kinds with pins get a filter pill — an empty "Jobs" toggle is noise.
  const presentKinds = MAP_ITEM_KIND_ORDER.filter((kind) => items.some((i) => i.kind === kind));

  function toggleKey(key: string) {
    setHiddenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const visibleLandmarks = landmarks.filter((l) => !hiddenKeys.has(l.category_id ?? "uncategorized") && categories.some((c) => c.id === l.category_id ? c.enabled : true));
  const visibleBusinesses = hiddenKeys.has("__businesses") ? [] : businesses;
  const visibleItems = items.filter((i) => !hiddenKeys.has(`__kind:${i.kind}`));

  const pins: PinDef[] = [
    ...visibleLandmarks.map((landmark) => ({
      key: `landmark:${landmark.id}`,
      lat: landmark.lat,
      lng: landmark.lng,
      color: colorForCategory(landmark.category_id),
      icon: landmarkIcon(colorForCategory(landmark.category_id)),
      popup: <LandmarkPopup landmark={landmark} communitySlug={communitySlug} spaceSlug={spaceSlug} canDelete={isAdmin || landmark.created_by === userId} />,
    })),
    ...visibleBusinesses.flatMap((business) =>
      business.lat !== null && business.lng !== null
        ? [{
            key: `business:${business.id}`,
            lat: business.lat,
            lng: business.lng,
            color: "#0f172a",
            icon: businessIcon(business.category),
            popup: <BusinessMapPopup business={business} />,
          }]
        : []
    ),
    ...visibleItems.map((item) => ({
      key: `${item.kind}:${item.id}`,
      lat: item.lat,
      lng: item.lng,
      color: MAP_ITEM_KINDS[item.kind].color,
      icon: itemIcon(item.kind, isEventSoon(item)),
      popup: <MapItemPopup item={item} />,
    })),
  ];

  const tiles = satellite ? TILES.satellite : isDark ? TILES.dark : TILES.light;
  const glassButton = "rounded-md border border-border bg-card/85 p-2 text-foreground shadow-sm backdrop-blur hover:bg-card";
  const pillBase = "rounded-full border px-2.5 py-1 text-xs font-medium shadow-sm backdrop-blur";

  return (
    <div>
      {(canPost || isAdmin) && (
        <div className="mb-3 flex items-center justify-end gap-1.5">
          {addMode && <p className="mr-auto text-xs text-muted-foreground">Click anywhere on the map to place a pin.</p>}
          {canPost && (
            <Button type="button" size="sm" variant={addMode ? "secondary" : "primary"} onClick={() => setAddMode((v) => !v)} className="w-auto">
              <Plus className="h-3.5 w-3.5" />
              {addMode ? "Cancel" : "Add pin"}
            </Button>
          )}
          {isAdmin && (
            <button type="button" onClick={() => setShowLayerManager((v) => !v)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted" title="Manage layers">
              <Settings className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      <div
        className={
          fullscreen
            ? "fixed inset-0 z-[9999] bg-background"
            : `relative h-[65vh] min-h-[420px] overflow-hidden rounded-lg border border-border ${addMode ? "cursor-crosshair" : ""}`
        }
      >
        <MapContainer ref={mapRef} bounds={UNGUJA_BOUNDS} scrollWheelZoom zoomControl={false} style={{ height: "100%", width: "100%" }}>
          <TileLayer key={tiles.url} attribution={tiles.attribution} url={tiles.url} maxZoom={tiles.maxZoom} />
          <ZoomControl position="bottomright" />
          <MapClickHandler active={addMode} onPick={(lat, lng) => setPending({ lat, lng })} />
          <ClusterLayer pins={pins} />
        </MapContainer>

        {/* Floating filter pills — a glass panel over the map. z-[800] sits
            with Leaflet's controls, above tiles/markers/popups. */}
        <div className="absolute left-3 right-14 top-3 z-[800] flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => toggleKey("__businesses")}
            className={`${pillBase} ${hiddenKeys.has("__businesses") ? "border-border bg-card/70 text-muted-foreground" : "border-accent bg-card/85 text-accent"}`}
          >
            🏪 Businesses
          </button>
          {presentKinds.map((kind) => {
            const key = `__kind:${kind}`;
            const cfg = MAP_ITEM_KINDS[kind];
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleKey(key)}
                className={`${pillBase} ${hiddenKeys.has(key) ? "border-border bg-card/70 text-muted-foreground" : "bg-card/85"}`}
                style={hiddenKeys.has(key) ? undefined : { borderColor: cfg.color, color: cfg.color }}
              >
                {cfg.emoji} {cfg.label}
              </button>
            );
          })}
          {enabledCategories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => toggleKey(c.id)}
              className={`${pillBase} ${hiddenKeys.has(c.id) ? "border-border bg-card/70 text-muted-foreground" : "bg-card/85"}`}
              style={hiddenKeys.has(c.id) ? undefined : { borderColor: colorForCategory(c.id), color: colorForCategory(c.id) }}
            >
              {c.enabled ? "" : "(hidden) "}
              {c.name}
            </button>
          ))}
        </div>

        <div className="absolute right-3 top-3 z-[800] flex flex-col gap-1.5">
          <button type="button" onClick={() => setSatellite((v) => !v)} className={glassButton} title={satellite ? "Map view" : "Satellite view"}>
            {satellite ? <MapStyleIcon className="h-4 w-4" /> : <Satellite className="h-4 w-4" />}
          </button>
          <button type="button" onClick={() => setFullscreen((v) => !v)} className={glassButton} title={fullscreen ? "Exit fullscreen" : "Fullscreen"}>
            {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
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

      {isAdmin && showLayerManager && <LayerManager communityId={communityId} communitySlug={communitySlug} spaceSlug={spaceSlug} categories={categories} />}
    </div>
  );
}
