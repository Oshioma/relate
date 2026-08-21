-- =============================================================================
-- Relate — look up email addresses by user id (service-role only)
--
-- The platform-admin surfaces identify people by display name and @username,
-- which isn't enough to recognise a specific signup or sign-in — the operator
-- knows their members by email. Emails live in auth.users, which no
-- application query may touch directly.
--
-- The existing route to them is admin.auth.admin.listUsers(), which the spam
-- sweep uses: it pages through EVERY user to build a lookup. That is the wrong
-- shape for a page showing sixty events — it fetches thousands of records to
-- label a handful. This is the inverse of find_user_id_by_email(): give it the
-- ids actually on screen, get back only those addresses.
--
-- Restricted to service_role exactly like find_user_id_by_email, so it is
-- reachable only from server code that has already verified the caller is a
-- super admin. An ordinary authenticated session cannot execute it, which
-- matters: this would otherwise be an email-harvesting endpoint for the whole
-- user base.
-- =============================================================================

create or replace function public.user_emails_for_ids(p_user_ids uuid[])
returns table (user_id uuid, email text)
language sql
stable
security definer
set search_path = public, auth
as $$
  select u.id, u.email::text
  from auth.users u
  where u.id = any(p_user_ids);
$$;

revoke all on function public.user_emails_for_ids(uuid[]) from public, anon, authenticated;
grant execute on function public.user_emails_for_ids(uuid[]) to service_role;
