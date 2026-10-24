"use client";

import { useState, useTransition } from "react";
import { ExternalLink, PlayCircle, Radio, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatDateTime } from "@/lib/utils";
import { courseVideoSource, liveLessonState } from "@/lib/courses/lesson-kinds";
import { JitsiRoom, type JitsiJoinConfig } from "./jitsi-room";
import { joinCourseLiveLesson } from "./courses-actions";
import type { CourseLesson } from "@/types/database";

// A course lesson's video: framed when the platform allows it, played by the
// browser when it's a video file, otherwise a link out.
export function CourseLessonVideo({ url, title }: { url: string; title: string }) {
  const source = courseVideoSource(url);
  if (!source) return null;

  if (source.kind === "embed") {
    return (
      <div
        className={cn(
          "mt-4 overflow-hidden rounded-lg border border-border bg-black",
          source.portrait ? "mx-auto aspect-[9/16] max-h-[70vh]" : "aspect-video w-full"
        )}
      >
        <iframe
          src={source.src}
          title={title}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    );
  }

  if (source.kind === "file") {
    return (
      <video controls preload="metadata" src={source.src} className="mt-4 aspect-video w-full rounded-lg border border-border bg-black">
        <a href={source.src} target="_blank" rel="noopener noreferrer">
          Watch the video
        </a>
      </video>
    );
  }

  return (
    <a
      href={source.href}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-4 inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-accent hover:bg-muted"
    >
      <PlayCircle className="h-4 w-4" />
      Watch video
      <ExternalLink className="h-3.5 w-3.5" />
    </a>
  );
}

// A live lesson: when it runs, the room (for people allowed in), and its
// playback once the teacher has added it.
export function CourseLiveLesson({
  lesson,
  nowMs,
  canJoinLive,
  isStaff,
  displayName,
  liveUpsell,
}: {
  lesson: CourseLesson;
  nowMs: number;
  canJoinLive: boolean;
  isStaff: boolean;
  displayName: string | null;
  // Shown to people who can watch but not join, e.g. "Live sessions come with
  // Tier 2." Null hides it.
  liveUpsell: React.ReactNode;
}) {
  const state = liveLessonState(lesson, nowMs);
  const [room, setRoom] = useState<{ roomName: string; config: JitsiJoinConfig } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function join() {
    setError(null);
    startTransition(async () => {
      const result = await joinCourseLiveLesson(lesson.id);
      if ("error" in result) setError(result.error);
      else setRoom({ roomName: result.roomName, config: result.config });
    });
  }

  const when = lesson.live_starts_at ? formatDateTime(lesson.live_starts_at) : null;
  const ends = lesson.live_ends_at ? formatDateTime(lesson.live_ends_at) : null;
  const mayOpenRoom = canJoinLive && (state === "open" || isStaff);

  return (
    <div className="mt-4 space-y-4">
      {state !== "ended" && (
        <div
          className={cn(
            "rounded-lg border p-4",
            state === "open" ? "border-rose-300 bg-rose-50/60 dark:border-rose-900 dark:bg-rose-950/20" : "border-border bg-muted/30"
          )}
        >
          <div className="flex flex-wrap items-center gap-2">
            <Radio className={cn("h-4 w-4", state === "open" ? "text-rose-500" : "text-muted-foreground")} />
            <p className="text-sm font-semibold text-foreground">{state === "open" ? "Live now" : "Live lesson"}</p>
            {when && (
              <span className="text-sm text-muted-foreground">
                {when}
                {ends ? ` to ${ends}` : ""}
              </span>
            )}
          </div>

          {room ? null : mayOpenRoom ? (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Button type="button" onClick={join} disabled={isPending} className="w-auto">
                <Video className="h-4 w-4" />
                {state === "open" ? "Join the live lesson" : "Open the room early"}
              </Button>
              {state !== "open" && <span className="text-xs text-muted-foreground">Members can join 15 minutes before the start.</span>}
            </div>
          ) : canJoinLive ? (
            <p className="mt-2 text-sm text-muted-foreground">The room opens here 15 minutes before the start.</p>
          ) : (
            <div className="mt-2 text-sm text-muted-foreground">
              {liveUpsell ?? "Joining live isn't part of your access."} You&apos;ll be able to watch the playback here afterwards.
            </div>
          )}
          {error && <p className="mt-2 text-sm text-danger">{error}</p>}
        </div>
      )}

      {room && (
        <JitsiRoom
          roomName={room.roomName}
          displayName={displayName}
          subject={lesson.title}
          getToken={async () => room.config}
          onClose={() => setRoom(null)}
        />
      )}

      {lesson.video_url ? (
        <div>
          {state !== "ended" && <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Playback</p>}
          <CourseLessonVideo url={lesson.video_url} title={`${lesson.title} (playback)`} />
        </div>
      ) : (
        state === "ended" && (
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
            <PlayCircle className="h-4 w-4" />
            {when ? `This session ran on ${when}. ` : ""}The playback will appear here once it&apos;s added.
          </div>
        )
      )}
    </div>
  );
}
