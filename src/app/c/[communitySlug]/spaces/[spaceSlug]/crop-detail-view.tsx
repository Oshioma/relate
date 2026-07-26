import {
  Sprout,
  Sun,
  CloudSun,
  Droplet,
  Droplets,
  Bug,
  Leaf,
  Flower2,
  Bean,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cropCategoryLabel } from "@/lib/crop-categories";
import type { Crop, CropSection } from "@/types/database";

// Humanise a section key ("row_spacing" -> "Row spacing") for display.
function humanise(key: string): string {
  const spaced = key.replace(/[_-]+/g, " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function hasEntries(section: CropSection): boolean {
  return section && Object.keys(section).length > 0;
}

function SectionBlock({ title, section }: { title: string; section: CropSection }) {
  if (!hasEntries(section)) return null;
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <dl className="mt-3 space-y-2.5">
        {Object.entries(section).map(([key, value]) => (
          <div key={key} className="grid gap-0.5 sm:grid-cols-[10rem_1fr] sm:gap-3">
            <dt className="text-sm font-medium text-foreground">{humanise(key)}</dt>
            <dd className="text-sm text-muted-foreground">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function QuickBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
      {icon}
      {label}
    </span>
  );
}

const SUN_LABELS: Record<string, { label: string; icon: React.ReactNode }> = {
  full_sun: { label: "Full sun", icon: <Sun className="h-3.5 w-3.5" /> },
  partial_shade: { label: "Partial shade", icon: <CloudSun className="h-3.5 w-3.5" /> },
  full_shade: { label: "Full shade", icon: <CloudSun className="h-3.5 w-3.5" /> },
};

const WATER_LABELS: Record<string, { label: string; icon: React.ReactNode }> = {
  low: { label: "Low water", icon: <Droplet className="h-3.5 w-3.5" /> },
  moderate: { label: "Moderate water", icon: <Droplets className="h-3.5 w-3.5" /> },
  high: { label: "High water", icon: <Droplets className="h-3.5 w-3.5" /> },
};

// A labelled fact for the overview grid, only rendered when present.
function Fact({ label, value }: { label: string; value: string | number | null }) {
  if (value == null || value === "") return null;
  return (
    <div className="grid gap-0.5">
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}

export function CropDetailView({ crop }: { crop: Crop }) {
  const sun = crop.sun ? SUN_LABELS[crop.sun] : null;
  const water = crop.water_need ? WATER_LABELS[crop.water_need] : null;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="flex aspect-[16/7] items-center justify-center bg-accent-soft">
          {crop.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={crop.image_url} alt={crop.common_name} className="h-full w-full object-cover" />
          ) : (
            <Sprout className="h-14 w-14 text-accent" />
          )}
        </div>
        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold text-foreground">{crop.common_name}</h1>
            <Badge tone="neutral">{cropCategoryLabel(crop.category)}</Badge>
            {crop.status === "draft" && <Badge tone="danger">Draft</Badge>}
          </div>
          {crop.scientific_name && <p className="mt-1 text-sm italic text-muted-foreground">{crop.scientific_name}</p>}

          {/* Quick badges */}
          <div className="mt-4 flex flex-wrap gap-2">
            {sun && <QuickBadge icon={sun.icon} label={sun.label} />}
            {water && <QuickBadge icon={water.icon} label={water.label} />}
            {crop.pollinator_friendly && <QuickBadge icon={<Flower2 className="h-3.5 w-3.5" />} label="Pollinator friendly" />}
            {crop.beginner_friendly && <QuickBadge icon={<Sprout className="h-3.5 w-3.5" />} label="Beginner friendly" />}
            {crop.nitrogen_fixer && <QuickBadge icon={<Bean className="h-3.5 w-3.5" />} label="Nitrogen fixer" />}
            {crop.organic_favourite && <QuickBadge icon={<Leaf className="h-3.5 w-3.5" />} label="Organic favourite" />}
            {crop.drought_tolerant && <QuickBadge icon={<Droplet className="h-3.5 w-3.5" />} label="Drought tolerant" />}
          </div>
        </div>
      </div>

      {crop.overview && (
        <section className="rounded-lg border border-border bg-card p-5">
          <p className="text-sm leading-relaxed text-foreground">{crop.overview}</p>
        </section>
      )}

      {/* Overview facts */}
      <section className="rounded-lg border border-border bg-card p-5">
        <h2 className="mb-3 text-base font-semibold text-foreground">At a glance</h2>
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Fact label="Family" value={crop.family} />
          <Fact label="Lifecycle" value={crop.lifecycle} />
          <Fact label="Difficulty" value={crop.difficulty} />
          <Fact label="Time to maturity" value={crop.time_to_maturity_days != null ? `${crop.time_to_maturity_days} days` : null} />
          <Fact label="Average yield" value={crop.average_yield} />
          <Fact label="Preferred climate" value={crop.preferred_climate} />
          <Fact label="USDA zones" value={crop.usda_zones} />
          <Fact label="Pollination" value={crop.pollination_type} />
          <Fact label="Edible part" value={crop.edible_part} />
        </dl>
      </section>

      <SectionBlock title="Soil" section={crop.soil} />
      <SectionBlock title="Sowing & planting" section={crop.sowing} />
      <SectionBlock title="Watering" section={crop.watering} />
      <SectionBlock title="Organic feeding" section={crop.feeding} />
      <SectionBlock title="Harvest" section={crop.harvest} />

      {/* Sections still to come in later phases — signposted so the page reads as
          part of a larger, living guide rather than a static stub. */}
      <section className="rounded-lg border border-dashed border-border p-5">
        <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
          <Info className="h-4 w-4 text-muted-foreground" />
          More coming to this guide
        </h2>
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
          {["Varieties", "Companion planting", "Pests (organic)", "Diseases (organic)", "Regional calendar", "Growing journals", "Moon gardening"].map((label) => (
            <span key={label} className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1">
              {label === "Pests (organic)" ? <Bug className="h-3 w-3" /> : null}
              {label}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
