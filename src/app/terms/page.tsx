import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getPlatformSettings } from "@/lib/data/platform-settings";
import { RichText } from "@/components/ui/rich-text";

export const metadata: Metadata = { title: "Terms & Conditions — Relate" };

export default async function TermsPage() {
  const supabase = await createClient();
  const settings = await getPlatformSettings(supabase);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
        ← Relate
      </Link>
      <h1 className="mb-6 mt-4 text-2xl font-semibold tracking-tight text-foreground">Terms &amp; Conditions</h1>
      {settings?.terms ? (
        <RichText content={settings.terms} />
      ) : (
        <p className="text-sm text-muted-foreground">Our terms haven&apos;t been published yet. Please check back soon.</p>
      )}
    </div>
  );
}
