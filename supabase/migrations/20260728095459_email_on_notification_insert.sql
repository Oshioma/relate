-- =============================================================================
-- Relate — email every in-app notification
--
-- The bell notifications (comment, post, membership, claim) are all created by
-- SECURITY DEFINER triggers that already compute the exact recipient for each
-- row. Rather than replicate that per-event fan-out in application code, we
-- email off the notifications table itself: one AFTER INSERT trigger fires a
-- webhook (via pg_net) to /api/notifications/email, which looks up the
-- recipient's address and sends the email through Resend. Add a new
-- notification type in future and it's emailed for free.
--
-- Fire-and-forget: pg_net queues the HTTP request outside the inserting
-- transaction, so a slow or down mailer never blocks — or fails — the write
-- that created the notification.
--
-- SETUP (all optional — with none of it, notifications still work in-app and
-- this trigger is a silent no-op):
--   1. Enable the pg_net extension (this migration does it; on hosted Supabase
--      it's available by default).
--   2. Tell the database where to reach the app and how to authenticate the
--      webhook, by inserting two rows into public.app_config:
--        insert into public.app_config (key, value) values
--          ('site_url', 'https://your-platform-apex'),
--          ('notification_email_webhook_secret', '<a long random string>')
--        on conflict (key) do update set value = excluded.value;
--      Use the PLATFORM origin (not a community subdomain) for site_url.
--   3. Set NOTIFICATION_EMAIL_WEBHOOK_SECRET in the app's env to the same
--      secret, and configure Resend (RESEND_API_KEY) so the route can send.
-- =============================================================================

create extension if not exists pg_net;

-- Small server-only key/value store for values the database needs at trigger
-- time (the app's public URL, the webhook shared secret). RLS is enabled with
-- no policies, so the `authenticated` role can never read it; only the
-- SECURITY DEFINER trigger below (and the service role) can.
create table if not exists public.app_config (
  key text primary key,
  value text not null
);

alter table public.app_config enable row level security;

create or replace function public.email_notification()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_base_url text;
  v_secret text;
begin
  select value into v_base_url from public.app_config where key = 'site_url';
  select value into v_secret from public.app_config where key = 'notification_email_webhook_secret';

  -- Not configured yet — the in-app notification stands on its own.
  if v_base_url is null or v_secret is null then
    return new;
  end if;

  perform net.http_post(
    url := v_base_url || '/api/notifications/email',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-notification-secret', v_secret
    ),
    body := jsonb_build_object('id', new.id::text)
  );

  return new;
end;
$$;

drop trigger if exists trg_email_notification on public.notifications;
create trigger trg_email_notification
  after insert on public.notifications
  for each row execute function public.email_notification();
