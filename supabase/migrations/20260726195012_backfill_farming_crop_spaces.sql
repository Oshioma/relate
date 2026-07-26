-- =============================================================================
-- Relate — backfill Crop Guides + Plant Health Scanner into existing farming
-- communities.
--
-- Template default spaces only apply at community creation, so communities
-- created before those spaces were added to the farming template don't have
-- them. This adds them to every existing community whose template_key =
-- 'farming'. The Plant Health Scanner is the space the user asked to backfill;
-- Crop Guides is added alongside it so the scanner's "open guide" deep links
-- have somewhere to point and existing communities reach parity with new ones.
--
-- Idempotent and safe to re-run: each insert skips any community that already
-- has a space of that type OR one using the target slug, and appends after the
-- community's existing spaces. Runs after the crop_guides / plant_scanner enum
-- values were added in earlier migrations, so using them here is safe.
-- =============================================================================

-- Crop Guides ----------------------------------------------------------------
insert into public.spaces (community_id, name, slug, description, space_type, sort_order, show_in_nav)
select c.id,
       'Crop Guides',
       'crop-guides',
       'Organic, region-aware growing guides — from seed to harvest.',
       'crop_guides',
       coalesce((select max(s.sort_order) from public.spaces s where s.community_id = c.id), 0) + 1,
       true
from public.communities c
where c.template_key = 'farming'
  and not exists (select 1 from public.spaces s where s.community_id = c.id and s.space_type::text = 'crop_guides')
  and not exists (select 1 from public.spaces s where s.community_id = c.id and s.slug = 'crop-guides');

-- Plant Health Scanner -------------------------------------------------------
insert into public.spaces (community_id, name, slug, description, space_type, sort_order, show_in_nav)
select c.id,
       'Plant Health Scanner',
       'plant-scanner',
       'Upload a plant photo for an AI diagnosis with organic treatment.',
       'plant_scanner',
       coalesce((select max(s.sort_order) from public.spaces s where s.community_id = c.id), 0) + 1,
       true
from public.communities c
where c.template_key = 'farming'
  and not exists (select 1 from public.spaces s where s.community_id = c.id and s.space_type::text = 'plant_scanner')
  and not exists (select 1 from public.spaces s where s.community_id = c.id and s.slug = 'plant-scanner');
