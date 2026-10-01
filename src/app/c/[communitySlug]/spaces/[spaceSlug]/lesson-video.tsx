"use client";

import { createContext, useContext, useRef, useState, type RefObject } from "react";
import { ExternalLink, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  VIDEO_PLATFORM_NAMES,
  formatTimestamp,
  parseVideoLink,
  seekEmbedUrl,
} from "@/lib/school/video-links";

// "Watch from 12:30" on a section has to move a video that belongs to a
// different component — and on a page of several levels, to a different
// level's card: only the first level shows the video, but every level's
// sections can point into it. So the page holds the one video's state here,
// and both the player and the buttons read it.
type Seek = {
  // Whether the page's video player can be started at a given moment. False
  // means no buttons anywhere on the page.
  seekable: boolean;
  // `n` changes on every click, so asking for the same moment twice still
  // restarts the player rather than leaving it wherever it has got to.
  startAt: { seconds: number; n: number } | null;
  seek: (seconds: number) => void;
  videoRef: RefObject<HTMLDivElement | null>;
};

const SeekContext = createContext<Seek | null>(null);

export function LessonVideoProvider({
  url,
  children,
}: {
  url: string | null;
  children: React.ReactNode;
}) {
  const link = url ? parseVideoLink(url) : null;
  const seekable = Boolean(link && seekEmbedUrl(link, 0));
  const [startAt, setStartAt] = useState<Seek["startAt"]>(null);
  const videoRef = useRef<HTMLDivElement | null>(null);

  function seek(seconds: number) {
    setStartAt((previous) => ({ seconds, n: (previous?.n ?? 0) + 1 }));
    videoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <SeekContext.Provider value={{ seekable, startAt, seek, videoRef }}>
      {children}
    </SeekContext.Provider>
  );
}

// The button by a section. Renders nothing outside a provider (the composer's
// preview), when the video's platform can't seek, or for a section with no
// time — so a lesson not written from a video looks exactly as it did.
export function WatchFromButton({ seconds }: { seconds: number | null | undefined }) {
  const context = useContext(SeekContext);
  if (!context?.seekable || seconds == null || !Number.isFinite(seconds) || seconds < 0) {
    return null;
  }
  return (
    <button
      type="button"
      onClick={() => context.seek(seconds)}
      className="mb-2 inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-accent-soft hover:text-accent print:hidden"
    >
      <Play className="h-3 w-3" aria-hidden />
      Watch from {formatTimestamp(seconds)}
    </button>
  );
}

// The video a lesson was written from, shown at the top so it can be watched
// alongside the lesson.
//
// The embed address is rebuilt from the stored link every time rather than
// stored: the stored value is only ever a link, and parseVideoLink decides
// which platform's player it may become, so a row edited by hand can never
// put an arbitrary page in the frame.
export function LessonVideo({ url, className }: { url: string; className?: string }) {
  const context = useContext(SeekContext);
  const link = parseVideoLink(url);
  if (!link) return null;

  const name = VIDEO_PLATFORM_NAMES[link.platform];

  // Some links (a Facebook share link) can be transcribed but not embedded.
  if (!link.embedUrl) {
    return (
      <p className={cn("text-sm", className)}>
        <a
          href={link.url}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1 font-medium text-accent hover:underline"
        >
          Watch the video on {name}
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </p>
    );
  }

  // A section's button swaps in an address that starts at its moment; the
  // key remounts the frame so the player really reloads there.
  const startAt = context?.startAt ?? null;
  const src = (startAt && seekEmbedUrl(link, startAt.seconds)) || link.embedUrl;

  return (
    <div ref={context?.videoRef} className={cn("scroll-mt-6 print:hidden", className)}>
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-lg border border-border bg-black",
          link.portrait ? "mx-auto aspect-[9/16] max-w-sm" : "aspect-video"
        )}
      >
        <iframe
          key={startAt?.n ?? 0}
          src={src}
          title={`${name} video`}
          className="absolute inset-0 h-full w-full"
          loading="lazy"
          // autoplay so a "watch from" click plays straight away; the player
          // still won't start on its own until someone asks for a moment.
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      <p className="mt-1.5 text-xs text-muted-foreground">
        <a
          href={link.url}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1 hover:underline"
        >
          Open on {name}
          <ExternalLink className="h-3 w-3" />
        </a>
      </p>
    </div>
  );
}
