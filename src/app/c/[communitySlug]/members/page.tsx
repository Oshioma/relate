import { notFound } from "next/navigation";
import { Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { getCommunityBySlug, getCommunityMembers } from "@/lib/data/community";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

const roleTone = {
  owner: "accent",
  admin: "accent",
  moderator: "neutral",
  member: "neutral",
} as const;

export default async function MembersPage({ params }: { params: Promise<{ communitySlug: string }> }) {
  const { communitySlug } = await params;
  const supabase = await createClient();

  const user = await getCurrentUser(supabase);
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community || !user) notFound();

  const members = await getCommunityMembers(supabase, community.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight text-foreground">
        Members <span className="text-muted-foreground">({members.length})</span>
      </h1>

      {members.length === 0 ? (
        <EmptyState icon={<Users className="h-6 w-6" />} title="No members yet" />
      ) : (
        <Card>
          <CardContent className="divide-y divide-border p-0">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar src={member.profile?.avatar_url} name={member.profile?.full_name || member.profile?.username} size={36} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {member.profile?.full_name || member.profile?.username}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">@{member.profile?.username}</p>
                  </div>
                </div>
                <Badge tone={roleTone[member.role]}>{member.role}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
