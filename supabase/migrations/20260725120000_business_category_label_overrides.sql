-- =============================================================================
-- Relate — Business Directory: renaming categories
--
-- Staff can already add and delete custom categories, but the built-in ones
-- (Restaurant, Café, Activity, …) had fixed labels baked into code with no way
-- to relabel them per community — e.g. a community that wants "Experiences"
-- instead of "Activities". This adds two capabilities:
--
--   1. A per-space label override for BUILT-IN categories. The category value
--      stays the same (businesses keep category = 'activity'); only the label
--      the nav sub-links, chips and headings render is overridden.
--   2. The missing UPDATE policy on business_custom_categories, so renaming a
--      CUSTOM category (its editable `label`) actually persists — until now the
--      table had insert/delete policies but no update, so an UPDATE under RLS
--      silently matched zero rows.
--
-- Both are staff-only, mirroring the existing custom-category authority.
-- =============================================================================

create table if not exists public.business_category_label_overrides (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces (id) on delete cascade,
  community_id uuid not null references public.communities (id) on delete cascade,
  -- A built-in category value ("activity"); custom categories rename in place
  -- via business_custom_categories.label instead, so they never appear here.
  category text not null,
  label text not null check (char_length(label) between 1 and 40),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- One override per built-in per space; the rename action upserts on this.
  unique (space_id, category)
);

create index if not exists idx_business_category_label_overrides_community
  on public.business_category_label_overrides (community_id);

alter table public.business_category_label_overrides enable row level security;

-- Anyone who can see the space sees its relabelled categories (nav sub-links,
-- chips, headings) — same visibility as featured/custom categories.
drop policy if exists "business_category_label_overrides_select" on public.business_category_label_overrides;
create policy "business_category_label_overrides_select" on public.business_category_label_overrides
  for select to authenticated
  using (public.can_view_space(space_id, auth.uid()));

drop policy if exists "business_category_label_overrides_select_anon" on public.business_category_label_overrides;
create policy "business_category_label_overrides_select_anon" on public.business_category_label_overrides
  for select to anon
  using (public.can_view_space(space_id, null::uuid));

drop policy if exists "business_category_label_overrides_insert_staff" on public.business_category_label_overrides;
create policy "business_category_label_overrides_insert_staff" on public.business_category_label_overrides
  for insert to authenticated
  with check (public.is_community_staff(community_id, auth.uid()));

drop policy if exists "business_category_label_overrides_update_staff" on public.business_category_label_overrides;
create policy "business_category_label_overrides_update_staff" on public.business_category_label_overrides
  for update to authenticated
  using (public.is_community_staff(community_id, auth.uid()))
  with check (public.is_community_staff(community_id, auth.uid()));

drop policy if exists "business_category_label_overrides_delete_staff" on public.business_category_label_overrides;
create policy "business_category_label_overrides_delete_staff" on public.business_category_label_overrides
  for delete to authenticated
  using (public.is_community_staff(community_id, auth.uid()));

-- Renaming a custom category writes its `label`; without this UPDATE policy the
-- write silently matched zero rows under RLS (the table only had insert/delete).
drop policy if exists "business_custom_categories_update_staff" on public.business_custom_categories;
create policy "business_custom_categories_update_staff" on public.business_custom_categories
  for update to authenticated
  using (public.is_community_staff(community_id, auth.uid()))
  with check (public.is_community_staff(community_id, auth.uid()));
