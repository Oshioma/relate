import { cn } from "@/lib/utils";
import { isLessonMediaPath, lessonMediaPublicUrl } from "@/lib/school/lesson-media";
import type { LessonMediaType } from "@/types/database";

// An uploaded recording a lesson was written from, played at the top of the
// lesson — the file-upload counterpart of LessonVideo, in the same place and
// the same frame.
//
// The address is rebuilt from the stored path, and only for a path shaped like
// a lesson upload, so a row edited by hand can't make the page play some other
// file in the bucket. Hidden in print, like the video: paper can't play it.
export function LessonMediaPlayer({
  path,
  type,
  className,
}: {
  path: string;
  type: LessonMediaType | null;
  className?: string;
}) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base || !isLessonMediaPath(path)) return null;
  const src = lessonMediaPublicUrl(base, path);

  if (type === "audio") {
    return (
      <div className={cn("print:hidden", className)}>
        <audio controls preload="metadata" src={src} className="w-full">
          Your browser can&apos;t play this recording.
        </audio>
      </div>
    );
  }

  return (
    <div className={cn("print:hidden", className)}>
      <div className="relative w-full overflow-hidden rounded-lg border border-border bg-black">
        <video controls preload="metadata" playsInline src={src} className="max-h-[70vh] w-full">
          Your browser can&apos;t play this video.
        </video>
      </div>
    </div>
  );
}
