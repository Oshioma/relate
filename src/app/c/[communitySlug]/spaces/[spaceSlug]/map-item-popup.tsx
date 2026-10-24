"use client";

import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { MAP_ITEM_KINDS, dayStart, eventDayWord, type MapItem, type MapItemLink } from "@/lib/map-item-kinds";

export { isEventTodayOrTomorrow } from "@/lib/map-item-kinds";

// Formatted client-side so times show in the viewer's locale/timezone.
export function formatEventTime(startIso: string, endIso: string | null): string {
  const start = new Date(startIso);
  const time = start.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  const word = eventDayWord(startIso, endIso);
  if (word === "On now" && endIso) {
    const end = new Date(endIso);
    const sameDay = end.getTime() < dayStart(new Date(), 1);
    const until = sameDay
      ? end.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
      : end.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
    return `On now · until ${until}`;
  }
  const day = word ?? start.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
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

// What the guides pick out in a guide area pin, grouped by guide.
function GuideLinks({ links }: { links: MapItemLink[] }) {
  const groups = new Map<string, MapItemLink[]>();
  for (const link of links) groups.set(link.group, [...(groups.get(link.group) ?? []), link]);
  const accent = { color: "var(--accent)" };
  return (
    <div className="mt-2.5 space-y-2 border-t border-border pt-2">
      {[...groups.entries()].map(([group, list]) => (
        <div key={group}>
          <Link href={list[0].groupHref} className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground hover:underline">
            {group}
          </Link>
          <ul className="mt-0.5 space-y-0.5">
            {list.map((link) => (
              <li key={link.href} className="text-xs leading-snug">
                <Link href={link.href} className="font-medium underline-offset-2 hover:underline" style={accent}>
                  {link.label}
                </Link>
                {link.note && <span className="text-muted-foreground"> · {link.note}</span>}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

// Popup for every Living Map pin that isn't a business or landmark — those
// two keep their richer bespoke popups (business-map-popup.tsx).
export function MapItemPopup({ item }: { item: MapItem }) {
  const kind = MAP_ITEM_KINDS[item.kind];
  const meta = metaLine(item);

  return (
    <div className="w-[260px]">
      {/* Everything that names the pin's page opens it: the picture, the
          type chip and the title, as well as the View link at the end. */}
      {item.imageUrl && (
        <Link href={item.href} className="block h-24 w-full bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
        </Link>
      )}

      <div className="p-3">
        <Link
          href={item.href}
          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium hover:underline"
          style={{ background: `${kind.color}22`, color: kind.color }}
        >
          {kind.emoji} {kind.label}
          {isEventSoon(item) && " · starting soon"}
        </Link>

        <h3 className="mt-1.5 text-sm font-semibold leading-snug text-foreground">
          <Link href={item.href} className="hover:underline">
            {item.title}
          </Link>
        </h3>
        {meta && <p className="mt-0.5 text-xs font-medium text-foreground">{meta}</p>}
        {item.description && <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-muted-foreground">{item.description}</p>}

        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          {item.locationLabel && <span className="truncate">{item.locationLabel}</span>}
          <span className="ml-auto shrink-0 text-[10px] uppercase tracking-wide text-muted-foreground/70">
            {item.locationPrecision === "approximate" ? "Approximate" : "Exact"}
          </span>
        </p>

        {item.links && item.links.length > 0 && <GuideLinks links={item.links} />}

        <Link
          href={item.href}
          className="mt-2.5 inline-flex items-center gap-1 text-xs font-medium hover:underline"
          style={{ color: "var(--accent)" }}
        >
          {item.kind === "guide" ? "Read the guide" : "View"}
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
