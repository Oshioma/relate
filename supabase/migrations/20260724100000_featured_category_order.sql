-- Ordering for the directory's nav sub-links.
--
-- featured_business_categories rows surface as sub-links under a business
-- directory space in the community's left nav. Until now they were listed
-- alphabetically by category with no way for staff to arrange them; this adds
-- an explicit sort_order (mirroring public.spaces.sort_order) so staff can drag
-- the sub-links into whatever order they want.
--
-- Defaults to 0, so existing rows keep a stable order (tie-broken by category)
-- until they're first reordered.

alter table public.featured_business_categories
  add column if not exists sort_order integer not null default 0;
