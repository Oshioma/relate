-- =============================================================================
-- Relate — new titles for Mzungu Zanzibar's editorial guides
--
-- The guides drop "Best" from their titles. The pages read their titles from
-- the app; this keeps the stored titles (shown on feed cards and the guides
-- list) in step. Slugs are unchanged, so links and shares keep working.
--
-- Looked up by the community's slug, so a no-op elsewhere. No schema change.
-- =============================================================================

update public.editorial_guides g
set title = v.title
from public.communities c,
  (values
    ('best-boutique-hotels-zanzibar', 'Hidden Gems: Zanzibar''s Boutique Hotels'),
    ('best-luxury-resorts-zanzibar', 'Barefoot Luxury: Zanzibar''s Five-Star Escapes'),
    ('most-picturesque-places-zanzibar', 'Postcards from Zanzibar: The Island''s Picture-Perfect Places'),
    ('best-restaurants-zanzibar', 'Spice, Sea & Supper: Where to Eat in Zanzibar')
  ) as v(slug, title)
where c.slug = 'mzunguzanzibar'
  and g.community_id = c.id
  and g.slug = v.slug;
