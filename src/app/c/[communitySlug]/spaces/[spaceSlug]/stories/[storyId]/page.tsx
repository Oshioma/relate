import { notFound } from "next/navigation";
import { Clock, MapPin, Quote } from "lucide-react";
import { loadGuidedJourneyPage } from "@/lib/data/guided-journey-page";
import { displayName, getStory } from "@/lib/data/guided-journey";
import { optionLabel } from "@/lib/guided-journey/config";
import { JourneyShell, SafetyNote } from "@/components/guided-journey/journey-shell";
import { JourneyImage } from "@/components/guided-journey/journey-image";
import { SafetyMenu } from "@/components/guided-journey/safety-menu";
import { ShareMenu } from "@/components/ui/share-menu";
import { Avatar } from "@/components/ui/avatar";
import { formatRelativeTime } from "@/lib/utils";

export default async function StoryPage({ params }: { params: Promise<{ communitySlug: string; spaceSlug: string; storyId: string }> }) {
  const ctx = await loadGuidedJourneyPage(params);
  const { storyId } = await params;
  const story = await getStory(ctx.supabase, storyId);
  // RLS only returns published stories to the public; authors, their mentor
  // and staff also see drafts. The space check keeps URLs honest.
  if (!story || story.space_id !== ctx.space.id) notFound();
  const { config } = ctx;
  const sections: [string, string | null][] = [
    ["Growing conditions", story.conditions],
    ["Problems encountered", story.problems],
    ["Solutions tried", story.solutions],
    ["Lessons learned", story.lessons],
    ["Final results", story.results],
  ];

  return (
    <JourneyShell ctx={ctx} active="stories">
      {story.status !== "published" && (
        <p className="mb-6 rounded-2xl bg-muted px-4 py-3 text-sm text-foreground">
          {story.status === "hidden" ? "Hidden by the community team." : "Private draft — only you, your mentor and staff can see this."}
        </p>
      )}
      <article>
        {story.subject && <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">{story.subject}</p>}
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{story.title}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <Avatar src={story.author?.avatar_url} name={displayName(story.author)} size={28} />
            {displayName(story.author)}
            {story.mentor ? ` with ${displayName(story.mentor)}` : ` with a community ${config.terms.mentor}`}
          </span>
          {story.region && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4" /> {story.region}
              {story.climate ? ` · ${story.climate}` : ""}
            </span>
          )}
          {story.duration_weeks !== null && (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-4 w-4" /> {story.duration_weeks} weeks
            </span>
          )}
          {story.method && <span>{optionLabel(config.gallery.methodOptions, story.method)}</span>}
          {story.published_at && <span>Shared {formatRelativeTime(story.published_at)}</span>}
        </div>
        <div className="mt-4">
          <ShareMenu title={story.title} text={`${story.title} — a ${config.terms.journey} story`} />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <figure>
            <JourneyImage src={story.before_photo_url} alt={`${story.title}: before`} priority sizes="(min-width: 640px) 50vw, 100vw" />
            <figcaption className="mt-2 text-sm text-muted-foreground">Before</figcaption>
          </figure>
          <figure>
            <JourneyImage src={story.after_photo_url} alt={`${story.title}: after`} priority sizes="(min-width: 640px) 50vw, 100vw" />
            <figcaption className="mt-2 text-sm text-muted-foreground">After</figcaption>
          </figure>
        </div>

        {story.mentor_acknowledgement && story.mentor && (
          <blockquote className="mt-8 rounded-3xl bg-accent-soft p-6">
            <Quote className="h-5 w-5 text-accent" />
            <p className="mt-2 text-lg text-foreground">{story.mentor_acknowledgement}</p>
            <footer className="mt-2 text-sm text-muted-foreground">— {displayName(story.mentor)}</footer>
          </blockquote>
        )}

        <div className="mt-8 space-y-6">
          {sections
            .filter(([, body]) => body)
            .map(([title, body]) => (
              <section key={title}>
                <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                <p className="mt-1.5 whitespace-pre-line leading-relaxed text-foreground/90">{body}</p>
              </section>
            ))}
        </div>

        {story.photos.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-semibold text-foreground">Timeline</h2>
            <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {story.photos.map((url, i) => (
                <li key={url}>
                  <JourneyImage src={url} alt={`${story.title}, photo ${i + 1}`} aspect="aspect-square" rounded="rounded-xl" sizes="(min-width: 640px) 30vw, 50vw" />
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
      <SafetyNote ctx={ctx} className="mt-10" />
      {ctx.isMember && ctx.userId && ctx.userId !== story.author_id && (
        <SafetyMenu
          communitySlug={ctx.community.slug}
          spaceSlug={ctx.space.slug}
          spaceId={ctx.space.id}
          personId={story.author_id}
          storyId={story.id}
          allowBlock={false}
          className="mt-4"
        />
      )}
    </JourneyShell>
  );
}
