import {
  Building2,
  CalendarDays,
  BookOpenCheck,
  Store,
  Briefcase,
  BedDouble,
  HandHeart,
  UsersRound,
  Star,
  MapPin,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";
import type { ConciergeResultType } from "@/lib/data/concierge";

export const CONCIERGE_RESULT_META: Record<ConciergeResultType, { label: string; icon: LucideIcon }> = {
  business: { label: "Businesses", icon: Building2 },
  event: { label: "Events", icon: CalendarDays },
  guide: { label: "Guides", icon: BookOpenCheck },
  marketplace_listing: { label: "Marketplace", icon: Store },
  job_listing: { label: "Jobs", icon: Briefcase },
  accommodation_listing: { label: "Accommodation", icon: BedDouble },
  volunteer_project: { label: "Volunteer Hub", icon: HandHeart },
  club: { label: "Clubs & Groups", icon: UsersRound },
  recommendation: { label: "Recommendations", icon: Star },
  landmark: { label: "Map Pins", icon: MapPin },
  post: { label: "Discussions", icon: MessageSquare },
};

export const CONCIERGE_EXAMPLE_QUESTIONS = [
  "Where should I eat tonight?",
  "Find a plumber nearby",
  "What's happening this weekend?",
  "Show quiet beaches",
  "Find coworking spaces",
  "Show family-friendly activities",
  "Best cafés with Wi-Fi",
] as const;
