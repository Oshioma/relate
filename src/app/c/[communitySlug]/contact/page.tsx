import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCommunityBySlug } from "@/lib/data/community";
import { RichText } from "@/components/ui/rich-text";
import { CommunityContactForm } from "./community-contact-form";

export const metadata: Metadata = { title: "Contact" };

export default async function CommunityContactPage({ params }: { params: Promise<{ communitySlug: string }> }) {
  const { communitySlug } = await params;
  const supabase = await createClient();

  // Guest-readable: the community layout already resolves visibility and gates
  // the shell, so anyone who can reach this route may use the contact form.
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-2 text-2xl font-semibold tracking-tight text-foreground">Contact {community.name}</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Send a message and the team will reply by email.
      </p>

      {community.contact_info && (
        <RichText content={community.contact_info} className="mb-6 rounded-lg border border-border bg-card p-5" />
      )}

      <CommunityContactForm communityId={community.id} />
    </div>
  );
}
