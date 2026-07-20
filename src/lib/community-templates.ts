import type { ProfileFieldType } from "@/types/database";

// Curated content behind the Community Builder wizard. Deliberately shaped
// around what the schema already supports today: spaces are plain named
// containers (no space_type/component system), and "profile fields" here
// means community_profile_fields — custom, community-scoped attributes.
// Structured member data that already has its own dedicated tables (skills,
// interests, help requests, location) is intentionally NOT duplicated here.

export interface TemplateSpace {
  name: string;
  description: string;
}

export interface TemplateProfileField {
  label: string;
  field_type: ProfileFieldType;
  options?: string[];
}

export interface CommunityTemplate {
  key: string;
  label: string;
  icon: string; // lucide-react icon name, resolved by TEMPLATE_ICONS in the UI layer
  tagline: string;
  description: string;
  defaultSpaces: TemplateSpace[];
  defaultProfileFields: TemplateProfileField[];
}

export const COMMUNITY_TEMPLATES: CommunityTemplate[] = [
  {
    key: "learning",
    label: "Learning",
    icon: "GraduationCap",
    tagline: "Courses, study groups and live classes",
    description: "For educators building a structured learning community.",
    defaultSpaces: [
      { name: "Discussion", description: "General conversation and questions." },
      { name: "Study Groups", description: "Small cohorts studying together." },
      { name: "Live Classes", description: "Announcements and replays for live sessions." },
      { name: "Q&A", description: "Ask questions about the material." },
      { name: "Resources", description: "Reading lists, templates and downloads." },
    ],
    defaultProfileFields: [
      { label: "Experience Level", field_type: "dropdown", options: ["Beginner", "Intermediate", "Advanced", "Expert"] },
      { label: "Currently Studying", field_type: "text" },
    ],
  },
  {
    key: "business",
    label: "Business",
    icon: "Briefcase",
    tagline: "Peer accountability for operators and founders",
    description: "For consultants, agencies and operator communities trading tactics.",
    defaultSpaces: [
      { name: "Discussion", description: "General conversation." },
      { name: "Wins & Challenges", description: "Share what's working and what's not." },
      { name: "Mastermind", description: "Small-group accountability threads." },
      { name: "Knowledge Base", description: "Playbooks and frameworks." },
      { name: "Resources", description: "Templates and tools." },
    ],
    defaultProfileFields: [
      { label: "Company Name", field_type: "text" },
      { label: "Industry", field_type: "text" },
    ],
  },
  {
    key: "coaching",
    label: "Coaching",
    icon: "Compass",
    tagline: "Client check-ins and accountability",
    description: "For coaches running group programs with structured check-ins.",
    defaultSpaces: [
      { name: "Discussion", description: "General conversation." },
      { name: "Weekly Check-Ins", description: "Progress updates and reflections." },
      { name: "Wins Wall", description: "Celebrate breakthroughs." },
      { name: "Resources", description: "Worksheets and frameworks." },
      { name: "Q&A", description: "Ask your coach anything." },
    ],
    defaultProfileFields: [{ label: "Coaching Focus", field_type: "text" }, { label: "Program Start Date", field_type: "date" }],
  },
  {
    key: "course",
    label: "Course",
    icon: "MonitorPlay",
    tagline: "A single cohort-based course community",
    description: "For a single flagship course with a cohort and structured lessons.",
    defaultSpaces: [
      { name: "Announcements", description: "Updates from the instructor." },
      { name: "Curriculum", description: "Lesson-by-lesson discussion." },
      { name: "Assignments", description: "Submit and discuss assignments." },
      { name: "Cohort Chat", description: "Talk with your cohort." },
      { name: "Q&A", description: "Ask questions about the material." },
      { name: "Resources", description: "Slides, templates and extra reading." },
    ],
    defaultProfileFields: [{ label: "Cohort", field_type: "text" }],
  },
  {
    key: "creator",
    label: "Creator",
    icon: "Clapperboard",
    tagline: "Posts, livestreams and courses for your audience",
    description: "For creators turning an audience into a paid membership community.",
    defaultSpaces: [
      { name: "Posts", description: "Everything you share with members." },
      { name: "Livestreams", description: "Live sessions and replays." },
      { name: "Courses", description: "Premium lessons for members." },
      { name: "Files", description: "Downloads and templates." },
      { name: "Q&A", description: "Ask me anything." },
    ],
    defaultProfileFields: [{ label: "Content Niche", field_type: "text" }],
  },
  {
    key: "fitness",
    label: "Fitness",
    icon: "Dumbbell",
    tagline: "Workouts, habits and accountability",
    description: "For trainers and fitness communities driving daily consistency.",
    defaultSpaces: [
      { name: "Discussion", description: "General conversation." },
      { name: "Workout Log", description: "Share your sessions." },
      { name: "Nutrition", description: "Meals, macros and recipes." },
      { name: "Challenges", description: "Time-boxed fitness programs." },
      { name: "Wins", description: "Celebrate progress." },
    ],
    defaultProfileFields: [
      { label: "Fitness Goal", field_type: "dropdown", options: ["Lose weight", "Build muscle", "General fitness", "Sport-specific"] },
      { label: "Injury Notes", field_type: "textarea" },
    ],
  },
  {
    key: "faith",
    label: "Faith",
    icon: "Church",
    tagline: "Devotionals, prayer and small groups",
    description: "For churches and faith communities staying connected between gatherings.",
    defaultSpaces: [
      { name: "Discussion", description: "General conversation." },
      { name: "Daily Devotional", description: "Reflections on scripture and prayer." },
      { name: "Prayer Requests", description: "Share and pray for each other." },
      { name: "Small Groups", description: "Stay connected with your group." },
      { name: "Testimonies", description: "Stories of faith in action." },
    ],
    defaultProfileFields: [{ label: "Small Group", field_type: "text" }],
  },
  {
    key: "local",
    label: "Local",
    icon: "MapPin",
    tagline: "Neighborhood announcements and events",
    description: "For neighborhoods, towns and local interest groups.",
    defaultSpaces: [
      { name: "Discussion", description: "General conversation." },
      { name: "Announcements", description: "Official updates." },
      { name: "Marketplace", description: "Buy, sell and give away locally." },
      { name: "Volunteer Opportunities", description: "Sign up to help out." },
      { name: "Resources", description: "Local services and contacts." },
    ],
    defaultProfileFields: [{ label: "Neighborhood / Block", field_type: "text" }],
  },
  {
    key: "farming",
    label: "Farming",
    icon: "Sprout",
    tagline: "Crops, journals and seasonal knowledge",
    description: "For growers tracking crops, sharing harvests and helping each other through the seasons.",
    defaultSpaces: [
      { name: "Discussion", description: "General conversation." },
      { name: "Growing Journey", description: "Share how your season is going." },
      { name: "Farm Journal", description: "Post plantings, harvests and conditions." },
      { name: "Crop Library", description: "Reference guides by crop." },
      { name: "Ask for Help", description: "Get advice from experienced growers." },
      { name: "Marketplace", description: "Trade produce, seeds and tools." },
      { name: "Knowledge Base", description: "Farming best practices." },
    ],
    defaultProfileFields: [
      { label: "Farm Size", field_type: "text" },
      { label: "Organic Certified", field_type: "checkbox" },
    ],
  },
  {
    key: "wellness",
    label: "Wellness",
    icon: "HeartPulse",
    tagline: "Habits, journaling and mindful challenges",
    description: "For wellness practitioners guiding members toward healthier daily habits.",
    defaultSpaces: [
      { name: "Discussion", description: "General conversation." },
      { name: "Wellness Journal", description: "Track how you're feeling." },
      { name: "Challenges", description: "Guided wellness challenges." },
      { name: "Resources", description: "Guided practices and reading." },
    ],
    defaultProfileFields: [{ label: "Wellness Focus", field_type: "dropdown", options: ["Sleep", "Stress", "Nutrition", "Movement", "Mindfulness"] }],
  },
  {
    key: "photography",
    label: "Photography",
    icon: "Camera",
    tagline: "Galleries, critique and challenges",
    description: "For photographers sharing work, getting feedback and improving together.",
    defaultSpaces: [
      { name: "Discussion", description: "General conversation." },
      { name: "Photo Gallery", description: "Share your latest shots." },
      { name: "Critique Requests", description: "Get feedback on your work." },
      { name: "Challenges", description: "Weekly photo prompts." },
      { name: "Marketplace", description: "Sell prints and presets." },
      { name: "Resources", description: "Tutorials, presets and gear guides." },
    ],
    defaultProfileFields: [{ label: "Gear", field_type: "text" }, { label: "Style / Genre", field_type: "text" }],
  },
  {
    key: "nonprofit",
    label: "Non-profit",
    icon: "HandHeart",
    tagline: "Volunteers, donations and impact",
    description: "For non-profits organizing volunteers and reporting impact to supporters.",
    defaultSpaces: [
      { name: "Discussion", description: "General conversation." },
      { name: "Announcements", description: "Updates from the organization." },
      { name: "Volunteer Sign-Ups", description: "Find volunteers by availability." },
      { name: "Impact Stories", description: "Outcomes and stories." },
      { name: "Knowledge Base", description: "Volunteer handbook and policies." },
    ],
    defaultProfileFields: [{ label: "Volunteer Availability", field_type: "text" }],
  },
  {
    key: "networking",
    label: "Networking",
    icon: "Network",
    tagline: "Introductions and professional connections",
    description: "For professional communities focused on making connections.",
    defaultSpaces: [
      { name: "Discussion", description: "General conversation." },
      { name: "Introductions", description: "New members introduce themselves." },
      { name: "Job Board", description: "Post and browse opportunities." },
      { name: "Mastermind", description: "Small-group discussion." },
      { name: "Resources", description: "Guides and templates." },
    ],
    defaultProfileFields: [{ label: "Company / Role", field_type: "text" }],
  },
  {
    key: "gaming",
    label: "Gaming",
    icon: "Gamepad2",
    tagline: "Chat, tournaments and highlights",
    description: "For gaming communities and clans organizing around play.",
    defaultSpaces: [
      { name: "Discussion", description: "General conversation." },
      { name: "Tournaments", description: "Upcoming and past tournaments." },
      { name: "Clips & Highlights", description: "Share your best plays." },
      { name: "Guides", description: "Strategy and build guides." },
      { name: "Team Finder", description: "Find teammates by game and role." },
    ],
    defaultProfileFields: [{ label: "Main Game(s)", field_type: "text" }, { label: "Rank / Experience", field_type: "text" }],
  },
  {
    key: "startup",
    label: "Startup",
    icon: "Rocket",
    tagline: "Founder journals and peer support",
    description: "For founder communities and accelerators tracking building-in-public progress.",
    defaultSpaces: [
      { name: "Discussion", description: "General conversation." },
      { name: "Founder Journal", description: "Log metrics and milestones." },
      { name: "Mastermind", description: "Small-group discussion." },
      { name: "Pitch Practice", description: "Get feedback on your pitch." },
      { name: "Job Board", description: "Hire and get hired." },
      { name: "Resources", description: "Templates, decks and playbooks." },
    ],
    defaultProfileFields: [{ label: "Company Name", field_type: "text" }, { label: "Stage", field_type: "dropdown", options: ["Idea", "Pre-seed", "Seed", "Series A+"] }],
  },
  {
    key: "book_club",
    label: "Book Club",
    icon: "BookMarked",
    tagline: "Reading logs, discussion and meetups",
    description: "For book clubs and reading communities discussing what they're reading.",
    defaultSpaces: [
      { name: "Discussion", description: "General conversation." },
      { name: "Current Read", description: "This cycle's book and schedule." },
      { name: "Book Library", description: "Past reads and notes." },
      { name: "Vote on Next Book", description: "Pick what the club reads next." },
    ],
    defaultProfileFields: [{ label: "Favorite Genres", field_type: "text" }],
  },
  {
    key: "custom",
    label: "Custom",
    icon: "Sparkles",
    tagline: "Start blank and build it your way",
    description: "No preset spaces — pick exactly what your community needs afterward.",
    defaultSpaces: [{ name: "Discussion", description: "General conversation to start the community off." }],
    defaultProfileFields: [],
  },
];

export function getCommunityTemplate(key: string): CommunityTemplate | undefined {
  return COMMUNITY_TEMPLATES.find((t) => t.key === key);
}

// ---------------------------------------------------------------------------
// AI Setup: deterministic today (no external API key needed), but shaped as a
// single pure function so a real LLM call can replace the body later without
// touching the wizard UI that calls it.
// ---------------------------------------------------------------------------

export interface SetupRecommendation {
  spaces: TemplateSpace[];
  profileFields: TemplateProfileField[];
  rationale: string[];
}

export const TRANSFORMATION_GOAL_PRESETS = [
  "Grow Food",
  "Lose Weight",
  "Build a Business",
  "Heal",
  "Become Better Parents",
  "Learn Photography",
  "Get Fit",
  "Learn Coding",
] as const;

interface GoalOverlay {
  match: RegExp;
  templateHint?: string;
  extraSpaces?: TemplateSpace[];
  extraProfileFields?: TemplateProfileField[];
}

const GOAL_OVERLAYS: GoalOverlay[] = [
  { match: /grow food|garden|homestead/i, templateHint: "farming", extraSpaces: [{ name: "Seasonal Calendar", description: "Planting and harvest windows." }] },
  { match: /lose weight|weight loss|shed pounds/i, templateHint: "fitness", extraSpaces: [{ name: "Weigh-Ins", description: "Weekly weigh-in check-ins." }] },
  { match: /build a business|start a business|entrepreneur/i, templateHint: "business", extraSpaces: [{ name: "First Customers", description: "Track outreach and early wins." }] },
  { match: /heal|recovery|therapy|grief/i, templateHint: "wellness", extraSpaces: [{ name: "Support Circle", description: "A safe, small group to check in with." }] },
  { match: /better parent|parenting/i, templateHint: "wellness", extraSpaces: [{ name: "Parenting Discussion", description: "Ask questions and share what's working." }] },
  { match: /photograph|photo/i, templateHint: "photography" },
  { match: /get fit|fitness|strength|muscle/i, templateHint: "fitness" },
  {
    match: /learn cod(e|ing)|programming|developer|software/i,
    templateHint: "learning",
    extraSpaces: [
      { name: "Pair Programming", description: "Find a partner to build with." },
      { name: "Code Review", description: "Get feedback on your code." },
    ],
  },
];

function dedupeByName<T extends { name: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((item) => (seen.has(item.name) ? false : (seen.add(item.name), true)));
}

export function recommendSetup(templateKey: string, transformationGoal: string): SetupRecommendation {
  const overlay = GOAL_OVERLAYS.find((o) => o.match.test(transformationGoal));
  const effectiveKey = templateKey === "custom" && overlay?.templateHint ? overlay.templateHint : templateKey;
  const template = getCommunityTemplate(effectiveKey) ?? getCommunityTemplate("custom")!;

  const rationale = [`Started from the ${template.label} template's default spaces.`];
  if (overlay) {
    rationale.push(`Adjusted for the goal "${transformationGoal}".`);
  } else if (transformationGoal.trim()) {
    rationale.push(`No exact match for "${transformationGoal}" — kept the ${template.label} defaults, which cover most of it.`);
  }

  return {
    spaces: dedupeByName([...template.defaultSpaces, ...(overlay?.extraSpaces ?? [])]),
    profileFields: [...template.defaultProfileFields, ...(overlay?.extraProfileFields ?? [])],
    rationale,
  };
}
