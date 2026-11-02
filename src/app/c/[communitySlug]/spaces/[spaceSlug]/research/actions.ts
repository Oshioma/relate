"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getResearcherRole, getReviewQueue } from "@/lib/data/true-calendar";
import { runCalendarImport, setReviewStatus, type ImportOutcome } from "@/lib/true-calendar/research/import-apply";
import { IMPORT_SECTIONS, type CalendarTable } from "@/lib/true-calendar/research/model";
import { BUNDLED_RESEARCH } from "@/lib/true-calendar/research/bundled";

// The True Calendar's research desk. Every action re-checks the caller's role
// (researchers import drafts; reviewers also publish); RLS and the publish
// guard trigger refuse the same writes in the database regardless.

const MAX_IMPORT_BYTES = 4_000_000;
const TABLES = new Set<string>(IMPORT_SECTIONS.map((s) => s.table));
const STATUSES = ["draft", "in_review", "published", "rejected"] as const;
type Status = (typeof STATUSES)[number];

async function researcher(need: "researcher" | "reviewer") {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be signed in." } as const;
  const role = await getResearcherRole(supabase, user.id);
  if (!role || (need === "reviewer" && role !== "reviewer")) {
    return { error: need === "reviewer" ? "Only reviewers can publish research." : "Only calendar researchers can import research." } as const;
  }
  return { supabase, userId: user.id, role } as const;
}

function refresh(spacePath: string) {
  if (!/^\/c\/[a-z0-9-]+\/spaces\/[a-z0-9-]+$/i.test(spacePath)) return;
  revalidatePath(spacePath);
  revalidatePath(`${spacePath}/history`, "layout");
  revalidatePath(`${spacePath}/research`);
}

export type ImportResult = { error: string } | ImportOutcome;

export async function importCalendarResearch(spacePath: string, text: string, dryRun: boolean): Promise<ImportResult> {
  const ctx = await researcher("researcher");
  if ("error" in ctx) return { error: ctx.error ?? "Not allowed." };
  if (text.length > MAX_IMPORT_BYTES) return { error: "That file is too large for one import (4 MB). Split it into batches." };
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch (e) {
    return { error: `That isn't valid JSON: ${e instanceof Error ? e.message : "parse error"}` };
  }
  try {
    const outcome = await runCalendarImport(ctx.supabase, ctx.userId, raw, dryRun);
    if (outcome.written) refresh(spacePath);
    return outcome;
  } catch (e) {
    return { error: e instanceof Error ? e.message : "The import failed." };
  }
}

/** Imports one of the research files that ship with the app. */
export async function importBundledResearch(spacePath: string, id: string): Promise<ImportResult> {
  const ctx = await researcher("researcher");
  if ("error" in ctx) return { error: ctx.error ?? "Not allowed." };
  const bundled = BUNDLED_RESEARCH.find((b) => b.id === id);
  if (!bundled) return { error: "Unknown research file." };
  try {
    const outcome = await runCalendarImport(ctx.supabase, ctx.userId, await bundled.load(), false);
    if (outcome.written) refresh(spacePath);
    return outcome;
  } catch (e) {
    return { error: e instanceof Error ? e.message : "The import failed." };
  }
}

export async function reviewCalendarRecord(spacePath: string, table: string, key: string, status: string): Promise<{ error?: string }> {
  if (!TABLES.has(table) || !STATUSES.includes(status as Status)) return { error: "Unknown record." };
  const ctx = await researcher(status === "in_review" ? "researcher" : "reviewer");
  if ("error" in ctx) return { error: ctx.error };
  const result = await setReviewStatus(ctx.supabase, ctx.userId, table as CalendarTable, key, status as Status, null);
  if (!result.error) refresh(spacePath);
  return result;
}

type Ctx = Exclude<Awaited<ReturnType<typeof researcher>>, { error: string }>;

// Publishes the given review items that are ready: each record with a
// supporting source (and the sources those records cite, first, so a reader
// never meets a citation to an unpublished source). Records still missing a
// source stay drafts and are counted as skipped.
async function publishItems(ctx: Ctx, items: Awaited<ReturnType<typeof getReviewQueue>>["items"], mine: typeof items) {
  const keys = mine.map((i) => i.key);
  const cited = new Set<string>();
  for (let i = 0; i < keys.length; i += 200) {
    const { data } = await ctx.supabase.from("calendar_claim_sources").select("source_key").in("claim_key", keys.slice(i, i + 200));
    for (const c of data ?? []) cited.add(c.source_key);
  }
  for (let i = 0; i < keys.length; i += 200) {
    const { data: cycleAnchors } = await ctx.supabase.from("calendar_cycles").select("anchor_source_key").in("key", keys.slice(i, i + 200));
    for (const c of cycleAnchors ?? []) if (c.anchor_source_key) cited.add(c.anchor_source_key);
  }
  for (const source of items.filter((i) => i.table === "calendar_sources" && i.status !== "rejected" && cited.has(i.key))) {
    const r = await setReviewStatus(ctx.supabase, ctx.userId, "calendar_sources", source.key, "published", "Published with its culture");
    if (r.error) return { error: `${source.key}: ${r.error}` };
  }
  // Then the records, a table at a time in import order (parents first), in
  // bulk: a record is published only if it cites a supporting source, as
  // setReviewStatus requires one by one. Cultures go one by one, because a
  // catalogue-only culture needs no source.
  let published = 0;
  let skipped = 0;
  for (const { table } of IMPORT_SECTIONS) {
    if (table === "calendar_sources") continue;
    const list = mine.filter((i) => i.table === table);
    if (list.length === 0) continue;
    if (table === "calendar_cultures") {
      for (const item of list) {
        const r = await setReviewStatus(ctx.supabase, ctx.userId, table, item.key, "published", "Published with its culture");
        if (r.error) skipped += 1;
        else published += 1;
      }
      continue;
    }
    for (let i = 0; i < list.length; i += 200) {
      const chunk = list.slice(i, i + 200).map((x) => x.key);
      const { data: cites } = await ctx.supabase.from("calendar_claim_sources").select("claim_key").eq("claim_table", table).eq("relation", "supports").in("claim_key", chunk);
      const ready = [...new Set((cites ?? []).map((c) => c.claim_key))];
      skipped += chunk.length - ready.length;
      if (ready.length === 0) continue;
      const { error } = await ctx.supabase.from(table).update({ review_status: "published" } as never).in("key", ready);
      if (error) {
        skipped += ready.length;
        continue;
      }
      published += ready.length;
      await ctx.supabase.from("calendar_research_reviews").insert(ready.map((key) => ({ claim_table: table, claim_key: key, status: "published", notes: "Published with its culture", reviewer_id: ctx.userId })) as never);
    }
  }
  return { published, skipped };
}

/** Publishes everything for one culture that is ready. */
export async function publishReadyForCulture(spacePath: string, cultureKey: string): Promise<{ error?: string; published?: number; skipped?: number }> {
  const ctx = await researcher("reviewer");
  if ("error" in ctx) return { error: ctx.error };
  const { items } = await getReviewQueue(ctx.supabase);
  const mine = items.filter((i) => i.cultureKey === cultureKey && i.status !== "rejected");
  if (mine.length === 0) return { published: 0, skipped: 0 };
  const result = await publishItems(ctx, items, mine);
  refresh(spacePath);
  return result;
}

export type EverythingResult = { error: string } | { imported: string[]; published: number; skipped: number; drafts: number; problems: string[] };

/** The one-press path: import every bundled research file that has new
 * records, in order, then (for a reviewer) publish everything that is ready. */
export async function importAndPublishEverything(spacePath: string): Promise<EverythingResult> {
  const ctx = await researcher("researcher");
  if ("error" in ctx) return { error: ctx.error ?? "Not allowed." };
  const { getBundledResearchStatus } = await import("@/lib/data/true-calendar");
  const status = new Map((await getBundledResearchStatus(ctx.supabase)).map((s) => [s.id, s]));
  const imported: string[] = [];
  const problems: string[] = [];
  for (const b of BUNDLED_RESEARCH) {
    const s = status.get(b.id);
    if (!s || s.newRecords === 0) continue;
    try {
      const outcome = await runCalendarImport(ctx.supabase, ctx.userId, await b.load(), false);
      if (outcome.written) imported.push(b.title);
      else problems.push(`${b.title}: ${outcome.writeError ?? `${outcome.plan.errors.length} problem(s) in the file`}`);
    } catch (e) {
      problems.push(`${b.title}: ${e instanceof Error ? e.message : "the import failed"}`);
    }
  }
  let published = 0;
  let skipped = 0;
  const { items } = await getReviewQueue(ctx.supabase);
  if (ctx.role === "reviewer") {
    const mine = items.filter((i) => i.status !== "rejected" && i.table !== "calendar_sources");
    if (mine.length) {
      const r = await publishItems(ctx, items, mine);
      if ("error" in r) problems.push(r.error!);
      else ({ published, skipped } = r);
    }
  }
  const drafts = ctx.role === "reviewer" ? skipped : items.filter((i) => i.status !== "rejected" && i.status !== "published").length;
  refresh(spacePath);
  return { imported, published, skipped, drafts, problems };
}
