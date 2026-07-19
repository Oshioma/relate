import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { Card, CardContent } from "@/components/ui/card";
import { CommunityForm } from "./community-form";

export default async function NewCommunityPage() {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  if (!user) {
    redirect("/login?next=/communities/new");
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-6 sm:py-10">
      <Link href="/dashboard" className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <h1 className="mb-1 text-2xl font-semibold tracking-tight text-foreground">Create a community</h1>
      <p className="mb-8 text-sm text-muted-foreground">You&apos;ll be its owner, with your own spaces, members, and admin tools.</p>

      <Card>
        <CardContent className="pt-6">
          <CommunityForm />
        </CardContent>
      </Card>
    </div>
  );
}
