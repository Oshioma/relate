-- =============================================================================
-- Relate — per-member email notification preferences
--
-- Notifications always appear in the bell; this lets a member opt out of the
-- email copy per type (e.g. keep claim emails, silence the email for every new
-- post). Opt-out model: no row means enabled, so existing members keep getting
-- emails until they turn something off. The email_notification() trigger checks
-- this before firing the webhook, so a silenced type never even makes the HTTP
-- call. Safe to re-run.
-- =============================================================================

create table if not exists public.notification_email_preferences (
  user_id uuid not null references public.profiles (id) on delete cascade,
  type public.notification_type not null,
  enabled boolean not null default true,
  primary key (user_id, type)
);

alter table public.notification_email_preferences enable row level security;

-- Each member reads and writes only their own preferences.
drop policy if exists "notification_email_prefs_select_own" on public.notification_email_preferences;
create policy "notification_email_prefs_select_own" on public.notification_email_preferences
  for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "notification_email_prefs_insert_own" on public.notification_email_preferences;
create policy "notification_email_prefs_insert_own" on public.notification_email_preferences
  for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists "notification_email_prefs_update_own" on public.notification_email_preferences;
create policy "notification_email_prefs_update_own" on public.notification_email_preferences
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "notification_email_prefs_delete_own" on public.notification_email_preferences;
create policy "notification_email_prefs_delete_own" on public.notification_email_preferences
  for delete to authenticated
  using (user_id = auth.uid());

-- Extend the webhook trigger: skip the email when the recipient has turned this
-- type off. Everything else is unchanged from
-- 20260728095459_email_on_notification_insert.sql.
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
  -- Respect the recipient's per-type email preference (defaults to on).
  if exists (
    select 1 from public.notification_email_preferences p
    where p.user_id = new.user_id and p.type = new.type and p.enabled = false
  ) then
    return new;
  end if;

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
