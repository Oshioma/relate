"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Footprints } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { createClient } from "@/lib/supabase/client";
import { NewMeetupForm } from "./new-meetup-form";
import { MeetupCard } from "./meetup-card";
import { meetupPhase, type MeetupPhase } from "@/lib/meetups";
import type { MeetupWithGoing } from "@/lib/data/meetups";

// The shelves, in the order they matter to someone deciding what to do with
// the next hour.
const SHELVES: { phase: MeetupPhase; title: string; blurb: string }[] = [
  { phase: "now", title: "On now", blurb: "Out the door — you can still catch these." },
  { phase: "soon", title: "Starting soon", blurb: "In the next few hours." },
  { phase: "later", title: "Later on", blurb: "Planned ahead — say now if you're coming." },
  { phase: "cancelled", title: "Called off", blurb: "Not happening after all." },
  { phase: "past", title: "Recent", blurb: "What this community has already done together." },
];

export function MeetupsView({
  meetups,
  communityId,
  communitySlug,
  spaceId,
  spaceSlug,
  activityLabel,
  canPost,
  isStaff,
  userId,
}: {
  meetups: MeetupWithGoing[];
  communityId: string;
  communitySlug: string;
  spaceId: string;
  spaceSlug: string;
  activityLabel: string | null;
  canPost: boolean;
  isStaff: boolean;
  userId: string;
}) {
  const [showForm, setShowForm] = useState(false);
  // The board is entirely about time, so it keeps its own clock: without this a
  // tab left open would still be advertising a walk that finished an hour ago.
  const [now, setNow] = useState(() => Date.now());
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(timer);
  }, []);

  // Somebody else posting a walk, or tapping "I'm in" on yours, has to show up
  // here without a reload — that's the whole promise of the space. RLS scopes
  // the stream to rows the viewer can already see; the space_id filter keeps it
  // to this board. Participant rows carry no space_id, so those are watched
  // unfiltered and simply refresh the page.
  useEffect(() => {
    if (!spaceId) return;
    const supabase = createClient();
    let active = true;
    const refresh = () => {
      if (active) router.refresh();
    };

    const channel = supabase
      .channel(`meetups:${spaceId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "meetups", filter: `space_id=eq.${spaceId}` }, refresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "meetup_participants" }, refresh);

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      if (data.session) supabase.realtime.setAuth(data.session.access_token);
      channel.subscribe();
    });

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [spaceId, router]);

  const shelved = useMemo(() => {
    const byPhase = new Map<MeetupPhase, MeetupWithGoing[]>();
    for (const data of meetups) {
      const phase = meetupPhase(data.meetup, now);
      const list = byPhase.get(phase) ?? [];
      list.push(data);
      byPhase.set(phase, list);
    }
    // Past meetups read best newest-first; everything ahead reads soonest-first,
    // which is the order the query already returns.
    byPhase.get("past")?.reverse();
    return byPhase;
  }, [meetups, now]);

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Post what you&apos;re doing and when. Everyone gets told, and whoever&apos;s free taps <span className="font-medium text-foreground">I&apos;m in</span>.
        </p>
        {canPost && (
          <Button type="button" onClick={() => setShowForm((v) => !v)} className="w-auto shrink-0">
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? "Cancel" : "Post a meetup"}
          </Button>
        )}
      </div>

      {showForm && (
        <div className="mb-5">
          <NewMeetupForm
            communityId={communityId}
            communitySlug={communitySlug}
            spaceId={spaceId}
            spaceSlug={spaceSlug}
            activityLabel={activityLabel}
            onDone={() => setShowForm(false)}
          />
        </div>
      )}

      {meetups.length === 0 ? (
        <EmptyState
          icon={<Footprints className="h-6 w-6" />}
          title="Nothing on yet"
          description="Be the first — post where you're going and when, and see who comes along."
        />
      ) : (
        <div className="space-y-8">
          {SHELVES.map((shelf) => {
            const items = shelved.get(shelf.phase) ?? [];
            if (items.length === 0) return null;
            return (
              <section key={shelf.phase}>
                <h2 className="text-sm font-semibold text-foreground">{shelf.title}</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">{shelf.blurb}</p>
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  {items.map((data) => (
                    <MeetupCard
                      key={data.meetup.id}
                      data={data}
                      communitySlug={communitySlug}
                      spaceSlug={spaceSlug}
                      canManage={isStaff || data.meetup.created_by === userId}
                      canInteract={canPost}
                      now={now}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
