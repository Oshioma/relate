-- =============================================================================
-- Relate — stream meetups so a "Happening Now" board updates itself
--
-- The Meetups space is server-rendered, so without this a member staring at the
-- board would only see a new walk (or a new "I'm in") on their next navigation
-- — which defeats the point of a space built for the next 40 minutes. Adding
-- both tables to the realtime publication lets a small client watcher refresh
-- the board the moment anything changes.
--
-- RLS still applies to the stream, so a subscriber only receives rows from
-- spaces they can see. REPLICA IDENTITY FULL so DELETE payloads carry the
-- columns the client filters on. Safe to re-run.
-- =============================================================================

do $$ begin
  create publication supabase_realtime;
exception when duplicate_object then null; end $$;

do $$ begin
  alter publication supabase_realtime add table public.meetups;
exception when duplicate_object then null; end $$;

do $$ begin
  alter publication supabase_realtime add table public.meetup_participants;
exception when duplicate_object then null; end $$;

alter table public.meetups replica identity full;
alter table public.meetup_participants replica identity full;
