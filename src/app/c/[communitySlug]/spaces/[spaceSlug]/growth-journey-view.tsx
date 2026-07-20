"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Sparkles, MessageSquare, NotebookPen, CalendarCheck, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";
import { groupByMonth, buildAnnualRecap, type TimelineEvent, type TimelineEventType } from "@/lib/data/growth-journey";

const EVENT_ICON: Record<TimelineEventType, typeof MessageSquare> = {
  post: MessageSquare,
  journal_entry: NotebookPen,
  event_attended: CalendarCheck,
};

const EVENT_LABEL: Record<TimelineEventType, string> = {
  post: "Post",
  journal_entry: "Journal",
  event_attended: "Event",
};

export function GrowthJourneyView({ events }: { events: TimelineEvent[] }) {
  const [showRecap, setShowRecap] = useState(false);
  const groups = useMemo(() => groupByMonth(events), [events]);
  const currentYear = new Date().getFullYear();
  const recap = useMemo(() => buildAnnualRecap(events, currentYear), [events, currentYear]);

  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
          <Sparkles className="h-6 w-6 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">Your journey starts here</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Post in a discussion, log a journal entry, or RSVP to an event in this community, and it&apos;ll show up here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={() => setShowRecap((v) => !v)}
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <Sparkles className="h-3.5 w-3.5" />
          {showRecap ? "Hide" : "Show"} {currentYear} Recap
          {showRecap ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      </div>

      {showRecap && (
        <Card className="mb-6 border-accent/30 bg-accent-soft">
          <CardContent className="pt-5">
            <p className="text-sm font-semibold text-foreground">Your {currentYear} Recap</p>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <RecapStat label="Posts shared" value={recap.posts} />
              <RecapStat label="Journal entries" value={recap.journalEntries} />
              <RecapStat label="Events attended" value={recap.eventsAttended} />
              <RecapStat label="Longest streak" value={recap.longestStreakDays} suffix=" days" />
            </div>
            {recap.mostActiveMonth && <p className="mt-3 text-xs text-muted-foreground">Most active month: {recap.mostActiveMonth}</p>}
          </CardContent>
        </Card>
      )}

      <div className="space-y-8">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{group.label}</p>
            <div className="space-y-2 border-l-2 border-border pl-4">
              {group.events.map((event) => {
                const Icon = EVENT_ICON[event.type];
                const body = (
                  <Card className="transition-shadow hover:shadow-sm">
                    <CardContent className="flex items-start gap-3 pt-4">
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate text-sm font-medium text-foreground">{event.title}</p>
                          <Badge tone="neutral">{EVENT_LABEL[event.type]}</Badge>
                        </div>
                        {event.summary && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{event.summary}</p>}
                        <p className="mt-1 text-xs text-muted-foreground">{formatRelativeTime(event.occurredAt)}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
                return event.href ? (
                  <Link key={event.id} href={event.href}>
                    {body}
                  </Link>
                ) : (
                  <div key={event.id}>{body}</div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecapStat({ label, value, suffix = "" }: { label: string; value: number; suffix?: string }) {
  return (
    <div>
      <p className="text-xl font-semibold text-foreground">
        {value}
        {suffix}
      </p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
