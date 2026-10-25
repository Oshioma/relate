"use client";

import { useState } from "react";
import { ArrowRight, BedDouble, RotateCcw, Scale } from "lucide-react";
import { cn } from "@/lib/utils";
import { QUIZ_QUESTIONS, recommendDestinations, type QuizAnswers } from "@/lib/guides/where-to-stay/scoring";
import { GuideImage } from "./guide-image";
import type { DestinationSummary } from "./types";

import { Anchor } from "@/components/ui/link";
// "Find Your Zanzibar": five questions, a deterministic top three. The answers
// are a handful of radio buttons kept in component state — nothing is typed,
// so there is no draft to save — and changing any answer re-ranks instantly.
export function FindYourZanzibar({
  destinations,
  accommodationHref,
}: {
  destinations: DestinationSummary[];
  accommodationHref: string | null;
}) {
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const answered = QUIZ_QUESTIONS.filter((q) => answers[q.key]).length;
  const complete = answered === QUIZ_QUESTIONS.length;
  const results = complete ? recommendDestinations(destinations, answers as QuizAnswers) : [];

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <form className="space-y-5" onSubmit={(e) => e.preventDefault()} aria-label="Find your Zanzibar questions">
        {QUIZ_QUESTIONS.map((q, i) => (
          <fieldset key={q.key} className="rounded-lg border border-border bg-card p-4">
            <legend className="px-1 text-sm font-semibold text-foreground">
              {i + 1}. {q.question}
            </legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {q.options.map((option) => {
                const id = `quiz-${q.key}-${option.value}`;
                const checked = answers[q.key] === option.value;
                return (
                  <label
                    key={option.value}
                    htmlFor={id}
                    className={cn(
                      "cursor-pointer rounded-full border px-3 py-1.5 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
                      checked ? "border-accent bg-accent text-accent-foreground" : "border-border bg-background hover:bg-muted"
                    )}
                  >
                    <input
                      id={id}
                      type="radio"
                      name={`quiz-${q.key}`}
                      value={option.value}
                      checked={checked}
                      onChange={() => setAnswers((a) => ({ ...a, [q.key]: option.value }))}
                      className="sr-only"
                      data-no-draft
                    />
                    {option.label}
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}
        {answered > 0 && (
          <button type="button" onClick={() => setAnswers({})} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <RotateCcw className="h-4 w-4" aria-hidden /> Start again
          </button>
        )}
      </form>

      <div aria-live="polite">
        {!complete ? (
          <div className="flex h-full min-h-48 flex-col items-center justify-center rounded-lg border border-dashed border-border p-6 text-center">
            <p className="text-sm font-medium text-foreground">Your top three will appear here</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {answered} of {QUIZ_QUESTIONS.length} questions answered.
            </p>
          </div>
        ) : (
          <ol className="space-y-4">
            {results.map(({ destination: d, reasons }, i) => (
              <li key={d.key} className="overflow-hidden rounded-lg border border-border bg-card">
                <div className="grid sm:grid-cols-[180px_minmax(0,1fr)]">
                  {d.photo ? (
                    <GuideImage src={d.photo.src} alt={d.photo.alt} width={d.photo.width} sizes="(min-width: 640px) 180px, 100vw" className="aspect-[16/9] sm:aspect-auto sm:h-full" />
                  ) : (
                    <div className="hidden bg-muted sm:block" />
                  )}
                  <div className="p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-accent">Match {i + 1}</p>
                    <h3 className="mt-0.5 text-lg font-semibold text-foreground">{d.name}</h3>
                    {reasons.length > 0 && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Why it suits you:</span> {reasons.slice(0, 3).join(". ")}.
                      </p>
                    )}
                    <p className="mt-1 flex items-start gap-1.5 text-sm text-muted-foreground">
                      <Scale className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                      <span><span className="font-medium text-foreground">Honest trade-off:</span> {d.tradeOff}</span>
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <a href={`#${d.key}`} className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground hover:opacity-90">
                        View the {d.name} guide <ArrowRight className="h-4 w-4" aria-hidden />
                      </a>
                      <Anchor href={accommodationHref ? accommodationHref : `#${d.key}-stay`} className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-muted">
                        <BedDouble className="h-4 w-4" aria-hidden /> Explore accommodation
                      </Anchor>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
