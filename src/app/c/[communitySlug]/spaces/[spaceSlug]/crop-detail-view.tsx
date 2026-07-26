import Link from "next/link";
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
  ShieldCheck,
  Moon,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cropCategoryLabel } from "@/lib/crop-categories";
import {
  PHASE_EMOJI,
  PHASE_HEADLINE,
  PHASE_GUIDANCE,
  GROUP_LABEL,
  GROUP_SOW_PHASE,
  GROUP_HARVEST_PHASE,
  cropLunarGroup,
  type MoonPhase,
} from "@/lib/lunar";
import type { Crop, CropSection, CompanionRelationship, CropRegion, CropCalendar, CommunityCropRegion } from "@/types/database";
import type { CropDetail, CropCompanionWithLink, JournalWithAuthor, JournalStats, TipWithAuthor, MedicinalUseWithAuthor } from "@/lib/data/crop-guides";
import { PlantingCalendar } from "./planting-calendar";
import { YieldCalculator } from "./yield-calculator";
import { CropAssistantPanel } from "./crop-assistant-panel";
import { SaveCropButton, GrowingJournals, RegionalTips } from "./crop-community";
import { MedicinalUses } from "./crop-medicinal";
import { CompanionGraph } from "./companion-graph";

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

function Fact({ label, value }: { label: string; value: string | number | null }) {
  if (value == null || value === "") return null;
  return (
    <div className="grid gap-0.5">
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}

// Optional labelled paragraph inside a pest/disease card.
function Detail({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="mt-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  );
}

const RELATIONSHIP_META: Record<CompanionRelationship, { label: string; tone: "accent" | "neutral" | "danger" }> = {
  excellent: { label: "Excellent companions", tone: "accent" },
  neutral: { label: "Neutral companions", tone: "neutral" },
  avoid: { label: "Plants to avoid", tone: "danger" },
};

function severityTone(severity: string | null): "neutral" | "danger" {
  return severity && /high/i.test(severity) ? "danger" : "neutral";
}

function CompanionGroup({
  relationship,
  companions,
  communitySlug,
  spaceSlug,
}: {
  relationship: CompanionRelationship;
  companions: CropCompanionWithLink[];
  communitySlug: string;
  spaceSlug: string;
}) {
  if (companions.length === 0) return null;
  const meta = RELATIONSHIP_META[relationship];
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <Badge tone={meta.tone}>{meta.label}</Badge>
      </div>
      <ul className="space-y-2">
        {companions.map((c) => {
          const inner = (
            <>
              <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                {c.companion_name}
                {c.companion_slug && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
              </span>
              {c.reason && <span className="text-sm text-muted-foreground">{c.reason}</span>}
            </>
          );
          return (
            <li key={c.id} className="rounded-md border border-border bg-card p-3">
              {c.companion_slug ? (
                <Link href={`/c/${communitySlug}/spaces/${spaceSlug}/crop-guides/${c.companion_slug}`} className="block hover:opacity-80">
                  {inner}
                </Link>
              ) : (
                <div>{inner}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function MoonGardening({ crop, currentPhase }: { crop: Crop; currentPhase: MoonPhase }) {
  const group = cropLunarGroup(crop);
  const sowPhase = GROUP_SOW_PHASE[group];
  const harvestPhase = GROUP_HARVEST_PHASE[group];
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
        <Moon className="h-4 w-4 text-accent" />
        Moon gardening
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Treated as a <span className="font-medium text-foreground">{GROUP_LABEL[group].toLowerCase()}</span> for lunar timing.
      </p>

      <div className="mt-4 rounded-md bg-accent-soft p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">Right now</p>
        <p className="mt-1 text-sm font-medium text-foreground">
          {PHASE_EMOJI[currentPhase]} {currentPhase} — {PHASE_HEADLINE[currentPhase]}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{PHASE_GUIDANCE[currentPhase]}</p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-md border border-border p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Best phase to sow</p>
          <p className="mt-1 text-sm font-medium text-foreground">
            {PHASE_EMOJI[sowPhase]} {sowPhase}
          </p>
        </div>
        <div className="rounded-md border border-border p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Best phase to harvest</p>
          <p className="mt-1 text-sm font-medium text-foreground">
            {PHASE_EMOJI[harvestPhase]} {harvestPhase}
          </p>
        </div>
      </div>
    </section>
  );
}

export function CropDetailView({
  detail,
  currentPhase,
  currentMonth,
  regions,
  communityRegions,
  calendar,
  journals,
  journalStats,
  tips,
  medicinalUses,
  canContribute,
  isStaff,
  isSaved,
  assistantEnabled,
  viewerId,
  communityId,
  communitySlug,
  spaceSlug,
}: {
  detail: CropDetail;
  currentPhase: MoonPhase;
  currentMonth: number;
  regions: CropRegion[];
  communityRegions: CommunityCropRegion[];
  calendar: CropCalendar[];
  journals: JournalWithAuthor[];
  journalStats: JournalStats;
  tips: TipWithAuthor[];
  medicinalUses: MedicinalUseWithAuthor[];
  canContribute: boolean;
  isStaff: boolean;
  isSaved: boolean;
  assistantEnabled: boolean;
  viewerId: string;
  communityId: string;
  communitySlug: string;
  spaceSlug: string;
}) {
  const { crop, varieties, companions, pests, diseases } = detail;
  const sun = crop.sun ? SUN_LABELS[crop.sun] : null;
  const water = crop.water_need ? WATER_LABELS[crop.water_need] : null;

  const companionsByRel = (rel: CompanionRelationship) => companions.filter((c) => c.relationship === rel);
  const ctx = { cropId: crop.id, communityId, communitySlug, spaceSlug, cropSlug: crop.slug };

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

          <div className="mt-4 flex flex-wrap gap-2">
            {sun && <QuickBadge icon={sun.icon} label={sun.label} />}
            {water && <QuickBadge icon={water.icon} label={water.label} />}
            {crop.pollinator_friendly && <QuickBadge icon={<Flower2 className="h-3.5 w-3.5" />} label="Pollinator friendly" />}
            {crop.beginner_friendly && <QuickBadge icon={<Sprout className="h-3.5 w-3.5" />} label="Beginner friendly" />}
            {crop.nitrogen_fixer && <QuickBadge icon={<Bean className="h-3.5 w-3.5" />} label="Nitrogen fixer" />}
            {crop.organic_favourite && <QuickBadge icon={<Leaf className="h-3.5 w-3.5" />} label="Organic favourite" />}
            {crop.drought_tolerant && <QuickBadge icon={<Droplet className="h-3.5 w-3.5" />} label="Drought tolerant" />}
          </div>

          {canContribute && (
            <div className="mt-4">
              <SaveCropButton ctx={ctx} isSaved={isSaved} />
            </div>
          )}
        </div>
      </div>

      {crop.overview && (
        <section className="rounded-lg border border-border bg-card p-5">
          <p className="text-sm leading-relaxed text-foreground">{crop.overview}</p>
        </section>
      )}

      {assistantEnabled && canContribute && <CropAssistantPanel cropSlug={crop.slug} communityId={communityId} cropName={crop.common_name} />}

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

      <PlantingCalendar calendar={calendar} regions={regions} communityRegions={communityRegions} currentMonth={currentMonth} />

      <SectionBlock title="Soil" section={crop.soil} />
      <SectionBlock title="Sowing & planting" section={crop.sowing} />
      <SectionBlock title="Watering" section={crop.watering} />
      <SectionBlock title="Organic feeding" section={crop.feeding} />
      <SectionBlock title="Harvest" section={crop.harvest} />
      <SectionBlock title="Pruning & maintenance" section={crop.pruning} />
      <SectionBlock title="Pollination" section={crop.pollination} />
      <SectionBlock title="Seasonal task timeline" section={crop.task_timeline} />
      <SectionBlock title="Common problems" section={crop.troubleshooting} />
      <SectionBlock title="Biodiversity" section={crop.biodiversity} />

      <YieldCalculator crop={crop} />

      {/* Companion planting */}
      {companions.length > 0 && (
        <section className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-base font-semibold text-foreground">Companion planting</h2>
          <p className="mt-1 text-sm text-muted-foreground">Grow alongside these — tap a linked crop to open its guide.</p>
          <div className="mt-4">
            <CompanionGraph cropName={crop.common_name} companions={companions} communitySlug={communitySlug} spaceSlug={spaceSlug} />
          </div>
          <div className="mt-4 space-y-5">
            <CompanionGroup relationship="excellent" companions={companionsByRel("excellent")} communitySlug={communitySlug} spaceSlug={spaceSlug} />
            <CompanionGroup relationship="neutral" companions={companionsByRel("neutral")} communitySlug={communitySlug} spaceSlug={spaceSlug} />
            <CompanionGroup relationship="avoid" companions={companionsByRel("avoid")} communitySlug={communitySlug} spaceSlug={spaceSlug} />
          </div>
        </section>
      )}

      {/* Pests — organic guidance only */}
      {pests.length > 0 && (
        <section className="rounded-lg border border-border bg-card p-5">
          <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
            <Bug className="h-4 w-4 text-muted-foreground" />
            Pests
          </h2>
          <div className="mt-4 space-y-4">
            {pests.map((pest) => (
              <div key={pest.id} className="rounded-md border border-border p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground">{pest.name}</h3>
                  {pest.severity && <Badge tone={severityTone(pest.severity)}>{pest.severity}</Badge>}
                </div>
                <Detail label="Symptoms" value={pest.symptoms} />
                <Detail label="Life cycle" value={pest.life_cycle} />
                <Detail label="Damage" value={pest.damage} />
                <Detail label="Organic treatments" value={pest.organic_treatments} />
                <Detail label="Natural predators" value={pest.natural_predators} />
                <Detail label="Prevention" value={pest.prevention} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Diseases — organic guidance only */}
      {diseases.length > 0 && (
        <section className="rounded-lg border border-border bg-card p-5">
          <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            Diseases
          </h2>
          <div className="mt-4 space-y-4">
            {diseases.map((disease) => (
              <div key={disease.id} className="rounded-md border border-border p-4">
                <h3 className="text-sm font-semibold text-foreground">{disease.name}</h3>
                <Detail label="Symptoms" value={disease.symptoms} />
                <Detail label="Causes" value={disease.causes} />
                <Detail label="Early warning signs" value={disease.early_signs} />
                <Detail label="Organic control" value={disease.organic_control} />
                <Detail label="Prevention" value={disease.prevention} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Varieties */}
      {varieties.length > 0 && (
        <section className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-base font-semibold text-foreground">Varieties</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {varieties.map((v) => (
              <div key={v.id} className="rounded-md border border-border p-4">
                <h3 className="text-sm font-semibold text-foreground">{v.name}</h3>
                {v.description && <p className="mt-1 text-sm text-muted-foreground">{v.description}</p>}
                <dl className="mt-3 space-y-1.5 text-xs">
                  {[
                    ["Growth habit", v.growth_habit],
                    ["Time to harvest", v.time_to_harvest],
                    ["Yield", v.yield],
                    ["Disease resistance", v.disease_resistance],
                    ["Best climates", v.best_climates],
                    ["Flavour", v.flavour],
                    ["Uses", v.uses],
                  ].map(([label, value]) =>
                    value ? (
                      <div key={label} className="flex gap-2">
                        <dt className="shrink-0 font-medium text-foreground">{label}:</dt>
                        <dd className="text-muted-foreground">{value}</dd>
                      </div>
                    ) : null,
                  )}
                </dl>
              </div>
            ))}
          </div>
        </section>
      )}

      <MoonGardening crop={crop} currentPhase={currentPhase} />

      {/* Regional knowledge (§22) */}
      <RegionalTips ctx={ctx} tips={tips} canContribute={canContribute} isStaff={isStaff} />

      {/* Community medicinal-use log */}
      <MedicinalUses ctx={ctx} uses={medicinalUses} canContribute={canContribute} isStaff={isStaff} />

      {/* Growing journals (§19) */}
      <GrowingJournals ctx={ctx} journals={journals} stats={journalStats} canContribute={canContribute} isStaff={isStaff} viewerId={viewerId} />

      {/* Still to come in later phases */}
      <section className="rounded-lg border border-dashed border-border p-5">
        <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
          <Info className="h-4 w-4 text-muted-foreground" />
          More coming to this guide
        </h2>
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
          {["Plant health scanner"].map((label) => (
            <span key={label} className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1">
              {label}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
