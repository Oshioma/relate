-- =============================================================================
-- Relate — Web push notifications
--
-- The bell notification and its email copy already exist; this adds a browser/
-- mobile push copy. A member enables push per device (Settings → Push), which
-- stores a Web Push subscription here. A trigger mirrors email_notification():
-- on a new notification it posts the row id to /api/notifications/push, which
-- looks the row up and pushes to the member's devices via the web-push protocol.
--
-- One toggle governs both channels: push reuses notification_email_preferences,
-- so silencing a type's email silences its push too. The push webhook reuses the
-- same secret as email (notification_email_webhook_secret / the
-- NOTIFICATION_EMAIL_WEBHOOK_SECRET env), so operators configure one secret.
--
-- Safe to re-run.
-- =============================================================================

-- One row per (member, device/browser). endpoint is the push service URL and is
-- globally unique; p256dh/auth are the subscription's public key material used
-- to encrypt the payload (RFC 8291). Written by the member for their own rows;
-- the service-role webhook reads all and prunes expired ones.
create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);

create index if not exists push_subscriptions_user_idx on public.push_subscriptions (user_id);

alter table public.push_subscriptions enable row level security;

drop policy if exists "push_subscriptions_select_own" on public.push_subscriptions;
create policy "push_subscriptions_select_own" on public.push_subscriptions
  for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "push_subscriptions_insert_own" on public.push_subscriptions;
create policy "push_subscriptions_insert_own" on public.push_subscriptions
  for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists "push_subscriptions_delete_own" on public.push_subscriptions;
create policy "push_subscriptions_delete_own" on public.push_subscriptions
  for delete to authenticated
  using (user_id = auth.uid());

-- Fire a push webhook on a new notification, mirroring email_notification():
-- respect the recipient's per-type preference (defaults to on; 'post' is the
-- only opt-in default, matching the email trigger), skip when the member has no
-- push subscription, and skip when the webhook isn't configured.
create or replace function public.push_notification()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_base_url text;
  v_secret text;
  v_enabled boolean;
  v_default boolean;
begin
  -- Effective preference (shared with email): explicit row wins; 'post'
  -- defaults off, everything else defaults on.
  v_default := (new.type <> 'post');
  select enabled into v_enabled
  from public.notification_email_preferences
  where user_id = new.user_id and type = new.type;
  if not coalesce(v_enabled, v_default) then
    return new;
  end if;

  -- No device subscribed — nothing to push to.
  if not exists (select 1 from public.push_subscriptions s where s.user_id = new.user_id) then
    return new;
  end if;

  select value into v_base_url from public.app_config where key = 'site_url';
  select value into v_secret from public.app_config where key = 'notification_email_webhook_secret';
  if v_base_url is null or v_secret is null then
    return new;
  end if;

  perform net.http_post(
    url := v_base_url || '/api/notifications/push',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-notification-secret', v_secret
    ),
    body := jsonb_build_object('id', new.id::text)
  );

  return new;
end;
$$;

drop trigger if exists trg_push_notification on public.notifications;
create trigger trg_push_notification
  after insert on public.notifications
  for each row execute function public.push_notification();
