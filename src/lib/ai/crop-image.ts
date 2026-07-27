import Anthropic from "@anthropic-ai/sdk";

// AI-assisted crop photography. Two independent paths:
//
//   findCropPhoto     — locate a REAL photo of the crop on the web. Uses Claude's
//                       server-side web_search when ANTHROPIC_API_KEY is set, and
//                       always falls back to Wikipedia's REST API (keyless, direct
//                       image URLs, permissive licensing). So "find" works even
//                       with no extra configuration.
//   generateCropImage — synthesise an illustration with an image model. Needs a
//                       separate image-generation key (OPENAI_API_KEY); the caller
//                       hides the button until isCropImageGenConfigured() is true.
//
// Both return the image BYTES (base64 + media type) rather than a URL, so the
// caller can re-host into our own storage bucket for durability.

export type CropImageResult =
  | { ok: true; base64: string; mediaType: string; credit: string | null; sourceUrl: string | null }
  | { ok: false; error: string };

const FIND_MODEL = "claude-haiku-4-5";
const FIND_TIMEOUT_MS = 45_000;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export function isCropImageGenConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

// Find always has the keyless Wikipedia fallback, so it's effectively always on.
export function isCropImageFindConfigured(): boolean {
  return true;
}

let findClient: Anthropic | null = null;
function getFindClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (!findClient) findClient = new Anthropic({ timeout: FIND_TIMEOUT_MS, maxRetries: 0 });
  return findClient;
}

// Fetch a URL and return it only if it's a real, reasonably-sized image.
async function fetchAsImage(url: string): Promise<{ base64: string; mediaType: string } | null> {
  try {
    const res = await fetch(url, { cache: "no-store", redirect: "follow" });
    if (!res.ok) return null;
    const ct = (res.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
    const mediaType = ct === "image/jpg" ? "image/jpeg" : ct;
    if (!IMAGE_TYPES.has(mediaType)) return null;
    const buf = await res.arrayBuffer();
    if (buf.byteLength === 0 || buf.byteLength > MAX_IMAGE_BYTES) return null;
    return { base64: Buffer.from(buf).toString("base64"), mediaType };
  } catch {
    return null;
  }
}

// Wikipedia REST summary → a direct, hotlinkable, permissively-licensed image.
async function wikipediaImageUrl(term: string): Promise<string | null> {
  try {
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`, {
      cache: "no-store",
      headers: { accept: "application/json", "user-agent": "relate-crop-guides/1.0 (community gardening app)" },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { originalimage?: { source?: string }; thumbnail?: { source?: string } };
    return json.originalimage?.source ?? json.thumbnail?.source ?? null;
  } catch {
    return null;
  }
}

// Ask Claude (with web_search) for the single best direct image URL of the crop.
async function findImageUrlWithAI(
  commonName: string,
  scientificName: string | null,
  ediblePart: string | null,
): Promise<{ url: string; credit: string | null; sourceUrl: string | null } | null> {
  const anthropic = getFindClient();
  if (!anthropic) return null;

  const name = scientificName ? `${commonName} (${scientificName})` : commonName;
  const partHint = ediblePart
    ? `This crop is grown for its ${ediblePart.toLowerCase()}, so prefer a photo that features that part.`
    : `Prefer a photo of the part the crop is grown for — its root, fruit, leaves, tuber or pods.`;
  const system = `You find a single high-quality, openly-licensed photograph of a specific plant/crop for a gardening app.

Use web_search to find a real photo of the plant. Strongly prefer Wikimedia Commons, Wikipedia, or other public-domain / Creative Commons sources. The photo must clearly show the actual plant, fruit, or crop — not a logo, diagram, seed packet, or unrelated image.

Choose the image a gardener would expect: the cultivated, harvested, or edible plant as commonly grown. ${partHint} Do NOT return an image that shows only the flower or seed head, unless the crop is specifically grown for its flower.

Respond with ONLY a JSON object (no prose, no markdown fences):
{
  "image_url": string,   // a DIRECT link to the image file itself, ending in .jpg/.jpeg/.png/.webp (e.g. an upload.wikimedia.org URL), NOT a web page
  "source_url": string,  // the page the image came from, or null
  "credit": string       // short attribution / license, e.g. "Wikimedia Commons, CC BY-SA", or null
}
If you cannot find a suitable direct image URL, respond with exactly {"image_url": null}.`;

  try {
    const response = await anthropic.messages.create({
      model: FIND_MODEL,
      max_tokens: 1024,
      system,
      tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 4 }],
      messages: [{ role: "user", content: `Find one openly-licensed photo of this plant/crop: ${name}.` }],
    });
    const text = response.content.flatMap((b) => (b.type === "text" ? [b.text] : [])).join("\n");
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end <= start) return null;
    const parsed = JSON.parse(text.slice(start, end + 1)) as { image_url?: unknown; source_url?: unknown; credit?: unknown };
    const url = typeof parsed.image_url === "string" ? parsed.image_url.trim() : "";
    if (!url) return null;
    return {
      url,
      credit: typeof parsed.credit === "string" ? parsed.credit.trim() || null : null,
      sourceUrl: typeof parsed.source_url === "string" ? parsed.source_url.trim() || null : null,
    };
  } catch (error) {
    console.error("[crop-image] AI find failed:", error);
    return null;
  }
}

export async function findCropPhoto(opts: {
  commonName: string;
  scientificName?: string | null;
  ediblePart?: string | null;
}): Promise<CropImageResult> {
  const commonName = opts.commonName.trim();
  const scientificName = opts.scientificName?.trim() || null;
  const ediblePart = opts.ediblePart?.trim() || null;
  if (!commonName) return { ok: false, error: "Enter the crop name first." };

  // 1) Let the AI pick a direct image URL, then verify it really is an image.
  const ai = await findImageUrlWithAI(commonName, scientificName, ediblePart);
  if (ai) {
    const image = await fetchAsImage(ai.url);
    if (image) return { ok: true, ...image, credit: ai.credit ?? "Web", sourceUrl: ai.sourceUrl };
  }

  // 2) Keyless fallback: Wikipedia's own lead image. Try the COMMON name first —
  // its page depicts the cultivated crop (e.g. "Carrot" → the orange root),
  // whereas the scientific-name page is often the wild species in flower
  // (e.g. "Daucus carota" → the wild-carrot umbel).
  for (const term of [commonName, scientificName].filter((t): t is string => Boolean(t))) {
    const url = await wikipediaImageUrl(term);
    if (url) {
      const image = await fetchAsImage(url);
      if (image) return { ok: true, ...image, credit: "Wikipedia", sourceUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(term)}` };
    }
  }

  return { ok: false, error: "Couldn't find a suitable photo — try a more specific name, or upload one." };
}

// --- Generation (image model, separate key) ---------------------------------

export async function generateCropImage(opts: {
  commonName: string;
  scientificName?: string | null;
  category?: string | null;
  ediblePart?: string | null;
}): Promise<CropImageResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return { ok: false, error: "Image generation isn't configured on this platform." };

  const commonName = opts.commonName.trim();
  if (!commonName) return { ok: false, error: "Enter the crop name first." };
  const scientific = opts.scientificName?.trim();
  const category = opts.category?.trim();
  const ediblePart = opts.ediblePart?.trim();

  const prompt = `A clean, realistic photograph of ${commonName}${scientific ? ` (${scientific})` : ""}${
    category ? `, a ${category} plant` : ""
  }, growing healthy in a garden${
    ediblePart ? `, clearly showing its ${ediblePart.toLowerCase()} (the part it is grown for)` : ""
  }. Single clear subject, natural daylight, sharp focus, no text, no watermark, no people.`;

  try {
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model: "gpt-image-1", prompt, size: "1024x1024", n: 1 }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[crop-image] generation failed:", res.status, detail.slice(0, 300));
      if (res.status === 401) return { ok: false, error: "The image-generation key was rejected." };
      if (res.status === 429) return { ok: false, error: "Image generation is rate-limited right now — try again shortly." };
      return { ok: false, error: "Image generation failed — try again." };
    }
    const json = (await res.json()) as { data?: { b64_json?: string }[] };
    const b64 = json.data?.[0]?.b64_json;
    if (!b64) return { ok: false, error: "Image generation returned nothing." };
    return { ok: true, base64: b64, mediaType: "image/png", credit: "AI-generated", sourceUrl: null };
  } catch (error) {
    console.error("[crop-image] generation error:", error);
    return { ok: false, error: "Image generation failed — try again." };
  }
}
