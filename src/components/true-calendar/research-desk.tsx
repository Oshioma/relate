"use client";

import { useState, useTransition, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useFormDraft } from "@/lib/use-form-draft";
import { importBundledResearch, importCalendarResearch, publishReadyForCulture, reviewCalendarRecord, type ImportResult } from "@/app/c/[communitySlug]/spaces/[spaceSlug]/research/actions";
import type { BundledResearchStatus, ReviewItem } from "@/lib/data/true-calendar";
import { cn } from "@/lib/utils";

// The research desk: paste or load a true-calendar/v1 JSON file, check it
// with a dry run, then import it as drafts; reviewers publish what has a
// supporting source. The pasted text is kept as a draft in this browser
// until it is imported or you sign out.

const button = "inline-flex h-10 items-center rounded-md px-4 text-base font-medium disabled:opacity-50";

export function ReadyToImport({ spacePath, files }: { spacePath: string; files: BundledResearchStatus[] }) {
  const [results, setResults] = useState<Record<string, ImportResult>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [, start] = useTransition();
  const router = useRouter();
  if (files.length === 0) return null;
  return (
    <section aria-labelledby="tc-ready-heading" className="rounded-lg border border-[var(--tc-line)] bg-[var(--tc-panel)] px-4 py-4">
      <h2 id="tc-ready-heading" className="font-serif text-2xl">Ready to import</h2>
      <p className="mt-1 text-base text-[var(--tc-muted)]">Research files that come with the calendar. Importing adds them as drafts; nothing shows on the calendar until it is published below.</p>
      <ul className="mt-3 space-y-3">
        {files.map((f) => {
          const result = results[f.id];
          const done = f.ok && f.toWrite === 0;
          return (
            <li key={f.id} className="flex flex-wrap items-center gap-3 rounded-md border border-[var(--tc-line)] px-3 py-2">
              <div className="min-w-0 flex-1">
                <p className="text-base font-medium">{f.title}</p>
                <p className="text-sm text-[var(--tc-muted)]">{f.description}</p>
                <p className={cn("text-sm", f.ok ? "text-[var(--tc-muted)]" : "text-red-700 dark:text-red-300")}>
                  {!f.ok
                    ? `${f.problems} problem${f.problems === 1 ? "" : "s"} in the file; it can't be imported as it is.`
                    : done
                      ? `Imported: all ${f.total} records are in.`
                      : `${f.toWrite} of ${f.total} records to add or update.`}
                </p>
                {result ? <ImportReport result={result} dryRun={false} /> : null}
              </div>
              {f.ok && !done ? (
                <button
                  type="button"
                  disabled={busy !== null}
                  onClick={() => {
                    setBusy(f.id);
                    start(async () => {
                      const r = await importBundledResearch(spacePath, f.id);
                      setResults((prev) => ({ ...prev, [f.id]: r }));
                      setBusy(null);
                      router.refresh();
                    });
                  }}
                  className={cn(button, "bg-[var(--tc-selected)] text-[var(--tc-selected-ink)]")}
                >
                  {busy === f.id ? "Importing…" : "Import"}
                </button>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function ImportPanel({ spacePath }: { spacePath: string }) {
  const { formRef, clearDraft } = useFormDraft("true-calendar-import");
  const [result, setResult] = useState<ImportResult | null>(null);
  const [lastWasDryRun, setLastWasDryRun] = useState(true);
  const [pending, start] = useTransition();
  const router = useRouter();

  const run = (dryRun: boolean) => {
    const text = (formRef.current?.elements.namedItem("json") as HTMLTextAreaElement | null)?.value ?? "";
    if (!text.trim()) {
      setResult({ error: "Paste a research file or choose one first." });
      return;
    }
    start(async () => {
      const r = await importCalendarResearch(spacePath, text, dryRun);
      setResult(r);
      setLastWasDryRun(dryRun);
      if (!("error" in r) && r.written) {
        clearDraft();
        formRef.current?.reset();
        router.refresh();
      }
    });
  };

  const load = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const area = formRef.current?.elements.namedItem("json") as HTMLTextAreaElement | null;
    if (area) {
      area.value = text;
      area.dispatchEvent(new Event("input", { bubbles: true })); // saves the draft
    }
    e.target.value = "";
  };

  return (
    <section aria-labelledby="tc-import-heading" className="rounded-lg border border-[var(--tc-line)] bg-[var(--tc-panel)] px-4 py-4">
      <h2 id="tc-import-heading" className="font-serif text-2xl">Import research</h2>
      <p className="mt-1 text-base text-[var(--tc-muted)]">
        A <code>true-calendar/v1</code> JSON file (see <code>docs/true-calendar/research/</code>). Records are matched by key, so importing a file again updates rather than duplicates. Everything arrives as a draft unless the file says otherwise and you are a reviewer.
      </p>
      <form ref={formRef} onSubmit={(e) => e.preventDefault()} className="mt-3 space-y-2">
        <label htmlFor="tc-json" className="sr-only">Research file</label>
        <textarea
          id="tc-json"
          name="json"
          rows={10}
          spellCheck={false}
          placeholder='{ "format": "true-calendar/v1", "sources": [...], "cultures": [...] }'
          className="w-full rounded-md border border-[var(--tc-line)] bg-[var(--tc-bg)] px-3 py-2 font-mono text-sm text-[var(--tc-ink)]"
        />
        <div className="flex flex-wrap items-center gap-2">
          <label className="inline-flex h-10 cursor-pointer items-center rounded-md border border-[var(--tc-line)] px-4 text-base hover:bg-[var(--tc-hover)]">
            Choose a file…
            <input type="file" accept="application/json,.json" onChange={load} className="sr-only" />
          </label>
          <button type="button" disabled={pending} onClick={() => run(true)} className={cn(button, "border border-[var(--tc-line)] hover:bg-[var(--tc-hover)]")}>
            {pending && lastWasDryRun ? "Checking…" : "Dry run"}
          </button>
          <button type="button" disabled={pending} onClick={() => run(false)} className={cn(button, "bg-[var(--tc-selected)] text-[var(--tc-selected-ink)]")}>
            {pending && !lastWasDryRun ? "Importing…" : "Import"}
          </button>
        </div>
      </form>
      {result ? <ImportReport result={result} dryRun={lastWasDryRun} /> : null}
    </section>
  );
}

function ImportReport({ result, dryRun }: { result: ImportResult; dryRun: boolean }) {
  if ("error" in result) return <p role="alert" className="mt-3 text-base text-red-700 dark:text-red-300">{result.error}</p>;
  const { plan, written, writeError } = result;
  const busy = plan.sections.filter((s) => s.insert.length + s.update.length + s.unchanged.length > 0);
  return (
    <div className="mt-3 space-y-2 text-base" aria-live="polite">
      <p className={cn("font-medium", plan.ok && !writeError ? "text-emerald-700 dark:text-emerald-300" : "text-red-700 dark:text-red-300")}>
        {writeError
          ? `Stopped while writing: ${writeError}`
          : !plan.ok
            ? `${plan.errors.length} problem${plan.errors.length === 1 ? "" : "s"} to fix; nothing was written.`
            : written
              ? "Imported."
              : dryRun
                ? "The file checks out. Nothing has been written yet."
                : "Nothing was written."}
      </p>
      {busy.length > 0 ? (
        <table className="text-sm">
          <thead>
            <tr className="text-left text-[var(--tc-muted)]">
              <th className="pr-4 font-normal">Section</th>
              <th className="pr-4 font-normal">New</th>
              <th className="pr-4 font-normal">Changed</th>
              <th className="font-normal">Unchanged</th>
            </tr>
          </thead>
          <tbody>
            {busy.map((s) => (
              <tr key={s.section}>
                <td className="pr-4">{s.section.replace(/_/g, " ")}</td>
                <td className="pr-4">{s.insert.length}</td>
                <td className="pr-4">{s.update.length}</td>
                <td>{s.unchanged.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
      {plan.citations ? <p className="text-sm text-[var(--tc-muted)]">{plan.citations} citations</p> : null}
      {[...plan.errors.map((e) => ({ ...e, kind: "error" })), ...plan.warnings.map((w) => ({ ...w, kind: "warning" }))].slice(0, 100).map((i, n) => (
        <p key={n} className={cn("text-sm", i.kind === "error" ? "text-red-700 dark:text-red-300" : "text-amber-700 dark:text-amber-300")}>
          <code>{i.path}</code>: {i.message}
        </p>
      ))}
    </div>
  );
}

const TABLE_LABELS: Record<string, string> = {
  calendar_sources: "Source",
  calendar_cultures: "Culture",
  calendar_systems: "Calendar",
  calendar_cycles: "Cycle",
  calendar_cycle_positions: "Day of a cycle",
  calendar_months: "Month",
  calendar_lunar_days: "Lunar day",
  calendar_observances: "Observance",
  calendar_meanings: "Meaning",
  calendar_recommendations: "Practice",
  calendar_date_correspondences: "Dated entry",
};

export function ReviewQueue({ spacePath, items, cultureNames, isReviewer }: { spacePath: string; items: ReviewItem[]; cultureNames: Array<[string, string]>; isReviewer: boolean }) {
  const names = new Map(cultureNames);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();
  const groups = new Map<string, ReviewItem[]>();
  for (const i of items) groups.set(i.cultureKey, [...(groups.get(i.cultureKey) ?? []), i]);

  const act = (fn: () => Promise<{ error?: string; published?: number; skipped?: number }>, done: string) =>
    start(async () => {
      const r = await fn();
      setMessage(r.error ? r.error : r.published !== undefined ? `Published ${r.published}${r.skipped ? `; ${r.skipped} still need a supporting source` : ""}.` : done);
      router.refresh();
    });

  return (
    <section aria-labelledby="tc-review-heading" className="rounded-lg border border-[var(--tc-line)] bg-[var(--tc-panel)] px-4 py-4">
      <h2 id="tc-review-heading" className="font-serif text-2xl">Waiting for review</h2>
      <p className="mt-1 text-base text-[var(--tc-muted)]">
        {items.length === 0
          ? "Nothing is waiting: every imported record is published or rejected."
          : `${items.length} record${items.length === 1 ? "" : "s"} not yet published. A record can be published once it cites a supporting source.`}
      </p>
      {message ? <p role="status" className="mt-2 text-base">{message}</p> : null}
      <div className="mt-3 space-y-4">
        {[...groups].map(([cultureKey, list]) => (
          <details key={cultureKey || "sources"} className="rounded-md border border-[var(--tc-line)] px-3 py-2">
            <summary className="flex cursor-pointer flex-wrap items-center gap-2 text-base">
              <span className="font-medium">{cultureKey ? names.get(cultureKey) ?? cultureKey : "Sources and other records"}</span>
              <span className="text-[var(--tc-muted)]">{list.length}</span>
              {isReviewer && cultureKey ? (
                <button
                  type="button"
                  disabled={pending}
                  onClick={(e) => {
                    e.preventDefault();
                    act(() => publishReadyForCulture(spacePath, cultureKey), "");
                  }}
                  className="ml-auto rounded-md bg-[var(--tc-selected)] px-3 py-1 text-sm text-[var(--tc-selected-ink)] disabled:opacity-50"
                >
                  Publish everything ready
                </button>
              ) : null}
            </summary>
            <ul className="mt-2 divide-y divide-[var(--tc-line)]">
              {list.map((i) => (
                <li key={`${i.table}|${i.key}`} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2 text-base">
                  <span className="w-28 shrink-0 text-sm text-[var(--tc-muted)]">{TABLE_LABELS[i.table] ?? i.table}</span>
                  <span className="min-w-0 flex-1">
                    {i.label}
                    <span className="block truncate font-mono text-xs text-[var(--tc-muted)]">{i.key}</span>
                  </span>
                  <span className={cn("text-sm", i.supporting || i.table === "calendar_sources" ? "text-[var(--tc-muted)]" : "text-amber-700 dark:text-amber-300")}>
                    {i.table === "calendar_sources" ? i.status.replace("_", " ") : `${i.supporting} source${i.supporting === 1 ? "" : "s"} · ${i.status.replace("_", " ")}`}
                  </span>
                  {isReviewer ? (
                    <span className="flex gap-1">
                      <button type="button" disabled={pending} onClick={() => act(() => reviewCalendarRecord(spacePath, i.table, i.key, "published"), "Published.")} className="rounded border border-[var(--tc-line)] px-2 py-0.5 text-sm hover:bg-[var(--tc-hover)]">
                        Publish
                      </button>
                      <button type="button" disabled={pending} onClick={() => act(() => reviewCalendarRecord(spacePath, i.table, i.key, "rejected"), "Rejected.")} className="rounded border border-[var(--tc-line)] px-2 py-0.5 text-sm hover:bg-[var(--tc-hover)]">
                        Reject
                      </button>
                    </span>
                  ) : i.status === "draft" ? (
                    <button type="button" disabled={pending} onClick={() => act(() => reviewCalendarRecord(spacePath, i.table, i.key, "in_review"), "Sent for review.")} className="rounded border border-[var(--tc-line)] px-2 py-0.5 text-sm hover:bg-[var(--tc-hover)]">
                      Ready for review
                    </button>
                  ) : null}
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>
    </section>
  );
}
