// Plain words for "Next Advice From the Past": what a day's tradition means
// you could do, said simply, and short explanations of the traditional words
// a reader meets (Kanaloa, kapu, Tangaroa…).
//
// Nothing new is claimed. The plain line restates what the sourced record
// already says (good / not good for an activity); where a record carries its
// own specific modern suggestion, that suggestion is shown instead. The
// glossary gives dictionary meanings with their source.

import type { AdviceItem } from "./ahead";

// The plain line is built clause by clause from what the tradition says
// ("Planting and fishing discouraged; eeling noted as favourable" becomes
// "Good for eeling. Hold off on planting and fishing."), so it never says more
// than the record. The researchers' own modern notes stay under More detail.

const ACTS: [string, RegExp][] = [
  ["planting", /plant|crop|sow|seed|garden|cultivat|farm|tuber|k[ūu]mara|banana|taro|vine|fruit-bearing|field/i],
  ["eeling", /\beel/i],
  ["fishing", /fish|crayfish|shellfish|seafood|squid|octopus/i],
  ["gathering food", /gather|harvest|food|herb|collect/i],
  ["marrying", /take a wife|marr(y|iage|ied)/i],
  ["treating the sick", /doctor|lay hands on the sick/i],
  ["boat journeys", /\bboat/i],
  ["road journeys", /on the road|journey/i],
  ["oaths and lawsuits", /\boath|charges against|treaty/i],
];
const NEG = /\b(not|avoid\w*|discourag\w*|unfavourable|unfavorable|unproductive|poor|bad|ominous|unlucky|disfavou?red|scarce|wary|slips|suffer|unpleasant)\b/i;
const CARE = /(with reservations|caution|uncertain|possible|in one account|in another)/i;
const POS = /\b(good|favourable|favorable|productive|excellent|plentiful|fine|desirable|best|abundance|vigorous|suitable|will be well|good health)\b/i;
const SACRED = /\b(kapu|sacred|holy|prayers?|offerings?|temple|ceremon\w*|observance)\b/i;
const WEATHER = /\b(rough|fog|winds?|storm\w*|mist|bad weather|unpleasant weather)\b/i;

const OWN_PLAIN = /^(americas\.maya|asia\.east\.chinese|asia\.south\.vedic-hindu|africa\.west\.akan\.(nnanson|nnawotwe)|africa\.west\.igbo)\./;
const OWN_PLAIN_IDS = new Set(["pos|africa.west.akan.adaduanan.fodwo", "pos|africa.west.akan.adaduanan.awukudae", "pos|africa.west.akan.adaduanan.fofie"]);

const list = (xs: string[]) => (xs.length <= 1 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);
const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

/** One to three short plain sentences on what the day means you could do, from the record's own words. */
export function plainAdvice(item: AdviceItem): string | null {
  // A named month's meaning is a description, not advice for a day.
  if (item.id.startsWith("month|")) return null;
  // Traditions whose plain explanation already says what to do (explanations.ts):
  // their day meanings ("Maize; ripeness", "wind, breath") are not advice to be read word by word.
  if (OWN_PLAIN.test(item.systemKey ?? "") || OWN_PLAIN_IDS.has(item.id)) return null;
  const good: string[] = [];
  const care: string[] = [];
  const plain: string[] = [];
  const hold: string[] = [];
  let sacred = false;
  let weather = false;
  let goodDay = false;
  let badDay = false;
  for (const clause of (item.says[0] ?? "").split(/;|\.\s/)) {
    // "Fish and leeks should not be eaten" is about food, not fishing.
    const eating = /\b(eat|eaten|eating)\b/i.test(clause);
    const acts = ACTS.filter(([w, re]) => re.test(clause) && !(eating && w === "fishing")).map(([w]) => w);
    // "Good fishing, not eeling": the part after "not" is held off.
    const notPart = clause.match(/\bnot\s+(.*)$/i)?.[1] ?? "";
    const notActs = notPart ? ACTS.filter(([w, re]) => re.test(notPart) && !(eating && w === "fishing")).map(([w]) => w) : [];
    const rest = acts.filter((a) => !notActs.includes(a));
    if (SACRED.test(clause)) sacred = true;
    if (notActs.length) hold.push(...notActs);
    if (NEG.test(clause.replace(/\bnot\s+.*$/i, "")) && !POS.test(clause)) {
      if (rest.length) hold.push(...rest);
      else if (WEATHER.test(clause)) weather = true;
      else badDay = true;
    } else if (CARE.test(clause)) {
      if (rest.length) care.push(...rest);
    } else if (POS.test(clause)) {
      if (rest.length) good.push(...rest);
      else goodDay = true;
    } else if (rest.length) plain.push(...rest);
    else if (WEATHER.test(clause)) weather = true;
  }
  const uniq = (xs: string[], not: string[]) => [...new Set(xs)].filter((x) => !not.includes(x));
  const g = uniq(good, hold);
  const c = uniq(care, [...g, ...hold]);
  const p = uniq(plain, [...g, ...c, ...hold]);
  const h = uniq(hold, []);
  const out: string[] = [];
  if (g.length) out.push(`Good for ${list(g)}.`);
  if (c.length) out.push(`${cap(list(c))} possible, with care.`);
  if (p.length) out.push(`A traditional day for ${list(p)}.`);
  if (h.length) out.push(`Hold off on ${list(h)}.`);
  if (!out.length && goodDay) out.push("A good day, by this tradition.");
  if (!out.length && badDay) out.push("Not a good day in this tradition: rest or plan instead.");
  if (sacred) out.push("A sacred time: a day for prayer, thanks or quiet.");
  if (weather) out.push("Watch the weather and the sea.");
  return out.length ? out.slice(0, 3).join(" ") : null;
}

export interface GlossaryEntry {
  term: string;
  /** Matched in a record's name and wording. */
  match: RegExp;
  meaning: string;
  source: { title: string; url: string };
}

const HAWAIIAN_DICT = { title: "Hawaiian Dictionaries (Pukui and Elbert), wehewehe.org", url: "https://wehewehe.org/" };
const MAORI_DICT = { title: "Te Aka Māori Dictionary", url: "https://maoridictionary.co.nz/" };
const TE_ARA = { title: "Maramataka – the lunar calendar (Te Ara)", url: "https://teara.govt.nz/en/maramataka-the-lunar-calendar" };

/** A whole-word match that understands macrons and ʻokina (\b does not). */
const word = (src: string) => new RegExp(`(?<![\\p{L}ʻ'])(?:${src})(?![\\p{L}])`, "iu");

export const GLOSSARY: GlossaryEntry[] = [
  { term: "kapu", match: word("kapu"), meaning: "Hawaiian: a sacred rule or restriction (the same idea as \"taboo\"). Kapu nights set aside time for a god, when some ordinary activities stopped.", source: HAWAIIAN_DICT },
  { term: "Kanaloa", match: word("kanaloa"), meaning: "One of the four great Hawaiian gods, linked with the ocean.", source: HAWAIIAN_DICT },
  { term: "Kāne", match: word("k[āa]ne"), meaning: "One of the four great Hawaiian gods, linked with life, fresh water and sunlight.", source: HAWAIIAN_DICT },
  { term: "Lono", match: word("lono"), meaning: "One of the four great Hawaiian gods, linked with rain, farming and fertility.", source: HAWAIIAN_DICT },
  { term: "Kū", match: word("k[ūu](?:kahi|lua|kolu|pau)?"), meaning: "One of the four great Hawaiian gods, linked with war, fishing and building. The Kū nights carry his name.", source: HAWAIIAN_DICT },
  { term: "ʻOle", match: word("ʻ?ole(?:k[ūu]|pau)"), meaning: "Hawaiian ʻole means \"nothing, not\": the ʻOle nights were thought unproductive.", source: HAWAIIAN_DICT },
  { term: "Tangaroa", match: word("tangaroa"), meaning: "Māori god of the sea and everything in it. The Tangaroa nights are known for fishing.", source: MAORI_DICT },
  { term: "Whiro", match: word("whiro"), meaning: "The dark night of the new Moon in the maramataka, named for Whiro, a figure of darkness.", source: TE_ARA },
  { term: "Rongo", match: word("rongo"), meaning: "Māori god of cultivated food, such as kūmara.", source: MAORI_DICT },
  { term: "Tāne", match: word("[ōo]?t[āa]ne"), meaning: "Māori god of forests and birds.", source: MAORI_DICT },
  { term: "Korekore", match: word("korekore"), meaning: "Māori kore means \"nothing\": the Korekore nights were thought poor for planting and fishing.", source: MAORI_DICT },
  { term: "maramataka", match: word("maramataka"), meaning: "The Māori lunar calendar: named nights of the Moon, used to plan planting, fishing and gathering.", source: TE_ARA },
  { term: "iwi", match: word("iwi"), meaning: "A Māori tribe. Iwi keep their own versions of the maramataka.", source: MAORI_DICT },
  { term: "kūmara", match: word("k[ūu]mara"), meaning: "Sweet potato, the main Māori crop.", source: MAORI_DICT },
  { term: "eeling", match: word("eel(?:s|ing)?"), meaning: "Catching tuna (freshwater eels), an important Māori food.", source: MAORI_DICT },
];

/** The glossary entries a record's name and wording use, each once. */
export function termsIn(item: AdviceItem): GlossaryEntry[] {
  const text = `${item.name} ${item.says.join(" ")} ${item.modern.join(" ")}`;
  return GLOSSARY.filter((g) => g.match.test(text));
}
