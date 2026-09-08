import type { SpaceType, SpaceVisibility } from "@/types/database";

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
  // Who can see the space. Defaults to 'members' when omitted, which is what
  // every space seeded before this used. Set it only where a space is useless
  // unless it starts closed — the School template's Staff Room is private from
  // the moment it exists, because a staff room a parent can read is not one.
  visibility?: SpaceVisibility;
}

export interface CommunityTemplate {
  key: string;
  label: string;
  icon: string; // lucide-react icon name, resolved by TEMPLATE_ICONS in the UI layer
  tagline: string;
  description: string;
  defaultSpaces: TemplateSpace[];
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
  { name: "Live Clinics", description: "Technique, kit and route planning on camera, before anyone drives anywhere.", space_type: "live" },
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
  // Says what the library is for, not what the software does — this line is the
  // page's subtitle, and "paste source material" describes a button on it.
  { name: "Lessons", description: "Real learning for real life. Ideas, activities and inspiration from our community.", space_type: "lessons" },
  { name: "Classes & Year Groups", description: "A space per class or year group, for the people in it.", space_type: "clubs" },
  { name: "Homework Help", description: "Ask about a piece of work and get an answer from someone who knows.", space_type: "qa" },
  { name: "Parent Chat", description: "General conversation between parents and guardians." },
  { name: "Staff Room", description: "Teachers and staff only.", visibility: "private" },
  { name: "Policies & Reading Lists", description: "Uniform lists, term dates, policies and recommended reading.", space_type: "resources" },
  { name: "School Life", description: "Photos from trips, concerts, sports day and the everyday.", space_type: "gallery" },
  { name: "Reading Challenge", description: "Time-boxed challenges children take on together.", space_type: "challenges" },
  { name: "PTA & Volunteering", description: "Fairs, fundraising and the jobs that need a pair of hands.", space_type: "volunteer_hub" },
  { name: "Live Meetings", description: "Parents' evenings, information evenings and governor meetings, for the people who cannot get there.", space_type: "live" },
];

// The Craft & Makers template's starter set. Every one of these communities
// runs on the same loop: you make something, you photograph it, you say how you
// did it, and you ask why it came out wrong. Show & Tell is first because a
// making community with nothing to look at is a forum. Per-craft extras are
// layered on top by CRAFT_KINDS below.
//
// This template exists because the rest of the list is sorted by who the owner
// is — a business, a school, a non-profit — and a person who bakes is none of
// those. Before it, a baking community's closest match by shape was the
// Photography template, which nobody looking for baking would ever click.
const CRAFT_SPACES: TemplateSpace[] = [
  { name: "Show & Tell", description: "What you made this week — finished, half-finished, or gone badly wrong.", space_type: "gallery" },
  { name: "Live Sessions", description: "Make something together on camera, at a time everyone knows about.", space_type: "live" },
  { name: "Discussion", description: "General conversation for everyone." },
  { name: "How-To Library", description: "Step-by-step write-ups from the members who actually made the thing.", space_type: "guides" },
  { name: "What Went Wrong?", description: "Post the failure and get an answer from someone who has had exactly that.", space_type: "qa" },
  { name: "Make Along", description: "Everyone makes the same thing over the same few weeks.", space_type: "challenges" },
  { name: "Project Log", description: "Follow one make from the first attempt to the finished thing.", space_type: "journal" },
  { name: "Kit & Materials", description: "Tools, ingredients and where to get them without overpaying.", space_type: "resources" },
  { name: "Swap & Sell", description: "Sell what you made, and pass on what you are never going to use.", space_type: "marketplace" },
  { name: "Meet-Ups", description: "Post a session and whoever is free comes and makes alongside you.", space_type: "meetups" },
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
      { name: "Live Classes", description: "Teach live in the community — scheduled ahead, with everyone in the same room.", space_type: "live" },
      { name: "Q&A", description: "Ask questions about the material." },
      { name: "Resources", description: "Reading lists, templates and downloads." },
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
      { name: "Live Roundtable", description: "Operators on camera, working through a real problem someone brought.", space_type: "live" },
      { name: "Knowledge Base", description: "Playbooks and frameworks." },
      { name: "Resources", description: "Templates and tools." },
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
      { name: "Group Coaching Call", description: "The session itself — you coach, the group turns up, everyone hears the answers.", space_type: "live" },
      { name: "Resources", description: "Worksheets and frameworks." },
      { name: "Q&A", description: "Ask your coach anything." },
    ],
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
      { name: "Office Hours", description: "A standing live slot where the cohort brings whatever is stuck.", space_type: "live" },
      { name: "Q&A", description: "Ask questions about the material." },
      { name: "Resources", description: "Slides, templates and extra reading." },
    ],
  },
  {
    key: "creator",
    label: "Creator",
    icon: "Clapperboard",
    tagline: "Posts, livestreams and courses for your audience",
    description: "For creators turning an audience into a paid membership community.",
    defaultSpaces: [
      { name: "Posts", description: "Everything you share with members." },
      { name: "Livestreams", description: "Go live for your members without sending them somewhere else to watch.", space_type: "live" },
      { name: "Courses", description: "Premium lessons for members." },
      { name: "Files", description: "Downloads and templates." },
      { name: "Q&A", description: "Ask me anything." },
    ],
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
      { name: "Live Workouts", description: "Train at the same time, on camera, with somebody counting you in.", space_type: "live" },
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
      { name: "Live Gatherings", description: "Services, prayer and study, for the people who cannot be in the room.", space_type: "live" },
    ],
  },
  {
    key: "school",
    label: "School",
    icon: "School",
    tagline: "One school, and the adults around it",
    description:
      "For a school and its community \u2014 parents, teachers, staff and governors in one place. Announcements, class groups, homework help and a PTA, built around a teaching library: paste any source material and get a lesson written for the right age, ready to teach or print. Built for adults; children never need an account.",
    defaultSpaces: SCHOOL_SPACES,
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
      { name: "Town Hall", description: "The meeting, held in the open — planning, decisions and questions taken live.", space_type: "live" },
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
      { name: "Grow Clinic", description: "Hold a plant up to the camera and have three growers tell you what it is.", space_type: "live" },
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
      { name: "Live Practice", description: "A guided session at a set time — the one thing a recording cannot do.", space_type: "live" },
    ],
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
      { name: "Live Critique", description: "Work pulled up on screen and talked through, which a comment thread never manages.", space_type: "live" },
    ],
  },
  {
    key: "craft",
    label: "Craft & Makers",
    icon: "Hammer",
    tagline: "Make it, show it, work out why it collapsed",
    description:
      "For communities built around making something by hand — baking, cooking, knitting, pottery, woodwork, brewing, jewellery. Members make, show what they made, write down how, and ask why it went wrong. You choose which craft at setup.",
    defaultSpaces: CRAFT_SPACES,
    // Deliberately none. Every other template guesses at custom profile fields
    // during setup; a maker signing up does not need three questions answered
    // before they can post a photo of a loaf. The owner adds fields in Admin →
    // Profile Fields if and when they turn out to want them.
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
      { name: "Live Briefings", description: "Brief volunteers, run the AGM, and let people ask in front of everyone.", space_type: "live" },
    ],
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
      { name: "Live Networking", description: "Scheduled calls where introductions actually happen, not just get promised.", space_type: "live" },
    ],
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
      { name: "Watch Party", description: "Watch the tournament together, with everyone reacting in the same place.", space_type: "live" },
    ],
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
      { name: "Founder Calls", description: "Pitch to real faces and get the flinch, which written feedback hides.", space_type: "live" },
    ],
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
      { name: "Book Club Call", description: "The meeting itself — the reason a book club exists.", space_type: "live" },
    ],
  },
  {
    key: "custom",
    label: "Custom",
    icon: "Sparkles",
    tagline: "Start blank and build it your way",
    description: "No preset spaces — pick exactly what your community needs afterward.",
    defaultSpaces: [{ name: "Discussion", description: "General conversation to start the community off." }],
  },
];

export function getCommunityTemplate(key: string): CommunityTemplate | undefined {
  return COMMUNITY_TEMPLATES.find((t) => t.key === key);
}

// ---------------------------------------------------------------------------
// The shape every setup recommender returns: the spaces and profile fields a
// new community starts with, and the plain-English reasons behind them shown
// under the picker.
//
// There used to be a generic one here too — recommendSetup, driven by a "what
// transformation are you helping members achieve?" free-text box that keyword-
// matched eight goals and, on a miss, told the owner the defaults "cover most
// of it" when they did not. COMMUNITY_INTENTS now asks the same question
// earlier, before a type is chosen, where the answer can actually change which
// type they land on. The per-kind recommenders below cover the rest.
// ---------------------------------------------------------------------------

export interface SetupRecommendation {
  spaces: TemplateSpace[];
  rationale: string[];
}

// Puts a kind's own live room in place of whatever generic one the base list
// carries, at second position — a community should never end up with two video
// spaces because the base offers "Live Sessions" and the craft calls it a
// Bake-Along. Second, not last, because the sidebar is ordered by this array and
// the live room is a headline of the community, not an afterthought.
function withLiveSpace(base: TemplateSpace[], live: TemplateSpace): TemplateSpace[] {
  const rest = base.filter((space) => space.space_type !== "live");
  return [...rest.slice(0, 1), live, ...rest.slice(1)];
}

function dedupeByName<T extends { name: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((item) => (seen.has(item.name) ? false : (seen.add(item.name), true)));
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
}

export const ARTIST_MODES: ArtistMode[] = [
  {
    key: "fan",
    label: "Around one artist",
    tagline: "A fan community",
    description: "Built around a single musician, DJ or artist. You broadcast; fans belong, hang out and unlock exclusives.",
    spaces: ARTIST_FAN_SPACES,
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
// every other kind list in this file.
// ---------------------------------------------------------------------------

export interface PlaceLocationType {
  key: string;
  label: string;
  description: string;
  mapLayers: string[];
  extraSpaces: TemplateSpace[];
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

  // Yoga names its own live room ("Classes"); every other activity keeps the
  // base's Live Clinics. Either way exactly one live space survives.
  const kindLive = kind?.extraSpaces.find((space) => space.space_type === "live");
  const withLive = kindLive ? withLiveSpace(base, kindLive) : base;

  const rationale = ["Started from the Activity template's default spaces, with Happening Now at the top."];
  if (kind) {
    rationale.push(`Added what a ${kind.label.toLowerCase()} community typically needs.`);
    rationale.push(`Suggested Meet-Up Map layers: ${kind.mapLayers.join(", ")}.`);
  }

  return {
    spaces: dedupeByName([...withLive, ...(kind?.extraSpaces ?? [])]),
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
  // Spaces from the shared base this kind of school should NOT get, by name.
  // The other overlays in this file only ever add, which works while every
  // variant wants the whole base — but a homeschool has no staff, so a
  // staff-only room in it is a space nobody but the parent can open.
  //
  // Matched case-insensitively against the base's names, so a rename in
  // SCHOOL_SPACES doesn't turn this into a silent no-op.
  omitSpaces?: string[];
  // Profile fields from the shared base this kind should not ask for, by label.
  // Same reasoning and same matching as omitSpaces: a homeschool has no year
  // groups to put a child in and no governors to be one.
  // What the setup step says about those omissions. Falls back to listing the
  // names when absent — set it wherever that list would mislead, such as a
  // space dropped from the base only to come back under a better name.
  omitNote?: string;
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
  },
  {
    key: "homeschool",
    label: "Homeschool",
    description: "A family, or a group of families, teaching at home.",
    defaultAgeBand: "8-10",
    // Most of the base assumes an institution: somewhere for the school to
    // announce things, year groups to sort children into, a staff room, a PTA.
    // A homeschool has none of that. Two of them come back below under names
    // that fit — a rename is an omission plus an addition, which is what this
    // overlay already does, so it needs nothing new.
    omitSpaces: [
      "Announcements",
      "Classes & Year Groups",
      "Parent Chat",
      "Staff Room",
      "Policies & Reading Lists",
      "School Life",
      "PTA & Volunteering",
    ],
    omitNote:
      "Left out the parts that only exist inside a school — announcements, year groups, a staff room and a PTA. Parent Chat is here as Family Chat, and the reading lists as Reading & Resources.",
    extraSpaces: [
      { name: "Family Chat", description: "General conversation between the families teaching together." },
      { name: "Curriculum Planning", description: "What we're covering this term, and what worked last." },
      { name: "Reading & Resources", description: "Reading lists, worksheets and materials worth keeping.", space_type: "resources" },
      { name: "Field Trips", description: "Post a trip, others tap “I'm in” and come along.", space_type: "meetups" },
      { name: "Swap Shelf", description: "Books, kit and materials to pass on when you're done.", space_type: "marketplace" },
      { name: "Live Lessons", description: "One parent teaches a subject on video and every family's children sit in.", space_type: "live" },
    ],
    // Nobody here is a governor or the school office, and there are no year
    // groups. "Subjects I Teach" stays — the parent is the teacher, and across
    // a group of families it is the useful thing to know about each other.
  },
  {
    key: "coop",
    label: "Co-op or Pod",
    description: "Several families sharing the teaching between them.",
    defaultAgeBand: "8-10",
    extraSpaces: [
      { name: "Teaching Rota", description: "Who is teaching what, and when." },
      { name: "Shared Costs", description: "Materials, venue hire and who has paid what." },
      { name: "Live Lessons", description: "Whoever is teaching this week takes it on video, so nobody has to travel for it.", space_type: "live" },
      { name: "Field Trips", description: "Post a trip, others tap “I'm in” and come along.", space_type: "meetups" },
    ],
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

// What a community calls its front page in the sidebar.
//
// "Feed" is what the page is; "Today" is what a homeschooling family opens it
// for — the day's ideas, what is on, what somebody posted this morning. The
// ROUTE is untouched either way: this is the label on /c/<slug>, nothing more,
// so every link, bookmark and redirect keeps working.
//
// Scoped to schools rather than renamed platform-wide. On a marketplace or an
// island community the front page really is a feed, and calling it Today there
// would be a smaller word for the same thing rather than a better one.
export function homeLabelForCommunity(schoolKind: string | null | undefined): string {
  return schoolKind ? "Today" : "Feed";
}

// The School counterpart to recommendPlaceSetup: the shared base plus the
// chosen kind's extras. baseSpaces lets the caller substitute the
// super-admin-configured defaults for the code ones, same as place and activity.
export function recommendSchoolSetup(schoolKindKey: string, baseSpaces?: TemplateSpace[]): SetupRecommendation {
  const template = getCommunityTemplate("school")!;
  const base = baseSpaces ?? template.defaultSpaces;
  const kind = getSchoolKind(schoolKindKey);

  // Drops before adds, and against the resolved base — so it still applies when
  // a super admin has replaced the code defaults with configured ones.
  const omitted = new Set((kind?.omitSpaces ?? []).map((name) => name.trim().toLowerCase()));
  const kept = base.filter((space) => !omitted.has(space.name.trim().toLowerCase()));

  // A homeschool or co-op names its own live room; a real school keeps Live
  // Meetings. Either way exactly one live space survives.
  const kindLive = kind?.extraSpaces.find((space) => space.space_type === "live");
  const withLive = kindLive ? withLiveSpace(kept, kindLive) : kept;

  const rationale = ["Started from the School template's default spaces, with the Lessons library near the top."];
  if (kind) {
    rationale.push(`Added what a ${kind.label.toLowerCase()} typically needs.`);
    if (kind.omitSpaces?.length) {
      const names = kind.omitSpaces.map((name) => `\u201C${name}\u201D`).join(" and ");
      rationale.push(
        kind.omitNote ?? `Left out ${names} \u2014 not something a ${kind.label.toLowerCase()} needs.`
      );
    }
    rationale.push(`Lessons will be written for ${kind.defaultAgeBand.replace("-", "\u2013")} year olds by default — changeable on every lesson.`);
  }

  return {
    spaces: dedupeByName([...withLive, ...(kind?.extraSpaces ?? [])]),
    rationale,
  };
}

// ---------------------------------------------------------------------------
// Craft & Makers: "which craft is this community built around?"
//
// Same shape as ACTIVITY_KINDS and SCHOOL_KINDS — a shared base (CRAFT_SPACES)
// plus per-craft extras, and the school overlay's ability to drop a base space
// as well as add one, because several crafts want the same space under the name
// their people actually use ("Recipe Box", not "How-To Library").
//
// Each kind also carries starterActivities: the two to four things this
// community should DO in its first month. Spaces are rooms; these are the
// reason to walk into one. The wizard shows them at setup, and the first
// challenge-shaped one is seeded as a real, running challenge when the
// community is created, so nobody arrives to an empty building.
// ---------------------------------------------------------------------------

// One concrete ritual a new community can run. spaceType says which of the
// seeded spaces it happens in — used to show it beside that space, and to seed
// the challenge-shaped ones for real. durationDays is only meaningful for
// spaceType 'challenges': it sets the first run's end date.
export interface StarterActivity {
  title: string;
  description: string;
  spaceType: SpaceType;
  durationDays?: number;
}

export interface CraftKind {
  key: string;
  label: string;
  description: string;
  // The craft's live video room, named for what actually happens in it — a
  // Sunday Bake-Along, not "Live Sessions". Every craft has exactly one, and it
  // is a field of its own rather than another entry in extraSpaces so the
  // wizard can point at it by name without guessing which of the extras is the
  // live one.
  //
  // Its description is written for the members who will read it in the sidebar
  // for years, so it says what happens in the room and nothing about pricing.
  // Whether it stays free or sits behind a paid space is the owner's call,
  // made later in Admin — the wizard only mentions that the choice exists.
  liveSpace: TemplateSpace;
  extraSpaces: TemplateSpace[];
  // Spaces from the shared base this craft should not get, by name — matched
  // case-insensitively, same as SchoolKind.omitSpaces. Used almost entirely for
  // renames: drop "How-To Library", add "Recipe Box".
  omitSpaces?: string[];
  // What the setup step says about those omissions. Without it the step just
  // lists the dropped names, which reads as a loss when it was really a rename.
  omitNote?: string;
  starterActivities: StarterActivity[];
}

// Shared by the two food crafts, which both want the library called what a
// cook would call it.
const RECIPE_BOX_NOTE =
  "Renamed the How-To Library to the Recipe Box — same space, the name people will actually look for.";

export const CRAFT_KINDS: CraftKind[] = [
  {
    key: "baking",
    label: "Baking & Bread",
    description: "Bread, cakes and pastry — where the same recipe behaves differently in every oven.",
    omitSpaces: ["How-To Library"],
    omitNote: RECIPE_BOX_NOTE,
    liveSpace: {
      name: "Sunday Bake-Along",
      description: "Bake the same thing together on live video — you lead, everyone follows in their own kitchen.",
      space_type: "live",
    },
    extraSpaces: [
      { name: "Recipe Box", description: "Recipes members have actually baked, with the notes that make them work.", space_type: "guides" },
      { name: "Starter & Lending Shelf", description: "Who has a live sourdough starter, a spare tin or a proving basket to lend.", space_type: "directory" },
    ],
    starterActivities: [
      {
        title: "Bake of the Week",
        description: "One thing everyone bakes this week — photos in Show & Tell on Sunday, however it turned out.",
        spaceType: "challenges",
        durationDays: 7,
      },
      {
        title: "Sunday bake-along",
        description: "The same recipe, at the same time, on video — so the tricky step happens with you there rather than in a comment the next day.",
        spaceType: "live",
      },
      {
        title: "Sourdough starter swap",
        description: "Members with a live starter offer a jar to members without one, and check in on how it's feeding.",
        spaceType: "directory",
      },
      {
        title: "The “why did it collapse?” thread",
        description: "Post the failure with a photo and the recipe. Somebody here has had exactly that failure.",
        spaceType: "qa",
      },
    ],
  },
  {
    key: "cooking",
    label: "Cooking & Food",
    description: "Everyday cooking, feeding people, and getting better at it.",
    omitSpaces: ["How-To Library"],
    omitNote: RECIPE_BOX_NOTE,
    liveSpace: {
      name: "Cook-Along",
      description: "Cook one dish together on live video, with the tricky steps happening at the same time.",
      space_type: "live",
    },
    extraSpaces: [
      { name: "Recipe Box", description: "Recipes members have actually cooked, with the notes that make them work.", space_type: "guides" },
      { name: "What's In Season", description: "What's good right now, what it costs and what to do with it.", space_type: "resources" },
    ],
    starterActivities: [
      {
        title: "Cook one thing you've never cooked",
        description: "Two weeks, one unfamiliar dish each. Post it before you know whether it worked.",
        spaceType: "challenges",
        durationDays: 14,
      },
      {
        title: "Monthly cook-along",
        description: "One recipe, everyone cooking it at once on video, questions answered while the pan is still on.",
        spaceType: "live",
      },
      { title: "Friday fridge raid", description: "Post what's left in the fridge and let the community write the dinner.", spaceType: "discussion" },
    ],
  },
  {
    key: "textiles",
    label: "Knitting, Crochet & Yarn",
    description: "Knitting, crochet, spinning and weaving — long projects, shown off in stages.",
    omitSpaces: ["Swap & Sell"],
    omitNote: "Renamed Swap & Sell to Stash & Swap — in a yarn community it's mostly part-balls looking for a project.",
    liveSpace: {
      name: "Knit Night Live",
      description: "Cast on together on video — knit, chat, and get unstuck while somebody can still see your hands.",
      space_type: "live",
    },
    extraSpaces: [
      { name: "Pattern Library", description: "Patterns members have knitted, with the modifications that fixed them.", space_type: "guides" },
      { name: "Stash & Swap", description: "Yarn, needles and part-balls looking for a project.", space_type: "marketplace" },
    ],
    starterActivities: [
      {
        title: "Knit-along: one project, four weeks",
        description: "Everyone starts the same pattern on the same day and posts progress each week.",
        spaceType: "challenges",
        durationDays: 28,
      },
      {
        title: "Weekly knit night, live",
        description: "An hour on video with the pattern open. Company while you knit is the whole point, and dropped stitches get fixed on camera.",
        spaceType: "live",
      },
      { title: "WIP Wednesday", description: "Photograph whatever is on the needles, finished or not. The unfinished ones are the point.", spaceType: "gallery" },
    ],
  },
  {
    key: "sewing",
    label: "Sewing & Dressmaking",
    description: "Garments, alterations and refashioning — where fit is the whole problem.",
    liveSpace: {
      name: "Sew-Along",
      description: "Sew a project together on live video, from cutting out to the last seam.",
      space_type: "live",
    },
    extraSpaces: [
      { name: "Pattern Library", description: "Patterns members have sewn, with the adjustments that made them fit.", space_type: "guides" },
      { name: "Fabric Shops", description: "Where to buy fabric, thread and haberdashery locally.", space_type: "business_directory" },
    ],
    starterActivities: [
      {
        title: "One garment this month",
        description: "Start it on the first, wear it on the last. Post the muslin, not just the finished piece.",
        spaceType: "challenges",
        durationDays: 30,
      },
      {
        title: "Sew-along, one session a week",
        description: "Cut out together, sew together, finish together. Fit problems get solved on camera instead of in a comment thread.",
        spaceType: "live",
      },
      { title: "Refashion a charity-shop find", description: "Buy something for pennies, cut it up, show the before and after.", spaceType: "gallery" },
    ],
  },
  {
    key: "pottery",
    label: "Pottery & Ceramics",
    description: "Wheel, hand-building and glazing — a craft you can rarely do entirely at home.",
    liveSpace: {
      name: "Studio Live",
      description: "A form thrown or built start to finish on video, close enough to see the hands, with questions as it happens.",
      space_type: "live",
    },
    extraSpaces: [
      { name: "Kiln & Firing", description: "Firing schedules, glaze chemistry and what came out of the last load.", space_type: "resources" },
      { name: "Studios & Kiln Hire", description: "Where to throw, where to fire and what it costs.", space_type: "business_directory" },
    ],
    starterActivities: [
      {
        title: "Throw the same form for 30 days",
        description: "One cylinder a day. Post day 1 and day 30 side by side — the improvement is the whole reward.",
        spaceType: "challenges",
        durationDays: 30,
      },
      {
        title: "Live throwing demo",
        description: "One form, start to finish, with the camera over the wheel — the bit you cannot learn from a photograph.",
        spaceType: "live",
      },
      { title: "Glaze test library", description: "Everyone fires a test tile and photographs it against the recipe, so the community builds a real reference.", spaceType: "gallery" },
    ],
  },
  {
    key: "woodwork",
    label: "Woodwork & Furniture",
    description: "Furniture, joinery and carving — big tools, and not everybody owns them.",
    liveSpace: {
      name: "Workshop Live",
      description: "A cut, a joint or a finish demonstrated at the bench on live video, with your questions answered as you watch.",
      space_type: "live",
    },
    extraSpaces: [
      { name: "Plans & Cut Lists", description: "Measured plans and cut lists members have actually built from.", space_type: "guides" },
      { name: "Tool Library", description: "Who owns the thing you need once a year, and will lend it.", space_type: "directory" },
    ],
    starterActivities: [
      {
        title: "One-board build",
        description: "A month, one board, whatever you can make from it. Same constraint for everyone.",
        spaceType: "challenges",
        durationDays: 30,
      },
      {
        title: "Live bench demo",
        description: "Dovetails, a finish schedule, sharpening — the things nobody learns from a photo.",
        spaceType: "live",
      },
      { title: "Sign the tool library", description: "Everyone lists one tool they'd lend. That list is the reason to stay.", spaceType: "directory" },
    ],
  },
  {
    key: "brewing",
    label: "Homebrew & Fermentation",
    description: "Beer, cider, wine, kombucha and kraut — slow, and best compared side by side.",
    omitSpaces: ["Project Log", "Meet-Ups"],
    omitNote:
      "Renamed the Project Log to the Brew Log and Meet-Ups to Bottle Shares — a batch is a project, and a meet-up here is a tasting.",
    liveSpace: {
      name: "Brew Day Live",
      description: "Brew a batch together on video — mash, boil and pitch at the same time, with the timings called out.",
      space_type: "live",
    },
    extraSpaces: [
      { name: "Brew Log", description: "Every batch — recipe, gravity, dates and what it actually tasted like.", space_type: "journal" },
      { name: "Bottle Shares", description: "Post a tasting and whoever is free brings a bottle of theirs.", space_type: "meetups" },
    ],
    starterActivities: [
      {
        title: "Same recipe, different kitchens",
        description: "Everyone brews one agreed recipe and tastes them against each other six weeks later.",
        spaceType: "challenges",
        durationDays: 42,
      },
      {
        title: "Brew day, together on video",
        description: "A whole brew day narrated live — the sanitation, the timings and the judgement calls, as they are being made.",
        spaceType: "live",
      },
      { title: "Blind bottle share", description: "Bring one bottle, labels off. The feedback is more honest that way.", spaceType: "meetups" },
    ],
  },
  {
    key: "art",
    label: "Art, Drawing & Illustration",
    description: "Drawing, painting and illustration — where honest critique is the scarce thing.",
    liveSpace: {
      name: "Draw-Along",
      description: "Draw or paint the same subject together on video, at the same pace, with the reference on screen.",
      space_type: "live",
    },
    extraSpaces: [
      { name: "Critique Requests", description: "Post work and say what kind of feedback you want on it.", space_type: "qa" },
      { name: "Reference & Prompts", description: "Reference photos, prompts and exercises to work from.", space_type: "resources" },
    ],
    starterActivities: [
      {
        title: "Draw every day for 30 days",
        description: "One drawing a day, posted the same day. Missing a day doesn't end it.",
        spaceType: "challenges",
        durationDays: 30,
      },
      {
        title: "Weekly live session",
        description: "A timed life-drawing or a paint-along, with everyone working at once and nobody able to quietly stop.",
        spaceType: "live",
      },
      { title: "Critique swap", description: "Pair up and give each other one specific, useful piece of feedback.", spaceType: "qa" },
    ],
  },
  {
    key: "jewellery",
    label: "Jewellery & Metalwork",
    description: "Silversmithing, beading and metalwork — small pieces, expensive materials.",
    liveSpace: {
      name: "Bench Live",
      description: "A technique demonstrated at the bench on live video, close enough to see what the hands are doing.",
      space_type: "live",
    },
    extraSpaces: [
      { name: "Suppliers & Stones", description: "Where to buy metal, findings and stones without being stung.", space_type: "business_directory" },
      { name: "Bench Safety", description: "Torches, pickle, ventilation and hallmarking — the parts you can't guess at.", space_type: "resources" },
    ],
    starterActivities: [
      {
        title: "One piece from scrap",
        description: "Three weeks, using only offcuts and failed pieces you already have.",
        spaceType: "challenges",
        durationDays: 21,
      },
      {
        title: "Live bench demo",
        description: "Soldering, stone setting, finishing — shown at the bench rather than described. The closest thing to standing next to you.",
        spaceType: "live",
      },
      { title: "Bench photo Friday", description: "Photograph your bench mid-piece. Seeing other people's mess is half the value.", spaceType: "gallery" },
    ],
  },
  {
    key: "home",
    label: "Soap, Candles & Home Craft",
    description: "Soap, candles, resin and home fragrance — recipes, ratios and small batches.",
    liveSpace: {
      name: "Batch Live",
      description: "Make a batch together on video, with the ratios, temperatures and timings called out as you go.",
      space_type: "live",
    },
    extraSpaces: [
      { name: "Safety & Ratios", description: "Lye calculations, fragrance loads, cure times and the things you don't improvise.", space_type: "resources" },
      { name: "Suppliers", description: "Where to buy oils, waxes, fragrance and moulds.", space_type: "business_directory" },
    ],
    starterActivities: [
      {
        title: "One batch, one new variable",
        description: "A month of small batches, changing exactly one thing each time and writing down what it did.",
        spaceType: "challenges",
        durationDays: 30,
      },
      {
        title: "Batch along, live",
        description: "Make a batch at the same time as everyone else, with somebody watching the temperatures with you.",
        spaceType: "live",
      },
      { title: "Market stall prep", description: "Members selling at a fair share pricing, packaging and what actually sold.", spaceType: "discussion" },
    ],
  },
  {
    key: "digital",
    label: "3D Printing & Electronics",
    description: "Printing, laser cutting and electronics — makes that are half file, half physical.",
    liveSpace: {
      name: "Build Live",
      description: "A build or a print walked through live, settings and all, with questions taken as they come.",
      space_type: "live",
    },
    extraSpaces: [
      { name: "Builds & Schematics", description: "Build write-ups, wiring diagrams and the settings that finally worked.", space_type: "guides" },
      { name: "Print Files", description: "Models, cut files and firmware worth keeping.", space_type: "resources" },
    ],
    starterActivities: [
      {
        title: "Print one useful thing",
        description: "Two weeks. It has to solve a real problem in your house, not be a benchy.",
        spaceType: "challenges",
        durationDays: 14,
      },
      {
        title: "Live build session",
        description: "Screen shared, settings visible, one build from file to finished part — and it answers back, which a tutorial does not.",
        spaceType: "live",
      },
      { title: "Failed print of the week", description: "Post the spaghetti and the settings. The diagnosis is the lesson.", spaceType: "qa" },
    ],
  },
];

export function getCraftKind(key: string): CraftKind | undefined {
  return CRAFT_KINDS.find((k) => k.key === key);
}

// The rituals a new craft community should run in its first month. Empty for
// every other template, and for a craft community whose kind wasn't recognised.
export function starterActivitiesForCraftKind(key: string | null | undefined): StarterActivity[] {
  return (key ? getCraftKind(key)?.starterActivities : undefined) ?? [];
}

export interface CraftSetupRecommendation extends SetupRecommendation {
  starterActivities: StarterActivity[];
}

// The Craft counterpart to recommendActivitySetup and recommendSchoolSetup: the
// shared base, minus what this craft renames away, plus its extras. baseSpaces
// lets the caller substitute the super-admin-configured defaults for the code
// ones, same as every other recommender here.
export function recommendCraftSetup(craftKindKey: string, baseSpaces?: TemplateSpace[]): CraftSetupRecommendation {
  const template = getCommunityTemplate("craft")!;
  const base = baseSpaces ?? template.defaultSpaces;
  const kind = getCraftKind(craftKindKey);

  // Drops before adds, and against the resolved base — so a rename still
  // applies when a super admin has replaced the code defaults with their own.
  const omitted = new Set((kind?.omitSpaces ?? []).map((name) => name.trim().toLowerCase()));
  const kept = base.filter((space) => !omitted.has(space.name.trim().toLowerCase()));

  const withLive = kind ? withLiveSpace(kept, kind.liveSpace) : kept;

  const rationale = ["Started from the Craft & Makers template's default spaces, with Show & Tell at the top."];
  if (kind) {
    rationale.push(`Added what a ${kind.label.toLowerCase()} community typically needs.`);
    if (kind.omitSpaces?.length) {
      const names = kind.omitSpaces.map((name) => `“${name}”`).join(" and ");
      rationale.push(kind.omitNote ?? `Left out ${names} — not something a ${kind.label.toLowerCase()} community needs.`);
    }
    rationale.push(
      `Included ${kind.liveSpace.name}: live video that runs inside the community, with sessions you can schedule, RSVPs and a reminder before one starts.`
    );
    const seeded = kind.starterActivities.find((a) => a.spaceType === "challenges" && a.durationDays);
    if (seeded) {
      rationale.push(`“${seeded.title}” starts the day you launch — already running, so the community has something happening in it.`);
    }
  }

  return {
    spaces: dedupeByName([...withLive, ...(kind?.extraSpaces ?? [])]),
    rationale,
    starterActivities: kind?.starterActivities ?? [],
  };
}

// ---------------------------------------------------------------------------
// Intents: "what do you want your community to do?"
//
// COMMUNITY_TEMPLATES is sorted by who the owner is — a business, a school, a
// non-profit, a photographer. An owner picking from it is thinking about what
// their members will DO, which is a different axis, and the mismatch is why
// someone starting a baking community used to land on Custom: they read
// nineteen labels, recognised none of them as themselves, and took the blank
// one.
//
// These intents are that missing axis. Picking one or two filters the grid to
// the types that actually serve it; picking none leaves the full list exactly
// as it was. A template may sit under several intents — a craft community is
// somewhere to make things, somewhere to learn a skill, somewhere to meet up
// and somewhere to sell — and that redundancy is deliberate: every route in
// should reach it.
// ---------------------------------------------------------------------------

export interface CommunityIntent {
  key: string;
  label: string;
  description: string;
  icon: string; // lucide-react icon name, resolved by TEMPLATE_ICONS in the UI layer
  templateKeys: string[];
}

export const COMMUNITY_INTENTS: CommunityIntent[] = [
  {
    key: "make",
    label: "Make things",
    description: "Members make something and show each other what they made.",
    icon: "Hammer",
    templateKeys: ["craft", "photography", "farming", "fanclub"],
  },
  {
    key: "learn",
    label: "Learn a skill",
    description: "Somebody teaches, or everybody gets better together.",
    icon: "GraduationCap",
    templateKeys: ["craft", "learning", "course", "coaching", "school"],
  },
  {
    key: "meet",
    label: "Meet up in person",
    description: "The point is what happens when people are in the same room.",
    icon: "Footprints",
    templateKeys: ["activity", "craft", "place", "book_club", "faith"],
  },
  {
    key: "support",
    label: "Support each other",
    description: "Members are going through something and need the others.",
    icon: "HandHeart",
    templateKeys: ["wellness", "fitness", "coaching", "faith", "nonprofit"],
  },
  {
    key: "audience",
    label: "Reach an audience",
    description: "You already have people watching, and want somewhere to put them.",
    icon: "Clapperboard",
    templateKeys: ["creator", "fanclub", "course", "business"],
  },
  {
    key: "trade",
    label: "Buy, sell and swap",
    description: "Members trade things, materials or work with each other.",
    icon: "Store",
    templateKeys: ["craft", "place", "photography", "business", "networking"],
  },
  {
    key: "organise",
    label: "Run a place or an organisation",
    description: "There's a real institution or territory behind this.",
    icon: "MapPin",
    templateKeys: ["place", "school", "nonprofit", "business", "startup"],
  },
  {
    key: "compete",
    label: "Play and compete",
    description: "Fixtures, ladders, tournaments and leaderboards.",
    icon: "Gamepad2",
    templateKeys: ["gaming", "activity", "fitness"],
  },
];

export function getCommunityIntent(key: string): CommunityIntent | undefined {
  return COMMUNITY_INTENTS.find((i) => i.key === key);
}

// The types worth showing for a set of chosen intents, best match first.
//
// Selecting nothing returns the full list untouched, so the step behaves
// exactly as it did before intents existed. Otherwise a type's score is how
// many of the chosen intents list it: pick "make" and "meet" and a craft
// community — which serves both — sorts above photography, which serves one.
// Ties keep COMMUNITY_TEMPLATES' own order, and Custom is always included and
// always last, so there is never a set of answers that traps someone.
export function templatesForIntents(intentKeys: string[]): CommunityTemplate[] {
  if (!intentKeys.length) return COMMUNITY_TEMPLATES;

  const score = new Map<string, number>();
  for (const key of intentKeys) {
    for (const templateKey of getCommunityIntent(key)?.templateKeys ?? []) {
      score.set(templateKey, (score.get(templateKey) ?? 0) + 1);
    }
  }

  const matched = COMMUNITY_TEMPLATES.filter((t) => t.key !== "custom" && score.has(t.key)).sort(
    (a, b) => (score.get(b.key) ?? 0) - (score.get(a.key) ?? 0)
  );
  const custom = COMMUNITY_TEMPLATES.find((t) => t.key === "custom");
  return custom ? [...matched, custom] : matched;
}
