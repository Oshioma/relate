import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCommunityBySlug } from "@/lib/data/community";
import { getSpaceBySlug } from "@/lib/data/spaces";
import { getCropDetail } from "@/lib/data/crop-guides";
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

  // Current moon phase is a pure function of today's date; computing it on the
  // server keeps the render deterministic (no hydration mismatch).
  const currentPhase = calcMoonPhase(new Date());

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <Link
        href={`/c/${community.slug}/spaces/${space.slug}`}
        className="mb-4 inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-muted-foreground hover:underline"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        {space.name}
      </Link>

      <CropDetailView detail={detail} currentPhase={currentPhase} communitySlug={community.slug} spaceSlug={space.slug} />
    </div>
  );
}
