-- =============================================================================
-- Relate — backfill a "My Crops" space into existing farming communities.
--
-- Template defaults only apply at community creation, so add the My Crops space
-- to every existing community with template_key = 'farming'. Idempotent: skips
-- any community that already has a my_crops space or one using the target slug,
-- and appends after existing spaces. Runs after the my_crops enum value exists.
-- =============================================================================

insert into public.spaces (community_id, name, slug, description, space_type, sort_order, show_in_nav)
select c.id,
       'My Crops',
       'my-crops',
       'Your own crops synced from the shamba.online farm app.',
       'my_crops',
       coalesce((select max(s.sort_order) from public.spaces s where s.community_id = c.id), 0) + 1,
       true
from public.communities c
where c.template_key = 'farming'
  and not exists (select 1 from public.spaces s where s.community_id = c.id and s.space_type::text = 'my_crops')
  and not exists (select 1 from public.spaces s where s.community_id = c.id and s.slug = 'my-crops');
