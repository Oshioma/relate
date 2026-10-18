"use client";

import { useOptimistic, useTransition } from "react";
import { Check } from "lucide-react";
import { saveMilestones, setMilestoneDone } from "@/app/c/[communitySlug]/spaces/[spaceSlug]/journey-actions";
import { milestonesToText } from "@/lib/guided-journey/config-form";
import type { JourneyMilestone } from "@/types/database";
import { Textarea } from "@/components/ui/input";
import { DraftForm } from "./draft-form";
import { ProgressBar } from "./progress";
import { cn } from "@/lib/utils";

// The journey's milestones. Ticking one is optimistic (the check and the
// progress bar move straight away) and animates gently; editing the list is a
// plain textarea, because crops and climates differ and the pair should be
// able to reshape the plan without a form builder.
export function MilestoneList({
  milestones,
  journeyId,
  communitySlug,
  spaceSlug,
  canEdit,
}: {
  milestones: JourneyMilestone[];
  journeyId: string;
  communitySlug: string;
  spaceSlug: string;
  canEdit: boolean;
}) {
  const [optimistic, setOptimistic] = useOptimistic(milestones, (current, update: { id: string; done: boolean }) =>
    current.map((m) => (m.id === update.id ? { ...m, status: update.done ? ("done" as const) : ("pending" as const) } : m))
  );
  const [, startTransition] = useTransition();
  const done = optimistic.filter((m) => m.status === "done").length;
  const currentId = optimistic.find((m) => m.status !== "done")?.id;

  function toggle(m: JourneyMilestone) {
    if (!canEdit) return;
    const next = m.status !== "done";
    startTransition(async () => {
      setOptimistic({ id: m.id, done: next });
      const fd = new FormData();
      fd.set("community_slug", communitySlug);
      fd.set("space_slug", spaceSlug);
      fd.set("milestone_id", m.id);
      fd.set("done", String(next));
      await setMilestoneDone(fd);
    });
  }

  return (
    <div>
      <ProgressBar done={done} total={optimistic.length} />
      <ol className="mt-5 space-y-1">
        {optimistic.map((m, i) => {
          const isDone = m.status === "done";
          const isCurrent = m.id === currentId;
          return (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => toggle(m)}
                disabled={!canEdit}
                aria-pressed={isDone}
                className={cn(
                  "group flex w-full items-start gap-3 rounded-2xl px-3 py-2.5 text-left transition",
                  isCurrent && "bg-accent-soft",
                  canEdit && "hover:bg-muted",
                  !canEdit && "cursor-default"
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition-all duration-500 motion-reduce:transition-none",
                    isDone ? "scale-100 border-accent bg-accent text-accent-foreground" : "border-border bg-card text-muted-foreground",
                    isCurrent && !isDone && "border-accent text-accent"
                  )}
                  aria-hidden
                >
                  {isDone ? <Check className="h-3.5 w-3.5 animate-[gj-pop_400ms_ease-out] motion-reduce:animate-none" /> : i + 1}
                </span>
                <span className="min-w-0">
                  <span className={cn("block text-sm font-medium transition-colors", isDone ? "text-muted-foreground line-through decoration-accent/50" : "text-foreground")}>
                    {m.title}
                    {isCurrent && <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-foreground">Now</span>}
                  </span>
                  {m.description && !isDone && <span className="mt-0.5 block text-xs text-muted-foreground">{m.description}</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      {canEdit && (
        <details className="mt-4">
          <summary className="cursor-pointer text-xs font-semibold text-accent">Adapt the milestones</summary>
          <p className="mt-2 text-xs text-muted-foreground">
            One per line. Add a note after <code>::</code>. Every crop and climate is different — reshape the plan together.
          </p>
          <DraftForm
            action={saveMilestones}
            draftKey={`journey-milestones:${journeyId}`}
            hidden={{ community_slug: communitySlug, space_slug: spaceSlug, journey_id: journeyId }}
            submitLabel="Save milestones"
            submitSize="sm"
            className="mt-2 space-y-3"
          >
            <Textarea name="milestones" rows={Math.min(14, Math.max(5, milestones.length + 2))} defaultValue={milestonesToText(milestones)} aria-label="Milestones" />
          </DraftForm>
        </details>
      )}
    </div>
  );
}
