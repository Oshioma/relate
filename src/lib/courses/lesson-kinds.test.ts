import { test } from "node:test";
import assert from "node:assert/strict";
import { courseAccess, courseVideoSource, liveLessonState } from "./lesson-kinds";

test("YouTube and Vimeo links are framed", () => {
  const yt = courseVideoSource("https://youtu.be/dQw4w9WgXcQ");
  assert.equal(yt?.kind, "embed");
  const vimeo = courseVideoSource("https://vimeo.com/76979871");
  assert.equal(vimeo?.kind, "embed");
});

test("a shared Google Drive file plays in Drive's preview player", () => {
  assert.deepEqual(courseVideoSource("https://drive.google.com/file/d/1AbC_d-9/view?usp=sharing"), {
    kind: "embed",
    src: "https://drive.google.com/file/d/1AbC_d-9/preview",
    portrait: false,
  });
  assert.deepEqual(courseVideoSource("https://drive.google.com/open?id=1AbC_d-9"), {
    kind: "embed",
    src: "https://drive.google.com/file/d/1AbC_d-9/preview",
    portrait: false,
  });
});

test("a direct video file is played by the browser, anything else is a link", () => {
  assert.deepEqual(courseVideoSource("https://cdn.example.com/talks/week-1.mp4"), {
    kind: "file",
    src: "https://cdn.example.com/talks/week-1.mp4",
  });
  assert.deepEqual(courseVideoSource("https://example.com/watch/123"), { kind: "link", href: "https://example.com/watch/123" });
  assert.equal(courseVideoSource(""), null);
  assert.equal(courseVideoSource(null), null);
  assert.equal(courseVideoSource("javascript:alert(1)"), null);
});

test("a live lesson opens 15 minutes early and closes at its end", () => {
  const lesson = { live_starts_at: "2026-11-01T18:00:00Z", live_ends_at: "2026-11-01T19:30:00Z" };
  assert.equal(liveLessonState(lesson, Date.parse("2026-11-01T17:40:00Z")), "upcoming");
  assert.equal(liveLessonState(lesson, Date.parse("2026-11-01T17:46:00Z")), "open");
  assert.equal(liveLessonState(lesson, Date.parse("2026-11-01T19:30:00Z")), "open");
  assert.equal(liveLessonState(lesson, Date.parse("2026-11-01T19:31:00Z")), "ended");
});

test("with no end time a live lesson stays open three hours", () => {
  const lesson = { live_starts_at: "2026-11-01T18:00:00Z", live_ends_at: null };
  assert.equal(liveLessonState(lesson, Date.parse("2026-11-01T20:59:00Z")), "open");
  assert.equal(liveLessonState(lesson, Date.parse("2026-11-01T21:01:00Z")), "ended");
});

test("buyers watch playbacks; live needs a tier unless the price includes it", () => {
  const base = { isPaid: true, isStaff: false, enrolled: true, paidEnrolment: true, hasTier: false };
  assert.deepEqual(courseAccess({ ...base, liveIncludedWithPurchase: false }), { canWatch: true, canJoinLive: false });
  assert.deepEqual(courseAccess({ ...base, liveIncludedWithPurchase: true }), { canWatch: true, canJoinLive: true });
  assert.deepEqual(
    courseAccess({ ...base, paidEnrolment: false, enrolled: false, hasTier: true, liveIncludedWithPurchase: false }),
    { canWatch: true, canJoinLive: true }
  );
  // A free enrolment left over from a lapsed tier opens nothing.
  assert.deepEqual(
    courseAccess({ ...base, paidEnrolment: false, hasTier: false, liveIncludedWithPurchase: true }),
    { canWatch: false, canJoinLive: false }
  );
  assert.deepEqual(
    courseAccess({ isPaid: false, isStaff: false, enrolled: true, paidEnrolment: false, hasTier: false, liveIncludedWithPurchase: false }),
    { canWatch: true, canJoinLive: true }
  );
});
