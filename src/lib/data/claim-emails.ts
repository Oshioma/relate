import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { isResendConfigured, sendNotificationEmail } from "@/lib/email";

// Email counterparts to the in-app claim notifications created by the DB
// triggers (see 20260728093532_notify_business_claims.sql). Kept out of the
// server actions themselves so the action stays readable, and best-effort
// throughout: emails need the service-role client (auth.users holds the
// addresses — profiles doesn't) and Resend, and any failure is swallowed with
// a console warning. The claim itself, and the bell notification, don't depend
// on the email landing.

type AdminClient = ReturnType<typeof createAdminClient>;

async function emailForUser(admin: AdminClient, userId: string): Promise<string | null> {
  const { data, error } = await admin.auth.admin.getUserById(userId);
  if (error) return null;
  return data.user?.email ?? null;
}

// A new pending claim — notify every active staff member of the community.
export async function emailStaffOfNewClaim(input: {
  communityId: string;
  claimantId: string;
  claimantName: string;
  communityName: string | null;
  businessName: string;
  message: string | null;
  url: string;
}): Promise<void> {
  if (!isResendConfigured()) return;

  try {
    const admin = createAdminClient();

    const { data: staff, error } = await admin
      .from("community_memberships")
      .select("user_id")
      .eq("community_id", input.communityId)
      .eq("status", "active")
      .in("role", ["owner", "admin", "moderator"])
      .neq("user_id", input.claimantId);
    if (error || !staff?.length) return;

    const emails = (await Promise.all(staff.map((s) => emailForUser(admin, s.user_id)))).filter(
      (e): e is string => Boolean(e)
    );

    await Promise.all(
      emails.map((to) =>
        sendNotificationEmail({
          to,
          subject: `New claim on "${input.businessName}"`,
          heading: `${input.claimantName} wants to claim "${input.businessName}"`,
          body: input.message,
          ctaLabel: "Review the claim",
          ctaUrl: input.url,
          communityName: input.communityName,
        })
      )
    );
  } catch (err) {
    console.warn("[claim-emails] failed to email staff of new claim:", err);
  }
}

// A claim was approved or rejected — notify the claimant(s).
export async function emailClaimantsOfDecision(input: {
  claimantIds: string[];
  communityName: string | null;
  businessName: string;
  status: "approved" | "rejected";
  url: string;
}): Promise<void> {
  if (!isResendConfigured() || input.claimantIds.length === 0) return;

  try {
    const admin = createAdminClient();
    const heading = `Your claim on "${input.businessName}" was ${input.status}`;

    await Promise.all(
      input.claimantIds.map(async (userId) => {
        const to = await emailForUser(admin, userId);
        if (!to) return;
        await sendNotificationEmail({
          to,
          subject: heading,
          heading,
          ctaLabel: "View the listing",
          ctaUrl: input.url,
          communityName: input.communityName,
        });
      })
    );
  } catch (err) {
    console.warn("[claim-emails] failed to email claimant of decision:", err);
  }
}
