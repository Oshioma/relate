-- =============================================================================
-- Relate — expose the invited email on get_invite_preview
--
-- Emailed invites already know who they're for: sendEmailInvite stores the
-- recipient's address on the invite row. Surfacing it through the public
-- preview lets the signup page pre-fill (and lock) the email for someone who
-- followed an email invite, so all they have to do is pick a password — they
-- never retype the address we already have. invite_email is null for link
-- invites (community_invites.email is null there), which the signup page reads
-- as "collect the email normally".
--
-- Adding a return column changes the function signature, which Postgres won't
-- allow via `create or replace`, hence the drop. Grants don't survive the drop,
-- so they're re-applied.
--
-- Safe to re-run. Run after invite_preview_is_public.sql.
-- =============================================================================

drop function if exists public.get_invite_preview(text);

create function public.get_invite_preview(p_code text)
returns table (
  community_name text,
  community_slug text,
  community_logo_url text,
  community_cover_image_url text,
  community_is_public boolean,
  invite_email text,
  valid boolean,
  reason text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  inv record;
begin
  select ci.*, c.name as c_name, c.slug as c_slug, c.logo_url as c_logo,
         c.cover_image_url as c_cover, c.is_public as c_is_public
    into inv
  from public.community_invites ci
  join public.communities c on c.id = ci.community_id
  where ci.code = p_code;

  if not found then
    return query select null::text, null::text, null::text, null::text, null::boolean, null::text, false, 'This invite link is invalid.';
    return;
  end if;

  if inv.revoked then
    return query select inv.c_name, inv.c_slug, inv.c_logo, inv.c_cover, inv.c_is_public, inv.email, false, 'This invite link has been revoked.';
    return;
  end if;

  if inv.expires_at is not null and inv.expires_at < now() then
    return query select inv.c_name, inv.c_slug, inv.c_logo, inv.c_cover, inv.c_is_public, inv.email, false, 'This invite link has expired.';
    return;
  end if;

  if inv.max_uses is not null and inv.uses_count >= inv.max_uses then
    return query select inv.c_name, inv.c_slug, inv.c_logo, inv.c_cover, inv.c_is_public, inv.email, false, 'This invite link has reached its usage limit.';
    return;
  end if;

  return query select inv.c_name, inv.c_slug, inv.c_logo, inv.c_cover, inv.c_is_public, inv.email, true, null::text;
end;
$$;

grant execute on function public.get_invite_preview(text) to anon, authenticated;
