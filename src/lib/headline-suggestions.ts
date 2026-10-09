// Ready-made feed headlines (communities.tagline) for the setup wizard, by
// template. The first is what the wizard pre-fills; the rest are one-click
// alternatives. Short on purpose: the headline is set big over the cover, with
// the community's name beside it, so it should read like a slogan, not a
// description.

const GENERIC = ["Better together.", "Find your people.", "Where it all happens."];

const BY_TEMPLATE: Record<string, string[]> = {
  learning: ["Learn together. Grow faster.", "Every lesson, shared.", "Curious minds, one place."],
  business: ["Build it together.", "Operators helping operators.", "Grow your business with people who get it."],
  coaching: ["Show up. Level up.", "Your progress, supported.", "Real change, together."],
  course: ["Learn it. Do it. Together.", "One cohort. One goal.", "From first lesson to finish line."],
  creator: ["Closer to the work.", "Behind the scenes, together.", "Made for the people who care most."],
  fanclub: ["For the fans.", "Closer to the music.", "Where the fans come first."],
  fitness: ["Train together. Get stronger.", "Every rep counts.", "Show up for each other."],
  faith: ["Walking together in faith.", "A place to belong.", "Grow in faith, together."],
  school: ["Learning, done differently.", "Our school, together.", "Where every learner belongs."],
  place: ["Live like a local.", "Your place, all in one place.", "Discover. Connect. Explore."],
  activity: ["Get out there together.", "More time outside.", "Find your crew."],
  farming: ["Grow food. Share knowledge.", "Growing together.", "From seed to harvest, together."],
  wellness: ["Breathe. Connect. Grow.", "Wellbeing, together.", "A calmer place to grow."],
  photography: ["See more. Shoot more.", "Every frame tells a story.", "Better photos, together."],
  craft: ["Make it together.", "Made by hand, shared by many.", "From first try to finished piece."],
  nonprofit: ["Doing good, together.", "Small acts, big change.", "Together we make a difference."],
  networking: ["Meet the right people.", "Connections that count.", "Your network, working for you."],
  gaming: ["Play together.", "Find your squad.", "Game on."],
  startup: ["Build fast. Build together.", "Founders helping founders.", "From idea to launch."],
  book_club: ["Read more. Talk more.", "One book at a time.", "Every page, shared."],
};

export function headlineSuggestions(templateKey: string): string[] {
  return BY_TEMPLATE[templateKey] ?? GENERIC;
}
