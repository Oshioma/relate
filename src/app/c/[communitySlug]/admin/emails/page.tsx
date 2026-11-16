import Link from "@/components/ui/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser, getProfile } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership, isCommunityAdmin } from "@/lib/data/community";
import { EMAIL_TEMPLATE_KINDS } from "@/lib/email-templates";
import { isResendConfigured } from "@/lib/email";
import { formatMoney } from "@/lib/utils";
import type { CommunityActivation, CommunityEmailTemplate } from "@/types/database";
import { EmailTemplateForm } from "./email-template-form";
import { SendEmailsSection, type GivableTier, type SendableMember } from "./send-emails-section";

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

  // For "Send an email": the members to pick from, the latest "we've moved"
  // email each was sent, and the paid memberships that can be given free.
  const [{ data: memberRows }, { data: activationRows }, { data: tierRows }] = await Promise.all([
    db
      .from("community_memberships")
      .select("user_id, profiles(full_name, username)")
      .eq("community_id", community.id)
      .eq("status", "active"),
    db
      .from("community_activations")
      .select("user_id, kind, created_at, used_at")
      .eq("community_id", community.id)
      .order("created_at", { ascending: false }),
    db
      .from("community_tiers")
      .select("id, name, price_cents, currency, archived_at, sort_order")
      .eq("community_id", community.id)
      .is("archived_at", null)
      .order("sort_order", { ascending: true }),
  ]);

  const latestSent = new Map<string, Pick<CommunityActivation, "kind" | "created_at" | "used_at">>();
  for (const row of activationRows ?? []) {
    if (!latestSent.has(row.user_id)) latestSent.set(row.user_id, row);
  }
  const members: SendableMember[] = (memberRows ?? [])
    .filter((m) => m.user_id !== user.id)
    .map((m) => {
      const p = (Array.isArray(m.profiles) ? m.profiles[0] : m.profiles) as { full_name: string | null; username: string | null } | null;
      const sent = latestSent.get(m.user_id);
      return {
        id: m.user_id,
        name: p?.full_name || p?.username || "Unnamed member",
        username: p?.username ?? null,
        lastSent: sent ? { kind: sent.kind, at: sent.created_at, activatedAt: sent.used_at } : null,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
  // The cheapest paid membership is ticked to start with: for Escape Space
  // that's the £10 one with the daily meditations.
  const paidTiers = (tierRows ?? []).filter((t) => t.price_cents > 0);
  const cheapest = paidTiers.reduce<(typeof paidTiers)[number] | null>(
    (best, t) => (!best || t.price_cents < best.price_cents ? t : best),
    null
  );
  const tiers: GivableTier[] = paidTiers.map((t) => ({
    id: t.id,
    name: t.name,
    price: `${formatMoney(t.price_cents, t.currency)} a month`,
    suggested: t.id === cheapest?.id,
  }));

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
        Invite people with the right email, and write {community.name}&apos;s own wording for each one, with your logo
        and pictures. Until you save one, the standard Relate email goes out.
      </p>

      <fieldset disabled={platformView} className="m-0 min-w-0 space-y-6 border-0 p-0">
        {platformView && (
          <p className="rounded-md border border-accent/40 bg-accent-soft px-4 py-3 text-sm text-accent">
            Read-only: you&apos;re the platform admin, not an owner or admin of {community.name}.
          </p>
        )}
        <SendEmailsSection
          communityId={community.id}
          communitySlug={community.slug}
          members={members}
          tiers={tiers}
          canSend={isResendConfigured()}
        />
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
