import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCommunityBySlug } from "@/lib/data/community";
import { RichText } from "@/components/ui/rich-text";
import { PROSE_CLASS } from "@/lib/prose";

export const metadata: Metadata = { title: "Community guidelines" };

export default async function GuidelinesPage({ params }: { params: Promise<{ communitySlug: string }> }) {
  const { communitySlug } = await params;
  const supabase = await createClient();

  // Guest-readable: the community layout already resolves visibility and gates
  // the shell, so anyone who can reach this route may read the guidelines.
  const community = await getCommunityBySlug(supabase, communitySlug);
  // No guidelines set means there's nothing to show — treat it as not found so
  // the link stays hidden and a stray URL 404s rather than showing a blank page.
  if (!community || !community.guidelines) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-1 text-2xl font-semibold tracking-tight text-foreground">Community guidelines</h1>
      <p className="mb-6 text-sm text-muted-foreground">How we keep {community.name} a good place to be.</p>
      <RichText content={community.guidelines} className={`rounded-lg border border-border bg-card p-5 ${PROSE_CLASS}`} />
    </div>
  );
}
