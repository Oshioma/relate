import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership, isCommunityAdmin, isCommunityStaff } from "@/lib/data/community";
import { getEditorialGuide, getEditorialGuideUpdates, getGuideDirectory } from "@/lib/data/editorial-guides";
import { parseOverrides, resolveGuideContent, WHERE_TO_STAY_SLUG } from "@/lib/guides/where-to-stay/content";
import { cn } from "@/lib/utils";
import { DestinationEditor } from "./destination-editor";
import { GuideSettingsForm, GuideUpdatesManager } from "./guide-settings-form";

export const metadata: Metadata = { title: "Edit guide", robots: { index: false } };

// The guide's admin page: publish state and review date, per-destination
// editing (copy, rankings, at-a-glance labels, photos, restaurant and stay
// recommendations linked to directory listings) and dated local updates.
// Admins edit everything; moderators can manage local updates only.
export default async function EditGuidePage({
  params,
  searchParams,
}: {
  params: Promise<{ communitySlug: string; guideSlug: string }>;
  searchParams: Promise<{ d?: string }>;
}) {
  const { communitySlug, guideSlug } = await params;
  const { d } = await searchParams;
  if (guideSlug !== WHERE_TO_STAY_SLUG) notFound();

  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  if (!user) redirect(`/login?next=${encodeURIComponent(`/c/${communitySlug}/guides/${guideSlug}/edit`)}`);
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community) notFound();
  const membership = await getMembership(supabase, community.id, user.id);
  const isAdmin = isCommunityAdmin(community, membership, user.id);
  const isStaff = isCommunityStaff(community, membership, user.id);
  if (!isStaff) notFound();

  const guide = await getEditorialGuide(supabase, community.id, guideSlug);
  if (!guide) notFound();

  const overrides = parseOverrides(guide.content);
  const { destinations } = resolveGuideContent(overrides);
  const [updates, directory] = await Promise.all([getEditorialGuideUpdates(supabase, guide.id), getGuideDirectory(supabase, community.id, community.slug)]);
  const current = destinations.find((x) => x.key === d) ?? destinations[0];

  const listingOptions = [
    ...directory.restaurants.map((l) => ({ value: `business:${l.slug}`, label: `Directory · ${l.name}${l.locationLabel ? ` (${l.locationLabel})` : ""}` })),
    ...[...directory.bySlug.values()]
      .filter((l) => l.kind === "business" && l.category !== "restaurant")
      .map((l) => ({ value: `business:${l.slug}`, label: `Directory · ${l.name}${l.locationLabel ? ` (${l.locationLabel})` : ""}` })),
    ...directory.stays.map((l) => ({ value: `stay:${l.slug}`, label: `Stay · ${l.name}${l.locationLabel ? ` (${l.locationLabel})` : ""}` })),
  ].sort((a, b) => a.label.localeCompare(b.label));

  const guideHref = `/c/${community.slug}/guides/${guide.slug}`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <Link href={guideHref} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to the guide
      </Link>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">Edit: {guide.title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Changes appear on the public guide as soon as they&apos;re saved. Unsaved edits are kept in this browser if you refresh.
      </p>

      {isAdmin && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-foreground">Guide settings</h2>
          <div className="mt-3">
            <GuideSettingsForm
              communitySlug={community.slug}
              guideSlug={guide.slug}
              status={guide.status}
              lastReviewedOn={guide.last_reviewed_on}
              editorsNote={overrides.editorsNote ?? ""}
              heroPhoto={overrides.heroPhoto ?? null}
            />
          </div>
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-foreground">Local knowledge updates</h2>
        <p className="mt-1 text-sm text-muted-foreground">Short, dated notes shown under a destination: a new opening, a beach-access change, a road closure. Set a hide-after date for anything temporary.</p>
        <div className="mt-3">
          <GuideUpdatesManager communitySlug={community.slug} guideSlug={guide.slug} destinations={destinations.map((x) => ({ key: x.key, name: x.name }))} updates={updates} />
        </div>
      </section>

      {isAdmin && (
        <section className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-foreground">Destinations</h2>
            <a href={`${guideHref}#${current.key}`} className="inline-flex items-center gap-1 text-sm text-accent hover:underline">
              View {current.name} on the guide <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
          <nav aria-label="Choose a destination" className="mt-3 flex flex-wrap gap-2">
            {destinations.map((x) => (
              <Link
                key={x.key}
                href={`?d=${x.key}`}
                scroll={false}
                aria-current={x.key === current.key ? "page" : undefined}
                className={cn(
                  "rounded-full border px-3 py-1 text-sm",
                  x.key === current.key ? "border-accent bg-accent text-accent-foreground" : "border-border bg-card hover:bg-muted"
                )}
              >
                {x.rank}. {x.name}
                {overrides.destinations?.[x.key] ? " •" : ""}
              </Link>
            ))}
          </nav>
          <p className="mt-2 text-xs text-muted-foreground">• edited from the built-in content</p>
          <div className="mt-6">
            <DestinationEditor
              key={current.key}
              communitySlug={community.slug}
              guideSlug={guide.slug}
              destination={current}
              isOverridden={Boolean(overrides.destinations?.[current.key])}
              listingOptions={listingOptions}
            />
          </div>
        </section>
      )}
    </div>
  );
}
