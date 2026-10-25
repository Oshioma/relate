// Links to one event point at the events page with `#event-<id>` (event cards,
// map pins, shared links). The list only renders a page of events at a time,
// so an event further down isn't in the DOM yet and the anchor goes nowhere.
// This works out how many events to show so the linked one is rendered.
export function visibleCountForHash(eventIds: string[], hash: string, pageSize: number, current: number): number {
  const id = hash.replace(/^#/, "").replace(/^event-/, "");
  if (!id || !hash.includes("event-")) return current;
  const index = eventIds.indexOf(id);
  if (index < current) return current;
  return Math.ceil((index + 1) / pageSize) * pageSize;
}
