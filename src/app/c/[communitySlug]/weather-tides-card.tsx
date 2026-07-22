import {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Droplets,
  Waves,
  ArrowUpToLine,
  ArrowDownToLine,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  getCommunityWeather,
  describeWeatherCode,
  formatLocalHour,
  formatMinutesUntil,
  formatWeekday,
  type WeatherIcon,
} from "@/lib/weather";

const WEATHER_ICONS: Record<WeatherIcon, LucideIcon> = {
  sun: Sun,
  "partly-cloudy": CloudSun,
  cloud: Cloud,
  fog: CloudFog,
  drizzle: CloudDrizzle,
  rain: CloudRain,
  snow: CloudSnow,
  storm: CloudLightning,
};

// Server component: fetches on the server and renders nothing at all when the
// community has no location or the weather providers are unreachable, so the
// sidebar never shows a broken card. Stream it inside <Suspense> — it awaits
// external APIs and shouldn't hold up the rest of the page.
export async function WeatherTidesCard({
  community,
}: {
  community: { location_type: string | null; location_name: string | null };
}) {
  const weather = await getCommunityWeather(community);
  if (!weather) return null;

  const condition = describeWeatherCode(weather.current.weatherCode);
  const ConditionIcon = WEATHER_ICONS[condition.icon];
  const outlook = weather.daily.slice(0, 4);

  return (
    <div className="mb-6">
      <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
        {weather.tides ? "Tides & weather" : "Weather"}
      </h2>
      <Card>
        <CardContent className="pt-5">
          <div className="flex items-center gap-3">
            <ConditionIcon className="h-9 w-9 shrink-0 text-accent" />
            <div className="min-w-0">
              <p className="text-2xl font-semibold leading-tight text-foreground">
                {Math.round(weather.current.temperature)}°C
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {condition.label} · feels like {Math.round(weather.current.feelsLike)}°
              </p>
            </div>
          </div>

          <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Wind className="h-3.5 w-3.5" />
              {Math.round(weather.current.windSpeed)} km/h
            </span>
            <span className="flex items-center gap-1">
              <Droplets className="h-3.5 w-3.5" />
              {Math.round(weather.current.humidity)}%
            </span>
          </div>

          <div className="mt-4 grid grid-cols-4 gap-1 border-t border-border pt-4">
            {outlook.map((day, i) => {
              const dayCondition = describeWeatherCode(day.weatherCode);
              const DayIcon = WEATHER_ICONS[dayCondition.icon];
              return (
                <div key={day.date} className="flex flex-col items-center gap-1">
                  <span className="text-xs text-muted-foreground">{i === 0 ? "Today" : formatWeekday(day.date)}</span>
                  <DayIcon className="h-4 w-4 text-muted-foreground" aria-label={dayCondition.label} />
                  <span className="text-xs text-foreground">
                    {Math.round(day.maxTemp)}°
                    <span className="text-muted-foreground"> {Math.round(day.minTemp)}°</span>
                  </span>
                </div>
              );
            })}
          </div>

          {weather.tides && (
            <div className="mt-4 border-t border-border pt-4">
              <div className="rounded-md bg-accent-soft p-3">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-accent">
                  <Waves className="h-3.5 w-3.5" />
                  Next tide
                </p>
                <p className="mt-1 text-lg font-semibold leading-tight text-foreground">
                  {weather.tides[0].kind === "high" ? "High" : "Low"} tide · {formatLocalHour(weather.tides[0].time)}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatMinutesUntil(weather.tides[0].minutesUntil)} · {weather.tides[0].height.toFixed(1)} m
                </p>
              </div>
              {weather.tides.length > 1 && (
                <ul className="mt-2 space-y-1.5">
                  {weather.tides.slice(1).map((tide) => (
                    <li key={tide.time} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1.5 text-foreground">
                        {tide.kind === "high" ? (
                          <ArrowUpToLine className="h-3.5 w-3.5 text-accent" />
                        ) : (
                          <ArrowDownToLine className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                        {tide.kind === "high" ? "High" : "Low"} · {formatLocalHour(tide.time)}
                      </span>
                      <span className="text-xs text-muted-foreground">{tide.height.toFixed(1)} m</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <p className="mt-4 text-[10px] text-muted-foreground">
            {weather.resolvedName} · Weather data by{" "}
            <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" className="underline">
              Open-Meteo
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
