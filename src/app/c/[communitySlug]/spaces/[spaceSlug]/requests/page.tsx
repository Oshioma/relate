import Link from "next/link";
import { BadgeCheck, Hourglass, Inbox, PauseCircle, PlayCircle } from "lucide-react";
import { loadGuidedJourneyPage } from "@/lib/data/guided-journey-page";
import {
  displayName,
  getJourneyTemplates,
  getMyJourneyProfiles,
  getMyJourneys,
  getRequesterProfiles,
  getRequestsForUser,
  getSpaceMentors,
  getWaitingBeginners,
} from "@/lib/data/guided-journey";
import { optionLabel, mentorLevelLabel, HELP_MODE_OPTIONS } from "@/lib/guided-journey/config";
import { setMentorPaused, withdrawRequest } from "../journey-actions";
import { JourneyGate, JourneyShell } from "@/components/guided-journey/journey-shell";
import { RequestResponse } from "@/components/guided-journey/request-response";
import { GroupJourneyForm } from "@/components/guided-journey/group-journey-form";
import { JourneyImage } from "@/components/guided-journey/journey-image";
import { SafetyMenu } from "@/components/guided-journey/safety-menu";
import { WaitingBeginnerCard } from "@/components/guided-journey/waiting-list";
import { Avatar } from "@/components/ui/avatar";
import { LinkButton } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = { pending: "Waiting for a reply", accepted: "Accepted", declined: "Declined", withdrawn: "Withdrawn" };

export default async function RequestsPage({
  params,
  searchParams,
}: {
  params: Promise<{ communitySlug: string; spaceSlug: string }>;
  searchParams: Promise<{ mentor?: string }>;
}) {
  const ctx = await loadGuidedJourneyPage(params);
  const { mentor: justJoined } = await searchParams;
  const { config } = ctx;
  if (!ctx.isMember || !ctx.userId) {
    return (
      <JourneyShell ctx={ctx} active="requests" title="Requests">
        <JourneyGate ctx={ctx} next={`${ctx.basePath}/requests`} />
      </JourneyShell>
    );
  }

  const [{ mentor, beginner }, requests, journeys, templates] = await Promise.all([
    getMyJourneyProfiles(ctx.supabase, ctx.space.id, ctx.userId),
    getRequestsForUser(ctx.supabase, ctx.space.id, ctx.userId),
    getMyJourneys(ctx.supabase, ctx.space.id, ctx.userId),
    getJourneyTemplates(ctx.supabase, ctx.space.id),
  ]);
  const pendingIncoming = requests.incoming.filter((r) => r.status === "pending");
  // Waiting on my answer as a mentor (a beginner asked) / as a beginner (a mentor offered).
  const asksToMe = pendingIncoming.filter((r) => r.initiated_by === "beginner");
  const offersToMe = pendingIncoming.filter((r) => r.initiated_by === "mentor");
  const requesterProfiles = await getRequesterProfiles(ctx.supabase, ctx.space.id, asksToMe.map((r) => r.beginner_id));
  const canSeeWaitingList = (mentor?.status === "active") || ctx.isStaff;
  const [waiting, offeringMentors] = await Promise.all([
    canSeeWaitingList ? getWaitingBeginners(ctx.supabase, ctx.space.id) : Promise.resolve([]),
    offersToMe.length > 0 ? getSpaceMentors(ctx.supabase, ctx.space.id) : Promise.resolve([]),
  ]);
  const mentorByUser = new Map(offeringMentors.map((m) => [m.user_id, m]));
  const canOffer = mentor?.status === "active" && !mentor.is_paused;
  // A beginner with a profile, no active journey and nothing pending is on the list.
  const hasActiveBeginnerJourney = journeys.some((j) => j.role === "beginner" && j.status === "active");
  const beginnerWaiting =
    Boolean(beginner) && !hasActiveBeginnerJourney && !requests.outgoing.some((r) => r.status === "pending") && offersToMe.length === 0;
  const activeAsMentor = journeys.filter((j) => j.role === "mentor" && j.status === "active");
  const myGroups = activeAsMentor.filter((j) => j.is_group).map((j) => ({ id: j.id, title: j.title }));
  // Beginners currently supported, counted the same way as the database's capacity check.
  const { data: activeCount } = mentor ? await ctx.supabase.rpc("mentor_active_beginner_count", { p_space_id: ctx.space.id, p_mentor_id: ctx.userId }) : { data: 0 };
  const hidden = { community_slug: ctx.community.slug, space_slug: ctx.space.slug };

  return (
    <JourneyShell ctx={ctx} active="requests" title="Requests" wide={canSeeWaitingList} intro={justJoined ? `You're now listed as a ${config.terms.mentor}. Requests will appear here — and in your notifications.` : undefined}>
      {beginnerWaiting && beginner && (
        <section className="mb-10 flex flex-wrap items-start gap-4 rounded-3xl border border-accent/30 bg-accent-soft p-5 sm:p-6">
          <Hourglass className="mt-0.5 h-6 w-6 shrink-0 text-accent" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-foreground">You&apos;re on the list — waiting for a {config.terms.mentor}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {beginner.listed_for_offers
                ? `${config.terms.mentors.charAt(0).toUpperCase()}${config.terms.mentors.slice(1)} can see you're looking and offer to help — you'll get a notification, and nothing starts unless you accept. We'll also tell you when a ${config.terms.mentor} who suits you joins.`
                : `You've chosen not to appear on the waiting list, so ${config.terms.mentors} can't offer to help. We'll still tell you when a ${config.terms.mentor} who suits you joins.`}
            </p>
            <p className="mt-3 flex flex-wrap gap-4 text-sm">
              <Link href={`${ctx.basePath}/mentors`} className="font-semibold text-accent hover:underline">
                See available {config.terms.mentors}
              </Link>
              <Link href={`${ctx.basePath}/join/beginner`} className="font-semibold text-accent hover:underline">
                Edit your answers
              </Link>
            </p>
          </div>
        </section>
      )}

      {offersToMe.length > 0 && (
        <section aria-labelledby="gj-offers" className="mb-12">
          <h2 id="gj-offers" className="text-xl font-semibold text-foreground">
            Offers to help you
          </h2>
          <div className="mt-4 space-y-4">
            {offersToMe.map((r) => {
              const mp = mentorByUser.get(r.mentor_id);
              const name = displayName(r.mentor);
              return (
                <article key={r.id} className="rounded-3xl border border-accent/30 bg-card p-5 sm:p-6">
                  <div className="grid gap-5 md:grid-cols-[1fr_16rem]">
                    <div>
                      <div className="flex items-center gap-3">
                        <Avatar src={r.mentor?.avatar_url} name={name} size={44} />
                        <div>
                          <p className="flex items-center gap-1 font-semibold text-foreground">
                            {name}
                            {mp?.is_verified && <BadgeCheck className="h-4 w-4 text-accent" aria-label="Verified by staff" />}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {mp ? mentorLevelLabel(mp.level, config) : config.terms.mentor} · offered {formatRelativeTime(r.created_at)}
                            {r.template ? ` · suggests ${r.template.title}` : ""}
                          </p>
                        </div>
                      </div>
                      {r.message && <p className="mt-4 whitespace-pre-line rounded-2xl bg-muted/70 p-4 text-sm text-foreground">{r.message}</p>}
                      {mp?.intro && <p className="mt-3 text-sm text-muted-foreground">{mp.intro}</p>}
                      {mp && (
                        <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                          <Answer label="Region" value={[mp.region, mp.country].filter(Boolean).join(", ")} />
                          <Answer label="Helps with" value={[...mp.experience.map((v) => optionLabel(config.questions.interests.options, v)), ...mp.preferred_topics].join(", ")} />
                          <Answer label="Languages" value={mp.languages.join(", ")} />
                          <Answer label="Availability" value={mp.availability} />
                        </dl>
                      )}
                      <SafetyMenu
                        communitySlug={ctx.community.slug}
                        spaceSlug={ctx.space.slug}
                        spaceId={ctx.space.id}
                        personId={r.mentor_id}
                        personName={name}
                        allowMessage
                        className="mt-4"
                      />
                    </div>
                    <div>
                      <RequestResponse
                        requestId={r.id}
                        communitySlug={ctx.community.slug}
                        spaceSlug={ctx.space.slug}
                        groupJourneys={[]}
                        presetGroupJourneyId={null}
                        beginnerName={name.split(" ")[0]}
                      />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {mentor && (
        <section className="mb-10 rounded-3xl border border-border bg-card p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Supporting {activeCount ?? 0} of {mentor.capacity} {mentor.capacity === 1 ? config.terms.beginner : config.terms.beginners}
              </p>
              <p className="text-xs text-muted-foreground">
                {mentor.status === "suspended"
                  ? "Your profile is paused by the community team."
                  : mentor.is_paused
                    ? "Paused — you won't appear in suggestions or get new requests."
                    : "You appear in suggestions while you have free places."}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <form action={setMentorPaused}>
                <input type="hidden" name="community_slug" value={ctx.community.slug} />
                <input type="hidden" name="space_slug" value={ctx.space.slug} />
                <input type="hidden" name="paused" value={mentor.is_paused ? "false" : "true"} />
                <button type="submit" className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:border-accent">
                  {mentor.is_paused ? <PlayCircle className="h-4 w-4 text-accent" /> : <PauseCircle className="h-4 w-4" />}
                  {mentor.is_paused ? "Start accepting again" : "Pause new requests"}
                </button>
              </form>
              <LinkButton href={`${ctx.basePath}/join/mentor`} variant="secondary" className="rounded-full">
                Edit profile
              </LinkButton>
            </div>
          </div>
          {mentor.group_mentoring && mentor.status === "active" && (
            <details className="group mt-5 border-t border-border pt-4">
              <summary className="cursor-pointer text-sm font-semibold text-accent">Open a group journey</summary>
              <div className="mt-4">
                <GroupJourneyForm communitySlug={ctx.community.slug} spaceSlug={ctx.space.slug} spaceId={ctx.space.id} templates={templates} capacity={mentor.capacity} />
              </div>
            </details>
          )}
        </section>
      )}

      {mentor && (
        <section aria-labelledby="gj-incoming" className="mb-12">
          <h2 id="gj-incoming" className="text-xl font-semibold text-foreground">
            Asking for your help
          </h2>
          {asksToMe.length === 0 ? (
            <p className="mt-3 flex items-center gap-2 rounded-2xl border border-dashed border-border bg-card p-5 text-sm text-muted-foreground">
              <Inbox className="h-4 w-4" /> No requests waiting. We&apos;ll notify you when someone asks.
            </p>
          ) : (
            <div className="mt-4 space-y-4">
              {asksToMe.map((r) => {
                const bp = requesterProfiles.get(r.beginner_id);
                const name = displayName(r.beginner);
                return (
                  <article key={r.id} className="rounded-3xl border border-accent/30 bg-card p-5 sm:p-6">
                    <div className="grid gap-5 md:grid-cols-[1fr_16rem]">
                      <div>
                        <div className="flex items-center gap-3">
                          <Avatar src={r.beginner?.avatar_url} name={name} size={44} />
                          <div>
                            <p className="font-semibold text-foreground">{name}</p>
                            <p className="text-xs text-muted-foreground">
                              Asked {formatRelativeTime(r.created_at)}
                              {r.template ? ` · ${r.template.title}` : ""}
                              {r.requested_journey_id ? " · wants to join your group" : ""}
                            </p>
                          </div>
                        </div>
                        {r.message && <p className="mt-4 whitespace-pre-line rounded-2xl bg-muted/70 p-4 text-sm text-foreground">{r.message}</p>}
                        {bp && (
                          <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                            <Answer label={config.questions.location.label} value={[bp.region, bp.country].filter(Boolean).join(", ")} />
                            <Answer label={config.questions.setting.label} value={bp.setting.map((v) => optionLabel(config.questions.setting.options, v)).join(", ")} />
                            <Answer label={config.questions.interests.label} value={bp.interests.map((v) => optionLabel(config.questions.interests.options, v)).join(", ")} />
                            <Answer label={config.questions.experience.label} value={optionLabel(config.questions.experience.options, bp.experience)} />
                            <Answer label={config.questions.helpMode.label} value={optionLabel(HELP_MODE_OPTIONS, bp.help_mode)} />
                            <Answer label="Languages" value={bp.languages.join(", ")} />
                            {bp.notes && <Answer label="Notes" value={bp.notes} />}
                          </dl>
                        )}
                        <SafetyMenu
                          communitySlug={ctx.community.slug}
                          spaceSlug={ctx.space.slug}
                          spaceId={ctx.space.id}
                          personId={r.beginner_id}
                          personName={name}
                          allowMessage
                          className="mt-4"
                        />
                      </div>
                      <div>
                        {bp?.space_photo_url && <JourneyImage src={bp.space_photo_url} alt={`${name}'s growing space`} className="mb-4" sizes="16rem" />}
                        <RequestResponse
                          requestId={r.id}
                          communitySlug={ctx.community.slug}
                          spaceSlug={ctx.space.slug}
                          groupJourneys={myGroups}
                          presetGroupJourneyId={r.requested_journey_id}
                          beginnerName={name.split(" ")[0]}
                        />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}

      {canSeeWaitingList && (
        <section aria-labelledby="gj-waiting" className="mb-12">
          <h2 id="gj-waiting" className="text-xl font-semibold text-foreground">
            {config.terms.beginners.charAt(0).toUpperCase() + config.terms.beginners.slice(1)} looking for a {config.terms.mentor}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {canOffer
              ? `People who've signed up and are still waiting. Offer to help — they decide whether to accept.`
              : mentor
                ? `Your profile is paused, so you can't send offers right now.`
                : `Staff view: people who've signed up and are still waiting.`}
          </p>
          {waiting.length === 0 ? (
            <p className="mt-3 rounded-2xl border border-dashed border-border bg-card p-5 text-sm text-muted-foreground">Nobody is waiting right now.</p>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {waiting.map((b) => (
                <WaitingBeginnerCard
                  key={b.user_id}
                  beginner={b}
                  config={config}
                  templates={templates}
                  communitySlug={ctx.community.slug}
                  spaceSlug={ctx.space.slug}
                  canOffer={Boolean(canOffer)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      <section aria-labelledby="gj-outgoing">
        <h2 id="gj-outgoing" className="text-xl font-semibold text-foreground">
          Your requests and offers
        </h2>
        {requests.outgoing.length === 0 ? (
          <p className="mt-3 rounded-2xl border border-dashed border-border bg-card p-5 text-sm text-muted-foreground">
            You haven&apos;t asked anyone yet.{" "}
            <Link href={`${ctx.basePath}/mentors`} className="font-semibold text-accent hover:underline">
              {config.beginnerCard.button}
            </Link>
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-border rounded-3xl border border-border bg-card">
            {requests.outgoing.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div className="flex items-center gap-3">
                  <Avatar src={(r.initiated_by === "mentor" ? r.beginner : r.mentor)?.avatar_url} name={displayName(r.initiated_by === "mentor" ? r.beginner : r.mentor)} size={36} />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {r.initiated_by === "mentor" ? "You offered to help " : "You asked "}
                      {displayName(r.initiated_by === "mentor" ? r.beginner : r.mentor)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {STATUS_LABEL[r.status]} · {formatRelativeTime(r.responded_at ?? r.created_at)}
                    </p>
                    {r.response_message && <p className="mt-1 text-xs italic text-muted-foreground">&ldquo;{r.response_message}&rdquo;</p>}
                  </div>
                </div>
                {r.status === "pending" && (
                  <form action={withdrawRequest}>
                    <input type="hidden" name="community_slug" value={hidden.community_slug} />
                    <input type="hidden" name="space_slug" value={hidden.space_slug} />
                    <input type="hidden" name="request_id" value={r.id} />
                    <button type="submit" className="text-xs font-medium text-muted-foreground hover:text-danger">
                      Withdraw
                    </button>
                  </form>
                )}
                {r.status === "accepted" && r.journey_id && (
                  <LinkButton href={`${ctx.basePath}/journeys/${r.journey_id}`} size="sm" className="rounded-full">
                    Open journey
                  </LinkButton>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {!mentor && (
        <p className="mt-10 text-sm text-muted-foreground">
          Know your stuff?{" "}
          <Link href={`${ctx.basePath}/join/mentor`} className="font-semibold text-accent hover:underline">
            {config.mentorCard.button}
          </Link>
        </p>
      )}
    </JourneyShell>
  );
}

function Answer({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-foreground">{value}</dd>
    </div>
  );
}
