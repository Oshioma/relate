import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { getMemberPosts } from "@/lib/data/posts";
import { getMemberJournalEntries } from "@/lib/data/journal";
import { getMemberEventAttendance } from "@/lib/data/events";

type Client = SupabaseClient<Database>;

export type TimelineEventType = "post" | "journal_entry" | "event_attended";

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  title: string;
  summary: string | null;
  occurredAt: string;
  href: string | null;
}

// Growth Journey has no table of its own — it's a read-only aggregate over
// content that already exists (posts, journal entries, event RSVPs), fetched
// in parallel and merged chronologically. Adding a new activity source later
// means adding one more query here, not a migration.
export async function getMemberTimeline(supabase: Client, communityId: string, communitySlug: string, profileId: string): Promise<TimelineEvent[]> {
  const [posts, journalEntries, attendance] = await Promise.all([
    getMemberPosts(supabase, communityId, profileId),
    getMemberJournalEntries(supabase, communityId, profileId),
    getMemberEventAttendance(supabase, communityId, profileId),
  ]);

  const events: TimelineEvent[] = [
    ...posts.map((post) => ({
      id: `post:${post.id}`,
      type: "post" as const,
      title: post.title,
      summary: post.body,
      occurredAt: post.created_at,
      href: `/c/${communitySlug}/spaces/${post.space.slug}/posts/${post.id}`,
    })),
    ...journalEntries.map((entry) => ({
      id: `journal:${entry.id}`,
      type: "journal_entry" as const,
      title: `Logged an entry in ${entry.space.name}`,
      summary: null,
      occurredAt: entry.created_at,
      href: `/c/${communitySlug}/spaces/${entry.space.slug}`,
    })),
    ...attendance.map((rsvp) => ({
      id: `event:${rsvp.id}`,
      type: "event_attended" as const,
      title: `Attended ${rsvp.event.title}`,
      summary: rsvp.event.location,
      occurredAt: rsvp.created_at,
      href: `/c/${communitySlug}/events`,
    })),
  ];

  return events.sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());
}

export interface TimelineMonthGroup {
  label: string;
  events: TimelineEvent[];
}

export function groupByMonth(events: TimelineEvent[]): TimelineMonthGroup[] {
  const groups = new Map<string, TimelineEvent[]>();
  for (const event of events) {
    const label = new Date(event.occurredAt).toLocaleString("en-US", { month: "long", year: "numeric" });
    (groups.get(label) ?? groups.set(label, []).get(label)!).push(event);
  }
  return Array.from(groups.entries()).map(([label, events]) => ({ label, events }));
}

export interface AnnualRecap {
  year: number;
  posts: number;
  journalEntries: number;
  eventsAttended: number;
  mostActiveMonth: string | null;
  longestStreakDays: number;
}

export function buildAnnualRecap(events: TimelineEvent[], year: number): AnnualRecap {
  const yearEvents = events.filter((e) => new Date(e.occurredAt).getFullYear() === year);

  const monthCounts = new Map<string, number>();
  const days = new Set<string>();

  for (const event of yearEvents) {
    const occurred = new Date(event.occurredAt);
    const monthKey = occurred.toLocaleString("en-US", { month: "long" });
    monthCounts.set(monthKey, (monthCounts.get(monthKey) ?? 0) + 1);
    days.add(occurred.toISOString().slice(0, 10));
  }

  const sortedDays = Array.from(days).sort();
  let longestStreak = 0;
  let currentStreak = 0;
  let prev: Date | null = null;
  for (const day of sortedDays) {
    const date = new Date(day);
    currentStreak = prev && (date.getTime() - prev.getTime()) / 86400000 === 1 ? currentStreak + 1 : 1;
    longestStreak = Math.max(longestStreak, currentStreak);
    prev = date;
  }

  let mostActiveMonth: string | null = null;
  let mostActiveCount = 0;
  for (const [month, count] of monthCounts) {
    if (count > mostActiveCount) {
      mostActiveMonth = month;
      mostActiveCount = count;
    }
  }

  return {
    year,
    posts: yearEvents.filter((e) => e.type === "post").length,
    journalEntries: yearEvents.filter((e) => e.type === "journal_entry").length,
    eventsAttended: yearEvents.filter((e) => e.type === "event_attended").length,
    mostActiveMonth,
    longestStreakDays: longestStreak,
  };
}
