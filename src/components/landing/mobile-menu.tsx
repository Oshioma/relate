"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "@/components/ui/link";

// The homepage header's menu on phones and tablets, where the inline nav is
// hidden. Closes on a link tap, on Escape and on a tap outside it.
export function MobileMenu({ links }: { links: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="home-mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#222A25]/15 bg-white text-[#222A25] hover:border-[#326B42] hover:text-[#326B42]"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      {open && (
        <nav
          id="home-mobile-menu"
          aria-label="Menu"
          className="absolute inset-x-0 top-full border-b border-[#326B42]/10 bg-[#F7F4EC] px-5 pb-5 pt-2 shadow-lg"
        >
          <ul className="mx-auto max-w-7xl divide-y divide-[#326B42]/10">
            {links.map((link) => (
              <li key={link.href}>
                {link.href.startsWith("#") ? (
                  <a href={link.href} onClick={() => setOpen(false)} className="block py-3 text-base font-semibold hover:text-[#326B42]">
                    {link.label}
                  </a>
                ) : (
                  <Link href={link.href} onClick={() => setOpen(false)} className="block py-3 text-base font-semibold hover:text-[#326B42]">
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
