"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// A row of cards that scrolls sideways (swipe, trackpad, or the arrows). The
// arrows only appear when there's more row than fits, and each hides at its end.
export function CommunityCarousel({ children }: { children: ReactNode }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [canBack, setCanBack] = useState(false);
  const [canForward, setCanForward] = useState(false);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const update = () => {
      setCanBack(row.scrollLeft > 4);
      setCanForward(row.scrollLeft + row.clientWidth < row.scrollWidth - 4);
    };
    update();
    row.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      row.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const step = (direction: 1 | -1) => {
    const row = rowRef.current;
    if (row) row.scrollBy({ left: direction * row.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={rowRef}
        className="-mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-6 px-6 pb-2 [scrollbar-width:none] sm:-mx-8 sm:scroll-px-8 sm:px-8 [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
      <ArrowButton label="Previous communities" side="left" hidden={!canBack} onClick={() => step(-1)}>
        <ChevronLeft className="h-5 w-5" />
      </ArrowButton>
      <ArrowButton label="More communities" side="right" hidden={!canForward} onClick={() => step(1)}>
        <ChevronRight className="h-5 w-5" />
      </ArrowButton>
    </div>
  );
}

function ArrowButton({
  label,
  side,
  hidden,
  onClick,
  children,
}: {
  label: string;
  side: "left" | "right";
  hidden: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "absolute top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#222A25] shadow-lg ring-1 ring-black/5 transition hover:text-[#326B42] sm:flex",
        side === "left" ? "-left-5" : "-right-5",
        hidden && "sm:hidden"
      )}
    >
      {children}
    </button>
  );
}
