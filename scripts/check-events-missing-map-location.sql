-- =============================================================================
-- Diagnostic: which "live" events won't show on the Explore Map because
-- they have no pin location.
--
-- Run this in the Supabase SQL editor. Read-only, safe to run any time.
--
-- Mirrors the map's own filters (src/lib/data/map-items.ts):
--   - "live" = not yet ended: coalesce(end_time, start_time) >= now()
--   - map-eligible = both lat and lng are set
-- =============================================================================

select
  c.name as community,
  e.title,
  e.start_time,
  e.end_time,
  e.location,
  e.lat,
  e.lng,
  (e.lat is not null and e.lng is not null) as on_map
from public.events e
join public.communities c on c.id = e.community_id
where coalesce(e.end_time, e.start_time) >= now()
order by c.name, e.start_time;

-- Just the ones missing a pin, with a total count:
-- select count(*) from public.events e
-- where coalesce(e.end_time, e.start_time) >= now()
--   and (e.lat is null or e.lng is null);
