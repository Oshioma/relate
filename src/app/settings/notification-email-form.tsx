"use client";

import { useActionState } from "react";
import { updateNotificationEmailPrefs, type NotificationEmailFormState } from "./actions";
import { SubmitButton } from "@/components/ui/submit-button";
import type { NotificationEmailPrefs } from "@/lib/data/notifications";
import type { NotificationType } from "@/types/database";

const TOGGLES: { type: NotificationType; label: string; description: string }[] = [
  { type: "comment", label: "Comments on your posts", description: "When someone replies to something you posted." },
  { type: "post", label: "New posts", description: "Off by default — turn on to be emailed for every post shared in your communities." },
  { type: "membership", label: "Membership updates", description: "When you join a community or your role changes." },
  { type: "claim", label: "Business listing claims", description: "Claims to review as staff, and decisions on claims you've made." },
  { type: "live_event", label: "Live events scheduled", description: "When a host schedules a new live video event in one of your communities." },
  { type: "live_started", label: "Live events starting", description: "When a live video event goes live and you can join." },
  { type: "live_reminder", label: "Live event reminders", description: "A heads-up shortly before an event you've RSVP'd to starts." },
  { type: "live_invite", label: "Live event invites", description: "When a host personally invites you to a live video call." },
  { type: "member_message", label: "Messages from community hosts", description: "When a community host emails a message to you and other members. You'll always see these in the app." },
  { type: "meetup", label: "Meetups posted", description: "When a member posts a meetup in one of your communities — a walk, a ride, a game — so you can join before it starts." },
  { type: "meetup_join", label: "Someone joins your meetup", description: "When a member says they're coming to a meetup you posted." },
  { type: "journey_request", label: "Mentoring requests", description: "When a beginner asks you to guide them on a journey (Adopt a Beginner and similar spaces)." },
  { type: "journey_request_response", label: "Answers to your requests", description: "When a mentor accepts or declines your request." },
  { type: "journey_update", label: "Journey updates", description: "When someone on your journey posts an update, asks a question or replies." },
  { type: "journey_completed", label: "Journey completions", description: "When a journey you're on is marked complete." },
  { type: "journey_report", label: "Reports to review", description: "Staff only: when a member reports something in a guided-journey space." },
  { type: "direct_message", label: "Direct messages", description: "When another member sends you a direct message. The email includes the message and a link straight to the conversation." },
];

export function NotificationEmailForm({ prefs }: { prefs: NotificationEmailPrefs }) {
  const [state, formAction] = useActionState<NotificationEmailFormState, FormData>(updateNotificationEmailPrefs, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <p className="text-sm font-medium text-foreground">Email notifications</p>
        <p className="text-sm text-muted-foreground">
          Choose which notifications also reach your inbox. You&apos;ll always see them in the bell.
        </p>
      </div>

      <div className="space-y-3">
        {TOGGLES.map((toggle) => (
          <label key={toggle.type} className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              name={toggle.type}
              defaultChecked={prefs[toggle.type]}
              className="mt-0.5 h-4 w-4 rounded border-border accent-[var(--accent)]"
            />
            <span>
              <span className="block font-medium text-foreground">{toggle.label}</span>
              <span className="block text-muted-foreground">{toggle.description}</span>
            </span>
          </label>
        ))}
      </div>

      {state?.error && <p className="text-sm text-danger">{state.error}</p>}

      <SubmitButton pendingText="Saving…" className="w-auto">
        Save email preferences
      </SubmitButton>
    </form>
  );
}
