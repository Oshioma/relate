import Link from "next/link";
import {
  Waves,
  Wind,
  Droplets,
  MapPin,
  CloudOff,
  ArrowUpToLine,
  ArrowDownToLine,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  getLiveConditions,
  describeWeatherCode,
  formatLocalHour,
  formatMinutesUntil,
  type TideOutlook,
  type TideEvent,
} from "@/lib/weather";

// Live conditions panel at the top of a Tides & Weather resources space.
// Tides lead (that's what people open this space for), current weather sits
// underneath. Every "no data" path renders a visible state instead of
// vanishing: admins get told exactly what to fix (usually the community's
// location in admin settings), everyone else sees at most a soft
// "temporarily unavailable" note. Data calls share the home-page sidebar
// card's cached Open-Meteo fetches.
export async function TidesWeatherPanel({
  community,
  communitySlug,
  isAdmin,
}: {
  community: { location_type: string | null; location_name: string | null };
  communitySlug: string;
  isAdmin: boolean;
}) {
  const live = await getLiveConditions(community);

  if (live.status === "no_location" || live.status === "location_not_found") {
    if (!isAdmin) return null;
    return (
      <AdminHint
        title={
          live.status === "no_location"
            ? "Add a location to turn on live tides & weather"
            : `We couldn't find "${live.locationName}" on the map`
        }
        body={
          live.status === "no_location"
            ? "Set your community's Location in the admin settings (e.g. “Zanzibar, Tanzania”) and live conditions will appear here for everyone."
            : "Try a more specific or better-known place name in the admin settings — “Nungwi, Zanzibar” works better than a nickname."
        }
        communitySlug={communitySlug}
      />
    );
  }

  if (live.status === "unavailable") {
    return (
      <Card className="mb-6">
        <CardContent className="flex items-center gap-3 pt-5 text-sm text-muted-foreground">
          <CloudOff className="h-5 w-5 shrink-0" />
          Live tides &amp; weather are temporarily unavailable — check back shortly.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mb-6 space-y-4">
      {live.tides && <TideBoard tides={live.tides} />}

      {live.tidal && !live.tides && isAdmin && (
        <AdminHint
          title="No tide data for this exact spot"
          body={`The marine model has no sea-level data where "${community.location_name}" landed on the map. A location name right on the coast usually fixes it.`}
          communitySlug={communitySlug}
        />
      )}

      {live.current && (
        <Card>
          <CardContent className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-5 text-sm text-foreground">
            <span className="text-lg font-semibold">{Math.round(live.current.temperature)}°C</span>
            <span className="text-muted-foreground">{describeWeatherCode(live.current.weatherCode).label}</span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Wind className="h-3.5 w-3.5" />
              {Math.round(live.current.windSpeed)} km/h
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Droplets className="h-3.5 w-3.5" />
              {Math.round(live.current.humidity)}%
            </span>
          </CardContent>
        </Card>
      )}

      <p className="text-[10px] text-muted-foreground">
        {live.resolvedName} · Data by{" "}
        <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" className="underline">
          Open-Meteo
        </a>
        {live.tides && " · tide times are approximate (±30 min) — not for navigation"}
      </p>
    </div>
  );
}

function AdminHint({ title, body, communitySlug }: { title: string; body: string; communitySlug: string }) {
  return (
    <Card className="mb-6 border-dashed">
      <CardContent className="pt-5">
        <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <MapPin className="h-4 w-4 text-accent" />
          {title}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{body}</p>
        <Link
          href={`/c/${communitySlug}/admin`}
          className="mt-2 inline-block text-sm font-medium text-accent hover:underline"
        >
          Open admin settings
        </Link>
        <p className="mt-2 text-xs text-muted-foreground">Only admins see this note.</p>
      </CardContent>
    </Card>
  );
}

function TideBoard({ tides }: { tides: TideOutlook }) {
  const next = tides.next;
  const after = next ? tides.events.find((e) => e.minutesUntil > next.minutesUntil) : undefined;
  const today = tides.curve[0]?.time.split("T")[0];
  const days: { label: string; events: TideEvent[] }[] = [
    { label: "Today", events: tides.events.filter((e) => e.time.split("T")[0] === today) },
    { label: "Tomorrow", events: tides.events.filter((e) => e.time.split("T")[0] !== today) },
  ];

  return (
    <Card>
      <CardContent className="pt-5">
        {next && (
          <div className="rounded-md bg-accent-soft p-4">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-accent">
              <Waves className="h-4 w-4" />
              Next tide
            </p>
            <p className="mt-1 text-3xl font-bold leading-tight tracking-tight text-foreground">
              {next.kind === "high" ? "High" : "Low"} tide · {formatLocalHour(next.time)}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatMinutesUntil(next.minutesUntil)} · {next.height.toFixed(1)} m
              {after && (
                <>
                  {" "}
                  — then {after.kind === "high" ? "high" : "low"} tide at {formatLocalHour(after.time)}
                </>
              )}
            </p>
          </div>
        )}

        <div className="mt-4">
          <TideChart tides={tides} />
          <div className="flex text-center text-xs text-muted-foreground">
            <span className="w-1/2">Today</span>
            <span className="w-1/2">Tomorrow</span>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {days.map((day) => (
            <div key={day.label}>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">{day.label}</p>
              <ul className="space-y-1.5">
                {day.events.map((tide) => {
                  const past = tide.minutesUntil < 0;
                  const isNext = tide === next;
                  return (
                    <li
                      key={tide.time}
                      className={cn(
                        "flex items-center justify-between rounded-md border px-3 py-2",
                        isNext ? "border-accent bg-accent-soft" : "border-border",
                        past && "opacity-50"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        {tide.kind === "high" ? (
                          <ArrowUpToLine className="h-4 w-4 shrink-0 text-accent" />
                        ) : (
                          <ArrowDownToLine className="h-4 w-4 shrink-0 text-muted-foreground" />
                        )}
                        <span className={cn("text-sm text-foreground", tide.kind === "high" && "font-semibold")}>
                          {tide.kind === "high" ? "High" : "Low"}
                        </span>
                      </span>
                      <span className="text-sm font-semibold tabular-nums text-foreground">{formatLocalHour(tide.time)}</span>
                      <span className="w-12 text-right text-xs text-muted-foreground">{tide.height.toFixed(1)} m</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Server-rendered SVG of the 48h sea-level curve: filled tide curve, dashed
// "now" line, a dot at every high (accent) and low (dimmed). Stretched to the
// container with preserveAspectRatio="none" — the slight dot distortion is
// invisible at this size and saves shipping any charting JS.
function TideChart({ tides }: { tides: TideOutlook }) {
  const W = 600;
  const H = 140;
  const PAD = 14;
  const { curve, events, nowFraction } = tides;
  if (curve.length < 2) return null;

  const heights = curve.map((p) => p.height);
  const min = Math.min(...heights);
  const span = Math.max(0.01, Math.max(...heights) - min);
  const x = (i: number) => (i / (curve.length - 1)) * W;
  const y = (h: number) => PAD + (1 - (h - min) / span) * (H - 2 * PAD);

  const line = curve.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.height).toFixed(1)}`).join(" ");
  const nowX = (nowFraction * W).toFixed(1);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-36 w-full" aria-hidden="true">
      <path d={`${line} L${W},${H} L0,${H} Z`} fill="var(--accent)" fillOpacity={0.12} stroke="none" />
      <path d={line} fill="none" stroke="var(--accent)" strokeWidth={2} vectorEffect="non-scaling-stroke" />
      <line
        x1={nowX}
        y1={0}
        x2={nowX}
        y2={H}
        stroke="var(--foreground)"
        strokeOpacity={0.45}
        strokeWidth={1.5}
        strokeDasharray="4 4"
        vectorEffect="non-scaling-stroke"
      />
      {events.map((e) => {
        const i = curve.findIndex((p) => p.time === e.time);
        if (i < 0) return null;
        return (
          <circle
            key={e.time}
            cx={x(i)}
            cy={y(e.height)}
            r={4.5}
            fill={e.kind === "high" ? "var(--accent)" : "var(--foreground)"}
            fillOpacity={e.kind === "high" ? 1 : 0.35}
          />
        );
      })}
    </svg>
  );
}
