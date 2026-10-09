-- =============================================================================
-- Relate — weekly AI event discovery for place communities
--
-- Once a week, pg_cron asks the app to run AI event discovery (the same search
-- as the staff "Discover events" button) for every place community that has
-- it switched on, so new local events land on the calendar without anyone
-- clicking. The AI work runs in the app (it holds the Anthropic key); the
-- database only queues one webhook per community via pg_net, so each search
-- gets its own request and time limit.
--
-- Reuses the notification webhook rails from 20260728095459: the app's URL
-- (app_config.site_url) and shared secret
-- (app_config.notification_email_webhook_secret, = NOTIFICATION_EMAIL_WEBHOOK_SECRET
-- in the app's env). With either missing the run is a silent no-op.
-- =============================================================================

alter table public.communities
  add column if not exists weekly_event_discovery boolean not null default true;

create or replace function public.queue_weekly_event_discovery()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_base_url text;
  v_secret text;
  v_community record;
begin
  select value into v_base_url from public.app_config where key = 'site_url';
  select value into v_secret from public.app_config where key = 'notification_email_webhook_secret';
  if v_base_url is null or v_secret is null then
    return;
  end if;

  for v_community in
    select id from public.communities
    where template_key = 'place' and weekly_event_discovery
  loop
    perform net.http_post(
      url := v_base_url || '/api/events/discover-weekly',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'x-notification-secret', v_secret
      ),
      body := jsonb_build_object('communityId', v_community.id::text),
      -- The search itself can take a couple of minutes.
      timeout_milliseconds := 300000
    );
  end loop;
end;
$$;

revoke all on function public.queue_weekly_event_discovery() from public, anon, authenticated;

-- Mondays 05:17 UTC (08:17 in East Africa), so the week's events are in
-- before people plan it. Best-effort, like live-event-reminders: without
-- pg_cron the block is skipped and the button still works. Re-running
-- replaces the job.
do $$
begin
  execute 'create extension if not exists pg_cron';

  begin
    perform cron.unschedule('weekly-event-discovery');
  exception when others then null;
  end;

  perform cron.schedule('weekly-event-discovery', '17 5 * * 1', 'select public.queue_weekly_event_discovery();');
exception when others then
  raise notice 'pg_cron unavailable; weekly event discovery not scheduled (%)', sqlerrm;
end $$;
