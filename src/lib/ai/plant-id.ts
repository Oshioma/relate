import Anthropic from "@anthropic-ai/sdk";
import type { AnthropicImageMediaType } from "@/lib/ai/plant-scanner";

const MODEL = "claude-haiku-4-5";

let client: Anthropic | null = null;

function getClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (!client) client = new Anthropic();
  return client;
}

export function isPlantIdConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export type IdConfidence = "low" | "medium" | "high";

export type PlantIdResult = {
  common_name: string | null;
  scientific_name: string | null;
  confidence: IdConfidence;
  category: string | null; // e.g. vegetable, herb, tree, flower, weed
  description: string;
  edible: string | null; // short edibility / safety note
  is_crop: boolean; // is it a growable crop (vs ornamental/weed/wild)
};

const SYSTEM_PROMPT = `You identify plants from a single photo. Give the most likely common name and scientific name, and estimate confidence honestly — use "low" when the image is unclear or several species are plausible.

Add a short, cautious edibility/safety note when you're reasonably sure (and say plainly when a plant is toxic or easily confused with a toxic look-alike). Never encourage eating a wild plant on the strength of a photo alone.

Respond with ONLY a JSON object, no prose or markdown, matching exactly:
{
  "common_name": string or null,
  "scientific_name": string or null,
  "confidence": "low" | "medium" | "high",
  "category": string or null,
  "description": string,
  "edible": string or null,
  "is_crop": boolean
}
Set "common_name": null if you cannot tell what it is. Keep "description" and "edible" to one or two plain sentences.`;

const VALID_CONFIDENCE = new Set(["low", "medium", "high"]);

function parseResult(text: string): PlantIdResult | null {
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
  const str = (v: unknown): string | null => (typeof v === "string" && v.trim() ? v.trim() : null);

  return {
    common_name: str(o.common_name),
    scientific_name: str(o.scientific_name),
    confidence: typeof o.confidence === "string" && VALID_CONFIDENCE.has(o.confidence) ? (o.confidence as IdConfidence) : "low",
    category: str(o.category),
    description: typeof o.description === "string" ? o.description : "",
    edible: str(o.edible),
    is_crop: o.is_crop === true,
  };
}

// Identify a plant from a photo. Returns null when unconfigured or on failure.
export async function identifyPlant(imageBase64: string, mediaType: AnthropicImageMediaType): Promise<PlantIdResult | null> {
  const anthropic = getClient();
  if (!anthropic) return null;

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mediaType, data: imageBase64 } },
            { type: "text", text: "What plant is this? Return only the JSON object." },
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
