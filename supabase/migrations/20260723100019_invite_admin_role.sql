-- =============================================================================
-- Relate — allow inviting members directly as admin, and re-adding an
-- already-registered user by email
--
-- Run this after supabase/invites.sql and supabase/email-invites.sql. Safe
-- to re-run.
-- =============================================================================

alter table public.community_invites drop constraint if exists invite_role_check;
alter table public.community_invites
  add constraint invite_role_check check (role in ('member', 'moderator', 'admin'));

-- -----------------------------------------------------------------------------
-- Supabase's inviteUserByEmail() only works for brand-new emails — it fails
-- with `email_exists` when the address already has an auth.users account
-- (e.g. a former member). This lookup lets the email-invite action detect
-- that case and add the existing user to the community directly instead of
-- dead-ending. Restricted to service_role only: it reads auth.users, which
-- must never be queryable by ordinary authenticated/anon callers.
-- -----------------------------------------------------------------------------
create or replace function public.find_user_id_by_email(p_email text)
returns uuid
language sql
stable
security definer
set search_path = public, auth
as $$
  select id from auth.users where lower(email) = lower(p_email) limit 1;
$$;

revoke all on function public.find_user_id_by_email(text) from public, anon, authenticated;
grant execute on function public.find_user_id_by_email(text) to service_role;
