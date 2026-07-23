import {
  MessageSquare,
  NotebookPen,
  Images,
  BookOpen,
  Users,
  Flag,
  Sprout,
  CircleQuestionMark,
  Sparkles,
  Map,
  Store,
  Building2,
  BookOpenCheck,
  UsersRound,
  HandHeart,
  Briefcase,
  BedDouble,
  Star,
  CalendarDays,
  type LucideIcon,
} from "lucide-react";
import type { SpaceType } from "@/types/database";

export interface SpaceTypeMeta {
  type: SpaceType;
  label: string;
  icon: LucideIcon;
  description: string;
}

// All types except 'gallery', 'qa', and 'custom' have dedicated rendering
// (see src/app/c/[communitySlug]/spaces/[spaceSlug]/page.tsx); the rest
// still fall back to the plain discussion feed. The nine Place-Based
// Community types below (map through recommendations) are new, real
// categories admins can pick today — dedicated rendering (an actual map,
// listing cards, etc.) is follow-up work, same as challenges/journal/etc.
// were before they got their own views. 'events' is different again: it
// isn't a content container at all, just a nav pointer — that page redirects
// straight to /c/[slug]/events, which is its own route backed by the
// community-scoped `events` table (see src/types/database.ts's Event type).
export const SPACE_TYPES: Record<SpaceType, SpaceTypeMeta> = {
  discussion: { type: "discussion", label: "Discussion", icon: MessageSquare, description: "An open feed where members post and comment." },
  journal: { type: "journal", label: "Journal", icon: NotebookPen, description: "Members log entries over time." },
  gallery: { type: "gallery", label: "Gallery", icon: Images, description: "A visual feed for photos members share." },
  resources: { type: "resources", label: "Resources", icon: BookOpen, description: "Links, files and guides scoped to this space." },
  directory: { type: "directory", label: "Directory", icon: Users, description: "A searchable list of members." },
  challenges: { type: "challenges", label: "Challenges", icon: Flag, description: "Time-boxed programs members join together." },
  growth_journey: { type: "growth_journey", label: "Growth Journey", icon: Sprout, description: "Members' personal progress over time." },
  qa: { type: "qa", label: "Q&A", icon: CircleQuestionMark, description: "Members ask questions and discuss answers." },
  custom: { type: "custom", label: "Custom", icon: Sparkles, description: "A general-purpose space." },
  map: { type: "map", label: "Explore Map", icon: Map, description: "An interactive map of the places that make up this community." },
  marketplace: { type: "marketplace", label: "Marketplace", icon: Store, description: "Buy, sell and trade goods, services and more locally." },
  business_directory: { type: "business_directory", label: "Business Directory", icon: Building2, description: "Local businesses with profiles, hours and reviews." },
  guides: { type: "guides", label: "Guides", icon: BookOpenCheck, description: "Member-written guides to the best this place has to offer." },
  clubs: { type: "clubs", label: "Clubs & Groups", icon: UsersRound, description: "Subcommunities members can join around shared interests." },
  volunteer_hub: { type: "volunteer_hub", label: "Volunteer Hub", icon: HandHeart, description: "Projects, causes and requests members can help with." },
  jobs: { type: "jobs", label: "Jobs Board", icon: Briefcase, description: "Local job, volunteer and internship listings." },
  accommodation: { type: "accommodation", label: "Accommodation", icon: BedDouble, description: "Places to stay, from short lets to long-term rentals." },
  recommendations: { type: "recommendations", label: "Recommendations", icon: Star, description: "Member recommendations for restaurants, services and more." },
  events: { type: "events", label: "Events", icon: CalendarDays, description: "Community-wide events calendar — links to the Events page." },
};

export const SPACE_TYPE_LIST = Object.values(SPACE_TYPES);
