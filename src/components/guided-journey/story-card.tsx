import Link from "next/link";
import { Clock, MapPin } from "lucide-react";
import type { StoryWithPeople } from "@/lib/data/guided-journey";
import { displayName } from "@/lib/data/guided-journey";
import { optionLabel, type GuidedJourneyConfig } from "@/lib/guided-journey/config";
import { Avatar } from "@/components/ui/avatar";
import { JourneyImage } from "./journey-image";

// A finished, shared journey in the community gallery: before and after side
// by side, what was grown, where, how long, and (only if the mentor agreed)
// who helped.
export function StoryCard({ story, href, config }: { story: StoryWithPeople; href: string; config: GuidedJourneyConfig }) {
  const before = story.before_photo_url;
  const after = story.after_photo_url ?? story.photos[0] ?? null;
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none"
    >
      <div className="grid grid-cols-2 gap-0.5 bg-border">
        <div className="relative">
          <JourneyImage src={before} alt={`${story.title}: at the start`} aspect="aspect-square" rounded="rounded-none" sizes="(min-width: 1024px) 16vw, 50vw" />
          <span className="absolute left-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-[11px] font-medium text-white">Before</span>
        </div>
        <div className="relative">
          <JourneyImage src={after} alt={`${story.title}: the result`} aspect="aspect-square" rounded="rounded-none" sizes="(min-width: 1024px) 16vw, 50vw" />
          <span className="absolute left-2 top-2 rounded-full bg-accent px-2 py-0.5 text-[11px] font-medium text-accent-foreground">After</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        {story.subject && <p className="text-xs font-semibold uppercase tracking-wide text-accent">{story.subject}</p>}
        <h3 className="mt-1 text-lg font-semibold leading-snug text-foreground">{story.title}</h3>
        <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {story.region && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {story.region}
            </span>
          )}
          {story.duration_weeks !== null && (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {story.duration_weeks} {story.duration_weeks === 1 ? "week" : "weeks"}
            </span>
          )}
          {story.method && <span>{optionLabel(config.gallery.methodOptions, story.method)}</span>}
        </p>
        {(story.results || story.lessons) && <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{story.results || story.lessons}</p>}
        <div className="mt-auto flex items-center gap-2 pt-4 text-xs text-muted-foreground">
          <Avatar src={story.author?.avatar_url} name={displayName(story.author)} size={24} />
          <span>
            {displayName(story.author)}
            {story.mentor ? ` with ${displayName(story.mentor)}` : ` with a community ${config.terms.mentor}`}
          </span>
        </div>
      </div>
    </Link>
  );
}
