// Mentor matching for guided-journey spaces.
//
// Deliberately simple and explainable: mentors are ordered by a fixed list of
// priorities and every card says, in words, why it is there ("Grows
// vegetables", "Same region", "Speaks English", "2 places left"). There is no
// percentage or "compatibility score" — a number would suggest a precision
// this matching does not have.
//
// Priority, as agreed for Adopt a Beginner:
//   1. compatible crops / interests
//   2. similar climate or growing conditions (same region, then same country)
//   3. a shared language
//   4. availability (has free places, is not paused)
//   5. location preference (online / local / either compatible)
//   6. mentor capacity (more free places first, as a tie-breaker)
//
// Mentors with no free places or who have paused are kept out of the list
// entirely: offering a request button that can only be declined is unkind.

export type MatchBeginner = {
  userId: string;
  country: string | null;
  region: string | null;
  interests: string[];
  languages: string[];
  helpMode: "online" | "local" | "either";
};

export type MatchMentor = {
  userId: string;
  country: string | null;
  region: string | null;
  climate: string | null;
  experience: string[];
  preferredTopics: string[];
  languages: string[];
  helpMode: "online" | "local" | "either";
  capacity: number;
  activeBeginners: number;
  isPaused: boolean;
};

export type MatchReason = { kind: "interest" | "region" | "country" | "language" | "mode" | "places"; text: string };

export type MentorMatch<M extends MatchMentor = MatchMentor> = {
  mentor: M;
  reasons: MatchReason[];
  placesLeft: number;
};

const norm = (value: string | null | undefined) => (value ?? "").trim().toLowerCase();

function overlap(a: string[], b: string[]): string[] {
  const set = new Set(b.map(norm).filter(Boolean));
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of a) {
    const key = norm(item);
    if (key && set.has(key) && !seen.has(key)) {
      seen.add(key);
      out.push(item);
    }
  }
  return out;
}

export function modesCompatible(beginner: MatchBeginner["helpMode"], mentor: MatchMentor["helpMode"]): boolean {
  return beginner === "either" || mentor === "either" || beginner === mentor;
}

export function placesLeft(mentor: Pick<MatchMentor, "capacity" | "activeBeginners">): number {
  return Math.max(0, mentor.capacity - mentor.activeBeginners);
}

// `labelFor` turns an option value ("vegetables") into the space's own wording.
export function rankMentors<M extends MatchMentor>(
  beginner: MatchBeginner,
  mentors: M[],
  labelFor: (value: string) => string = (v) => v
): MentorMatch<M>[] {
  const scored = mentors
    .filter((m) => m.userId !== beginner.userId && !m.isPaused && placesLeft(m) > 0)
    .map((mentor) => {
      const reasons: MatchReason[] = [];
      const interestHits = overlap(beginner.interests.filter((i) => i !== "not_sure"), [...mentor.experience, ...mentor.preferredTopics]);
      if (interestHits.length > 0) {
        reasons.push({ kind: "interest", text: `Helps with ${interestHits.map(labelFor).join(", ").toLowerCase()}` });
      }

      const sameRegion = Boolean(norm(beginner.region)) && (norm(beginner.region) === norm(mentor.region) || norm(beginner.region) === norm(mentor.climate));
      const sameCountry = Boolean(norm(beginner.country)) && norm(beginner.country) === norm(mentor.country);
      if (sameRegion) reasons.push({ kind: "region", text: "Same region" });
      else if (sameCountry) reasons.push({ kind: "country", text: "Same country" });

      const languageHits = overlap(beginner.languages, mentor.languages);
      if (languageHits.length > 0) reasons.push({ kind: "language", text: `Speaks ${languageHits.join(", ")}` });

      const modeOk = modesCompatible(beginner.helpMode, mentor.helpMode);
      if (modeOk && beginner.helpMode !== "either") {
        reasons.push({ kind: "mode", text: beginner.helpMode === "online" ? "Mentors online" : "Happy to help locally" });
      }

      const left = placesLeft(mentor);
      reasons.push({ kind: "places", text: left === 1 ? "1 place left" : `${left} places left` });

      // A sort key, never shown: each priority dominates the ones below it.
      const key = [
        interestHits.length > 0 ? 1 : 0,
        sameRegion ? 2 : sameCountry ? 1 : 0,
        languageHits.length > 0 || beginner.languages.length === 0 ? 1 : 0,
        1, // availability: everyone left in the list has places and isn't paused
        modeOk ? 1 : 0,
        left,
      ];
      return { mentor, reasons, placesLeft: left, key };
    });

  scored.sort((a, b) => {
    for (let i = 0; i < a.key.length; i++) {
      if (a.key[i] !== b.key[i]) return b.key[i] - a.key[i];
    }
    return 0;
  });

  return scored.map(({ mentor, reasons, placesLeft: left }) => ({ mentor, reasons, placesLeft: left }));
}

// Comma/newline separated free text → a clean, de-duplicated list.
export function parseList(raw: string | null | undefined, max = 20): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const part of String(raw ?? "").split(/[,\n]/)) {
    const value = part.trim().slice(0, 60);
    const key = value.toLowerCase();
    if (value && !seen.has(key)) {
      seen.add(key);
      out.push(value);
    }
    if (out.length >= max) break;
  }
  return out;
}
