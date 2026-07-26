-- =============================================================================
-- Relate — backfill a "Plant ID" space into existing farming communities.
--
-- Idempotent: skips any community that already has a plant_id space or one using
-- the target slug, and appends after existing spaces. Runs after the plant_id
-- enum value exists.
-- =============================================================================

insert into public.spaces (community_id, name, slug, description, space_type, sort_order, show_in_nav)
select c.id,
       'Plant ID',
       'plant-id',
       'Upload a photo to identify a plant.',
       'plant_id',
       coalesce((select max(s.sort_order) from public.spaces s where s.community_id = c.id), 0) + 1,
       true
from public.communities c
where c.template_key = 'farming'
  and not exists (select 1 from public.spaces s where s.community_id = c.id and s.space_type::text = 'plant_id')
  and not exists (select 1 from public.spaces s where s.community_id = c.id and s.slug = 'plant-id');
