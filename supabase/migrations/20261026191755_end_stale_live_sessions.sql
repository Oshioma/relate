-- =============================================================================
-- Relate — Live Events: end sessions nobody is in any more
--
-- A live session only ended when staff pressed "End session". Hanging up
-- inside the meeting, closing the tab or losing the connection left the row
-- at status 'live', so the header "Live now!" badge (and the Join now card)
-- stayed on long after the call was over.
--
-- Now anyone with the meeting open stamps last_seen_at about once a minute
-- (touch_live_session, called from the room in the browser). A pg_cron job
-- runs every 5 minutes and ends any live session that nobody has stamped for
-- 15 minutes (counting from started_at when it was never stamped). Ending it
-- is the same update "End session" makes, so realtime clears the badge for
-- everyone. Safe to re-run.
-- =============================================================================

alter table public.live_sessions
  add column if not exists last_seen_at timestamptz;

-- "Someone is still in this meeting." Members can't update live_sessions
-- (RLS is staff-only), so this is security definer and checks for itself that
-- the caller can view the session's space. It only touches a live row.
create or replace function public.touch_live_session(p_session_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.live_sessions
     set last_seen_at = now()
   where id = p_session_id
     and status = 'live'
     and public.can_view_space(space_id, auth.uid());
end;
$$;

revoke all on function public.touch_live_session(uuid) from public;
grant execute on function public.touch_live_session(uuid) to authenticated;

-- End every live session with nobody in it for 15 minutes. Returns how many
-- it ended.
create or replace function public.end_stale_live_sessions()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  ended_count integer;
begin
  update public.live_sessions
     set status = 'ended',
         ended_at = coalesce(last_seen_at, started_at, now())
   where status = 'live'
     and coalesce(last_seen_at, started_at) < now() - interval '15 minutes';
  get diagnostics ended_count = row_count;
  return ended_count;
end;
$$;

revoke all on function public.end_stale_live_sessions() from public, anon, authenticated;

-- Every 5 minutes with pg_cron, like the live event reminders. Best-effort: if
-- pg_cron can't be enabled the block is skipped with a notice. Re-running
-- replaces the existing job.
do $$
begin
  execute 'create extension if not exists pg_cron';

  begin
    perform cron.unschedule('end-stale-live-sessions');
  exception when others then null;
  end;

  perform cron.schedule('end-stale-live-sessions', '*/5 * * * *', 'select public.end_stale_live_sessions();');
exception when others then
  raise notice 'pg_cron unavailable; stale live sessions will not be ended automatically (%)', sqlerrm;
end $$;
