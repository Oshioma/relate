import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership } from "@/lib/data/community";
import { getSpaceBySlug } from "@/lib/data/spaces";
import {
  getCropDetail,
  getCropRegions,
  getCommunityCropRegions,
  getCropCalendar,
  getCropJournals,
  computeJournalStats,
  getCropTips,
  getSavedCropIds,
} from "@/lib/data/crop-guides";
import { calcMoonPhase } from "@/lib/lunar";
import { isCropAssistantConfigured } from "@/lib/ai/crop-assistant";
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

  const user = await getCurrentUser(supabase);
  const detail = await getCropDetail(supabase, cropSlug);
  if (!detail) notFound();

  const [regions, communityRegions, calendar, journals, tips, savedIds, membership] = await Promise.all([
    getCropRegions(supabase),
    getCommunityCropRegions(supabase, community.id),
    getCropCalendar(supabase, detail.crop.id),
    getCropJournals(supabase, detail.crop.id, community.id),
    getCropTips(supabase, detail.crop.id, community.id),
    user ? getSavedCropIds(supabase, user.id) : Promise.resolve([]),
    user ? getMembership(supabase, community.id, user.id) : Promise.resolve(null),
  ]);

  const journalStats = computeJournalStats(journals);
  const canContribute = membership?.status === "active";
  const isStaff = membership?.status === "active" && (membership.role === "owner" || membership.role === "admin" || membership.role === "moderator");
  const isSaved = savedIds.includes(detail.crop.id);

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
        journals={journals}
        journalStats={journalStats}
        tips={tips}
        canContribute={Boolean(canContribute)}
        isStaff={Boolean(isStaff)}
        isSaved={isSaved}
        assistantEnabled={isCropAssistantConfigured()}
        viewerId={user?.id ?? ""}
        communityId={community.id}
        communitySlug={community.slug}
        spaceSlug={space.slug}
      />
    </div>
  );
}
