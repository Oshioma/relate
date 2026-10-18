import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight, Columns2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { getCommunityBySlug } from "@/lib/data/community";
import {
  getOutline,
  getLayerTexts,
  getPassageByKey,
  getPassageHeads,
  getSourcesByIds,
  getWorkByKey,
  getWorkImages,
} from "@/lib/data/timeline-texts";
import { communityHasTimeline } from "@/lib/timeline/availability";
import { chronologyLabel, evidenceLayerLabel } from "@/lib/timeline/taxonomy";
import { OUR_TRANSLATION_LAYER_KEY } from "@/lib/timeline/texts/corpus/plain";
import { workForPassageKey } from "@/lib/timeline/texts/inventory";
import { comparePath, passagePath, themePath, workPath } from "@/lib/timeline/texts/paths";
import { breadcrumb, neighbours, sentenceRunsInFrom, sentenceRunsOnInto } from "@/lib/timeline/texts/reading";
import {
  comparabilityLabel,
  connectionClassHint,
  connectionClassLabel,
  connectionClassOrder,
  connectionIsDocumented,
  layerLicenceLabel,
  linkReviewStatusLabel,
  passageVerificationHint,
  passageVerificationLabel,
} from "@/lib/timeline/texts/taxonomy";
import type { TimelinePassageLink, TimelineSource, TimelineTextLayer } from "@/types/database";
import { FiveDates, ImageFigure, SourceLine } from "../../archive-ui";
import { TextsNav } from "../../texts-nav";

// READ THE ORIGINAL TEXT.
//
// One passage: the evidence image beside the words, the original and every
// translation as separate renderings with their makers named, then its dates,
// witnesses, themes and connections. Previous and next follow the work's own
// order, so the whole text can be read from here.

type Params = { communitySlug: string; workKey: string; passageKey: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { passageKey } = await params;
  const key = decodeURIComponent(passageKey);
  const work = workForPassageKey(key);
  return { title: work ? `${work.title} — ${key.slice(work.passagePrefix.length + 1)}` : key };
}

export default async function PassagePage({ params }: { params: Promise<Params> }) {
  const { communitySlug, workKey: rawWork, passageKey: rawPassage } = await params;
  const workKey = decodeURIComponent(rawWork);
  const passageKey = decodeURIComponent(rawPassage);
  const supabase = await createClient();
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community || !communityHasTimeline(community)) notFound();

  const work = await getWorkByKey(supabase, community.id, workKey).catch(() => null);
  if (!work) notFound();
  const passage = await getPassageByKey(supabase, community.id, passageKey);
  if (!passage || passage.work_id !== work.id) notFound();

  const outline = await getOutline(supabase, community.id, work.id);
  const { previous, next, position, total } = neighbours(outline, passageKey);
  const trail = breadcrumb(outline, passageKey);
  const children = outline.filter((row) => row.parent_key === passageKey);

  const otherEnds = passage.links.map((link) => (link.from_passage_key === passageKey ? link.to_passage_key : link.from_passage_key));
  const heads = await getPassageHeads(supabase, community.id, otherEnds);

  // When the passage has no image of its own, the work's manuscripts are shown
  // instead — labelled as the witnesses of the whole text, not of this line.
  const ownImages = passage.images;
  const workImages = ownImages.length === 0 ? await getWorkImages(supabase, community.id, work.id) : [];

  // The ends of sentences that cross into the neighbouring sections.
  const neighbourTexts = await getLayerTexts(
    supabase,
    community.id,
    [previous?.passage_key, next?.passage_key].filter((key): key is string => !!key)
  );
  const runOn = (layer: TimelineTextLayer) => {
    if (!layer.content || !layer.import_key) return {};
    const before = previous?.passage_key ? neighbourTexts.get(previous.passage_key)?.get(layer.import_key) : undefined;
    const after = next?.passage_key ? neighbourTexts.get(next.passage_key)?.get(layer.import_key) : undefined;
    const runIn = sentenceRunsInFrom(layer.content, before);
    const runOut = sentenceRunsOnInto(layer.content, after);
    return {
      runIn: runIn && previous ? { text: runIn, label: previous.label } : undefined,
      runOut: runOut && next ? { text: runOut, label: next.label } : undefined,
    };
  };

  const sourcesById = await getSourcesByIds(supabase, [
    passage.source_id ?? "",
    ...passage.layers.map((l) => l.source_id ?? ""),
    ...passage.dates.map((d) => d.source_id ?? ""),
    ...passage.links.map((l) => l.source_id ?? ""),
  ]);

  const primary = passage.layers.filter((l) => ["primary_object", "primary_text", "transcription", "transliteration"].includes(l.layer));
  const translations = passage.layers.filter((l) => l.layer === "translation");
  // The plain-words paraphrase sits with the translations it paraphrases;
  // readings of the passage go further down, under Interpretations.
  const plainWords = passage.layers.filter((l) => l.layer === "modern_summary");
  const interpretations = passage.layers.filter((l) => l.layer === "interpretation");
  const firstTranslation = translations.find((l) => l.content);
  const links = [...passage.links].sort((a, b) => connectionClassOrder(a.connection_class) - connectionClassOrder(b.connection_class));
  const alternatives = links.filter((l) => l.alternative_view);

  const nav = (
    <div className="flex items-center justify-between gap-2 text-sm">
      {previous?.passage_key ? (
        <Link href={passagePath(community.slug, workKey, previous.passage_key)} className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-foreground hover:bg-muted">
          <ChevronLeft className="h-4 w-4" />
          <span className="max-w-[9rem] truncate sm:max-w-none">{previous.label}</span>
        </Link>
      ) : (
        <span />
      )}
      <span className="text-xs tabular-nums text-muted-foreground">
        {position} / {total}
      </span>
      {next?.passage_key ? (
        <Link href={passagePath(community.slug, workKey, next.passage_key)} className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-foreground hover:bg-muted">
          <span className="max-w-[9rem] truncate sm:max-w-none">{next.label}</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span />
      )}
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <TextsNav communitySlug={community.slug} active="read" />

      <nav aria-label="Where this passage is" className="mt-4 flex flex-wrap gap-x-1.5 text-sm text-muted-foreground">
        <Link href={workPath(community.slug, workKey)} className="hover:text-foreground hover:underline">
          {work.title}
        </Link>
        {trail.map((row) => (
          <span key={row.id}>
            ›{" "}
            <Link href={passagePath(community.slug, workKey, row.passage_key!)} className="hover:text-foreground hover:underline">
              {row.label}
            </Link>
          </span>
        ))}
      </nav>

      <div className="mt-2 flex flex-wrap items-start gap-2">
        <h1 className="mr-auto text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{passage.label}</h1>
        <span
          title={passageVerificationHint(passage.verification_status) ?? undefined}
          className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground"
        >
          {passageVerificationLabel(passage.verification_status) ?? passage.verification_status}
        </span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        {passage.reference}
        {passage.source_id && sourcesById.get(passage.source_id) ? ` · ${sourcesById.get(passage.source_id)!.title}` : ""}
        <span className="ml-2 font-mono text-xs">{passage.passage_key}</span>
      </p>
      {passage.summary && <p className="mt-3 max-w-3xl text-base text-foreground">{passage.summary}</p>}

      <div className="mt-4">{nav}</div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <section aria-label="Evidence images" className="space-y-4">
          {ownImages.map((image) => (
            <ImageFigure key={image.id} image={image} aside={firstTranslation ? <LayerAside layer={firstTranslation} source={sourcesById.get(firstTranslation.source_id ?? "")} /> : undefined} />
          ))}
          {ownImages.length === 0 && workImages.length > 0 && (
            <>
              <p className="text-xs text-muted-foreground">
                No image is recorded for this passage itself. These show the text&apos;s witnesses as a whole; they are not
                identified as this passage.
              </p>
              {workImages.map((image) => (
                <ImageFigure key={image.id} image={image} aside={firstTranslation ? <LayerAside layer={firstTranslation} source={sourcesById.get(firstTranslation.source_id ?? "")} /> : undefined} />
              ))}
            </>
          )}
          {ownImages.length === 0 && workImages.length === 0 && (
            <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
              No verified image of a manuscript or artefact is recorded for this text yet.
            </p>
          )}
        </section>

        <section aria-label="Text" className="min-w-0 space-y-4">
          {primary.map((layer) => (
            <Layer key={layer.id} layer={layer} source={sourcesById.get(layer.source_id ?? "")} original {...runOn(layer)} />
          ))}
          {translations.map((layer) => (
            <Layer key={layer.id} layer={layer} source={sourcesById.get(layer.source_id ?? "")} {...runOn(layer)} />
          ))}
          {plainWords.map((layer) => (
            <Layer key={layer.id} layer={layer} source={sourcesById.get(layer.source_id ?? "")} />
          ))}
          {passage.layers.length === 0 && children.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">This is a division of the text. It contains:</p>
              <ul className="mt-2 space-y-1">
                {children.map((child) => (
                  <li key={child.id}>
                    <Link href={passagePath(community.slug, workKey, child.passage_key!)} className="text-sm text-accent hover:underline">
                      {child.label}
                    </Link>
                    {child.summary && <span className="block text-xs text-muted-foreground">{child.summary}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {interpretations.length > 0 && (
            <div className="border-t border-border pt-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Interpretations</h2>
              <p className="text-xs text-muted-foreground">Readings of the passage, each under the viewpoint it belongs to. Not the text.</p>
              <div className="mt-2 space-y-3">
                {interpretations.map((layer) => (
                  <Layer key={layer.id} layer={layer} source={sourcesById.get(layer.source_id ?? "")} />
                ))}
              </div>
            </div>
          )}
          {passage.notes && <p className="text-sm text-muted-foreground">{passage.notes}</p>}
        </section>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          {passage.dates.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-foreground">Dates in this passage</h2>
              <p className="mb-2 text-sm text-muted-foreground">
                The text&apos;s own dates are on{" "}
                <Link href={workPath(community.slug, workKey)} className="text-accent hover:underline">
                  its page
                </Link>
                .
              </p>
              <FiveDates claims={[]} passageDates={passage.dates} sourcesById={sourcesById} />
            </section>
          )}

          {passage.witnesses.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-foreground">Manuscripts carrying this passage</h2>
              <ul className="mt-2 space-y-2 text-sm">
                {passage.witnesses.map((w) => (
                  <li key={w.id}>
                    <span className="font-medium text-foreground">{w.manuscript?.name ?? "Unknown witness"}</span>
                    {w.manuscript?.original_date_text && <span className="text-muted-foreground"> · {w.manuscript.original_date_text}</span>}
                    {w.locus && <span className="block text-muted-foreground">{w.locus}</span>}
                    {w.variant_note && <span className="block text-foreground">Variant: {w.variant_note}</span>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {passage.themes.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-foreground">Trace an idea</h2>
              <p className="text-sm text-muted-foreground">Themes are ways to navigate, not evidence that two texts share an idea.</p>
              <ul className="mt-2 space-y-1.5 text-sm">
                {passage.themes.map(({ theme, note }) => (
                  <li key={theme.id}>
                    <Link href={themePath(community.slug, theme.theme_key)} className="font-medium text-accent hover:underline">
                      {theme.label}
                    </Link>
                    <span className="text-muted-foreground"> — {note}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <section>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="mr-auto text-lg font-semibold text-foreground">Connections</h2>
            <Link
              href={comparePath(community.slug, [passageKey, ...otherEnds.slice(0, 2)])}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-sm text-foreground hover:bg-muted"
            >
              <Columns2 className="h-4 w-4" />
              Compare this passage
            </Link>
          </div>
          {links.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">
              No connection to another passage has been argued yet. None is assumed.
            </p>
          ) : (
            <ul className="mt-3 space-y-3">
              {links.map((link) => (
                <Connection
                  key={link.id}
                  link={link}
                  here={passageKey}
                  head={heads.get(link.from_passage_key === passageKey ? link.to_passage_key : link.from_passage_key)}
                  communitySlug={community.slug}
                  source={sourcesById.get(link.source_id ?? "")}
                />
              ))}
            </ul>
          )}
          {alternatives.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-foreground">Alternative interpretations</h2>
              <ul className="mt-2 space-y-2 text-sm">
                {alternatives.map((link) => (
                  <li key={link.id} className="rounded-lg border border-dashed border-border p-3 text-foreground">
                    {link.alternative_view}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>

      <div className="mt-8">{nav}</div>
    </div>
  );
}

function LayerAside({ layer, source }: { layer: TimelineTextLayer; source: TimelineSource | undefined }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {evidenceLayerLabel(layer.layer)}
        {layer.language ? ` · ${layer.language}` : ""}
      </p>
      <p className="mt-1 whitespace-pre-line text-sm text-foreground">{layer.content}</p>
      <SourceLine source={source} />
    </div>
  );
}

type RunOn = { text: string; label: string };

function Layer({
  layer,
  source,
  original,
  runIn,
  runOut,
}: {
  layer: TimelineTextLayer;
  source: TimelineSource | undefined;
  original?: boolean;
  /** The start of the first sentence, from the previous section. */
  runIn?: RunOn;
  /** The end of the last sentence, from the next section. */
  runOut?: RunOn;
}) {
  return (
    <article className={cn("rounded-xl border bg-card p-4", original ? "border-accent/40" : "border-border")}>
      <header className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {layer.import_key === OUR_TRANSLATION_LAYER_KEY ? "Our translation" : evidenceLayerLabel(layer.layer)}
          {layer.language ? ` · ${layer.language}` : ""}
          {layer.viewpoint ? ` · ${chronologyLabel(layer.viewpoint)}` : ""}
        </h2>
        {layer.licence && <span className="ml-auto text-[11px] text-muted-foreground">{layerLicenceLabel(layer.licence)}</span>}
      </header>
      {layer.content ? (
        <>
          <p
            lang={layer.language === "Ancient Greek" ? "grc" : layer.language === "Arabic" ? "ar" : layer.language === "Latin" ? "la" : undefined}
            dir={layer.language === "Arabic" ? "rtl" : undefined}
            className={cn("mt-2 whitespace-pre-line text-foreground", original ? "text-lg leading-relaxed" : "text-base leading-relaxed")}
          >
            {runIn && <span className="text-muted-foreground">{runIn.text} </span>}
            {layer.content}
            {runOut && <span className="text-muted-foreground"> {runOut.text}</span>}
          </p>
          {(runIn || runOut) && (
            <p className="mt-1 text-[11px] text-muted-foreground">
              The section boundary falls mid-sentence, so the lighter words
              {runIn ? ` before are from ${runIn.label}` : ""}
              {runIn && runOut ? " and those" : ""}
              {runOut ? ` after are from ${runOut.label}` : ""}.
            </p>
          )}
        </>
      ) : (
        <p className="mt-2 text-sm italic text-muted-foreground">{layer.content_absent_reason}</p>
      )}
      <footer className="mt-2 space-y-0.5">
        <SourceLine source={source} />
        <p className="text-xs text-muted-foreground">{layer.evidence}</p>
        {layer.notes && <p className="text-xs text-muted-foreground">{layer.notes}</p>}
      </footer>
    </article>
  );
}

function Connection({
  link,
  here,
  head,
  communitySlug,
  source,
}: {
  link: TimelinePassageLink;
  here: string;
  head: { label: string; reference: string | null; workKey: string | null; workTitle: string | null } | undefined;
  communitySlug: string;
  source: TimelineSource | undefined;
}) {
  const other = link.from_passage_key === here ? link.to_passage_key : link.from_passage_key;
  const documented = connectionIsDocumented(link.connection_class);
  const otherWork = head?.workKey ?? workForPassageKey(other)?.workKey ?? null;
  return (
    <li className={cn("rounded-xl border-2 bg-card p-4", documented ? "border-solid border-border" : "border-dashed border-border")}>
      <div className="flex flex-wrap items-baseline gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-foreground" title={connectionClassHint(link.connection_class) ?? undefined}>
          {connectionClassLabel(link.connection_class)}
        </span>
        <span className="text-[11px] text-muted-foreground">{documented ? "documented" : "resemblance only"}</span>
        <span className="ml-auto text-[11px] text-muted-foreground">{linkReviewStatusLabel(link.review_status)}</span>
      </div>
      <p className="mt-1 text-sm">
        {head && otherWork ? (
          <Link href={passagePath(communitySlug, otherWork, other)} className="font-medium text-accent hover:underline">
            {head.workTitle ? `${head.workTitle}: ` : ""}
            {head.label}
          </Link>
        ) : (
          <span className="text-foreground">
            {workForPassageKey(other)?.title ?? other} <span className="font-mono text-xs">{other}</span>
            <span className="block text-xs text-muted-foreground">Not imported yet.</span>
          </span>
        )}
      </p>
      <dl className="mt-2 grid gap-1 text-sm">
        <Row term="Similar" value={link.similarities} />
        <Row term="Different" value={link.differences} />
        <Row term="Wording comparable" value={comparabilityLabel(link.wording_comparable) ?? link.wording_comparable} />
        <Row term="Meaning comparable" value={comparabilityLabel(link.meaning_comparable) ?? link.meaning_comparable} />
        <Row term="Evidence of transmission" value={link.transmission_evidence} />
        <Row term="Which is earlier" value={link.earlier_note} />
        <Row term="A common source?" value={link.common_source_note} />
        <Row term="Contradiction" value={link.contradiction_note} />
        <Row term="Scholarly view" value={link.scholarly_view} />
      </dl>
      <div className="mt-2 flex flex-wrap gap-3 text-xs">
        <SourceLine source={source} />
        <Link href={comparePath(communitySlug, [link.from_passage_key, link.to_passage_key])} className="text-accent hover:underline">
          Compare side by side
        </Link>
      </div>
    </li>
  );
}

function Row({ term, value }: { term: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="grid gap-x-2 sm:grid-cols-[10rem_minmax(0,1fr)]">
      <dt className="text-muted-foreground">{term}</dt>
      <dd className="text-foreground">{value}</dd>
    </div>
  );
}
