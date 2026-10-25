import { DEFAULT_DESTINATIONS } from "@/lib/guides/where-to-stay/destinations";

// A small gazetteer of Zanzibar villages and areas, for putting something on
// the Explore Map when all we have is a place name in free text: an event
// whose Location the geocoder couldn't resolve ("HI Skybar, Paje Beach"), or
// a guide entry that only names its village. Every coordinate is the rough
// centre of the area, so pins placed from here are always "approximate".
//
// The 14 Where to Stay destinations are the backbone; the extras are areas
// the guides mention that aren't destinations in their own right.

export type ZanzibarPlace = {
  key: string;
  name: string;
  lat: number;
  lng: number;
  // The Where to Stay destination this is, if any (for linking to it).
  destinationKey: string | null;
};

type Entry = ZanzibarPlace & { aliases: string[] };

const EXTRA_ALIASES: Record<string, string[]> = {
  // Kae (west, sunset side) and Pingwe (east) are both on the Michamvi peninsula.
  michamvi: ["michamvi", "pingwe", "kae"],
  "stone-town": ["stone town", "stonetown", "shangani", "forodhani", "vuga", "mkunazini"],
  "pwani-mchangani": ["pwani mchangani"],
};

const EXTRAS: Entry[] = [
  { key: "mnemba", name: "Mnemba Island", lat: -5.82, lng: 39.383, destinationKey: null, aliases: ["mnemba"] },
  { key: "jozani", name: "Jozani Forest", lat: -6.259, lng: 39.414, destinationKey: null, aliases: ["jozani"] },
  { key: "mangapwani", name: "Mangapwani", lat: -5.986, lng: 39.196, destinationKey: null, aliases: ["mangapwani"] },
  { key: "mbweni", name: "Mbweni", lat: -6.214, lng: 39.205, destinationKey: null, aliases: ["mbweni"] },
  { key: "fumba", name: "Fumba", lat: -6.3, lng: 39.29, destinationKey: null, aliases: ["fumba"] },
];

const GAZETTEER: Entry[] = [
  ...DEFAULT_DESTINATIONS.map((d) => ({
    key: d.key,
    name: d.name,
    lat: d.lat,
    lng: d.lng,
    destinationKey: d.key,
    aliases: EXTRA_ALIASES[d.key] ?? [d.name.toLowerCase()],
  })),
  ...EXTRAS,
];

// Lower case, letters and single spaces only, padded so every alias match
// can demand a space either side (a whole-word match: "kae" never matches
// inside "kaesar", "paje" never inside "pajero").
function normalise(text: string): string {
  return ` ${text.toLowerCase().replace(/[^a-z]+/g, " ").trim()} `;
}

// The area a piece of free text names, or null. When it names more than one
// ("Fumba and Kizimkazi", "Bwejuu–Dongwe") the first one mentioned wins, as
// that is the one the writer led with.
export function matchZanzibarPlace(text: string | null | undefined): ZanzibarPlace | null {
  if (!text) return null;
  const haystack = normalise(text);
  let best: { entry: Entry; at: number; length: number } | null = null;
  for (const entry of GAZETTEER) {
    for (const alias of entry.aliases) {
      const at = haystack.indexOf(` ${alias} `);
      if (at === -1) continue;
      if (!best || at < best.at || (at === best.at && alias.length > best.length)) best = { entry, at, length: alias.length };
    }
  }
  if (!best) return null;
  const { key, name, lat, lng, destinationKey } = best.entry;
  return { key, name, lat, lng, destinationKey };
}
