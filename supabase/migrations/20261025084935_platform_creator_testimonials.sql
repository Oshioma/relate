-- =============================================================================
-- Creator quotes on the platform homepage
--
-- The marketing homepage's "Real people. Real impact." section shows quotes
-- from community creators, written by the super admin in Platform admin →
-- Homepage. Stored on the platform_settings singleton (already public-read,
-- super-admin-write) as an ordered list of { quote, name, role }.
--
-- Seeded with the first real one, from the founder of Nature's Gardeners.
-- =============================================================================

alter table public.platform_settings
  add column if not exists creator_testimonials jsonb not null default '[]'::jsonb;

update public.platform_settings
set creator_testimonials = jsonb_build_array(
  jsonb_build_object(
    'quote', 'Great having an easy, affordable and customisable way to create a community you would want to belong to.',
    'name', 'Oshi',
    'role', 'Founder, Nature''s Gardeners'
  )
)
where id = 1 and creator_testimonials = '[]'::jsonb;
