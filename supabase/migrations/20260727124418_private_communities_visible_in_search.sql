-- =============================================================================
-- Relate — private communities are "visible in search"
--
-- A community's privacy level means (see the wizard's privacy picker):
--   public      -> "Anyone can find and join."
--   private     -> "Visible in search, but content is members-only."
--   invite_only -> "Hidden — members must be invited to join."
--
-- Until now the SELECT policies on `communities` only let a non-member read a
-- *public* community's row, so a private community resolved to null for a guest
-- and its subdomain fell through to a members-only gate for the WHOLE
-- community — even the spaces/pages an admin had explicitly marked public.
-- Those public spaces are already anon-readable (spaces_select_anon gates on
-- `visibility = 'public'`, independent of community privacy), but the app can't
-- render the community shell — its nav, its public-space links — without first
-- reading the community row.
--
-- So a private community's row becomes readable by everyone, matching "visible
-- in search": the app renders the shell (with only the public spaces in the
-- nav, since space RLS still hides members-only ones) and gates just the
-- members-only surfaces (the feed) in the page layer. The community row holds
-- no secrets — name, description, logo, cover, feature flags, and the custom
-- domain verification token, which is a value the owner publishes in public DNS
-- anyway; public communities have exposed the same columns to anon all along.
-- invite_only stays "Hidden": it is deliberately excluded here, so a non-member
-- still resolves it to null and gets a non-revealing 404.
--
-- Discovery surfaces that should still show public communities only (the
-- marketing landing page, the "communities you can join" list) filter on
-- is_public explicitly in their queries, so widening the read policy doesn't
-- leak private communities into them.
--
-- Also drops get_community_gate_card: it existed only to fetch a private
-- community's public card past the old narrow policy, which is now redundant —
-- getCommunityBySlug resolves the row directly.
--
-- Safe to re-run. Run after community_privacy.sql (needs communities.privacy).
-- =============================================================================

-- Authenticated: public + private are readable by anyone; invite_only only by
-- its owner or members.
drop policy if exists "communities_select_visible" on public.communities;
create policy "communities_select_visible" on public.communities
  for select to authenticated
  using (
    privacy in ('public', 'private')
    or owner_id = auth.uid()
    or public.is_community_member(id, auth.uid())
  );

-- Signed-out visitors: public + private are readable so their public spaces can
-- be browsed pre-login; invite_only stays hidden.
drop policy if exists "communities_select_public_anon" on public.communities;
create policy "communities_select_public_anon" on public.communities
  for select to anon
  using (privacy in ('public', 'private'));

-- Redundant now that the row is directly SELECT-able (see above).
drop function if exists public.get_community_gate_card(text);
