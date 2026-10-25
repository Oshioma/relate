import Link from "@/components/ui/link";
import { Play, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRatingDisplay } from "./star-rating";
import type { GuideWithStats } from "@/lib/data/guides";
import { toPlainText } from "@/components/ui/rich-text";
import { guideVideoThumbnail, type GuideVideoThumbnail } from "@/lib/guide-video-thumbnail";

// Guides are written as HTML now, so the excerpt is read from the plain text.
function excerpt(body: string, length = 140): string {
  const trimmed = toPlainText(body).trim();
  return trimmed.length > length ? `${trimmed.slice(0, length)}…` : trimmed;
}

// A guide with a video in it shows that video on its card: YouTube's still,
// an uploaded video's first frame, or a plain play tile.
function VideoThumbnail({ thumbnail }: { thumbnail: GuideVideoThumbnail }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden bg-muted">
      {thumbnail.kind === "image" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={thumbnail.src} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
      )}
      {thumbnail.kind === "video" && (
        <video src={`${thumbnail.src}#t=0.1`} preload="metadata" muted playsInline aria-hidden="true" tabIndex={-1} className="pointer-events-none h-full w-full object-cover" />
      )}
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white">
          <Play className="ml-0.5 h-5 w-5 fill-current" />
        </span>
      </span>
    </div>
  );
}

export function GuideCard({ data, communitySlug, spaceSlug }: { data: GuideWithStats; communitySlug: string; spaceSlug: string }) {
  const { guide, avgRating, ratingCount, contributorCount } = data;
  const thumbnail = guideVideoThumbnail(guide.body);
  // A guide that is only a pasted link would otherwise show the address.
  const summary = excerpt(guide.body);
  const showSummary = summary !== "" && !/^https?:\/\/\S+$/.test(summary);

  return (
    <Link href={`/c/${communitySlug}/spaces/${spaceSlug}/guides/${guide.id}`}>
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-sm">
        {thumbnail && <VideoThumbnail thumbnail={thumbnail} />}
        <CardContent className="pt-5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">{guide.title}</h3>
            {guide.featured && <Badge tone="accent">Featured</Badge>}
          </div>

          {showSummary && <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{summary}</p>}

          <div className="mt-4 flex items-center justify-between gap-3">
            <StarRatingDisplay value={avgRating} count={ratingCount} />
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              {contributorCount} {contributorCount === 1 ? "contributor" : "contributors"}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
