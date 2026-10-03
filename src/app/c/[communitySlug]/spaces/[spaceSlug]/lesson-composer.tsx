"use client";

import { useRouter } from "next/navigation";
import { SaveUnsavedLesson } from "./save-unsaved-lesson";
import { useCallback, useEffect, useRef, useState } from "react";
import { FileUp, Film, Link2, Loader2, Music, Sparkles, Trash2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Linkify } from "@/components/ui/linkify";
import { cn } from "@/lib/utils";
import {
  AGE_BANDS,
  canGoBeyondSource,
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
import { VIDEO_PLATFORM_NAMES, formatDuration, parseVideoLink } from "@/lib/school/video-links";
import type { PublicVideoJob } from "@/lib/school/video-worker";
import {
  MAX_DIRECT_MEDIA_BYTES,
  MAX_KEPT_MEDIA_BYTES,
  MEDIA_FILE_ACCEPT,
  canKeepMedia,
  formatBytes,
  isMediaContentType,
  keptContentType,
  lessonMediaPath,
  mediaTypeOfPath,
} from "@/lib/school/lesson-media";
import { createClient } from "@/lib/supabase/client";
import { UploadAborted, uploadErrorMessage, uploadWithProgress } from "@/lib/upload-with-progress";
import type { LessonMediaType } from "@/types/database";

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
  | { type: "done"; row?: unknown; error?: string; unsavedId?: string }
  | { type: "images" }
  | { type: "illustrated"; row?: unknown }
  | { type: "error"; error: string };

type Phase = "idle" | "writing" | "images";

// Generous for a transcript — an hour of auto-captions is around 200 KB of
// .vtt before the timings come off — and small enough that a video dropped by
// mistake is refused instead of freezing the tab.
const MAX_FILE_BYTES = 8_000_000;

// How often an unfinished video job is checked on. Each check is one request
// to our API and one to the worker; an hour of video takes minutes, so there
// is nothing to gain from asking more often.
const VIDEO_POLL_MS = 4000;

function isJobFinished(job: PublicVideoJob): boolean {
  return job.status === "done" || job.status === "error";
}

function jobLabel(job: PublicVideoJob): string {
  if (job.title) return job.title;
  if (job.fileName) return job.fileName;
  const link = job.sourceUrl ? parseVideoLink(job.sourceUrl) : null;
  return link ? `${VIDEO_PLATFORM_NAMES[link.platform]} video` : (job.sourceUrl ?? "Uploaded file");
}

// What goes at the top of the lesson: an embedded video link, or a teacher's
// own upload played from Storage.
type TopMedia =
  | { kind: "link"; url: string; title: string | null }
  | { kind: "upload"; path: string; title: string | null; mediaType: LessonMediaType };

// A file on its way up. `kept` says which way it is going: into Storage, to
// stay with the lesson, or straight to the worker, to be thrown away after.
type UploadProgress = { fileName: string; loaded: number; total: number; kept: boolean };

// Puts a file in the uploader's own lesson-media folder in the 'uploads'
// bucket. Straight to the Storage REST endpoint rather than supabase-js,
// because only XMLHttpRequest reports upload progress. Same request
// supabase-js would make; the bucket's RLS checks the folder is the caller's.
async function uploadToStorage(
  file: File,
  onProgress: (loaded: number, total: number) => void,
  signal: AbortSignal
): Promise<{ ok: true; path: string } | { ok: false; error: string }> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return { ok: false, error: "You need to be signed in." };

  const contentType = keptContentType(file.type);
  const path = contentType ? lessonMediaPath(session.user.id, crypto.randomUUID(), contentType) : null;
  if (!contentType || !path) return { ok: false, error: "That kind of file can't be kept." };

  const base = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/+$/, "");
  const result = await uploadWithProgress({
    method: "POST",
    url: `${base}/storage/v1/object/uploads/${path}`,
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
      "Content-Type": contentType,
      "x-upsert": "false",
    },
    body: file,
    onProgress,
    signal,
  });
  if (result.status >= 200 && result.status < 300) return { ok: true, path };
  return { ok: false, error: uploadErrorMessage(result.body) ?? `The upload failed (${result.status}).` };
}

export function LessonComposer({
  spaceId,
  defaultAgeBand,
  videoConfigured,
  lessonHref,
  onClose,
}: {
  spaceId: string;
  // The reading age this school starts on, from its school_kind. Every lesson
  // can still be written for any band.
  defaultAgeBand: string;
  // Whether the video worker is set up. Without it a video link is answered
  // the old way: "paste the transcript instead".
  videoConfigured: boolean;
  // Where a lesson lives, so the cleared form can link to the one just written.
  lessonHref?: (lessonId: string) => string;
  onClose: () => void;
}) {
  const router = useRouter();
  const [sourceText, setSourceText] = useState("");
  // Read by the video poller, which runs outside React's render cycle and
  // would otherwise see the box as it was when polling started.
  const sourceTextRef = useRef("");
  useEffect(() => {
    sourceTextRef.current = sourceText;
  }, [sourceText]);
  const [ageBand, setAgeBand] = useState<AgeBandKey>(
    isAgeBandKey(defaultAgeBand) ? defaultAgeBand : DEFAULT_AGE_BAND
  );
  const [phase, setPhase] = useState<Phase>("idle");
  const [charsWritten, setCharsWritten] = useState(0);
  const [error, setError] = useState<string | null>(null);
  // Set when the lesson was written but couldn't be saved: the server kept it.
  const [unsavedId, setUnsavedId] = useState<string | null>(null);
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
  // Set when the link pasted has already been made into a lesson in this
  // space. Shown with the error, linking to that lesson and offering to make
  // another anyway (a different age band, say).
  const [existingLesson, setExistingLesson] = useState<{ id: string; title: string } | null>(null);

  // The video a transcript came from, to show at the top of the lesson. Kept
  // through hand edits, unlike `source`: trimming a transcript is the whole
  // point of the review step, and the lesson is still about that video.
  const [video, setVideo] = useState<TopMedia | null>(null);
  const [embedVideo, setEmbedVideo] = useState(true);

  // Video jobs: the ones started here, plus any recent ones from an earlier
  // visit, so closing the composer mid-transcription loses nothing.
  const [jobs, setJobs] = useState<PublicVideoJob[]>([]);
  const [starting, setStarting] = useState(false);
  // The job whose transcript should drop into the box by itself when it
  // finishes — the one started in this sitting. Older ones wait for a click.
  const autoUseRef = useRef<string | null>(null);
  // Transcripts that went into the box this time. Once a lesson is written
  // from them they are done with, and leave the list.
  const usedJobIdsRef = useRef<Set<string>>(new Set());
  // The lesson just written, so the cleared form can say where it went.
  const [savedLesson, setSavedLesson] = useState<{ id: string; title: string } | null>(null);

  // Uploading a recording. One at a time; the bar is the file's journey up,
  // after which it becomes an ordinary job in the list.
  const mediaInputRef = useRef<HTMLInputElement | null>(null);
  const [upload, setUpload] = useState<UploadProgress | null>(null);
  const uploadAbortRef = useRef<AbortController | null>(null);
  // Cancel an upload still running when the composer closes, rather than
  // letting it finish into a job nobody is watching for.
  useEffect(() => () => uploadAbortRef.current?.abort(), []);

  // Dropping or picking a file. Read in the browser and never uploaded: the
  // material has to land in the box to be edited before a lesson is written,
  // so a round trip to the server would buy nothing.
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);

  const trimmed = sourceText.trim();
  const tooShort = trimmed.length > 0 && trimmed.length < MIN_SOURCE_CHARS;
  const tooLong = trimmed.length > MAX_SOURCE_CHARS;
  const busy = phase !== "idle";
  const canSubmit = !busy && trimmed.length >= MIN_SOURCE_CHARS && !tooLong;

  const urlIsVideo = videoConfigured && parseVideoLink(url) !== null;

  function mergeJob(job: PublicVideoJob) {
    setJobs((current) => {
      const exists = current.some((j) => j.id === job.id);
      return exists ? current.map((j) => (j.id === job.id ? job : j)) : [job, ...current];
    });
  }

  // Puts a finished transcript in the box. Appended, like everything else,
  // because whatever is already there was put there on purpose.
  const insertTranscript = useCallback((job: PublicVideoJob) => {
    const text = job.transcript?.trim();
    if (!text) return;
    const before = sourceTextRef.current.trim();
    setSourceText(before ? `${before}\n\n${text}` : text);
    // Credited only when it is the whole of the material — same rule as a
    // page. An upload has no address to credit, same as a dropped file.
    setSource(before || !job.sourceUrl ? null : { url: job.sourceUrl, title: job.title });
    setVideo(topMediaOf(job));
    setEmbedVideo(true);
    setError(null);
    setExistingLesson(null);
    usedJobIdsRef.current.add(job.id);

    const length = formatDuration(job.durationSeconds);
    const how = job.method === "captions" ? "from its captions" : "by listening to it";
    setReadNote(
      `Transcribed "${jobLabel(job)}"${length ? ` (${length})` : ""} ${how} — ` +
        `${text.length.toLocaleString()} characters. Read it through and trim anything off-topic before writing.` +
        // The worker's [m:ss] markers are what give each section its "watch
        // from" button, and they look like clutter worth deleting. Only a
        // linked video can be jumped to, so an upload doesn't get the hint.
        (job.kind === "file" || job.kind === "direct"
          ? ""
          : " Leave the [m:ss] times in — they link each section back to its moment in the video.") +
        (job.message ? ` ${job.message}` : "") +
        (job.kind === "direct" ? " The file itself wasn't kept, so the lesson can't play it." : "")
    );
  }, []);

  // Recent jobs, once, when the composer opens.
  useEffect(() => {
    if (!videoConfigured) return;
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch(`/api/lessons/video-jobs?spaceId=${encodeURIComponent(spaceId)}`, {
          cache: "no-store",
        });
        const body = (await response.json().catch(() => null)) as { jobs?: PublicVideoJob[] } | null;
        if (!cancelled && body?.jobs) setJobs(body.jobs);
      } catch {
        // No list is fine — it's a convenience, not the feature.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [spaceId, videoConfigured]);

  // Polls whichever jobs are still running. Keyed on their ids, so it restarts
  // only when that set changes, and a slow answer never overlaps the next ask.
  const pendingIds = jobs
    .filter((job) => !isJobFinished(job))
    .map((job) => job.id)
    .join(",");

  useEffect(() => {
    if (!pendingIds) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    async function tick() {
      for (const id of pendingIds.split(",")) {
        try {
          const response = await fetch(`/api/lessons/video-jobs/${id}`, { cache: "no-store" });
          const body = (await response.json().catch(() => null)) as { job?: PublicVideoJob } | null;
          if (cancelled) return;
          if (!body?.job) continue;
          mergeJob(body.job);
          if (autoUseRef.current === id && isJobFinished(body.job)) {
            autoUseRef.current = null;
            if (body.job.status === "done") insertTranscript(body.job);
          }
        } catch {
          // Try again next tick.
        }
      }
      if (!cancelled) timer = setTimeout(tick, VIDEO_POLL_MS);
    }

    timer = setTimeout(tick, VIDEO_POLL_MS);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [pendingIds, insertTranscript]);

  async function startVideo(allowDuplicate = false) {
    if (!url.trim() || starting || busy) return;
    setStarting(true);
    setError(null);
    setExistingLesson(null);
    setReadNote(null);
    try {
      const response = await fetch("/api/lessons/video-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spaceId, url, allowDuplicate }),
      });
      const body = (await response.json().catch(() => null)) as
        | { job?: PublicVideoJob; error?: string; existingLesson?: { id: string; title: string } }
        | null;
      if (response.status === 409 && body?.existingLesson) {
        setError(body.error ?? "You've already made a lesson from this link.");
        setExistingLesson(body.existingLesson);
        return;
      }
      if (!response.ok || !body?.job) {
        setError(body?.error ?? "Couldn't start transcribing that video.");
        return;
      }
      mergeJob(body.job);
      if (body.job.status === "error") {
        setError(body.job.error ?? "Couldn't start transcribing that video.");
        return;
      }
      autoUseRef.current = body.job.id;
      setUrl("");
    } catch {
      setError("Couldn't reach the server just now.");
    } finally {
      setStarting(false);
    }
  }

  async function loadFinishedJob(job: PublicVideoJob) {
    setError(null);
    setExistingLesson(null);
    try {
      const response = await fetch(`/api/lessons/video-jobs/${job.id}`, { cache: "no-store" });
      const body = (await response.json().catch(() => null)) as { job?: PublicVideoJob; error?: string } | null;
      if (!body?.job?.transcript) {
        setError(body?.error ?? "That transcript isn't available any more.");
        return;
      }
      insertTranscript(body.job);
    } catch {
      setError("Couldn't load that transcript just now.");
    }
  }

  async function removeJob(job: PublicVideoJob) {
    setJobs((current) => current.filter((j) => j.id !== job.id));
    if (autoUseRef.current === job.id) autoUseRef.current = null;
    // Removing a job deletes its kept file (unless a saved lesson plays it),
    // so it can't stay lined up to go on this lesson either.
    if (video?.kind === "upload" && video.path === job.storagePath) setVideo(null);
    await fetch(`/api/lessons/video-jobs/${job.id}`, { method: "DELETE" }).catch(() => null);
  }

  // Starts a job for a file and returns it, or says why not. Shared by both
  // ways an upload goes, which differ only in what they send.
  async function createJob(
    body: Record<string, unknown>
  ): Promise<
    { ok: true; job: PublicVideoJob; uploadUrl?: string; uploadToken?: string } | { ok: false; error: string }
  > {
    const response = await fetch("/api/lessons/video-jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ spaceId, ...body }),
    });
    const json = (await response.json().catch(() => null)) as {
      job?: PublicVideoJob;
      uploadUrl?: string;
      uploadToken?: string;
      error?: string;
    } | null;
    if (!response.ok || !json?.job) return { ok: false, error: json?.error ?? "Couldn't start transcribing that file." };
    mergeJob(json.job);
    if (json.job.status === "error") return { ok: false, error: json.job.error ?? "Couldn't start transcribing that file." };
    return { ok: true, job: json.job, uploadUrl: json.uploadUrl, uploadToken: json.uploadToken };
  }

  // Up to 200 MB (and a type the bucket takes): into Storage, kept, and the
  // worker fetches it from there.
  async function uploadKept(file: File, signal: AbortSignal) {
    const stored = await uploadToStorage(file, (loaded, total) => setUpload((u) => u && { ...u, loaded, total }), signal);
    if (!stored.ok) {
      setError(stored.error);
      return;
    }
    const started = await createJob({
      upload: { storagePath: stored.path, fileName: file.name, contentType: file.type, size: file.size },
    });
    if (!started.ok) {
      setError(started.error);
      // Nothing will ever point at it now; don't leave it in the bucket.
      await createClient().storage.from("uploads").remove([stored.path]).catch(() => null);
      return;
    }
    autoUseRef.current = started.job.id;
  }

  // Bigger: straight to the worker with a one-job token, and not kept.
  async function uploadDirect(file: File, signal: AbortSignal) {
    const started = await createJob({
      directUpload: { fileName: file.name, contentType: file.type, size: file.size },
    });
    if (!started.ok) {
      setError(started.error);
      return;
    }
    if (!started.uploadUrl || !started.uploadToken) {
      setError("The video service didn't say where to send the file.");
      return;
    }
    const job = started.job;
    try {
      const result = await uploadWithProgress({
        method: "PUT",
        url: started.uploadUrl,
        headers: {
          Authorization: `Upload ${started.uploadToken}`,
          "Content-Type": file.type || "application/octet-stream",
        },
        body: file,
        onProgress: (loaded, total) => setUpload((u) => u && { ...u, loaded, total }),
        signal,
      });
      if (result.status < 200 || result.status >= 300) {
        setError(uploadErrorMessage(result.body) ?? `The video service refused the file (${result.status}).`);
        void removeJob(job);
        return;
      }
      autoUseRef.current = job.id;
    } catch (uploadError) {
      // The job would only sit at "Waiting for the upload…" until it timed
      // out, so it goes from the list with the failed upload.
      void removeJob(job);
      throw uploadError;
    }
  }

  async function uploadMedia(file: File) {
    if (busy || upload) return;
    setError(null);
    setExistingLesson(null);
    setReadNote(null);

    if (file.type && !isMediaContentType(file.type)) {
      setError("That isn't a video or audio file.");
      return;
    }
    if (file.size === 0) {
      setError(`"${file.name}" is empty.`);
      return;
    }
    if (file.size > MAX_DIRECT_MEDIA_BYTES) {
      setError(
        `That file is ${formatBytes(file.size)} — the most the video service takes is ${formatBytes(MAX_DIRECT_MEDIA_BYTES)}. Trim it, or export just the audio.`
      );
      return;
    }

    const kept = canKeepMedia(file);
    const controller = new AbortController();
    uploadAbortRef.current = controller;
    setUpload({ fileName: file.name, loaded: 0, total: file.size, kept });
    try {
      if (kept) await uploadKept(file, controller.signal);
      else await uploadDirect(file, controller.signal);
    } catch (uploadError) {
      if (!(uploadError instanceof UploadAborted)) {
        setError(uploadError instanceof Error ? uploadError.message : "The upload failed.");
      }
    } finally {
      uploadAbortRef.current = null;
      setUpload(null);
    }
  }

  async function addFile(file: File) {
    if (busy) return;
    setError(null);
    setExistingLesson(null);
    setReadNote(null);

    // A recording dropped on the box means "transcribe this", so it goes the
    // same way as the upload button rather than being refused.
    if (videoConfigured && isMediaContentType(file.type)) {
      await uploadMedia(file);
      return;
    }

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

  // allowDuplicate is the "make it again anyway" answer to a link this space
  // already has a lesson from.
  async function readFromUrl(allowDuplicate = false) {
    if (!url.trim() || reading || busy) return;
    // One box for every kind of link: a video goes to the transcriber, and
    // everything else is read as a page.
    if (urlIsVideo) {
      await startVideo(allowDuplicate);
      return;
    }
    setReading(true);
    setError(null);
    setExistingLesson(null);
    setReadNote(null);
    try {
      const response = await fetch("/api/lessons/read-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spaceId, url, allowDuplicate }),
      });
      const body = (await response.json().catch(() => null)) as
        | {
            text?: string;
            title?: string | null;
            truncated?: boolean;
            error?: string;
            existingLesson?: { id: string; title: string };
          }
        | null;

      if (response.status === 409 && body?.existingLesson) {
        setError(body.error ?? "You've already made a lesson from this link.");
        setExistingLesson(body.existingLesson);
        return;
      }

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
          setUnsavedId(event.unsavedId ?? null);
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

  // After a lesson is written: empty the form so the next link can go straight
  // in, and take the transcripts that were used off the list.
  function clearForNext(saved: { id: string; title: string } | null) {
    const used = jobs.filter((job) => usedJobIdsRef.current.has(job.id));
    usedJobIdsRef.current = new Set();
    for (const job of used) void removeJob(job);
    setSourceText("");
    setUrl("");
    setVideo(null);
    setSource(null);
    setReadNote(null);
    setError(null);
    setExistingLesson(null);
    setUnsavedId(null);
    setSavedLesson(saved);
    // The library is a server component; pull the new lesson into it.
    router.refresh();
  }

  async function submit() {
    setPhase("writing");
    setError(null);
    setExistingLesson(null);
    setSavedLesson(null);
    setUnsavedId(null);
    setCharsWritten(0);

    const controller = new AbortController();
    abortRef.current = controller;

    // Errors arrive mid-stream, so the decision below can't read them from
    // state — it wouldn't have re-rendered yet.
    let failed = false;
    let savedRow: { id: string; title: string } | null = null;

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
          videoUrl: video?.kind === "link" && embedVideo ? video.url : null,
          mediaPath: video?.kind === "upload" && embedVideo ? video.path : null,
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
            const event = JSON.parse(line) as StreamEvent;
            if (event.type === "done" && event.row && typeof event.row === "object") {
              const row = event.row as { id?: unknown; title?: unknown };
              if (typeof row.id === "string") {
                savedRow = { id: row.id, title: typeof row.title === "string" ? row.title : "Your lesson" };
              }
            }
            handleEvent(event, () => {
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

      clearForNext(savedRow);
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

  const linkBusy = reading || starting || upload !== null;

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold tracking-tight text-foreground">Write a lesson</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Paste anything you want taught — a chapter, an article, your own notes
            {videoConfigured ? ", a video link, or a recording you made" : ""}. It gets rewritten as a lesson for the age you pick.
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
        {/* The one band that changes what the lesson IS, not just its
            reading level — said before writing, not discovered after. */}
        {canGoBeyondSource(ageBand) && (
          <p className="mt-2 text-xs text-muted-foreground">
            Adult lessons go past what you paste (the history, the arguments and the stranger
            theories it leaves out), so they can&apos;t be checked against it.
          </p>
        )}
      </div>

      {/* A link is a shortcut into the box below, not a second way to write a
          lesson. A page is read straight in; a YouTube, Facebook, Instagram,
          TikTok or Vimeo video is handed to the video worker, which fetches its
          captions or listens to it, and the transcript lands in the box when
          it's done. */}
      <div className="mt-4">
        <span className="text-sm font-medium text-foreground">
          {videoConfigured ? "Read from a link or a recording" : "Read from a link"}
        </span>
        <div className="mt-2 flex flex-wrap gap-2">
          <div className="relative min-w-[14rem] flex-1">
            {urlIsVideo ? (
              <Film className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            ) : (
              <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            )}
            <input
              type="url"
              inputMode="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                // A different link: the warning was about the old one.
                if (existingLesson) {
                  setExistingLesson(null);
                  setError(null);
                  setExistingLesson(null);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void readFromUrl();
                }
              }}
              disabled={busy || linkBusy}
              placeholder={
                videoConfigured
                  ? "Paste an article, or a YouTube, Facebook, Instagram, TikTok or Vimeo video link…"
                  : "Paste an article or recipe link…"
              }
              className="w-full rounded-md border border-border bg-card py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
            />
          </div>
          <Button variant="secondary" onClick={() => void readFromUrl()} disabled={busy || linkBusy || !url.trim()}>
            {linkBusy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : urlIsVideo ? (
              <Film className="h-4 w-4" />
            ) : (
              <Link2 className="h-4 w-4" />
            )}
            {reading ? "Reading…" : starting ? "Starting…" : urlIsVideo ? "Transcribe" : "Read it in"}
          </Button>
          {/* A teacher's own recording: a talk, a lecture, a voice memo. */}
          {videoConfigured && (
            <>
              <Button
                variant="secondary"
                onClick={() => mediaInputRef.current?.click()}
                disabled={busy || linkBusy}
                title={`Up to ${formatBytes(MAX_KEPT_MEDIA_BYTES)} is kept so the lesson can play it; bigger files are transcribed and not kept.`}
              >
                <Upload className="h-4 w-4" />
                Upload a video or audio file
              </Button>
              <input
                ref={mediaInputRef}
                type="file"
                accept={MEDIA_FILE_ACCEPT}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (file) void uploadMedia(file);
                }}
              />
            </>
          )}
        </div>
        {upload && (
          <UploadRow upload={upload} onCancel={() => uploadAbortRef.current?.abort()} />
        )}
        {readNote && <p className="mt-2 text-xs text-muted-foreground">{readNote}</p>}

        {videoConfigured && jobs.length > 0 && (
          <ul className="mt-3 space-y-2">
            {jobs.map((job) => (
              <VideoJobRow
                key={job.id}
                job={job}
                disabled={busy}
                onUse={() => void loadFinishedJob(job)}
                onRemove={() => void removeJob(job)}
              />
            ))}
          </ul>
        )}
      </div>

      {/* The box, and the two ways to fill it that aren't typing. A caption
          file is the one that matters: it is what a downloaded transcript
          actually is, and pasting one raw spends three quarters of the
          character budget on timestamps. */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <label htmlFor="lesson-source" className="text-sm font-medium text-foreground">
          Source material
        </label>
        <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()} disabled={busy}>
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
          // Emptying the box is starting over; the video goes with it.
          if (!e.target.value.trim()) setVideo(null);
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

      {video && (
        <label className="mt-3 flex items-start gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={embedVideo}
            onChange={(e) => setEmbedVideo(e.target.checked)}
            disabled={busy}
            className="mt-0.5 h-4 w-4 rounded border-border accent-[var(--accent)]"
          />
          <span>
            {video.kind === "upload" && video.mediaType === "audio"
              ? "Play the recording at the top of the lesson"
              : "Show the video at the top of the lesson"}
            <span className="block text-xs text-muted-foreground">
              {video.kind === "link" ? (video.title ?? video.url) : (video.title ?? "Your upload")} — everyone
              who can see the lesson can {video.kind === "upload" && video.mediaType === "audio" ? "listen to" : "watch"}{" "}
              it there.
            </span>
          </span>
        </label>
      )}

      {savedLesson && !error && (
        <p className="mt-3 rounded-md bg-accent-soft px-3 py-2 text-sm text-foreground" role="status">
          Lesson saved
          {lessonHref ? (
            <>
              {": "}
              <a href={lessonHref(savedLesson.id)} className="font-medium text-accent hover:underline">
                {savedLesson.title}
              </a>
            </>
          ) : null}
          . Paste another link or more material to write the next one.
        </p>
      )}

      {error && (
        <div className="mt-3 rounded-md bg-danger/10 px-3 py-2 text-sm text-danger" role="alert">
          <Linkify text={error} />
          {existingLesson && (
            <div className="mt-2 flex flex-wrap items-center gap-3">
              {lessonHref && (
                <a href={lessonHref(existingLesson.id)} className="font-medium text-accent hover:underline">
                  Open that lesson
                </a>
              )}
              <button
                type="button"
                onClick={() => void readFromUrl(true)}
                disabled={busy || linkBusy || !url.trim()}
                className="font-medium text-foreground underline-offset-2 hover:underline disabled:opacity-50"
              >
                Make it again anyway
              </button>
            </div>
          )}
          {unsavedId && (
            <SaveUnsavedLesson
              unsavedId={unsavedId}
              onSaved={(id) => clearForNext({ id, title: "Your lesson" })}
            />
          )}
        </div>
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

// Turns a finished job into what can go at the top of its lesson: the link,
// or a kept upload. A direct upload wasn't kept, so there is nothing to show.
function topMediaOf(job: PublicVideoJob): TopMedia | null {
  if (job.kind === "link" && job.sourceUrl) return { kind: "link", url: job.sourceUrl, title: job.title };
  if (job.kind === "file" && job.storagePath) {
    const mediaType = mediaTypeOfPath(job.storagePath);
    if (mediaType) return { kind: "upload", path: job.storagePath, title: job.title, mediaType };
  }
  return null;
}

// A recording on its way up. Kept and direct uploads say plainly which they
// are, because only one of them ends up playable in the lesson.
function UploadRow({ upload, onCancel }: { upload: UploadProgress; onCancel: () => void }) {
  const percent = upload.total > 0 ? Math.round((upload.loaded / upload.total) * 100) : 0;
  return (
    <div className="mt-3 rounded-md border border-border bg-card px-3 py-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 truncate text-sm font-medium text-foreground">
            <Upload className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate">{upload.fileName}</span>
            <span className="shrink-0 text-xs font-normal text-muted-foreground">{formatBytes(upload.total)}</span>
          </p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-300"
              style={{ width: `${Math.max(2, percent)}%` }}
            />
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Loader2 className="h-3 w-3 shrink-0 animate-spin" />
            Uploading… {percent}%. Keep this open until it finishes.
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {upload.kept
              ? "The file is kept, so the lesson can play it."
              : `Over ${formatBytes(MAX_KEPT_MEDIA_BYTES)} (or a type that can't be stored), so it goes straight to the transcriber and won't be kept — the lesson won't be able to play it.`}
          </p>
        </div>
        <Button size="sm" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

// One video job in the composer: a progress bar while it runs, a button to
// put the transcript in the box once it's done, the reason if it failed.
function VideoJobRow({
  job,
  disabled,
  onUse,
  onRemove,
}: {
  job: PublicVideoJob;
  disabled: boolean;
  onUse: () => void;
  onRemove: () => void;
}) {
  const running = !isJobFinished(job);
  const length = formatDuration(job.durationSeconds);
  const percent = Math.round((job.progress ?? 0) * 100);
  const isAudio = job.storagePath ? mediaTypeOfPath(job.storagePath) === "audio" : false;
  const Icon = isAudio ? Music : job.kind === "link" ? Film : Upload;
  // A direct upload is only "waiting" while this tab is sending it, so
  // telling someone they can close it then would lose the file.
  const awaitingUpload = job.kind === "direct" && job.status === "queued";

  return (
    <li className="rounded-md border border-border bg-card px-3 py-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 truncate text-sm font-medium text-foreground">
            <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate">{jobLabel(job)}</span>
            {length && <span className="shrink-0 text-xs font-normal text-muted-foreground">{length}</span>}
          </p>
          {running && (
            <>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-accent transition-[width] duration-500"
                  style={{ width: `${Math.max(4, percent)}%` }}
                />
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                {job.message ?? "Working…"}
                {awaitingUpload ? "" : " You can close this and come back."}
              </p>
            </>
          )}
          {job.status === "done" && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              Ready — {job.transcriptChars.toLocaleString()} characters
              {job.method === "captions" ? ", from the video's captions" : ", transcribed from the audio"}.
              {job.kind === "direct" && " The file wasn't kept, so the lesson can't play it."}
            </p>
          )}
          {/* Linkified: a login or bot-check error ends with a link to the
              instructions for fixing it. */}
          {job.status === "error" && (
            <Linkify text={job.error ?? "That didn't work."} className="mt-0.5 text-xs text-danger" />
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {job.status === "done" && (
            <Button size="sm" variant="secondary" onClick={onUse} disabled={disabled}>
              Use transcript
            </Button>
          )}
          <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
            aria-label={running ? "Stop watching this video" : "Remove from the list"}
            title={running ? "Stop watching this video" : "Remove from the list"}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </li>
  );
}
