"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/platform-admin", label: "Settings" },
  { href: "/platform-admin/communities", label: "Communities & Members" },
];

export function PlatformAdminTabs() {
  const pathname = usePathname();

  return (
    <nav className="mb-8 flex gap-1 border-b border-border">
      {TABS.map((tab) => {
        // Only two tabs: "Settings" is the exact root; everything else under
        // /platform-admin (the communities list and per-user detail pages)
        // belongs to the "Communities & Members" tab.
        const active = tab.href === "/platform-admin" ? pathname === "/platform-admin" : pathname !== "/platform-admin";
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "border-accent text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
