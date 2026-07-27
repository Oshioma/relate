-- =============================================================================
-- Relate — public "gate card" for private communities
--
-- A private community is meant to be "Visible in search, but content is
-- members-only" (see the privacy picker in the community wizard). Its
-- communities row, though, is only SELECT-able by members/owner under RLS
-- (communities_select_visible / communities_select_public_anon), so a
-- non-member — signed-out or signed-in — that lands on the community's own
-- host resolves getCommunityBySlug to null and the page falls through to a
-- bare 404. That reads as "this community doesn't exist", which is wrong for
-- a private community and is the reason a private community's subdomain 404s
-- when you're logged out.
--
-- This adds a security-definer lookup that returns just the safe, showable
-- card (name, slug, logo, cover, description) for a PUBLIC or PRIVATE
-- community by slug, so the app can render a members-only gate instead of a
-- 404. invite_only communities are "Hidden" and a bad slug is nothing, so
-- both return no row here and stay a non-revealing 404 — the function never
-- exposes the full communities row, only these columns, and only for the two
-- discoverable privacy levels.
--
-- Safe to re-run. Run after community_privacy.sql (needs communities.privacy).
-- =============================================================================

create or replace function public.get_community_gate_card(p_slug text)
returns table (
  name text,
  slug text,
  description text,
  logo_url text,
  cover_image_url text,
  privacy text
)
language sql
security definer
set search_path = public
stable
as $$
  select c.name, c.slug, c.description, c.logo_url, c.cover_image_url, c.privacy
  from public.communities c
  where c.slug = p_slug
    and c.privacy in ('public', 'private')
$$;

grant execute on function public.get_community_gate_card(text) to anon, authenticated;
