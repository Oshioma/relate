import type { LatLngBoundsExpression } from "leaflet";

// Unguja (the main island of Zanzibar), with a little padding — the Explore
// Map and the business location picker both open fitted to this box.
export const UNGUJA_BOUNDS: LatLngBoundsExpression = [
  [-6.52, 39.15], // south-west
  [-5.68, 39.6], // north-east
];

// The same box in MapLibre's [[west, south], [east, north]] lng/lat order
// (the Explore Map runs on MapLibre; the location picker is still Leaflet).
export const UNGUJA_BOUNDS_LNGLAT: [[number, number], [number, number]] = [
  [39.15, -6.52],
  [39.6, -5.68],
];
