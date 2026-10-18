import { coverPath, coversForTemplate } from "@/lib/community-covers";

// Example posts shown on a community feed only while it has no real activity,
// so a brand-new community doesn't open on a blank page. They are never stored
// — the feed renders them in place of the empty state, clearly labelled as
// examples, and they vanish the moment anything real is posted. Written in the
// owner's voice (the byline is the real owner) so no fake member is implied.

export interface ExampleFeedPost {
  key: string;
  title: string;
  body: string;
  imageUrl: string;
  // Fixed byline age, in the feed's own "5h ago" style, so the card reads
  // like a real post without the render depending on the clock.
  ago: string;
}

// One conversation-starter per template, in the owner's voice. Anything not
// listed (custom, or a template added later) falls back to the generic one.
const TEMPLATE_PROMPTS: Record<string, { title: string; body: string }> = {
  learning: { title: "What are you learning right now?", body: "Share one thing you're working on this week and where you're stuck — someone here has probably been there." },
  business: { title: "Introduce your business", body: "Tell us what you do, who you serve and one thing you'd love help with this month." },
  coaching: { title: "Set one goal for this week", body: "Post a single goal below. We'll check back in on Friday and see how everyone got on." },
  course: { title: "Where are you up to?", body: "Say which lesson you're on and what clicked (or didn't). Questions are welcome — no one's behind." },
  creator: { title: "What should I make next?", body: "I've got a few ideas lined up. Tell me what you'd most like to see and I'll start there." },
  fanclub: { title: "Your favourite moment so far?", body: "Show, track, clip — whatever it is, share it and tell us why it stuck with you." },
  fitness: { title: "This week's training", body: "Post what you've got planned this week. Small goals count — showing up is the hard part." },
  faith: { title: "Prayer and encouragement", body: "If there's something on your heart this week, share it here. We'd love to stand with you." },
  school: { title: "Welcome to the new term", body: "This is where you'll find news, dates and reminders. Questions for staff are always welcome." },
  place: { title: "Your favourite local spot?", body: "Café, beach, walk, shop — share the place you'd send a friend to first, and why." },
  activity: { title: "Who's out this weekend?", body: "Post where and when you're heading out, and anyone who can make it can join you." },
  farming: { title: "What's in the ground this week?", body: "Share what you've planted, harvested or are battling. Photos of the plot are always welcome." },
  wellness: { title: "A small win this week", body: "Share one thing that helped you feel a little better lately. Small things count." },
  photography: { title: "Share a recent shot", body: "Post one photo you took this week and a line about how you got it. Feedback welcome if you want it." },
  craft: { title: "What's on your workbench?", body: "Show us what you're making — finished or not. Works in progress are the best bit." },
  nonprofit: { title: "How you can help this month", body: "Here's where we'll post volunteer slots and ways to give. Say hi and tell us what you'd like to get involved with." },
  networking: { title: "Who should you meet?", body: "Post what you do and who you'd love an introduction to. Let's make some connections." },
  gaming: { title: "What are you playing?", body: "Drop your current game and your handle. Looking for a squad? Say so here." },
  startup: { title: "Weekly build update", body: "Share what you shipped, what you learned and what's blocking you. Short updates are perfect." },
  book_club: { title: "What are you reading?", body: "Tell us the book on your bedside table and whether you'd recommend it. Next club pick coming soon." },
};

const GENERIC_PROMPT = {
  title: "What brought you here?",
  body: "Tell us a little about yourself and what you're hoping to get out of this community.",
};

export function exampleFeedPosts(community: { name: string; template_key: string | null }): ExampleFeedPost[] {
  const template = community.template_key ?? "custom";
  // Three distinct photos that suit the template (best matches first, then the
  // rest of the cover library), so each example card looks different.
  const images = coversForTemplate(template)
    .slice(0, 3)
    .map((cover) => coverPath(cover.key));
  const prompt = TEMPLATE_PROMPTS[template] ?? GENERIC_PROMPT;

  return [
    {
      key: "welcome",
      title: `Welcome to ${community.name}!`,
      body: "So glad you're here. This feed is where everything new shows up — posts, events and new members. Have a look around the spaces and say hello.",
      imageUrl: images[0],
      ago: "1d ago",
    },
    {
      key: "prompt",
      title: prompt.title,
      body: prompt.body,
      imageUrl: images[1],
      ago: "5h ago",
    },
    {
      key: "introductions",
      title: "Introduce yourself",
      body: "Share your name, where you're based and one thing you'd like people here to know about you.",
      imageUrl: images[2],
      ago: "40m ago",
    },
  ];
}
