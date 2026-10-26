import type { Metadata } from "next";
import Link from "@/components/ui/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCommunityBySlug } from "@/lib/data/community";
import { getLibrary, getOutline, type LibraryWork } from "@/lib/data/timeline-texts";
import { communityHasTimeline } from "@/lib/timeline/availability";
import { passagePath, workPath } from "@/lib/timeline/texts/paths";
import { readingOrder } from "@/lib/timeline/texts/reading";
import { CompletenessBadge } from "../archive-ui";
import { TextsNav } from "../texts-nav";

// READ PASSAGES: every text that has passages, and where to start.

export const metadata: Metadata = { title: "Read passages" };

export default async function ReadPage({ params }: { params: Promise<{ communitySlug: string }> }) {
  const { communitySlug } = await params;
  const supabase = await createClient();
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community || !communityHasTimeline(community)) notFound();
  const library = await getLibrary(supabase, community.id).catch(() => [] as LibraryWork[]);
  const readable = library.filter((w) => (w.counts?.passageRecords ?? 0) > 0);
  const starts = await Promise.all(
    readable.map(async (work) => readingOrder(await getOutline(supabase, community.id, work.id)).find((row) => row.passage_key))
  );

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
      <TextsNav communitySlug={community.slug} active="read" />
      <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Read passages</h1>
      <p className="mt-2 text-sm text-muted-foreground">The texts that can be read here now, passage by passage, with the original beside the translation.</p>
      {readable.length === 0 ? (
        <p className="mt-6 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">No text has been imported yet.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {readable.map((work, i) => (
            <li key={work.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4">
              <div className="mr-auto min-w-0">
                <Link href={workPath(community.slug, work.work_key)} className="font-semibold text-foreground hover:underline">
                  {work.title}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {work.counts?.importedUnits} {work.unit_label}
                </p>
              </div>
              <CompletenessBadge status={work.completeness_status} />
              {starts[i]?.passage_key && (
                <Link href={passagePath(community.slug, work.work_key, starts[i]!.passage_key!)} className="text-sm font-medium text-accent hover:underline">
                  Start reading
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
