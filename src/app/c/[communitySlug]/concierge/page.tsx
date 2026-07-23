import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCommunityBySlug } from "@/lib/data/community";
import { ConciergeView } from "./concierge-view";

export default async function ConciergePage({ params }: { params: Promise<{ communitySlug: string }> }) {
  const { communitySlug } = await params;
  const supabase = await createClient();

  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <ConciergeView communityId={community.id} communitySlug={community.slug} />
    </div>
  );
}
