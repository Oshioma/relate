"use client";

// Face-aware framing for uploaded listing photos: find the faces in a photo
// and return the centre of the box enclosing them all as an object-position
// string ("48% 22%"), so covers crop around people rather than the frame's
// centre (see photo-position.ts for why a focal point survives every crop).
//
// Detection runs in the browser at upload time with MediaPipe's short-range
// face detector. The model is served from public/models; the wasm runtime is
// ~11MB so it is fetched from the CDN on first use rather than bundled. Every
// failure path (old browser, blocked CDN, no faces, unreadable image) returns
// null, and callers fall back to the default crop — uploads never break over
// framing.

import type { FaceDetector } from "@mediapipe/tasks-vision";

// Keep the version in this URL in step with @mediapipe/tasks-vision in
// package.json: the fetched wasm must match the bundled JS API.
const WASM_BASE = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm";
const MODEL_URL = "/models/blaze_face_short_range.tflite";

let detectorPromise: Promise<FaceDetector | null> | null = null;

function getDetector(): Promise<FaceDetector | null> {
  detectorPromise ??= (async () => {
    try {
      const { FaceDetector, FilesetResolver } = await import("@mediapipe/tasks-vision");
      const fileset = await FilesetResolver.forVisionTasks(WASM_BASE);
      return await FaceDetector.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: MODEL_URL },
        runningMode: "IMAGE",
      });
    } catch {
      return null;
    }
  })();
  return detectorPromise;
}

export async function detectFacePosition(file: Blob): Promise<string | null> {
  try {
    const detector = await getDetector();
    if (!detector) return null;
    const bitmap = await createImageBitmap(file);
    try {
      const boxes = detector
        .detect(bitmap)
        .detections.map((d) => d.boundingBox)
        .filter((b) => b !== undefined);
      if (boxes.length === 0) return null;
      // One focal point has to cover every face — a group shot included — so
      // aim at the centre of the box enclosing all of them.
      const left = Math.min(...boxes.map((b) => b.originX));
      const top = Math.min(...boxes.map((b) => b.originY));
      const right = Math.max(...boxes.map((b) => b.originX + b.width));
      const bottom = Math.max(...boxes.map((b) => b.originY + b.height));
      const x = Math.round(clamp(((left + right) / 2 / bitmap.width) * 100));
      const y = Math.round(clamp(((top + bottom) / 2 / bitmap.height) * 100));
      return `${x}% ${y}%`;
    } finally {
      bitmap.close();
    }
  } catch {
    return null;
  }
}

function clamp(n: number): number {
  return Math.min(100, Math.max(0, n));
}
