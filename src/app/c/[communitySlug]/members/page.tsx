import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership } from "@/lib/data/community";
import {
  getDirectoryMembers,
  isDiscoverable,
  getNewMembers,
  getRecommendedMembers,
  getMembersNearYou,
  getRecentlyActiveMembers,
  getTopContributors,
  getBusinesses,
} from "@/lib/data/member-directory";
import { DiscoverySection } from "./discovery-section";
import { MemberDirectoryList } from "./member-directory-list";

export default async function MembersPage({ params }: { params: Promise<{ communitySlug: string }> }) {
  const { communitySlug } = await params;
  const supabase = await createClient();

  const user = await getCurrentUser(supabase);
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community || !user) notFound();

  const [members, membership] = await Promise.all([
    getDirectoryMembers(supabase, community.id),
    getMembership(supabase, community.id, user.id),
  ]);

  const isAdmin = membership?.status === "active" && (membership.role === "owner" || membership.role === "admin");
  const viewer = members.find((m) => m.profile.id === user.id);
  const discoverable = members.filter(isDiscoverable);

  const newMembers = getNewMembers(discoverable);
  const recommended = getRecommendedMembers(
    discoverable,
    user.id,
    viewer?.interests ?? [],
    viewer?.skills ?? [],
    viewer?.profile.profession ?? null
  );
  const nearYou = getMembersNearYou(discoverable, viewer?.location ?? null);
  const recentlyActive = getRecentlyActiveMembers(discoverable);
  const topContributors = getTopContributors(discoverable);
  const businesses = getBusinesses(discoverable);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight text-foreground">
        Members <span className="text-muted-foreground">({members.length})</span>
      </h1>

      <DiscoverySection title="Recommended for you" members={recommended} communitySlug={community.slug} />
      <DiscoverySection title="New members" members={newMembers} communitySlug={community.slug} />
      <DiscoverySection title="Members near you" members={nearYou} communitySlug={community.slug} />
      <DiscoverySection title="Recently active" members={recentlyActive} communitySlug={community.slug} />
      <DiscoverySection title="Top contributors" members={topContributors} communitySlug={community.slug} />
      <DiscoverySection title="Businesses" members={businesses} communitySlug={community.slug} />

      <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">All members</h2>
      <MemberDirectoryList members={members} communitySlug={community.slug} currentUserId={user.id} isAdmin={Boolean(isAdmin)} />
    </div>
  );
}
