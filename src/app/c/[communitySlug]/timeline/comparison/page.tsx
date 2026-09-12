import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { getCommunityBySlug } from "@/lib/data/community";
import { getEventsWithMotifs } from "@/lib/data/timeline";
import { communityHasTimeline, timelinePath } from "@/lib/timeline/availability";
import { NARRATIVE_MOTIFS, motifLabel } from "@/lib/timeline/taxonomy";

// THE COMPARISON GRID — AND THE THING IT WANTS TO DO THAT IT MUST NOT.
//
// Most records here carry no date. A Popol Vuh flood, a Haudenosaunee
// creation, a llama on Villca Coto: a timeline cannot put them side by side
// and a table of dates would be nearly empty. What they DO have is content —
// whether anybody was warned, by whom, what the water was, what floated — so
// that is what this compares.
//
// A GRID OF TICKS IS A MACHINE FOR MANUFACTURING FALSE ABSENCES.
//
// Every blank cell here means ONE thing: the cited source was not found to
// contain that motif. It does not mean the tradition lacks it. It can mean the
// text is a fragment, that this record cites one telling of many, that the
// passage is broken, or simply that nobody has checked yet. Gun and Yu has two
// motifs because the tradition really is that different in shape; the Popol
// Vuh has few because the flood passage is short. Those two blanks are not the
// same kind of blank and no grid can tell them apart.
//
// So the page says that first, at the top, before the table — not in a
// footnote under it.
//
// AND THERE IS NO SCORE. No similarity percentage, no "closest match", no
// ranking, no total that could be read as completeness. A count of motifs
// found is shown because it is useful and because the sparse rows are the
// interesting ones, and it is labelled as what it is: how much the SOURCE
// carries, not how rich the tradition is.

export const metadata: Metadata = {
  title: "Comparing the traditions",
};

export default async function ComparisonPage({
  params,
}: {
  params: Promise<{ communitySlug: string }>;
}) {
  const { communitySlug } = await params;
  const supabase = await createClient();
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community || !communityHasTimeline(community)) notFound();

  const events = await getEventsWithMotifs(supabase, community.id);

  // Only the motifs somebody here actually records. A column of entirely empty
  // cells teaches nothing and makes the table unreadable on a phone.
  const used = new Set(events.flatMap((event) => event.motifs ?? []));
  const groups: { group: string; motifs: { key: string; label: string }[] }[] = [];
  for (const motif of NARRATIVE_MOTIFS) {
    if (!used.has(motif.key)) continue;
    const existing = groups.find((g) => g.group === motif.group);
    const entry = { key: motif.key, label: motif.label };
    if (existing) existing.motifs.push(entry);
    else groups.push({ group: motif.group, motifs: [entry] });
  }
  // The motifs NOBODY here records. Worth naming: an absence across every
  // record in a community is a fact about this collection, not about the world.
  const unused = NARRATIVE_MOTIFS.filter((motif) => !used.has(motif.key));

  // min-w-0 IS LOAD-BEARING. This page is a flex child of the app shell, and a
  // flex item sizes to its content unless told it may shrink — so the wide
  // table below pushed the WHOLE SHELL to 1,460px inside a 1,280px window,
  // scrolling the header and the nav sideways with it. overflow-x-auto on the
  // table's own wrapper does not help until its ancestor is allowed to be
  // narrower than the table.
  return (
    <div className="mx-auto w-full min-w-0 max-w-[110rem] px-4 py-6 sm:px-6 sm:py-8">
      <Link
        href={timelinePath(community.slug)}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to the timeline
      </Link>

      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        Comparing the traditions by what is in them
      </h1>

      <div className="mt-4 max-w-3xl space-y-3 text-base text-foreground">
        <p>
          Most of these records carry no date. A timeline cannot put them side by side, and a table of dates would be
          almost entirely empty. What they do have is <strong>content</strong> — whether anybody was warned and by
          whom, what the water was, what if anything floated — so that is what this compares.
        </p>
      </div>

      {/* THE WARNING GOES ABOVE THE TABLE, NOT UNDER IT. A reader who meets the
          grid first has already drawn the wrong conclusion from it. */}
      <div className="mt-5 max-w-3xl rounded-xl border-l-4 border-l-danger bg-danger/5 p-4">
        <p className="font-semibold text-foreground">A blank cell means one thing only.</p>
        <p className="mt-1.5 text-sm text-muted-foreground">
          It means <strong className="text-foreground">the cited source was not found to contain that motif</strong> —
          not that the tradition lacks it. A blank can be a fragmentary text, a record citing one telling out of many,
          a broken passage, or simply nobody having checked yet. Gun and Yu has two motifs because that tradition
          really is a different shape; another record may have two because a tablet is broken. No grid can tell those
          apart, and this one does not try.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          There is deliberately <strong className="text-foreground">no similarity score</strong> here, and no closest
          match. Counting ticks across two rows would turn the gaps in what survives into a measurement of how alike
          two peoples&apos; stories are, which is not something this data can support.
        </p>
      </div>

      {events.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          Nothing here records motifs yet. They are added to records whose cited source was actually read for them.
        </p>
      ) : (
        <>
          {/* A wide table gets its own scroller rather than making the page
              scroll sideways. */}
          {/* w-0 min-w-full, NOT just overflow-x-auto.
              A scroll container still reports its CONTENT's width upward, and
              the app shell is a flex item that cannot shrink below the
              min-content width of what is inside it — so a 1,700px table made
              the whole shell 1,460px wide in a 1,280px window and scrolled the
              header and the nav sideways along with it. Every other page in
              the app measured 0px of overflow and this one measured 436.
              w-0 makes this element contribute nothing to that calculation;
              min-w-full gives it back its visible width. */}
          <div className="mt-6 w-0 min-w-full overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="sticky left-0 z-10 min-w-[14rem] bg-card p-3 text-left align-bottom font-semibold text-foreground">
                    Record
                  </th>
                  {groups.map((group) =>
                    group.motifs.map((motif, index) => (
                      <th
                        key={motif.key}
                        className={cn(
                          "p-2 align-bottom text-[11px] font-medium text-muted-foreground",
                          index === 0 && "border-l border-border"
                        )}
                      >
                        {/* Vertical, because forty columns of horizontal text
                            is a table nobody can read. */}
                        <span
                          className="block whitespace-nowrap"
                          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                        >
                          {motif.label}
                        </span>
                      </th>
                    ))
                  )}
                  <th className="border-l border-border p-3 text-right align-bottom text-[11px] font-medium text-muted-foreground">
                    Motifs found
                    <br />
                    in the source
                  </th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => {
                  const motifs = new Set(event.motifs ?? []);
                  return (
                    <tr key={event.id} className="border-b border-border last:border-b-0 hover:bg-muted/40">
                      <th className="sticky left-0 z-10 bg-card p-3 text-left font-medium">
                        <Link
                          href={`${timelinePath(community.slug)}/${event.slug}`}
                          className="text-foreground hover:text-accent hover:underline"
                        >
                          {event.title}
                        </Link>
                        {event.civilisations && event.civilisations.length > 0 && (
                          <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                            {event.civilisations.join(", ")}
                          </span>
                        )}
                      </th>
                      {groups.map((group) =>
                        group.motifs.map((motif, index) => (
                          <td
                            key={motif.key}
                            className={cn("p-2 text-center", index === 0 && "border-l border-border")}
                          >
                            {motifs.has(motif.key) ? (
                              <Check className="mx-auto h-4 w-4 text-accent" aria-hidden />
                            ) : (
                              <span className="sr-only">not found in the cited source</span>
                            )}
                            {motifs.has(motif.key) && (
                              <span className="sr-only">{motifLabel(motif.key)}: found in the cited source</span>
                            )}
                          </td>
                        ))
                      )}
                      <td className="border-l border-border p-3 text-right tabular-nums text-muted-foreground">
                        {motifs.size}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-sm text-muted-foreground">
            {events.length} {events.length === 1 ? "record" : "records"}, across{" "}
            {groups.reduce((total, group) => total + group.motifs.length, 0)} motifs that somebody here records. The
            last column counts how much the <em>cited source</em> carries — a low number is as likely to mean a short
            or damaged text as a simple story.
          </p>

          {unused.length > 0 && (
            <div className="mt-5 max-w-3xl rounded-xl border border-border bg-card p-4">
              <p className="text-sm font-semibold text-foreground">
                {unused.length} motifs are recorded by nothing here
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {unused.map((motif) => motifLabel(motif.key)).join(", ")}.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                That is a fact about this collection, not about the world. It usually means the traditions that carry
                them have not been seeded here — see{" "}
                <Link href={`${timelinePath(community.slug)}/coverage`} className="text-accent hover:underline">
                  what this timeline covers
                </Link>
                .
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
