import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpenCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCommunityBySlug, getMembership, isCommunityAdmin } from "@/lib/data/community";
import { getCommunitySpaces } from "@/lib/data/spaces";
import { getCurrentUser } from "@/lib/data/profile";
import { getCommunityEditorialGuides, getEditorialGuideViewStats, type GuideViewStats } from "@/lib/data/editorial-guides";
import { editorialGuideEntry } from "@/lib/guides/registry";
import { GuideImage } from "@/components/editorial-guide/guide-image";
import { EmptyState } from "@/components/ui/empty-state";
import { GuideViewStatsBadge } from "@/components/editorial-guide/guide-view-stats";

export const metadata: Metadata = { title: "Guides" };

// /guides — the community's editorial guides, plus a pointer to its
// member-written Guides space when it has one the visitor can see and the
// admins haven't taken it out of the menu.
export default async function GuidesIndexPage({ params }: { params: Promise<{ communitySlug: string }> }) {
  const { communitySlug } = await params;
  const supabase = await createClient();
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community) notFound();

  const user = await getCurrentUser(supabase);
  const [guides, spaces, membership, viewStats] = await Promise.all([
    getCommunityEditorialGuides(supabase, community.id),
    getCommunitySpaces(supabase, community.id),
    user ? getMembership(supabase, community.id, user.id) : Promise.resolve(null),
    user ? getEditorialGuideViewStats(supabase, community.id) : Promise.resolve(new Map<string, GuideViewStats>()),
  ]);
  const isStaff = isCommunityAdmin(community, membership, user?.id);
  // Only point at the member-written space while it's in the menu: an admin
  // who has taken it out of the nav doesn't want visitors sent there.
  const memberGuides = spaces.find((s) => s.space_type === "guides" && s.show_in_nav) ?? null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Guides</h1>
      <p className="mt-1 text-muted-foreground">Curated guides from the {community.name} editors.</p>

      {guides.length === 0 ? (
        <div className="mt-6">
          <EmptyState icon={<BookOpenCheck className="h-6 w-6" />} title="No guides yet" description="Editorial guides will appear here." />
        </div>
      ) : (
        <ul className="mt-6 grid gap-5 sm:grid-cols-2">
          {guides.map((guide) => {
            const entry = editorialGuideEntry(guide.slug);
            const hero = entry ? entry.hero(guide.content) : null;
            return (
              <li key={guide.id}>
                <Link href={`/c/${community.slug}/guides/${guide.slug}`} className="group block overflow-hidden rounded-xl border border-border bg-card hover:shadow-md">
                  {hero ? <GuideImage src={hero.src} alt={hero.alt} width={hero.width} sizes="(min-width: 640px) 440px, 100vw" className="aspect-[16/9]" /> : <div className="aspect-[16/9] bg-muted" />}
                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-foreground group-hover:text-accent">{entry?.cardTitle ?? guide.title}</h2>
                    {entry && <p className="mt-1 text-sm text-muted-foreground">{entry.blurb}</p>}
                    {guide.status === "draft" && <p className="mt-2 text-xs font-medium text-muted-foreground">Draft — visible to staff only</p>}
                    {isStaff && (
                      <p className="mt-2">
                        <GuideViewStatsBadge stats={viewStats.get(guide.id)} />
                      </p>
                    )}
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent">
                      Read the guide <ArrowRight className="h-4 w-4" aria-hidden />
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {memberGuides && (
        <p className="mt-8 text-sm text-muted-foreground">
          Looking for guides written by members?{" "}
          <Link href={`/c/${community.slug}/spaces/${memberGuides.slug}`} className="font-medium text-accent hover:underline">
            Visit {memberGuides.name}
          </Link>
          .
        </p>
      )}
    </div>
  );
}
