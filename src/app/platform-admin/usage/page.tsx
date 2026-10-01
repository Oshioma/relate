import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser, getProfile } from "@/lib/data/profile";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  CHARS_PER_TOKEN,
  SYSTEM_PROMPT_CHARS,
  BYTES_PER_GB,
  USAGE_PERIODS,
  formatUsd,
  parseUsagePeriod,
} from "@/lib/usage/costs";
import { getUsageReport, UsageNotInstalledError, type UsageReport } from "@/lib/usage/report";

export const dynamic = "force-dynamic";

// How the ledger's kinds read on the page (see src/lib/usage/ai-meter.ts).
const OTHER_KIND_LABELS: Record<string, string> = {
  event_discovery: "Event discovery",
  plant_id: "Plant ID",
  plant_scanner: "Plant scanner",
  crop_assistant: "Growing assistant",
  crop_image_find: "Crop photo search",
  crop_image_generate: "Crop image generation",
  listing_import: "Listing import",
  concierge: "Concierge",
  lesson_read_url: "Reading pages into lessons",
};

const formatInt = (n: number) => Math.round(n).toLocaleString("en-US");
const formatTokens = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(2)}M` : n >= 1_000 ? `${(n / 1_000).toFixed(1)}k` : formatInt(n);
const formatHours = (seconds: number) => `${(seconds / 3600).toFixed(seconds < 36_000 ? 2 : 1)} h`;
const formatGB = (bytes: number) => `${(bytes / BYTES_PER_GB).toFixed(bytes < BYTES_PER_GB ? 3 : 2)} GB`;

export default async function PlatformUsagePage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  // The layout gates the section; re-verify here because everything below is
  // read with the service-role client, across every community.
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  if (!user) redirect("/login?next=/platform-admin/usage");
  const profile = await getProfile(supabase, user.id);
  if (!profile?.is_super_admin) redirect("/dashboard");

  const period = parseUsagePeriod((await searchParams).period);

  let report: UsageReport;
  try {
    report = await getUsageReport(createAdminClient(), period);
  } catch (error) {
    if (error instanceof UsageNotInstalledError) return <NotInstalled />;
    throw error;
  }

  const { summary, rates } = report;
  const periodLabel = USAGE_PERIODS.find((p) => p.key === period)!.label.toLowerCase();
  const top = summary.byCommunity.filter((c) => c.total > 0 || c.lessons > 0 || c.videos > 0).slice(0, report.topCommunities);

  return (
    <div>
      <p className="mb-6 text-sm text-muted-foreground">
        What the paid parts of Lessons have cost to run: Claude writing lessons, Whisper transcribing videos that had
        no captions, and the proxy the video worker downloads through. Every figure is an{" "}
        <strong className="text-foreground">estimate</strong> — real usage priced at the list rates below, not an
        invoice.
      </p>

      <nav className="mb-6 flex flex-wrap gap-1">
        {USAGE_PERIODS.map((option) => (
          <Link
            key={option.key}
            href={`/platform-admin/usage?period=${option.key}`}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              option.key === period
                ? "bg-accent-soft text-accent"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {option.label}
          </Link>
        ))}
      </nav>

      <div className="mb-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Tile label="Estimated total" value={formatUsd(summary.total)} hint={periodLabel} emphasis />
        <Tile
          label="Lessons written"
          value={formatInt(summary.lessons.count)}
          hint={`${formatUsd(summary.lessons.cost)} on Claude`}
        />
        <Tile
          label="Videos transcribed"
          value={formatInt(summary.videos.transcribed)}
          hint={`${formatUsd(summary.videos.cost)} on Whisper`}
        />
        <Tile label="Proxy data" value={formatGB(summary.proxy.bytes)} hint={`${formatUsd(summary.proxy.cost)}`} />
      </div>

      {/* The other AI features, as each recorded its own spend. */}
      {summary.other.cost > 0 && (
        <div className="mb-3 rounded-lg border border-border bg-card px-4 py-3 text-sm">
          <p className="font-medium text-foreground">
            Other AI features: {formatUsd(summary.other.cost)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {Object.entries(summary.other.byKind)
              .sort((a, b) => b[1] - a[1])
              .map(([kind, cost]) => `${OTHER_KIND_LABELS[kind] ?? kind} ${formatUsd(cost)}`)
              .join(" · ")}
          </p>
        </div>
      )}

      {(report.truncated.lessons || report.truncated.videos) && (
        <p className="mb-3 text-xs text-danger">
          Only the newest {report.rowCap.toLocaleString()}{" "}
          {report.truncated.lessons && report.truncated.videos
            ? "lessons and video jobs were"
            : report.truncated.lessons
              ? "lessons were"
              : "video jobs were"}{" "}
          counted, so these figures are lower than the truth. Pick a shorter period.
        </p>
      )}

      <div className="mt-8 grid gap-3 lg:grid-cols-3">
        <Card>
          <CardContent className="space-y-1.5 text-sm">
            <p className="font-medium text-foreground">Lessons (Claude)</p>
            <Line label="Lessons" value={formatInt(summary.lessons.count)} />
            <Line label="Input tokens" value={formatTokens(summary.lessons.inputTokens)} />
            <Line label="Output tokens" value={formatTokens(summary.lessons.outputTokens)} />
            <Line label="Estimated cost" value={formatUsd(summary.lessons.cost)} />
            {summary.lessons.estimated > 0 && (
              <p className="pt-1 text-xs text-muted-foreground">
                {formatInt(summary.lessons.estimated)} of these were written before token usage was recorded, so their
                tokens are guessed from text length (source + ~{SYSTEM_PROMPT_CHARS.toLocaleString()} chars of prompt in,
                the lesson out, {CHARS_PER_TOKEN} chars per token). Thinking isn&apos;t counted for those, so they
                read low.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-1.5 text-sm">
            <p className="font-medium text-foreground">Videos (Whisper)</p>
            <Line label="Transcribed" value={formatInt(summary.videos.transcribed)} />
            <Line label="From captions (free)" value={formatInt(summary.videos.captions)} />
            <Line label="Through Whisper" value={formatInt(summary.videos.whisper)} />
            <Line label="Audio transcribed" value={formatHours(summary.videos.audioSeconds)} />
            <Line label="Estimated cost" value={formatUsd(summary.videos.cost)} />
            <p className="pt-1 text-xs text-muted-foreground">
              Audio from failed jobs counts too — Whisper billed what it got through.
              {summary.videos.estimatedAudio > 0 &&
                ` ${formatInt(summary.videos.estimatedAudio)} older ${
                  summary.videos.estimatedAudio === 1 ? "job is" : "jobs are"
                } priced at the video's full length.`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-1.5 text-sm">
            <p className="font-medium text-foreground">Proxy (downloads)</p>
            <Line label="Jobs through the proxy" value={formatInt(summary.proxy.jobs)} />
            <Line label="Data" value={formatGB(summary.proxy.bytes)} />
            <Line label="Estimated cost" value={formatUsd(summary.proxy.cost)} />
            <p className="pt-1 text-xs text-muted-foreground">
              Counts the audio and captions downloaded, not the page lookups around them, so the real bill runs a
              little higher. Jobs from before this was recorded count as nothing.
            </p>
          </CardContent>
        </Card>
      </div>

      <h2 className="mb-3 mt-10 text-sm font-medium uppercase tracking-wide text-muted-foreground">
        By community (top {report.topCommunities} by cost, {periodLabel})
      </h2>
      {top.length === 0 ? (
        <p className="rounded-lg border border-border p-4 text-sm text-muted-foreground">
          Nothing was written or transcribed in this period.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="px-4 py-2 font-medium">Community</th>
                <th className="px-3 py-2 text-right font-medium">Lessons</th>
                <th className="px-3 py-2 text-right font-medium">Videos</th>
                <th className="px-3 py-2 text-right font-medium">Claude</th>
                <th className="px-3 py-2 text-right font-medium">Whisper</th>
                <th className="px-3 py-2 text-right font-medium">Proxy</th>
                <th className="px-3 py-2 text-right font-medium">Other AI</th>
                <th className="px-4 py-2 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {top.map((row) => {
                const community = report.communityNames[row.communityId];
                return (
                  <tr key={row.communityId}>
                    <td className="max-w-[14rem] truncate px-4 py-2 text-foreground">
                      {community ? (
                        <Link href={`/c/${community.slug}`} className="hover:underline">
                          {community.name}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">Deleted community</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">{formatInt(row.lessons)}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{formatInt(row.videos)}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{formatUsd(row.claudeCost)}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{formatUsd(row.whisperCost)}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{formatUsd(row.proxyCost)}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{formatUsd(row.otherCost)}</td>
                    <td className="px-4 py-2 text-right font-medium tabular-nums text-foreground">
                      {formatUsd(row.total)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-10 rounded-lg border border-border p-4 text-xs text-muted-foreground">
        <p className="mb-2 font-medium text-foreground">Rates used</p>
        <ul className="space-y-1">
          <li>
            Claude ({rates.claudeOverridden ? "all models, overridden" : rates.claudeDefault.model}): $
            {rates.claudeDefault.inputPerMTok} per million input tokens, ${rates.claudeDefault.outputPerMTok} per million
            output tokens
            {rates.claudeOverridden
              ? " — set by COST_CLAUDE_INPUT_PER_MTOK / COST_CLAUDE_OUTPUT_PER_MTOK."
              : ". Lessons recorded on another model use that model's list price."}
          </li>
          <li>Whisper (Groq whisper-large-v3-turbo): ${rates.whisperPerHour} per hour of audio.</li>
          <li>Residential proxy: ${rates.proxyPerGB} per GB.</li>
        </ul>
        <p className="mt-2">
          Change any of them with the <code>COST_CLAUDE_INPUT_PER_MTOK</code>, <code>COST_CLAUDE_OUTPUT_PER_MTOK</code>,{" "}
          <code>COST_WHISPER_PER_HOUR</code> and <code>COST_PROXY_PER_GB</code> environment variables. Rates apply to
          the whole history shown — nothing stores a price, only the usage.
        </p>
      </div>
    </div>
  );
}

function Tile({ label, value, hint, emphasis }: { label: string; value: string; hint: string; emphasis?: boolean }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={cn("mt-1 text-2xl font-semibold tabular-nums", emphasis ? "text-accent" : "text-foreground")}>
          {value}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums text-foreground">{value}</span>
    </div>
  );
}

function NotInstalled() {
  return (
    <div className="rounded-lg border border-border p-6">
      <p className="text-sm font-medium text-foreground">Usage isn&apos;t being recorded on this database yet.</p>
      <p className="mt-2 text-sm text-muted-foreground">
        Push the <code>lesson_usage_costs</code> migration (<code>supabase db push</code>, or paste{" "}
        <code>supabase/migrations/*_lesson_usage_costs.sql</code> into the SQL editor). Lessons and videos from then on
        record what they used; older lessons are estimated from their length.
      </p>
    </div>
  );
}
