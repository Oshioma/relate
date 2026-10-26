import { after, NextResponse, type NextRequest } from "next/server";
import { parseRecordingEvent, verifyJaasSignature } from "@/lib/courses/jaas-webhook";
import { saveLessonRecording } from "@/lib/courses/lesson-recordings";

// 8x8 JaaS webhook target. Point a webhook endpoint at /api/jaas/webhook in
// the JaaS console (with the "Recording uploaded" event ticked) and set
// JAAS_WEBHOOK_SECRET to that endpoint's signing secret.
//
// A recording is copied after the reply: JaaS wants a quick 200, and copying
// an hour of video takes a while. maxDuration bounds that copy.
export const maxDuration = 300;

export async function POST(request: NextRequest) {
  const secret = process.env.JAAS_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: true, skipped: "jaas-webhook-not-configured" });
  }

  const payload = await request.text();
  if (!verifyJaasSignature(payload, request.headers.get("x-jaas-signature"), secret, Date.now())) {
    return NextResponse.json({ error: "signature check failed" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = JSON.parse(payload);
  } catch {
    return NextResponse.json({ error: "not JSON" }, { status: 400 });
  }

  const recording = parseRecordingEvent(body);
  if (recording) {
    after(async () => {
      try {
        const outcome = await saveLessonRecording(recording);
        if (outcome === "failed") console.error("[jaas/webhook] recording copy failed for room", recording.roomName);
      } catch (err) {
        console.error("[jaas/webhook] recording handler error:", (err as Error).message);
      }
    });
  }

  // Every other event is acknowledged so JaaS doesn't retry it.
  return NextResponse.json({ received: true });
}
