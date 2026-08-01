"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Sparkles, Loader2, ArrowRight } from "lucide-react";
import { importListingFromLink } from "./listing-import-actions";
import type { ListingDraft, ListingImportKind, ListingDraftSource } from "@/lib/listing-draft";

const COPY: Record<ListingImportKind, { placeholder: string; hint: string }> = {
  business: {
    placeholder: "https://maps.app.goo.gl/… or the place's own website",
    hint: "Paste a Google Maps, TripAdvisor or the place's own website link — we'll fill in the form below.",
  },
  accommodation: {
    placeholder: "https://maps.app.goo.gl/… or the property's own website",
    hint: "Paste a Google Maps, TripAdvisor or the property's own website link — we'll fill in the form below.",
  },
};

// The autofill box that sits above a new-listing form. It never submits
// anything: it hands the parent form a draft, which the parent applies as field
// defaults for the member to check and edit. Nothing reaches the database until
// they press the form's own submit button.
export function ImportFromLink({
  kind,
  spaceId,
  initialUrl,
  onApply,
}: {
  kind: ListingImportKind;
  spaceId: string;
  // A link handed over from the other form (see the `handoff` on an import
  // result). Autofill runs once on arrival so the member doesn't paste twice.
  initialUrl?: string;
  onApply: (draft: ListingDraft) => void;
}) {
  const [url, setUrl] = useState(initialUrl ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<{ text: string; source: ListingDraftSource; warning?: string; handoff?: { href: string; label: string } } | null>(null);

  async function handleImport() {
    const value = url.trim();
    if (!value) {
      setError("Paste a link first.");
      return;
    }
    setBusy(true);
    setError(null);
    setNote(null);
    try {
      const result = await importListingFromLink({ url: value, kind, spaceId });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      onApply(result.draft);
      setNote({ text: result.note, source: result.source, warning: result.warning, handoff: result.handoff });
    } catch {
      setError("Something went wrong reading that link. Try again in a moment.");
    } finally {
      setBusy(false);
    }
  }

  const autoRan = useRef(false);
  useEffect(() => {
    if (autoRan.current || !initialUrl) return;
    autoRan.current = true;
    void handleImport();
    // handleImport reads `url`, which is seeded from initialUrl above; this is a
    // one-shot on arrival, never a re-run as the member edits the field.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialUrl]);

  return (
    <div className="rounded-lg border border-dashed border-border bg-muted/40 p-3">
      <div className="flex items-center gap-1.5">
        <Sparkles className="h-3.5 w-3.5 text-accent" />
        <span className="text-sm font-medium text-foreground">Add from a link</span>
      </div>

      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <input
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          // Enter inside a form submits it — here it should autofill instead.
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              if (!busy) void handleImport();
            }
          }}
          placeholder={COPY[kind].placeholder}
          disabled={busy}
          className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
        />
        <button
          type="button"
          onClick={handleImport}
          disabled={busy}
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
          {busy ? "Reading…" : "Autofill"}
        </button>
      </div>

      {error ? (
        <p className="mt-1.5 text-xs text-danger">{error}</p>
      ) : note ? (
        <>
          <p className={`mt-1.5 text-xs ${note.source === "link" ? "text-danger" : "text-muted-foreground"}`}>{note.text}</p>
          {note.warning && <p className="mt-1 text-xs font-medium text-danger">{note.warning}</p>}
          {note.handoff && (
            <Link
              href={note.handoff.href}
              className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
            >
              {note.handoff.label} <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </>
      ) : (
        <p className="mt-1.5 text-xs text-muted-foreground">{COPY[kind].hint}</p>
      )}
    </div>
  );
}
