"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Send } from "lucide-react";
import { sendMigrationEmails, type SendEmailsState } from "./send-actions";
import { sendEmailInvite } from "../../members/invites-actions";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useFormDraftRef } from "@/lib/use-form-draft";
import { EMAIL_TEMPLATE_INFO } from "@/lib/email-templates";
import type { CommunityEmailTemplateKind } from "@/types/database";

type SendKind = Exclude<CommunityEmailTemplateKind, "welcome">;

export type SendableMember = {
  id: string;
  name: string;
  username: string | null;
  // The latest "we've moved" email this person was sent, if any.
  lastSent: { kind: "migration_inactive" | "migration_active"; at: string; activatedAt: string | null } | null;
};

export type GivableTier = { id: string; name: string; price: string; suggested: boolean };

const CHOICES: { kind: SendKind; hint: string }[] = [
  { kind: "migration_inactive", hint: "Members already here who didn't come regularly. They keep general access." },
  { kind: "migration_active", hint: "Members already here who came regularly. Their link gives them the membership below free." },
  { kind: "invite_new", hint: "Someone who isn't on Relate yet." },
  { kind: "invite_existing", hint: "Someone who already has a Relate account." },
];

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

// Pick the email, then the people: members already in the community for the
// two "we've moved" emails, or an address for the invitations. The welcome
// email isn't here: it goes out by itself when someone joins. What's ticked
// and typed is kept in this browser until it's sent.
export function SendEmailsSection({
  communityId,
  communitySlug,
  members,
  tiers,
  canSend,
}: {
  communityId: string;
  communitySlug: string;
  members: SendableMember[];
  tiers: GivableTier[];
  canSend: boolean;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [kind, setKind] = useState<SendKind | null>(null);
  const [filter, setFilter] = useState("");
  const [state, setState] = useState<SendEmailsState>(undefined);
  const [pending, setPending] = useState(false);

  const onRestore = useCallback((values: Record<string, string | string[]>) => {
    const restored = values.kind;
    if (typeof restored === "string" && CHOICES.some((c) => c.kind === restored)) setKind(restored as SendKind);
  }, []);
  const { clear } = useFormDraftRef(formRef, `send-emails:${communityId}`, { onRestore });

  const isMigration = kind === "migration_inactive" || kind === "migration_active";
  const needle = filter.trim().toLowerCase();
  const visible = useMemo(
    () =>
      members.map((m) => ({
        member: m,
        shown: !needle || m.name.toLowerCase().includes(needle) || (m.username ?? "").toLowerCase().includes(needle),
      })),
    [members, needle]
  );

  function tickNotYetSent() {
    const form = formRef.current;
    if (!form) return;
    const notSent = new Set(members.filter((m) => !m.lastSent).map((m) => m.id));
    form.querySelectorAll<HTMLInputElement>('input[name="user_ids"]').forEach((box) => {
      box.checked = notSent.has(box.value);
    });
    form.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function untickAll() {
    const form = formRef.current;
    if (!form) return;
    form.querySelectorAll<HTMLInputElement>('input[name="user_ids"]').forEach((box) => {
      box.checked = false;
    });
    form.dispatchEvent(new Event("change", { bubbles: true }));
  }

  async function handleSubmit(formData: FormData) {
    if (!kind) {
      setState({ error: "Choose which email to send." });
      return;
    }
    setPending(true);
    setState(undefined);
    try {
      let result: SendEmailsState;
      if (isMigration) {
        result = await sendMigrationEmails(undefined, formData);
      } else {
        formData.set("template_kind", kind);
        formData.set("role", "member");
        const invite = await sendEmailInvite(undefined, formData);
        result = invite?.error
          ? { error: invite.error }
          : { ok: true, message: `Invitation sent to ${String(formData.get("email") ?? "")}.` };
      }
      setState(result);
      if (result && "ok" in result) {
        clear();
        formRef.current?.reset();
        setKind(null);
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4 rounded-lg border border-border bg-card p-4">
      <input type="hidden" name="community_id" value={communityId} />
      <input type="hidden" name="community_slug" value={communitySlug} />

      <div>
        <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
          <Send className="h-4 w-4" />
          Send an email
        </h2>
        <p className="text-sm text-muted-foreground">
          Choose the right email for the people you&apos;re inviting. Each one uses the wording you&apos;ve written below.
        </p>
      </div>

      {!canSend && (
        <p className="rounded-md bg-muted/60 px-3 py-2 text-sm text-muted-foreground">
          Email sending isn&apos;t set up on this site yet, so nothing can be sent from here.
        </p>
      )}

      <fieldset className="space-y-2">
        <legend className="mb-1 text-sm font-medium text-foreground">Which email?</legend>
        {CHOICES.map((choice) => (
          <label
            key={choice.kind}
            className="flex cursor-pointer items-start gap-2 rounded-md border border-border px-3 py-2 text-sm has-[:checked]:border-accent has-[:checked]:bg-accent-soft"
          >
            <input
              type="radio"
              name="kind"
              value={choice.kind}
              checked={kind === choice.kind}
              onChange={() => setKind(choice.kind)}
              className="mt-1 h-4 w-4"
            />
            <span>
              <span className="block font-medium text-foreground">{EMAIL_TEMPLATE_INFO[choice.kind].title}</span>
              <span className="block text-muted-foreground">{choice.hint}</span>
            </span>
          </label>
        ))}
      </fieldset>

      {/* Both halves stay in the page (just hidden) so a refresh can put back whatever was filled in. */}
      <div hidden={kind !== "migration_active"} className="space-y-2">
        <p className="text-sm font-medium text-foreground">Give them free</p>
        {tiers.length === 0 ? (
          <p className="text-sm text-muted-foreground">This community has no paid memberships to give.</p>
        ) : (
          tiers.map((tier) => (
            <label key={tier.id} className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" name="free_tier_ids" value={tier.id} defaultChecked={tier.suggested} className="h-4 w-4" />
              {tier.name} <span className="text-muted-foreground">({tier.price})</span>
            </label>
          ))
        )}
        <p className="text-xs text-muted-foreground">
          It switches on when they press the button in their email, and costs them nothing.
        </p>
      </div>

      <div hidden={!isMigration} className="space-y-2">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <p className="text-sm font-medium text-foreground">Send it to</p>
          <div className="flex gap-3 text-xs">
            <button type="button" onClick={tickNotYetSent} className="text-accent hover:underline">
              Tick everyone not sent one yet
            </button>
            <button type="button" onClick={untickAll} className="text-muted-foreground hover:text-foreground">
              Untick all
            </button>
          </div>
        </div>
        <Input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Find a member"
          aria-label="Find a member"
          data-no-draft
        />
        <ul className="max-h-80 divide-y divide-border overflow-y-auto rounded-md border border-border">
          {visible.map(({ member, shown }) => (
            <li key={member.id} hidden={!shown}>
              <label className="flex cursor-pointer items-start gap-2 px-3 py-2 text-sm">
                <input type="checkbox" name="user_ids" value={member.id} className="mt-1 h-4 w-4" />
                <span className="min-w-0">
                  <span className="block text-foreground">
                    {member.name}
                    {member.username && <span className="text-muted-foreground"> @{member.username}</span>}
                  </span>
                  {member.lastSent && (
                    <span className="block text-xs text-muted-foreground">
                      Sent {member.lastSent.kind === "migration_active" ? "“regular members”" : "“not regulars”"} on{" "}
                      {shortDate(member.lastSent.at)}
                      {member.lastSent.activatedAt ? ` · activated ${shortDate(member.lastSent.activatedAt)}` : " · not activated yet"}
                    </span>
                  )}
                </span>
              </label>
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground">
          Each person gets their own link. It signs them in, asks them to choose a password, and works once, for 60
          days. Sending again gives them a fresh link.
        </p>
      </div>

      <div hidden={!kind || isMigration} className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="send_email">Email address</Label>
          <Input id="send_email" name="email" type="email" placeholder="friend@example.com" />
        </div>
        <div>
          <Label htmlFor="send_first_name">First name</Label>
          <Input id="send_first_name" name="first_name" maxLength={80} placeholder="Amina" />
        </div>
        <p className="text-xs text-muted-foreground sm:col-span-2">
          The first name fills {"{First_Name}"}. The invitation works once and lasts 14 days.
        </p>
      </div>

      {state && "error" in state && <p className="text-sm text-danger">{state.error}</p>}
      {state && "ok" in state && <p className="text-sm text-accent">{state.message}</p>}

      <Button type="submit" disabled={pending || !canSend || !kind}>
        {pending ? "Sending…" : "Send"}
      </Button>
    </form>
  );
}
