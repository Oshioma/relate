-- =============================================================================
-- Relate — a blank full name is no name, not an empty one
--
-- "joined Natures Gardeners" — with nobody's name in front of it — is what a
-- community owner got by email when someone new arrived. The notification
-- triggers all build their titles from
--
--   coalesce(full_name, username)
--
-- which is right for a NULL full name and useless for an empty one: coalesce
-- only skips NULL, so '' wins and the title starts with a space. Signing up
-- without typing a name stores exactly that — handle_new_user does
-- `coalesce(raw_user_meta_data ->> 'full_name', '')`, and the signup form sends
-- an empty string when the field is left blank.
--
-- Rather than patch the five notification functions that each carry that same
-- coalesce (new member, new post, new comment, business claim, stay claim), fix
-- what they read: profiles.full_name is either a name or NULL, enforced on the
-- way in. Every existing reader then behaves — including the app, where
-- `full_name || username` in JS already treated '' as absent, which is why this
-- only ever showed up in email and the notification bell.
--
-- Safe to re-run.
-- =============================================================================

-- The invariant, enforced for every writer: signup's trigger, the settings
-- form, an admin edit, a future import.
create or replace function public.normalize_profile_full_name()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.full_name := nullif(btrim(new.full_name), '');
  return new;
end;
$$;

drop trigger if exists profiles_normalize_full_name on public.profiles;
create trigger profiles_normalize_full_name
  before insert or update on public.profiles
  for each row execute function public.normalize_profile_full_name();

-- Everyone who signed up without giving a name.
update public.profiles
set full_name = null
where full_name is not null and btrim(full_name) = '';

-- The notifications already sent to the bell. Their titles were built by
-- concatenation, so a missing name left the title starting with a space and
-- nothing else marks them — which makes that the exact test for the damage.
-- The actor is on the row, so the name can simply be put back.
update public.notifications n
set title = coalesce(nullif(btrim(p.full_name), ''), p.username) || n.title
from public.profiles p
where p.id = n.actor_id
  and n.title like ' %';
