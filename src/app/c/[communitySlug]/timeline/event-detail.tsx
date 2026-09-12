"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Check, MapPin, Pencil, Scale, Sparkles, Trash2, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RichText } from "@/components/ui/rich-text";
import { cn } from "@/lib/utils";
import type {
  TimelineClaimSource,
  TimelineDateClaim,
  TimelineEventLink,
  TimelineSource,
  TimelineTrack,
} from "@/types/database";
import type { TimelineEventWithClaims, TimelineLinkedRecord } from "@/lib/data/timeline";
import { DateClaimCard } from "./date-claim-card";
import { AddClaimForm } from "./add-claim-form";
import { EditEventFlow } from "./edit-event-flow";
import { RevisionHistory } from "./revision-history";
import { ViewpointComparison } from "./viewpoint-comparison";
import { RelatedRecords } from "./related-records";
import { deleteTimelineEvent, reviewTimelineEvent } from "./actions";
import {
  eventTypeHint,
  eventTypeLabel,
  groupMotifs,
  timelineCategory,
  timelineCategoryLabel,
} from "@/lib/timeline/taxonomy";
import {
  claimMidpoint,
  claimsDisagree,
  compareClaims,
  describeComparison,
  eventDateLabel,
  formatClaimDate,
  presentPosition,
} from "@/lib/timeline/time";

// The event, opened up.
//
// The order says what the feature is for: what happened, then WHEN DIFFERENT
// PEOPLE SAY IT HAPPENED, each with its source. The dates are not a field in a
// sidebar — they are the body of the page.

/**
 * The claims split by WHAT THEY DATE, in the order they first appear.
 *
 * A claim that does not say what it dates is grouped under no subject rather
 * than under a made-up one — on a record where the others do say, "this one
 * didn't specify" is the honest rendering, and inventing a heading for it
 * would assert something nobody wrote.
 */
function groupBySubject(claims: TimelineDateClaim[]): Map<string, { subject: string | null; claims: TimelineDateClaim[] }> {
  const groups = new Map<string, { subject: string | null; claims: TimelineDateClaim[] }>();
  for (const claim of claims) {
    const subject = claim.what_is_dated?.trim() || null;
    const key = subject ?? "";
    const group = groups.get(key);
    if (group) group.claims.push(claim);
    else groups.set(key, { subject, claims: [claim] });
  }
  return groups;
}

export function EventDetail({
  event,
  sources,
  citations = [],
  links = [],
  linkedRecords = [],
  tracks = [],
  userId = null,
  communitySlug,
  canContribute,
  isStaff,
  onShowContext,
  onClose,
  onSaved,
}: {
  event: TimelineEventWithClaims;
  sources: TimelineSource[];
  /** Every extra claim→source link in the community; filtered per claim below. */
  citations?: TimelineClaimSource[];
  /** Asserted relationships between records; the ones touching this event are picked out below. */
  links?: TimelineEventLink[];
  /** The records at the far ends of those edges — usually outside the visible window. */
  linkedRecords?: TimelineLinkedRecord[];
  tracks?: TimelineTrack[];
  userId?: string | null;
  communitySlug: string;
  canContribute: boolean;
  isStaff: boolean;
  /** Jump the timeline to this event's own stretch of time. Absent on the standalone page, which links instead. */
  onShowContext?: (from: number, to: number) => void;
  onClose?: () => void;
  /** An edit was saved. The standalone page needs nothing; the timeline reloads. */
  onSaved?: () => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<"details" | "dates" | null>(null);

  const meta = timelineCategory(event.category);
  const Icon = meta.icon;
  const sourcesById = new Map(sources.map((source) => [source.id, source]));
  const comparison = compareClaims(event.claims);
  // "Disagree" means the sources allow no common moment, or one window sits
  // inside another. Two that overlap freely have not been caught disagreeing.
  const disputed = comparison != null && (comparison.kind === "apart" || comparison.kind === "contains");
  const said = comparison ? describeComparison(comparison) : null;
  // The author may edit their own; staff may edit anything.
  const canEdit = isStaff || (userId != null && event.created_by === userId);

  // WHERE THIS EVENT SITS, for the two features that need one number: the
  // "what else was happening then?" window, and the future-event chip. Both
  // read only the claims that place themselves — an event carrying "no finite
  // beginning" alongside a measured age is positioned by the measured age, and
  // one carrying nothing but positionless claims is positioned nowhere, which
  // turns both features off rather than sending them to year zero.
  const placed = event.claims.map(claimMidpoint).filter((position): position is number => position != null);
  const midpoint = placed.length > 0 ? placed[0] : null;
  const isFuture = placed.length > 0 && Math.min(...placed) > presentPosition();

  function contextWindow(): { from: number; to: number } {
    // A window wide enough to show neighbours, scaled to the event's own age —
    // "at the same time" means a century for the Norman Conquest and fifty
    // million years for the dinosaurs.
    const at = midpoint ?? 0;
    const span = Math.max(40, Math.abs(at) * 0.02);
    return { from: at - span, to: at + span };
  }

  function review(decision: "published" | "rejected") {
    setError(null);
    startTransition(async () => {
      const result = await reviewTimelineEvent(event.id, communitySlug, decision);
      if (result && "error" in result) setError(result.error);
      else router.refresh();
    });
  }

  function remove() {
    setError(null);
    startTransition(async () => {
      const result = await deleteTimelineEvent(event.id, communitySlug);
      if (result && "error" in result) setError(result.error);
      else {
        onClose?.();
        router.refresh();
      }
    });
  }

  // The whole span every source proposes, written for a headline. Null when
  // nothing has been dated yet, which is a real state and not an error.
  const dateLabel = eventDateLabel(event.claims);
  const disagree = claimsDisagree(event.claims);

  // DO THESE CLAIMS EVEN ANSWER THE SAME QUESTION?
  //
  // Everywhere else on this timeline they do: five sources dating the Great
  // Pyramid are five answers about one building. On a record like the age of
  // the universe they do not — one claim dates the expansion of the observable
  // universe and another dates the creation of the world, and calling that
  // "sources disagree" would tell a reader they are rival measurements of one
  // quantity, which is the single most misleading thing this record could say.
  //
  // The test is the data's own: more than one distinct what_is_dated.
  const subjects = new Set(
    event.claims.map((claim) => claim.what_is_dated?.trim()).filter((subject): subject is string => Boolean(subject))
  );
  const severalSubjects = subjects.size > 1;

  // Claims that place nothing on the axis — read here or nowhere, since the
  // strip cannot show them.
  const positionlessCount = event.claims.filter((claim) => claim.start_year == null).length;

  // ONE RANGE PER SUBJECT, rather than one range across all of them.
  //
  // The single headline is right when every claim answers the same question —
  // five datings of one pyramid have one honest envelope. It is wrong here: an
  // envelope stretched from the age of cosmic expansion to a Biblical creation
  // date is a true span of two different topics, and at a glance it reads as
  // one proposed range. Splitting it gives each question its own answer and
  // costs three lines.
  //
  // Ordered oldest first, by the earliest thing each subject places, so the
  // stack still reads as a chronology. Subjects that place nothing go last:
  // they have no position to sort by, and putting them at the top would bury
  // the dates under the claims that have none.
  const subjectRows = severalSubjects
    ? [...groupBySubject(event.claims).values()]
        .map((group) => ({
          subject: group.subject,
          label: eventDateLabel(group.claims) ?? formatClaimDate(group.claims[0]),
          oldest: group.claims
            .map(claimMidpoint)
            .filter((position): position is number => position != null)
            .reduce<number | null>((lowest, position) => (lowest == null ? position : Math.min(lowest, position)), null),
        }))
        .sort((a, b) => {
          if (a.oldest == null && b.oldest == null) return 0;
          if (a.oldest == null) return 1;
          if (b.oldest == null) return -1;
          return a.oldest - b.oldest;
        })
    : [];

  return (
    <article className="pb-8">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", meta.chipClass)}>
              <Icon className="h-3.5 w-3.5" />
              {timelineCategoryLabel(event.category)}
            </span>
            {event.subcategory && (
              <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                {event.subcategory}
              </span>
            )}
            {/* WHAT KIND of record this is. Never a credibility mark — the
                tone is deliberately the same neutral chip the category uses. */}
            {eventTypeLabel(event.event_type) && (
              <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                {eventTypeLabel(event.event_type)}
              </span>
            )}
            {isFuture && (
              <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent">
                Planned or predicted — hasn&apos;t happened yet
              </span>
            )}
            {event.status === "pending" && (
              <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                Waiting for approval
              </span>
            )}
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{event.title}</h1>

          {/* WHEN — AT THE TOP, AND BIG.
              The date was reachable only by scrolling past the summary, the
              record type, the location and the whole description to the claim
              cards below. On a timeline. The first question anybody opens an
              event to answer was the last thing on the page.

              It is the ENVELOPE of every claim, not one of them chosen: where
              the sources disagree this reads "990,000 – 430,000 years ago",
              which is the honest headline and also the interesting one. The
              line underneath says so, so nobody mistakes a span of disagreement
              for a span of time the event lasted. */}
          {/* ONE LINE PER QUESTION, where the record answers more than one.
              Each row is that subject's own envelope, computed exactly the way
              the single headline is — so "the age of cosmic expansion" gets the
              span of the two Planck fits, and "whether there is a first moment"
              gets the words rather than a number. */}
          {severalSubjects && subjectRows.length > 0 && (
            <dl className="mt-3 space-y-2.5">
              {subjectRows.map((row) => (
                <div key={row.subject ?? "unstated"}>
                  <dt className="text-xl font-semibold tabular-nums tracking-tight text-foreground sm:text-2xl">
                    {row.label}
                  </dt>
                  <dd className="mt-0.5 max-w-3xl text-sm text-muted-foreground">
                    {row.subject ?? "This claim does not say what it dates."}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          {dateLabel && !severalSubjects && (
            <div className="mt-2">
              <p className="text-2xl font-semibold tabular-nums tracking-tight text-foreground sm:text-3xl">
                {dateLabel}
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
                {event.claims.length === 1
                  ? "As its one source dates it"
                  : disagree
                    ? `Everywhere its ${event.claims.length} sources put it — they disagree`
                    : `${event.claims.length} sources, in agreement`}
              </p>
            </div>
          )}

          {/* SAID IN WORDS, not left to the reader to infer from a subtitle.
              A span running from 13.8 billion years ago to 4004 BCE looks like
              a disagreement about a number until somebody says that it isn't. */}
          {severalSubjects && (
            <p className="mt-2 max-w-4xl rounded-lg border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">These are not rival answers to one question.</span> The
              dates above are {subjects.size} separate answers to {subjects.size} separate questions, not a
              disagreement about one. There is no single figure for this record because none would be true of all of
              them.
              {positionlessCount > 0 && (
                <>
                  {" "}
                  {positionlessCount === 1
                    ? "One of them places nothing on the timeline at all, which is what it asserts"
                    : `${positionlessCount} of them place nothing on the timeline at all, which is what they assert`}{" "}
                  rather than something missing.
                </>
              )}
            </p>
          )}

          {event.summary && <p className="mt-3 max-w-4xl text-[15px] text-muted-foreground">{event.summary}</p>}
          {/* WHAT THE RECORD TYPE MEANS, said out loud.
              "Mainstream / established view" on a chip is exactly the sort of
              label a reader will take for a verdict if nobody tells them
              otherwise — so the hint that goes with it, which says in as many
              words that this is the broadly accepted reading and not a
              declaration of truth, is printed rather than left in the form. */}
          {eventTypeHint(event.event_type) && (
            <p className="mt-1.5 text-sm text-muted-foreground">{eventTypeHint(event.event_type)}</p>
          )}
          {event.event_type_note && (
            <p className="mt-1.5 text-sm text-muted-foreground">{event.event_type_note}</p>
          )}
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {event.image_url && (
        <div className="mt-4 aspect-[16/9] w-full overflow-hidden rounded-xl bg-muted">
          {/* Plain <img>, like every other member-supplied picture in the
              product: these URLs are arbitrary (an upload, or a link somebody
              pasted), and next/image would need every one of those hosts
              configured. eslint-disable-next-line @next/next/no-img-element */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={event.image_url} alt="" className="h-full w-full object-cover" />
        </div>
      )}

      {(event.location_name || event.people.length > 0 || event.civilisations.length > 0) && (
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          {event.location_name && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4" /> {event.location_name}
            </span>
          )}
          {event.people.length > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-4 w-4" /> {event.people.join(", ")}
            </span>
          )}
          {event.civilisations.length > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" /> {event.civilisations.join(", ")}
            </span>
          )}
        </div>
      )}

      {/* THE PAGE IS WIDE; A LINE OF TEXT MUST NOT BE. The timeline page runs to
          110rem so the strip can use every pixel, and prose set to that width is
          unreadable — the eye loses the start of the next line coming back. The
          strip gets the width; the reading keeps its measure. */}
      {event.description && (
        <div className="mt-4 max-w-4xl">
          <RichText content={event.description} />
        </div>
      )}

      {/* THE REST OF THE PICTURES.
          The media column has been on this table since the feature shipped and
          nothing has ever drawn it — an event could carry a dozen images and a
          reader would see none of them. The caption is where attribution and
          licence live, so it is printed under every one rather than hidden in
          a tooltip: an unattributed picture is a problem, not a decoration. */}
      {event.media.length > 0 && (
        <div className="mt-5">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Images
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {event.media.map((item, index) => (
              <figure key={`${item.url}-${index}`} className="min-w-0">
                <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted">
                  {/* Plain <img> for the same reason the cover image is: these
                      URLs are arbitrary, and next/image would need every host
                      configured. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.url} alt={item.caption ?? ""} loading="lazy" className="h-full w-full object-cover" />
                </div>
                {item.caption && (
                  <figcaption className="mt-1.5 text-xs text-muted-foreground">{item.caption}</figcaption>
                )}
              </figure>
            ))}
          </div>
        </div>
      )}

      {event.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {event.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* ---- Proposed dates ------------------------------------------------ */}
      <div className="mt-8">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Proposed dates ({event.claims.length})
          </h2>
          {midpoint == null ? null : onShowContext ? (
            <button
              type="button"
              onClick={() => {
                const { from, to } = contextWindow();
                onShowContext(from, to);
              }}
              className="text-sm font-medium text-accent hover:underline"
            >
              What was happening at the same time?
            </button>
          ) : (
            <a
              href={`/c/${communitySlug}/timeline?from=${contextWindow().from}&to=${contextWindow().to}&focus=${event.slug}`}
              className="text-sm font-medium text-accent hover:underline"
            >
              What was happening at the same time?
            </a>
          )}
        </div>

        {/* What the sources actually do relative to each other — a distance
            only where there IS one. Overlapping windows are reported as
            overlapping rather than subtracted into a misleading number, and
            nothing is stated more precisely than the coarsest claim allows. */}
        {/* NOT SHOWN WHEN THE CLAIMS ARE ABOUT DIFFERENT THINGS. This banner
            says "sources disagree about when this happened" and prints the
            distance between the earliest and latest — which is exactly right
            for five datings of one pyramid, and exactly wrong here: the age of
            cosmic expansion and Ussher's creation date are not two answers
            that can be subtracted, and "13.8 billion years separates them" is
            a number with no meaning. The banner at the top of the record says
            what is actually going on instead. */}
        {comparison && comparison.kind !== "single" && said && !severalSubjects && (
          <div
            className={cn(
              "mb-4 flex gap-3 rounded-xl border p-4",
              disputed ? "border-danger/25 bg-danger/5" : "border-border bg-muted/40"
            )}
          >
            <Scale className={cn("mt-0.5 h-5 w-5 shrink-0", disputed ? "text-danger" : "text-muted-foreground")} />
            <div>
              <p className="text-sm font-semibold text-foreground">{said.headline}</p>
              {said.detail && <p className="mt-1 text-sm text-muted-foreground">{said.detail}</p>}
            </div>
          </div>
        )}

        {/* Whose account each date comes out of, grouped — the mainstream one
            beside the alternatives, with "why are these dates different?"
            underneath. It renders itself only when there is more than one
            viewpoint to compare. */}
        <ViewpointComparison claims={event.claims} sourcesById={sourcesById} />

        <div className="space-y-3">
          {event.claims.map((claim, index) => (
            <DateClaimCard
              key={claim.id}
              claim={claim}
              source={claim.source_id ? sourcesById.get(claim.source_id) ?? null : null}
              siblings={event.claims}
              sourcesById={sourcesById}
              allSources={sources}
              citations={citations.filter((citation) => citation.claim_id === claim.id)}
              communitySlug={communitySlug}
              canContribute={canContribute}
              index={index}
              onEdit={canEdit ? () => setEditing("dates") : undefined}
              onRemove={canEdit && event.claims.length > 1 ? () => setEditing("dates") : undefined}
            />
          ))}
        </div>

        {canContribute && (
          <div className="mt-4">
            <AddClaimForm communitySlug={communitySlug} eventId={event.id} claimCount={event.claims.length} />
          </div>
        )}
      </div>

      {/* ---- What the account contains ------------------------------------
          Most traditions that could be compared here share no dates at all,
          and the ones that do got them from a later chronographer. Structure
          is what can actually be compared — and every mark is something the
          CITED SOURCE contains. An absent motif means "not found in the
          source", never "absent from the tradition", which is the difference
          between a comparison and a manufactured parallel. */}
      {/* Optional-chained deliberately. The compile-time guard on EVENT_COLUMNS
          now stops a field being fetched-but-forgotten, but a detail panel is
          the wrong place to discover that a query was incomplete: a missing
          array should hide a section, not white-screen the timeline. */}
      {(event.motifs?.length ?? 0) > 0 && (
        <div className="mt-8">
          <h2 className="mb-1 text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            What this account contains
          </h2>
          <p className="mb-3 max-w-3xl text-sm text-muted-foreground">
            Marked only where the cited source has it. Nothing here is filled in from what a story is assumed to
            contain — an unmarked element means it was not found in the source, not that the tradition lacks it.
          </p>
          <div className="space-y-3">
            {groupMotifs(event.motifs ?? []).map(({ group, motifs }) => (
              <div key={group} className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
                <span className="w-24 shrink-0 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  {group}
                </span>
                <div className="flex min-w-0 flex-wrap gap-1.5">
                  {motifs.map((motif) => (
                    <span
                      key={motif.key}
                      className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                    >
                      {motif.label}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---- What else this is tied to ------------------------------------
          After the dates, deliberately. The dates are what the page is FOR;
          the relationships are the second question — and on a record like
          Sclater's Lemuria, where every date belongs to somebody's argument,
          they are how a reader finds the rest of the argument. Renders nothing
          at all when there are no edges, which is the normal state. */}
      <RelatedRecords
        eventId={event.id}
        links={links}
        records={linkedRecords}
        sources={sources}
        communitySlug={communitySlug}
      />

      {(canEdit || event.status === "pending") && (
        <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-border pt-4">
          {canEdit && (
            <Button type="button" size="sm" variant="secondary" onClick={() => setEditing("details")} disabled={pending}>
              <Pencil className="h-4 w-4" /> Edit event
            </Button>
          )}
          {isStaff && event.status === "pending" && (
            <>
              <Button type="button" size="sm" onClick={() => review("published")} disabled={pending}>
                <Check className="h-4 w-4" /> Approve
              </Button>
              <Button type="button" size="sm" variant="secondary" onClick={() => review("rejected")} disabled={pending}>
                Not this one
              </Button>
            </>
          )}
          {isStaff && (
            <Button type="button" size="sm" variant="ghost" onClick={remove} disabled={pending}>
              <Trash2 className="h-4 w-4" /> Delete event
            </Button>
          )}
        </div>
      )}

      {error && <p className="mt-3 text-sm text-danger">{error}</p>}

      {/* Staff only — RLS returns nothing to anyone else, so the panel would be
          empty rather than forbidden, and an empty "View history" is worse than
          no button. */}
      {isStaff && <RevisionHistory communitySlug={communitySlug} eventId={event.id} />}

      {editing && userId && (
        <EditEventFlow
          event={event}
          initialPane={editing}
          communitySlug={communitySlug}
          userId={userId}
          sources={sources}
          tracks={tracks}
          isStaff={isStaff}
          onClose={() => {
            setEditing(null);
            router.refresh();
          }}
          onSaved={onSaved}
        />
      )}
    </article>
  );
}
