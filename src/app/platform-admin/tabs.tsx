"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// Each tab owns a set of path prefixes; the per-user detail pages
// (/platform-admin/users/...) live under the "Communities & Members" tab.
const TABS = [
  { href: "/platform-admin", label: "Settings", match: ["/platform-admin/communities", "/platform-admin/users", "/platform-admin/system"] },
  { href: "/platform-admin/communities", label: "Communities & Members", match: ["/platform-admin/communities", "/platform-admin/users"] },
  { href: "/platform-admin/system", label: "System check", match: ["/platform-admin/system"] },
];

export function PlatformAdminTabs() {
  const pathname = usePathname();

  return (
    <nav className="mb-8 flex gap-1 overflow-x-auto border-b border-border">
      {TABS.map((tab) => {
        // "Settings" is the root and is active only when no other tab's prefixes
        // claim the path; the others are active on their own prefixes.
        const active =
          tab.href === "/platform-admin"
            ? !tab.match.some((prefix) => pathname.startsWith(prefix))
            : tab.match.some((prefix) => pathname.startsWith(prefix));
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "-mb-px whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium transition-colors",
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
