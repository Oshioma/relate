import type { ReactNode } from "react";
import { EVIDENCE_LABELS, RESEARCH_STATUS_LABELS, SOURCE_TYPE_LABELS, type EvidenceTag } from "@/lib/true-calendar/research/model";
import type { CalendarClaimSource } from "@/lib/true-calendar/research/model";
import { cn } from "@/lib/utils";

export function StatusPill({ status }: { status: string }) {
  const label = RESEARCH_STATUS_LABELS[status as keyof typeof RESEARCH_STATUS_LABELS] ?? status;
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-xs font-medium",
        status === "complete" ? "bg-[var(--tc-gold)] text-[var(--tc-bg)]" : status === "not_started" ? "border border-dashed border-[var(--tc-line)] text-[var(--tc-muted)]" : "border border-[var(--tc-gold)] text-[var(--tc-gold)]"
      )}
    >
      {label}
    </span>
  );
}

export function EvidenceChips({ tags, className }: { tags: readonly string[]; className?: string }) {
  const unique = [...new Set(tags)].filter((t): t is EvidenceTag => t in EVIDENCE_LABELS);
  if (unique.length === 0) return null;
  return (
    <span className={cn("flex flex-wrap gap-1.5", className)}>
      {unique.map((t) => (
        <span
          key={t}
          className={cn(
            "rounded-full border px-2 py-0.5 text-xs font-medium",
            t === "unverified_lead" || t === "contested"
              ? "border-amber-600/50 text-amber-700 dark:text-amber-300"
              : t === "modern_interpretation"
                ? "border-sky-600/40 text-sky-700 dark:text-sky-300"
                : "border-[var(--tc-line)] text-[var(--tc-muted)]"
          )}
        >
          {EVIDENCE_LABELS[t]}
        </span>
      ))}
    </span>
  );
}


// --- Claims and their sources -------------------------------------------------

type SourceRow = { key: string; title: string; author?: string | null; publisher?: string | null; published?: string | null; pages?: string | null; url?: string | null; accessed_on?: string | null; source_type: string; notes?: string | null };

/** Numbers the sources in the order the page first cites them. */
export function numberSources(citations: CalendarClaimSource[], sources: SourceRow[], extra: Array<string | null | undefined> = []): Map<string, number> {
  const known = new Set(sources.map((s) => s.key));
  const numbers = new Map<string, number>();
  for (const k of [...citations.map((c) => c.source_key), ...extra]) {
    if (k && known.has(k) && !numbers.has(k)) numbers.set(k, numbers.size + 1);
  }
  return numbers;
}

type ClaimRecord = { evidence?: readonly string[] | null; confidence?: string | null; uncertainty?: string | null };

/** One published claim: its text, how we know it, how sure we are, and where it comes from. */
export function Claim({
  table,
  claimKey,
  record,
  cite,
  className,
  children,
}: {
  table: string;
  claimKey: string;
  record: ClaimRecord;
  cite: { citations: CalendarClaimSource[]; numbers: Map<string, number> };
  className?: string;
  children: ReactNode;
}) {
  const mine = cite.citations.filter((c) => c.claim_table === table && c.claim_key === claimKey && cite.numbers.has(c.source_key));
  return (
    <div className={cn("space-y-1.5 text-base leading-relaxed", className)}>
      {children}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--tc-muted)]">
        <EvidenceChips tags={record.evidence ?? []} />
        {record.confidence ? <span>Confidence: {record.confidence}</span> : null}
        {mine.length > 0 ? (
          <span>
            {mine.map((c, i) => (
              <span key={c.id}>
                {i > 0 ? ", " : ""}
                <a href={`#src-${cite.numbers.get(c.source_key)}`} className="underline-offset-2 hover:underline" title={c.quote ?? undefined}>
                  [{cite.numbers.get(c.source_key)}{c.locator ? `, ${c.locator}` : ""}]
                </a>
                {c.relation === "disputes" ? " disputes this" : c.relation === "context" ? " background" : ""}
              </span>
            ))}
          </span>
        ) : null}
      </div>
      {record.uncertainty ? <p className="text-sm text-amber-700 dark:text-amber-300">Uncertain: {record.uncertainty}</p> : null}
    </div>
  );
}

export function SourceList({ sources, numbers }: { sources: SourceRow[]; numbers: Map<string, number> }) {
  const listed = sources.filter((s) => numbers.has(s.key)).sort((a, b) => numbers.get(a.key)! - numbers.get(b.key)!);
  if (listed.length === 0) return <p className="mt-1 text-base text-[var(--tc-muted)]">No sources cited yet.</p>;
  return (
    <ol className="mt-2 space-y-2 text-base">
      {listed.map((s) => (
        <li key={s.key} id={`src-${numbers.get(s.key)}`} className="scroll-mt-24">
          <span className="text-[var(--tc-muted)]">[{numbers.get(s.key)}] </span>
          {s.author ? `${s.author}, ` : ""}
          {s.url ? (
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{s.title}</a>
          ) : (
            <cite>{s.title}</cite>
          )}
          {[s.publisher, s.published, s.pages].filter(Boolean).length ? `, ${[s.publisher, s.published, s.pages].filter(Boolean).join(", ")}` : ""}
          <span className="text-sm text-[var(--tc-muted)]">
            {" "}· {SOURCE_TYPE_LABELS[s.source_type as keyof typeof SOURCE_TYPE_LABELS] ?? s.source_type}
            {s.accessed_on ? ` · accessed ${s.accessed_on}` : ""}
          </span>
          {s.notes ? <p className="text-sm text-[var(--tc-muted)]">{s.notes}</p> : null}
        </li>
      ))}
    </ol>
  );
}
