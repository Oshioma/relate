"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getResearcherRole, getReviewQueue } from "@/lib/data/true-calendar";
import { runCalendarImport, setReviewStatus, type ImportOutcome } from "@/lib/true-calendar/research/import-apply";
import { IMPORT_SECTIONS, type CalendarTable } from "@/lib/true-calendar/research/model";

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

export async function reviewCalendarRecord(spacePath: string, table: string, key: string, status: string): Promise<{ error?: string }> {
  if (!TABLES.has(table) || !STATUSES.includes(status as Status)) return { error: "Unknown record." };
  const ctx = await researcher(status === "in_review" ? "researcher" : "reviewer");
  if ("error" in ctx) return { error: ctx.error };
  const result = await setReviewStatus(ctx.supabase, ctx.userId, table as CalendarTable, key, status as Status, null);
  if (!result.error) refresh(spacePath);
  return result;
}

/** Publishes everything for one culture that is ready: each record with a
 * supporting source (and the sources those records cite). Records still
 * missing a source are left as drafts and counted. */
export async function publishReadyForCulture(spacePath: string, cultureKey: string): Promise<{ error?: string; published?: number; skipped?: number }> {
  const ctx = await researcher("reviewer");
  if ("error" in ctx) return { error: ctx.error };
  const { items } = await getReviewQueue(ctx.supabase);
  const mine = items.filter((i) => i.cultureKey === cultureKey && i.status !== "rejected");
  if (mine.length === 0) return { published: 0, skipped: 0 };

  // Sources first, so a reader never meets a citation to an unpublished source.
  const keys = mine.map((i) => i.key);
  const cited = new Set<string>();
  for (let i = 0; i < keys.length; i += 200) {
    const { data } = await ctx.supabase.from("calendar_claim_sources").select("source_key").in("claim_key", keys.slice(i, i + 200));
    for (const c of data ?? []) cited.add(c.source_key);
  }
  const { data: cycleAnchors } = await ctx.supabase.from("calendar_cycles").select("anchor_source_key").in("key", keys);
  for (const c of cycleAnchors ?? []) if (c.anchor_source_key) cited.add(c.anchor_source_key);
  for (const source of items.filter((i) => i.table === "calendar_sources" && cited.has(i.key))) {
    const r = await setReviewStatus(ctx.supabase, ctx.userId, "calendar_sources", source.key, "published", "Published with its culture");
    if (r.error) return { error: `${source.key}: ${r.error}` };
  }

  let published = 0;
  let skipped = 0;
  const order = new Map<string, number>(IMPORT_SECTIONS.map((s, i) => [s.table, i]));
  for (const item of [...mine].sort((a, b) => order.get(a.table)! - order.get(b.table)!)) {
    const r = await setReviewStatus(ctx.supabase, ctx.userId, item.table, item.key, "published", "Published with its culture");
    if (r.error) skipped += 1;
    else published += 1;
  }
  refresh(spacePath);
  return { published, skipped };
}
