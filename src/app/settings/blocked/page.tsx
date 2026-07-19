import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ShieldOff } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { getBlockedMembers } from "@/lib/data/member-profile";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { UnblockButton } from "./unblock-button";

export default async function BlockedMembersPage() {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  if (!user) {
    redirect("/login?next=/settings/blocked");
  }

  const blocked = await getBlockedMembers(supabase, user.id);

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-6 sm:py-10">
      <Link href="/settings" className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to settings
      </Link>

      <h1 className="mb-1 text-2xl font-semibold tracking-tight text-foreground">Blocked members</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Blocked members can&apos;t message you and won&apos;t appear together with you in the directory.
      </p>

      {blocked.length === 0 ? (
        <EmptyState icon={<ShieldOff className="h-6 w-6" />} title="No blocked members" />
      ) : (
        <Card>
          <CardContent className="divide-y divide-border p-0">
            {blocked.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar src={entry.blocked.avatar_url} name={entry.blocked.full_name || entry.blocked.username} size={36} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {entry.blocked.full_name || entry.blocked.username}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">@{entry.blocked.username}</p>
                  </div>
                </div>
                <UnblockButton profileId={entry.blocked.id} />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
