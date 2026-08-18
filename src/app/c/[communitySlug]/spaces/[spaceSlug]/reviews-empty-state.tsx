"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * The placeholder shown under a listing's reviews when there are none yet.
 *
 * "Be the first to leave one" is an invitation a signed-out visitor can't
 * accept, so for them the prompt carries the way in. `usePathname` supplies the
 * return path rather than a prop: these pages canonicalize a UUID in the URL to
 * the listing's slug, and the live path is the one that survives the round trip.
 */
export function ReviewsEmptyState({ isLoggedIn }: { isLoggedIn: boolean }) {
  const pathname = usePathname();

  if (isLoggedIn) {
    return <p className="text-sm text-muted-foreground">No reviews yet. Be the first to leave one.</p>;
  }

  return (
    <p className="text-sm text-muted-foreground">
      No reviews yet.{" "}
      <Link
        href={`/login?next=${encodeURIComponent(pathname)}`}
        className="font-medium text-accent underline-offset-2 hover:underline"
      >
        Log in
      </Link>{" "}
      to be the first to leave one.
    </p>
  );
}
