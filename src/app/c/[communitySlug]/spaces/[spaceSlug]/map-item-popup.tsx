"use client";

import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { MAP_ITEM_KINDS, type MapItem } from "@/lib/map-item-kinds";

// Formatted client-side so times show in the viewer's locale/timezone.
function formatEventTime(startIso: string, endIso: string | null): string {
  const start = new Date(startIso);
  const day = start.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
  const time = start.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  if (!endIso) return `${day} · ${time}`;
  const end = new Date(endIso);
  const endTime = end.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  return `${day} · ${time}–${endTime}`;
}

function metaLine(item: MapItem): string | null {
  if (item.kind === "event" && item.startTime) return formatEventTime(item.startTime, item.endTime);
  if (item.price !== null) {
    const price = `${item.currency ? `${item.currency} ` : ""}${item.price.toLocaleString()}${item.kind === "stay" ? " / night" : ""}`;
    return item.meta ? `${item.meta} · ${price}` : price;
  }
  return item.meta;
}

// "Starting soon" — an event beginning within the next 24h (and not over)
// gets a pulsing halo on its marker and an urgency line in its popup.
export function isEventSoon(item: MapItem): boolean {
  if (item.kind !== "event" || !item.startTime) return false;
  const start = new Date(item.startTime).getTime();
  const end = item.endTime ? new Date(item.endTime).getTime() : start;
  const now = Date.now();
  return end >= now && start - now < 24 * 60 * 60 * 1000;
}

// Popup for every Living Map pin that isn't a business or landmark — those
// two keep their richer bespoke popups (business-map-popup.tsx).
export function MapItemPopup({ item }: { item: MapItem }) {
  const kind = MAP_ITEM_KINDS[item.kind];
  const meta = metaLine(item);

  return (
    <div className="w-[260px]">
      {item.imageUrl && (
        <div className="h-24 w-full bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
        </div>
      )}

      <div className="p-3">
        <span
          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium"
          style={{ background: `${kind.color}22`, color: kind.color }}
        >
          {kind.emoji} {kind.label}
          {isEventSoon(item) && " · starting soon"}
        </span>

        <h3 className="mt-1.5 text-sm font-semibold leading-snug text-foreground">{item.title}</h3>
        {meta && <p className="mt-0.5 text-xs font-medium text-foreground">{meta}</p>}
        {item.description && <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-muted-foreground">{item.description}</p>}

        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          {item.locationLabel && <span className="truncate">{item.locationLabel}</span>}
          <span className="ml-auto shrink-0 text-[10px] uppercase tracking-wide text-muted-foreground/70">
            {item.locationPrecision === "approximate" ? "Approximate" : "Exact"}
          </span>
        </p>

        <Link
          href={item.href}
          className="mt-2.5 inline-flex items-center gap-1 text-xs font-medium hover:underline"
          style={{ color: "var(--accent)" }}
        >
          View
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
