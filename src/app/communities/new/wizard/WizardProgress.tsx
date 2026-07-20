import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["Basics", "Template", "Customize", "Launch"];

export function WizardProgress({ step }: { step: number }) {
  return (
    <div className="mb-8 flex items-center justify-between">
      {STEPS.map((label, i) => {
        const index = i + 1;
        const isActive = index === step;
        const isDone = index < step;
        return (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold",
                  isActive ? "border-accent bg-accent text-accent-foreground" : isDone ? "border-accent text-accent" : "border-border text-muted-foreground"
                )}
              >
                {isDone ? <Check className="h-4 w-4" /> : index}
              </div>
              <span className={cn("text-xs font-medium", isActive ? "text-foreground" : "text-muted-foreground")}>{label}</span>
            </div>
            {index < STEPS.length && <div className={cn("mx-2 h-0.5 flex-1 rounded", isDone ? "bg-accent" : "bg-border")} />}
          </div>
        );
      })}
    </div>
  );
}
