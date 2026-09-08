import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["Basics", "Template", "Customize", "Launch"];

export function WizardProgress({ step }: { step: number }) {
  return (
    <div className="mx-auto mb-10 flex max-w-2xl items-start justify-between sm:mb-12">
      {STEPS.map((label, i) => {
        const index = i + 1;
        const isActive = index === step;
        const isDone = index < step;
        return (
          <div key={label} className="flex min-w-0 flex-1 items-start last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors sm:h-10 sm:w-10 sm:text-sm",
                  isActive ? "border-accent bg-accent text-accent-foreground" : isDone ? "border-accent text-accent" : "border-border text-muted-foreground"
                )}
              >
                {isDone ? <Check className="h-4 w-4" /> : index}
              </div>
              <span className={cn("text-[11px] font-medium sm:text-sm", isActive ? "text-foreground" : "text-muted-foreground")}>{label}</span>
            </div>
            {index < STEPS.length && <div className={cn("mx-2 mt-[17px] h-px flex-1 rounded sm:mx-4 sm:mt-[19px] sm:h-0.5", isDone ? "bg-accent" : "bg-border")} />}
          </div>
        );
      })}
    </div>
  );
}
