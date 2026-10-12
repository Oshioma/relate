import { test } from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_DESTINATIONS } from "./destinations";
import { compareDestinations, matchesFilter, recommendDestinations, type QuizAnswers } from "./scoring";
import { parseOverrides, resolveGuideContent, destinationOverrideSchema, restaurantSchema, staySchema, photoSchema } from "./content";
import { RESTAURANTS } from "./restaurants";
import { STAYS } from "./stays";
import { DESTINATION_PHOTOS } from "./photos";
import { FAQS, ITINERARIES } from "./visitor-info";

const byKey = (key: string) => DEFAULT_DESTINATIONS.find((d) => d.key === key)!;

test("the guide has all 14 destinations, ranked 1–14 in the editorial order", () => {
  assert.deepEqual(
    DEFAULT_DESTINATIONS.map((d) => d.key),
    ["kendwa", "nungwi", "paje", "jambiani", "matemwe", "michamvi", "kiwengwa", "bwejuu", "pongwe", "pwani-mchangani", "dongwe", "kizimkazi", "uroa", "stone-town"]
  );
  assert.deepEqual(DEFAULT_DESTINATIONS.map((d) => d.rank), Array.from({ length: 14 }, (_, i) => i + 1));
});

test("every destination's built-in content passes the admin editor's own validation", () => {
  for (const d of DEFAULT_DESTINATIONS) {
    const { key, ...rest } = d;
    const parsed = destinationOverrideSchema.safeParse(rest);
    assert.ok(parsed.success, `${key}: ${parsed.success ? "" : JSON.stringify(parsed.error.issues[0])}`);
    for (const section of [d.intro, d.whyPeopleLoveIt, d.whoShouldStay, d.whoMightNot, d.beach, d.eatingOut]) {
      assert.ok(section.length > 60, `${key} has a thin section`);
    }
  }
});

test("restaurants, stays and photos all validate, and every photo carries a licence and credit", () => {
  for (const list of Object.values(RESTAURANTS)) for (const r of list) assert.ok(restaurantSchema.safeParse(r).success, r.name);
  for (const list of Object.values(STAYS)) for (const s of list) assert.ok(staySchema.safeParse(s).success, s.name);
  for (const list of Object.values(DESTINATION_PHOTOS)) {
    for (const p of list) {
      assert.ok(photoSchema.safeParse(p).success, p.src);
      assert.ok(p.licence && p.credit, `${p.src} lacks licence or credit`);
      if (p.identificationStatus === "unverified") assert.match(p.caption, /^UNVERIFIED —/, `${p.src} must say UNVERIFIED`);
    }
  }
});

test("photos are never reused across destinations", () => {
  const seen = new Map<string, string>();
  for (const [key, list] of Object.entries(DESTINATION_PHOTOS)) {
    for (const p of list) {
      assert.ok(!seen.has(p.src), `${p.src} used by ${seen.get(p.src)} and ${key}`);
      seen.set(p.src, key);
    }
  }
});

test("recommendation keys all name real destinations", () => {
  const keys = new Set(DEFAULT_DESTINATIONS.map((d) => d.key));
  for (const k of [...Object.keys(RESTAURANTS), ...Object.keys(STAYS), ...Object.keys(DESTINATION_PHOTOS)]) assert.ok(keys.has(k), k);
});

test("in-page links in FAQs and itineraries point at real destinations", () => {
  const keys = new Set(DEFAULT_DESTINATIONS.map((d) => d.key));
  for (const text of [...FAQS.map((f) => f.answer), ...ITINERARIES.map((i) => i.body)]) {
    for (const [, key] of text.matchAll(/\{dest:([a-z-]+)\}/g)) assert.ok(keys.has(key), key);
  }
});

test("the matcher is deterministic and reflects the answers", () => {
  const swimmer: QuizAnswers = { priority: "swimming", companions: "family", budget: "mid", atmosphere: "relaxed", swim: "essential" };
  const first = recommendDestinations(DEFAULT_DESTINATIONS, swimmer).map((r) => r.destination.key);
  assert.deepEqual(first, recommendDestinations(DEFAULT_DESTINATIONS, swimmer).map((r) => r.destination.key));
  assert.equal(first[0], "kendwa");
  assert.equal(first.length, 3);

  const partyer: QuizAnswers = { priority: "food-nightlife", companions: "friends", budget: "flexible", atmosphere: "nightlife", swim: "important" };
  assert.equal(recommendDestinations(DEFAULT_DESTINATIONS, partyer)[0].destination.key, "nungwi");

  const kiter: QuizAnswers = { priority: "activities", companions: "solo", budget: "budget", atmosphere: "lively", swim: "not-important" };
  assert.equal(recommendDestinations(DEFAULT_DESTINATIONS, kiter)[0].destination.key, "paje");

  const culture: QuizAnswers = { priority: "culture", companions: "partner", budget: "mid", atmosphere: "lively", swim: "not-important" };
  assert.equal(recommendDestinations(DEFAULT_DESTINATIONS, culture)[0].destination.key, "stone-town");

  const honeymoon: QuizAnswers = { priority: "peace", companions: "honeymoon", budget: "luxury", atmosphere: "very-quiet", swim: "pool" };
  const quiet = recommendDestinations(DEFAULT_DESTINATIONS, honeymoon).map((r) => r.destination.key);
  assert.ok(!quiet.includes("nungwi") && !quiet.includes("stone-town"));
});

test("Stone Town never comes up as a beach for someone who wants to swim", () => {
  const answers: QuizAnswers = { priority: "swimming", companions: "partner", budget: "flexible", atmosphere: "lively", swim: "essential" };
  assert.ok(!recommendDestinations(DEFAULT_DESTINATIONS, answers, 5).some((r) => r.destination.key === "stone-town"));
});

test("Kendwa vs Nungwi comparison answers the brief's questions from the labels", () => {
  const answers = compareDestinations([byKey("kendwa"), byKey("nungwi")]);
  assert.equal(answers.length, 6);
  const get = (q: string) => answers.find((a) => a.question.startsWith(q))!.answer;
  assert.match(get("Which has more restaurants"), /^Nungwi/);
  assert.match(get("Which is quieter"), /^Kendwa/);
  assert.match(get("Which has more nightlife"), /^Nungwi/);
  assert.match(get("Which has better swimming"), /^Much the same/);
});

test("filters match the obvious places", () => {
  const keys = (tag: Parameters<typeof matchesFilter>[1]) => DEFAULT_DESTINATIONS.filter((d) => matchesFilter(d, tag)).map((d) => d.key);
  assert.deepEqual(keys("swimming"), ["kendwa", "nungwi"]);
  assert.ok(keys("kitesurfing").includes("paje"));
  assert.ok(keys("culture").includes("stone-town"));
  assert.ok(!keys("nightlife").includes("pongwe"));
});

test("admin overrides replace fields per destination; a bad override is ignored", () => {
  const overrides = parseOverrides({
    destinations: {
      paje: { rank: 1, summary: "Edited summary", panel: { nights: "2 nights" } },
      kendwa: { rank: "not a number" },
    },
  });
  const { destinations } = resolveGuideContent(overrides);
  const paje = destinations.find((d) => d.key === "paje")!;
  assert.equal(paje.summary, "Edited summary");
  assert.equal(paje.panel.nights, "2 nights");
  assert.equal(paje.panel.swimming, "tide-dependent");
  assert.equal(destinations.find((d) => d.key === "kendwa")!.rank, 1);
  assert.deepEqual(parseOverrides("garbage"), {});
});
