-- =============================================================================
-- Relate — community privacy setting (public / private / invite_only)
--
-- The community-creation wizard has always asked for a privacy level and the
-- app writes `communities.privacy` on insert, but no migration ever added the
-- column: the schema only had a plain, writable `is_public` boolean. So every
-- wizard insert failed ("could not find the 'privacy' column"), leaving the
-- brand-new community uncreated — its subdomain then 404s. This adds the
-- missing column and reconciles `is_public` with the app's contract (see
-- src/types/database.ts): `is_public` is a *generated* column derived from
-- privacy, read-only, so the two can never drift.
--
--   privacy = 'public'      -> is_public = true  (guests can reach it)
--   privacy = 'private'     -> is_public = false (visible in search, gated)
--   privacy = 'invite_only' -> is_public = false (hidden, invite to join)
--
-- Safe to re-run. Run after the base schema.
-- =============================================================================

-- 1. The privacy setting. Text + CHECK (mirrors CommunityPrivacy in
--    src/types/database.ts) rather than a new enum, so the generated
--    expression below stays a plain equality with no cast.
alter table public.communities
  add column if not exists privacy text not null default 'public';

alter table public.communities drop constraint if exists community_privacy_format;
alter table public.communities
  add constraint community_privacy_format
  check (privacy in ('public', 'private', 'invite_only'));

-- 2. Backfill privacy from the existing plain is_public before we replace it,
--    so no existing community changes visibility. (An 'invite_only' community
--    is also non-public, but is_public alone can't tell it from 'private';
--    'private' is the safe, behaviour-preserving choice.)
update public.communities
  set privacy = case when is_public then 'public' else 'private' end;

-- 3. Replace the plain, writable is_public with a stored generated column.
--    Postgres has no in-place "add generated expression", so the column is
--    dropped and re-added. The two RLS policies whose USING clause references
--    is_public hard-depend on it and must be dropped first, then recreated
--    unchanged. Security-definer functions that read is_public in their bodies
--    (is_community_public, is_community_events_public, get_invite_preview)
--    resolve the column by name at call time and need no changes.
drop policy if exists "communities_select_visible" on public.communities;
drop policy if exists "communities_select_public_anon" on public.communities;

alter table public.communities drop column if exists is_public;
alter table public.communities
  add column is_public boolean
  generated always as (privacy = 'public') stored;

-- 4. Recreate the policies exactly as the base schema defined them.
create policy "communities_select_visible" on public.communities
  for select to authenticated
  using (
    is_public = true
    or owner_id = auth.uid()
    or public.is_community_member(id, auth.uid())
  );

-- Signed-out visitors can see public communities so the marketing landing
-- page can showcase real communities instead of static placeholders.
create policy "communities_select_public_anon" on public.communities
  for select to anon
  using (is_public = true);
