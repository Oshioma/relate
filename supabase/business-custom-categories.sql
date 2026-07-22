-- =============================================================================
-- Relate — Business Directory: custom categories
--
-- Run this after supabase/business-directory.sql. Safe to re-run.
--
-- The built-in business_category enum can't fit every place — a Zanzibar
-- community needs Fundis, a ski town needs Rentals. Staff can now add their
-- own categories per directory space; they show up in the add-business form,
-- the filter chips and the featured nav sub-links alongside the built-ins.
-- To store custom slugs, businesses.category and
-- featured_business_categories.category become plain text (existing enum
-- values carry over unchanged; the built-in list still ships in code — see
-- src/lib/business-categories.ts).
-- =============================================================================

-- Enum → text so category can hold custom slugs. Guarded so re-runs no-op.
do $$ begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'businesses'
      and column_name = 'category' and udt_name = 'business_category'
  ) then
    alter table public.businesses alter column category drop default;
    alter table public.businesses alter column category type text using category::text;
    alter table public.businesses alter column category set default 'other';
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'featured_business_categories'
      and column_name = 'category' and udt_name = 'business_category'
  ) then
    alter table public.featured_business_categories
      alter column category type text using category::text;
  end if;
end $$;

create table if not exists public.business_custom_categories (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces (id) on delete cascade,
  community_id uuid not null references public.communities (id) on delete cascade,
  created_by uuid not null references public.profiles (id) on delete cascade,
  -- The value stored in businesses.category ("fundi"); label is what renders.
  slug text not null check (slug ~ '^[a-z0-9][a-z0-9-]{0,39}$'),
  label text not null check (char_length(label) between 1 and 40),
  created_at timestamptz not null default now(),
  unique (space_id, slug)
);

create index if not exists idx_business_custom_categories_space
  on public.business_custom_categories (space_id, label);

alter table public.business_custom_categories enable row level security;

drop policy if exists "business_custom_categories_select" on public.business_custom_categories;
create policy "business_custom_categories_select" on public.business_custom_categories
  for select to authenticated
  using (public.can_view_space(space_id, auth.uid()));

drop policy if exists "business_custom_categories_insert_staff" on public.business_custom_categories;
create policy "business_custom_categories_insert_staff" on public.business_custom_categories
  for insert to authenticated
  with check (
    created_by = auth.uid()
    and public.is_community_staff(community_id, auth.uid())
  );

drop policy if exists "business_custom_categories_delete_staff" on public.business_custom_categories;
create policy "business_custom_categories_delete_staff" on public.business_custom_categories
  for delete to authenticated
  using (public.is_community_staff(community_id, auth.uid()));

-- Deleting a custom category folds its listings back into 'other' and drops
-- any nav sub-link featuring it, so no business is left with a dangling slug.
create or replace function public.cleanup_business_custom_category()
returns trigger as $$
begin
  update public.businesses set category = 'other'
    where space_id = old.space_id and category = old.slug;
  delete from public.featured_business_categories
    where space_id = old.space_id and category = old.slug;
  return old;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists cleanup_business_custom_category on public.business_custom_categories;
create trigger cleanup_business_custom_category after delete on public.business_custom_categories
  for each row execute function public.cleanup_business_custom_category();
