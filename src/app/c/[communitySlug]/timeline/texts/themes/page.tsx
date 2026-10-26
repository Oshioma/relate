import type { Metadata } from "next";
import Link from "@/components/ui/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCommunityBySlug } from "@/lib/data/community";
import { getThemes } from "@/lib/data/timeline-texts";
import { communityHasTimeline } from "@/lib/timeline/availability";
import { themePath } from "@/lib/timeline/texts/paths";
import { ARCHIVE_THEMES } from "@/lib/timeline/texts/taxonomy";
import { TextsNav } from "../texts-nav";

// TRACE AN IDEA: the themes, as ways into the archive.

export const metadata: Metadata = { title: "Trace an idea" };

export default async function ThemesPage({ params }: { params: Promise<{ communitySlug: string }> }) {
  const { communitySlug } = await params;
  const supabase = await createClient();
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community || !communityHasTimeline(community)) notFound();
  const themes = await getThemes(supabase, community.id).catch(() => []);
  const count = new Map(themes.map((t) => [t.theme_key, t.passages]));

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <TextsNav communitySlug={community.slug} active="themes" />
      <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Trace an idea</h1>
      <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
        Follow an idea through the texts in time order. A theme gathers passages a reader may want to see together; it
        does not show that they share a doctrine or that one borrowed from another. Where that has been argued, the
        connection is drawn with its evidence — solid where the link is documented, dashed where it is only a resemblance.
      </p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ARCHIVE_THEMES.map((theme) => (
          <li key={theme.key}>
            <Link href={themePath(community.slug, theme.key)} className="block h-full rounded-xl border border-border bg-card p-4 hover:bg-muted">
              <span className="font-semibold text-foreground">{theme.label}</span>
              <span className="ml-2 text-xs tabular-nums text-muted-foreground">{count.get(theme.key) ?? 0} passages</span>
              <span className="mt-1 block text-sm text-muted-foreground">{theme.hint}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
