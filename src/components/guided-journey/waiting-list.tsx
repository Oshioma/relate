"use client";

import { useState } from "react";
import { ChevronDown, Clock, MapPin } from "lucide-react";
import { offerHelp } from "@/app/c/[communitySlug]/spaces/[spaceSlug]/journey-actions";
import { HELP_MODE_OPTIONS, optionLabel, type GuidedJourneyConfig } from "@/lib/guided-journey/config";
import type { WaitingBeginner } from "@/lib/data/guided-journey";
import type { JourneyTemplate } from "@/types/database";
import { Avatar } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/input";
import { DraftForm, Field } from "./draft-form";
import { cn, formatRelativeTime } from "@/lib/utils";

// One beginner on the waiting list, as a mentor (or staff) sees them: their
// answers, how long they've waited, and — for mentors — an "Offer to help"
// form. The offer only proposes; the beginner accepts or declines.
export function WaitingBeginnerCard({
  beginner,
  config,
  templates,
  communitySlug,
  spaceSlug,
  canOffer,
}: {
  beginner: WaitingBeginner;
  config: GuidedJourneyConfig;
  templates: JourneyTemplate[];
  communitySlug: string;
  spaceSlug: string;
  canOffer: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const name = beginner.full_name || beginner.username;
  const q = config.questions;
  const facts = [
    beginner.interests.length > 0 && { label: q.interests.label, value: beginner.interests.map((v) => optionLabel(q.interests.options, v)).join(", ") },
    beginner.setting.length > 0 && { label: q.setting.label, value: beginner.setting.map((v) => optionLabel(q.setting.options, v)).join(", ") },
    beginner.experience && { label: q.experience.label, value: optionLabel(q.experience.options, beginner.experience) },
    { label: q.helpMode.label, value: optionLabel(HELP_MODE_OPTIONS, beginner.help_mode) },
    beginner.languages.length > 0 && { label: "Languages", value: beginner.languages.join(", ") },
  ].filter((f): f is { label: string; value: string } => Boolean(f));

  return (
    <article className="flex h-full flex-col rounded-3xl border border-border bg-card p-5">
      <div className="flex items-center gap-3">
        <Avatar src={beginner.avatar_url} name={name} size={44} />
        <div className="min-w-0">
          <p className="font-semibold text-foreground">{name}</p>
          <p className="flex flex-wrap gap-x-3 text-xs text-muted-foreground">
            {(beginner.region || beginner.country) && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {[beginner.region, beginner.country].filter(Boolean).join(", ")}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              Waiting since {formatRelativeTime(beginner.waiting_since)}
            </span>
          </p>
        </div>
      </div>
      <dl className="mt-4 space-y-2 text-sm">
        {facts.map((f) => (
          <div key={f.label}>
            <dt className="text-xs text-muted-foreground">{f.label}</dt>
            <dd className="text-foreground">{f.value}</dd>
          </div>
        ))}
      </dl>
      {canOffer && (
        <div className="mt-auto pt-5">
          {sent ? (
            <p className="rounded-full bg-accent-soft px-4 py-2 text-center text-sm font-medium text-accent">Offer sent — waiting for their answer</p>
          ) : (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
            >
              Offer to help
              <ChevronDown className={cn("h-4 w-4 transition-transform motion-reduce:transition-none", open && "rotate-180")} />
            </button>
          )}
          {open && !sent && (
          <div className="pt-4 animate-[gj-rise_300ms_ease-out] motion-reduce:animate-none">
            <DraftForm
              action={offerHelp}
              draftKey={`journey-offer:${beginner.user_id}`}
              hidden={{ community_slug: communitySlug, space_slug: spaceSlug, beginner_id: beginner.user_id }}
              submitLabel="Send offer"
              pendingLabel="Sending…"
              submitClassName="w-full"
              className="space-y-3"
              onSuccess={() => setSent(true)}
            >
              {templates.length > 0 && (
                <Field label="Suggest a starting point" htmlFor={`offer-tpl-${beginner.user_id}`}>
                  <select
                    id={`offer-tpl-${beginner.user_id}`}
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
              <Textarea name="message" rows={3} placeholder={`Say hello — why you'd enjoy helping ${name.split(" ")[0]}.`} aria-label="Message" />
              <p className="text-xs text-muted-foreground">They&apos;ll see your {config.terms.mentor} profile and decide. Nothing starts unless they accept.</p>
            </DraftForm>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
