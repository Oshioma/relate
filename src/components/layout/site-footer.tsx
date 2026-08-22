import Link from "next/link";
import { PlatformHomeLink } from "./platform-home-link";

// The single, app-wide footer. Rendered once from the root layout so it sits at
// the foot of every page — marketing, dashboard and inside the community shell.
// The extra bottom padding on mobile keeps its links clear of the community
// shell's fixed bottom nav (see MobileNav), which floats over the viewport.
export function SiteFooter() {
  return (
    <footer className="border-t border-border px-6 pb-24 pt-8 text-center text-sm text-muted-foreground md:pb-8">
      <nav className="mb-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        <Link href="/terms" className="hover:text-foreground">
          Terms &amp; Conditions
        </Link>
        <span aria-hidden className="text-border">·</span>
        <Link href="/privacy" className="hover:text-foreground">
          Privacy Policy
        </Link>
        <span aria-hidden className="text-border">·</span>
        <Link href="/community-owner-agreement" className="hover:text-foreground">
          Owner Agreement
        </Link>
        <span aria-hidden className="text-border">·</span>
        <Link href="/pricing" className="hover:text-foreground">
          Pricing
        </Link>
        <span aria-hidden className="text-border">·</span>
        <Link href="/contact" className="hover:text-foreground">
          Contact
        </Link>
      </nav>
      {/* The platform credit, and the only way back out of a community shell
          on desktop now that the sidebar's "Powered by Relate.Click" line is
          gone. The platform home sends a signed-in member to their dashboard
          and everyone else to the marketing page, so one link serves both —
          and PlatformHomeLink is what makes it mean the platform rather than
          the community whose host you're reading this on. */}
      <p>
        <PlatformHomeLink className="font-medium text-foreground hover:underline">Relate</PlatformHomeLink> — built for
        quiet, focused communities.
      </p>
    </footer>
  );
}
