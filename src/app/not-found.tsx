import { Compass } from "lucide-react";
import { LinkButton } from "@/components/ui/button";

// Global 404 boundary. Reached both for genuinely unknown URLs and whenever a
// route calls notFound() — most notably the community shell
// (c/[communitySlug]/layout.tsx), which resolves to a 404 for a community that
// no longer exists, was renamed, or is invite-only and hidden from the visitor.
// An early member following a link from back when the site was new lands here
// when that community has since changed, so this shouldn't be a dead end: name
// what likely happened and give a clear way back to the communities they can
// still reach.
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-accent">
        <Compass className="h-6 w-6" />
      </div>
      <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Page not found</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        We couldn&apos;t find that page
      </h1>
      <p className="mt-3 max-w-md text-base leading-relaxed text-muted-foreground">
        The community or page you&apos;re looking for may have been moved, renamed, or is no longer
        available. It might also be invite-only.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <LinkButton href="/dashboard" size="lg">
          Go to your communities
        </LinkButton>
        <LinkButton href="/" size="lg" variant="secondary">
          Back to home
        </LinkButton>
      </div>
    </div>
  );
}
