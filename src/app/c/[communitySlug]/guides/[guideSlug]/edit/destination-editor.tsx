"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearFormDraft, readJsonDraft, writeJsonDraft } from "@/lib/use-form-draft";
import type { Destination, GuideTag, ListingRef } from "@/lib/guides/where-to-stay/types";
import {
  ACCOMMODATION_LABELS,
  ALL_TAGS,
  ATMOSPHERE_LABELS,
  NIGHTLIFE_LABELS,
  POSITION_LABELS,
  RESTAURANT_LABELS,
  SWIMMING_LABELS,
  TAG_LABELS,
  TIDE_LABELS,
} from "@/lib/guides/where-to-stay/labels";
import { ListEditor, type FieldSpec } from "./list-editor";
import { resetDestination, saveDestination } from "./actions";

export type ListingOption = { value: string; label: string };

// The per-destination editor. The whole destination lives in React state and
// is auto-saved as a JSON draft on every change, so a refresh or a dropped
// connection never loses an edit; the draft is cleared once the save lands.
// Nothing here is a password or payment field, so the whole form is safe to
// keep as a draft.

type EditableRow = Record<string, unknown>;

function toRow<T extends { listing?: ListingRef | null }>(item: T): EditableRow {
  const { listing, ...rest } = item;
  return { ...rest, listingRef: listing ? `${listing.kind}:${listing.slug}` : "" };
}

function fromRow(row: EditableRow): EditableRow {
  const { listingRef, ...rest } = row;
  const ref = typeof listingRef === "string" && listingRef.includes(":") ? listingRef : "";
  const [kind, ...slug] = ref.split(":");
  // Empty optional strings are stored as null so the card hides them.
  const cleaned = Object.fromEntries(Object.entries(rest).map(([k, v]) => [k, v === "" ? null : v]));
  return { ...cleaned, listing: ref ? { kind, slug: slug.join(":") } : null };
}

type EditorState = Omit<Destination, "key" | "restaurants" | "stays"> & { restaurants: EditableRow[]; stays: EditableRow[] };

function toState(d: Destination): EditorState {
  const { key: _key, ...rest } = d;
  void _key;
  return { ...rest, editorialNote: rest.editorialNote ?? "", restaurants: d.restaurants.map(toRow), stays: d.stays.map(toRow) };
}

function options<T extends string>(labels: Record<T, string>) {
  return (Object.keys(labels) as T[]).map((value) => ({ value, label: labels[value] }));
}

const priceOptions = [
  { value: "$", label: "$ · Budget-friendly" },
  { value: "$$", label: "$$ · Mid-range" },
  { value: "$$$", label: "$$$ · Upper range" },
];

const inputClass = "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

export function DestinationEditor({
  communitySlug,
  guideSlug,
  destination,
  isOverridden,
  listingOptions,
}: {
  communitySlug: string;
  guideSlug: string;
  destination: Destination;
  isOverridden: boolean;
  listingOptions: ListingOption[];
}) {
  const draftKey = `editorial-guide:${communitySlug}:${guideSlug}:${destination.key}`;
  const [state, setState] = useState<EditorState>(() => toState(destination));
  const [restored, setRestored] = useState(false);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const loaded = useRef(false);

  // Restore an unsaved draft once, after mount (localStorage is browser-only).
  useEffect(() => {
    const raw = readJsonDraft(draftKey);
    if (raw) {
      try {
        const draft = JSON.parse(raw) as EditorState;
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-off restore from browser storage after mount
        setState(draft);
        setRestored(true);
      } catch {
        clearFormDraft(draftKey);
      }
    }
    loaded.current = true;
  }, [draftKey]);

  const change = (patch: Partial<EditorState>) => {
    setState((current) => {
      const next = { ...current, ...patch };
      if (loaded.current) writeJsonDraft(draftKey, next);
      return next;
    });
    setMessage(null);
  };
  const setPanel = (key: keyof EditorState["panel"], value: string) => change({ panel: { ...state.panel, [key]: value } as EditorState["panel"] });

  function discardDraft() {
    clearFormDraft(draftKey);
    setState(toState(destination));
    setRestored(false);
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      ...state,
      editorialNote: state.editorialNote ? state.editorialNote : null,
      restaurants: state.restaurants.map(fromRow),
      stays: state.stays.map(fromRow),
      photos: state.photos.map((p) => ({ ...p, licenceUrl: p.licenceUrl || null })),
    };
    startTransition(async () => {
      const result = await saveDestination(communitySlug, guideSlug, destination.key, payload);
      if ("error" in result) {
        setMessage({ tone: "error", text: result.error });
        return;
      }
      clearFormDraft(draftKey);
      setRestored(false);
      setMessage({ tone: "ok", text: `${state.name} saved.` });
      router.refresh();
    });
  }

  function reset() {
    if (!window.confirm(`Reset ${destination.name} to the built-in guide content? Your edits to this destination will be removed.`)) return;
    startTransition(async () => {
      const result = await resetDestination(communitySlug, guideSlug, destination.key);
      if ("error" in result) {
        setMessage({ tone: "error", text: result.error });
        return;
      }
      clearFormDraft(draftKey);
      setRestored(false);
      router.refresh();
      setMessage({ tone: "ok", text: "Reset to the built-in content." });
    });
  }

  const listingSelect = { value: "", label: "— Not in our directory —" };
  const restaurantFields: FieldSpec[] = [
    { key: "name", label: "Name", type: "text" },
    { key: "listingRef", label: "Directory listing", type: "select", options: [listingSelect, ...listingOptions] },
    { key: "cuisine", label: "Cuisine", type: "text" },
    { key: "price", label: "Price", type: "select", options: priceOptions },
    { key: "area", label: "Area", type: "text" },
    { key: "nearby", label: "Nearby (if outside the destination, with journey)", type: "text" },
    { key: "why", label: "Why we recommend it", type: "textarea" },
    { key: "bestFor", label: "Best for (comma separated)", type: "csv", wide: true },
    { key: "website", label: "Website", type: "url" },
    { key: "social", label: "Social link", type: "url" },
    { key: "mapsUrl", label: "Directions link (optional)", type: "url" },
    { key: "disclosure", label: "Disclosure (commercial relationship)", type: "text" },
    { key: "verificationNote", label: "Note shown on the card", type: "text", wide: true },
  ];
  const stayFields: FieldSpec[] = [
    { key: "name", label: "Name", type: "text" },
    { key: "listingRef", label: "Directory listing", type: "select", options: [listingSelect, ...listingOptions] },
    { key: "type", label: "Type", type: "text", placeholder: "Boutique hotel, Resort, Villa…" },
    { key: "price", label: "Price", type: "select", options: priceOptions },
    { key: "position", label: "Position", type: "select", options: options(POSITION_LABELS) },
    { key: "positionNote", label: "Beach and swimming note", type: "text" },
    { key: "suits", label: "Who it suits", type: "text", wide: true },
    { key: "why", label: "What makes it worth considering", type: "textarea" },
    { key: "website", label: "Official or booking website", type: "url" },
    { key: "disclosure", label: "Disclosure (commercial relationship)", type: "text" },
    { key: "verificationNote", label: "Note shown on the card", type: "text", wide: true },
  ];
  const photoFields: FieldSpec[] = [
    { key: "src", label: "Image URL", type: "url", wide: true },
    { key: "alt", label: "Alt text", type: "text", wide: true },
    { key: "caption", label: "Caption (start with “UNVERIFIED —” if the place isn't confirmed)", type: "textarea", rows: 2 },
    { key: "credit", label: "Photographer / credit", type: "text" },
    { key: "licence", label: "Licence", type: "text", placeholder: "CC BY-SA 4.0" },
    { key: "licenceUrl", label: "Licence URL", type: "url" },
    { key: "sourceUrl", label: "Source page", type: "url" },
    { key: "identificationStatus", label: "Identification", type: "select", options: [{ value: "secure", label: "Secure" }, { value: "unverified", label: "Unverified" }] },
    { key: "width", label: "Original width (px)", type: "number" },
  ];

  const text = (key: keyof EditorState, label: string, rows = 3) => (
    <label className="block">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <textarea rows={rows} value={String(state[key] ?? "")} onChange={(e) => change({ [key]: e.target.value } as Partial<EditorState>)} className={inputClass} data-no-draft />
    </label>
  );

  const panelSelect = (key: keyof EditorState["panel"], label: string, opts: { value: string; label: string }[]) => (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <select value={state.panel[key]} onChange={(e) => setPanel(key, e.target.value)} className={inputClass} data-no-draft>
        {opts.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <form onSubmit={save} className="space-y-6">
      {restored && (
        <p className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-accent-soft px-3 py-2 text-sm text-foreground">
          Restored your unsaved edits.
          <button type="button" onClick={discardDraft} className="font-medium text-accent hover:underline">
            Discard them
          </button>
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-foreground">Name</span>
          <input value={state.name} onChange={(e) => change({ name: e.target.value })} className={inputClass} data-no-draft />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-foreground">Ranking</span>
          <input type="number" min={1} max={99} value={state.rank} onChange={(e) => change({ rank: Number(e.target.value) || 1 })} className={inputClass} data-no-draft />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-foreground">Editorial category</span>
          <input value={state.category} onChange={(e) => change({ category: e.target.value })} className={inputClass} data-no-draft />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-foreground">Coast / area</span>
          <input value={state.coast} onChange={(e) => change({ coast: e.target.value })} className={inputClass} data-no-draft />
        </label>
      </div>
      {text("summary", "Card summary", 2)}
      {text("tradeOff", "Honest trade-off (shown in the quiz and compare)", 2)}
      {text("editorialNote", "Editorial note (optional, shown under the intro)", 2)}

      <fieldset className="rounded-lg border border-border p-4">
        <legend className="px-1 text-sm font-semibold text-foreground">At a glance</legend>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {panelSelect("swimming", "Swimming", options(SWIMMING_LABELS))}
          {panelSelect("tides", "Tidal impact", options(TIDE_LABELS))}
          {panelSelect("atmosphere", "Atmosphere", options(ATMOSPHERE_LABELS))}
          {panelSelect("nightlife", "Nightlife", options(NIGHTLIFE_LABELS))}
          {panelSelect("restaurants", "Restaurants", options(RESTAURANT_LABELS))}
          {panelSelect("accommodation", "Places to stay", options(ACCOMMODATION_LABELS))}
          {panelSelect("budget", "Budget", priceOptions)}
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">Recommended stay</span>
            <input value={state.panel.nights} onChange={(e) => setPanel("nights", e.target.value)} className={inputClass} data-no-draft />
          </label>
        </div>
        <p className="mt-4 text-xs font-medium text-muted-foreground">Best for</p>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1.5">
          {ALL_TAGS.map((tag) => (
            <label key={tag} className="inline-flex items-center gap-1.5 text-sm">
              <input
                type="checkbox"
                checked={state.bestFor.includes(tag)}
                onChange={(e) => change({ bestFor: e.target.checked ? [...state.bestFor, tag] : state.bestFor.filter((t: GuideTag) => t !== tag) })}
                data-no-draft
              />
              {TAG_LABELS[tag]}
            </label>
          ))}
        </div>
      </fieldset>

      {text("intro", "Introduction", 4)}
      {text("whyPeopleLoveIt", "Why people love it")}
      {text("whatMakesItDifferent", "What makes it different")}
      {text("whoShouldStay", "Who should stay here")}
      {text("whoMightNot", "Who might not enjoy it")}
      {text("misunderstandings", "What visitors often misunderstand")}
      {text("beach", "The beach")}
      {text("eatingOut", "Eating out and exploring")}

      <ListEditor
        title="Extra notes"
        items={state.notes as unknown as EditableRow[]}
        onChange={(notes) => change({ notes: notes as unknown as EditorState["notes"] })}
        fields={[
          { key: "title", label: "Heading", type: "text", wide: true },
          { key: "body", label: "Text", type: "textarea" },
        ]}
        empty={{ title: "", body: "" }}
        itemLabel={(n) => String(n.title ?? "")}
      />
      <ListEditor
        title="Photographs (first is the destination hero)"
        items={state.photos as unknown as EditableRow[]}
        onChange={(photos) => change({ photos: photos as unknown as EditorState["photos"] })}
        fields={photoFields}
        empty={{ src: "", alt: "", caption: "", credit: "", licence: "", licenceUrl: "", sourceUrl: "", identificationStatus: "secure" }}
        itemLabel={(p) => String(p.caption ?? p.src ?? "")}
      />
      <ListEditor
        title="Restaurant recommendations"
        items={state.restaurants}
        onChange={(restaurants) => change({ restaurants })}
        fields={restaurantFields}
        empty={{ name: "", listingRef: "", cuisine: "", price: "$$", area: state.name, why: "", bestFor: [] }}
        itemLabel={(r) => String(r.name ?? "")}
      />
      <ListEditor
        title="Where to stay"
        items={state.stays}
        onChange={(stays) => change({ stays })}
        fields={stayFields}
        empty={{ name: "", listingRef: "", type: "", price: "$$", position: "unknown", suits: "", why: "" }}
        itemLabel={(s) => String(s.name ?? "")}
      />

      {message && (
        <p role="status" className={message.tone === "error" ? "text-sm text-danger" : "text-sm text-accent"}>
          {message.text}
        </p>
      )}
      <div className="sticky bottom-0 flex flex-wrap items-center gap-3 border-t border-border bg-background py-3">
        <Button type="submit" disabled={pending}>
          <Save className="h-4 w-4" /> {pending ? "Saving…" : `Save ${state.name}`}
        </Button>
        {isOverridden && (
          <Button type="button" variant="ghost" onClick={reset} disabled={pending}>
            <RotateCcw className="h-4 w-4" /> Reset to built-in content
          </Button>
        )}
      </div>
    </form>
  );
}
