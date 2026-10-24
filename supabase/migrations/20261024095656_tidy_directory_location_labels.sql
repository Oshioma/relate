-- =============================================================================
-- Relate — tidy Mzungu Zanzibar's directory location labels
--
-- The directory groups listings and offers a location chip per distinct
-- location_label, so near-duplicates split the page into many one-listing
-- groups: "Stonetown" beside "Stone Town", "Paje, Zanzibar" beside "Paje", and
-- the adventure guide's combined areas ("Nungwi, Kiwengwa & Jambiani"), which
-- were copied in as labels. Each becomes one village — the listing's main
-- base or departure point. The guide keeps its own wording; only the
-- directory label changes.
--
-- Matched on the community, the directory space and the old label (plus the
-- slug where one old label splits two ways), so a no-op elsewhere and safe to
-- re-run. No schema change.
-- =============================================================================

with directory as (
  select s.id
  from public.spaces s
  join public.communities c on c.id = s.community_id
  where c.slug = 'mzunguzanzibar' and s.slug = 'business-directory' and s.space_type = 'business_directory'
),
renames (old_label, slug, new_label) as (
  values
    ('Stonetown', null, 'Stone Town'),
    ('Paje, Zanzibar', null, 'Paje'),
    ('Airport & Kiwengwa', null, 'Stone Town'),
    ('Stone Town & Paje', null, 'Stone Town'),
    ('Kendwa & Nungwi', null, 'Kendwa'),
    ('Nungwi & Kendwa', 'north-coast-diving', 'Kendwa'),
    ('Nungwi & Kendwa', 'deep-sea-fishing', 'Nungwi'),
    ('Nungwi, Kiwengwa & Jambiani', null, 'Kiwengwa'),
    ('Matemwe & Muyuni', null, 'Matemwe'),
    ('Paje & Kiwengwa', null, 'Paje'),
    ('Paje, Dongwe & Jambiani', null, 'Paje')
)
update public.businesses b
set location_label = r.new_label
from renames r, directory d
where b.space_id = d.id
  and b.location_label = r.old_label
  and (r.slug is null or b.slug = r.slug);
