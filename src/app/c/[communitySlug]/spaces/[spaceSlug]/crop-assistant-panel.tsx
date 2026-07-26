"use client";

import { useActionState, useState } from "react";
import { Sparkles, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { askCropQuestion, type CropAssistantState } from "./crop-guides-actions";

const EXAMPLES = [
  "My leaves are turning yellow — what could it be?",
  "When should I feed this crop?",
  "How do I deal with its pests organically?",
  "Which variety should I grow?",
];

export function CropAssistantPanel({
  cropSlug,
  communityId,
  cropName,
}: {
  cropSlug: string;
  communityId: string;
  cropName: string;
}) {
  const [state, formAction, isPending] = useActionState<CropAssistantState, FormData>(askCropQuestion, undefined);
  const [question, setQuestion] = useState("");

  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
        <Sparkles className="h-4 w-4 text-accent" />
        Growing assistant
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Ask anything about growing {cropName} — answered from this guide, your community&apos;s knowledge, and the season. Organic methods only.
      </p>

      <form action={formAction} className="mt-4">
        <input type="hidden" name="crop_slug" value={cropSlug} />
        <input type="hidden" name="community_id" value={communityId} />
        <textarea
          name="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={2}
          placeholder="e.g. Why are my seedlings leggy?"
          className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => setQuestion(ex)}
                className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground hover:border-accent hover:text-accent"
              >
                {ex}
              </button>
            ))}
          </div>
          <Button type="submit" size="sm" className="w-auto shrink-0" disabled={isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Ask
          </Button>
        </div>
      </form>

      {state?.error && <p className="mt-3 text-sm text-danger">{state.error}</p>}

      {state?.answer && (
        <div className="mt-4 rounded-md bg-accent-soft p-4">
          {state.question && <p className="mb-2 text-sm font-medium text-foreground">{state.question}</p>}
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{state.answer}</p>
          <p className="mt-3 text-xs text-muted-foreground">AI-generated from this guide and community knowledge — always use your own judgement.</p>
        </div>
      )}
    </section>
  );
}
