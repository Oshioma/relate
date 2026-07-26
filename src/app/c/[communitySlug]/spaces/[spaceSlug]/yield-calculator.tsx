"use client";

import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";
import type { Crop } from "@/types/database";

// Pull a sensible per-plant yield (kg) out of the crop's free-text average_yield
// when it's expressed "per plant", e.g. "3–5 kg per plant" -> 4. Returns null
// when the text isn't per-plant (e.g. "per square metre") so the user fills it in.
function parseYieldPerPlant(text: string | null): number | null {
  if (!text || !/per\s+plant/i.test(text) || !/kg/i.test(text)) return null;
  const nums = (text.match(/\d+(?:\.\d+)?/g) ?? []).map(Number).filter((n) => Number.isFinite(n));
  if (nums.length === 0) return null;
  const avg = nums.reduce((s, n) => s + n, 0) / nums.length; // midpoint of a range
  return Math.round(avg * 100) / 100;
}

const inputCls =
  "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

function num(v: string): number | null {
  const t = v.trim();
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export function YieldCalculator({ crop }: { crop: Crop }) {
  const [method, setMethod] = useState<"plants" | "area">("plants");
  const [plants, setPlants] = useState("");
  const [area, setArea] = useState("");
  const [spacing, setSpacing] = useState("");
  const [perPlant, setPerPlant] = useState(() => {
    const parsed = parseYieldPerPlant(crop.average_yield);
    return parsed != null ? String(parsed) : "";
  });
  const [fruitWeight, setFruitWeight] = useState("");

  const result = useMemo(() => {
    const yieldPerPlant = num(perPlant);
    if (yieldPerPlant == null) return null;

    let plantCount: number | null = null;
    if (method === "plants") {
      plantCount = num(plants);
    } else {
      const a = num(area);
      const s = num(spacing);
      if (a != null && s != null && s > 0) {
        const sMeters = s / 100;
        plantCount = Math.floor(a / (sMeters * sMeters));
      }
    }
    if (plantCount == null || plantCount <= 0) return null;

    const totalKg = plantCount * yieldPerPlant;
    const fw = num(fruitWeight);
    const fruits = fw != null && fw > 0 ? Math.round((totalKg * 1000) / fw) : null;
    return { plantCount, totalKg, fruits };
  }, [method, plants, area, spacing, perPlant, fruitWeight]);

  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
        <Calculator className="h-4 w-4 text-accent" />
        Yield calculator
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">Estimate your harvest. All values are approximate.</p>

      <div className="mt-4 flex gap-2">
        {(["plants", "area"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMethod(m)}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              method === m ? "border-accent bg-accent-soft text-accent" : "border-border text-muted-foreground hover:border-muted-foreground/40"
            }`}
          >
            {m === "plants" ? "By number of plants" : "By garden area"}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {method === "plants" ? (
          <Field label="Number of plants">
            <input type="number" min="0" value={plants} onChange={(e) => setPlants(e.target.value)} className={inputCls} placeholder="e.g. 12" />
          </Field>
        ) : (
          <>
            <Field label="Garden area (m²)">
              <input type="number" min="0" step="0.1" value={area} onChange={(e) => setArea(e.target.value)} className={inputCls} placeholder="e.g. 10" />
            </Field>
            <Field label="Plant spacing (cm)">
              <input type="number" min="0" value={spacing} onChange={(e) => setSpacing(e.target.value)} className={inputCls} placeholder="e.g. 45" />
            </Field>
          </>
        )}
        <Field label="Yield per plant (kg)">
          <input type="number" min="0" step="0.1" value={perPlant} onChange={(e) => setPerPlant(e.target.value)} className={inputCls} placeholder="e.g. 4" />
        </Field>
        <Field label="Avg fruit weight (g) — optional">
          <input type="number" min="0" value={fruitWeight} onChange={(e) => setFruitWeight(e.target.value)} className={inputCls} placeholder="e.g. 120" />
        </Field>
      </div>

      {result ? (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          <Out label="Plants" value={result.plantCount.toLocaleString()} />
          <Out label="Estimated harvest" value={`${result.totalKg.toFixed(1)} kg`} />
          {result.fruits != null && <Out label="Approx. fruits" value={result.fruits.toLocaleString()} />}
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">Enter a yield per plant and your plants or area to see an estimate.</p>
      )}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function Out({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-accent-soft p-3 text-center">
      <div className="text-lg font-semibold text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
