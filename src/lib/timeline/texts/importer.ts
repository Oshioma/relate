// THE ARCHIVE IMPORTER: repeatable, idempotent, validated, resumable, logged.
//
// Two steps, both run by staff from the library page:
//
//   installLibrary   Every inventoried work gets its row, its marker on the
//                    timeline (created, or found and given the dates it was
//                    missing), its links to existing records, and the theme
//                    list. Run it again and it adds only what is missing.
//
//   importWorkChunk  One corpus file, a chunk at a time. Each call writes the
//                    next CHUNK passages, records how far it got in the run's
//                    cursor and returns; the page calls again until done. A
//                    request that dies part-way leaves a run whose cursor says
//                    exactly where to pick up, and nothing half-written that a
//                    re-run will not overwrite.
//
// IDEMPOTENT BY KEY. Every row an import writes is found again by its key
// (work_key, passage_key, import_key …) and upserted, so importing twice
// changes nothing. A passage whose content hash has not changed is skipped.
//
// IT NEVER TOUCHES WHAT A PERSON WROTE. Layers a person added to an archive
// passage carry no import_key, and the only deletion here — of imported layers
// a newer version of the file no longer has — is limited to rows that do.
//
// Writes go through the caller's own client, so RLS applies: the archive
// tables accept writes from community staff only.

import { createHash } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Community, Database } from "@/types/database";
import { pictureTopUp } from "../bring-in-image";
import type { SeedClaim, SeedPicture, SeedSource } from "../seed-types";
import type { InventoryWork, TextCorpusFile } from "./corpus-types";
import { corpusFor } from "./corpus";
import { INVENTORY, INVENTORY_SOURCES } from "./inventory";
import { deriveCompleteness } from "./manifest";
import { MARKER_PICTURES } from "./marker-pictures";
import { keepCopiedPictures } from "./pictures";
import { ARCHIVE_THEMES } from "./taxonomy";
import { formatProblems, validateCorpus, validateInventory } from "./validate";

type Client = SupabaseClient<Database>;

/** Passages written per call. Small enough to finish well inside a request. */
export const IMPORT_CHUNK = 60;

export function hashOf(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex").slice(0, 32);
}

// ---------------------------------------------------------------------------
// SOURCES — reused by title and author, as the timeline's seeders do.
// ---------------------------------------------------------------------------

async function resolveSources(
  supabase: Client,
  communityId: string,
  userId: string,
  sources: SeedSource[]
): Promise<Map<string, string>> {
  const keyOf = (title: string, author: string | null | undefined) =>
    `${title.trim().toLowerCase()}|${(author ?? "").trim().toLowerCase()}`;
  const { data: known, error } = await supabase
    .from("timeline_sources")
    .select("id, title, author")
    .eq("community_id", communityId);
  if (error) throw new Error(error.message);
  const byTitle = new Map((known ?? []).map((row) => [keyOf(row.title, row.author), row.id]));
  const ids = new Map<string, string>();
  for (const source of sources) {
    const already = byTitle.get(keyOf(source.title, source.author));
    if (already) {
      ids.set(source.key, already);
      continue;
    }
    const { data, error: insertError } = await supabase
      .from("timeline_sources")
      .insert({
        community_id: communityId,
        created_by: userId,
        title: source.title,
        author: source.author ?? null,
        publisher: source.publisher ?? null,
        work_title: source.workTitle ?? null,
        reference: source.reference ?? null,
        url: source.url ?? null,
        source_type: source.sourceType,
        notes: source.notes,
        published_year: source.publishedYear ?? null,
        published_display: source.publishedDisplay ?? "",
        published_is_approximate: false,
      })
      .select("id")
      .single();
    if (insertError) throw new Error(`source ${source.key}: ${insertError.message}`);
    ids.set(source.key, data.id);
    byTitle.set(keyOf(source.title, source.author), data.id);
  }
  return ids;
}

function claimRow(claim: SeedClaim, eventId: string, communityId: string, userId: string, sourceIds: Map<string, string>) {
  return {
    event_id: eventId,
    community_id: communityId,
    created_by: userId,
    source_id: claim.sourceKey ? sourceIds.get(claim.sourceKey) ?? null : null,
    start_year: claim.startYear ?? null,
    start_month: claim.startMonth ?? null,
    start_day: claim.startDay ?? null,
    end_year: claim.endYear ?? null,
    date_precision: claim.datePrecision,
    precision_decimals: claim.precisionDecimals ?? 0,
    temporal_claim_type: claim.temporalClaimType ?? null,
    duration_years: claim.durationYears ?? null,
    what_is_dated: claim.whatIsDated ?? null,
    date_convention: claim.dateConvention ?? null,
    convention_reference_year: claim.conventionReferenceYear ?? null,
    uncertainty_plus: claim.uncertaintyPlus ?? null,
    uncertainty_minus: claim.uncertaintyMinus ?? null,
    is_approximate: claim.isApproximate,
    original_date_text: claim.originalDateText,
    dating_method: claim.datingMethod,
    chronology: claim.chronology,
    evidence: claim.evidence,
    notes: claim.notes ?? null,
  };
}

// ---------------------------------------------------------------------------
// STEP 1: THE LIBRARY
// ---------------------------------------------------------------------------

export type InstallResult = {
  works: number;
  markersAdded: number;
  /** Pictures put on markers. They point at their source until "Copy pictures" brings them in. */
  picturesAdded: number;
  claimsAdded: number;
  linksAdded: number;
  themes: number;
  missingAnchors: string[];
};

/**
 * A MARKER'S PICTURES, ADDED WHERE IT HAS NONE OF THEM YET.
 *
 * Markers made before the inventory carried pictures have none. The pictures
 * are written with their source address and copied into storage by the
 * library's "Copy pictures" button, so an install never waits on downloads.
 * Uses the timeline's own top-up rule: a picture is missing when no picture on
 * the record has its caption, and a cover is set only on a record without one.
 */
async function addMissingPictures(
  supabase: Client,
  eventId: string,
  stored: { image_url: string | null; media: unknown },
  seed: { imageUrl?: string; media?: SeedPicture[] }
): Promise<number> {
  const media = (Array.isArray(stored.media) ? stored.media : []) as SeedPicture[];
  const { missing, needsCover } = pictureTopUp({ image_url: stored.image_url, media }, seed);
  if (missing.length === 0 && !needsCover) return 0;
  const { error } = await supabase
    .from("timeline_events")
    .update({
      media: [...media, ...missing],
      ...(needsCover ? { image_url: seed.imageUrl } : {}),
    })
    .eq("id", eventId);
  if (error) throw new Error(`pictures for ${eventId}: ${error.message}`);
  return missing.length;
}

/** A marker's pictures: its own, else the library's list for its slug. The first is the cover. */
export function markerPictures(seed: { slug: string; imageUrl?: string; media?: SeedPicture[] }): {
  imageUrl?: string;
  media: SeedPicture[];
} {
  const media = seed.media ?? MARKER_PICTURES[seed.slug] ?? [];
  return { imageUrl: seed.imageUrl ?? media[0]?.url, media };
}

export async function installLibrary(supabase: Client, community: Community, userId: string): Promise<InstallResult> {
  const problems = validateInventory(INVENTORY);
  if (problems.length > 0) throw new Error(`The inventory has problems:\n${formatProblems(problems)}`);

  const sourceIds = await resolveSources(supabase, community.id, userId, INVENTORY_SOURCES);
  const result: InstallResult = { works: 0, markersAdded: 0, picturesAdded: 0, claimsAdded: 0, linksAdded: 0, themes: 0, missingAnchors: [] };

  // --- Markers ---------------------------------------------------------------
  const anchorSlug = (work: InventoryWork) =>
    work.anchor == null ? null : "event" in work.anchor ? work.anchor.event.slug : work.anchor.existingSlug;
  const slugs = [...new Set(INVENTORY.map(anchorSlug).filter((s): s is string => !!s))];
  const linkSlugs = [...new Set(INVENTORY.flatMap((w) => (w.eventLinks ?? []).map((l) => l.slug)))];
  const { data: present, error: presentError } = await supabase
    .from("timeline_events")
    .select("id, slug, image_url, media")
    .eq("community_id", community.id)
    .in("slug", [...slugs, ...linkSlugs]);
  if (presentError) throw new Error(presentError.message);
  const idBySlug = new Map((present ?? []).map((row) => [row.slug, row.id]));
  const storedBySlug = new Map((present ?? []).map((row) => [row.slug, row]));

  for (const work of INVENTORY) {
    if (!work.anchor) continue;
    if ("event" in work.anchor) {
      const seed = work.anchor.event;
      if (idBySlug.has(seed.slug)) {
        result.claimsAdded += await addMissingClaims(supabase, community.id, userId, idBySlug.get(seed.slug)!, seed.claims, sourceIds);
        result.picturesAdded += await addMissingPictures(supabase, idBySlug.get(seed.slug)!, storedBySlug.get(seed.slug)!, markerPictures(seed));
        continue;
      }
      const { data: event, error } = await supabase
        .from("timeline_events")
        .insert({
          community_id: community.id,
          created_by: userId,
          slug: seed.slug,
          title: seed.title,
          summary: seed.summary,
          description: seed.description,
          category: seed.category,
          subcategory: seed.subcategory ?? null,
          event_type: seed.eventType,
          event_type_note: seed.eventTypeNote ?? null,
          tags: seed.tags,
          people: seed.people ?? [],
          civilisations: seed.civilisations ?? [],
          motifs: seed.motifs ?? [],
          location_name: seed.locationName ?? null,
          lat: seed.lat ?? null,
          lng: seed.lng ?? null,
          prominence: work.prominence ?? null,
          image_url: markerPictures(seed).imageUrl ?? null,
          media: markerPictures(seed).media,
          status: "published",
        })
        .select("id")
        .single();
      if (error || !event) throw new Error(`marker for ${work.workKey}: ${error?.message}`);
      const { error: claimError } = await supabase
        .from("timeline_date_claims")
        .insert(seed.claims.map((claim) => claimRow(claim, event.id, community.id, userId, sourceIds)));
      if (claimError) {
        // A marker with no dates cannot be drawn: take it back out.
        await supabase.from("timeline_events").delete().eq("id", event.id);
        throw new Error(`dates for ${work.workKey}: ${claimError.message}`);
      }
      idBySlug.set(seed.slug, event.id);
      result.markersAdded++;
      result.picturesAdded += markerPictures(seed).media.length;
      result.claimsAdded += seed.claims.length;
    } else {
      const eventId = idBySlug.get(work.anchor.existingSlug);
      if (!eventId) {
        // The community does not have the record this work hangs off. The
        // work is still listed; it gets its marker when the record arrives.
        result.missingAnchors.push(work.anchor.existingSlug);
        continue;
      }
      result.claimsAdded += await addMissingClaims(supabase, community.id, userId, eventId, work.anchor.extraClaims ?? [], sourceIds);
    }
  }

  // --- Links from markers to existing records ---------------------------------
  const { data: existingLinks } = await supabase
    .from("timeline_event_links")
    .select("from_event_id, to_event_id, relation")
    .eq("community_id", community.id);
  const already = new Set((existingLinks ?? []).map((l) => `${l.from_event_id}|${l.to_event_id}|${l.relation}`));
  const linkRows = INVENTORY.flatMap((work) => {
    const slug = anchorSlug(work);
    const from = slug ? idBySlug.get(slug) : undefined;
    if (!from) return [];
    return (work.eventLinks ?? []).flatMap((link) => {
      const to = idBySlug.get(link.slug);
      const key = `${from}|${to}|${link.relation}`;
      if (!to || to === from || already.has(key)) return [];
      already.add(key);
      return [{ community_id: community.id, created_by: userId, from_event_id: from, to_event_id: to, relation: link.relation, note: link.note }];
    });
  });
  if (linkRows.length > 0) {
    const { error } = await supabase.from("timeline_event_links").insert(linkRows);
    if (error) throw new Error(`links: ${error.message}`);
    result.linksAdded = linkRows.length;
  }

  // --- Work rows ---------------------------------------------------------------
  const workRows = INVENTORY.map((work, index) => {
    const slug = anchorSlug(work);
    return {
      community_id: community.id,
      created_by: userId,
      event_id: slug ? idBySlug.get(slug) ?? null : null,
      work_key: work.workKey,
      title: work.title,
      alternative_titles: work.alternativeTitles ?? [],
      corpus_group: work.corpusGroup,
      tradition_class: work.traditionClass,
      civilisation: work.civilisation,
      geographical_origin: work.geographicalOrigin ?? null,
      original_language: work.originalLanguage,
      attribution: work.attribution ?? null,
      attribution_note: work.attributionNote ?? null,
      summary: work.summary,
      reference_edition: work.referenceEdition,
      expected_units: work.expectedUnits,
      unit_label: work.unitLabel,
      inventory_basis: work.inventoryBasis,
      inventory_verified: work.inventoryVerified,
      copyright_summary: work.copyrightSummary,
      notes: work.notes ?? null,
      sort_order: index,
      updated_at: new Date().toISOString(),
    };
  });
  // completeness_status is left out on purpose: the import decides it, and
  // re-installing the library must not reset a work that has been imported.
  const { error: workError } = await supabase.from("timeline_text_works").upsert(workRows, { onConflict: "community_id,work_key" });
  if (workError) throw new Error(`works: ${workError.message}`);
  result.works = workRows.length;

  // --- Themes ------------------------------------------------------------------
  const { error: themeError } = await supabase.from("timeline_themes").upsert(
    ARCHIVE_THEMES.map((theme, index) => ({
      community_id: community.id,
      created_by: userId,
      theme_key: theme.key,
      label: theme.label,
      description: theme.hint,
      sort_order: index,
    })),
    { onConflict: "community_id,theme_key" }
  );
  if (themeError) throw new Error(`themes: ${themeError.message}`);
  result.themes = ARCHIVE_THEMES.length;

  return result;
}

/** Claims the marker does not have yet, matched by their original wording. */
async function addMissingClaims(
  supabase: Client,
  communityId: string,
  userId: string,
  eventId: string,
  claims: SeedClaim[],
  sourceIds: Map<string, string>
): Promise<number> {
  if (claims.length === 0) return 0;
  const { data: have } = await supabase.from("timeline_date_claims").select("original_date_text").eq("event_id", eventId);
  const present = new Set((have ?? []).map((row) => row.original_date_text));
  const missing = claims.filter((claim) => !present.has(claim.originalDateText));
  if (missing.length === 0) return 0;
  const { error } = await supabase
    .from("timeline_date_claims")
    .insert(missing.map((claim) => claimRow(claim, eventId, communityId, userId, sourceIds)));
  if (error) throw new Error(`dates: ${error.message}`);
  return missing.length;
}

// ---------------------------------------------------------------------------
// STEP 2: A WORK'S PASSAGES, A CHUNK AT A TIME
// ---------------------------------------------------------------------------

export type ChunkResult = {
  workKey: string;
  done: boolean;
  cursor: number;
  total: number;
  inserted: number;
  updated: number;
  unchanged: number;
  status: string;
};

export async function importWorkChunk(
  supabase: Client,
  community: Community,
  userId: string,
  workKey: string,
  options: { restart?: boolean; chunk?: number } = {}
): Promise<ChunkResult> {
  const file = corpusFor(workKey);
  if (!file) throw new Error(`No corpus file for ${workKey}.`);
  const work = INVENTORY.find((w) => w.workKey === workKey)!;
  const problems = validateCorpus(file, INVENTORY);
  if (problems.length > 0) throw new Error(`${workKey} failed validation:\n${formatProblems(problems)}`);

  const findWorkRow = () =>
    supabase.from("timeline_text_works").select("id, event_id").eq("community_id", community.id).eq("work_key", workKey).maybeSingle();
  let { data: workRow } = await findWorkRow();
  if (!workRow) {
    // A work added to the inventory since the library was last installed:
    // install again (it only adds what is missing) rather than send staff back.
    await installLibrary(supabase, community, userId);
    ({ data: workRow } = await findWorkRow());
  }
  if (!workRow) throw new Error("Install the library first: this work has no row yet.");
  if (!workRow.event_id) throw new Error("This work has no marker on the timeline yet, so its passages have nowhere to hang.");

  const fileHash = hashOf(file);
  const total = file.passages.length;

  // --- The run: resume one in progress for this exact file, or start fresh. ---
  const { data: lastRun } = await supabase
    .from("timeline_text_import_runs")
    .select("*")
    .eq("community_id", community.id)
    .eq("work_key", workKey)
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let run = lastRun;
  if (!run || run.file_hash !== fileHash || options.restart || run.status === "failed") {
    if (run && run.status === "completed" && run.file_hash === fileHash && !options.restart) {
      return { workKey, done: true, cursor: run.cursor, total, inserted: 0, updated: 0, unchanged: total, status: "completed" };
    }
    const { data: fresh, error } = await supabase
      .from("timeline_text_import_runs")
      .insert({ community_id: community.id, created_by: userId, work_key: workKey, file_hash: fileHash, total })
      .select("*")
      .single();
    if (error) throw new Error(`run: ${error.message}`);
    run = fresh;
  } else if (run.status === "completed") {
    return { workKey, done: true, cursor: run.cursor, total, inserted: 0, updated: 0, unchanged: total, status: "completed" };
  }

  try {
    const sourceIds = await resolveSources(supabase, community.id, userId, file.sources);
    const manuscriptIds = await syncManuscripts(supabase, community.id, userId, workRow.id, file, sourceIds);

    const chunk = file.passages.slice(run.cursor, run.cursor + (options.chunk ?? IMPORT_CHUNK));
    const counts = await writePassages(supabase, community.id, userId, workRow, file, chunk, run.cursor, sourceIds, manuscriptIds);
    const cursor = run.cursor + chunk.length;
    const done = cursor >= total;

    if (done) {
      await syncLinks(supabase, community.id, userId, file, sourceIds);
      await syncWorkImages(supabase, community.id, userId, workRow.id, file, manuscriptIds);
    }
    // After every chunk, so a half-finished import already shows as partial.
    await updateCompleteness(supabase, community.id, workRow.id, work);

    const totals = {
      inserted: run.inserted + counts.inserted,
      updated: run.updated + counts.updated,
      unchanged: run.unchanged + counts.unchanged,
    };
    await supabase
      .from("timeline_text_import_runs")
      .update({
        cursor,
        ...totals,
        status: done ? "completed" : "running",
        finished_at: done ? new Date().toISOString() : null,
      })
      .eq("id", run.id);

    return { workKey, done, cursor, total, ...totals, status: done ? "completed" : "running" };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await supabase
      .from("timeline_text_import_runs")
      .update({ status: "failed", errors: [...(run.errors ?? []), { at: run.cursor, message }], finished_at: new Date().toISOString() })
      .eq("id", run.id);
    throw error;
  }
}

async function syncManuscripts(
  supabase: Client,
  communityId: string,
  userId: string,
  workId: string,
  file: TextCorpusFile,
  sourceIds: Map<string, string>
): Promise<Map<string, string>> {
  const manuscripts = file.manuscripts ?? [];
  if (manuscripts.length === 0) return new Map();
  const rows = manuscripts.map((m, index) => ({
    community_id: communityId,
    created_by: userId,
    // A codex holding two works (Paris gr. 1807 carries Timaeus and Critias)
    // stays with the work that imported it first.
    work_id: workId,
    manuscript_key: m.key,
    siglum: m.siglum ?? null,
    name: m.name,
    object_kind: m.objectKind,
    holding_institution: m.holdingInstitution ?? null,
    accession_number: m.accessionNumber ?? null,
    findspot: m.findspot ?? null,
    start_year: m.startYear ?? null,
    end_year: m.endYear ?? null,
    date_precision: m.datePrecision ?? null,
    is_approximate: m.isApproximate,
    original_date_text: m.originalDateText ?? null,
    dating_evidence: m.datingEvidence ?? null,
    catalogue_url: m.catalogueUrl ?? null,
    source_id: m.sourceKey ? sourceIds.get(m.sourceKey) ?? null : null,
    notes: m.notes ?? null,
    sort_order: index,
  }));
  const { data: existing } = await supabase
    .from("timeline_text_manuscripts")
    .select("manuscript_key, work_id")
    .eq("community_id", communityId)
    .in("manuscript_key", rows.map((r) => r.manuscript_key));
  const owner = new Map((existing ?? []).map((row) => [row.manuscript_key, row.work_id]));
  for (const row of rows) if (owner.get(row.manuscript_key)) row.work_id = owner.get(row.manuscript_key)!;

  const { data, error } = await supabase
    .from("timeline_text_manuscripts")
    .upsert(rows, { onConflict: "community_id,manuscript_key" })
    .select("id, manuscript_key");
  if (error) throw new Error(`manuscripts: ${error.message}`);
  return new Map((data ?? []).map((row) => [row.manuscript_key, row.id]));
}

async function writePassages(
  supabase: Client,
  communityId: string,
  userId: string,
  workRow: { id: string; event_id: string | null },
  file: TextCorpusFile,
  chunk: TextCorpusFile["passages"],
  offset: number,
  sourceIds: Map<string, string>,
  manuscriptIds: Map<string, string>
): Promise<{ inserted: number; updated: number; unchanged: number }> {
  const keys = chunk.map((p) => p.key);
  const parentKeys = [...new Set(chunk.map((p) => p.parentKey).filter((k): k is string => !!k))];
  const { data: existing } = await supabase
    .from("timeline_text_passages")
    .select("id, passage_key, content_hash")
    .eq("community_id", communityId)
    .in("passage_key", [...keys, ...parentKeys]);
  const idByKey = new Map((existing ?? []).map((row) => [row.passage_key!, row.id]));
  const hashByKey = new Map((existing ?? []).map((row) => [row.passage_key!, row.content_hash]));

  const counts = { inserted: 0, updated: 0, unchanged: 0 };
  const changed = chunk.filter((passage) => {
    const hash = hashOf(passage);
    if (!hashByKey.has(passage.key)) counts.inserted++;
    else if (hashByKey.get(passage.key) !== hash) counts.updated++;
    else {
      counts.unchanged++;
      return false;
    }
    return true;
  });
  if (changed.length === 0) return counts;

  // Parents before children: each round writes the passages whose parent
  // already has an id. The hierarchy is shallow, so this is a few rounds.
  let pending = changed;
  while (pending.length > 0) {
    const ready = pending.filter((p) => !p.parentKey || idByKey.has(p.parentKey));
    if (ready.length === 0) throw new Error(`parents missing for ${pending.map((p) => p.key).join(", ")}`);
    const rows = ready.map((passage) => ({
      event_id: workRow.event_id!,
      community_id: communityId,
      created_by: userId,
      work_id: workRow.id,
      parent_id: passage.parentKey ? idByKey.get(passage.parentKey)! : null,
      passage_key: passage.key,
      division_kind: passage.divisionKind,
      ordinal: offset + chunk.indexOf(passage),
      // Archive passages sort after anything a person put on the event.
      sort_order: 1000 + offset + chunk.indexOf(passage),
      label: passage.label,
      reference: passage.reference,
      summary: passage.summary ?? null,
      source_id: passage.sourceKey ? sourceIds.get(passage.sourceKey) ?? null : null,
      object_name: passage.objectName ?? null,
      holding_institution: passage.holdingInstitution ?? null,
      accession_number: passage.accessionNumber ?? null,
      notes: passage.notes ?? null,
      verification_status: passage.verificationStatus,
      content_hash: hashOf(passage),
    }));
    const { data, error } = await supabase
      .from("timeline_text_passages")
      .upsert(rows, { onConflict: "community_id,passage_key" })
      .select("id, passage_key");
    if (error) throw new Error(`passages: ${error.message}`);
    for (const row of data ?? []) idByKey.set(row.passage_key!, row.id);
    pending = pending.filter((p) => !ready.includes(p));
  }

  const passageIds = changed.map((p) => idByKey.get(p.key)!);

  // --- Layers: upsert by import key, then remove imported layers the file dropped.
  const layerRows = changed.flatMap((passage) =>
    passage.layers.map((layer, index) => ({
      passage_id: idByKey.get(passage.key)!,
      community_id: communityId,
      created_by: userId,
      import_key: layer.key,
      source_id: layer.sourceKey ? sourceIds.get(layer.sourceKey) ?? null : null,
      layer: layer.layer,
      content: layer.content ?? null,
      content_absent_reason: layer.contentAbsentReason ?? null,
      language: layer.language ?? null,
      script: layer.script ?? null,
      viewpoint: layer.viewpoint ?? null,
      evidence: layer.evidence,
      notes: layer.notes ?? null,
      licence: layer.licence,
      sort_order: index,
    }))
  );
  if (layerRows.length > 0) {
    const { error } = await supabase.from("timeline_text_layers").upsert(layerRows, { onConflict: "passage_id,import_key" });
    if (error) throw new Error(`layers: ${error.message}`);
  }
  const { data: storedLayers } = await supabase
    .from("timeline_text_layers")
    .select("id, passage_id, import_key")
    .in("passage_id", passageIds)
    .not("import_key", "is", null);
  const wanted = new Set(layerRows.map((row) => `${row.passage_id}|${row.import_key}`));
  const stale = (storedLayers ?? []).filter((row) => !wanted.has(`${row.passage_id}|${row.import_key}`)).map((row) => row.id);
  if (stale.length > 0) await supabase.from("timeline_text_layers").delete().in("id", stale);

  // --- Witnesses, dates, images and themes ------------------------------------
  const witnessRows = changed.flatMap((passage) =>
    (passage.witnesses ?? []).flatMap((w, index) => {
      const manuscriptId = manuscriptIds.get(w.manuscriptKey);
      if (!manuscriptId) return [];
      return [{
        community_id: communityId,
        created_by: userId,
        passage_id: idByKey.get(passage.key)!,
        manuscript_id: manuscriptId,
        locus: w.locus ?? null,
        variant_note: w.variantNote ?? null,
        sort_order: index,
      }];
    })
  );
  if (witnessRows.length > 0) {
    const { error } = await supabase.from("timeline_passage_witnesses").upsert(witnessRows, { onConflict: "passage_id,manuscript_id" });
    if (error) throw new Error(`witnesses: ${error.message}`);
  }

  const dateRows = changed.flatMap((passage) =>
    (passage.dates ?? []).map((d) => ({
      community_id: communityId,
      created_by: userId,
      passage_id: idByKey.get(passage.key)!,
      import_key: d.key,
      date_role: d.role,
      start_year: d.startYear ?? null,
      end_year: d.endYear ?? null,
      date_precision: d.datePrecision,
      is_approximate: d.isApproximate,
      original_date_text: d.originalDateText,
      evidence: d.evidence,
      source_id: d.sourceKey ? sourceIds.get(d.sourceKey) ?? null : null,
    }))
  );
  if (dateRows.length > 0) {
    const { error } = await supabase.from("timeline_passage_dates").upsert(dateRows, { onConflict: "passage_id,import_key" });
    if (error) throw new Error(`dates: ${error.message}`);
  }

  const imageRows = await keepCopiedPictures(
    supabase,
    communityId,
    changed.flatMap((passage) =>
      (passage.images ?? []).map((image, index) => ({
        ...imageRow(communityId, userId, image, index),
        passage_id: idByKey.get(passage.key)!,
      }))
    )
  );
  if (imageRows.length > 0) {
    const { error } = await supabase.from("timeline_passage_images").upsert(imageRows, { onConflict: "community_id,import_key" });
    if (error) throw new Error(`images: ${error.message}`);
  }

  const themeKeys = [...new Set(changed.flatMap((p) => (p.themes ?? []).map((t) => t.themeKey)))];
  if (themeKeys.length > 0) {
    const { data: themes } = await supabase
      .from("timeline_themes")
      .select("id, theme_key")
      .eq("community_id", communityId)
      .in("theme_key", themeKeys);
    const themeId = new Map((themes ?? []).map((t) => [t.theme_key, t.id]));
    const themeRows = changed.flatMap((passage) =>
      (passage.themes ?? []).flatMap((t) => {
        const id = themeId.get(t.themeKey);
        if (!id) return [];
        return [{ community_id: communityId, created_by: userId, passage_id: idByKey.get(passage.key)!, theme_id: id, note: t.note }];
      })
    );
    if (themeRows.length > 0) {
      const { error } = await supabase.from("timeline_passage_themes").upsert(themeRows, { onConflict: "passage_id,theme_id" });
      if (error) throw new Error(`themes: ${error.message}`);
    }
  }

  return counts;
}

function imageRow(communityId: string, userId: string, image: NonNullable<TextCorpusFile["images"]>[number], index: number) {
  return {
    community_id: communityId,
    created_by: userId,
    import_key: image.key,
    url: image.url,
    source_page_url: image.sourcePageUrl,
    institution: image.institution ?? null,
    accession_number: image.accessionNumber ?? null,
    object_date: image.objectDate ?? null,
    image_date: image.imageDate ?? null,
    caption: image.caption,
    creator: image.creator ?? null,
    credit: image.credit ?? null,
    licence: image.licence ?? null,
    licence_status: image.licenceStatus,
    shows: image.shows,
    identification_status: image.identificationStatus,
    what_is_unverified: image.whatIsUnverified ?? null,
    verification_status: image.verificationStatus,
    duplicate_of: image.duplicateOf ?? null,
    sort_order: index,
  };
}

async function syncWorkImages(
  supabase: Client,
  communityId: string,
  userId: string,
  workId: string,
  file: TextCorpusFile,
  manuscriptIds: Map<string, string>
) {
  const rows = await keepCopiedPictures(
    supabase,
    communityId,
    (file.images ?? []).map((image, index) => ({
      ...imageRow(communityId, userId, image, index),
      work_id: workId,
      manuscript_id: image.manuscriptKey ? manuscriptIds.get(image.manuscriptKey) ?? null : null,
    }))
  );
  if (rows.length === 0) return;
  const { error } = await supabase.from("timeline_passage_images").upsert(rows, { onConflict: "community_id,import_key" });
  if (error) throw new Error(`work images: ${error.message}`);
}

async function syncLinks(supabase: Client, communityId: string, userId: string, file: TextCorpusFile, sourceIds: Map<string, string>) {
  const rows = (file.links ?? []).map((link) => ({
    community_id: communityId,
    created_by: userId,
    import_key: link.key,
    from_passage_key: link.from,
    to_passage_key: link.to,
    connection_class: link.connectionClass,
    similarities: link.similarities,
    differences: link.differences,
    wording_comparable: link.wordingComparable,
    meaning_comparable: link.meaningComparable,
    transmission_evidence: link.transmissionEvidence,
    earlier_note: link.earlierNote ?? null,
    common_source_note: link.commonSourceNote ?? null,
    contradiction_note: link.contradictionNote ?? null,
    scholarly_view: link.scholarlyView ?? null,
    alternative_view: link.alternativeView ?? null,
    source_id: link.sourceKey ? sourceIds.get(link.sourceKey) ?? null : null,
    review_status: link.reviewStatus,
  }));
  if (rows.length === 0) return;
  const { error } = await supabase.from("timeline_passage_links").upsert(rows, { onConflict: "community_id,import_key" });
  if (error) throw new Error(`connections: ${error.message}`);
}

/** Recount from the database — never from the file — and record the status. */
async function updateCompleteness(supabase: Client, communityId: string, workId: string, work: InventoryWork) {
  const units = () =>
    supabase
      .from("timeline_text_passages")
      .select("id", { count: "exact", head: true })
      .eq("community_id", communityId)
      .eq("work_id", workId)
      .eq("division_kind", work.unitDivisionKind);
  const { count: importedUnits } = await units();
  const { count: verifiedUnits } = await units().neq("verification_status", "unverified");
  const status = deriveCompleteness(work, { importedUnits: importedUnits ?? 0, verifiedUnits: verifiedUnits ?? 0 });
  await supabase.from("timeline_text_works").update({ completeness_status: status, updated_at: new Date().toISOString() }).eq("id", workId);
}
