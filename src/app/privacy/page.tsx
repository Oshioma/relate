import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getPlatformSettings } from "@/lib/data/platform-settings";
import { RichText } from "@/components/ui/rich-text";
import { PROSE_CLASS } from "@/lib/prose";

export const metadata: Metadata = { title: "Privacy Policy — Relate" };

export default async function PrivacyPage() {
  const supabase = await createClient();
  const settings = await getPlatformSettings(supabase);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
        ← Relate
      </Link>
      <h1 className="mb-6 mt-4 text-2xl font-semibold tracking-tight text-foreground">Privacy Policy</h1>
      {settings?.privacy ? (
        <RichText content={settings.privacy} className={PROSE_CLASS} />
      ) : (
        <p className="text-sm text-muted-foreground">Our privacy policy hasn&apos;t been published yet. Please check back soon.</p>
      )}
    </div>
  );
}
