"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  icon?: ReactNode;
  children: ReactNode;
  exact?: boolean;
  className?: string;
}

export function NavLink({ href, icon, children, exact = false, className }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={cn(
        // 15px rather than 14. A sidebar label is a destination, not body copy
        // — it is read at a glance and aimed at with a mouse, and at 14px in a
        // 256px column it was the smallest thing on a page whose job is to
        // navigate. Shared by every community's sidebar and the dashboard, so
        // they stay one size.
        "flex items-center gap-2.5 rounded-md px-3 py-2 text-[15px] font-medium transition-colors",
        isActive
          ? "bg-accent-soft text-accent"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        className
      )}
    >
      {icon}
      <span className="truncate">{children}</span>
    </Link>
  );
}
