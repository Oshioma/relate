-- =============================================================================
-- Relate — Live Events reminders (Phase B)
--
-- Sends a 'live_reminder' notification to everyone who RSVP'd to a scheduled
-- session, shortly before it starts. Reuses the notification rails (so each
-- reminder is emailed and streams to the bell); the only new infrastructure is
-- a pg_cron job that calls the function every few minutes.
--
-- reminder_sent_at guards against duplicate reminders — once a session's window
-- is processed it's stamped and never re-scanned. Safe to re-run.
-- =============================================================================

alter table public.live_sessions
  add column if not exists reminder_sent_at timestamptz;

-- Notify RSVPers of sessions due to start within the next 10 minutes (and not
-- more than an hour past, to skip stale scheduled rows), then mark those
-- sessions reminded. SECURITY DEFINER so it can write notifications, mirroring
-- the notify_* trigger functions.
create or replace function public.send_live_event_reminders()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notifications (user_id, community_id, type, title, body, link, actor_id)
  select
    r.user_id,
    s.community_id,
    'live_reminder',
    s.title || ' starts soon',
    'Starts ' || to_char(s.scheduled_start at time zone 'UTC', 'Mon DD, HH24:MI') || ' UTC',
    '/c/' || c.slug || '/spaces/' || sp.slug,
    s.started_by
  from public.live_sessions s
  join public.communities c on c.id = s.community_id
  join public.spaces sp on sp.id = s.space_id
  join public.live_session_rsvps r on r.session_id = s.id
  where s.status = 'scheduled'
    and s.reminder_sent_at is null
    and s.scheduled_start is not null
    and s.scheduled_start <= now() + interval '10 minutes'
    and s.scheduled_start > now() - interval '1 hour'
    and public.can_view_space(s.space_id, r.user_id);

  update public.live_sessions s
  set reminder_sent_at = now()
  where s.status = 'scheduled'
    and s.reminder_sent_at is null
    and s.scheduled_start is not null
    and s.scheduled_start <= now() + interval '10 minutes'
    and s.scheduled_start > now() - interval '1 hour';
end;
$$;

-- Schedule the function every 5 minutes with pg_cron. Best-effort: on a
-- database where pg_cron can't be enabled the whole block is skipped (a notice
-- is raised) and reminders simply don't fire — the rest of Live Events is
-- unaffected. Re-running replaces the existing job.
do $$
begin
  execute 'create extension if not exists pg_cron';

  -- Drop any prior copy of the job so re-running doesn't stack duplicates.
  begin
    perform cron.unschedule('live-event-reminders');
  exception when others then null;
  end;

  perform cron.schedule('live-event-reminders', '*/5 * * * *', 'select public.send_live_event_reminders();');
exception when others then
  raise notice 'pg_cron unavailable; live event reminders not scheduled (%)', sqlerrm;
end $$;
