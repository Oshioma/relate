import { test } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { parseRecordingEvent, verifyJaasSignature } from "./jaas-webhook";

const SECRET = "whsec_test";
const BODY = JSON.stringify({ eventType: "RECORDING_UPLOADED" });
const NOW = 1_800_000_000_000;
const T = String(NOW / 1000);

function sign(body: string, encoding: "base64" | "hex" = "base64", t = T) {
  return createHmac("sha256", SECRET).update(`${t}.${body}`).digest(encoding);
}

test("a correctly signed JaaS event passes", () => {
  assert.equal(verifyJaasSignature(BODY, `t=${T},v1=${sign(BODY)}`, SECRET, NOW), true);
  assert.equal(verifyJaasSignature(BODY, `t=${T},v1=${sign(BODY, "hex")}`, SECRET, NOW), true);
  // One good signature among several is enough.
  assert.equal(verifyJaasSignature(BODY, `t=${T},v1=bogus,v1=${sign(BODY)}`, SECRET, NOW), true);
});

test("a wrong secret, a changed body, another scheme or an old event fails", () => {
  assert.equal(verifyJaasSignature(BODY, `t=${T},v1=${sign(BODY)}`, "other", NOW), false);
  assert.equal(verifyJaasSignature(BODY + " ", `t=${T},v1=${sign(BODY)}`, SECRET, NOW), false);
  assert.equal(verifyJaasSignature(BODY, `t=${T},v0=${sign(BODY)}`, SECRET, NOW), false);
  const old = String(NOW / 1000 - 3600);
  assert.equal(verifyJaasSignature(BODY, `t=${old},v1=${sign(BODY, "base64", old)}`, SECRET, NOW), false);
  assert.equal(verifyJaasSignature(BODY, null, SECRET, NOW), false);
  assert.equal(verifyJaasSignature(BODY, `t=${T},v1=${sign(BODY)}`, "", NOW), false);
});

test("a recording event gives the room, link and length", () => {
  const event = parseRecordingEvent({
    idempotencyKey: "abc",
    eventType: "RECORDING_UPLOADED",
    sessionId: "s1",
    timestamp: 1_700_000_000_000,
    fqn: "vpaas-magic-cookie-123/Course-0a1b2c",
    data: { preAuthenticatedLink: "https://recordings.example/x.mp4?sig=1", durationSec: 3599.6, startTimestamp: 1_700_000_000_000 },
  });
  assert.deepEqual(event, {
    idempotencyKey: "abc",
    sessionId: "s1",
    roomName: "course-0a1b2c",
    downloadUrl: "https://recordings.example/x.mp4?sig=1",
    durationSeconds: 3600,
    recordedAt: new Date(1_700_000_000_000).toISOString(),
  });
});

test("other events, and recordings without a usable link, are ignored", () => {
  assert.equal(parseRecordingEvent({ eventType: "ROOM_CREATED", fqn: "a/b" }), null);
  assert.equal(parseRecordingEvent({ eventType: "RECORDING_UPLOADED", fqn: "a/b", data: {} }), null);
  assert.equal(
    parseRecordingEvent({ eventType: "RECORDING_UPLOADED", fqn: "a/b", data: { preAuthenticatedLink: "http://insecure" } }),
    null
  );
  assert.equal(parseRecordingEvent(null), null);
});
