// "Near me" on the place guides: straight-line distance from the reader to
// each place, worked out in the browser. The reader's position is never sent
// or stored.

export type LatLng = { lat: number; lng: number };

const EARTH_RADIUS_KM = 6371;

export function distanceKm(a: LatLng, b: LatLng): number {
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

// "450 m", "2.3 km", "34 km".
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.max(50, Math.round((km * 1000) / 50) * 50)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}

// Keys nearest first, with their distances; places without coords go last
// in their original order.
export function byDistance(keys: string[], coords: Record<string, LatLng | undefined>, from: LatLng): { key: string; km: number | null }[] {
  return keys
    .map((key, i) => {
      const c = coords[key];
      return { key, km: c ? distanceKm(from, c) : null, i };
    })
    .sort((a, b) => (a.km ?? Infinity) - (b.km ?? Infinity) || a.i - b.i)
    .map(({ key, km }) => ({ key, km }));
}

// Further than this from the nearest place, the reader is probably not on
// the island, and the page says so rather than implying a long walk.
export const FAR_AWAY_KM = 100;
