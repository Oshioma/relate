"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { returnHereHref } from "@/lib/auth-return";

// A "Log in" / "Sign up" link that brings the guest back to the page they were
// reading once they're signed in, rather than to the community's front page.
// The layout that renders it can't know the current path itself (layouts
// don't re-render per page), so it's read here from the live URL.
export function ReturnHereLink({
  to,
  fallback,
  ...props
}: Omit<ComponentProps<typeof Link>, "href"> & { to: "/login" | "/signup"; fallback: string }) {
  const pathname = usePathname();
  return <Link href={returnHereHref(to, pathname, fallback)} {...props} />;
}
