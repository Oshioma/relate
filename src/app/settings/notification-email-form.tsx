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
