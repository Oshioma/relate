import Link from "@/components/ui/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser, getProfile } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership, isCommunityAdmin } from "@/lib/data/community";
import { EMAIL_TEMPLATE_KINDS } from "@/lib/email-templates";
import type { CommunityEmailTemplate } from "@/types/database";
import { EmailTemplateForm } from "./email-template-form";

// A community's own invite and welcome emails, for its owner and admins. The
// platform super admin can look but not change anything, as on the main admin
// page.
export default async function CommunityEmailsPage({ params }: { params: Promise<{ communitySlug: string }> }) {
  const { communitySlug } = await params;
  const supabase = await createClient();

  const user = await getCurrentUser(supabase);
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community || !user) notFound();

  const [membership, profile] = await Promise.all([
    getMembership(supabase, community.id, user.id),
    getProfile(supabase, user.id),
  ]);
  const isAdmin = isCommunityAdmin(community, membership, user.id);
  const platformView = !isAdmin && Boolean(profile?.is_super_admin);
  if (!isAdmin && !platformView) redirect(`/c/${community.slug}`);

  const db = platformView ? createAdminClient() : supabase;
  const { data } = await db.from("community_email_templates").select("*").eq("community_id", community.id);
  const saved = new Map((data ?? []).map((t: CommunityEmailTemplate) => [t.kind, t]));

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <Link
        href={`/c/${community.slug}/admin`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to admin
      </Link>
      <h1 className="mb-1 flex items-center gap-2 text-2xl font-semibold tracking-tight text-foreground">
        <Mail className="h-6 w-6" />
        Emails
      </h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Write {community.name}&apos;s own invitations and welcome, with your logo and pictures. Until you save one, the
        standard Relate email goes out.
      </p>

      <fieldset disabled={platformView} className="m-0 min-w-0 space-y-6 border-0 p-0">
        {platformView && (
          <p className="rounded-md border border-accent/40 bg-accent-soft px-4 py-3 text-sm text-accent">
            Read-only: you&apos;re the platform admin, not an owner or admin of {community.name}.
          </p>
        )}
        {EMAIL_TEMPLATE_KINDS.map((kind) => {
          const template = saved.get(kind) ?? null;
          return (
            <EmailTemplateForm
              // Remount on save or reset so the editor shows what is stored.
              key={`${kind}:${template?.updated_at ?? "standard"}`}
              kind={kind}
              communityId={community.id}
              communitySlug={community.slug}
              communityName={community.name}
              communityLogoUrl={community.logo_url}
              saved={template}
            />
          );
        })}
      </fieldset>
    </div>
  );
}
