import { CheckCircle2, Circle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export type ChecklistStep = {
  label: string;
  hint: string;
  done: boolean;
  href: string;
};

// Owner-only progress card for the "charge members" chain: upgrade → connect
// Stripe → price a space → bundle a tier. The steps depend on one another and
// were previously only discoverable through "above/below" prose scattered
// across four sections; this makes the sequence and current state explicit.
// Each step links to the section that completes it. Hidden once every step is
// done, so it guides setup without nagging afterward.
export function MonetizationChecklist({ steps }: { steps: ChecklistStep[] }) {
  const doneCount = steps.filter((s) => s.done).length;
  if (doneCount === steps.length) return null;

  return (
    <Card>
      <CardContent className="pt-5">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <p className="text-sm font-medium text-foreground">Charge members for spaces</p>
          <p className="text-xs text-muted-foreground">
            {doneCount} of {steps.length} done
          </p>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          Optional. Complete these in order to start charging members — skip it entirely if your community stays free.
        </p>
        <ol className="space-y-2">
          {steps.map((step, i) => (
            <li key={step.href + i}>
              <a
                href={step.href}
                className="flex items-start gap-3 rounded-md px-2 py-1.5 -mx-2 transition-colors hover:bg-muted"
              >
                {step.done ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                ) : (
                  <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                )}
                <span>
                  <span
                    className={`block text-sm font-medium ${step.done ? "text-muted-foreground line-through" : "text-foreground"}`}
                  >
                    {step.label}
                  </span>
                  <span className="block text-xs text-muted-foreground">{step.hint}</span>
                </span>
              </a>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
