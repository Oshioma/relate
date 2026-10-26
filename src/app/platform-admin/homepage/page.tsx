import Link from "@/components/ui/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, getProfile } from "@/lib/data/profile";
import { getPlatformSettings } from "@/lib/data/platform-settings";
import { readCreatorTestimonials, HOMEPAGE_TESTIMONIALS } from "@/lib/creator-testimonials";
import { CreatorTestimonialsForm } from "../creator-testimonials-form";

// What the platform homepage says about itself. The featured communities are
// picked on the Communities & Members tab; the quotes live here.
export default async function PlatformHomepagePage() {
  // Re-verify: the layout already gates this section.
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  if (!user) redirect("/login?next=/platform-admin/homepage");
  const profile = await getProfile(supabase, user.id);
  if (!profile?.is_super_admin) redirect("/dashboard");

  const settings = await getPlatformSettings(supabase);

  return (
    <div>
      <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">Creator quotes</h2>
      <p className="mb-6 text-sm text-muted-foreground">
        The{" "}
        <Link href="/" target="_blank" rel="noreferrer" className="font-medium text-accent underline underline-offset-2">
          homepage
        </Link>{" "}
        shows {HOMEPAGE_TESTIMONIALS === 1 ? "one quote: the first one here" : `up to ${HOMEPAGE_TESTIMONIALS} quotes: these first, in order`}.
        With none here, it shows a real member quote from a featured community&apos;s own landing page instead. Only
        use real quotes from real people. Leave a quote empty to remove it; the others are kept for later.
      </p>

      <CreatorTestimonialsForm testimonials={readCreatorTestimonials(settings?.creator_testimonials)} />
    </div>
  );
}
