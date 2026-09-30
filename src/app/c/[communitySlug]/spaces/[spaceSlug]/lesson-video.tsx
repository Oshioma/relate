import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { VIDEO_PLATFORM_NAMES, parseVideoLink } from "@/lib/school/video-links";

// The video a lesson was written from, shown at the top so it can be watched
// alongside the lesson.
//
// The embed address is rebuilt from the stored link every time rather than
// stored: the stored value is only ever a link, and parseVideoLink decides
// which platform's player it may become, so a row edited by hand can never
// put an arbitrary page in the frame.
export function LessonVideo({ url, className }: { url: string; className?: string }) {
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

  return (
    <div className={cn("print:hidden", className)}>
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-lg border border-border bg-black",
          link.portrait ? "mx-auto aspect-[9/16] max-w-sm" : "aspect-video"
        )}
      >
        <iframe
          src={link.embedUrl}
          title={`${name} video`}
          className="absolute inset-0 h-full w-full"
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
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
