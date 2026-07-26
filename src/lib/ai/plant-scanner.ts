import Anthropic from "@anthropic-ai/sdk";

const MODEL = "claude-haiku-4-5";

let client: Anthropic | null = null;

function getClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (!client) client = new Anthropic();
  return client;
}

export function isPlantScannerConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export type ScanConfidence = "low" | "medium" | "high";
export type ScanFindingType = "pest" | "disease" | "deficiency" | "environmental";

export type ScanFinding = {
  type: ScanFindingType;
  name: string;
  confidence: ScanConfidence;
  organic_treatment: string;
  prevention: string;
};

export type PlantScanResult = {
  crop_guess: string | null;
  crop_confidence: ScanConfidence;
  healthy: boolean;
  findings: ScanFinding[];
  summary: string;
};

export type AnthropicImageMediaType = "image/jpeg" | "image/png" | "image/gif" | "image/webp";

const SYSTEM_PROMPT = `You are an organic plant-health diagnostician. From a single photo you identify the crop and diagnose likely problems: pests, diseases, nutrient deficiencies, or environmental/cultural stress (over/under-watering, sun scorch, cold damage). Estimate confidence honestly — say "low" when the image is unclear or ambiguous.

This community is strictly organic: every treatment you give must be an organic method (hand-picking, insecticidal soap, neem, compost/organic amendments, seaweed, companion planting, natural predators, cultural fixes). Never recommend synthetic fertilisers or chemical pesticides, fungicides or herbicides.

Respond with ONLY a JSON object, no prose or markdown, matching exactly:
{
  "crop_guess": string or null,
  "crop_confidence": "low" | "medium" | "high",
  "healthy": boolean,
  "findings": [
    { "type": "pest" | "disease" | "deficiency" | "environmental", "name": string, "confidence": "low" | "medium" | "high", "organic_treatment": string, "prevention": string }
  ],
  "summary": string
}
If the plant looks healthy, set "healthy": true and "findings": []. If you cannot tell what the crop is, set "crop_guess": null. Keep each field to one or two plain sentences.`;

const VALID_CONFIDENCE = new Set(["low", "medium", "high"]);
const VALID_TYPE = new Set(["pest", "disease", "deficiency", "environmental"]);

// Validate/normalise the model's JSON into a PlantScanResult, or null if it's
// unusable. Defensive: the model is instructed to return strict JSON, but we
// never trust that blindly.
function parseResult(text: string): PlantScanResult | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;

  let raw: unknown;
  try {
    raw = JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }

  const o = raw as Record<string, unknown>;
  const conf = (v: unknown): ScanConfidence => (typeof v === "string" && VALID_CONFIDENCE.has(v) ? (v as ScanConfidence) : "low");

  const findings = Array.isArray(o.findings)
    ? o.findings
        .map((f) => f as Record<string, unknown>)
        .filter((f) => typeof f.name === "string" && typeof f.type === "string" && VALID_TYPE.has(f.type as string))
        .map((f) => ({
          type: f.type as ScanFindingType,
          name: String(f.name),
          confidence: conf(f.confidence),
          organic_treatment: typeof f.organic_treatment === "string" ? f.organic_treatment : "",
          prevention: typeof f.prevention === "string" ? f.prevention : "",
        }))
    : [];

  return {
    crop_guess: typeof o.crop_guess === "string" && o.crop_guess.trim() ? o.crop_guess.trim() : null,
    crop_confidence: conf(o.crop_confidence),
    healthy: o.healthy === true,
    findings,
    summary: typeof o.summary === "string" ? o.summary : "",
  };
}

// Diagnose a plant photo. Returns null when unconfigured or the call/parse fails.
export async function scanPlant(imageBase64: string, mediaType: AnthropicImageMediaType): Promise<PlantScanResult | null> {
  const anthropic = getClient();
  if (!anthropic) return null;

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 800,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mediaType, data: imageBase64 } },
            { type: "text", text: "Identify this plant and diagnose any problems. Return only the JSON object." },
          ],
        },
      ],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    return textBlock ? parseResult(textBlock.text) : null;
  } catch {
    return null;
  }
}
