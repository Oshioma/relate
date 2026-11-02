import { test } from "node:test";
import assert from "node:assert/strict";
import { adviceAhead } from "./ahead";
import { moonDays } from "../astronomy";
import { plainAdvice, termsIn } from "./plain-words";
import { publishedBundle } from "./test-bundle";

const feed = adviceAhead(publishedBundle(), { year: 2026, month: 11, day: 2 }, moonDays({ year: 2026, month: 11, day: 2 }, 61, "Africa/Dar_es_Salaam"));
const all = [...feed.dated, ...feed.lunar, ...feed.seasonal];
const find = (name: string) => all.find((i) => i.name === name)!;


test("plain advice restates the record, never the boilerplate", () => {
  for (const i of all) {
    const p = plainAdvice(i);
    if (p) assert.doesNotMatch(p, /reflection or planning prompt|traditional reflection|ecological planning prompt/i, i.id);
  }
  assert.equal(plainAdvice(find("Tangaroa-ā-mua")), "Good for fishing.");
  assert.equal(plainAdvice(find("Whiro")), "Good for eeling. Hold off on planting and fishing.");
  assert.match(plainAdvice(find("Kāloakūkahi"))!, /Planting possible, with care\. A sacred time/);
  assert.match(plainAdvice(all.find((i) => i.name === "ʻOlepau" && /Kanaloa/.test(i.says[0]))!)!, /sacred time/);
  assert.equal(plainAdvice(all.find((i) => /Not good planting or fishing/.test(i.says[0]))!), "Hold off on planting and fishing.");
});

test("glossary explains Kanaloa and kapu where the record uses them", () => {
  const terms = termsIn(find("ʻOlepau")).map((t) => t.term);
  assert.ok(terms.includes("Kanaloa") && terms.includes("kapu"), terms.join(", "));
  assert.ok(termsIn(find("Tangaroa-ā-mua")).some((t) => t.term === "Tangaroa"));
  // Whole words only: "Kāloakūkahi" is not "Kū".
  assert.ok(!termsIn(find("Kāloakūkahi")).some((t) => t.term === "Kū"));
  for (const i of all) for (const t of termsIn(i)) assert.ok(t.source.url.startsWith("https://"));
});

