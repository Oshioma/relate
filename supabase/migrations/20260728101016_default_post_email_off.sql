-- =============================================================================
-- Relate — default the 'post' email to off (opt-in)
--
-- A new post notifies every member who can see it, so emailing all of them by
-- default is noisy. Make 'post' opt-in: with no explicit preference row it's
-- OFF, while every other type stays opt-out (no row = on). An explicit row in
-- notification_email_preferences (set from the settings toggle) always wins, so
-- a member who turns post emails on keeps them.
--
-- Only the effective-default logic changes; the rest of email_notification() is
-- unchanged from 20260728100404_notification_email_preferences.sql. Safe to
-- re-run.
-- =============================================================================

create or replace function public.email_notification()
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
  -- Effective preference: an explicit row wins; otherwise 'post' defaults off,
  -- everything else defaults on.
  v_default := (new.type <> 'post');
  select enabled into v_enabled
  from public.notification_email_preferences
  where user_id = new.user_id and type = new.type;

  if not coalesce(v_enabled, v_default) then
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
