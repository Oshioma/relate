import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import { getCommunityBySlug } from "@/lib/data/community";
import { getSpaceBySlug } from "@/lib/data/spaces";
import { uploadTargetFor } from "@/lib/space-files";
import { UploadTargetProvider } from "@/components/ui/upload-target";

// Everything a member uploads on a space's pages (posts, comments, resources,
// journal, journeys, the 64 arts board) goes to the space's private folder
// when visitors can't open the space, so the file is no more open than the
// post it sits in. The page itself still decides who sees what.
export default async function SpaceLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ communitySlug: string; spaceSlug: string }>;
}) {
  const { communitySlug, spaceSlug } = await params;
  const supabase = await createClient();
  const community = await getCommunityBySlug(supabase, communitySlug);
  const space = community ? await getSpaceBySlug(supabase, community.id, spaceSlug) : null;
  const target = community && space ? uploadTargetFor(space, community) : null;

  return <UploadTargetProvider target={target}>{children}</UploadTargetProvider>;
}
