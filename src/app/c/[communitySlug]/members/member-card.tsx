import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { DirectoryMember } from "@/lib/data/member-directory";

export function MemberCard({ member, communitySlug }: { member: DirectoryMember; communitySlug: string }) {
  const { profile } = member;
  const tags = [...member.interests, ...member.skills].slice(0, 3);

  return (
    <Link href={`/c/${communitySlug}/members/${profile.username}`} className="block h-full">
      <Card className="h-full transition-shadow hover:shadow-sm">
        <CardContent className="pt-5">
          <div className="flex items-center gap-3">
            <Avatar src={profile.avatar_url} name={profile.full_name || profile.username} size={40} />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{profile.full_name || profile.username}</p>
              <p className="truncate text-xs text-muted-foreground">@{profile.username}</p>
            </div>
          </div>

          {(profile.profession || profile.company) && (
            <p className="mt-2 truncate text-xs text-muted-foreground">
              {[profile.profession, profile.company].filter(Boolean).join(" at ")}
            </p>
          )}

          {member.business && !profile.hide_business_profile && (
            <p className="mt-1 truncate text-xs font-medium text-accent">{member.business.business_name}</p>
          )}

          {tags.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1">
              {tags.map((tag) => (
                <Badge key={tag} tone="neutral">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {profile.contribution_score > 0 && (
            <p className="mt-2.5 text-xs text-muted-foreground">{profile.contribution_score} points</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
