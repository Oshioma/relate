import Link from "next/link";
import { Globe, MapPin, Briefcase } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";
import type { MemberLocation, Profile } from "@/types/database";

const SOCIAL_LABELS: Record<string, string> = {
  linkedin: "LinkedIn",
  twitter: "Twitter / X",
  instagram: "Instagram",
  facebook: "Facebook",
};

export function ProfileHeader({
  profile,
  location,
  isOwnProfile,
  showOnlineStatus,
  showSocialLinks,
}: {
  profile: Profile;
  location: MemberLocation | null;
  isOwnProfile: boolean;
  showOnlineStatus: boolean;
  showSocialLinks: boolean;
}) {
  const socialEntries = Object.entries(profile.social_links).filter(([, url]) => Boolean(url));
  const locationLabel = location?.is_visible
    ? [location.city, location.region, location.country].filter(Boolean).join(", ")
    : null;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-4">
        <Avatar src={profile.avatar_url} name={profile.full_name || profile.username} size={80} />
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            {profile.full_name || profile.username}
          </h1>
          <p className="text-sm text-muted-foreground">@{profile.username}</p>

          {(profile.profession || profile.company) && (
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-foreground">
              <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
              {[profile.profession, profile.company].filter(Boolean).join(" at ")}
            </p>
          )}

          {locationLabel && (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {locationLabel}
            </p>
          )}

          {profile.bio && <p className="mt-3 max-w-xl text-sm text-foreground">{profile.bio}</p>}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge tone="accent">{profile.contribution_score} points</Badge>
            {showOnlineStatus && profile.last_active_at && (
              <Badge tone="neutral">Active {formatRelativeTime(profile.last_active_at)}</Badge>
            )}
          </div>

          {showSocialLinks && (profile.website || socialEntries.length > 0) && (
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              {profile.website && (
                <a href={profile.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-accent hover:underline">
                  <Globe className="h-3.5 w-3.5" /> Website
                </a>
              )}
              {socialEntries.map(([key, url]) => (
                <a key={key} href={url} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                  {SOCIAL_LABELS[key] ?? key}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {isOwnProfile && (
        <Link href="/settings" className="shrink-0 text-sm font-medium text-accent hover:underline">
          Edit profile
        </Link>
      )}
    </div>
  );
}
