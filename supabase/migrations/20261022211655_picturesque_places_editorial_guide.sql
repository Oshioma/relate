-- =============================================================================
-- Relate — "Zanzibar's Most Picturesque Places" editorial guide
--
-- Mzungu Zanzibar's first place guide (beaches, sandbanks, reefs, the old
-- town, forests and caves). Like the hotel guides, the content ships with the
-- app (src/lib/guides/picturesque/…) and this row records that the community
-- has it, whether it is published and when its editors last reviewed it;
-- `content` holds the admins' overrides (editor's note, hero, place photos).
--
-- Looked up by the community's slug, so this is a no-op in any environment
-- without it, and `on conflict do nothing` means re-running never touches a
-- guide that already exists. It goes live published; admins can switch it
-- back to draft from the guide's admin page. No schema change.
-- =============================================================================

insert into public.editorial_guides (community_id, slug, title, status, last_reviewed_on)
select c.id, 'most-picturesque-places-zanzibar', 'Zanzibar''s Most Picturesque Places', 'published', current_date
from public.communities c
where c.slug = 'mzunguzanzibar'
on conflict (community_id, slug) do nothing;
