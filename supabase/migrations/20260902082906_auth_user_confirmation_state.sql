-- =============================================================================
-- Relate — tell an unconfirmed signup apart from a finished account
--
-- Signing up twice used to dead-end. The first signup creates an UNCONFIRMED
-- auth.users row; the second one sees "that email is taken" and refuses,
-- so anyone whose confirmation link was eaten by a mail scanner (or who
-- simply lost the email) had no way to get a new one — the exact
-- "link expired, and now no new link arrives" report this fixes.
--
-- The signup and resend-confirmation actions need to know which of the three
-- states an address is in: no account, an account still waiting on its
-- confirmation email, or a real confirmed account. auth.users.email_confirmed_at
-- is the only source of truth for that, and it is not reachable through
-- PostgREST, so expose exactly that one bit through a SECURITY DEFINER
-- function.
--
-- Restricted to service_role exactly like find_user_id_by_email() and
-- user_emails_for_ids(), so it is reachable only from trusted server code.
-- An anon caller must never be able to probe which addresses have accounts.
-- Safe to re-run.
-- =============================================================================

create or replace function public.auth_user_confirmation_state(p_email text)
returns table (user_id uuid, confirmed boolean)
language sql
stable
security definer
set search_path = public, auth
as $$
  select u.id, u.email_confirmed_at is not null
  from auth.users u
  where lower(u.email) = lower(trim(p_email))
  limit 1;
$$;

revoke all on function public.auth_user_confirmation_state(text) from public, anon, authenticated;
grant execute on function public.auth_user_confirmation_state(text) to service_role;
