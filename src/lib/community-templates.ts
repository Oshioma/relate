import type { ProfileFieldType, SpaceType } from "@/types/database";

// Curated content behind the Community Builder wizard. "Profile fields" here
// means community_profile_fields — custom, community-scoped attributes.
// Structured member data that already has its own dedicated tables (skills,
// interests, help requests, location) is intentionally NOT duplicated here.

export interface TemplateSpace {
  name: string;
  description: string;
  // Defaults to 'discussion' when omitted — every non-place template relies
  // on that default rather than setting this explicitly.
  space_type?: SpaceType;
  // Seeds the space as a one-way / broadcast space (only staff can post).
  // Defaults to false when omitted. Used by the Artist Fan Club template's
  // Announcements space.
  staff_post_only?: boolean;
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

// Shared between the Musician / Artist template's default setup and the
// "around one artist" (fan) mode in ARTIST_MODES below, so the fan starter set
// is defined exactly once.
const ARTIST_FAN_SPACES: TemplateSpace[] = [
  { name: "Announcements", description: "News, drops and tour dates — straight from the artist.", staff_post_only: true },
  { name: "The Group Chat", description: "Where fans hang out, react and connect." },
  { name: "Live", description: "Livestreamed sets, listening parties and AMAs.", space_type: "live" },
  { name: "The Vault", description: "Exclusive extras — demos, stems, wallpapers and presale codes.", space_type: "resources" },
  { name: "Ask Me Anything", description: "Fans ask, you answer.", space_type: "qa" },
];
// The Activity template's starter set. Everything here is deliberately built
// around the moment of going out together: the Meetups space is first because
// it is the reason the community exists, and every other space feeds it —
// routes to walk, crews to walk with, partners at your pace, gear to borrow.
// Per-activity extras are layered on top by ACTIVITY_KINDS below.
const ACTIVITY_SPACES: TemplateSpace[] = [
  { name: "Happening Now", description: "Post what you're doing and when — others tap \u201cI'm in\u201d and meet you there.", space_type: "meetups" },
  { name: "Discussion", description: "General conversation for everyone." },
  { name: "Routes & Spots", description: "The routes, trails and spots worth knowing — written up by members.", space_type: "guides" },
  { name: "Meet-Up Map", description: "Meeting points, trailheads, parking and the spots themselves.", space_type: "map" },
  { name: "Crews", description: "Regular groups by pace, level and part of town.", space_type: "clubs" },
  { name: "Find a Partner", description: "Members who go at your pace, near you, when you're free.", space_type: "directory" },
  { name: "Trip Reports", description: "Photos and write-ups from the ones you've done.", space_type: "gallery" },
  { name: "Skills & Safety", description: "Technique, kit lists, first aid and what to do when it goes wrong.", space_type: "resources" },
  { name: "Gear Exchange", description: "Buy, sell, lend and borrow kit.", space_type: "marketplace" },
  { name: "Challenges", description: "Time-boxed goals members take on together.", space_type: "challenges" },
];
const ACTIVITY_FIELDS: TemplateProfileField[] = [
  { label: "Experience Level", field_type: "dropdown", options: ["Beginner", "Improver", "Confident", "Advanced"] },
  { label: "Usual Pace", field_type: "text" },
  { label: "When I'm Usually Free", field_type: "text" },
];

// The School template's starter set. A school community is the adults around a
// school talking to each other — parents, teachers, staff and governors — with
// the teaching library at its centre. Students are deliberately NOT members:
// nothing here assumes a child has an account, and the Lessons space is written
// for the adult who will teach or print it.
//
// Per-school-kind extras are layered on top by SCHOOL_KINDS below.
const SCHOOL_SPACES: TemplateSpace[] = [
  { name: "Announcements", description: "Term dates, closures and news \u2014 straight from the school.", staff_post_only: true },
  { name: "Lessons", description: "The teaching library: paste source material, get an age-appropriate lesson to teach or print.", space_type: "lessons" },
  { name: "Classes & Year Groups", description: "A space per class or year group, for the people in it.", space_type: "clubs" },
  { name: "Homework Help", description: "Ask about a piece of work and get an answer from someone who knows.", space_type: "qa" },
  { name: "Parent Chat", description: "General conversation between parents and guardians." },
  { name: "Staff Room", description: "Teachers and staff only \u2014 set this space to Private in Admin once you have invited them.", staff_post_only: true },
  { name: "Policies & Reading Lists", description: "Uniform lists, term dates, policies and recommended reading.", space_type: "resources" },
  { name: "School Life", description: "Photos from trips, concerts, sports day and the everyday.", space_type: "gallery" },
  { name: "Reading Challenge", description: "Time-boxed challenges children take on together.", space_type: "challenges" },
  { name: "PTA & Volunteering", description: "Fairs, fundraising and the jobs that need a pair of hands.", space_type: "volunteer_hub" },
];

const SCHOOL_FIELDS: TemplateProfileField[] = [
  { label: "I am a\u2026", field_type: "dropdown", options: ["Parent or Guardian", "Teacher", "Support Staff", "Governor", "Office"] },
  { label: "Class or Year Group", field_type: "text" },
  { label: "Subjects I Teach", field_type: "text" },
];

const ARTIST_FAN_FIELDS: TemplateProfileField[] = [
  { label: "Fan Since", field_type: "text" },
  { label: "Favorite Track or Album", field_type: "text" },
];

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
    // Key kept as "fanclub" for continuity (it's a stable identifier stored on
    // communities.template_key); the label is now the broader "Musician /
    // Artist", which offers two modes at setup — see ARTIST_MODES. The default
    // spaces below are the fan-community setup, used when no mode is picked.
    key: "fanclub",
    label: "Musician / Artist",
    icon: "Disc3",
    tagline: "A fan community, or a collective of artists",
    description:
      "For musicians, DJs and artists. Build a fan community around one artist — you broadcast, fans belong and unlock exclusives — or a collective where many artists share work, collaborate and give feedback. You choose which when you set up.",
    defaultSpaces: ARTIST_FAN_SPACES,
    defaultProfileFields: ARTIST_FAN_FIELDS,
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
    key: "school",
    label: "School",
    icon: "School",
    tagline: "One school, and the adults around it",
    description:
      "For a school and its community \u2014 parents, teachers, staff and governors in one place. Announcements, class groups, homework help and a PTA, built around a teaching library: paste any source material and get a lesson written for the right age, ready to teach or print. Built for adults; children never need an account.",
    defaultSpaces: SCHOOL_SPACES,
    defaultProfileFields: SCHOOL_FIELDS,
  },
  {
    key: "place",
    label: "Place-Based Community",
    icon: "MapPin",
    tagline: "The digital operating system for a place",
    description:
      "For any place — an island, city, town, village, neighbourhood, campus or region. Residents, businesses, visitors, organisations and volunteers share one ecosystem: a living map, marketplace, business directory, events, guides and more, tailored to what kind of place this is.",
    defaultSpaces: [
      { name: "Chat", description: "General conversation for the whole community." },
      { name: "Business Directory", description: "Local businesses with profiles, hours and reviews.", space_type: "business_directory" },
      { name: "Explore Map", description: "An interactive map of everything in this place.", space_type: "map" },
      { name: "Marketplace", description: "Buy, sell, give away and find locally.", space_type: "marketplace" },
      { name: "Community Guides", description: "Best coffee, hidden gems, first week here — written by members.", space_type: "guides" },
      { name: "Clubs & Groups", description: "Subcommunities around shared interests, from running to book club.", space_type: "clubs" },
      { name: "Volunteer Hub", description: "Projects, cleanups and causes members can help with.", space_type: "volunteer_hub" },
      { name: "Local Recommendations", description: "Restaurants, services and professionals members vouch for.", space_type: "recommendations" },
    ],
    defaultProfileFields: [
      { label: "Neighbourhood / Area", field_type: "text" },
      { label: "I am a…", field_type: "dropdown", options: ["Resident", "Visitor", "Business Owner", "Organisation", "Volunteer"] },
    ],
  },
  {
    key: "activity",
    label: "Activity",
    icon: "Footprints",
    tagline: "Get out and do it together, today",
    description:
      "For a community built around one activity — hiking, running, cycling, climbing, padel, surfing. The centre of gravity is Happening Now: a member posts \u201cwalking the ridge at 6, moderate pace, meeting at the gate\u201d, everyone who can make it taps \u201cI\u2019m in\u201d, and they go. Routes, crews, partners and gear sit around it.",
    defaultSpaces: ACTIVITY_SPACES,
    defaultProfileFields: ACTIVITY_FIELDS,
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
      { name: "Crop Guides", description: "Organic, region-aware growing guides — from seed to harvest.", space_type: "crop_guides" },
      { name: "Plant Health Scanner", description: "Upload a plant photo for an AI diagnosis with organic treatment.", space_type: "plant_scanner" },
      { name: "Plant ID", description: "Upload a photo to identify a plant.", space_type: "plant_id" },
      { name: "My Crops", description: "Your own crops, synced from the shamba.online farm app.", space_type: "my_crops" },
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

// ---------------------------------------------------------------------------
// Musician / Artist: "one artist, or a community of artists?"
//
// The Musician / Artist template (key "fanclub") offers two mutually-exclusive
// modes, chosen in the wizard the same way a Place community chooses its kind
// of place. Unlike place location types — which layer extras onto a shared base
// — the two artist modes are complete, separate starter sets: a fan community
// (broadcast + belonging, around one artist) and an artist collective (a peer
// network where many artists share work) have almost nothing in common
// structurally, so each replaces the starter box wholesale.
// ---------------------------------------------------------------------------

export interface ArtistMode {
  key: string;
  label: string;
  tagline: string;
  description: string;
  spaces: TemplateSpace[];
  profileFields: TemplateProfileField[];
}

export const ARTIST_MODES: ArtistMode[] = [
  {
    key: "fan",
    label: "Around one artist",
    tagline: "A fan community",
    description: "Built around a single musician, DJ or artist. You broadcast; fans belong, hang out and unlock exclusives.",
    spaces: ARTIST_FAN_SPACES,
    profileFields: ARTIST_FAN_FIELDS,
  },
  {
    key: "collective",
    label: "A community of artists",
    tagline: "An artist collective",
    description: "A peer network where many artists share work, collaborate, swap feedback and find gigs.",
    spaces: [
      { name: "Discussion", description: "General conversation for the whole collective." },
      { name: "Tracks & Mixes", description: "Share your latest tracks, mixes and cover art.", space_type: "gallery" },
      { name: "Feedback & Critique", description: "Post work and get specific feedback from peers.", space_type: "qa" },
      { name: "Collab Board", description: "Find collaborators — vocalists, producers, engineers.", space_type: "directory" },
      { name: "Beat Battles", description: "Time-boxed production challenges and remix contests.", space_type: "challenges" },
      { name: "Live", description: "Livestreamed sets, listening parties and workshops.", space_type: "live" },
      { name: "The Crate", description: "Shared sample packs, presets, stems and gear guides.", space_type: "resources" },
      { name: "Gigs & Opportunities", description: "Bookings, collab calls and open slots.", space_type: "jobs" },
    ],
    profileFields: [
      { label: "Role", field_type: "dropdown", options: ["DJ", "Producer", "Vocalist", "Instrumentalist", "Visual Artist", "Other"] },
      { label: "Genre", field_type: "text" },
      { label: "Setup / DAW", field_type: "text" },
    ],
  },
];

export function getArtistMode(key: string): ArtistMode | undefined {
  return ARTIST_MODES.find((m) => m.key === key);
}

// The Musician / Artist counterpart to recommendPlaceSetup: each mode is a full,
// standalone starter set (not a base + overlay), so this just returns the chosen
// mode's spaces and fields. Defaults to the fan mode when the key is unknown.
export function recommendArtistSetup(modeKey: string): SetupRecommendation {
  const mode = getArtistMode(modeKey) ?? ARTIST_MODES[0];
  return {
    spaces: mode.spaces,
    profileFields: mode.profileFields,
    rationale: [`Set up as ${mode.tagline.toLowerCase()} (${mode.label.toLowerCase()}).`, mode.description],
  };
}

// ---------------------------------------------------------------------------
// Place-Based Community: "what kind of place is this?"
//
// A place's needs scale with what it is — a village needs a notice board and
// neighbour help, a city needs districts and traffic, an island needs tides
// and ferry schedules. Each location type below contributes the spaces that
// are actually worth a container of their own, plus a documented set of map
// layers: the Explore Map doesn't exist as a built feature yet, but every
// place community should already know which layers it'll want enabled the
// day it does. This is deliberately a flat, code-only list (not a DB table)
// so adding a new kind of place is a one-entry change, same reasoning as
// GOAL_OVERLAYS above.
// ---------------------------------------------------------------------------

export interface PlaceLocationType {
  key: string;
  label: string;
  description: string;
  mapLayers: string[];
  extraSpaces: TemplateSpace[];
  extraProfileFields?: TemplateProfileField[];
}

export const PLACE_LOCATION_TYPES: PlaceLocationType[] = [
  {
    key: "island",
    label: "Island",
    description: "Zanzibar, Bali, a Greek island — surrounded by water, tide- and ferry-dependent.",
    mapLayers: ["Beaches", "Marine Life", "Boat & Ferry Schedules", "Weather & Tides", "Dive Sites", "Fishing Spots", "Surf Breaks", "Marine Conservation Areas"],
    extraSpaces: [
      { name: "Accommodation", description: "Hotels, guesthouses and rentals — short stays and long lets.", space_type: "accommodation" },
      { name: "Boat & Ferry Schedules", description: "Departure times, routes and disruptions.", space_type: "resources" },
      { name: "Tides & Weather", description: "Daily tide charts and forecasts.", space_type: "resources" },
    ],
  },
  {
    key: "coastal",
    label: "Coastal Area",
    description: "A seaside town, fishing village or stretch of coast — life runs on the water.",
    mapLayers: ["Beaches", "Harbours & Marinas", "Weather & Tides", "Surf Breaks", "Fishing Spots", "Coastal Walks", "Marine Conservation Areas"],
    extraSpaces: [
      { name: "Accommodation", description: "Places to stay along the coast, from a few nights to a few months.", space_type: "accommodation" },
      { name: "Tides & Weather", description: "Daily tide charts and forecasts.", space_type: "resources" },
      { name: "Harbour & Boating", description: "Moorings, launches and conditions on the water." },
    ],
  },
  {
    key: "city",
    label: "City",
    description: "Lisbon, New York — dense, multi-district, public-transport-first.",
    mapLayers: ["Districts", "Public Transport", "Nightlife", "Neighbourhoods", "Public Services", "Traffic & Roadworks"],
    extraSpaces: [
      { name: "Accommodation", description: "Rooms, flats and hotels — short stays and long lets.", space_type: "accommodation" },
      { name: "Neighbourhoods", description: "Conversations organised by district." },
      { name: "Jobs Board", description: "Openings from employers across the city.", space_type: "jobs" },
      { name: "Transport & Traffic", description: "Live disruptions, routes and roadworks.", space_type: "resources" },
    ],
  },
  {
    key: "town",
    label: "Town",
    description: "A market town — smaller than a city, with its own centre and services.",
    mapLayers: ["Shops", "Markets", "Parking", "Schools", "Public Transport"],
    extraSpaces: [
      { name: "Accommodation", description: "Places to stay in and around town, short or long term.", space_type: "accommodation" },
      { name: "Jobs Board", description: "Local job openings and hiring.", space_type: "jobs" },
      { name: "Markets", description: "Market days, stalls and traders." },
    ],
  },
  {
    key: "village",
    label: "Village",
    description: "A small, tight-knit settlement where everyone knows everyone.",
    mapLayers: ["Village Hall", "Community Garden", "Local Trades", "Footpaths", "Bus Stops"],
    extraSpaces: [
      { name: "Accommodation", description: "Rooms and rentals in the village, short or long term.", space_type: "accommodation" },
      { name: "Notice Board", description: "Official parish and village notices." },
      { name: "Neighbour Help", description: "Ask for, or offer, a hand nearby.", space_type: "volunteer_hub" },
      { name: "Local Trades", description: "Trusted local tradespeople and services.", space_type: "business_directory" },
    ],
  },
  {
    key: "neighbourhood",
    label: "Neighbourhood",
    description: "A district or block within a larger city, run at street level.",
    mapLayers: ["Streets", "Parks", "Schools", "Local Businesses"],
    extraSpaces: [
      { name: "Neighbour Help", description: "Borrow, lend and lend a hand nearby.", space_type: "volunteer_hub" },
      { name: "Street Watch", description: "Safety updates and local alerts." },
    ],
  },
  {
    key: "region",
    label: "Region",
    description: "A county, province or multi-town area with shared identity.",
    mapLayers: ["Towns & Villages", "Attractions", "Regional Transport", "Protected Areas"],
    extraSpaces: [
      { name: "Accommodation", description: "Places to stay across the region, short stays and long lets.", space_type: "accommodation" },
      { name: "Towns & Villages", description: "Explore every settlement in the region.", space_type: "guides" },
      { name: "Regional Transport", description: "Trains, buses and routes across the region.", space_type: "resources" },
    ],
  },
  {
    key: "campus",
    label: "Campus",
    description: "A university or college campus — students, faculty and campus life.",
    mapLayers: ["Lecture Halls", "Dorms", "Dining Halls", "Libraries", "Sports Facilities", "Study Spots"],
    extraSpaces: [
      { name: "Class & Study Groups", description: "Find classmates and study partners.", space_type: "clubs" },
      { name: "Campus Jobs & Internships", description: "On-campus jobs and internships.", space_type: "jobs" },
      { name: "Housing & Roommates", description: "Find a room or a roommate.", space_type: "accommodation" },
    ],
  },
  {
    key: "housing_estate",
    label: "Housing Estate",
    description: "A managed residential development with shared amenities.",
    mapLayers: ["Amenities", "Play Areas", "Parking", "Bin Collection Points"],
    extraSpaces: [
      { name: "Estate Notices", description: "Management and resident association updates." },
      { name: "Neighbour Help", description: "Ask for, or offer, a hand nearby.", space_type: "volunteer_hub" },
    ],
  },
  {
    key: "country",
    label: "Country",
    description: "A whole nation — the broadest scale a place community can operate at.",
    mapLayers: ["Regions", "Cities", "National Parks", "Transport Networks", "Emergency Services"],
    extraSpaces: [
      { name: "Regions & Cities", description: "Explore every region and city.", space_type: "guides" },
      { name: "National News", description: "Country-wide announcements and news." },
    ],
  },
  {
    key: "tourist_destination",
    label: "Tourist Destination",
    description: "A place defined by visitors as much as residents.",
    mapLayers: ["Attractions", "Tours", "Accommodation", "Restaurants", "Transport"],
    extraSpaces: [
      { name: "Accommodation", description: "Hotels, guesthouses, hostels and rentals.", space_type: "accommodation" },
      { name: "Tours & Experiences", description: "Guided tours and bookable experiences.", space_type: "marketplace" },
    ],
    extraProfileFields: [{ label: "Visiting or Living Here?", field_type: "dropdown", options: ["Visiting", "Living Here"] }],
  },
  {
    key: "business_district",
    label: "Business District",
    description: "An office/commercial district, active on weekdays.",
    mapLayers: ["Offices", "Coworking", "Restaurants", "Parking", "Transport Links"],
    extraSpaces: [
      { name: "Business Networking", description: "Connect with other businesses nearby.", space_type: "clubs" },
      { name: "Jobs Board", description: "Openings from businesses in the district.", space_type: "jobs" },
    ],
  },
  {
    key: "retirement_community",
    label: "Retirement Community",
    description: "A community organised around later-life living and care.",
    mapLayers: ["Amenities", "Care Services", "Activity Rooms", "Transport & Shuttles"],
    extraSpaces: [
      { name: "Activities & Clubs", description: "Classes, hobbies and social clubs.", space_type: "clubs" },
      { name: "Care & Support", description: "Health, care and support services.", space_type: "resources" },
    ],
  },
];

export function getPlaceLocationType(key: string): PlaceLocationType | undefined {
  return PLACE_LOCATION_TYPES.find((t) => t.key === key);
}

// Location types where daily life depends on the sea. These communities get
// live tide times alongside their weather; every other place community gets
// weather alone (see src/lib/weather.ts).
const TIDAL_LOCATION_TYPES = ["island", "coastal"];

export function isTidalLocationType(key: string | null | undefined): boolean {
  return !!key && TIDAL_LOCATION_TYPES.includes(key);
}

export interface PlaceSetupRecommendation extends SetupRecommendation {
  mapLayers: string[];
}

// baseSpaces lets the caller substitute the super-admin-configured place
// default spaces (from the template_default_spaces table) for the hard-coded
// template defaults; the per-location-type extras are layered on top either
// way. Omit it to use the code defaults.
export function recommendPlaceSetup(locationTypeKey: string, baseSpaces?: TemplateSpace[]): PlaceSetupRecommendation {
  const template = getCommunityTemplate("place")!;
  const base = baseSpaces ?? template.defaultSpaces;
  const locationType = getPlaceLocationType(locationTypeKey);

  const rationale = [`Started from the Place-Based Community template's default spaces.`];
  if (locationType) {
    rationale.push(`Added what a ${locationType.label.toLowerCase()} typically needs.`);
    rationale.push(`Suggested Explore Map layers: ${locationType.mapLayers.join(", ")}.`);
  }

  return {
    spaces: dedupeByName([...base, ...(locationType?.extraSpaces ?? [])]),
    profileFields: [...template.defaultProfileFields, ...(locationType?.extraProfileFields ?? [])],
    rationale,
    mapLayers: locationType?.mapLayers ?? [],
  };
}

// ---------------------------------------------------------------------------
// Activity: "which activity is this community built around?"
//
// Same shape as PLACE_LOCATION_TYPES — a shared base (ACTIVITY_SPACES) plus
// per-kind extras — rather than the artist modes' wholesale replacement,
// because every activity community wants the same core: meetups, routes,
// crews, partners, gear. What differs is the fringe: a hiking community needs
// trail conditions and daylight, a cycling one needs mechanics and roadside
// help, a snow one needs the avalanche bulletin. Map layers are documented per
// kind the same way, and seeded as the Meet-Up Map's togglable layers at setup.
// Flat and code-only, so adding an activity stays a one-entry change.
// ---------------------------------------------------------------------------

export interface ActivityKind {
  key: string;
  label: string;
  description: string;
  // The word the meetup composer suggests for a new meetup's activity, e.g.
  // "Hiking". Singular and human, not the key.
  activityLabel: string;
  mapLayers: string[];
  extraSpaces: TemplateSpace[];
  extraProfileFields?: TemplateProfileField[];
}

export const ACTIVITY_KINDS: ActivityKind[] = [
  {
    key: "hiking",
    label: "Hiking & Walking",
    description: "Day hikes, hill walks and rambles — the classic “who's free to walk this evening?”.",
    activityLabel: "Hiking",
    mapLayers: ["Trailheads", "Trails & Routes", "Summits", "Water Points", "Huts & Shelters", "Parking", "Viewpoints"],
    extraSpaces: [
      { name: "Trail Conditions", description: "What it's like underfoot right now — mud, closures, river crossings, snow line." },
      { name: "Weather & Daylight", description: "Forecasts, sunset times and when to turn back.", space_type: "resources" },
    ],
    extraProfileFields: [{ label: "Usual Distance", field_type: "dropdown", options: ["Under 5km", "5–10km", "10–20km", "20km+"] }],
  },
  {
    key: "running",
    label: "Running",
    description: "Road, trail and track — from easy social miles to race prep.",
    activityLabel: "Running",
    mapLayers: ["Routes", "Tracks", "Parkruns", "Water Fountains", "Toilets", "Parking"],
    extraSpaces: [
      { name: "Race Calendar", description: "Local races, parkruns and time trials, with entry links.", space_type: "guides" },
      { name: "Session Plans", description: "Intervals, hills, long runs and training blocks to follow.", space_type: "resources" },
    ],
    extraProfileFields: [{ label: "Typical Pace (min/km)", field_type: "text" }],
  },
  {
    key: "cycling",
    label: "Cycling",
    description: "Road, gravel and mountain biking — group rides and solo routes.",
    activityLabel: "Riding",
    mapLayers: ["Routes", "Climbs", "Bike Shops", "Repair Stations", "Cafés", "Traffic Blackspots"],
    extraSpaces: [
      { name: "Bike Shops & Mechanics", description: "Repairs, fittings and spares nearby.", space_type: "business_directory" },
      { name: "Roadside Help", description: "Puncture, snapped chain, no lights? Ask whoever's closest.", space_type: "volunteer_hub" },
    ],
    extraProfileFields: [{ label: "Bike Type", field_type: "dropdown", options: ["Road", "Gravel", "Mountain", "Hybrid", "E-bike"] }],
  },
  {
    key: "climbing",
    label: "Climbing & Bouldering",
    description: "Indoor walls, crags and boulders — where a partner isn't optional.",
    activityLabel: "Climbing",
    mapLayers: ["Crags", "Boulders", "Indoor Walls", "Approach Paths", "Descents", "Parking"],
    extraSpaces: [
      { name: "Gyms & Guides", description: "Indoor walls, instructors and guiding services.", space_type: "business_directory" },
      { name: "Beta & Grades", description: "Ask about a move, a grade or an approach.", space_type: "qa" },
    ],
    extraProfileFields: [
      { label: "Grade", field_type: "text" },
      { label: "Lead or Second", field_type: "dropdown", options: ["Lead", "Second", "Either", "Bouldering only"] },
    ],
  },
  {
    key: "water",
    label: "Swimming, Surf & Paddle",
    description: "Open water, surf, kayak and paddleboard — conditions decide everything.",
    activityLabel: "Swimming",
    mapLayers: ["Beaches", "Entry Points", "Surf Breaks", "Slipways", "Tide Stations", "Lifeguard Posts"],
    extraSpaces: [
      { name: "Tides & Conditions", description: "Tide charts, swell, wind and water temperature.", space_type: "resources" },
      { name: "Clubs & Lifeguards", description: "Local clubs, schools and who's watching the water.", space_type: "business_directory" },
    ],
    extraProfileFields: [{ label: "Comfortable In", field_type: "dropdown", options: ["Pool only", "Sheltered water", "Open water", "Big surf"] }],
  },
  {
    key: "racquet",
    label: "Padel, Tennis & Racquet",
    description: "Padel, tennis, squash, pickleball — where you need exactly three more people.",
    activityLabel: "Playing",
    mapLayers: ["Courts", "Clubs", "Booking Desks", "Parking"],
    extraSpaces: [
      { name: "Courts & Clubs", description: "Where to play, what it costs and how to book.", space_type: "business_directory" },
      { name: "Club Ladder", description: "Ongoing ladder and box leagues members climb.", space_type: "challenges" },
    ],
    extraProfileFields: [{ label: "Level / Rating", field_type: "text" }],
  },
  {
    key: "team",
    label: "Football & Team Sports",
    description: "Pick-up football, basketball, netball — a game happens when enough people say yes.",
    activityLabel: "Pick-up game",
    mapLayers: ["Pitches", "Courts", "Astro", "Changing Rooms", "Parking"],
    extraSpaces: [
      { name: "Pitches & Bookings", description: "Where to play and who to book it through.", space_type: "business_directory" },
      { name: "League & Fixtures", description: "Standing leagues, fixtures and results.", space_type: "challenges" },
    ],
    extraProfileFields: [{ label: "Position", field_type: "text" }],
  },
  {
    key: "yoga",
    label: "Yoga & Movement",
    description: "Yoga, pilates, mobility and breathwork — in a studio, a park or on a screen.",
    activityLabel: "Practice",
    mapLayers: ["Studios", "Parks", "Quiet Spots"],
    extraSpaces: [
      { name: "Classes", description: "Streamed and recorded sessions members join live.", space_type: "live" },
      { name: "Studios & Teachers", description: "Local studios, teachers and drop-in times.", space_type: "business_directory" },
    ],
    extraProfileFields: [{ label: "Style", field_type: "text" }],
  },
  {
    key: "snow",
    label: "Ski & Snowboard",
    description: "Resort days, touring and backcountry — planned around the snow report.",
    activityLabel: "Skiing",
    mapLayers: ["Resorts", "Lifts", "Runs", "Backcountry Routes", "Avalanche Zones", "Warming Huts"],
    extraSpaces: [
      { name: "Snow Report", description: "Conditions, lifts open and the avalanche bulletin.", space_type: "resources" },
      { name: "Rentals & Passes", description: "Hire shops, lessons and lift passes.", space_type: "business_directory" },
    ],
    extraProfileFields: [{ label: "Ski or Board", field_type: "dropdown", options: ["Ski", "Snowboard", "Both", "Touring"] }],
  },
  {
    key: "dance",
    label: "Dance",
    description: "Salsa, bachata, swing, street — practice partners and socials.",
    activityLabel: "Dancing",
    mapLayers: ["Studios", "Social Venues", "Practice Spaces"],
    extraSpaces: [
      { name: "Studios & Socials", description: "Classes, socials and the nights worth going to.", space_type: "business_directory" },
      { name: "Moves Library", description: "Clips of moves and combinations to work on.", space_type: "gallery" },
    ],
    extraProfileFields: [{ label: "Lead or Follow", field_type: "dropdown", options: ["Lead", "Follow", "Both"] }],
  },
  {
    key: "nature",
    label: "Birding & Nature Walks",
    description: "Birdwatching, foraging and slow walks — driven by what's about right now.",
    activityLabel: "Walk",
    mapLayers: ["Hides", "Reserves", "Wetlands", "Feeding Stations", "Viewpoints"],
    extraSpaces: [
      { name: "Sightings Log", description: "What you saw, where and when.", space_type: "journal" },
      { name: "Species Guide", description: "What lives here, and how to tell it apart.", space_type: "guides" },
    ],
    extraProfileFields: [{ label: "Main Interest", field_type: "text" }],
  },
];

export function getActivityKind(key: string): ActivityKind | undefined {
  return ACTIVITY_KINDS.find((k) => k.key === key);
}

// The activity word a community's meetup composer offers as a preset, e.g.
// "Hiking" for a hiking community. Null when the community isn't an Activity
// community (or predates the activity_kind column) — the composer then just
// asks for free text.
export function activityLabelForKind(key: string | null | undefined): string | null {
  return (key && getActivityKind(key)?.activityLabel) || null;
}

export interface ActivitySetupRecommendation extends SetupRecommendation {
  mapLayers: string[];
}

// The Activity counterpart to recommendPlaceSetup: the shared base plus the
// chosen activity's extras. baseSpaces lets the caller substitute the
// super-admin-configured defaults for the code ones, same as place.
export function recommendActivitySetup(activityKindKey: string, baseSpaces?: TemplateSpace[]): ActivitySetupRecommendation {
  const template = getCommunityTemplate("activity")!;
  const base = baseSpaces ?? template.defaultSpaces;
  const kind = getActivityKind(activityKindKey);

  const rationale = ["Started from the Activity template's default spaces, with Happening Now at the top."];
  if (kind) {
    rationale.push(`Added what a ${kind.label.toLowerCase()} community typically needs.`);
    rationale.push(`Suggested Meet-Up Map layers: ${kind.mapLayers.join(", ")}.`);
  }

  return {
    spaces: dedupeByName([...base, ...(kind?.extraSpaces ?? [])]),
    profileFields: [...template.defaultProfileFields, ...(kind?.extraProfileFields ?? [])],
    rationale,
    mapLayers: kind?.mapLayers ?? [],
  };
}

// ---------------------------------------------------------------------------
// School: "what kind of school is this?"
//
// Same shape as PLACE_LOCATION_TYPES and ACTIVITY_KINDS — a shared base
// (SCHOOL_SPACES) plus per-kind extras — because every school community wants
// the same core: announcements, class groups, homework help, a lesson library
// and a PTA. What differs is the edges: a nursery needs a daily diary, a
// secondary school needs revision and careers, a homeschool group needs a
// curriculum plan and a swap shelf. Flat and code-only, so adding a kind stays
// a one-entry change.
//
// No map layers here, unlike place and activity: a school is one address, not
// a territory to explore.
// ---------------------------------------------------------------------------

export interface SchoolKind {
  key: string;
  label: string;
  description: string;
  // The reading age the Lessons space defaults to for this kind of school.
  // Must be an AGE_BANDS key in src/lib/school/lesson-types.ts.
  defaultAgeBand: string;
  extraSpaces: TemplateSpace[];
  extraProfileFields?: TemplateProfileField[];
}

export const SCHOOL_KINDS: SchoolKind[] = [
  {
    key: "primary",
    label: "Primary School",
    description: "Ages 4–11 — one class, one teacher, parents closely involved.",
    defaultAgeBand: "8-10",
    extraSpaces: [
      { name: "Show & Tell", description: "What the children made, wrote and brought in this week.", space_type: "gallery" },
      { name: "Lost Property", description: "Missing jumpers, water bottles and lunch boxes." },
    ],
  },
  {
    key: "secondary",
    label: "Secondary School",
    description: "Ages 11–18 — subject teachers, exams and what comes next.",
    defaultAgeBand: "11-13",
    extraSpaces: [
      { name: "Exams & Revision", description: "Timetables, past papers and revision guides.", space_type: "resources" },
      { name: "Careers & Next Steps", description: "Work experience, apprenticeships, college and university.", space_type: "jobs" },
      { name: "Clubs & Societies", description: "Everything that happens after the bell.", space_type: "clubs" },
    ],
    extraProfileFields: [{ label: "Exam Year", field_type: "text" }],
  },
  {
    key: "homeschool",
    label: "Homeschool",
    description: "A family, or a group of families, teaching at home.",
    defaultAgeBand: "8-10",
    extraSpaces: [
      { name: "Curriculum Planning", description: "What we're covering this term, and what worked last." },
      { name: "Field Trips", description: "Post a trip, others tap “I'm in” and come along.", space_type: "meetups" },
      { name: "Swap Shelf", description: "Books, kit and materials to pass on when you're done.", space_type: "marketplace" },
    ],
    extraProfileFields: [{ label: "Children's Ages", field_type: "text" }],
  },
  {
    key: "coop",
    label: "Co-op or Pod",
    description: "Several families sharing the teaching between them.",
    defaultAgeBand: "8-10",
    extraSpaces: [
      { name: "Teaching Rota", description: "Who is teaching what, and when." },
      { name: "Shared Costs", description: "Materials, venue hire and who has paid what." },
      { name: "Field Trips", description: "Post a trip, others tap “I'm in” and come along.", space_type: "meetups" },
    ],
    extraProfileFields: [{ label: "What I Can Teach", field_type: "text" }],
  },
  {
    key: "nursery",
    label: "Nursery or Early Years",
    description: "Ages 0–5 — daily rhythms, and parents who want to know how the day went.",
    defaultAgeBand: "5-7",
    extraSpaces: [
      { name: "Daily Diary", description: "How the day went — logged for each child.", space_type: "journal" },
      { name: "Naps, Meals & Routines", description: "Timings, menus and what to pack.", space_type: "resources" },
    ],
  },
  {
    key: "tutoring",
    label: "Tutoring or Supplementary",
    description: "After-school, weekend or supplementary teaching.",
    defaultAgeBand: "8-10",
    extraSpaces: [
      { name: "Courses", description: "Structured programmes students enrol in and work through.", space_type: "course" },
      { name: "Tutors", description: "Who teaches what, and how to reach them.", space_type: "directory" },
    ],
    extraProfileFields: [{ label: "Subjects Needed", field_type: "text" }],
  },
  {
    key: "sen",
    label: "Special Educational Needs",
    description: "A school or group built around additional needs and support.",
    defaultAgeBand: "8-10",
    extraSpaces: [
      { name: "Support Plans", description: "Guidance, templates and what has worked for others.", space_type: "resources" },
      { name: "Therapies & Services", description: "Speech, occupational therapy and local specialists.", space_type: "business_directory" },
    ],
    extraProfileFields: [{ label: "Additional Needs I Support", field_type: "text" }],
  },
];

export function getSchoolKind(key: string): SchoolKind | undefined {
  return SCHOOL_KINDS.find((k) => k.key === key);
}

// The reading age a school's Lessons composer starts on, so a nursery doesn't
// open on a lesson pitched at thirteen-year-olds. Null when the community isn't
// a school (or predates the school_kind column) — the composer then falls back
// to DEFAULT_AGE_BAND.
export function schoolDefaultAgeBand(key: string | null | undefined): string | null {
  return (key && getSchoolKind(key)?.defaultAgeBand) || null;
}

// The School counterpart to recommendPlaceSetup: the shared base plus the
// chosen kind's extras. baseSpaces lets the caller substitute the
// super-admin-configured defaults for the code ones, same as place and activity.
export function recommendSchoolSetup(schoolKindKey: string, baseSpaces?: TemplateSpace[]): SetupRecommendation {
  const template = getCommunityTemplate("school")!;
  const base = baseSpaces ?? template.defaultSpaces;
  const kind = getSchoolKind(schoolKindKey);

  const rationale = ["Started from the School template's default spaces, with the Lessons library near the top."];
  if (kind) {
    rationale.push(`Added what a ${kind.label.toLowerCase()} typically needs.`);
    rationale.push(`Lessons will be written for ${kind.defaultAgeBand.replace("-", "–")} year olds by default — changeable on every lesson.`);
  }

  return {
    spaces: dedupeByName([...base, ...(kind?.extraSpaces ?? [])]),
    profileFields: [...template.defaultProfileFields, ...(kind?.extraProfileFields ?? [])],
    rationale,
  };
}
