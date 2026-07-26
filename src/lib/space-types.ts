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
  GraduationCap,
  Leaf,
  ScanLine,
  Wheat,
  type LucideIcon,
} from "lucide-react";
import type { SpaceType } from "@/types/database";

// The buckets space types are grouped under in the "add a space" picker and in
// the super admin's pool controls. Purely presentational — it decides how the
// list of types is organised for admins, not what any type does.
export type SpaceTypeCategory = "general" | "programs" | "place";

export interface SpaceTypeCategoryMeta {
  key: SpaceTypeCategory;
  label: string;
  description: string;
}

// Display order of the categories.
export const SPACE_TYPE_CATEGORIES: SpaceTypeCategoryMeta[] = [
  { key: "general", label: "General", description: "Everyday spaces most communities use." },
  { key: "programs", label: "Learning & Programs", description: "Structured, time-based or progress-tracked spaces." },
  { key: "place", label: "Place-based", description: "Spaces for a physical place — map, directory, marketplace and more." },
];

export interface SpaceTypeMeta {
  type: SpaceType;
  label: string;
  icon: LucideIcon;
  description: string;
  category: SpaceTypeCategory;
}

// All types except 'gallery', 'qa', and 'custom' have dedicated rendering
// (see src/app/c/[communitySlug]/spaces/[spaceSlug]/page.tsx); the rest
// still fall back to the plain discussion feed. The nine Place-Based
// Community types below (map through recommendations) are new, real
// categories admins can pick today — dedicated rendering (an actual map,
// listing cards, etc.) is follow-up work, same as challenges/journal/etc.
// were before they got their own views.
export const SPACE_TYPES: Record<SpaceType, SpaceTypeMeta> = {
  discussion: { type: "discussion", label: "Discussion", icon: MessageSquare, description: "An open feed where members post and comment.", category: "general" },
  journal: { type: "journal", label: "Journal", icon: NotebookPen, description: "Members log entries over time.", category: "general" },
  gallery: { type: "gallery", label: "Gallery", icon: Images, description: "A visual feed for photos members share.", category: "general" },
  resources: { type: "resources", label: "Resources", icon: BookOpen, description: "Links, files and guides scoped to this space.", category: "general" },
  directory: { type: "directory", label: "Directory", icon: Users, description: "A searchable list of members.", category: "general" },
  challenges: { type: "challenges", label: "Challenges", icon: Flag, description: "Time-boxed programs members join together.", category: "programs" },
  growth_journey: { type: "growth_journey", label: "Growth Journey", icon: Sprout, description: "Members' personal progress over time.", category: "programs" },
  qa: { type: "qa", label: "Q&A", icon: CircleQuestionMark, description: "Members ask questions and discuss answers.", category: "general" },
  custom: { type: "custom", label: "Custom", icon: Sparkles, description: "A general-purpose space.", category: "general" },
  map: { type: "map", label: "Explore Map", icon: Map, description: "An interactive map of the places that make up this community.", category: "place" },
  marketplace: { type: "marketplace", label: "Marketplace", icon: Store, description: "Buy, sell and trade goods, services and more locally.", category: "place" },
  business_directory: { type: "business_directory", label: "Business Directory", icon: Building2, description: "Local businesses with profiles, hours and reviews.", category: "place" },
  guides: { type: "guides", label: "Guides", icon: BookOpenCheck, description: "Member-written guides to the best this place has to offer.", category: "place" },
  clubs: { type: "clubs", label: "Clubs & Groups", icon: UsersRound, description: "Subcommunities members can join around shared interests.", category: "place" },
  volunteer_hub: { type: "volunteer_hub", label: "Volunteer Hub", icon: HandHeart, description: "Projects, causes and requests members can help with.", category: "place" },
  jobs: { type: "jobs", label: "Jobs Board", icon: Briefcase, description: "Local job, volunteer and internship listings.", category: "place" },
  accommodation: { type: "accommodation", label: "Accommodation", icon: BedDouble, description: "Places to stay, from short lets to long-term rentals.", category: "place" },
  recommendations: { type: "recommendations", label: "Recommendations", icon: Star, description: "Member recommendations for restaurants, services and more.", category: "place" },
  course: { type: "course", label: "Courses", icon: GraduationCap, description: "Structured courses members enrol in and work through lesson by lesson.", category: "programs" },
  crop_guides: { type: "crop_guides", label: "Crop Guides", icon: Leaf, description: "A searchable library of organic, region-aware growing guides — from seed to harvest.", category: "programs" },
  plant_scanner: { type: "plant_scanner", label: "Plant Health Scanner", icon: ScanLine, description: "Upload a plant photo for an AI diagnosis of pests, diseases and deficiencies, with organic treatment.", category: "programs" },
  my_crops: { type: "my_crops", label: "My Crops", icon: Wheat, description: "A member's own crops, synced read-only from the shamba.online farm app, filterable by farm.", category: "programs" },
};

export const SPACE_TYPE_LIST = Object.values(SPACE_TYPES);

// The space types in each category, in the same order as SPACE_TYPES. Used to
// render the "add a space" picker and the super admin's pool controls grouped
// by category. Only categories that actually have (allowed) types show up.
export function groupSpaceTypesByCategory(types: SpaceTypeMeta[] = SPACE_TYPE_LIST): { category: SpaceTypeCategoryMeta; types: SpaceTypeMeta[] }[] {
  return SPACE_TYPE_CATEGORIES.map((category) => ({
    category,
    types: types.filter((t) => t.category === category.key),
  })).filter((group) => group.types.length > 0);
}
