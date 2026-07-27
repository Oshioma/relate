// Client-side image downscaling for the AI vision tools (Plant ID, Plant
// Scanner). The model downsamples anything past ~1568px on the long edge, so
// shrinking to that and re-encoding as JPEG in the browser loses no useful
// detail while turning a multi-megabyte phone photo into a few hundred KB —
// faster uploads, request bodies well under the Server Action limit, and no
// wasted image tokens. Runs only in the browser (uses canvas / createImageBitmap).

export type PreparedImage = { blob: Blob; url: string; filename: string };

const DEFAULT_MAX_EDGE = 1568;

export async function shrinkImageForUpload(file: File, maxEdge = DEFAULT_MAX_EDGE): Promise<PreparedImage> {
  try {
    // imageOrientation: "from-image" applies the photo's EXIF rotation so a
    // sideways phone shot comes through upright.
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("no-2d-context");
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
    if (!blob) throw new Error("encode-failed");
    return { blob, url: URL.createObjectURL(blob), filename: "photo.jpg" };
  } catch {
    // Couldn't process client-side (e.g. some HEIC) — send the original and let
    // the server validate it.
    return { blob: file, url: URL.createObjectURL(file), filename: file.name || "photo" };
  }
}
