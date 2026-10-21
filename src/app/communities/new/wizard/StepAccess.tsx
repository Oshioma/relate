"use client";

import { Globe, Lock, CreditCard, Sparkles, SlidersHorizontal } from "lucide-react";
import { Label } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ACCESS_PRESETS, getAccessPreset, type AccessPresetKey } from "@/lib/access/presets";
import { defaultJoinPolicy, describeJoining } from "@/lib/join-policy";
import type { CommunityPrivacy, JoinPolicy } from "@/types/database";
import type { WizardState } from "./types";

const PRESET_ICONS: Record<AccessPresetKey, typeof Globe> = {
  open: Globe,
  private: Lock,
  paid: CreditCard,
  premium: Sparkles,
  custom: SlidersHorizontal,
};

const SELECT_CLASS =
  "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

// Step 1's "how do people get in?": one of five presets. Listing and joining
// as separate questions only appear under Custom setup; every other preset
// answers them itself.
export function StepAccess({ state, onPreset, update }: {
  state: WizardState;
  onPreset: (key: AccessPresetKey) => void;
  update: (patch: Partial<WizardState>) => void;
}) {
  const preset = getAccessPreset(state.presetKey);
  const custom = state.custom;

  function setCustom(patch: Partial<WizardState["custom"]>) {
    update({ custom: { ...custom, ...patch } });
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">How do people get in?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick the closest. Nothing is charged and no membership is created; you can change any of this later.
        </p>
      </div>

      <div role="radiogroup" aria-label="How do people get in?" className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {ACCESS_PRESETS.map((p) => {
          const Icon = PRESET_ICONS[p.key];
          const active = state.presetKey === p.key;
          return (
            <button
              key={p.key}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onPreset(p.key)}
              className={cn(
                "rounded-md border-2 p-3 text-left transition-colors",
                active ? "border-accent bg-accent-soft" : "border-border bg-card hover:border-muted-foreground/40"
              )}
            >
              <Icon className="h-4 w-4 text-muted-foreground" />
              <p className="mt-1.5 text-sm font-medium text-foreground">{p.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{p.description}</p>
            </button>
          );
        })}
      </div>

      {preset && <p className="rounded-md bg-muted px-3 py-2 text-sm text-foreground">{preset.explainer}</p>}

      {preset?.key === "private" && (
        <label className="flex items-start gap-3 rounded-md border border-border p-3">
          <input
            type="checkbox"
            checked={state.hideCompletely}
            onChange={(e) => update({ hideCompletely: e.target.checked })}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-[var(--accent)]"
          />
          <span className="text-sm text-foreground">
            Hide it completely
            <span className="mt-0.5 block text-xs text-muted-foreground">
              Invitation only. The link doesn&apos;t open for anyone who isn&apos;t a member, so nobody can ask to join.
            </span>
          </span>
        </label>
      )}

      {preset?.key === "custom" && (
        <div className="grid gap-4 rounded-md border border-border p-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="custom_privacy">Who can find it</Label>
            <select
              id="custom_privacy"
              value={custom.privacy}
              onChange={(e) => {
                const privacy = e.target.value as CommunityPrivacy;
                // Listing brings its usual joining rule unless the creator
                // already picked one that still applies.
                setCustom({ privacy, joinPolicy: privacy === "invite_only" ? "invite" : custom.joinPolicy === "invite" ? defaultJoinPolicy(privacy) : custom.joinPolicy });
              }}
              className={SELECT_CLASS}
            >
              <option value="public">Listed: shown on Relate for anyone to find</option>
              <option value="private">Unlisted: only people with the link</option>
              <option value="invite_only">Hidden: invitation only</option>
            </select>
          </div>
          <div>
            <Label htmlFor="custom_join">Who can join</Label>
            {custom.privacy === "invite_only" ? (
              <p className="text-sm text-muted-foreground">Only people you invite.</p>
            ) : (
              <>
                <select
                  id="custom_join"
                  value={custom.joinPolicy === "invite" ? defaultJoinPolicy(custom.privacy) : custom.joinPolicy}
                  onChange={(e) => setCustom({ joinPolicy: e.target.value as JoinPolicy })}
                  className={SELECT_CLASS}
                >
                  <option value="open">Anyone: they join straight away</option>
                  <option value="approval">Approval: people ask and you approve</option>
                </select>
                <p className="mt-1 text-xs text-muted-foreground">
                  {describeJoining(custom.joinPolicy === "invite" ? defaultJoinPolicy(custom.privacy) : custom.joinPolicy)}
                </p>
              </>
            )}
          </div>
          {custom.privacy !== "invite_only" && (
            <div className="space-y-2 sm:col-span-2">
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={custom.feedPublic}
                  onChange={(e) => setCustom({ feedPublic: e.target.checked })}
                  className="h-4 w-4 rounded border-border accent-[var(--accent)]"
                />
                Visitors can read the feed before joining
              </label>
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={custom.eventsPublic}
                  onChange={(e) => setCustom({ eventsPublic: e.target.checked })}
                  className="h-4 w-4 rounded border-border accent-[var(--accent)]"
                />
                Visitors can see upcoming events
              </label>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
