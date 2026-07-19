import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { getBusinessProfile } from "@/lib/data/member-profile";
import { Card, CardContent } from "@/components/ui/card";
import { BusinessForm } from "./business-form";

export default async function BusinessProfilePage() {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  if (!user) {
    redirect("/login?next=/settings/business");
  }

  const business = await getBusinessProfile(supabase, user.id);

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-6 sm:py-10">
      <Link href="/settings" className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to settings
      </Link>

      <h1 className="mb-1 text-2xl font-semibold tracking-tight text-foreground">Business profile</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Show up as a business alongside your personal profile in the member directory.
      </p>

      <Card>
        <CardContent className="pt-6">
          <BusinessForm profileId={user.id} business={business} />
        </CardContent>
      </Card>
    </div>
  );
}
