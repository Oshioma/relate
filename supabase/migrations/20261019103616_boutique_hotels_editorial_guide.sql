-- =============================================================================
-- Relate — "Zanzibar's Best Boutique Hotels & Hidden Gems" editorial guide
--
-- Gives Mzungu Zanzibar its second editorial guide. Like "Where to Stay in
-- Zanzibar", the guide's content ships with the app
-- (src/lib/guides/boutique-hotels/…) and this row records that the community
-- has it, whether it is published and when its editors last reviewed it;
-- `content` holds the admins' overrides (editor's note, hero, hotel photos).
--
-- Looked up by the community's slug, so this is a no-op in any environment
-- without it, and `on conflict do nothing` means re-running never touches a
-- guide that already exists — including any edits its admins have made. It
-- goes live published (merging this is the editorial sign-off); admins can
-- switch it back to draft from the guide's admin page.
--
-- No schema change: comments reuse feed_comments with item_type
-- 'editorial_guide', and local notes reuse editorial_guide_updates.
-- =============================================================================

insert into public.editorial_guides (community_id, slug, title, status, last_reviewed_on)
select c.id, 'best-boutique-hotels-zanzibar', 'Zanzibar''s Best Boutique Hotels & Hidden Gems', 'published', current_date
from public.communities c
where c.slug = 'mzunguzanzibar'
on conflict (community_id, slug) do nothing;
