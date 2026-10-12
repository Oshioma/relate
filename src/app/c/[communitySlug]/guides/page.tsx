import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpenCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCommunityBySlug } from "@/lib/data/community";
import { getCommunitySpaces } from "@/lib/data/spaces";
import { getCommunityEditorialGuides } from "@/lib/data/editorial-guides";
import { parseOverrides, resolveGuideContent, WHERE_TO_STAY_SLUG } from "@/lib/guides/where-to-stay/content";
import { GuideImage } from "@/components/editorial-guide/guide-image";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = { title: "Guides" };

// /guides — the community's editorial guides, plus a pointer to its
// member-written Guides space when it has one the visitor can see.
export default async function GuidesIndexPage({ params }: { params: Promise<{ communitySlug: string }> }) {
  const { communitySlug } = await params;
  const supabase = await createClient();
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community) notFound();

  const [guides, spaces] = await Promise.all([getCommunityEditorialGuides(supabase, community.id), getCommunitySpaces(supabase, community.id)]);
  const memberGuides = spaces.find((s) => s.space_type === "guides") ?? null;

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
            const hero = guide.slug === WHERE_TO_STAY_SLUG ? resolveGuideContent(parseOverrides(guide.content)).heroPhoto : null;
            return (
              <li key={guide.id}>
                <Link href={`/c/${community.slug}/guides/${guide.slug}`} className="group block overflow-hidden rounded-xl border border-border bg-card hover:shadow-md">
                  {hero ? <GuideImage src={hero.src} alt={hero.alt} width={hero.width} sizes="(min-width: 640px) 440px, 100vw" className="aspect-[16/9]" /> : <div className="aspect-[16/9] bg-muted" />}
                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-foreground group-hover:text-accent">{guide.title}</h2>
                    {guide.slug === WHERE_TO_STAY_SLUG && (
                      <p className="mt-1 text-sm text-muted-foreground">Compare Zanzibar&apos;s 14 best beach destinations and find the right one for your holiday.</p>
                    )}
                    {guide.status === "draft" && <p className="mt-2 text-xs font-medium text-muted-foreground">Draft — visible to staff only</p>}
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
