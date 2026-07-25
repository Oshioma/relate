import "server-only";

// Free, no-key place-name geocoding via Open-Meteo (https://open-meteo.com,
// data is CC BY 4.0). Shared by the community weather/tides widget
// (src/lib/weather.ts) and anything that turns free-text location input
// into map coordinates (e.g. the event location field recentering its map).

const GEOCODE_REVALIDATE = 60 * 60 * 24 * 30;

export interface GeocodeResult {
  lat: number;
  lng: number;
  // "Nungwi, Tanzania" — the geocoder's resolved name, useful for surfacing
  // a wrong match (the fix is refining the input).
  resolvedName: string;
}

async function geocodeOnce(name: string): Promise<GeocodeResult | null> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=en&format=json`;
  let data: { results?: { latitude: number; longitude: number; name: string; country?: string }[] } | null = null;
  try {
    const res = await fetch(url, { next: { revalidate: GEOCODE_REVALIDATE } });
    if (res.ok) data = await res.json();
  } catch {
    data = null;
  }

  const hit = data?.results?.[0];
  if (!hit) return null;
  return {
    lat: hit.latitude,
    lng: hit.longitude,
    resolvedName: hit.country ? `${hit.name}, ${hit.country}` : hit.name,
  };
}

// Open-Meteo's geocoder matches bare place names — "Zanzibar Tanzania" or
// "Nungwi, Zanzibar" as one string finds nothing even though "Zanzibar" and
// "Nungwi" both exist. So fall back through progressively simpler variants:
// the raw string, each comma segment in order, then the first segment with
// trailing words dropped one at a time ("Zanzibar Tanzania" → "Zanzibar",
// but "New York USA" → "New York" before "New"). Every attempt is cached
// for ~30 days, so retries only cost anything the first time.
function geocodeCandidates(raw: string): string[] {
  const segments = raw.split(",").map((s) => s.trim()).filter(Boolean);
  const candidates = [raw, ...segments];
  let words = (segments[0] ?? "").split(/\s+/);
  while (words.length > 1) {
    words = words.slice(0, -1);
    candidates.push(words.join(" "));
  }
  return [...new Set(candidates.filter(Boolean))].slice(0, 5);
}

export async function geocodeLocation(name: string): Promise<GeocodeResult | null> {
  for (const candidate of geocodeCandidates(name.trim())) {
    const hit = await geocodeOnce(candidate);
    if (hit) return hit;
  }
  return null;
}
