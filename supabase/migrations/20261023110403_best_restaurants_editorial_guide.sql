-- =============================================================================
-- Relate — "Zanzibar's Best Restaurants" editorial guide
--
-- Mzungu Zanzibar's restaurant guide, built on the place-guide template. The
-- content ships with the app (src/lib/guides/restaurants/…); this row records
-- that the community has it, whether it is published and when its editors
-- last reviewed it, and `content` holds the admins' overrides (editor's note,
-- hero, photos). The guide's "From our directory" section reads the
-- community's business directory live, so it needs no data here.
--
-- Looked up by the community's slug, so a no-op elsewhere; `on conflict do
-- nothing` never touches an existing guide. Goes live published. No schema
-- change.
-- =============================================================================

insert into public.editorial_guides (community_id, slug, title, status, last_reviewed_on)
select c.id, 'best-restaurants-zanzibar', 'Zanzibar''s Best Restaurants', 'published', current_date
from public.communities c
where c.slug = 'mzunguzanzibar'
on conflict (community_id, slug) do nothing;
