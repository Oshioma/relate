import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, getProfile } from "@/lib/data/profile";
import { getMemberInterests, getMemberSkills, getMemberHelpTopics, getMemberLocation } from "@/lib/data/member-profile";
import { Card, CardContent } from "@/components/ui/card";
import { ProfileForm } from "./profile-form";
import { ProfileTagsSection } from "./profile-tags-section";
import { LocationForm } from "./location-form";
import { PrivacyForm } from "./privacy-form";

export default async function SettingsPage() {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  if (!user) {
    redirect("/login?next=/settings");
  }

  const profile = await getProfile(supabase, user.id);
  if (!profile) {
    redirect("/dashboard");
  }

  const [interests, skills, needsHelpWith, canHelpWith, location] = await Promise.all([
    getMemberInterests(supabase, user.id),
    getMemberSkills(supabase, user.id),
    getMemberHelpTopics(supabase, user.id, "needs_help"),
    getMemberHelpTopics(supabase, user.id, "can_help"),
    getMemberLocation(supabase, user.id),
  ]);

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-6 sm:py-10">
      <Link href="/dashboard" className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <h1 className="mb-1 text-2xl font-semibold tracking-tight text-foreground">Profile settings</h1>
      <p className="mb-8 text-sm text-muted-foreground">This is how you&apos;ll appear across every community.</p>

      <Card>
        <CardContent className="pt-6">
          <ProfileForm profile={profile} />
        </CardContent>
      </Card>

      <div className="mt-6">
        <Card>
          <CardContent className="pt-6">
            <ProfileTagsSection
              interests={interests}
              skills={skills}
              needsHelpWith={needsHelpWith}
              canHelpWith={canHelpWith}
            />
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardContent className="pt-6">
            <LocationForm location={location} />
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardContent className="pt-6">
            <PrivacyForm profile={profile} />
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardContent className="flex items-center justify-between gap-4 pt-6">
            <div>
              <p className="text-sm font-medium text-foreground">Business profile</p>
              <p className="text-sm text-muted-foreground">Add a business alongside your personal profile.</p>
            </div>
            <Link href="/settings/business" className="text-sm font-medium text-accent hover:underline">
              Manage
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
