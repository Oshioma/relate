// Stills taken from a live session while it runs, for the Past sessions card.
//
// Sessions aren't recorded, so the host's browser asks the meeting for a
// screenshot of the main video (Jitsi's captureLargeVideoScreenshot) a few
// times during the call, shrinks it to a JPEG and sends it to
// saveLiveSessionSnapshot, which keeps the latest one. These helpers are the
// parts both sides share, kept free of browser and server APIs so they can be
// tested.

// Seconds after joining at which the host's browser takes a still. Each later
// one replaces the last, so the card ends up with a shot from well into the
// session, but even a short call gets one.
export const SNAPSHOT_TIMES_SECONDS = [20, 120, 600];

// Width the still is shrunk to before upload; the card is ~24rem wide at most.
export const SNAPSHOT_WIDTH = 640;

// Largest still the server accepts (a 640px JPEG is usually 30–80KB).
export const SNAPSHOT_MAX_BYTES = 1024 * 1024;

const JPEG_DATA_URL = /^data:image\/jpeg;base64,([A-Za-z0-9+/]+={0,2})$/;

// The JPEG bytes in a data: URL, or null when it isn't a reasonably sized JPEG.
export function decodeSnapshot(dataUrl: string): Uint8Array | null {
  const match = JPEG_DATA_URL.exec(dataUrl);
  if (!match) return null;
  // base64 grows by 4/3; reject before decoding anything oversized.
  if ((match[1].length * 3) / 4 > SNAPSHOT_MAX_BYTES) return null;
  const bytes = Uint8Array.from(Buffer.from(match[1], "base64"));
  // Every JPEG starts with the SOI marker FF D8 FF.
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8 || bytes[2] !== 0xff) return null;
  return bytes;
}

// True when a frame is (nearly) one flat colour — a black screen before
// anyone's camera is on, or a plain avatar tile — so it isn't worth keeping.
// Takes RGBA pixels as a canvas returns them, and samples every 16th pixel.
export function looksBlank(rgba: Uint8ClampedArray | Uint8Array): boolean {
  let n = 0;
  let sum = 0;
  let sumSq = 0;
  for (let i = 0; i + 2 < rgba.length; i += 64) {
    const lum = 0.299 * rgba[i] + 0.587 * rgba[i + 1] + 0.114 * rgba[i + 2];
    sum += lum;
    sumSq += lum * lum;
    n++;
  }
  if (n === 0) return true;
  const mean = sum / n;
  const variance = sumSq / n - mean * mean;
  // A standard deviation under ~6 levels out of 255 is a flat picture.
  return variance < 36;
}

// Where a session's still is stored in the public 'uploads' bucket, whose
// rules put each object under the uploader's id. One file per session, so a
// newer still overwrites the older one.
export function publicSnapshotPath(userId: string, sessionId: string): string {
  return `${userId}/live-snapshots/${sessionId}.jpg`;
}
