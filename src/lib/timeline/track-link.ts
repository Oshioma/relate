import type { TimeWindow } from "./time";

// A LINK TO ONE TRACK ON ITS OWN.
//
// The track filter has always taken a track's id in ?track=, which works for a
// link copied out of the address bar and is useless for a link anybody writes
// by hand or ships in code: the id is a database UUID that differs between
// communities. A track's slug is the same everywhere it is seeded, so the
// parameter now accepts either, and the slug is turned into this community's
// id before anything filters on it.

type TrackRef = { id: string; slug: string };

/**
 * The id of the track a ?track= value names — by id or by slug — or "" when it
 * names no track here. An unknown value is dropped rather than kept, because a
 * filter on a track that does not exist hides every record and explains nothing.
 */
export function resolveTrackParam(value: string, tracks: readonly TrackRef[]): string {
  if (!value) return "";
  const byId = tracks.find((track) => track.id === value);
  if (byId) return byId.id;
  const bySlug = tracks.find((track) => track.slug === value);
  return bySlug ? bySlug.id : "";
}

/**
 * The address that opens the timeline on one track: filtered to it, over the
 * span its dated records occupy. The list opens with it, because a track that
 * keeps its undated records honest has records the strip cannot place.
 */
export function trackLinkSearch(slug: string, window: TimeWindow): string {
  const params = new URLSearchParams({ track: slug, from: String(window.from), to: String(window.to) });
  return `?${params.toString()}`;
}
