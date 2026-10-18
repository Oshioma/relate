"use client";

import { Fragment, useEffect, useId, useMemo, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { filterFocusGroups, type FocusGroup } from "@/lib/timeline/focus";

// "SHOW ON ITS OWN", SEARCHABLE.
//
// The plain <select> held 31 tracks, every topic, civilisation, shared tag and
// person, sorted by name — so a new track called "Origins of the Moors" sat
// under O, and someone looking for Moors scrolled past it and decided it was
// missing. Typing any word of a name now narrows the list to what has it.
// With nothing typed it is the same grouped list as before.
//
// A combobox in the ARIA sense: the box keeps focus, the arrow keys move
// through the options, Enter picks, Escape closes and puts back what was
// showing.

export function FocusSearch({
  id,
  groups,
  value,
  onChange,
}: {
  id: string;
  groups: readonly FocusGroup[];
  /** The encoded choice being shown, or "" for everything. */
  value: string;
  onChange: (value: string) => void;
}) {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const currentLabel = useMemo(() => {
    for (const group of groups) {
      const found = group.options.find((option) => option.value === value);
      if (found) return found.label;
    }
    return "";
  }, [groups, value]);

  const shown = useMemo(() => filterFocusGroups(groups, query), [groups, query]);
  // "Everything" is an option too, offered while nothing is typed.
  const flat = useMemo(
    () => [...(query.trim() ? [] : [{ value: "", label: "Everything" }]), ...shown.flatMap((group) => group.options)],
    [shown, query]
  );

  // A click anywhere else closes the list without changing anything.
  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!boxRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  // Keep the highlighted option in view as the arrow keys move it.
  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const pick = (next: string) => {
    setOpen(false);
    setQuery("");
    if (next !== value) onChange(next);
  };

  // Each option's place in the arrow-key order. Choice values are unique.
  const position = useMemo(() => new Map(flat.map((option, at) => [option.value, at])), [flat]);

  const optionRow = (option: { value: string; label: string }) => {
    const at = position.get(option.value) ?? -1;
    return (
      <li
        key={option.value || "everything"}
        id={`${listId}-${at}`}
        data-index={at}
        role="option"
        aria-selected={option.value === value}
        // pointerdown, not click, so the box never loses focus first.
        onPointerDown={(event) => {
          event.preventDefault();
          pick(option.value);
        }}
        onPointerEnter={() => setActive(at)}
        className={cn(
          "cursor-pointer px-3.5 py-1.5 text-sm",
          at === active ? "bg-muted text-foreground" : "text-foreground",
          option.value === value && "font-medium text-accent"
        )}
      >
        {option.label}
      </li>
    );
  };

  return (
    <div ref={boxRef} className="relative min-w-0 max-w-full flex-1 sm:max-w-md">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
      <input
        id={id}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={open && flat[active] ? `${listId}-${active}` : undefined}
        autoComplete="off"
        // Showing: the choice's name. Searching: what is typed.
        value={open ? query : currentLabel}
        placeholder={open && currentLabel ? currentLabel : "Search tracks, topics, people…"}
        onFocus={() => {
          setOpen(true);
          setActive(0);
        }}
        onChange={(event) => {
          setQuery(event.target.value);
          setActive(0);
          setOpen(true);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setOpen(true);
            setActive((at) => Math.min(at + 1, flat.length - 1));
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setActive((at) => Math.max(at - 1, 0));
          } else if (event.key === "Enter") {
            event.preventDefault();
            if (open && flat[active]) pick(flat[active].value);
          } else if (event.key === "Escape") {
            setOpen(false);
            setQuery("");
            event.currentTarget.blur();
          }
        }}
        className={cn(
          "w-full rounded-full border-0 py-2 pl-9 pr-9 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          value && !open ? "bg-accent-soft font-medium text-accent" : "bg-card text-foreground hover:bg-muted"
        )}
      />
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 top-full z-30 mt-1.5 max-h-80 overflow-auto rounded-lg border border-border bg-card py-1.5 shadow-lg"
        >
          {flat.length === 0 && <li className="px-3.5 py-1.5 text-sm text-muted-foreground">Nothing matches “{query.trim()}”</li>}
          {!query.trim() && optionRow({ value: "", label: "Everything" })}
          {shown.map((group) => (
            <Fragment key={group.label}>
              <li role="presentation" className="px-3.5 pb-0.5 pt-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {group.label}
              </li>
              {group.options.map(optionRow)}
            </Fragment>
          ))}
        </ul>
      )}
    </div>
  );
}
