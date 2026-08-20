import Link from "next/link";

// The single, app-wide footer. Rendered once from the root layout so it sits at
// the foot of every page — marketing, dashboard and inside the community shell.
// The extra bottom padding on mobile keeps its links clear of the community
// shell's fixed bottom nav (see MobileNav), which floats over the viewport.
export function SiteFooter() {
  return (
    <footer className="border-t border-border px-6 pb-24 pt-8 text-center text-sm text-muted-foreground md:pb-8">
      <nav className="mb-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        <Link href="/pricing" className="hover:text-foreground">
          Pricing
        </Link>
        <span aria-hidden className="text-border">·</span>
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
        <Link href="/contact" className="hover:text-foreground">
          Contact
        </Link>
      </nav>
      <p>Relate — built for quiet, focused communities.</p>
    </footer>
  );
}
