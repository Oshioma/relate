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
  type LucideIcon,
} from "lucide-react";
import type { SpaceType } from "@/types/database";

export interface SpaceTypeMeta {
  type: SpaceType;
  label: string;
  icon: LucideIcon;
  description: string;
}

// Every type renders the plain discussion feed today except 'resources'
// (see src/app/c/[communitySlug]/spaces/[spaceSlug]/page.tsx). The rest are
// real, admin-choosable categories — dedicated rendering per type lands in
// follow-up rounds (Journal, Directory, Growth Journey, Challenges).
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
};

export const SPACE_TYPE_LIST = Object.values(SPACE_TYPES);
