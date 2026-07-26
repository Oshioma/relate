import Anthropic from "@anthropic-ai/sdk";
import type { CropDetail } from "@/lib/data/crop-guides";
import type { JournalStats } from "@/lib/data/crop-guides";
import type { CropSection } from "@/types/database";
import { calcMoonPhase, cropLunarGroup, GROUP_LABEL, GROUP_SOW_PHASE, GROUP_HARVEST_PHASE } from "@/lib/lunar";

const MODEL = "claude-haiku-4-5";
const MAX_QUESTION_LENGTH = 400;

let client: Anthropic | null = null;

function getClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (!client) client = new Anthropic();
  return client;
}

export function isCropAssistantConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// ORGANIC-ONLY is enforced in the prompt as well as the data model: even if a
// member asks for a synthetic/chemical product by name, the assistant redirects
// to organic methods.
const SYSTEM_PROMPT = `You are the Growing Assistant for an organic gardening community. Answer the member's question about the crop using ONLY the crop guide and community knowledge provided below the question — do not invent facts, pests, varieties or figures that aren't given. If the provided information doesn't cover the question, say so briefly and suggest what usually helps for this kind of crop.

This community is strictly organic: never recommend synthetic fertilisers, chemical pesticides, fungicides or herbicides. If asked about them, steer the grower to organic alternatives (compost, manure, seaweed, comfrey, companion planting, natural predators, cultural controls). When the season or moon phase is relevant to the question, take them into account.

Be practical, warm and concise: 2-5 short sentences, plain text only — no markdown, no headings, no bullet lists.`;

function sectionText(section: CropSection): string {
  return Object.entries(section)
    .map(([k, v]) => `${k.replace(/_/g, " ")}: ${v}`)
    .join("; ");
}

// Assemble a compact, grounded knowledge block from everything the crop page
// knows. Pure — the caller supplies the fetched data and the current date.
export function buildCropContext(detail: CropDetail, tips: { region: string | null; body: string }[], stats: JournalStats, now: Date): string {
  const { crop, varieties, companions, pests, diseases } = detail;
  const lines: string[] = [];

  const facts = [
    crop.scientific_name && `scientific name ${crop.scientific_name}`,
    `category ${crop.category}`,
    crop.difficulty && `difficulty ${crop.difficulty}`,
    crop.lifecycle,
    crop.preferred_climate && `climate ${crop.preferred_climate}`,
    crop.sun && `sun ${crop.sun.replace(/_/g, " ")}`,
    crop.water_need && `water ${crop.water_need}`,
    crop.edible_part && `edible part ${crop.edible_part}`,
  ]
    .filter(Boolean)
    .join(", ");
  lines.push(`CROP: ${crop.common_name} (${facts}).`);
  if (crop.overview) lines.push(`OVERVIEW: ${crop.overview}`);

  if (Object.keys(crop.soil).length) lines.push(`SOIL: ${sectionText(crop.soil)}`);
  if (Object.keys(crop.sowing).length) lines.push(`SOWING: ${sectionText(crop.sowing)}`);
  if (Object.keys(crop.watering).length) lines.push(`WATERING: ${sectionText(crop.watering)}`);
  if (Object.keys(crop.feeding).length) lines.push(`ORGANIC FEEDING: ${sectionText(crop.feeding)}`);
  if (Object.keys(crop.harvest).length) lines.push(`HARVEST: ${sectionText(crop.harvest)}`);

  if (varieties.length) lines.push(`VARIETIES: ${varieties.map((v) => `${v.name}${v.description ? ` — ${v.description}` : ""}`).join("; ")}`);

  for (const rel of ["excellent", "neutral", "avoid"] as const) {
    const group = companions.filter((c) => c.relationship === rel);
    if (group.length) lines.push(`COMPANIONS (${rel}): ${group.map((c) => `${c.companion_name}${c.reason ? ` (${c.reason})` : ""}`).join("; ")}`);
  }

  if (pests.length)
    lines.push(`PESTS (organic control only): ${pests.map((p) => `${p.name}: ${[p.symptoms, p.organic_treatments && `organic treatment ${p.organic_treatments}`, p.natural_predators && `predators ${p.natural_predators}`, p.prevention && `prevention ${p.prevention}`].filter(Boolean).join(", ")}`).join(" | ")}`);
  if (diseases.length)
    lines.push(`DISEASES (organic control only): ${diseases.map((d) => `${d.name}: ${[d.symptoms, d.organic_control && `organic control ${d.organic_control}`, d.prevention && `prevention ${d.prevention}`].filter(Boolean).join(", ")}`).join(" | ")}`);

  if (tips.length) lines.push(`COMMUNITY TIPS: ${tips.slice(0, 8).map((t) => `${t.region ? `[${t.region}] ` : ""}${t.body}`).join(" | ")}`);

  if (stats.entryCount > 0) {
    const parts = [`${stats.growerCount} grower(s) logged this crop`];
    if (stats.avgYieldKg != null) parts.push(`average harvest ${stats.avgYieldKg.toFixed(1)} kg`);
    if (stats.avgDaysToHarvest != null) parts.push(`average ${stats.avgDaysToHarvest} days to harvest`);
    if (stats.topVariety) parts.push(`highest-rated variety ${stats.topVariety.name}`);
    lines.push(`COMMUNITY EXPERIENCE: ${parts.join("; ")}.`);
  }

  const group = cropLunarGroup(crop);
  const phase = calcMoonPhase(now);
  lines.push(
    `SEASON & MOON: it is currently ${MONTH_NAMES[now.getMonth()]}; the moon is in its ${phase} phase. This is a ${GROUP_LABEL[group].toLowerCase()}; traditionally best sown on a ${GROUP_SOW_PHASE[group]} and harvested on a ${GROUP_HARVEST_PHASE[group]}.`,
  );

  return lines.join("\n");
}

// Returns the assistant's answer, or null when unconfigured or the call fails.
export async function askCropAssistant(cropName: string, question: string, context: string): Promise<string | null> {
  const anthropic = getClient();
  if (!anthropic) return null;

  const q = question.slice(0, MAX_QUESTION_LENGTH);

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: `Crop: ${cropName}\nQuestion: ${q}\n\nCrop guide & community knowledge:\n${context}` }],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    return textBlock ? textBlock.text.trim() : null;
  } catch {
    return null;
  }
}
