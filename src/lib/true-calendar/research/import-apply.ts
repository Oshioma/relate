import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { getExistingForImport } from "@/lib/data/true-calendar";
import { IMPORT_FORMAT, IMPORT_SECTIONS } from "./model";
import { type ImportPlan, keysMentioned, parseImport, planImport, rowOf } from "./import-plan";

type Client = SupabaseClient<Database>;

// Runs an import file through the plan, and — unless it is a dry run or the
// plan has errors — writes it: rows upserted by key, parents first, then the
// citations. Writes go through the signed-in researcher's own client, so RLS
// and the publish guard apply exactly as they would to any other write.

export interface ImportOutcome {
  plan: Omit<ImportPlan, "file">;
  written: boolean;
  writeError?: string;
}

export async function runCalendarImport(supabase: Client, userId: string, raw: unknown, dryRun: boolean): Promise<ImportOutcome> {
  const { file, errors } = parseImport(raw);
  if (!file) {
    return { plan: { ok: false, errors, warnings: [], sections: [], citations: 0 }, written: false };
  }
  const existing = await getExistingForImport(supabase, keysMentioned(file));
  const { file: _file, ...plan } = planImport(file, existing);
  void _file;

  const summary = {
    ok: plan.ok,
    errors: plan.errors.length,
    sections: Object.fromEntries(plan.sections.map((s) => [s.section, { insert: s.insert.length, update: s.update.length, unchanged: s.unchanged.length }])),
    citations: plan.citations,
  };

  if (dryRun || !plan.ok) {
    await supabase.from("calendar_import_runs").insert({ format_version: IMPORT_FORMAT, dry_run: true, summary, created_by: userId });
    return { plan, written: false };
  }

  for (const { section, table } of IMPORT_SECTIONS) {
    const records = file[section] as Array<Record<string, unknown>>;
    if (records.length === 0) continue;
    const rows = records.map((r) => {
      const row = rowOf(r);
      return existing.rows[table]?.has(String(row.key)) ? row : { ...row, created_by: userId };
    });
    for (let i = 0; i < rows.length; i += 200) {
      // The table name is one of a fixed list; the row shape was validated by zod.
      const { error } = await supabase.from(table).upsert(rows.slice(i, i + 200) as never, { onConflict: "key" });
      if (error) return { plan, written: false, writeError: `${section}: ${error.message}` };
    }

    const citations = records.flatMap((r) =>
      ((r.sources as Array<{ source: string; locator: string; quote?: string | null; relation: string }> | undefined) ?? []).map((c) => ({
        claim_table: table,
        claim_key: String(r.key),
        source_key: c.source,
        locator: c.locator ?? "",
        quote: c.quote ?? null,
        relation: c.relation as "supports" | "disputes" | "context",
        created_by: userId,
      }))
    );
    for (let i = 0; i < citations.length; i += 200) {
      const { error } = await supabase
        .from("calendar_claim_sources")
        .upsert(citations.slice(i, i + 200), { onConflict: "claim_table,claim_key,source_key,locator" });
      if (error) return { plan, written: false, writeError: `${section} citations: ${error.message}` };
    }
  }

  await supabase.from("calendar_import_runs").insert({ format_version: IMPORT_FORMAT, dry_run: false, summary, created_by: userId });
  return { plan, written: true };
}

/** A reviewer publishes (or unpublishes) one record. Publishing needs a
 * supporting source, except for a culture that is only a catalogue entry. */
export async function setReviewStatus(
  supabase: Client,
  userId: string,
  table: (typeof IMPORT_SECTIONS)[number]["table"],
  key: string,
  status: "draft" | "in_review" | "published" | "rejected",
  notes: string | null
): Promise<{ error?: string }> {
  if (status === "published" && table !== "calendar_sources") {
    const { data: row } = await supabase.from(table).select("*").eq("key", key).maybeSingle();
    if (!row) return { error: "Record not found" };
    const r = row as Record<string, unknown>;
    const catalogueOnly = table === "calendar_cultures" && !r.overview && !r.people && !r.places;
    if (!catalogueOnly) {
      const { count } = await supabase.from("calendar_claim_sources").select("id", { count: "exact", head: true }).eq("claim_table", table).eq("claim_key", key).eq("relation", "supports");
      if (!count) return { error: "Add a supporting source before publishing" };
    }
  }
  const { error } = await supabase.from(table).update({ review_status: status } as never).eq("key", key);
  if (error) return { error: error.message };
  await supabase.from("calendar_research_reviews").insert({ claim_table: table, claim_key: key, status, notes, reviewer_id: userId } as never);
  return {};
}
