import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCommunityBySlug } from "@/lib/data/community";
import { getInterpretations } from "@/lib/data/timeline-texts";
import { communityHasTimeline } from "@/lib/timeline/availability";
import { chronologyLabel } from "@/lib/timeline/taxonomy";
import { workForPassageKey } from "@/lib/timeline/texts/inventory";
import { comparePath, passagePath } from "@/lib/timeline/texts/paths";
import { connectionClassLabel } from "@/lib/timeline/texts/taxonomy";
import { TextsNav } from "../texts-nav";

// ALTERNATIVE INTERPRETATIONS, kept apart from the texts.
//
// Every reading the archive records that is not the scholarly consensus —
// whose it is, and against which passage — in one place, so a reader can see
// them all and see that each is labelled.

export const metadata: Metadata = { title: "Alternative interpretations" };

export default async function InterpretationsPage({ params }: { params: Promise<{ communitySlug: string }> }) {
  const { communitySlug } = await params;
  const supabase = await createClient();
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community || !communityHasTimeline(community)) notFound();
  const { links, layers } = await getInterpretations(supabase, community.id).catch(() => ({ links: [], layers: [] }));
  const alternatives = links.filter((l) => l.alternative_view);

  const passageLink = (key: string) => {
    const work = workForPassageKey(key);
    return work ? (
      <Link href={passagePath(community.slug, work.workKey, key)} className="text-accent hover:underline">
        {work.title} <span className="font-mono text-xs">{key.slice(work.passagePrefix.length + 1)}</span>
      </Link>
    ) : (
      <span className="font-mono text-xs">{key}</span>
    );
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
      <TextsNav communitySlug={community.slug} active="interpretations" />
      <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Alternative interpretations</h1>
      <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
        Readings that differ from the scholarly view, each shown with the passages it concerns and the evidence for and
        against. They are recorded so they can be judged, not because the archive adopts them.
      </p>

      <section className="mt-6">
        <h2 className="text-lg font-semibold text-foreground">On connections between texts</h2>
        {alternatives.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">None recorded yet.</p>
        ) : (
          <ul className="mt-2 space-y-3">
            {alternatives.map((link) => (
              <li key={link.id} className="rounded-xl border border-dashed border-border bg-card p-4 text-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{connectionClassLabel(link.connection_class)}</p>
                <p className="mt-1">
                  {passageLink(link.from_passage_key)} ↔ {passageLink(link.to_passage_key)}
                </p>
                <p className="mt-2 text-foreground">{link.alternative_view}</p>
                {link.scholarly_view && <p className="mt-1 text-muted-foreground">Scholarly view: {link.scholarly_view}</p>}
                <p className="mt-1 text-muted-foreground">Evidence: {link.transmission_evidence}</p>
                <Link href={comparePath(community.slug, [link.from_passage_key, link.to_passage_key])} className="mt-1 inline-block text-xs text-accent hover:underline">
                  Compare side by side
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-foreground">Interpretations of single passages</h2>
        {layers.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">None recorded yet.</p>
        ) : (
          <ul className="mt-2 space-y-3">
            {layers.map((layer) => (
              <li key={layer.id} className="rounded-xl border border-border bg-card p-4 text-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{chronologyLabel(layer.viewpoint)}</p>
                {layer.passageKey && <p className="mt-1">{passageLink(layer.passageKey)}</p>}
                <p className="mt-2 text-foreground">{layer.content ?? layer.content_absent_reason}</p>
                <p className="mt-1 text-xs text-muted-foreground">{layer.evidence}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
