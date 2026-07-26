-- =============================================================================
-- Relate — Crop Guides Phase 3: seed reference regions + default calendars
--
-- Idempotent: regions upsert on their unique slug; calendar rows upsert on the
-- (crop, region, month, activity) unique key. Seeds default planting calendars
-- for the four starter crops in the temperate and tropical reference regions so
-- the monthly calendar renders real data (temperate uses northern-hemisphere
-- timing). Other regions/crops are filled in from the admin tools over time.
-- =============================================================================

-- Reference regions -----------------------------------------------------------
insert into public.crop_regions (slug, name, kind, sort_order) values
  ('tropical', 'Tropical', 'climate', 1),
  ('subtropical', 'Subtropical', 'climate', 2),
  ('mediterranean', 'Mediterranean', 'climate', 3),
  ('temperate', 'Temperate', 'climate', 4),
  ('arid', 'Arid', 'climate', 5),
  ('continental', 'Continental', 'climate', 6),
  ('east_africa', 'East Africa', 'geographic', 10),
  ('southern_africa', 'Southern Africa', 'geographic', 11),
  ('europe', 'Europe', 'geographic', 12),
  ('north_america', 'North America', 'geographic', 13),
  ('south_america', 'South America', 'geographic', 14),
  ('australia', 'Australia', 'geographic', 15),
  ('new_zealand', 'New Zealand', 'geographic', 16)
on conflict (slug) do nothing;

-- Default calendars (crop_slug, region_slug, month, activity) ------------------
insert into public.crop_calendars (crop_id, region_id, month, activity)
select c.id, r.id, v.month, v.activity
from (values
  -- Temperate (northern-hemisphere timing) -----------------------------------
  ('tomato', 'temperate', 2, 'sow_indoors'),
  ('tomato', 'temperate', 3, 'sow_indoors'),
  ('tomato', 'temperate', 5, 'transplant'),
  ('tomato', 'temperate', 6, 'transplant'),
  ('tomato', 'temperate', 7, 'harvest'),
  ('tomato', 'temperate', 8, 'harvest'),
  ('tomato', 'temperate', 9, 'harvest'),
  ('tomato', 'temperate', 12, 'avoid'),
  ('tomato', 'temperate', 1, 'avoid'),
  ('carrot', 'temperate', 3, 'direct_sow'),
  ('carrot', 'temperate', 4, 'direct_sow'),
  ('carrot', 'temperate', 5, 'direct_sow'),
  ('carrot', 'temperate', 6, 'direct_sow'),
  ('carrot', 'temperate', 7, 'direct_sow'),
  ('carrot', 'temperate', 7, 'harvest'),
  ('carrot', 'temperate', 8, 'harvest'),
  ('carrot', 'temperate', 9, 'harvest'),
  ('carrot', 'temperate', 10, 'harvest'),
  ('carrot', 'temperate', 1, 'avoid'),
  ('carrot', 'temperate', 12, 'avoid'),
  ('basil', 'temperate', 3, 'sow_indoors'),
  ('basil', 'temperate', 4, 'sow_indoors'),
  ('basil', 'temperate', 5, 'transplant'),
  ('basil', 'temperate', 6, 'transplant'),
  ('basil', 'temperate', 7, 'harvest'),
  ('basil', 'temperate', 8, 'harvest'),
  ('basil', 'temperate', 9, 'harvest'),
  ('basil', 'temperate', 11, 'avoid'),
  ('basil', 'temperate', 12, 'avoid'),
  ('basil', 'temperate', 1, 'avoid'),
  ('basil', 'temperate', 2, 'avoid'),
  ('cowpea', 'temperate', 5, 'direct_sow'),
  ('cowpea', 'temperate', 6, 'direct_sow'),
  ('cowpea', 'temperate', 8, 'harvest'),
  ('cowpea', 'temperate', 9, 'harvest'),
  ('cowpea', 'temperate', 10, 'harvest'),
  ('cowpea', 'temperate', 12, 'avoid'),
  ('cowpea', 'temperate', 1, 'avoid'),
  ('cowpea', 'temperate', 2, 'avoid'),
  -- Tropical -----------------------------------------------------------------
  ('tomato', 'tropical', 1, 'direct_sow'),
  ('tomato', 'tropical', 2, 'direct_sow'),
  ('tomato', 'tropical', 9, 'direct_sow'),
  ('tomato', 'tropical', 10, 'direct_sow'),
  ('tomato', 'tropical', 3, 'transplant'),
  ('tomato', 'tropical', 11, 'transplant'),
  ('tomato', 'tropical', 5, 'harvest'),
  ('tomato', 'tropical', 6, 'harvest'),
  ('tomato', 'tropical', 12, 'harvest'),
  ('tomato', 'tropical', 1, 'harvest'),
  ('carrot', 'tropical', 6, 'direct_sow'),
  ('carrot', 'tropical', 7, 'direct_sow'),
  ('carrot', 'tropical', 8, 'direct_sow'),
  ('carrot', 'tropical', 9, 'harvest'),
  ('carrot', 'tropical', 10, 'harvest'),
  ('carrot', 'tropical', 11, 'harvest'),
  ('basil', 'tropical', 1, 'direct_sow'),
  ('basil', 'tropical', 2, 'direct_sow'),
  ('basil', 'tropical', 3, 'direct_sow'),
  ('basil', 'tropical', 9, 'direct_sow'),
  ('basil', 'tropical', 10, 'direct_sow'),
  ('basil', 'tropical', 4, 'harvest'),
  ('basil', 'tropical', 5, 'harvest'),
  ('basil', 'tropical', 11, 'harvest'),
  ('basil', 'tropical', 12, 'harvest'),
  ('cowpea', 'tropical', 3, 'direct_sow'),
  ('cowpea', 'tropical', 4, 'direct_sow'),
  ('cowpea', 'tropical', 10, 'direct_sow'),
  ('cowpea', 'tropical', 11, 'direct_sow'),
  ('cowpea', 'tropical', 6, 'harvest'),
  ('cowpea', 'tropical', 7, 'harvest'),
  ('cowpea', 'tropical', 12, 'harvest'),
  ('cowpea', 'tropical', 1, 'harvest')
) as v(crop_slug, region_slug, month, activity)
join public.crops c on c.slug = v.crop_slug
join public.crop_regions r on r.slug = v.region_slug
on conflict (crop_id, region_id, month, activity) do nothing;
