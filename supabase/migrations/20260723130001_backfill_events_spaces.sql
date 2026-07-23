-- =============================================================================
-- Relate — backfill Events spaces
--
-- Run after 20260723130000_events_space_type.sql (in its own transaction —
-- a just-added enum value can't be used in the same transaction it was
-- added in on older Postgres versions).
--
-- Gives every community that currently has the 'events' feature enabled
-- (explicit community_features override, else the platform default) a real
-- 'events'-type space, so its Events nav item keeps showing up under the
-- new space-driven nav (src/app/c/[communitySlug]/layout.tsx) and becomes
-- manageable from the Spaces admin panel. Idempotent: skips any community
-- that already has an 'events'-type space, or an existing space at the
-- 'events' slug.
-- =============================================================================

insert into public.spaces (community_id, name, slug, visibility, space_type, sort_order, show_in_nav)
select
  c.id,
  'Events',
  'events',
  'public'::public.space_visibility,
  'events'::public.space_type,
  coalesce((select max(s2.sort_order) + 1 from public.spaces s2 where s2.community_id = c.id), 0),
  true
from public.communities c
where coalesce(
  (select cf.enabled from public.community_features cf where cf.community_id = c.id and cf.feature_key = 'events'),
  (select fd.enabled from public.feature_defaults fd where fd.feature_key = 'events'),
  true
)
and not exists (select 1 from public.spaces s where s.community_id = c.id and s.space_type = 'events')
and not exists (select 1 from public.spaces s where s.community_id = c.id and s.slug = 'events');
