import type { GuidedJourneyConfig, GuidedJourneyPreset, TemplateSeed } from "./config";

// Built-in starting points for a guided-journey space. An admin picks one when
// creating the space, then edits any word, picture, question option or
// milestone in Manage — the preset is only the layer under their overrides.
//
// Photography: only the gardening preset ships photos (public/images/
// adopt-a-beginner, Unsplash License — see CREDITS.md there). Other presets
// leave image URLs null so the page shows a calm placeholder panel until the
// admin uploads their own; nothing links to temporary external images.

const IMG = "/images/adopt-a-beginner";

const GARDENING: GuidedJourneyConfig = {
  category: "Gardening",
  tagline: "Grow something. Learn together. Share the harvest.",
  heroTitle: "Adopt a Beginner",
  heroSubtitle: "Help someone grow their first food. Or find someone to guide you.",
  heroImageUrl: `${IMG}/hero.webp`,
  heroImageAlt: "An older gardener showing a young girl how to water plants in a leafy garden.",
  terms: {
    beginner: "beginner",
    beginners: "beginners",
    mentor: "mentor",
    mentors: "mentors",
    journey: "growing journey",
    subject: "crop",
    requestButton: "Request Adoption",
    firstSuccessHelper: "First-harvest helper",
  },
  beginnerCard: { title: "I'm a Beginner", description: "Find someone to help me grow.", button: "Find a Mentor" },
  mentorCard: { title: "I'm a Grower", description: "Share what I know with others.", button: "Become a Mentor" },
  stagesTitle: "How it works",
  stagesSubtitle: "Five simple stages, from your first seed to your first harvest — with someone beside you all the way.",
  stages: [
    {
      title: "Create your growing profile",
      text: "Tell us where you live, what space you have, what you'd like to grow and how much experience you have.",
      imageUrl: `${IMG}/stage-1-profile.webp`,
      imageAlt: "A young woman tending trays of seedlings in a greenhouse.",
    },
    {
      title: "Find your gardening mentor",
      text: "Connect with experienced growers who understand your climate, crops and growing conditions.",
      imageUrl: `${IMG}/stage-2-mentor.webp`,
      imageAlt: "A gardener tending a lush bed of beet greens in a productive vegetable garden.",
    },
    {
      title: "Start your growing mission",
      text: "Choose your first crop together. Learn about seeds, soil, watering and natural growing methods.",
      imageUrl: `${IMG}/stage-3-mission.webp`,
      imageAlt: "Soil-covered hands planting seedlings in rich, dark garden soil.",
    },
    {
      title: "Share your progress",
      text: "Share weekly photographs, ask questions and receive guidance as your plants grow.",
      imageUrl: `${IMG}/stage-4-progress.webp`,
      imageAlt: "A person photographing young potted plants with a smartphone.",
    },
    {
      title: "Celebrate your first harvest",
      text: "Celebrate your first harvest, share what you've learned and help inspire the next beginner.",
      imageUrl: `${IMG}/stage-5-harvest.webp`,
      imageAlt: "A smiling gardener in a straw hat holding a bowl of freshly harvested vegetables.",
    },
  ],
  questions: {
    location: { label: "Where are you growing?", help: "Country and region help us find growers with a similar climate. An approximate area is optional — never share your address." },
    setting: {
      label: "What space do you have?",
      help: "Pick all that apply.",
      options: [
        { value: "balcony", label: "Balcony" },
        { value: "pots", label: "Pots or windowsill" },
        { value: "garden", label: "Garden" },
        { value: "allotment", label: "Allotment" },
        { value: "farm", label: "Farm" },
        { value: "shared", label: "Shared land" },
      ],
    },
    interests: {
      label: "What would you like to grow?",
      help: "Pick any — you can change your mind with your mentor.",
      options: [
        { value: "vegetables", label: "Vegetables" },
        { value: "herbs", label: "Herbs" },
        { value: "fruit", label: "Fruit" },
        { value: "flowers", label: "Flowers" },
        { value: "not_sure", label: "Not sure yet" },
      ],
    },
    experience: {
      label: "What is your experience?",
      help: "",
      options: [
        { value: "complete_beginner", label: "Complete beginner" },
        { value: "tried_before", label: "Tried before" },
        { value: "some", label: "Some experience" },
      ],
    },
    helpMode: { label: "How would you like help?", help: "Online works anywhere. Meeting in person always needs both of you to agree first." },
  },
  mentorQuestions: {
    experienceLabel: "What do you have experience growing?",
    topicsLabel: "Crops or topics you'd love to help with",
    climateLabel: "Your growing climate or region",
    photosLabel: "Photos of your garden",
    introPlaceholder: "A few friendly lines: what you grow, how you learned, and what you enjoy helping with.",
  },
  capacityOptions: [1, 3, 5],
  defaultUpdateFrequency: "weekly",
  defaultJourneyTitle: "My first harvest",
  defaultMilestones: [
    { title: "Choose your crop", description: "Decide together what suits your space, season and taste." },
    { title: "Prepare your soil and containers", description: "Find the right spot, pots or bed, and good compost." },
    { title: "Plant your seeds", description: "Sow seeds or plant seedlings." },
    { title: "First shoots appear", description: "Share a photo of the first leaves." },
    { title: "Transplant or thin seedlings", description: "Give the strongest plants room to grow." },
    { title: "Keep plants healthy", description: "Water, feed naturally and watch for pests together." },
    { title: "Watch flowering and fruit development", description: "Notice flowers, pollination and first fruit." },
    { title: "Prepare for harvest", description: "Learn the signs that your crop is ready." },
    { title: "First harvest", description: "Pick it, photograph it, enjoy it." },
    { title: "Share what you learned", description: "What worked, what didn't, and what you'd try next." },
  ],
  completion: {
    title: "You've grown your first food!",
    subtitle: "From a seed to your table — and you did it with your own hands.",
    againButton: "Grow Something Else",
    helpButton: "Help Another Beginner",
    mentorInvite: "You've learned something worth sharing. Would you like to help someone else?",
  },
  gallery: {
    title: "Growing Together",
    subtitle: "Real first harvests from members who chose to share their story — a growing library of what works where.",
    methodLabel: "Growing method",
    methodOptions: [
      { value: "containers", label: "Containers & pots" },
      { value: "raised_beds", label: "Raised beds" },
      { value: "in_ground", label: "In the ground" },
      { value: "no_dig", label: "No-dig" },
      { value: "greenhouse", label: "Greenhouse or polytunnel" },
      { value: "hydroponic", label: "Hydroponic" },
    ],
  },
  safety: {
    adviceDisclaimer:
      "Mentors are community members sharing what has worked for them. Their advice is friendly experience, not professional or verified expertise unless marked “Verified by staff”.",
    inPersonNote: "Meeting in person is optional and only shows as agreed when you have both said yes. Meet somewhere public, and never share your home address in a message.",
  },
  participation: "free",
};

const GARDENING_TEMPLATES: TemplateSeed[] = [
  {
    title: "My First Tomatoes",
    subject: "Tomatoes",
    summary: "From seed or seedling to your first ripe tomato — in pots, on a balcony or in the ground.",
    coverImageUrl: `${IMG}/stage-4-progress.webp`,
    durationLabel: "About 10–16 weeks — adjust for your climate and variety",
    expectedWeeks: 12,
    milestones: GARDENING.defaultMilestones,
  },
  {
    title: "Salad Leaves & Radishes",
    subject: "Salad leaves",
    summary: "The quickest first harvest: cut-and-come-again lettuce and crunchy radishes in a trough or bed.",
    coverImageUrl: `${IMG}/stage-5-harvest.webp`,
    durationLabel: "About 4–8 weeks, depending on the season",
    expectedWeeks: 6,
    milestones: [
      { title: "Choose your seeds" },
      { title: "Prepare a trough or bed" },
      { title: "Sow in short rows" },
      { title: "First shoots appear" },
      { title: "Thin and water" },
      { title: "First harvest" },
      { title: "Share what you learned" },
    ],
  },
  {
    title: "Kitchen Herbs in Pots",
    subject: "Herbs",
    summary: "Basil, parsley and chives on a windowsill or balcony — small space, big flavour.",
    coverImageUrl: `${IMG}/stage-1-profile.webp`,
    durationLabel: "About 6–10 weeks to a regular harvest",
    expectedWeeks: 8,
    milestones: [
      { title: "Choose your herbs" },
      { title: "Pots, compost and a sunny spot" },
      { title: "Sow or plant" },
      { title: "First shoots appear" },
      { title: "Pinch and shape" },
      { title: "First harvest" },
      { title: "Share what you learned" },
    ],
  },
];

// Build a preset from the gardening one, replacing what differs. Image URLs
// default to null (admins upload their own); everything else must be given.
function derive(
  overrides: Omit<GuidedJourneyConfig, "heroImageUrl" | "heroImageAlt" | "stages" | "safety" | "participation" | "capacityOptions" | "defaultUpdateFrequency"> & {
    stages: { title: string; text: string }[];
    safety?: Partial<GuidedJourneyConfig["safety"]>;
  }
): GuidedJourneyConfig {
  return {
    ...GARDENING,
    ...overrides,
    heroImageUrl: null,
    heroImageAlt: "",
    stages: overrides.stages.map((s) => ({ ...s, imageUrl: null, imageAlt: "" })),
    safety: { ...GARDENING.safety, ...overrides.safety },
  };
}

const HELP_ANY = GARDENING.questions.helpMode;

const SAILING = derive({
  category: "Sailing",
  tagline: "Learn the ropes. Sail together. Share the horizon.",
  heroTitle: "Adopt a New Sailor",
  heroSubtitle: "Help someone take their first sail. Or find a skipper to guide you.",
  terms: {
    beginner: "new sailor",
    beginners: "new sailors",
    mentor: "skipper",
    mentors: "skippers",
    journey: "sailing journey",
    subject: "skill",
    requestButton: "Ask to Sail Together",
    firstSuccessHelper: "First-sail helper",
  },
  beginnerCard: { title: "I'm New to Sailing", description: "Find someone to help me learn.", button: "Find a Skipper" },
  mentorCard: { title: "I'm a Sailor", description: "Share what I know on the water.", button: "Become a Mentor" },
  stagesTitle: "How it works",
  stagesSubtitle: "Five stages from dry land to your first confident sail.",
  stages: [
    { title: "Create your sailor profile", text: "Tell us where you sail, what boats you can reach and how much time you've spent on the water." },
    { title: "Find your skipper", text: "Connect with experienced sailors who know your waters, weather and kind of boat." },
    { title: "Start your sailing mission", text: "Agree a first goal together: knots, rigging, safety, then a short sail in calm conditions." },
    { title: "Share your progress", text: "Log each session with photos, questions and what the wind did." },
    { title: "Celebrate your first sail", text: "Celebrate your first confident sail, share what you learned and help the next new sailor." },
  ],
  questions: {
    location: { label: "Where would you sail?", help: "Country and region (a lake, coast or club area). Never share your home address." },
    setting: {
      label: "What can you get to?",
      help: "Pick all that apply.",
      options: [
        { value: "dinghy", label: "Dinghy" },
        { value: "keelboat", label: "Keelboat or yacht" },
        { value: "club", label: "A sailing club" },
        { value: "none", label: "No boat yet" },
      ],
    },
    interests: {
      label: "What would you like to learn?",
      help: "",
      options: [
        { value: "basics", label: "Sailing basics" },
        { value: "knots", label: "Knots & rigging" },
        { value: "navigation", label: "Navigation" },
        { value: "racing", label: "Racing" },
        { value: "not_sure", label: "Not sure yet" },
      ],
    },
    experience: {
      label: "What is your experience?",
      help: "",
      options: [
        { value: "complete_beginner", label: "Never sailed" },
        { value: "tried_before", label: "Been out once or twice" },
        { value: "some", label: "Some experience" },
      ],
    },
    helpMode: HELP_ANY,
  },
  mentorQuestions: {
    experienceLabel: "What have you sailed?",
    topicsLabel: "Skills you'd love to teach",
    climateLabel: "Your sailing waters",
    photosLabel: "Photos of you sailing",
    introPlaceholder: "A few friendly lines: how you started, what you sail and what you enjoy teaching.",
  },
  defaultJourneyTitle: "My first sail",
  defaultMilestones: [
    { title: "Safety first: kit, buoyancy aid and weather" },
    { title: "Learn five essential knots" },
    { title: "Rig the boat together" },
    { title: "First time on the water" },
    { title: "Tacking and gybing" },
    { title: "Sail a short course with your skipper" },
    { title: "Your first confident sail" },
    { title: "Share what you learned" },
  ],
  completion: {
    title: "You've completed your first sail!",
    subtitle: "From dry land to the open water — you did it.",
    againButton: "Learn Something Else",
    helpButton: "Help Another New Sailor",
    mentorInvite: "You've learned something worth sharing. Would you like to help someone else onto the water?",
  },
  gallery: {
    title: "Sailing Together",
    subtitle: "First sails from members who chose to share their story.",
    methodLabel: "Boat type",
    methodOptions: [
      { value: "dinghy", label: "Dinghy" },
      { value: "keelboat", label: "Keelboat" },
      { value: "yacht", label: "Yacht" },
    ],
  },
  safety: {
    adviceDisclaimer:
      "Skippers are community members sharing their experience. Their advice is not a substitute for recognised training or local safety guidance unless marked “Verified by staff”.",
  },
});

const COOKING = derive({
  category: "Cooking",
  tagline: "Cook something. Learn together. Share the table.",
  heroTitle: "Adopt a Beginner Cook",
  heroSubtitle: "Help someone cook their first five meals. Or find someone to guide you.",
  terms: {
    beginner: "beginner cook",
    beginners: "beginner cooks",
    mentor: "mentor",
    mentors: "mentors",
    journey: "cooking journey",
    subject: "dish",
    requestButton: "Ask for a Mentor",
    firstSuccessHelper: "First-meal helper",
  },
  beginnerCard: { title: "I'm Learning to Cook", description: "Find someone to cook alongside.", button: "Find a Mentor" },
  mentorCard: { title: "I'm a Cook", description: "Share what I know in the kitchen.", button: "Become a Mentor" },
  stagesTitle: "How it works",
  stagesSubtitle: "Five stages to your first five meals.",
  stages: [
    { title: "Create your kitchen profile", text: "Tell us about your kitchen, what you like to eat and how often you cook." },
    { title: "Find your cooking mentor", text: "Connect with cooks who share your tastes and dietary needs." },
    { title: "Plan your first meals", text: "Choose five dishes together and learn the basics: knife skills, heat and seasoning." },
    { title: "Share your progress", text: "Post a photo of each meal, ask questions and get tips for next time." },
    { title: "Celebrate your fifth meal", text: "Celebrate your fifth meal, share your favourite recipe and inspire the next cook." },
  ],
  questions: {
    location: { label: "Where do you cook?", help: "Country and region help with seasonal ingredients." },
    setting: {
      label: "What kitchen do you have?",
      help: "",
      options: [
        { value: "full", label: "Full kitchen" },
        { value: "small", label: "Small or shared kitchen" },
        { value: "hob_only", label: "Hob or hot plate only" },
      ],
    },
    interests: {
      label: "What would you like to cook?",
      help: "",
      options: [
        { value: "everyday", label: "Everyday meals" },
        { value: "baking", label: "Baking" },
        { value: "vegetarian", label: "Vegetarian / vegan" },
        { value: "world", label: "World food" },
        { value: "not_sure", label: "Not sure yet" },
      ],
    },
    experience: GARDENING.questions.experience,
    helpMode: HELP_ANY,
  },
  mentorQuestions: {
    experienceLabel: "What do you cook well?",
    topicsLabel: "Dishes or skills you'd love to teach",
    climateLabel: "Your cuisine or region",
    photosLabel: "Photos of your cooking",
    introPlaceholder: "A few friendly lines: what you cook and what you enjoy teaching.",
  },
  defaultJourneyTitle: "My first five meals",
  defaultMilestones: [
    { title: "Choose five dishes" },
    { title: "Stock the basics" },
    { title: "Meal one" },
    { title: "Meal two" },
    { title: "Meal three" },
    { title: "Meal four" },
    { title: "Meal five" },
    { title: "Share what you learned" },
  ],
  completion: {
    title: "You've cooked your first five meals!",
    subtitle: "From a recipe to a table you're proud of.",
    againButton: "Cook Something Else",
    helpButton: "Help Another Beginner Cook",
    mentorInvite: "You've learned something worth sharing. Would you like to help someone else in the kitchen?",
  },
  gallery: {
    title: "Cooking Together",
    subtitle: "First meals from members who chose to share their story.",
    methodLabel: "Style",
    methodOptions: [
      { value: "home", label: "Home cooking" },
      { value: "baking", label: "Baking" },
      { value: "plant_based", label: "Plant-based" },
    ],
  },
});

const MUSIC = derive({
  category: "Music",
  tagline: "Play something. Learn together. Share the song.",
  heroTitle: "Adopt a Musician",
  heroSubtitle: "Help someone learn their first song. Or find someone to guide you.",
  terms: {
    beginner: "beginner",
    beginners: "beginners",
    mentor: "mentor",
    mentors: "mentors",
    journey: "music journey",
    subject: "song",
    requestButton: "Ask for a Mentor",
    firstSuccessHelper: "First-song helper",
  },
  beginnerCard: { title: "I'm a Beginner", description: "Find someone to help me play.", button: "Find a Mentor" },
  mentorCard: { title: "I'm a Musician", description: "Share what I know with others.", button: "Become a Mentor" },
  stagesTitle: "How it works",
  stagesSubtitle: "Five stages to playing your first song.",
  stages: [
    { title: "Create your music profile", text: "Tell us your instrument, the music you love and how much you've played." },
    { title: "Find your mentor", text: "Connect with musicians who play your instrument and style." },
    { title: "Choose your first song", text: "Pick a song together and break it into small, playable steps." },
    { title: "Share your progress", text: "Post short recordings, ask questions and get feedback." },
    { title: "Celebrate your first song", text: "Play it all the way through, share it and inspire the next beginner." },
  ],
  questions: {
    location: { label: "Where are you based?", help: "Helps with time zones and local meet-ups." },
    setting: {
      label: "What do you play?",
      help: "",
      options: [
        { value: "guitar", label: "Guitar" },
        { value: "piano", label: "Piano / keys" },
        { value: "voice", label: "Voice" },
        { value: "drums", label: "Drums" },
        { value: "other", label: "Something else" },
      ],
    },
    interests: {
      label: "What would you like to play?",
      help: "",
      options: [
        { value: "pop", label: "Pop & rock" },
        { value: "folk", label: "Folk" },
        { value: "classical", label: "Classical" },
        { value: "jazz", label: "Jazz" },
        { value: "not_sure", label: "Not sure yet" },
      ],
    },
    experience: GARDENING.questions.experience,
    helpMode: HELP_ANY,
  },
  mentorQuestions: {
    experienceLabel: "What do you play?",
    topicsLabel: "Styles or skills you'd love to teach",
    climateLabel: "Your style or scene",
    photosLabel: "Photos of you playing",
    introPlaceholder: "A few friendly lines about your music and how you like to teach.",
  },
  defaultJourneyTitle: "My first song",
  defaultMilestones: [
    { title: "Choose your song" },
    { title: "Learn the basics of your instrument" },
    { title: "First section" },
    { title: "Second section" },
    { title: "Put it together slowly" },
    { title: "Play it all the way through" },
    { title: "Share what you learned" },
  ],
  completion: {
    title: "You've learned your first song!",
    subtitle: "From the first note to the last.",
    againButton: "Learn Another Song",
    helpButton: "Help Another Beginner",
    mentorInvite: "You've learned something worth sharing. Would you like to help someone else play?",
  },
  gallery: {
    title: "Playing Together",
    subtitle: "First songs from members who chose to share their story.",
    methodLabel: "Instrument",
    methodOptions: [
      { value: "guitar", label: "Guitar" },
      { value: "piano", label: "Piano" },
      { value: "voice", label: "Voice" },
    ],
  },
});

const OFF_GRID = derive({
  category: "Off-grid living",
  tagline: "Build something. Learn together. Share the know-how.",
  heroTitle: "Adopt an Off-grid Beginner",
  heroSubtitle: "Help someone start their first off-grid project. Or find someone to guide you.",
  terms: { ...GARDENING.terms, journey: "project", subject: "project", requestButton: "Ask for a Mentor", firstSuccessHelper: "First-project helper" },
  beginnerCard: { title: "I'm Just Starting", description: "Find someone to help with my first project.", button: "Find a Mentor" },
  mentorCard: { title: "I Live Off-grid", description: "Share what I've learned.", button: "Become a Mentor" },
  stagesTitle: "How it works",
  stagesSubtitle: "Five stages to your first working off-grid system.",
  stages: [
    { title: "Create your project profile", text: "Tell us where you are, what land or space you have and what you'd like to build." },
    { title: "Find your mentor", text: "Connect with people who've built similar systems in a similar climate." },
    { title: "Plan your first project", text: "Choose one achievable project: rainwater, solar, composting or a food bed." },
    { title: "Share your progress", text: "Post photos of each step, ask questions and get advice." },
    { title: "Celebrate it working", text: "Switch it on, share what you learned and help the next beginner." },
  ],
  questions: {
    location: GARDENING.questions.location,
    setting: {
      label: "What space do you have?",
      help: "",
      options: [
        { value: "home", label: "A home or garden" },
        { value: "land", label: "Land" },
        { value: "vehicle", label: "A van or boat" },
        { value: "none", label: "Nothing yet" },
      ],
    },
    interests: {
      label: "What would you like to start?",
      help: "",
      options: [
        { value: "solar", label: "Solar power" },
        { value: "water", label: "Water collection" },
        { value: "compost", label: "Composting & waste" },
        { value: "food", label: "Growing food" },
        { value: "not_sure", label: "Not sure yet" },
      ],
    },
    experience: GARDENING.questions.experience,
    helpMode: HELP_ANY,
  },
  mentorQuestions: { ...GARDENING.mentorQuestions, experienceLabel: "What have you built or run?", topicsLabel: "Projects you'd love to help with", photosLabel: "Photos of your set-up" },
  defaultJourneyTitle: "My first off-grid project",
  defaultMilestones: [
    { title: "Choose your project" },
    { title: "Plan and budget" },
    { title: "Gather materials" },
    { title: "Build stage one" },
    { title: "Build stage two" },
    { title: "Test it" },
    { title: "It works!" },
    { title: "Share what you learned" },
  ],
  completion: {
    title: "Your first off-grid project works!",
    subtitle: "Built with your own hands.",
    againButton: "Start Another Project",
    helpButton: "Help Another Beginner",
    mentorInvite: "You've learned something worth sharing. Would you like to help someone else?",
  },
  gallery: { title: "Building Together", subtitle: "First projects from members who chose to share their story.", methodLabel: "Project type", methodOptions: [{ value: "solar", label: "Solar" }, { value: "water", label: "Water" }, { value: "compost", label: "Compost" }] },
});

const BUSINESS = derive({
  category: "Business",
  tagline: "Start something. Learn together. Share the wins.",
  heroTitle: "Adopt an Entrepreneur",
  heroSubtitle: "Help someone launch their first business idea. Or find someone to guide you.",
  terms: { ...GARDENING.terms, beginner: "founder", beginners: "founders", journey: "launch journey", subject: "idea", requestButton: "Ask for a Mentor", firstSuccessHelper: "First-launch helper" },
  beginnerCard: { title: "I Have an Idea", description: "Find someone to help me launch.", button: "Find a Mentor" },
  mentorCard: { title: "I've Built a Business", description: "Share what I've learned.", button: "Become a Mentor" },
  stagesTitle: "How it works",
  stagesSubtitle: "Five stages from idea to first customer.",
  stages: [
    { title: "Create your founder profile", text: "Tell us about your idea, your time and where you're starting from." },
    { title: "Find your mentor", text: "Connect with people who've launched in a similar field." },
    { title: "Shape your first launch", text: "Agree one small, testable offer and who it's for." },
    { title: "Share your progress", text: "Post weekly progress, questions and what customers said." },
    { title: "Celebrate your first customer", text: "Celebrate the launch, share what you learned and help the next founder." },
  ],
  questions: {
    location: GARDENING.questions.location,
    setting: { label: "How much time do you have?", help: "", options: [{ value: "evenings", label: "Evenings & weekends" }, { value: "part_time", label: "Part-time" }, { value: "full_time", label: "Full-time" }] },
    interests: { label: "What kind of business?", help: "", options: [{ value: "product", label: "A product" }, { value: "service", label: "A service" }, { value: "online", label: "Online" }, { value: "social", label: "Social enterprise" }, { value: "not_sure", label: "Not sure yet" }] },
    experience: GARDENING.questions.experience,
    helpMode: HELP_ANY,
  },
  mentorQuestions: { ...GARDENING.mentorQuestions, experienceLabel: "What have you built?", topicsLabel: "Areas you'd love to help with", climateLabel: "Your sector or market", photosLabel: "Photos of your work" },
  defaultJourneyTitle: "My first launch",
  defaultMilestones: [
    { title: "Describe the idea in one sentence" },
    { title: "Talk to five potential customers" },
    { title: "Define a first small offer" },
    { title: "Set a price" },
    { title: "Make it real" },
    { title: "First customer" },
    { title: "Share what you learned" },
  ],
  completion: { title: "You've launched!", subtitle: "From an idea to a real customer.", againButton: "Start Something Else", helpButton: "Help Another Founder", mentorInvite: "You've learned something worth sharing. Would you like to help someone else launch?" },
  gallery: { title: "Launching Together", subtitle: "First launches from members who chose to share their story.", methodLabel: "Business type", methodOptions: [{ value: "product", label: "Product" }, { value: "service", label: "Service" }, { value: "online", label: "Online" }] },
});

const PERMACULTURE = derive({
  ...GARDENING,
  category: "Permaculture",
  tagline: "Design something. Grow together. Share the abundance.",
  heroTitle: "Adopt a Grower",
  heroSubtitle: "Help someone build their first productive garden. Or find someone to guide you.",
  stages: GARDENING.stages.map(({ title, text }) => ({ title, text })),
  defaultJourneyTitle: "My first productive garden",
  defaultMilestones: [
    { title: "Observe your site through a season" },
    { title: "Sketch zones and sectors" },
    { title: "Build healthy soil" },
    { title: "Plant a first guild" },
    { title: "Set up water and mulch" },
    { title: "First harvest" },
    { title: "Share what you learned" },
  ],
  completion: { ...GARDENING.completion, title: "Your first productive garden is growing!" },
});

export const GUIDED_JOURNEY_PRESETS: GuidedJourneyPreset[] = [
  { key: "gardening", label: "Gardening — Adopt a Beginner", description: "Grow your first vegetables.", spaceName: "Adopt a Beginner", config: GARDENING, templates: GARDENING_TEMPLATES },
  { key: "sailing", label: "Sailing — Adopt a New Sailor", description: "Learn to sail.", spaceName: "Adopt a New Sailor", config: SAILING, templates: [] },
  { key: "cooking", label: "Cooking — Adopt a Beginner Cook", description: "Prepare your first five meals.", spaceName: "Adopt a Beginner Cook", config: COOKING, templates: [] },
  { key: "off_grid", label: "Off-grid — Adopt an Off-grid Beginner", description: "Start your first off-grid project.", spaceName: "Adopt an Off-grid Beginner", config: OFF_GRID, templates: [] },
  { key: "music", label: "Music — Adopt a Musician", description: "Learn your first song.", spaceName: "Adopt a Musician", config: MUSIC, templates: [] },
  { key: "business", label: "Business — Adopt an Entrepreneur", description: "Launch your first business idea.", spaceName: "Adopt an Entrepreneur", config: BUSINESS, templates: [] },
  { key: "permaculture", label: "Permaculture — Adopt a Grower", description: "Build your first productive garden.", spaceName: "Adopt a Grower", config: PERMACULTURE, templates: [] },
];

export const DEFAULT_PRESET_KEY = "gardening";

export function getPreset(key: string | null | undefined): GuidedJourneyPreset {
  return GUIDED_JOURNEY_PRESETS.find((p) => p.key === key) ?? GUIDED_JOURNEY_PRESETS[0];
}
