"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Small Facebook-style top-bar icon: click to toggle a panel anchored below
// it, close on outside click. Shared by notifications and messages so both
// get identical open/close/positioning behavior.
export function IconPopover({
  icon,
  label,
  panelTitle,
  children,
}: {
  icon: ReactNode;
  label: string;
  panelTitle: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="text-muted-foreground hover:text-foreground"
      >
        {icon}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-lg border border-border bg-card shadow-lg">
          <div className="border-b border-border px-4 py-2.5 text-sm font-semibold text-foreground">{panelTitle}</div>
          <div className="max-h-96 overflow-y-auto">{children}</div>
        </div>
      )}
    </div>
  );
}
