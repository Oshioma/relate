"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AccessGroupKey } from "@/lib/access/summary";

export type AccessGroupTile = {
  key: AccessGroupKey;
  label: string;
  now: string;
  // Rendered right under the tile when it's open: the settings themselves.
  panel: ReactNode;
};

// The four access groups on the "Who can see what?" card. Clicking one opens
// its settings directly below it (one at a time) instead of jumping down the
// page. An old link to #discoverability or #joining opens that group.
export function AccessGroupTiles({ groups }: { groups: AccessGroupTile[] }) {
  const [openKey, setOpenKey] = useState<AccessGroupKey | null>(null);

  useEffect(() => {
    const fromHash = () => {
      const hash = window.location.hash.slice(1);
      const match = groups.find((g) => g.key === hash);
      if (match) {
        setOpenKey(match.key);
        document.getElementById(`access-group-${match.key}`)?.scrollIntoView({ block: "start" });
      }
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [groups]);

  return (
    <div className="mt-4 space-y-2">
      {groups.map((group) => {
        const open = openKey === group.key;
        const panelId = `access-group-${group.key}-panel`;
        return (
          <div
            key={group.key}
            id={`access-group-${group.key}`}
            className={cn("scroll-mt-20 rounded-md border transition-colors", open ? "border-accent/50" : "border-border")}
          >
            <button
              type="button"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpenKey(open ? null : group.key)}
              className="flex w-full items-start justify-between gap-3 rounded-md p-3 text-left hover:bg-accent-soft/40"
            >
              <span className="min-w-0">
                <span className="block text-sm font-medium text-foreground">{group.label}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{group.now}</span>
              </span>
              <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-accent">
                {open ? "Close" : "Change"}
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
              </span>
            </button>
            {open && (
              <div id={panelId} className="border-t border-border p-3">
                {group.panel}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
