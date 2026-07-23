import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { getPlaceDefaultSpaces } from "@/lib/data/place-defaults";
import type { TemplateSpace } from "@/lib/community-templates";
import { CommunityWizard } from "./wizard/CommunityWizard";

export default async function NewCommunityPage() {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  if (!user) {
    redirect("/login?next=/communities/new");
  }

  // The super-admin-configured default spaces for the place template. Falls
  // back to undefined (the wizard then uses the code defaults) if none exist.
  const placeRows = await getPlaceDefaultSpaces(supabase);
  const placeDefaultSpaces: TemplateSpace[] | undefined = placeRows.length
    ? placeRows.map((s) => ({ name: s.name, description: s.description, space_type: s.space_type }))
    : undefined;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
      <Link href="/dashboard" className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <CommunityWizard placeDefaultSpaces={placeDefaultSpaces} />
    </div>
  );
}
