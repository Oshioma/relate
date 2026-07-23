-- =============================================================================
-- Relate — Community branding on the invite page
--
-- get_invite_preview gains the community's logo and cover image so the
-- /invite/<code> page can greet people with the community's own branding
-- instead of a bare "Relate" header — the invitee is joining Mzungu
-- Zanzibar, not the platform. Adding return columns changes the function's
-- signature, which Postgres won't allow via `create or replace`, hence the
-- drop. Grants don't survive the drop, so they're re-applied.
--
-- Safe to re-run. Run after invites.sql.
-- =============================================================================

drop function if exists public.get_invite_preview(text);

create function public.get_invite_preview(p_code text)
returns table (
  community_name text,
  community_slug text,
  community_logo_url text,
  community_cover_image_url text,
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
  select ci.*, c.name as c_name, c.slug as c_slug, c.logo_url as c_logo, c.cover_image_url as c_cover
    into inv
  from public.community_invites ci
  join public.communities c on c.id = ci.community_id
  where ci.code = p_code;

  if not found then
    return query select null::text, null::text, null::text, null::text, false, 'This invite link is invalid.';
    return;
  end if;

  if inv.revoked then
    return query select inv.c_name, inv.c_slug, inv.c_logo, inv.c_cover, false, 'This invite link has been revoked.';
    return;
  end if;

  if inv.expires_at is not null and inv.expires_at < now() then
    return query select inv.c_name, inv.c_slug, inv.c_logo, inv.c_cover, false, 'This invite link has expired.';
    return;
  end if;

  if inv.max_uses is not null and inv.uses_count >= inv.max_uses then
    return query select inv.c_name, inv.c_slug, inv.c_logo, inv.c_cover, false, 'This invite link has reached its usage limit.';
    return;
  end if;

  return query select inv.c_name, inv.c_slug, inv.c_logo, inv.c_cover, true, null::text;
end;
$$;

grant execute on function public.get_invite_preview(text) to anon, authenticated;
