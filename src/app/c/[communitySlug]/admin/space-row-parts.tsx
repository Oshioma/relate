import type { ReactNode } from "react";
import { Globe, Users, Lock, ShieldCheck, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AccessChoice } from "@/lib/access/model";
import type { SpaceTypeCategory } from "@/lib/space-types";

// Shared pieces of a row in the Admin Spaces list (spaces, built-in links and
// the pinned feed), so every row lines up on the same columns.

// The row's columns: handle, picture, about, access, settings, menu, all on
// one line once the list is 1024px wide. From 672px, access and settings sit
// side by side under the name, with the menu top right; narrower, everything
// stacks. Measured on the list (a container query), not the window, because
// the admin sidebar takes part of the window.
export const ROW_GRID =
  "grid grid-cols-[20px_64px_minmax(0,1fr)] items-start gap-x-4 gap-y-3 p-4 @2xl:grid-cols-[20px_80px_minmax(0,1fr)_minmax(0,1fr)_40px] @5xl:grid-cols-[20px_80px_minmax(0,1fr)_200px_minmax(260px,300px)_40px] @5xl:items-center";

// Column spans per part, matching ROW_GRID's three layouts.
export const ROW_ABOUT = "min-w-0 @2xl:col-span-2 @5xl:col-span-1";
export const ROW_SETTINGS = "col-span-3 @2xl:col-span-2 @5xl:col-span-1";
export const ROW_MENU =
  "col-span-3 flex justify-end @2xl:col-span-1 @2xl:col-start-5 @2xl:row-start-1 @5xl:col-start-auto @5xl:row-start-auto @5xl:self-start";

export function DragHandle({ disabled }: { disabled?: boolean }) {
  return (
    <GripVertical
      aria-hidden
      className={cn("mt-6 h-5 w-5 text-muted-foreground @5xl:mt-0", disabled ? "opacity-30" : "cursor-grab")}
    />
  );
}

const CHIP_TONES: Record<SpaceTypeCategory | "builtin" | "pinned", string> = {
  general: "bg-muted text-foreground",
  programs: "bg-[#E7F0FB] text-[#235A9C]",
  place: "bg-[#EEF4E8] text-[#3F6A2E]",
  builtin: "bg-[#FBEAE7] text-[#A33A2B]",
  pinned: "bg-[#FBEAE7] text-[#A33A2B]",
};

export function TypeChip({ tone, children }: { tone: keyof typeof CHIP_TONES; children: ReactNode }) {
  return <span className={cn("inline-flex shrink-0 items-center rounded-md px-2 py-0.5 text-xs font-medium", CHIP_TONES[tone])}>{children}</span>;
}

const ACCESS_ICON: Record<AccessChoice, { icon: typeof Globe; className: string }> = {
  everyone: { icon: Globe, className: "text-accent" },
  members: { icon: Users, className: "text-[#B4432F]" },
  paid: { icon: Lock, className: "text-[#B76E00]" },
  tiers: { icon: Lock, className: "text-[#B76E00]" },
  team: { icon: ShieldCheck, className: "text-muted-foreground" },
};

// Who can open it, in a small box: an icon, a title and one line under it.
export function AccessBox({ choice, title, detail, action }: { choice: AccessChoice; title: string; detail: string; action?: ReactNode }) {
  const { icon: Icon, className } = ACCESS_ICON[choice];
  return (
    <div className="col-span-3 flex items-start gap-2.5 rounded-xl bg-muted/50 px-3.5 py-3 @2xl:col-span-2 @2xl:col-start-2 @5xl:col-span-1 @5xl:col-start-auto">
      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", className)} aria-hidden />
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{detail}</p>
        {action}
      </div>
    </div>
  );
}
