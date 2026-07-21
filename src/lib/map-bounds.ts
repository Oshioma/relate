import type { LatLngBoundsExpression } from "leaflet";

// Unguja (the main island of Zanzibar), with a little padding — the Explore
// Map and the business location picker both open fitted to this box.
export const UNGUJA_BOUNDS: LatLngBoundsExpression = [
  [-6.52, 39.15], // south-west
  [-5.68, 39.6], // north-east
];
