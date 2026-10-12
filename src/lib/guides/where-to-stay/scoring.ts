import type { Destination, GuideTag } from "./types";

// The fields the matcher reads — a full Destination or the slim summary the
// client components carry both qualify.
export type Place = Pick<Destination, "key" | "name" | "rank" | "bestFor" | "panel">;
import {
  ACCOMMODATION_ORDER,
  NIGHTLIFE_ORDER,
  QUIET_ORDER,
  RESTAURANT_ORDER,
  SWIMMING_ORDER,
  SWIMMING_LABELS,
} from "./labels";

// "FIND YOUR ZANZIBAR" — a transparent, deterministic matcher.
//
// No AI and no hidden weights: every point a destination earns comes from one
// of the guide's own labels (swimming, atmosphere, nightlife, budget, best-for
// tags) and carries the plain-English reason shown to the visitor. Same
// answers, same results, every time; ties go to the higher-ranked destination.

export type Priority = "swimming" | "peace" | "food-nightlife" | "culture" | "activities";
export type Companions = "partner" | "family" | "friends" | "solo" | "honeymoon";
export type BudgetAnswer = "budget" | "mid" | "luxury" | "flexible";
export type AtmosphereAnswer = "very-quiet" | "relaxed" | "lively" | "nightlife";
export type SwimAnswer = "essential" | "important" | "not-important" | "pool";

export type QuizAnswers = {
  priority: Priority;
  companions: Companions;
  budget: BudgetAnswer;
  atmosphere: AtmosphereAnswer;
  swim: SwimAnswer;
};

export const QUIZ_QUESTIONS: {
  key: keyof QuizAnswers;
  question: string;
  options: { value: string; label: string }[];
}[] = [
  {
    key: "priority",
    question: "What's most important to you?",
    options: [
      { value: "swimming", label: "Swimming in the sea" },
      { value: "peace", label: "Peace and relaxation" },
      { value: "food-nightlife", label: "Restaurants and nightlife" },
      { value: "culture", label: "Local culture" },
      { value: "activities", label: "Activities and adventure" },
    ],
  },
  {
    key: "companions",
    question: "Who are you travelling with?",
    options: [
      { value: "partner", label: "Partner" },
      { value: "family", label: "Family with children" },
      { value: "friends", label: "Friends" },
      { value: "solo", label: "Solo" },
      { value: "honeymoon", label: "Honeymoon" },
    ],
  },
  {
    key: "budget",
    question: "What's your accommodation budget?",
    options: [
      { value: "budget", label: "Budget" },
      { value: "mid", label: "Mid-range" },
      { value: "luxury", label: "Luxury" },
      { value: "flexible", label: "Flexible" },
    ],
  },
  {
    key: "atmosphere",
    question: "What sort of atmosphere do you prefer?",
    options: [
      { value: "very-quiet", label: "Very quiet" },
      { value: "relaxed", label: "Relaxed with a few restaurants" },
      { value: "lively", label: "A lively destination" },
      { value: "nightlife", label: "Somewhere with nightlife" },
    ],
  },
  {
    key: "swim",
    question: "How important is being able to swim whenever you want?",
    options: [
      { value: "essential", label: "Essential" },
      { value: "important", label: "Important" },
      { value: "not-important", label: "Not particularly important" },
      { value: "pool", label: "I'll mainly use the hotel pool" },
    ],
  },
];

export type ScoredDestination<T extends Place = Place> = {
  destination: T;
  score: number;
  reasons: string[];
};

const has = (d: Place, tag: GuideTag) => d.bestFor.includes(tag);

type Rule = { points: number; reason: string } | null;

function priorityRule(d: Place, priority: Priority): Rule[] {
  switch (priority) {
    case "swimming": {
      const s = SWIMMING_ORDER[d.panel.swimming];
      return [s >= 2 ? { points: s * 2, reason: `Swimming is rated ${SWIMMING_LABELS[d.panel.swimming].toLowerCase()}` } : null];
    }
    case "peace": {
      const q = QUIET_ORDER[d.panel.atmosphere];
      return [q > 0 ? { points: q * 2, reason: q === 2 ? "A genuinely peaceful atmosphere" : "A fairly relaxed atmosphere" } : null];
    }
    case "food-nightlife": {
      const r = RESTAURANT_ORDER[d.panel.restaurants];
      const n = NIGHTLIFE_ORDER[d.panel.nightlife];
      return [
        r > 0 ? { points: r * 2, reason: r === 2 ? "An excellent choice of restaurants" : "A reasonable choice of restaurants" } : null,
        n > 0 ? { points: n, reason: n === 2 ? "Plenty of nightlife" : "Some nightlife" } : null,
      ];
    }
    case "culture":
      return [
        has(d, "culture") ? { points: 6, reason: "Zanzibar's richest history and culture" } : null,
        has(d, "village") ? { points: 3, reason: "Everyday village life around you" } : null,
      ];
    case "activities":
      return [
        has(d, "diving") || has(d, "snorkelling") ? { points: 3, reason: "Diving and snorkelling trips nearby" } : null,
        has(d, "kitesurfing") ? { points: 3, reason: "Excellent kitesurfing" } : null,
        has(d, "wildlife") ? { points: 2, reason: "Wildlife and nature trips" } : null,
        RESTAURANT_ORDER[d.panel.restaurants] === 2 ? { points: 1, reason: "Lots of tours and operators in the village" } : null,
      ];
  }
}

function companionsRule(d: Place, companions: Companions): Rule[] {
  switch (companions) {
    case "partner":
      return [has(d, "couples") ? { points: 3, reason: "Popular with couples" } : null];
    case "honeymoon":
      return [
        has(d, "honeymoon") ? { points: 4, reason: "A favourite for honeymoons" } : null,
        has(d, "luxury") ? { points: 1, reason: "Special-occasion places to stay" } : null,
      ];
    case "family":
      return [
        has(d, "families") ? { points: 4, reason: "Well suited to families" } : null,
        d.panel.nightlife === "high" ? { points: -1, reason: "" } : null,
      ];
    case "friends":
      return [
        NIGHTLIFE_ORDER[d.panel.nightlife] > 0 ? { points: NIGHTLIFE_ORDER[d.panel.nightlife] + 1, reason: "Easy to go out together" } : null,
        has(d, "first-timers") ? { points: 1, reason: "Plenty to do as a group" } : null,
      ];
    case "solo":
      return [
        has(d, "solo") ? { points: 4, reason: "Easy to meet other travellers" } : null,
        d.panel.atmosphere === "lively" ? { points: 1, reason: "A sociable village" } : null,
      ];
  }
}

function budgetRule(d: Place, budget: BudgetAnswer): Rule[] {
  const level = d.panel.budget;
  switch (budget) {
    case "budget":
      return [
        level === "$" || has(d, "budget") ? { points: 3, reason: "Good-value places to stay" } : null,
        level === "$$$" ? { points: -3, reason: "" } : null,
      ];
    case "mid":
      return [level === "$$" ? { points: 2, reason: "A good mid-range choice of hotels" } : null, ACCOMMODATION_ORDER[d.panel.accommodation] === 2 ? { points: 1, reason: "A wide choice of accommodation" } : null];
    case "luxury":
      return [level === "$$$" || has(d, "luxury") ? { points: 3, reason: "High-end hotels and villas" } : null];
    case "flexible":
      return [ACCOMMODATION_ORDER[d.panel.accommodation] === 2 ? { points: 1, reason: "A wide choice of accommodation" } : null];
  }
}

function atmosphereRule(d: Place, atmosphere: AtmosphereAnswer): Rule[] {
  const a = d.panel.atmosphere;
  switch (atmosphere) {
    case "very-quiet":
      return [a === "peaceful" ? { points: 3, reason: "Quiet evenings" } : null, a === "lively" ? { points: -3, reason: "" } : null];
    case "relaxed":
      return [
        a !== "lively" && RESTAURANT_ORDER[d.panel.restaurants] >= 1 ? { points: 3, reason: "Relaxed, with a few places to eat out" } : null,
        a === "peaceful" && d.panel.restaurants === "limited" ? { points: 1, reason: "Relaxed and calm" } : null,
      ];
    case "lively":
      return [a === "lively" ? { points: 3, reason: "A lively place to stay" } : null, a === "moderate" ? { points: 1, reason: "Some life in the evenings" } : null];
    case "nightlife":
      return [NIGHTLIFE_ORDER[d.panel.nightlife] > 0 ? { points: NIGHTLIFE_ORDER[d.panel.nightlife] * 2, reason: d.panel.nightlife === "high" ? "The island's best nightlife" : "Some nightlife nearby" } : null, a === "peaceful" ? { points: -2, reason: "" } : null];
  }
}

function swimRule(d: Place, swim: SwimAnswer): Rule[] {
  const s = d.panel.swimming;
  switch (swim) {
    case "essential":
      return [
        s === "excellent" ? { points: 6, reason: "You can swim at almost any state of the tide" } : null,
        s === "high-tide" ? { points: 1, reason: "Reasonable swimming around high tide" } : null,
        s === "tide-dependent" ? { points: -3, reason: "" } : null,
        s === "limited" ? { points: -6, reason: "" } : null,
      ];
    case "important":
      return [
        s === "excellent" ? { points: 3, reason: "Easy sea swimming most of the day" } : null,
        s === "high-tide" ? { points: 1, reason: "Good swimming around high tide" } : null,
        s === "limited" ? { points: -3, reason: "" } : null,
      ];
    case "not-important":
      return [s === "limited" ? { points: -1, reason: "" } : null];
    case "pool":
      return [has(d, "resort") ? { points: 2, reason: "Resorts with good pools" } : null, s === "limited" ? { points: -1, reason: "" } : null];
  }
}

export function scoreDestination<T extends Place>(d: T, answers: QuizAnswers): ScoredDestination<T> {
  const rules = [
    ...priorityRule(d, answers.priority),
    ...companionsRule(d, answers.companions),
    ...budgetRule(d, answers.budget),
    ...atmosphereRule(d, answers.atmosphere),
    ...swimRule(d, answers.swim),
  ].filter((r): r is { points: number; reason: string } => r !== null);

  // Stone Town is a city: it should only surface for a visitor whose top
  // priority is culture, never as somebody's beach.
  const cityPenalty = d.panel.swimming === "limited" && answers.priority !== "culture" ? -8 : 0;

  return {
    destination: d,
    score: rules.reduce((sum, r) => sum + r.points, 0) + cityPenalty,
    reasons: [...new Set(rules.filter((r) => r.points > 0 && r.reason).map((r) => r.reason))],
  };
}

export function recommendDestinations<T extends Place>(destinations: T[], answers: QuizAnswers, count = 3): ScoredDestination<T>[] {
  return destinations
    .map((d) => scoreDestination(d, answers))
    .sort((a, b) => b.score - a.score || a.destination.rank - b.destination.rank)
    .slice(0, count);
}

// --- Side-by-side comparison ------------------------------------------------

export type ComparisonQuestion = { question: string; answer: string };

function better(
  places: Place[],
  value: (d: Place) => number,
  label: (d: Place) => string,
  phrase: { winner: (names: string) => string; tie: string }
): string {
  const best = Math.max(...places.map(value));
  const winners = places.filter((d) => value(d) === best);
  const detail = places.map((d) => `${d.name}: ${label(d)}`).join(" · ");
  if (winners.length === places.length) return `${phrase.tie} (${detail}).`;
  return `${phrase.winner(winners.map((d) => d.name).join(" and "))} (${detail}).`;
}

// Plain answers to the questions people ask when weighing two or three places,
// derived entirely from each destination's labels.
export function compareDestinations(places: Place[]): ComparisonQuestion[] {
  if (places.length < 2) return [];
  return [
    {
      question: "Which has better swimming?",
      answer: better(places, (d) => SWIMMING_ORDER[d.panel.swimming], (d) => SWIMMING_LABELS[d.panel.swimming].toLowerCase(), {
        winner: (n) => `${n} for easier swimming`,
        tie: "Much the same",
      }),
    },
    {
      question: "Which has more restaurants?",
      answer: better(places, (d) => RESTAURANT_ORDER[d.panel.restaurants], (d) => d.panel.restaurants, {
        winner: (n) => `${n}`,
        tie: "Similar choice",
      }),
    },
    {
      question: "Which is quieter?",
      answer: better(places, (d) => QUIET_ORDER[d.panel.atmosphere], (d) => d.panel.atmosphere, {
        winner: (n) => `${n}`,
        tie: "Equally calm",
      }),
    },
    {
      question: "Which has more nightlife?",
      answer: better(places, (d) => NIGHTLIFE_ORDER[d.panel.nightlife], (d) => d.panel.nightlife, {
        winner: (n) => `${n}`,
        tie: "About the same",
      }),
    },
    {
      question: "Which is better for families?",
      answer: better(
        places,
        (d) => (has(d, "families") ? 2 : 0) + (SWIMMING_ORDER[d.panel.swimming] >= 2 ? 1 : 0) - (d.panel.nightlife === "high" ? 1 : 0),
        (d) => (has(d, "families") ? "family favourite" : "less family-focused"),
        { winner: (n) => `${n}`, tie: "Either works" }
      ),
    },
    {
      question: "Which has more accommodation variety?",
      answer: better(places, (d) => ACCOMMODATION_ORDER[d.panel.accommodation], (d) => d.panel.accommodation, {
        winner: (n) => `${n}`,
        tie: "Similar choice",
      }),
    },
  ];
}

// --- Comparison table filters ----------------------------------------------

export function matchesFilter(d: Place, filter: GuideTag): boolean {
  switch (filter) {
    case "swimming":
      return d.panel.swimming === "excellent";
    case "nightlife":
      return d.panel.nightlife !== "low" || has(d, "nightlife");
    case "restaurants":
      return d.panel.restaurants === "excellent" || has(d, "restaurants") || has(d, "cafes");
    case "peace":
      return d.panel.atmosphere === "peaceful" || has(d, "peace");
    case "budget":
      return d.panel.budget === "$" || has(d, "budget");
    case "luxury":
      return d.panel.budget === "$$$" || has(d, "luxury");
    case "diving":
      return has(d, "diving") || has(d, "snorkelling");
    default:
      return has(d, filter);
  }
}
