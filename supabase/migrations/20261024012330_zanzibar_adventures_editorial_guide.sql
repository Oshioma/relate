-- =============================================================================
-- Relate — "Off the Sun Lounger: Zanzibar's Adventures" editorial guide
--
-- Mzungu Zanzibar's adventure guide (diving, kitesurfing, skydiving, horse
-- riding and more), built on the place-guide template. The content ships with
-- the app (src/lib/guides/adventure/…); this row records that the community
-- has it, whether it is published and when its editors last reviewed it, and
-- `content` holds the admins' overrides (editor's note, hero, photos).
--
-- Looked up by the community's slug, so a no-op elsewhere; `on conflict do
-- nothing` never touches an existing guide. Goes live published. No schema
-- change.
-- =============================================================================

insert into public.editorial_guides (community_id, slug, title, status, last_reviewed_on)
select c.id, 'zanzibar-adventures', 'Off the Sun Lounger: Zanzibar''s Adventures', 'published', current_date
from public.communities c
where c.slug = 'mzunguzanzibar'
on conflict (community_id, slug) do nothing;
