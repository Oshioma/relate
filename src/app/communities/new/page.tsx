import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { getDefaultSpacesByTemplate } from "@/lib/data/template-defaults";
import { CommunityWizard } from "./wizard/CommunityWizard";

export default async function NewCommunityPage() {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  if (!user) {
    redirect("/login?next=/communities/new");
  }

  // The effective default spaces for every community type — a super admin's
  // edits from /platform-admin, or the code defaults where a type is
  // unedited. The wizard seeds a new community's spaces from the picked type's
  // list.
  const defaultSpacesByTemplate = await getDefaultSpacesByTemplate(supabase);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
      <Link href="/dashboard" className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <CommunityWizard defaultSpacesByTemplate={defaultSpacesByTemplate} />
    </div>
  );
}
