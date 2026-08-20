import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Inbox as InboxIcon, Settings2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership } from "@/lib/data/community";
import { getCommunityContactMessages } from "@/lib/data/contact-messages";
import { CommunityContactInbox } from "./contact-inbox";

export const metadata: Metadata = { title: "Inbox" };

// The community's message inbox. This used to be a section buried in the admin
// page, which meant every read of a message came with a wall of settings; it
// gets its own route so it can be linked to directly (the contact-form
// notification points here) and read on its own.
export default async function CommunityInboxPage({
  params,
  searchParams,
}: {
  params: Promise<{ communitySlug: string }>;
  // ?message=<id> comes from the "new contact message" notification, which
  // links to the one message it's about.
  searchParams: Promise<{ message?: string }>;
}) {
  const { communitySlug } = await params;
  const { message: highlightId } = await searchParams;
  const supabase = await createClient();

  const user = await getCurrentUser(supabase);
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community || !user) notFound();

  // Same gate as the contact_messages select policy: only this community's
  // owner and admins can read what members and visitors have sent in.
  const membership = await getMembership(supabase, community.id, user.id);
  const isStaff = membership?.status === "active" && (membership.role === "owner" || membership.role === "admin");
  if (!isStaff) {
    redirect(`/c/${community.slug}`);
  }

  const messages = await getCommunityContactMessages(supabase, community.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <InboxIcon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">Inbox</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Messages sent to {community.name} through its contact page, newest first.
            </p>
          </div>
        </div>
        <Link
          href={`/c/${community.slug}/admin#contact`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <Settings2 className="h-3.5 w-3.5" />
          Contact page settings
        </Link>
      </div>

      <CommunityContactInbox
        messages={messages}
        communitySlug={community.slug}
        communityName={community.name}
        highlightId={highlightId ?? null}
      />
    </div>
  );
}
