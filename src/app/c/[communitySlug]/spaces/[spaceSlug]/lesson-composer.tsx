"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { FileUp, Link2, Loader2, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  AGE_BANDS,
  DEFAULT_AGE_BAND,
  LONG_SOURCE_CHARS,
  MAX_SOURCE_CHARS,
  MIN_SOURCE_CHARS,
  isAgeBandKey,
  type AgeBandKey,
} from "@/lib/school/lesson-types";
import {
  TEXT_FILE_ACCEPT,
  fileTextToSource,
  isSubtitleFile,
  isTextFile,
} from "@/lib/school/transcript-text";

// Writes a lesson from pasted material.
//
// The request streams NDJSON (see src/lib/school/lesson-stream.ts) for two
// reasons: writing a lesson from a long paste takes well over a minute, so
// there has to be something to watch; and the lesson is saved and announced
// before pictures are looked for, so a slow image phase can never lose it.
//
// Each line of the response is one JSON event. Anything unparseable is skipped
// rather than failing the run — a truncated final line is not worth losing a
// finished lesson over.
type StreamEvent =
  | { type: "progress"; chars: number }
  | { type: "done"; row?: unknown; error?: string }
  | { type: "images" }
  | { type: "illustrated"; row?: unknown }
  | { type: "error"; error: string };

type Phase = "idle" | "writing" | "images";

// Generous for a transcript — an hour of auto-captions is around 200 KB of
// .vtt before the timings come off — and small enough that a video dropped by
// mistake is refused instead of freezing the tab.
const MAX_FILE_BYTES = 8_000_000;

export function LessonComposer({
  spaceId,
  defaultAgeBand,
  onClose,
}: {
  spaceId: string;
  // The reading age this school starts on, from its school_kind. Every lesson
  // can still be written for any band.
  defaultAgeBand: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const [sourceText, setSourceText] = useState("");
  const [ageBand, setAgeBand] = useState<AgeBandKey>(
    isAgeBandKey(defaultAgeBand) ? defaultAgeBand : DEFAULT_AGE_BAND
  );
  const [phase, setPhase] = useState<Phase>("idle");
  const [charsWritten, setCharsWritten] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Reading a page into the box. Separate from writing the lesson on purpose:
  // you see what came back, edit it, and only then ask for a lesson.
  const [url, setUrl] = useState("");
  const [reading, setReading] = useState(false);
  const [readNote, setReadNote] = useState<string | null>(null);
  // Remembered so the lesson can say where it came from. Cleared the moment
  // somebody edits the text by hand: once the words are no longer the ones
  // that page served, crediting it would be a claim we can't stand behind.
  const [source, setSource] = useState<{ url: string; title: string | null } | null>(null);

  // Dropping or picking a file. Read in the browser and never uploaded: the
  // material has to land in the box to be edited before a lesson is written,
  // so a round trip to the server would buy nothing.
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);

  async function addFile(file: File) {
    if (busy) return;
    setError(null);
    setReadNote(null);

    if (!isTextFile(file.name)) {
      setError(
        "That isn't a text file. Drop a .txt, .md, .srt or .vtt — a PDF or Word file has to be opened and its text copied out."
      );
      return;
    }
    // A caption file for a very long recording is still only text, but a
    // mis-dropped video would lock the tab up while the browser read it.
    if (file.size > MAX_FILE_BYTES) {
      setError(`That file is ${(file.size / 1_000_000).toFixed(0)} MB — too big to be a transcript.`);
      return;
    }

    let raw: string;
    try {
      raw = await file.text();
    } catch {
      setError("Couldn't read that file.");
      return;
    }

    const text = fileTextToSource(file.name, raw);
    if (!text) {
      setError(`"${file.name}" had no text in it.`);
      return;
    }

    // Appended for the same reason a link is: whatever is already in the box
    // was put there on purpose.
    setSourceText((current) => (current.trim() ? `${current.trim()}\n\n${text}` : text));
    // A file has no address, so there is nothing honest to link to. Clearing
    // this is the same rule as a hand edit — the lesson only ever credits a
    // page whose text it is actually holding.
    setSource(null);
    setReadNote(
      isSubtitleFile(file.name)
        ? `Added ${file.name} — timings stripped, ${text.length.toLocaleString()} characters of speech.`
        : `Added ${file.name} — ${text.length.toLocaleString()} characters.`
    );
  }

  async function readFromUrl() {
    if (!url.trim() || reading || busy) return;
    setReading(true);
    setError(null);
    setReadNote(null);
    try {
      const response = await fetch("/api/lessons/read-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spaceId, url }),
      });
      const body = (await response.json().catch(() => null)) as
        | { text?: string; title?: string | null; truncated?: boolean; error?: string }
        | null;

      if (!response.ok || !body?.text) {
        setError(body?.error ?? "Couldn't read that page.");
        return;
      }

      // Appended, not replaced — somebody may have pasted something already,
      // and losing it to a link they were only trying out would be rude.
      setSourceText((current) => (current.trim() ? `${current.trim()}\n\n${body.text}` : body.text!));
      // Only credit a page when its text is the whole of the material. Append
      // to something already pasted and the lesson is a mixture, which no
      // single reference describes honestly.
      setSource(sourceText.trim() ? null : { url: url.trim(), title: body.title ?? null });
      setUrl("");
      setReadNote(
        body.truncated
          ? `Read "${body.title ?? "that page"}" — it was long, so the end was trimmed.`
          : `Read "${body.title ?? "that page"}". Edit it below before writing the lesson.`
      );
    } catch {
      setError("Couldn't reach that page just now.");
    } finally {
      setReading(false);
    }
  }

  const trimmed = sourceText.trim();
  const tooShort = trimmed.length > 0 && trimmed.length < MIN_SOURCE_CHARS;
  const tooLong = trimmed.length > MAX_SOURCE_CHARS;
  const busy = phase !== "idle";
  const canSubmit = !busy && trimmed.length >= MIN_SOURCE_CHARS && !tooLong;

  function handleEvent(event: StreamEvent, onFailure: () => void) {
    switch (event.type) {
      case "progress":
        setCharsWritten(event.chars);
        break;
      case "done":
        // The lesson exists from here. If saving failed the server says so and
        // there is no row to navigate to.
        if (event.error) {
          setError(event.error);
          onFailure();
        }
        break;
      case "images":
        setPhase("images");
        break;
      case "illustrated":
        break;
      case "error":
        setError(event.error);
        onFailure();
        break;
    }
  }

  async function submit() {
    setPhase("writing");
    setError(null);
    setCharsWritten(0);

    const controller = new AbortController();
    abortRef.current = controller;

    // Errors arrive mid-stream, so the decision below can't read them from
    // state — it wouldn't have re-rendered yet.
    let failed = false;

    try {
      const response = await fetch("/api/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spaceId,
          sourceText: trimmed,
          ageBand,
          sourceUrl: source?.url ?? null,
          sourceTitle: source?.title ?? null,
        }),
        signal: controller.signal,
      });

      // Failures before the stream opens answer as plain JSON with a status.
      if (!response.ok || !response.body) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(body?.error ?? "Could not build the lesson.");
        setPhase("idle");
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        // The last piece may be a partial line; keep it for the next chunk.
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            handleEvent(JSON.parse(line) as StreamEvent, () => {
              failed = true;
            });
          } catch {
            // A malformed line is not worth failing a finished lesson over.
          }
        }
      }

      setPhase("idle");

      // Leave the composer open on failure, with the pasted material still in
      // it — closing would take the error message away with it.
      if (failed) return;

      setSourceText("");
      // The library is a server component; pull the new lesson into it.
      router.refresh();
      onClose();
    } catch (streamError) {
      if ((streamError as Error)?.name === "AbortError") {
        setPhase("idle");
        return;
      }
      setError("The connection dropped while writing. The lesson may still have saved — refresh to check.");
      setPhase("idle");
    } finally {
      abortRef.current = null;
    }
  }

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold tracking-tight text-foreground">Write a lesson</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Paste anything you want taught — a chapter, an article, your own notes. It gets rewritten as a lesson for
            the age you pick.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          disabled={busy}
          className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4">
        <span className="text-sm font-medium text-foreground">Who is this for?</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {AGE_BANDS.map((band) => (
            <button
              key={band.key}
              type="button"
              disabled={busy}
              onClick={() => setAgeBand(band.key)}
              className={cn(
                "rounded-md border-2 px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50",
                ageBand === band.key
                  ? "border-accent bg-accent-soft text-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-muted-foreground/40"
              )}
            >
              {band.label}
            </button>
          ))}
        </div>
      </div>

      {/* A link is a shortcut into the box below, not a second way to write a
          lesson. Works on anything whose words are in the page — an article, a
          recipe, a Wikipedia entry. A video page carries no transcript, and
          the server says so plainly rather than returning a summary of the
          description dressed up as one. */}
      <div className="mt-4">
        <span className="text-sm font-medium text-foreground">Read from a link</span>
        <div className="mt-2 flex flex-wrap gap-2">
          <div className="relative min-w-[14rem] flex-1">
            <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="url"
              inputMode="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void readFromUrl();
                }
              }}
              disabled={busy || reading}
              placeholder="Paste an article or recipe link…"
              className="w-full rounded-md border border-border bg-card py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
            />
          </div>
          <Button
            variant="secondary"
            onClick={readFromUrl}
            disabled={busy || reading || !url.trim()}
          >
            {reading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
            {reading ? "Reading…" : "Read it in"}
          </Button>
        </div>
        {readNote && <p className="mt-2 text-xs text-muted-foreground">{readNote}</p>}
      </div>

      {/* The box, and the two ways to fill it that aren't typing. A caption
          file is the one that matters: it is what a downloaded transcript
          actually is, and pasting one raw spends three quarters of the
          character budget on timestamps. */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <label htmlFor="lesson-source" className="text-sm font-medium text-foreground">
          Source material
        </label>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={busy}
        >
          <FileUp className="h-4 w-4" />
          Add a file
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept={TEXT_FILE_ACCEPT}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            // Cleared so picking the same file twice fires again — a browser
            // won't re-raise change for an unchanged value.
            e.target.value = "";
            if (file) void addFile(file);
          }}
        />
      </div>

      <textarea
        id="lesson-source"
        value={sourceText}
        onChange={(e) => {
          setSourceText(e.target.value);
          setSource(null);
        }}
        onDragOver={(e) => {
          if (busy) return;
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          setDragging(false);
          if (busy) return;
          const file = e.dataTransfer.files?.[0];
          // Only intercept an actual file. Dragging selected text into the box
          // is a normal thing to do and the browser handles it perfectly well.
          if (!file) return;
          e.preventDefault();
          void addFile(file);
        }}
        disabled={busy}
        rows={10}
        placeholder="Paste the source material here, drop a .txt or .srt file, or read one in from a link above…"
        className={cn(
          "mt-2 w-full resize-y rounded-md border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50",
          dragging ? "border-dashed border-accent ring-2 ring-accent/40" : "border-border"
        )}
      />

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span className={cn(tooLong && "font-medium text-danger")}>
          {trimmed.length.toLocaleString()} / {MAX_SOURCE_CHARS.toLocaleString()} characters
          {tooShort && ` — at least ${MIN_SOURCE_CHARS} needed`}
          {/* Without this the button just went dead with nothing said. Easy to
              hit now that a whole file can arrive in one drop. */}
          {tooLong &&
            ` — ${(trimmed.length - MAX_SOURCE_CHARS).toLocaleString()} too many. Cut it down, or make two lessons from it.`}
        </span>
        {trimmed.length > LONG_SOURCE_CHARS && !tooLong && (
          <span>That&apos;s a lot of text — this one will take a couple of minutes.</span>
        )}
      </div>

      {error && (
        <p className="mt-3 rounded-md bg-danger/10 px-3 py-2 text-sm text-danger" role="alert">
          {error}
        </p>
      )}

      <div className="mt-4 flex items-center gap-3">
        <Button onClick={submit} disabled={!canSubmit}>
          <Sparkles className="h-4 w-4" />
          {busy ? "Writing…" : "Write the lesson"}
        </Button>
        {phase === "writing" && charsWritten > 0 && (
          <span className="text-xs text-muted-foreground">{charsWritten.toLocaleString()} characters written…</span>
        )}
        {phase === "images" && <span className="text-xs text-muted-foreground">Looking for pictures…</span>}
      </div>
    </Card>
  );
}
