-- =============================================================================
-- Relate — Place-Based Community Blueprint: foundation migration
--
-- Three additive, backward-compatible changes in support of the Place-Based
-- Community template (src/lib/community-templates.ts):
--
-- 1. location_type/location_name on `communities` — what kind of place this
--    is (island, village, campus, …) and its name/location, captured once in
--    the wizard so later features can keep adapting to it without asking
--    again. Both stay null for every non-place community.
--
-- 2. Nine new space_type values so a place community's default spaces
--    (Explore Map, Marketplace, Business Directory, Guides, Clubs & Groups,
--    Volunteer Hub, Jobs Board, Accommodation, Local Recommendations) are
--    real, admin-choosable categories — not disguised as 'custom'. Like the
--    space types added in space-types.sql, these render as a plain
--    discussion feed today (see isDiscussionLike in the space detail page)
--    until each gets dedicated rendering in a later round.
--
-- 3. Optional lat/lng/location_label columns on `posts` and `events` — the
--    start of the "Living Map" idea: any post or event can optionally carry
--    a place on the map (a beach, a venue, a landmark) without requiring a
--    dedicated map feature to exist yet. Nullable and unindexed-by-default
--    beyond a partial index for "has a location", so this is zero-cost for
--    every community that isn't place-based.
--
-- Safe to re-run.
-- =============================================================================

alter table public.communities add column if not exists location_type text;
alter table public.communities add column if not exists location_name text;

alter type public.space_type add value if not exists 'map';
alter type public.space_type add value if not exists 'marketplace';
alter type public.space_type add value if not exists 'business_directory';
alter type public.space_type add value if not exists 'guides';
alter type public.space_type add value if not exists 'clubs';
alter type public.space_type add value if not exists 'volunteer_hub';
alter type public.space_type add value if not exists 'jobs';
alter type public.space_type add value if not exists 'accommodation';
alter type public.space_type add value if not exists 'recommendations';

alter table public.posts add column if not exists lat double precision;
alter table public.posts add column if not exists lng double precision;
alter table public.posts add column if not exists location_label text;

alter table public.events add column if not exists lat double precision;
alter table public.events add column if not exists lng double precision;
alter table public.events add column if not exists location_label text;

create index if not exists idx_posts_has_location on public.posts (space_id) where lat is not null;
create index if not exists idx_events_has_location on public.events (community_id) where lat is not null;
