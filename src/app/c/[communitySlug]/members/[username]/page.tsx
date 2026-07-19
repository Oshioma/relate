import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, CalendarDays, BookOpen, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, getProfileByUsername } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership, getUserCommunities } from "@/lib/data/community";
import { getCommunityProfileFieldsWithValues } from "@/lib/data/community-profile-fields";
import {
  getMemberInterests,
  getMemberSkills,
  getMemberHelpTopics,
  getMemberLocation,
  getBusinessProfile,
} from "@/lib/data/member-profile";
import {
  getMemberRecentActivity,
  getMemberResources,
  getMemberHostedEvents,
  getMemberAttendedEvents,
} from "@/lib/data/member-activity";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { formatDate, formatDateTime } from "@/lib/utils";
import { ProfileHeader } from "./profile-header";
import { ProfileTagsView } from "./profile-tags-view";
import { ProfileFieldAnswersView } from "./profile-field-answers-view";
import { ProfileFieldAnswersForm } from "./profile-field-answers-form";
import { BusinessProfileCard } from "./business-profile-card";
import { MemberActivityList } from "./member-activity-list";

export default async function MemberProfilePage({
  params,
}: {
  params: Promise<{ communitySlug: string; username: string }>;
}) {
  const { communitySlug, username } = await params;
  const supabase = await createClient();

  const user = await getCurrentUser(supabase);
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community || !user) notFound();

  const profile = await getProfileByUsername(supabase, username);
  if (!profile) notFound();

  const profileMembership = await getMembership(supabase, community.id, profile.id);
  if (!profileMembership || profileMembership.status !== "active") notFound();

  const isOwnProfile = user.id === profile.id;

  const [
    interests,
    skills,
    needsHelpWith,
    canHelpWith,
    location,
    business,
    profileFields,
    activity,
    resources,
    hostedEvents,
    attendedEvents,
    communities,
  ] = await Promise.all([
    getMemberInterests(supabase, profile.id),
    getMemberSkills(supabase, profile.id),
    getMemberHelpTopics(supabase, profile.id, "needs_help"),
    getMemberHelpTopics(supabase, profile.id, "can_help"),
    getMemberLocation(supabase, profile.id),
    getBusinessProfile(supabase, profile.id),
    getCommunityProfileFieldsWithValues(supabase, community.id, profile.id),
    getMemberRecentActivity(supabase, community.id, profile.id),
    getMemberResources(supabase, community.id, profile.id),
    getMemberHostedEvents(supabase, community.id, profile.id),
    getMemberAttendedEvents(supabase, community.id, profile.id),
    isOwnProfile || !profile.hide_communities ? getUserCommunities(supabase, profile.id) : Promise.resolve([]),
  ]);

  const showSocialLinks = isOwnProfile || !profile.hide_social_links;
  const showOnlineStatus = isOwnProfile || !profile.hide_online_status;
  const showBusiness = business && (isOwnProfile || !profile.hide_business_profile);
  const showCommunities = isOwnProfile || !profile.hide_communities;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <Card className="mb-6">
        <CardContent className="pt-6">
          <ProfileHeader
            profile={profile}
            location={location}
            isOwnProfile={isOwnProfile}
            showOnlineStatus={showOnlineStatus}
            showSocialLinks={showSocialLinks}
          />
        </CardContent>
      </Card>

      <ProfileTagsView interests={interests} skills={skills} needsHelpWith={needsHelpWith} canHelpWith={canHelpWith} />

      {profileFields.length > 0 && (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
              {community.name} profile
            </h2>
            {isOwnProfile ? (
              <ProfileFieldAnswersForm
                communityId={community.id}
                communitySlug={community.slug}
                username={profile.username}
                fields={profileFields}
              />
            ) : (
              <ProfileFieldAnswersView fields={profileFields} />
            )}
          </CardContent>
        </Card>
      )}

      {showBusiness && (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">Business</h2>
            <BusinessProfileCard business={business} />
          </CardContent>
        </Card>
      )}

      {showCommunities && communities.length > 0 && (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">Communities</h2>
            <div className="flex flex-wrap gap-3">
              {communities.map((c) => (
                <Link
                  key={c.id}
                  href={`/c/${c.slug}`}
                  className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm text-foreground hover:bg-muted"
                >
                  <Avatar src={c.logo_url} name={c.name} size={24} />
                  {c.name}
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activity.length > 0 && (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">Recent activity</h2>
            <MemberActivityList activity={activity} communitySlug={community.slug} />
          </CardContent>
        </Card>
      )}

      {resources.length > 0 && (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-muted-foreground">
              <BookOpen className="h-4 w-4" /> Resources shared
            </h2>
            <ul className="space-y-2">
              {resources.map((resource) => (
                <li key={resource.id}>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline"
                  >
                    {resource.title}
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {(hostedEvents.length > 0 || attendedEvents.length > 0) && (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-muted-foreground">
              <CalendarDays className="h-4 w-4" /> Events
            </h2>

            {hostedEvents.length > 0 && (
              <div className="mb-4">
                <p className="mb-1.5 text-xs font-medium text-muted-foreground">Hosted</p>
                <ul className="space-y-1.5">
                  {hostedEvents.map((event) => (
                    <li key={event.id} className="text-sm text-foreground">
                      {event.title} <span className="text-muted-foreground">— {formatDateTime(event.start_time)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {attendedEvents.length > 0 && (
              <div>
                <p className="mb-1.5 text-xs font-medium text-muted-foreground">Attended</p>
                <ul className="space-y-1.5">
                  {attendedEvents.map((event) => (
                    <li key={event.id} className="text-sm text-foreground">
                      {event.title} <span className="text-muted-foreground">— {formatDate(event.start_time)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="mt-6 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Users className="h-3.5 w-3.5" />
        Member of {community.name}
      </div>
    </div>
  );
}
