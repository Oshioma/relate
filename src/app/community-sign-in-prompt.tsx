"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { LinkButton } from "@/components/ui/button";

// What a signed-out visitor sees instead of a bare 404 on a community's own
// host (custom domain or subdomain): the page they asked for is often for
// members only, so lead with signing in to this community and coming straight
// back to the same page. The path comes from the browser URL, so `next` is
// the address they actually typed or followed on this host.
export function CommunitySignInPrompt({
  name,
  logoUrl,
  initials,
}: {
  name: string | null;
  logoUrl: string | null;
  initials: string | null;
}) {
  const next = encodeURIComponent(usePathname() || "/");
  const label = name ?? "this community";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-16 text-center">
      {name ? (
        <Avatar src={logoUrl} name={name} initials={initials} size={64} className="mb-5" />
      ) : (
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-accent">
          <Lock className="h-6 w-6" />
        </div>
      )}
      <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">{name ?? "Members only"}</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Log in to continue</h1>
      <p className="mt-3 max-w-md text-base leading-relaxed text-muted-foreground">
        This page may be for members of {label}, or it may have moved. Log in and we&apos;ll bring you straight back here.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <LinkButton href={`/login?next=${next}`} size="lg">
          Log in
        </LinkButton>
        <LinkButton href={`/signup?next=${next}`} size="lg" variant="secondary">
          {name ? `Join ${name}` : "Create an account"}
        </LinkButton>
      </div>
      <Link href="/" className="mt-6 text-sm font-medium text-accent hover:underline">
        Or explore {label}
      </Link>
    </div>
  );
}
