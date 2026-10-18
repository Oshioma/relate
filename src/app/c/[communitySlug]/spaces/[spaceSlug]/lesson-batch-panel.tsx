"use client";

import { useEffect, useRef, useState } from "react";
import { Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ageBandLabel } from "@/lib/school/lesson-types";

// The page's view of a background "write every missing age" job.
// Mirrors BatchJobStatus in src/lib/school/lesson-batch.ts.
export type BatchJobView = {
  id: string;
  status: "running" | "done" | "error" | "cancelled";
  currentBand: string | null;
  pendingBands: string[];
  lessonIds: string[];
  error: string | null;
};

// Every this often while the page is open, the job is asked whether its
// current level has come back. Each check is also what moves it on.
const POLL_MS = 30_000;

// Half-price background writing: start it, watch it, stop it.
//
// The levels are written one after another, youngest first, so each older one
// still builds on the levels above it — which is why this takes a while, and
// why the panel says you can leave. When a level arrives the page reloads to
// show it.
export function LessonBatchPanel({
  lessonId,
  missingCount,
  initialJob,
  disabled,
  onRunningChange,
}: {
  lessonId: string;
  missingCount: number;
  initialJob: BatchJobView | null;
  // Another level is being written right now.
  disabled: boolean;
  onRunningChange?: (running: boolean) => void;
}) {
  const [job, setJob] = useState<BatchJobView | null>(initialJob);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const seen = useRef(initialJob?.lessonIds.length ?? 0);

  const running = job?.status === "running";

  useEffect(() => {
    onRunningChange?.(running);
  }, [running, onRunningChange]);

  // Poll while running. A new level, or the job finishing, reloads the page so
  // the level appears in place with everything else re-read.
  useEffect(() => {
    if (!job || job.status !== "running") return;
    let stopped = false;

    async function check() {
      try {
        const response = await fetch(`/api/lessons/batch-jobs/${job!.id}`, { cache: "no-store" });
        const body = (await response.json().catch(() => null)) as { job?: BatchJobView } | null;
        if (stopped || !body?.job) return;
        const next = body.job;
        if (next.lessonIds.length > seen.current || next.status === "done") {
          window.location.reload();
          return;
        }
        setJob(next);
      } catch {
        // A missed check is fine; the next one will catch up.
      }
    }

    check();
    const timer = setInterval(check, POLL_MS);
    return () => {
      stopped = true;
      clearInterval(timer);
    };
  }, [job?.id, job?.status]); // eslint-disable-line react-hooks/exhaustive-deps

  async function start() {
    setStarting(true);
    setError(null);
    try {
      const response = await fetch(`/api/lessons/${lessonId}/levels-batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const body = (await response.json().catch(() => null)) as
        | { job?: BatchJobView; error?: string }
        | null;
      if (!response.ok || !body?.job) {
        setError(body?.error ?? "Couldn't start writing the levels.");
        return;
      }
      seen.current = body.job.lessonIds.length;
      setJob(body.job);
    } catch {
      setError("Couldn't reach the server. Try again in a minute.");
    } finally {
      setStarting(false);
    }
  }

  async function cancel() {
    if (!job) return;
    try {
      const response = await fetch(`/api/lessons/batch-jobs/${job.id}`, { method: "DELETE" });
      const body = (await response.json().catch(() => null)) as { job?: BatchJobView } | null;
      if (body?.job) setJob(body.job);
    } catch {
      setError("Couldn't stop it just now. Try again.");
    }
  }

  if (running && job) {
    const queue = job.pendingBands.map(ageBandLabel);
    return (
      <div className="mt-4 rounded-lg bg-accent-soft/60 px-4 py-3 text-sm">
        <p className="flex items-start gap-2 text-foreground">
          <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
          <span>
            Writing in the background at half price
            {job.currentBand ? (
              <>
                : <strong>{ageBandLabel(job.currentBand)}</strong> now
                {queue.length > 0 ? `, then ${queue.join(", ")}` : ""}.
              </>
            ) : (
              "."
            )}{" "}
            Each level takes from a few minutes to a few hours. You can close this page; it carries
            on when you come back.
          </span>
        </p>
        <Button size="sm" variant="ghost" className="mt-2" onClick={cancel}>
          <X className="h-4 w-4" />
          Stop
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-4 border-t border-border pt-4">
      {job?.status === "error" && job.error && (
        <p className="mb-2 rounded-md bg-danger/10 px-3 py-2 text-sm text-danger" role="alert">
          {job.error}
        </p>
      )}
      <Button size="sm" variant="secondary" onClick={start} disabled={starting || disabled}>
        <Clock className="h-4 w-4" />
        {starting
          ? "Starting…"
          : missingCount === 1
            ? "Write it in the background at half price"
            : `Write all ${missingCount} missing ages in the background at half price`}
      </Button>
      <p className="mt-1.5 text-[11px] text-muted-foreground">
        One after another, youngest first, so each still builds on the ones before it. Slower:
        minutes to hours per level.
      </p>
      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
    </div>
  );
}
