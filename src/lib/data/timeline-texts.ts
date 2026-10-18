import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Database,
  TimelineDateClaim,
  TimelinePassageDate,
  TimelinePassageImage,
  TimelinePassageLink,
  TimelinePassageWitness,
  TimelineSource,
  TimelineTextImportRun,
  TimelineTextLayer,
  TimelineTextManuscript,
  TimelineTextPassage,
  TimelineTextWork,
  TimelineTheme,
} from "@/types/database";
import type { ManifestCounts } from "@/lib/timeline/texts/manifest";
import { inventoryWork } from "@/lib/timeline/texts/inventory";
import { evidenceDate } from "@/lib/timeline/texts/reading";
import { dateRoleFromWhatIsDated } from "@/lib/timeline/texts/taxonomy";

// READS FOR THE TEXT ARCHIVE (src/lib/timeline/texts/).
//
// Every query is scoped by community and, below the library, by work or by
// passage — never "every passage in the community", which for a finished
// archive is thousands of rows and would also run into the API's row cap.
// Where a work can exceed that cap (the Coffin Texts have 1,185 spells, each
// with containers), its outline is read in pages.

type Client = SupabaseClient<Database>;

const PAGE = 1000;

/** Every row of a ranged query, a page at a time. */
async function readAll<T>(fetchPage: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: unknown }>): Promise<T[]> {
  const rows: T[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await fetchPage(from, from + PAGE - 1);
    if (error) throw error;
    rows.push(...(data ?? []));
    if (!data || data.length < PAGE) return rows;
  }
}

// ---------------------------------------------------------------------------
// THE LIBRARY
// ---------------------------------------------------------------------------

export type LibraryWork = TimelineTextWork & {
  counts: ManifestCounts | null;
  eventSlug: string | null;
  lastRun: Pick<TimelineTextImportRun, "status" | "cursor" | "total" | "finished_at" | "file_hash"> | null;
};

const EMPTY_COUNTS: ManifestCounts = {
  importedUnits: 0,
  verifiedUnits: 0,
  passageRecords: 0,
  translations: 0,
  translationsWithText: 0,
  imagesFound: 0,
  imagesVerified: 0,
  unresolvedVariants: 0,
};

/** Every work row, with live counts for the works that have passages. */
export async function getLibrary(supabase: Client, communityId: string): Promise<LibraryWork[]> {
  const { data: works, error } = await supabase
    .from("timeline_text_works")
    .select("*")
    .eq("community_id", communityId)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  if (!works?.length) return [];

  const eventIds = works.map((w) => w.event_id).filter((id): id is string => !!id);
  const { data: events } = eventIds.length
    ? await supabase.from("timeline_events").select("id, slug").in("id", eventIds)
    : { data: [] as { id: string; slug: string }[] };
  const slugById = new Map((events ?? []).map((e) => [e.id, e.slug]));

  const { data: runs } = await supabase
    .from("timeline_text_import_runs")
    .select("work_key, status, cursor, total, finished_at, started_at, file_hash")
    .eq("community_id", communityId)
    .order("started_at", { ascending: false });
  const lastRun = new Map<string, LibraryWork["lastRun"]>();
  for (const run of runs ?? []) if (!lastRun.has(run.work_key)) lastRun.set(run.work_key, run);

  const counted = await Promise.all(
    works.map((work) => (lastRun.has(work.work_key) ? countWork(supabase, communityId, work) : Promise.resolve(null)))
  );

  return works.map((work, index) => ({
    ...work,
    counts: counted[index],
    eventSlug: work.event_id ? slugById.get(work.event_id) ?? null : null,
    lastRun: lastRun.get(work.work_key) ?? null,
  }));
}

/** Live counts for one work's manifest, read from the database. */
export async function countWork(supabase: Client, communityId: string, work: TimelineTextWork): Promise<ManifestCounts> {
  const passages = () =>
    supabase
      .from("timeline_text_passages")
      .select("id", { count: "exact", head: true })
      .eq("community_id", communityId)
      .eq("work_id", work.id);
  const unitKind = inventoryWork(work.work_key)?.unitDivisionKind ?? null;
  const [records, units, verified, images, imagesVerified] = await Promise.all([
    passages(),
    unitKind ? passages().eq("division_kind", unitKind) : passages(),
    (unitKind ? passages().eq("division_kind", unitKind) : passages()).neq("verification_status", "unverified"),
    supabase.from("timeline_passage_images").select("id", { count: "exact", head: true }).eq("community_id", communityId).eq("work_id", work.id),
    supabase
      .from("timeline_passage_images")
      .select("id", { count: "exact", head: true })
      .eq("community_id", communityId)
      .eq("work_id", work.id)
      .eq("verification_status", "verified"),
  ]);

  // Layers, passage images and variants are counted over the work's passage
  // ids, which the outline query already pages through.
  const ids = (await getOutline(supabase, communityId, work.id)).map((row) => row.id);
  let translations = 0;
  let translationsWithText = 0;
  let passageImages = 0;
  let unresolvedVariants = 0;
  for (let i = 0; i < ids.length; i += 200) {
    const slice = ids.slice(i, i + 200);
    const [all, withText, pics, variants] = await Promise.all([
      supabase.from("timeline_text_layers").select("id", { count: "exact", head: true }).in("passage_id", slice).eq("layer", "translation"),
      supabase
        .from("timeline_text_layers")
        .select("id", { count: "exact", head: true })
        .in("passage_id", slice)
        .eq("layer", "translation")
        .not("content", "is", null),
      supabase.from("timeline_passage_images").select("id", { count: "exact", head: true }).in("passage_id", slice),
      supabase.from("timeline_passage_witnesses").select("id", { count: "exact", head: true }).in("passage_id", slice).not("variant_note", "is", null),
    ]);
    translations += all.count ?? 0;
    translationsWithText += withText.count ?? 0;
    passageImages += pics.count ?? 0;
    unresolvedVariants += variants.count ?? 0;
  }

  return {
    ...EMPTY_COUNTS,
    passageRecords: records.count ?? 0,
    importedUnits: units.count ?? 0,
    verifiedUnits: verified.count ?? 0,
    translations,
    translationsWithText,
    imagesFound: (images.count ?? 0) + passageImages,
    imagesVerified: imagesVerified.count ?? 0,
    unresolvedVariants,
  };
}

// ---------------------------------------------------------------------------
// ONE WORK
// ---------------------------------------------------------------------------

export type OutlinePassage = Pick<
  TimelineTextPassage,
  "id" | "parent_id" | "passage_key" | "ordinal" | "label" | "reference" | "division_kind" | "summary" | "verification_status"
> & { parent_key: string | null };

export async function getWorkByKey(supabase: Client, communityId: string, workKey: string): Promise<TimelineTextWork | null> {
  const { data, error } = await supabase
    .from("timeline_text_works")
    .select("*")
    .eq("community_id", communityId)
    .eq("work_key", workKey)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/** The work's table of contents: every passage, without its text. */
export async function getOutline(supabase: Client, communityId: string, workId: string): Promise<OutlinePassage[]> {
  const rows = await readAll((from, to) =>
    supabase
      .from("timeline_text_passages")
      .select("id, parent_id, passage_key, ordinal, label, reference, division_kind, summary, verification_status")
      .eq("community_id", communityId)
      .eq("work_id", workId)
      .order("ordinal", { ascending: true })
      .range(from, to)
  );
  const keyById = new Map(rows.map((row) => [row.id, row.passage_key]));
  return rows.map((row) => ({ ...row, parent_key: row.parent_id ? keyById.get(row.parent_id) ?? null : null }));
}

/** The marker's date claims: the five chronological concepts for the work. */
export async function getWorkClaims(supabase: Client, eventId: string): Promise<TimelineDateClaim[]> {
  const { data, error } = await supabase.from("timeline_date_claims").select("*").eq("event_id", eventId);
  if (error) throw error;
  return data ?? [];
}

export async function getWorkManuscripts(supabase: Client, communityId: string, workId: string): Promise<TimelineTextManuscript[]> {
  const { data, error } = await supabase
    .from("timeline_text_manuscripts")
    .select("*")
    .eq("community_id", communityId)
    .eq("work_id", workId)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getWorkImages(supabase: Client, communityId: string, workId: string): Promise<TimelinePassageImage[]> {
  const { data, error } = await supabase
    .from("timeline_passage_images")
    .select("*")
    .eq("community_id", communityId)
    .eq("work_id", workId)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

/** The works hung on one timeline event — what the event page offers to open. */
export async function getWorksForEvent(
  supabase: Client,
  communityId: string,
  eventId: string
): Promise<Pick<TimelineTextWork, "work_key" | "title" | "completeness_status" | "unit_label" | "expected_units">[]> {
  const { data, error } = await supabase
    .from("timeline_text_works")
    .select("work_key, title, completeness_status, unit_label, expected_units")
    .eq("community_id", communityId)
    .eq("event_id", eventId)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

/** Event id → the works hung on it, for the timeline drawer. */
export async function getWorksByEvent(
  supabase: Client,
  communityId: string
): Promise<Record<string, { workKey: string; title: string }[]>> {
  const { data, error } = await supabase
    .from("timeline_text_works")
    .select("event_id, work_key, title, completeness_status")
    .eq("community_id", communityId)
    .not("event_id", "is", null)
    .order("sort_order", { ascending: true });
  // The archive is optional: a database without its tables reads as no works.
  if (error) return {};
  const map: Record<string, { workKey: string; title: string }[]> = {};
  for (const row of data ?? []) {
    (map[row.event_id!] ??= []).push({ workKey: row.work_key, title: row.title });
  }
  return map;
}

// ---------------------------------------------------------------------------
// ONE PASSAGE, WITH EVERYTHING THE READER SHOWS
// ---------------------------------------------------------------------------

export type ReaderPassage = TimelineTextPassage & {
  layers: TimelineTextLayer[];
  witnesses: (TimelinePassageWitness & { manuscript: TimelineTextManuscript | null })[];
  dates: TimelinePassageDate[];
  images: TimelinePassageImage[];
  themes: { theme: TimelineTheme; note: string }[];
  links: TimelinePassageLink[];
};

export async function getPassageByKey(supabase: Client, communityId: string, passageKey: string): Promise<ReaderPassage | null> {
  const { data: passage, error } = await supabase
    .from("timeline_text_passages")
    .select("*")
    .eq("community_id", communityId)
    .eq("passage_key", passageKey)
    .maybeSingle();
  if (error) throw error;
  if (!passage) return null;

  const [layers, witnesses, dates, images, themes, links] = await Promise.all([
    supabase.from("timeline_text_layers").select("*").eq("passage_id", passage.id).order("sort_order", { ascending: true }),
    supabase.from("timeline_passage_witnesses").select("*").eq("passage_id", passage.id).order("sort_order", { ascending: true }),
    supabase.from("timeline_passage_dates").select("*").eq("passage_id", passage.id),
    supabase.from("timeline_passage_images").select("*").eq("passage_id", passage.id).order("sort_order", { ascending: true }),
    supabase.from("timeline_passage_themes").select("note, theme_id").eq("passage_id", passage.id),
    getLinksFor(supabase, communityId, [passageKey]),
  ]);

  const manuscriptIds = (witnesses.data ?? []).map((w) => w.manuscript_id);
  const { data: manuscripts } = manuscriptIds.length
    ? await supabase.from("timeline_text_manuscripts").select("*").in("id", manuscriptIds)
    : { data: [] as TimelineTextManuscript[] };
  const manuscriptById = new Map((manuscripts ?? []).map((m) => [m.id, m]));

  const themeIds = (themes.data ?? []).map((t) => t.theme_id);
  const { data: themeRows } = themeIds.length
    ? await supabase.from("timeline_themes").select("*").in("id", themeIds)
    : { data: [] as TimelineTheme[] };
  const themeById = new Map((themeRows ?? []).map((t) => [t.id, t]));

  return {
    ...passage,
    layers: layers.data ?? [],
    witnesses: (witnesses.data ?? []).map((w) => ({ ...w, manuscript: manuscriptById.get(w.manuscript_id) ?? null })),
    dates: dates.data ?? [],
    images: images.data ?? [],
    themes: (themes.data ?? []).flatMap((t) => {
      const theme = themeById.get(t.theme_id);
      return theme ? [{ theme, note: t.note }] : [];
    }),
    links,
  };
}

/** The text of each imported layer of these passages, by passage key and then by the layer's import key. */
export async function getLayerTexts(
  supabase: Client,
  communityId: string,
  passageKeys: string[]
): Promise<Map<string, Map<string, string>>> {
  const out = new Map<string, Map<string, string>>();
  if (passageKeys.length === 0) return out;
  const { data: passages } = await supabase
    .from("timeline_text_passages")
    .select("id, passage_key")
    .eq("community_id", communityId)
    .in("passage_key", passageKeys);
  const keyById = new Map((passages ?? []).map((p) => [p.id, p.passage_key]));
  if (keyById.size === 0) return out;
  const { data: layers } = await supabase
    .from("timeline_text_layers")
    .select("passage_id, import_key, content")
    .in("passage_id", [...keyById.keys()]);
  for (const layer of layers ?? []) {
    const key = keyById.get(layer.passage_id);
    if (!key || !layer.import_key || !layer.content) continue;
    if (!out.has(key)) out.set(key, new Map());
    out.get(key)!.set(layer.import_key, layer.content);
  }
  return out;
}

/** Connections touching any of these passages, in either direction. */
export async function getLinksFor(supabase: Client, communityId: string, keys: string[]): Promise<TimelinePassageLink[]> {
  if (keys.length === 0) return [];
  const [from, to] = await Promise.all([
    supabase.from("timeline_passage_links").select("*").eq("community_id", communityId).in("from_passage_key", keys),
    supabase.from("timeline_passage_links").select("*").eq("community_id", communityId).in("to_passage_key", keys),
  ]);
  const byId = new Map<string, TimelinePassageLink>();
  for (const link of [...(from.data ?? []), ...(to.data ?? [])]) byId.set(link.id, link);
  return [...byId.values()];
}

/** Label, reference and work for passage keys — what a connection shows of its far end. */
export async function getPassageHeads(
  supabase: Client,
  communityId: string,
  keys: string[]
): Promise<Map<string, { label: string; reference: string | null; workKey: string | null; workTitle: string | null; summary: string | null }>> {
  const out = new Map<string, { label: string; reference: string | null; workKey: string | null; workTitle: string | null; summary: string | null }>();
  if (keys.length === 0) return out;
  const { data } = await supabase
    .from("timeline_text_passages")
    .select("passage_key, label, reference, summary, work_id")
    .eq("community_id", communityId)
    .in("passage_key", keys);
  const workIds = [...new Set((data ?? []).map((row) => row.work_id).filter((id): id is string => !!id))];
  const { data: works } = workIds.length
    ? await supabase.from("timeline_text_works").select("id, work_key, title").in("id", workIds)
    : { data: [] as { id: string; work_key: string; title: string }[] };
  const workById = new Map((works ?? []).map((w) => [w.id, w]));
  for (const row of data ?? []) {
    const work = row.work_id ? workById.get(row.work_id) : undefined;
    out.set(row.passage_key!, {
      label: row.label,
      reference: row.reference,
      summary: row.summary,
      workKey: work?.work_key ?? null,
      workTitle: work?.title ?? null,
    });
  }
  return out;
}

/** The text and dates of several passages, for the comparison page. */
export async function getPassagesForComparison(supabase: Client, communityId: string, keys: string[]) {
  return Promise.all(keys.map((key) => getPassageByKey(supabase, communityId, key)));
}

// ---------------------------------------------------------------------------
// THEMES, IMAGES, INTERPRETATIONS — the archive-wide views
// ---------------------------------------------------------------------------

export async function getThemes(supabase: Client, communityId: string): Promise<(TimelineTheme & { passages: number })[]> {
  const { data: themes, error } = await supabase
    .from("timeline_themes")
    .select("*")
    .eq("community_id", communityId)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  const counts = await Promise.all(
    (themes ?? []).map((theme) =>
      supabase.from("timeline_passage_themes").select("id", { count: "exact", head: true }).eq("theme_id", theme.id)
    )
  );
  return (themes ?? []).map((theme, i) => ({ ...theme, passages: counts[i].count ?? 0 }));
}

export type ThemePassage = {
  passageKey: string;
  label: string;
  reference: string | null;
  summary: string | null;
  note: string;
  workKey: string;
  workTitle: string;
  corpusGroup: string;
  traditionClass: string;
  /** The oldest positioned date on the work's marker, for ordering in time. */
  year: number | null;
  dateText: string | null;
};

/** Every passage under one theme, with its work, in time order. */
export async function getThemePassages(
  supabase: Client,
  communityId: string,
  themeKey: string
): Promise<{ theme: TimelineTheme | null; passages: ThemePassage[]; links: TimelinePassageLink[] }> {
  const { data: theme } = await supabase
    .from("timeline_themes")
    .select("*")
    .eq("community_id", communityId)
    .eq("theme_key", themeKey)
    .maybeSingle();
  if (!theme) return { theme: null, passages: [], links: [] };

  const tagged = await readAll((from, to) =>
    supabase.from("timeline_passage_themes").select("passage_id, note").eq("theme_id", theme.id).range(from, to)
  );
  const ids = tagged.map((t) => t.passage_id);
  const passages: { id: string; passage_key: string | null; label: string; reference: string | null; summary: string | null; work_id: string | null }[] = [];
  for (let i = 0; i < ids.length; i += 200) {
    const { data } = await supabase
      .from("timeline_text_passages")
      .select("id, passage_key, label, reference, summary, work_id")
      .in("id", ids.slice(i, i + 200));
    passages.push(...(data ?? []));
  }
  const workIds = [...new Set(passages.map((p) => p.work_id).filter((id): id is string => !!id))];
  const { data: works } = workIds.length
    ? await supabase.from("timeline_text_works").select("*").in("id", workIds)
    : { data: [] as TimelineTextWork[] };
  const workById = new Map((works ?? []).map((w) => [w.id, w]));
  const eventIds = (works ?? []).map((w) => w.event_id).filter((id): id is string => !!id);
  const { data: claims } = eventIds.length
    ? await supabase
        .from("timeline_date_claims")
        .select("event_id, start_year, original_date_text, what_is_dated")
        .in("event_id", eventIds)
        .not("start_year", "is", null)
    : { data: [] as Pick<TimelineDateClaim, "event_id" | "start_year" | "original_date_text" | "what_is_dated">[] };

  // The oldest EVIDENCE for the work, not the date it claims for itself:
  // Doreal's tablets claim to predate the Pyramid Texts.
  const dateByEvent = new Map<string, { year: number; text: string | null }>();
  for (const eventId of eventIds) {
    const statements = (claims ?? [])
      .filter((c) => c.event_id === eventId)
      .map((c) => ({ role: dateRoleFromWhatIsDated(c.what_is_dated), start_year: c.start_year, end_year: null, original_date_text: c.original_date_text }));
    const found = evidenceDate(statements);
    if (found) dateByEvent.set(eventId, { year: found.year, text: found.text });
  }

  const noteById = new Map(tagged.map((t) => [t.passage_id, t.note]));
  const out: ThemePassage[] = passages.flatMap((p) => {
    const work = p.work_id ? workById.get(p.work_id) : undefined;
    if (!work || !p.passage_key) return [];
    const date = work.event_id ? dateByEvent.get(work.event_id) : undefined;
    return [{
      passageKey: p.passage_key,
      label: p.label,
      reference: p.reference,
      summary: p.summary,
      note: noteById.get(p.id) ?? "",
      workKey: work.work_key,
      workTitle: work.title,
      corpusGroup: work.corpus_group,
      traditionClass: work.tradition_class,
      year: date?.year ?? null,
      dateText: date?.text ?? null,
    }];
  });
  out.sort((a, b) => (a.year ?? Infinity) - (b.year ?? Infinity) || a.passageKey.localeCompare(b.passageKey, "en", { numeric: true }));

  const links = await getLinksFor(supabase, communityId, out.map((p) => p.passageKey));
  const inTheme = new Set(out.map((p) => p.passageKey));
  return { theme, passages: out, links: links.filter((l) => inTheme.has(l.from_passage_key) && inTheme.has(l.to_passage_key)) };
}

export type GalleryImage = TimelinePassageImage & { workKey: string | null; workTitle: string | null; passageKey: string | null; passageLabel: string | null };

export async function getGallery(supabase: Client, communityId: string): Promise<GalleryImage[]> {
  const images = await readAll((from, to) =>
    supabase
      .from("timeline_passage_images")
      .select("*")
      .eq("community_id", communityId)
      .order("created_at", { ascending: true })
      .range(from, to)
  );
  const passageIds = [...new Set(images.map((i) => i.passage_id).filter((id): id is string => !!id))];
  const { data: passages } = passageIds.length
    ? await supabase.from("timeline_text_passages").select("id, passage_key, label, work_id").in("id", passageIds)
    : { data: [] as { id: string; passage_key: string | null; label: string; work_id: string | null }[] };
  const passageById = new Map((passages ?? []).map((p) => [p.id, p]));
  const workIds = [
    ...new Set([...images.map((i) => i.work_id), ...(passages ?? []).map((p) => p.work_id)].filter((id): id is string => !!id)),
  ];
  const { data: works } = workIds.length
    ? await supabase.from("timeline_text_works").select("id, work_key, title").in("id", workIds)
    : { data: [] as { id: string; work_key: string; title: string }[] };
  const workById = new Map((works ?? []).map((w) => [w.id, w]));
  return images.map((image) => {
    const passage = image.passage_id ? passageById.get(image.passage_id) : undefined;
    const work = workById.get(image.work_id ?? passage?.work_id ?? "");
    return {
      ...image,
      workKey: work?.work_key ?? null,
      workTitle: work?.title ?? null,
      passageKey: passage?.passage_key ?? null,
      passageLabel: passage?.label ?? null,
    };
  });
}

/** Every connection in the archive that carries an alternative reading, and every interpretation layer. */
export async function getInterpretations(supabase: Client, communityId: string) {
  const { data: links } = await supabase
    .from("timeline_passage_links")
    .select("*")
    .eq("community_id", communityId)
    .order("created_at", { ascending: true });
  const { data: works } = await supabase.from("timeline_text_works").select("id").eq("community_id", communityId);
  const workIds = (works ?? []).map((w) => w.id);
  const { data: passages } = workIds.length
    ? await supabase.from("timeline_text_passages").select("id, passage_key").eq("community_id", communityId).in("work_id", workIds).limit(5000)
    : { data: [] as { id: string; passage_key: string | null }[] };
  const keyById = new Map((passages ?? []).map((p) => [p.id, p.passage_key]));
  const layers: TimelineTextLayer[] = [];
  const ids = [...keyById.keys()];
  for (let i = 0; i < ids.length; i += 200) {
    const { data } = await supabase
      .from("timeline_text_layers")
      .select("*")
      .in("passage_id", ids.slice(i, i + 200))
      .or("layer.eq.interpretation,viewpoint.not.is.null");
    layers.push(...(data ?? []));
  }
  return {
    links: links ?? [],
    layers: layers.map((layer) => ({ ...layer, passageKey: keyById.get(layer.passage_id) ?? null })),
  };
}

export async function getSourcesByIds(supabase: Client, ids: string[]): Promise<Map<string, TimelineSource>> {
  const unique = [...new Set(ids.filter(Boolean))];
  if (unique.length === 0) return new Map();
  const { data } = await supabase.from("timeline_sources").select("*").in("id", unique);
  return new Map((data ?? []).map((s) => [s.id, s]));
}
