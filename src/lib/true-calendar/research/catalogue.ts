// Filtering the History catalogue. Pure, so it can be tested and run on the
// server from the URL's search parameters.

type CultureRow = {
  key: string;
  name: string;
  alt_names?: string[] | null;
  continent: string;
  region?: string | null;
  countries?: string[] | null;
  research_status: string;
  period_start?: number | null;
  period_end?: number | null;
  continues_today?: string | null;
};
type SystemRow = { culture_key: string; kind: string; name: string };

export interface CatalogueFilters {
  q: string;
  continent: string;
  kind: string;
  status: string;
  period: string;
}

// Periods by the years a tradition's calendar was in use (astronomical years:
// negative is BCE). A tradition whose period isn't recorded yet matches no
// period filter rather than being guessed into one.
export const PERIOD_FILTERS = [
  { key: "ancient", label: "Ancient (before 500 CE)", test: (s: number | null) => s !== null && s < 500 },
  { key: "medieval", label: "500 to 1500 CE", test: (s: number | null, e: number | null) => (s !== null && s < 1500 && (e === null || e >= 500)) },
  { key: "modern", label: "After 1500", test: (s: number | null, e: number | null) => (e === null ? s !== null : e >= 1500) },
  { key: "living", label: "Still kept today", test: () => false },
] as const;

function norm(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export function filterCatalogue<C extends CultureRow>(cultures: C[], systems: SystemRow[], f: CatalogueFilters): C[] {
  const q = norm(f.q.trim());
  const systemsOf = new Map<string, SystemRow[]>();
  for (const s of systems) systemsOf.set(s.culture_key, [...(systemsOf.get(s.culture_key) ?? []), s]);
  const period = PERIOD_FILTERS.find((p) => p.key === f.period);

  return cultures.filter((c) => {
    if (f.continent && c.continent !== f.continent) return false;
    if (f.status && c.research_status !== f.status) return false;
    const own = systemsOf.get(c.key) ?? [];
    if (f.kind && !own.some((s) => s.kind === f.kind)) return false;
    if (period) {
      if (period.key === "living") {
        if (c.continues_today !== "yes" && c.continues_today !== "partly") return false;
      } else if (!period.test(c.period_start ?? null, c.period_end ?? null)) {
        return false;
      }
    }
    if (q) {
      // Every word typed must start a word in the culture's names, places or calendars.
      const words = norm([c.name, ...(c.alt_names ?? []), c.region ?? "", c.continent, ...(c.countries ?? []), ...own.map((s) => s.name)].join(" ")).split(/[^a-z0-9]+/);
      if (!q.split(/[^a-z0-9]+/).filter(Boolean).every((w) => words.some((h) => h.startsWith(w)))) return false;
    }
    return true;
  });
}
