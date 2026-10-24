import { headers } from "next/headers";
import { Compass } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { getCommunityBySlug } from "@/lib/data/community";
import { isPlatformHost, platformSubdomainSlug, wwwCounterpart } from "@/lib/custom-domain";
import { resolveCommunitySlugForHost } from "@/lib/tenant-domains";
import { CommunitySignInPrompt } from "./community-sign-in-prompt";

// Global 404 boundary. Reached both for genuinely unknown URLs and whenever a
// route calls notFound() — most notably the community shell
// (c/[communitySlug]/layout.tsx), which resolves to a 404 for a community that
// no longer exists, was renamed, or is invite-only and hidden from the visitor,
// and members-only pages, which resolve to a 404 for guests.
//
// On a community's own host (its subdomain or custom domain) a signed-out
// visitor gets that community's sign-in prompt instead — most of what a guest
// can't find there is simply for members — and a signed-in one is offered
// the way back to the community. Elsewhere, name what likely happened and give
// a clear way back to the communities they can still reach.

async function communitySlugForHost(host: string): Promise<string | null> {
  const fromSubdomain = platformSubdomainSlug(host);
  if (fromSubdomain) return fromSubdomain;
  if (!host || isPlatformHost(host)) return null;
  const slug = await resolveCommunitySlugForHost(host);
  if (slug) return slug;
  const counterpart = wwwCounterpart(host);
  return counterpart ? resolveCommunitySlugForHost(counterpart) : null;
}

export default async function NotFound() {
  const host = (await headers()).get("host") ?? "";
  const slug = await communitySlugForHost(host);
  let communityName: string | null = null;

  if (slug) {
    const supabase = await createClient();
    const [user, community] = await Promise.all([
      getCurrentUser(supabase),
      // RLS hides a private community from a guest; the prompt then just
      // doesn't name it.
      getCommunityBySlug(supabase, slug).catch(() => null),
    ]);
    if (!user) {
      return (
        <CommunitySignInPrompt name={community?.name ?? null} logoUrl={community?.logo_url ?? null} initials={community?.logo_initials ?? null} />
      );
    }
    communityName = community?.name ?? null;
  }

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
        {slug ? (
          <LinkButton href="/" size="lg">
            Back to {communityName ?? "the community"}
          </LinkButton>
        ) : (
          <LinkButton href="/dashboard" size="lg">
            Go to your communities
          </LinkButton>
        )}
        <LinkButton href={slug ? "/dashboard" : "/"} size="lg" variant="secondary">
          {slug ? "All your communities" : "Back to home"}
        </LinkButton>
      </div>
    </div>
  );
}
