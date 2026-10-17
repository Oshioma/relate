import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership, isCommunityStaff } from "@/lib/data/community";
import { getLibrary, type LibraryWork } from "@/lib/data/timeline-texts";
import { communityHasTimeline, timelineEventPath } from "@/lib/timeline/availability";
import { ALL_CORPORA } from "@/lib/timeline/texts/corpus";
import { INVENTORY } from "@/lib/timeline/texts/inventory";
import { buildManifest, coverageText } from "@/lib/timeline/texts/manifest";
import { workPath } from "@/lib/timeline/texts/paths";
import { CORPUS_GROUPS } from "@/lib/timeline/texts/taxonomy";
import type { InventoryWork } from "@/lib/timeline/texts/corpus-types";
import { CompletenessBadge, TraditionBadge } from "./archive-ui";
import { ImportPanel } from "./import-panel";
import { TextsNav } from "./texts-nav";

// THE LIBRARY: every work in scope, imported or not.
//
// The inventory is the list of what SHOULD be here, so every entry shows —
// a work with no passages yet says so rather than being missing. Counts come
// from the database, never from the files, and "complete" appears only where
// the manifest rule allows it.

export const metadata: Metadata = { title: "Ancient texts" };

export default async function TextsLibraryPage({ params }: { params: Promise<{ communitySlug: string }> }) {
  const { communitySlug } = await params;
  const supabase = await createClient();
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community || !communityHasTimeline(community)) notFound();
  const user = await getCurrentUser(supabase);
  const membership = user ? await getMembership(supabase, community.id, user.id) : null;
  const isStaff = isCommunityStaff(community, membership, user?.id);

  // A database without the archive tables yet reads as an empty library.
  const library = await getLibrary(supabase, community.id).catch(() => [] as LibraryWork[]);
  const byKey = new Map(library.map((work) => [work.work_key, work]));
  const installed = library.length > 0;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <TextsNav communitySlug={community.slug} active="library" />

      <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Ancient texts</h1>
      <div className="mt-3 max-w-3xl space-y-2 text-base text-foreground">
        <p>
          Each text appears once on the timeline, at its documented dates. Open it here to read it passage by passage,
          with the manuscripts and translations behind each one.
        </p>
        <p className="text-sm text-muted-foreground">
          A text is marked complete only when every unit of a checked inventory is present and verified. Everything else
          says how far it has got. Modern books that present themselves as ancient are shelved as modern and labelled.
        </p>
      </div>

      {isStaff && (
        <ImportPanel
          communitySlug={community.slug}
          installed={installed}
          importable={ALL_CORPORA.map((file) => {
            const row = byKey.get(file.workKey);
            return {
              workKey: file.workKey,
              title: INVENTORY.find((w) => w.workKey === file.workKey)?.title ?? file.workKey,
              imported: row?.lastRun?.status === "completed" && (row.counts?.passageRecords ?? 0) > 0,
            };
          })}
        />
      )}
      {!installed && !isStaff && (
        <p className="mt-6 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
          The archive has not been added to this timeline yet. The list below shows what it will contain.
        </p>
      )}

      {CORPUS_GROUPS.map((group) => {
        const works = INVENTORY.filter((work) => work.corpusGroup === group.key);
        return (
          <section key={group.key} className="mt-8">
            <h2 className="text-lg font-semibold text-foreground">{group.label}</h2>
            <p className="text-sm text-muted-foreground">{group.hint}</p>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {works.map((work) => (
                <WorkCard key={work.workKey} work={work} row={byKey.get(work.workKey)} communitySlug={community.slug} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function WorkCard({ work, row, communitySlug }: { work: InventoryWork; row: LibraryWork | undefined; communitySlug: string }) {
  const counts = row?.counts ?? null;
  const manifest = counts ? buildManifest({ expectedUnits: work.expectedUnits, inventoryVerified: work.inventoryVerified }, counts) : null;
  const status = manifest?.status ?? (work.expectedUnits != null ? "inventory_documented" : "not_started");
  const readable = (counts?.passageRecords ?? 0) > 0;
  const alias = work.aliasOf ? INVENTORY.find((w) => w.workKey === work.aliasOf!.workKey) : undefined;

  return (
    <li className="flex flex-col rounded-xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-start gap-2">
        <h3 className="mr-auto font-semibold text-foreground">
          {readable ? (
            <Link href={workPath(communitySlug, work.workKey)} className="hover:underline">
              {work.title}
            </Link>
          ) : (
            work.title
          )}
        </h3>
        <CompletenessBadge status={status} />
      </div>
      <div className="mt-1 flex flex-wrap gap-1.5">
        <TraditionBadge traditionClass={work.traditionClass} />
        <span className="text-xs text-muted-foreground">{work.civilisation}</span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{work.summary}</p>
      {alias && (
        <p className="mt-2 text-sm text-foreground">
          The same text as {alias.title}; it is read there rather than stored twice.
        </p>
      )}
      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
        <dt className="text-muted-foreground">Imported</dt>
        <dd className="text-foreground">{coverageText({ importedUnits: counts?.importedUnits ?? 0, expectedUnits: work.expectedUnits }, work.unitLabel)}</dd>
        {manifest && (
          <>
            <dt className="text-muted-foreground">Verified</dt>
            <dd className="text-foreground">{manifest.verifiedUnits}</dd>
            <dt className="text-muted-foreground">Translations with text</dt>
            <dd className="text-foreground">
              {manifest.translationsWithText} of {manifest.translations}
            </dd>
            <dt className="text-muted-foreground">Images</dt>
            <dd className="text-foreground">
              {manifest.imagesFound} found, {manifest.imagesVerified} checked
            </dd>
          </>
        )}
        <dt className="text-muted-foreground">Counted on</dt>
        <dd className="text-foreground">{work.referenceEdition}</dd>
      </dl>
      <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-3 text-sm">
        {readable && (
          <Link href={workPath(communitySlug, work.workKey)} className="font-medium text-accent hover:underline">
            Read the original text
          </Link>
        )}
        {alias && (
          <Link href={workPath(communitySlug, alias.workKey)} className="font-medium text-accent hover:underline">
            Open {alias.title}
          </Link>
        )}
        {row?.eventSlug && (
          <Link href={timelineEventPath(communitySlug, row.eventSlug)} className="text-muted-foreground hover:text-foreground hover:underline">
            On the timeline
          </Link>
        )}
      </div>
    </li>
  );
}
