import { test } from "node:test";
import assert from "node:assert/strict";
import { rankMentors, parseList, placesLeft, type MatchBeginner, type MatchMentor } from "./matching";

const beginner: MatchBeginner = {
  userId: "b",
  country: "UK",
  region: "London",
  interests: ["vegetables", "not_sure"],
  languages: ["English"],
  helpMode: "online",
};

function mentor(overrides: Partial<MatchMentor> & { userId: string }): MatchMentor {
  return {
    country: null,
    region: null,
    climate: null,
    experience: [],
    preferredTopics: [],
    languages: [],
    helpMode: "either",
    capacity: 1,
    activeBeginners: 0,
    isPaused: false,
    ...overrides,
  };
}

test("crop compatibility outranks region, which outranks language", () => {
  const ranked = rankMentors(beginner, [
    mentor({ userId: "lang", languages: ["english"] }),
    mentor({ userId: "region", region: "london" }),
    mentor({ userId: "crops", experience: ["Vegetables"] }),
  ]);
  assert.deepEqual(ranked.map((m) => m.mentor.userId), ["crops", "region", "lang"]);
});

test("paused, full and self are excluded", () => {
  const ranked = rankMentors(beginner, [
    mentor({ userId: "paused", isPaused: true }),
    mentor({ userId: "full", capacity: 3, activeBeginners: 3 }),
    mentor({ userId: "b" }),
    mentor({ userId: "ok" }),
  ]);
  assert.deepEqual(ranked.map((m) => m.mentor.userId), ["ok"]);
});

test("reasons are words, with places left and no score", () => {
  const [match] = rankMentors(
    beginner,
    [mentor({ userId: "m", experience: ["vegetables"], country: "uk", languages: ["English"], capacity: 3, activeBeginners: 1 })],
    (v) => (v === "vegetables" ? "Vegetables" : v)
  );
  assert.deepEqual(match.reasons.map((r) => r.text), ["Helps with vegetables", "Same country", "Speaks English", "Mentors online", "2 places left"]);
  assert.equal(match.placesLeft, 2);
  assert.equal("score" in match, false);
});

test("incompatible location preference sorts lower but is not hidden", () => {
  const ranked = rankMentors(beginner, [mentor({ userId: "local", helpMode: "local" }), mentor({ userId: "online", helpMode: "online" })]);
  assert.deepEqual(ranked.map((m) => m.mentor.userId), ["online", "local"]);
});

test("placesLeft never goes negative", () => {
  assert.equal(placesLeft({ capacity: 1, activeBeginners: 4 }), 0);
});

test("parseList trims, de-duplicates and caps", () => {
  assert.deepEqual(parseList(" Tomatoes, tomatoes ,Basil\nchillies,, "), ["Tomatoes", "Basil", "chillies"]);
  assert.equal(parseList("a,b,c,d", 2).length, 2);
});
