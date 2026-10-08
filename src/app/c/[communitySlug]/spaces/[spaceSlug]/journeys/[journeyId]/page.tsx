import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, CalendarDays, Clock, HelpCircle, PartyPopper, Sparkles, TriangleAlert } from "lucide-react";
import { loadGuidedJourneyPage } from "@/lib/data/guided-journey-page";
import { displayName, getJourneyDetail, weeksBetween, type UpdateWithAuthor } from "@/lib/data/guided-journey";
import { mentorLevelLabel } from "@/lib/guided-journey/config";
import { nextRecommendedAction } from "@/lib/guided-journey/next-action";
import { moderateUpdate } from "../../journey-actions";
import { JourneyShell, SafetyNote } from "@/components/guided-journey/journey-shell";
import { JourneyImage } from "@/components/guided-journey/journey-image";
import { MilestoneList } from "@/components/guided-journey/milestones";
import { CompleteJourneyForm, EndJourneyForm, InPersonToggle, JourneySettingsForm, ReplyForm, UpdateComposer } from "@/components/guided-journey/journey-forms";
import { SafetyMenu } from "@/components/guided-journey/safety-menu";
import { Avatar } from "@/components/ui/avatar";
import { LinkButton } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/utils";

// The shared journey dashboard: who, where you are, what's next, the weekly
// updates and their replies, every photo so far, and the controls to adapt,
// complete or end it.
export default async function JourneyPage({
  params,
  searchParams,
}: {
  params: Promise<{ communitySlug: string; spaceSlug: string; journeyId: string }>;
  searchParams: Promise<{ started?: string }>;
}) {
  const ctx = await loadGuidedJourneyPage(params);
  const { journeyId } = await params;
  const { started } = await searchParams;
  const detail = await getJourneyDetail(ctx.supabase, journeyId);
  // RLS returns a journey only to its participants and staff; the space check
  // stops one being opened through another space's URL.
  if (!detail || detail.journey.space_id !== ctx.space.id || !ctx.userId) notFound();

  const { journey, participants, milestones, updates, mentorProfile } = detail;
  const { config } = ctx;
  const me = participants.find((p) => p.user_id === ctx.userId && !p.left_at) ?? null;
  const isMentor = me?.role === "mentor";
  const canWrite = Boolean(me) && journey.status !== "ended";
  const mentor = participants.find((p) => p.role === "mentor");
  const beginners = participants.filter((p) => p.role === "beginner" && !p.left_at);
  const others = participants.filter((p) => p.user_id !== ctx.userId && !p.left_at);
  const hidden = { community_slug: ctx.community.slug, space_slug: ctx.space.slug };

  const roots = updates.filter((u) => !u.parent_id);
  const repliesByParent = new Map<string, UpdateWithAuthor[]>();
  for (const u of updates.filter((u) => u.parent_id)) {
    repliesByParent.set(u.parent_id!, [...(repliesByParent.get(u.parent_id!) ?? []), u]);
  }
  const allPhotos = updates.flatMap((u) => u.photos.map((url) => ({ url, at: u.created_at, by: displayName(u.author) })));
  const current = milestones.find((m) => m.status !== "done");
  const doneCount = milestones.filter((m) => m.status === "done").length;
  const weeksIn = weeksBetween(journey.started_at, journey.completed_at ?? journey.ended_at);

  // Next recommended action: one gentle suggestion, worked out from the data.
  const lastBeginnerUpdate = [...roots].reverse().find((u) => beginners.some((b) => b.user_id === u.author_id));
  const openQuestion = [...roots].reverse().find((u) => u.question && !(repliesByParent.get(u.id) ?? []).some((r) => r.author_id !== u.author_id));
  const nextAction = nextRecommendedAction({
    status: journey.status,
    isMentor,
    updateFrequency: journey.update_frequency,
    lastBeginnerUpdateAt: lastBeginnerUpdate?.created_at ?? null,
    openQuestion: openQuestion?.question ? { askerName: displayName(openQuestion.author), question: openQuestion.question } : null,
    currentMilestone: current ? { title: current.title, description: current.description } : null,
  });

  const allAgreedInPerson = participants.filter((p) => !p.left_at).every((p) => p.in_person_ok);

  return (
    <JourneyShell ctx={ctx} active="journeys" wide>
      {started && (
        <p className="mb-6 flex items-center gap-2 rounded-2xl bg-accent-soft px-4 py-3 text-sm font-medium text-accent animate-[gj-rise_500ms_ease-out] motion-reduce:animate-none">
          <Sparkles className="h-4 w-4" /> Your {config.terms.journey} has begun. Say hello and agree your first step together.
        </p>
      )}
      {journey.status === "completed" && (
        <Link href={`${ctx.basePath}/journeys/${journey.id}/celebrate`} className="mb-6 flex items-center gap-2 rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground">
          <PartyPopper className="h-4 w-4" /> {config.completion.title} Open the celebration →
        </Link>
      )}
      {journey.status === "ended" && (
        <p className="mb-6 rounded-2xl bg-muted px-4 py-3 text-sm text-foreground">
          This journey was ended {journey.ended_at ? formatRelativeTime(journey.ended_at) : ""}.{journey.end_reason ? ` “${journey.end_reason}”` : ""}
        </p>
      )}

      {/* Header */}
      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <JourneyImage src={journey.cover_image_url} alt={`${journey.title} cover`} aspect="aspect-[16/9]" priority sizes="(min-width: 1024px) 55vw, 100vw" />
        <div className="flex flex-col justify-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            {journey.is_group ? "Group journey" : config.terms.journey}
            {journey.subject ? ` · ${journey.subject}` : ""}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{journey.title}</h1>
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-4 w-4" /> Week {weeksIn + 1}
            </span>
            {journey.duration_label && (
              <span className="inline-flex items-center gap-1">
                <Clock className="h-4 w-4" /> {journey.duration_label}
              </span>
            )}
            <span>Check-ins: {journey.update_frequency}</span>
          </p>
          <div className="mt-5 flex flex-wrap gap-4">
            {mentor && <Person profile={mentor.profile} role={`${config.terms.mentor[0].toUpperCase()}${config.terms.mentor.slice(1)} · ${mentorProfile ? mentorLevelLabel(mentorProfile.level, config) : ""}`} verified={mentorProfile?.is_verified} />}
            {beginners.map((b) => (
              <Person key={b.id} profile={b.profile} role={`${config.terms.beginner[0].toUpperCase()}${config.terms.beginner.slice(1)}`} />
            ))}
          </div>
          <div className="mt-5 rounded-2xl border border-accent/30 bg-accent-soft p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">Next</p>
            <p className="mt-1 text-sm font-medium text-foreground">{nextAction}</p>
          </div>
        </div>
      </section>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_22rem]">
        {/* Main column: updates */}
        <div className="min-w-0">
          {canWrite && journey.status === "active" && (
            <section className="rounded-3xl border border-border bg-card p-5 sm:p-6" aria-labelledby="gj-compose">
              <h2 id="gj-compose" className="text-lg font-semibold text-foreground">
                {isMentor ? "Share a tip or check in" : "Share your progress"}
              </h2>
              <p className="mb-4 text-xs text-muted-foreground">
                {isMentor
                  ? `Replies notify your ${config.terms.beginner}. A weekly check-in is plenty — no need to be always on.`
                  : `Your ${config.terms.mentor} gets a notification. One update ${journey.update_frequency} is the rhythm you agreed.`}
              </p>
              <UpdateComposer
                journeyId={journey.id}
                communitySlug={ctx.community.slug}
                spaceSlug={ctx.space.slug}
                userId={ctx.userId}
                milestones={milestones}
                config={config}
                isMentor={isMentor}
              />
            </section>
          )}

          <section className="mt-8" aria-labelledby="gj-updates">
            <h2 id="gj-updates" className="text-xl font-semibold text-foreground">
              Updates
            </h2>
            {roots.length === 0 ? (
              <p className="mt-3 rounded-2xl border border-dashed border-border bg-card p-5 text-sm text-muted-foreground">
                Nothing yet. The first update is often just a photo of where you&apos;re starting.
              </p>
            ) : (
              <ol className="mt-4 space-y-5">
                {[...roots].reverse().map((u) => {
                  const milestone = milestones.find((m) => m.id === u.milestone_id);
                  return (
                    <li key={u.id} className="rounded-3xl border border-border bg-card p-5">
                      <UpdateBody update={u} milestoneTitle={milestone?.title} />
                      {(repliesByParent.get(u.id) ?? []).map((r) => (
                        <div key={r.id} className="mt-4 border-l-2 border-accent/40 pl-4">
                          <UpdateBody update={r} compact />
                          {ctx.isStaff && <ModerateButton updateId={r.id} hidden={r.is_hidden} {...hidden} />}
                        </div>
                      ))}
                      <div className="mt-4 flex flex-wrap items-center gap-4">
                        {canWrite && <ReplyForm journeyId={journey.id} parentId={u.id} communitySlug={ctx.community.slug} spaceSlug={ctx.space.slug} userId={ctx.userId!} />}
                        {u.author_id !== ctx.userId && (
                          <SafetyMenu
                            communitySlug={ctx.community.slug}
                            spaceSlug={ctx.space.slug}
                            spaceId={ctx.space.id}
                            personId={u.author_id}
                            personName={displayName(u.author)}
                            journeyId={journey.id}
                            updateId={u.id}
                            allowBlock={false}
                          />
                        )}
                        {ctx.isStaff && <ModerateButton updateId={u.id} hidden={u.is_hidden} {...hidden} />}
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </section>

          {allPhotos.length > 0 && (
            <section className="mt-10" aria-labelledby="gj-photos">
              <h2 id="gj-photos" className="text-xl font-semibold text-foreground">
                Photo gallery
              </h2>
              <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                {allPhotos.map((p) => (
                  <li key={p.url}>
                    <a href={p.url} target="_blank" rel="noreferrer" className="block">
                      <JourneyImage src={p.url} alt={`Photo by ${p.by}, ${formatRelativeTime(p.at)}`} aspect="aspect-square" rounded="rounded-xl" />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Side column */}
        <aside className="space-y-5">
          <section className="rounded-3xl border border-border bg-card p-5" aria-labelledby="gj-milestones">
            <h2 id="gj-milestones" className="mb-3 text-lg font-semibold text-foreground">
              Milestones
            </h2>
            <MilestoneList milestones={milestones} journeyId={journey.id} communitySlug={ctx.community.slug} spaceSlug={ctx.space.slug} canEdit={canWrite} />
          </section>

          {me && journey.status !== "ended" && (
            <section className="space-y-4 rounded-3xl border border-border bg-card p-5">
              {others.map((p) => (
                <div key={p.id} className="flex items-start gap-3">
                  <Avatar src={p.profile.avatar_url} name={displayName(p.profile)} size={32} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{displayName(p.profile)}</p>
                    <SafetyMenu
                      communitySlug={ctx.community.slug}
                      spaceSlug={ctx.space.slug}
                      spaceId={ctx.space.id}
                      personId={p.user_id}
                      personName={displayName(p.profile)}
                      journeyId={journey.id}
                      allowMessage
                      className="mt-1"
                    />
                  </div>
                </div>
              ))}
              <div className="border-t border-border pt-4">
                <InPersonToggle
                  journeyId={journey.id}
                  communitySlug={ctx.community.slug}
                  spaceSlug={ctx.space.slug}
                  mine={me.in_person_ok}
                  allAgreed={allAgreedInPerson}
                  note={config.safety.inPersonNote}
                />
              </div>
            </section>
          )}

          {me && journey.status === "active" && (
            <>
              <details className="rounded-3xl border border-border bg-card p-5">
                <summary className="cursor-pointer text-sm font-semibold text-foreground">Journey settings</summary>
                <div className="mt-4">
                  <JourneySettingsForm journey={journey} communitySlug={ctx.community.slug} spaceSlug={ctx.space.slug} userId={ctx.userId} />
                </div>
              </details>
              {!(journey.is_group && !isMentor) && (
                <details className="rounded-3xl border border-accent/40 bg-accent-soft p-5" open={milestones.length > 0 && doneCount === milestones.length}>
                  <summary className="cursor-pointer text-sm font-semibold text-accent">Complete the journey</summary>
                  <div className="mt-4">
                    <CompleteJourneyForm journeyId={journey.id} communitySlug={ctx.community.slug} spaceSlug={ctx.space.slug} isMentor={isMentor} config={config} />
                  </div>
                </details>
              )}
              <details className="rounded-3xl border border-border bg-card p-5">
                <summary className="cursor-pointer text-sm font-medium text-muted-foreground">
                  {journey.is_group && !isMentor ? "Leave this journey" : "End this journey"}
                </summary>
                <div className="mt-4">
                  <EndJourneyForm journeyId={journey.id} communitySlug={ctx.community.slug} spaceSlug={ctx.space.slug} isGroupBeginner={journey.is_group && !isMentor} />
                </div>
              </details>
            </>
          )}

          {!me && ctx.isStaff && (
            <p className="rounded-2xl bg-muted p-4 text-xs text-muted-foreground">You&apos;re viewing this journey as community staff, for moderation.</p>
          )}

          <SafetyNote ctx={ctx} />
          {journey.status === "completed" && (
            <LinkButton href={`${ctx.basePath}/journeys/${journey.id}/celebrate`} className="w-full rounded-full">
              Open the celebration
            </LinkButton>
          )}
        </aside>
      </div>
    </JourneyShell>
  );
}

function Person({ profile, role, verified }: { profile: { avatar_url: string | null; full_name: string | null; username: string }; role: string; verified?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <Avatar src={profile.avatar_url} name={profile.full_name || profile.username} size={40} />
      <div>
        <p className="flex items-center gap-1 text-sm font-semibold text-foreground">
          {profile.full_name || profile.username}
          {verified && <BadgeCheck className="h-4 w-4 text-accent" aria-label="Verified by staff" />}
        </p>
        <p className="text-xs text-muted-foreground">{role}</p>
      </div>
    </div>
  );
}

function UpdateBody({ update, milestoneTitle, compact = false }: { update: UpdateWithAuthor; milestoneTitle?: string; compact?: boolean }) {
  const name = displayName(update.author);
  return (
    <div className={update.is_hidden ? "opacity-50" : undefined}>
      <div className="flex items-center gap-2.5">
        <Avatar src={update.author?.avatar_url} name={name} size={compact ? 26 : 34} />
        <p className="text-sm">
          <span className="font-semibold text-foreground">{name}</span>{" "}
          <span className="text-muted-foreground">· {formatRelativeTime(update.created_at)}</span>
          {update.is_hidden && <span className="ml-2 text-xs text-danger">Hidden by staff</span>}
        </p>
      </div>
      {milestoneTitle && <p className="mt-2 inline-block rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">{milestoneTitle}</p>}
      {update.body && <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground">{update.body}</p>}
      {update.question && (
        <p className="mt-3 flex items-start gap-2 rounded-2xl bg-muted/80 p-3 text-sm text-foreground">
          <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {update.question}
        </p>
      )}
      {update.problems && (
        <p className="mt-2 flex items-start gap-2 text-sm text-foreground">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-danger" /> {update.problems}
        </p>
      )}
      {update.photos.length > 0 && (
        <div className={`mt-3 grid gap-2 ${update.photos.length === 1 ? "grid-cols-1" : "grid-cols-2 sm:grid-cols-3"}`}>
          {update.photos.map((url) => (
            <JourneyImage key={url} src={url} alt={`Photo from ${name}`} aspect={update.photos.length === 1 ? "aspect-[4/3]" : "aspect-square"} rounded="rounded-xl" sizes="(min-width: 1024px) 30vw, 50vw" />
          ))}
        </div>
      )}
    </div>
  );
}

function ModerateButton({ updateId, hidden, community_slug, space_slug }: { updateId: string; hidden: boolean; community_slug: string; space_slug: string }) {
  return (
    <form action={moderateUpdate} className="inline">
      <input type="hidden" name="community_slug" value={community_slug} />
      <input type="hidden" name="space_slug" value={space_slug} />
      <input type="hidden" name="update_id" value={updateId} />
      <input type="hidden" name="hide" value={hidden ? "false" : "true"} />
      <button type="submit" className="text-xs text-muted-foreground hover:text-danger">
        {hidden ? "Unhide (staff)" : "Hide (staff)"}
      </button>
    </form>
  );
}
