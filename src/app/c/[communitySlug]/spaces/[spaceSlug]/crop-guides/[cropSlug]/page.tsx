import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCommunityBySlug } from "@/lib/data/community";
import { getSpaceBySlug } from "@/lib/data/spaces";
import { getCropDetail, getCropRegions, getCommunityCropRegions, getCropCalendar } from "@/lib/data/crop-guides";
import { calcMoonPhase } from "@/lib/lunar";
import { CropDetailView } from "../../crop-detail-view";

export default async function CropDetailPage({
  params,
}: {
  params: Promise<{ communitySlug: string; spaceSlug: string; cropSlug: string }>;
}) {
  const { communitySlug, spaceSlug, cropSlug } = await params;
  const supabase = await createClient();

  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community) notFound();

  const space = await getSpaceBySlug(supabase, community.id, spaceSlug);
  if (!space || space.space_type !== "crop_guides") notFound();

  const detail = await getCropDetail(supabase, cropSlug);
  if (!detail) notFound();

  const [regions, communityRegions, calendar] = await Promise.all([
    getCropRegions(supabase),
    getCommunityCropRegions(supabase, community.id),
    getCropCalendar(supabase, detail.crop.id),
  ]);

  // Current moon phase / month are pure functions of today's date; computing
  // them on the server keeps the render deterministic (no hydration mismatch).
  const now = new Date();
  const currentPhase = calcMoonPhase(now);
  const currentMonth = now.getMonth() + 1;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <Link
        href={`/c/${community.slug}/spaces/${space.slug}`}
        className="mb-4 inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-muted-foreground hover:underline"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        {space.name}
      </Link>

      <CropDetailView
        detail={detail}
        currentPhase={currentPhase}
        currentMonth={currentMonth}
        regions={regions}
        communityRegions={communityRegions}
        calendar={calendar}
        communitySlug={community.slug}
        spaceSlug={space.slug}
      />
    </div>
  );
}
