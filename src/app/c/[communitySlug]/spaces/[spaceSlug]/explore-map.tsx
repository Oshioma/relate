"use client";

import "leaflet/dist/leaflet.css";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { Plus, Settings, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { colorForCategory } from "@/lib/map-pin-colors";
import { createLandmark, deleteLandmark, createMapCategory, toggleMapCategory, deleteMapCategory } from "./map-actions";
import { BusinessMapPopup } from "./business-map-popup";
import { MapItemPopup, isEventSoon } from "./map-item-popup";
import { MAP_ITEM_KINDS, MAP_ITEM_KIND_ORDER, type MapItem, type MapItemKind } from "@/lib/map-item-kinds";
import { UNGUJA_BOUNDS } from "@/lib/map-bounds";
import type { MapCategory, Landmark, Business, BusinessCategory } from "@/types/database";

function dotIcon(color: string): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `<span style="display:block;width:16px;height:16px;border-radius:9999px;background:${color};border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,.4)"></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

const BUSINESS_CATEGORY_EMOJI: Record<BusinessCategory, string> = {
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

function businessIcon(category: BusinessCategory): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `<span style="display:flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:9999px;background:#0f172a;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,.4);font-size:13px">${BUSINESS_CATEGORY_EMOJI[category] ?? "🏪"}</span>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
}

function itemIcon(kind: MapItemKind, pulse: boolean): L.DivIcon {
  const { emoji, color } = MAP_ITEM_KINDS[kind];
  const halo = pulse ? `<span class="map-pin-pulse" style="background:${color}"></span>` : "";
  return L.divIcon({
    className: "",
    html: `<span style="position:relative;display:flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:9999px;background:${color};border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,.4);font-size:13px">${halo}${emoji}</span>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
}

function MapClickHandler({ active, onPick }: { active: boolean; onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      if (active) onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
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

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => toggleKey("__businesses")}
          className={`rounded-full border px-2.5 py-1 text-xs font-medium ${hiddenKeys.has("__businesses") ? "border-border text-muted-foreground" : "border-accent bg-accent-soft text-accent"}`}
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
              className={`rounded-full border px-2.5 py-1 text-xs font-medium ${hiddenKeys.has(key) ? "border-border text-muted-foreground" : ""}`}
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
            className={`rounded-full border px-2.5 py-1 text-xs font-medium ${hiddenKeys.has(c.id) ? "border-border text-muted-foreground" : "border-accent bg-accent-soft text-accent"}`}
            style={hiddenKeys.has(c.id) ? undefined : { borderColor: colorForCategory(c.id), color: colorForCategory(c.id), background: "transparent" }}
          >
            {c.enabled ? "" : "(hidden) "}
            {c.name}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-1.5">
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
      </div>

      {addMode && <p className="mb-2 text-xs text-muted-foreground">Click anywhere on the map to place a pin.</p>}

      <div className={`overflow-hidden rounded-lg border border-border ${addMode ? "cursor-crosshair" : ""}`} style={{ height: 600 }}>
        <MapContainer bounds={UNGUJA_BOUNDS} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapClickHandler active={addMode} onPick={(lat, lng) => setPending({ lat, lng })} />

          {visibleLandmarks.map((landmark) => (
            <Marker key={landmark.id} position={[landmark.lat, landmark.lng]} icon={dotIcon(colorForCategory(landmark.category_id))}>
              <Popup>
                <LandmarkPopup landmark={landmark} communitySlug={communitySlug} spaceSlug={spaceSlug} canDelete={isAdmin || landmark.created_by === userId} />
              </Popup>
            </Marker>
          ))}

          {visibleBusinesses.map(
            (business) =>
              business.lat !== null &&
              business.lng !== null && (
                <Marker key={business.id} position={[business.lat, business.lng]} icon={businessIcon(business.category)}>
                  <Popup maxWidth={300}>
                    <BusinessMapPopup business={business} />
                  </Popup>
                </Marker>
              )
          )}

          {visibleItems.map((item) => (
            <Marker key={`${item.kind}:${item.id}`} position={[item.lat, item.lng]} icon={itemIcon(item.kind, isEventSoon(item))}>
              <Popup maxWidth={280}>
                <MapItemPopup item={item} />
              </Popup>
            </Marker>
          ))}
        </MapContainer>
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
