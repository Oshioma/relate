"use client";

import { useState } from "react";
import { BadgeCheck, ChevronDown, MapPin, Sprout } from "lucide-react";
import { requestAdoption } from "@/app/c/[communitySlug]/spaces/[spaceSlug]/journey-actions";
import { mentorLevelLabel, optionLabel, type GuidedJourneyConfig } from "@/lib/guided-journey/config";
import type { MatchReason } from "@/lib/guided-journey/matching";
import type { MentorWithProfile } from "@/lib/data/guided-journey";
import type { JourneyTemplate } from "@/types/database";
import { Avatar } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/input";
import { DraftForm, Field } from "./draft-form";
import { SafetyMenu } from "./safety-menu";
import { cn } from "@/lib/utils";

export function MentorCard({
  mentor,
  reasons,
  placesLeft,
  config,
  templates,
  communitySlug,
  spaceSlug,
  spaceId,
  pendingRequest,
}: {
  mentor: MentorWithProfile;
  reasons: MatchReason[];
  placesLeft: number;
  config: GuidedJourneyConfig;
  templates: JourneyTemplate[];
  communitySlug: string;
  spaceSlug: string;
  spaceId: string;
  pendingRequest: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(pendingRequest);
  const name = mentor.profile.full_name || mentor.profile.username;
  const specialities = [
    ...mentor.experience.map((e) => optionLabel(config.questions.interests.options, e)),
    ...mentor.preferred_topics,
  ].slice(0, 6);
  const photo = mentor.photos[0];

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition duration-300 hover:-translate-y-0.5 hover:shadow-lg motion-reduce:transform-none">
      {photo && (
        <div className="relative aspect-[16/9] bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element -- member upload on Supabase storage */}
          <img src={photo} alt={`${name}'s garden`} loading="lazy" className="h-full w-full object-cover" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start gap-3">
          <div className={cn("relative z-10 shrink-0 rounded-full", photo && "-mt-10 bg-card ring-4 ring-card")}>
            <Avatar src={mentor.profile.avatar_url} name={name} size={52} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="flex flex-wrap items-center gap-1.5 text-lg font-semibold text-foreground">
              {name}
              {mentor.is_verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent" title="Verified by the community team">
                  <BadgeCheck className="h-3.5 w-3.5" /> Verified by staff
                </span>
              )}
            </h3>
            <p className="text-xs text-muted-foreground">{mentorLevelLabel(mentor.level, config)}</p>
            {(mentor.region || mentor.country) && (
              <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {[mentor.region, mentor.country].filter(Boolean).join(", ")}
                {mentor.climate ? ` · ${mentor.climate}` : ""}
              </p>
            )}
          </div>
        </div>

        {specialities.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Specialities">
            {specialities.map((s) => (
              <li key={s} className="rounded-full bg-muted px-2.5 py-1 text-xs text-foreground">
                {s}
              </li>
            ))}
          </ul>
        )}

        {mentor.intro && <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-muted-foreground">{mentor.intro}</p>}

        <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs font-medium text-accent" aria-label="Why we suggest them">
          {reasons.map((r) => (
            <li key={r.kind}>{r.text}</li>
          ))}
        </ul>
        {mentor.completedJourneys > 0 && (
          <p className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Sprout className="h-3.5 w-3.5 text-accent" />
            Has guided {mentor.completedJourneys} {mentor.completedJourneys === 1 ? config.terms.journey : `${config.terms.journey}s`} to completion here
          </p>
        )}

        <div className="mt-auto pt-5">
          {sent ? (
            <p className="rounded-full bg-accent-soft px-4 py-2 text-center text-sm font-medium text-accent">Request sent — waiting for their reply</p>
          ) : placesLeft <= 0 ? (
            <p className="rounded-full bg-muted px-4 py-2 text-center text-sm text-muted-foreground">No places right now</p>
          ) : (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
            >
              {config.terms.requestButton}
              <ChevronDown className={cn("h-4 w-4 transition-transform motion-reduce:transition-none", open && "rotate-180")} />
            </button>
          )}
          <div className={cn("grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none", open && !sent ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
            <div className="overflow-hidden">
              <div className="pt-4">
                <DraftForm
                  action={requestAdoption}
                  draftKey={`journey-request:${spaceId}:${mentor.user_id}`}
                  hidden={{ community_slug: communitySlug, space_slug: spaceSlug, mentor_id: mentor.user_id }}
                  submitLabel="Send request"
                  pendingLabel="Sending…"
                  submitClassName="w-full"
                  className="space-y-3"
                  onSuccess={() => setSent(true)}
                >
                  {templates.length > 0 && (
                    <Field label={`What would you like to ${config.category === "Gardening" ? "grow" : "start with"}?`} htmlFor={`tpl-${mentor.id}`}>
                      <select
                        id={`tpl-${mentor.id}`}
                        name="template_id"
                        defaultValue=""
                        className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="">Decide together</option>
                        {templates.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.title}
                          </option>
                        ))}
                      </select>
                    </Field>
                  )}
                  <Textarea name="message" rows={3} placeholder={`Say hello — what you'd like to do and why you chose ${name}.`} aria-label="Message" />
                  <p className="text-xs text-muted-foreground">They&apos;ll see your answers to the onboarding questions. Nothing starts unless they accept.</p>
                </DraftForm>
              </div>
            </div>
          </div>
          <SafetyMenu communitySlug={communitySlug} spaceSlug={spaceSlug} spaceId={spaceId} personId={mentor.user_id} personName={name} className="mt-4" />
        </div>
      </div>
    </article>
  );
}
