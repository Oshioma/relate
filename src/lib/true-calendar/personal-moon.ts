// Personal Moon: what each of the Moon's passages means for one member, and
// which tradition says so.
//
// The calculations are in ../zodiac.ts. This file holds the readings:
//  - Modern Western solar-house guidance (our wording, labelled as such). The
//    three highlighted periods' titles and guidance can be changed by the
//    member; their wording is saved with their birth details.
//  - What the astrology traditions in the research database say about the
//    same house or place, each in its own frame and never blended.

import type { CalendarBirthProfile } from "./research/model";
import { type ResearchBundle, astrologyBundle } from "./research/daily";
import type { PersonalKind } from "./zodiac";
import { type CivilDate, isValidTimeZone, parseIsoDate } from "./dates";

export type HighlightKind = Exclude<PersonalKind, "other">;
export const HIGHLIGHT_KINDS: HighlightKind[] = ["preceding", "sun", "following"];

export interface PeriodWording {
  title: string;
  guidance: string;
}

export interface HouseGuidance {
  /** Modern house theme, e.g. "Resources and value". */
  theme: string;
  /** One plain sentence: what this passage is about. */
  explanation: string;
  /** Suggested things to do (modern, our wording). */
  doList: string[];
  /** Things worth leaving for another time (modern, our wording). */
  avoidList: string[];
}

/** The three highlighted periods, modern wording (ours), editable per member. */
export const DEFAULT_PERIODS: Record<HighlightKind, PeriodWording> = {
  preceding: {
    title: "Reflection and preparation",
    guidance: "The Moon is in the sign just before your Sun sign: a quieter stretch to finish loose ends, rest and plan before your own sign comes round.",
  },
  sun: {
    title: "Renewal and expression",
    guidance: "The Moon is in your Sun sign: a good stretch to start what matters to you, show your work and say what you want.",
  },
  following: {
    title: "Resources and consolidation",
    guidance: "The Moon is in the sign just after your Sun sign: a practical stretch to look after money and belongings and build on what you started.",
  },
};

/** Modern Western solar-house readings, house 1–12 (our wording). */
export const HOUSE_GUIDANCE: Record<number, HouseGuidance> = {
  1: {
    theme: "Self",
    explanation: "Your own sign: modern astrology reads this as a time about you, your body and how you come across.",
    doList: ["Start something you care about", "Show or share your work", "Look after your body: exercise, a haircut, new clothes"],
    avoidList: ["Letting other people set your plans", "Hiding away from things you want"],
  },
  2: {
    theme: "Resources and value",
    explanation: "Modern astrology reads the next sign on as money, belongings and what you value.",
    doList: ["Check your budget and pay bills", "Sort, mend or sell belongings", "Build on what you started last week"],
    avoidList: ["Impulse spending", "Starting over from scratch"],
  },
  3: {
    theme: "Talk and learning",
    explanation: "Modern astrology reads this house as conversations, messages, short trips, siblings and neighbours.",
    doList: ["Write the messages you've been putting off", "Short trips and errands", "Learn something small"],
    avoidList: ["Leaving misunderstandings unclarified"],
  },
  4: {
    theme: "Home and family",
    explanation: "Modern astrology reads this house as home, family and roots.",
    doList: ["Time at home, cooking, tidying", "Call or visit family"],
    avoidList: ["Overfilling the diary away from home"],
  },
  5: {
    theme: "Creativity and play",
    explanation: "Modern astrology reads this house as creativity, play, romance and children.",
    doList: ["Make something for the fun of it", "Plan time with children or a partner", "Go out and enjoy yourself"],
    avoidList: ["Treating every hour as work"],
  },
  6: {
    theme: "Health and daily work",
    explanation: "Modern astrology reads this house as health, routines, daily work and helping others.",
    doList: ["Set up a routine: sleep, food, exercise", "Clear admin and small jobs", "Book health appointments"],
    avoidList: ["Skipping rest to get more done"],
  },
  7: {
    theme: "Partners",
    explanation: "Modern astrology reads this house as partners: marriage, business partners, agreements.",
    doList: ["Meetings and negotiations", "Time with your partner", "Agree terms in writing"],
    avoidList: ["Deciding alone what affects someone else"],
  },
  8: {
    theme: "Shared resources and change",
    explanation: "Modern astrology reads this house as shared money, debts, deep conversations and letting go.",
    doList: ["Look at shared money, debts and paperwork", "Honest conversations", "Let go of what no longer works"],
    avoidList: ["Lending or borrowing without thinking it through"],
  },
  9: {
    theme: "Learning and journeys",
    explanation: "Modern astrology reads this house as study, beliefs, teaching and long journeys.",
    doList: ["Study or teach", "Plan a journey", "Read something that widens your view"],
    avoidList: ["Getting lost in plans without a first step"],
  },
  10: {
    theme: "Work and standing",
    explanation: "Modern astrology reads this house as career, public life and reputation.",
    doList: ["Career moves, applications, pitches", "Public-facing work"],
    avoidList: ["Leaving commitments to others unanswered"],
  },
  11: {
    theme: "Friends and community",
    explanation: "Modern astrology reads this house as friends, groups and hopes for the future.",
    doList: ["Meet friends or join a group", "Community work", "Write down hopes for the year"],
    avoidList: ["Going it alone when help is offered"],
  },
  12: {
    theme: "Rest and retreat",
    explanation: "Modern astrology reads the sign before yours as rest, solitude and things behind the scenes.",
    doList: ["Rest and sleep well", "Finish loose ends and clear space", "Reflect, journal and plan the month ahead"],
    avoidList: ["Launching something big or public", "Taking on new commitments"],
  },
};

export const MODERN_ATTRIBUTION = "Modern Western astrology, counted from your Sun sign. The wording is ours, after modern astrologers' house meanings.";

/** A member's own wording, falling back to ours. Never trusts the stored shape. */
export function periodWording(saved: unknown): Record<HighlightKind, PeriodWording> {
  const out = { ...DEFAULT_PERIODS };
  if (!saved || typeof saved !== "object") return out;
  for (const k of HIGHLIGHT_KINDS) {
    const v = (saved as Record<string, unknown>)[k];
    if (!v || typeof v !== "object") continue;
    const title = typeof (v as PeriodWording).title === "string" ? (v as PeriodWording).title.trim().slice(0, 80) : "";
    const guidance = typeof (v as PeriodWording).guidance === "string" ? (v as PeriodWording).guidance.trim().slice(0, 600) : "";
    out[k] = { title: title || DEFAULT_PERIODS[k].title, guidance: guidance || DEFAULT_PERIODS[k].guidance };
  }
  return out;
}

// --- The member's details, as the browser uses them ---------------------------

export interface PersonalProfile {
  birthDate: CivilDate;
  birthTime: string | null;
  birthPlace: string | null;
  birthTimeZone: string | null;
  displayTimeZone: string | null;
  wording: Record<HighlightKind, PeriodWording>;
}

export function profileFromRow(row: Pick<CalendarBirthProfile, "birth_date" | "birth_time" | "birth_place" | "birth_time_zone" | "display_time_zone" | "period_wording"> | null): PersonalProfile | null {
  const birthDate = row ? parseIsoDate(row.birth_date) : null;
  if (!row || !birthDate) return null;
  return {
    birthDate,
    birthTime: row.birth_time ? row.birth_time.slice(0, 5) : null,
    birthPlace: row.birth_place,
    birthTimeZone: isValidTimeZone(row.birth_time_zone) ? row.birth_time_zone : null,
    displayTimeZone: isValidTimeZone(row.display_time_zone) ? row.display_time_zone : null,
    wording: periodWording(row.period_wording),
  };
}

// --- What the traditions say about one house ---------------------------------

export interface TraditionReading {
  cultureKey: string;
  tradition: string;
  /** How this tradition counts its houses or places, and whether it matches. */
  frame: string;
  /** Does this tradition count from the Sun sign? Only the modern one does. */
  sameFrame: boolean;
  placeName: string;
  meaning: string | null;
  favourability: string | null;
  practices: string[];
  sources: { title: string; url: string | null; locator: string | null }[];
}

const TRADITION_ORDER = ["astrology.modern-western", "astrology.hellenistic", "astrology.arabic", "astrology.jyotisha"];

/** Each tradition's record for house `house` (1–12), in a fixed order. */
export function traditionReadings(bundle: ResearchBundle, house: number): TraditionReading[] {
  const a = astrologyBundle(bundle);
  const sourceByKey = new Map(a.sources.map((s) => [s.key, s]));
  const cites = (table: string, key: string) =>
    a.citations
      .filter((c) => c.claim_table === table && c.claim_key === key)
      .map((c) => sourceByKey.get(c.source_key))
      .filter((s): s is NonNullable<typeof s> => Boolean(s))
      .map((s) => ({ title: s.publisher ? `${s.title} (${s.publisher})` : s.title, url: s.url ?? null, locator: null }));
  const out: TraditionReading[] = [];
  for (const culture of [...a.cultures].sort((x, y) => TRADITION_ORDER.indexOf(x.key) - TRADITION_ORDER.indexOf(y.key))) {
    const system = a.systems.find((s) => s.culture_key === culture.key);
    const cycle = system ? a.cycles.find((c) => c.system_key === system.key) : null;
    const pos = cycle ? a.positions.find((p) => p.cycle_key === cycle.key && p.position === house - 1) : null;
    if (!system || !pos) continue;
    const recs = a.recommendations.filter((r) => r.cycle_position_key === pos.key);
    const seen = new Set<string>();
    const sources = [...cites("calendar_cycle_positions", pos.key), ...recs.flatMap((r) => cites("calendar_recommendations", r.key))].filter((s) => (seen.has(s.title) ? false : (seen.add(s.title), true)));
    out.push({
      cultureKey: culture.key,
      tradition: culture.name,
      frame: pos.uncertainty ?? system.day_rule ?? "",
      sameFrame: culture.key === "astrology.modern-western",
      placeName: pos.name,
      meaning: pos.meaning ?? null,
      favourability: pos.favourability ?? null,
      practices: recs.map((r) => r.historical_practice),
      sources,
    });
  }
  return out;
}
