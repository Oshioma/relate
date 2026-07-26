import Link from "next/link";
import type { CompanionRelationship } from "@/types/database";
import type { CropCompanionWithLink } from "@/lib/data/crop-guides";

// Relationship styling shared by edges (SVG stroke) and nodes (Tailwind).
const REL: Record<CompanionRelationship, { edge: string; node: string; legend: string }> = {
  excellent: { edge: "#10b981", node: "border-emerald-500 text-emerald-700 dark:text-emerald-400", legend: "bg-emerald-500" },
  neutral: { edge: "#94a3b8", node: "border-border text-muted-foreground", legend: "bg-slate-400" },
  avoid: { edge: "#fb7185", node: "border-rose-400 text-rose-600 dark:text-rose-400", legend: "bg-rose-400" },
};

// A radial companion graph: the crop sits at the centre, companions around it,
// edges coloured by relationship. Companions in the library link to their guide.
// HTML nodes positioned over an SVG that draws only the edges, so nodes stay
// clickable and legible.
export function CompanionGraph({
  cropName,
  companions,
  communitySlug,
  spaceSlug,
}: {
  cropName: string;
  companions: CropCompanionWithLink[];
  communitySlug: string;
  spaceSlug: string;
}) {
  const n = companions.length;
  if (n === 0) return null;

  // Position each companion on a circle (radius in the 0–100 coordinate space).
  const R = 38;
  const nodes = companions.map((c, i) => {
    const angle = (-90 + (i * 360) / n) * (Math.PI / 180);
    return { c, x: 50 + R * Math.cos(angle), y: 50 + R * Math.sin(angle) };
  });

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="relative aspect-square">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          {nodes.map(({ c, x, y }) => (
            <line key={c.id} x1="50" y1="50" x2={x} y2={y} stroke={REL[c.relationship].edge} strokeWidth="0.5" />
          ))}
        </svg>

        {/* Centre: the crop itself */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="inline-block rounded-full border-2 border-accent bg-accent-soft px-3 py-1.5 text-sm font-semibold text-accent">{cropName}</span>
        </div>

        {/* Companions */}
        {nodes.map(({ c, x, y }) => {
          const cls = `inline-block rounded-full border bg-card px-2.5 py-1 text-xs font-medium ${REL[c.relationship].node}`;
          return (
            <div key={c.id} className="absolute -translate-x-1/2 -translate-y-1/2 text-center" style={{ left: `${x}%`, top: `${y}%` }}>
              {c.companion_slug ? (
                <Link href={`/c/${communitySlug}/spaces/${spaceSlug}/crop-guides/${c.companion_slug}`} className={`${cls} hover:opacity-80`}>
                  {c.companion_name}
                </Link>
              ) : (
                <span className={cls}>{c.companion_name}</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {(["excellent", "neutral", "avoid"] as CompanionRelationship[]).map((rel) => (
          <span key={rel} className="flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-full ${REL[rel].legend}`} />
            {rel === "excellent" ? "Excellent" : rel === "neutral" ? "Neutral" : "Avoid"}
          </span>
        ))}
      </div>
    </div>
  );
}
