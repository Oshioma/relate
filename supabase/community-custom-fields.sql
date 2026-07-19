-- =============================================================================
-- Relate — Member Directory, Stage 1b: community custom profile fields
--
-- Run this after supabase/member-profile-extensions.sql. Safe to re-run.
--
-- Lets a community owner/admin define unlimited custom profile fields
-- scoped to their community (e.g. Kushukuru: "Villa Owner", "Construction
-- Stage"; Farming: "Farm Size", "Organic Certified"). Members fill in
-- values for the communities they belong to.
-- =============================================================================

do $$ begin
  create type public.profile_field_type as enum (
    'text', 'textarea', 'number', 'date', 'dropdown', 'multiselect', 'checkbox', 'url'
  );
exception when duplicate_object then null; end $$;

create table if not exists public.community_profile_fields (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities (id) on delete cascade,
  label text not null,
  field_type public.profile_field_type not null default 'text',
  -- Only meaningful for dropdown/multiselect: array of option strings.
  options jsonb not null default '[]'::jsonb,
  is_required boolean not null default false,
  sort_order integer not null default 0,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (community_id, label)
);

drop trigger if exists set_updated_at on public.community_profile_fields;
create trigger set_updated_at before update on public.community_profile_fields
  for each row execute function public.set_updated_at();

create index if not exists idx_community_profile_fields_community on public.community_profile_fields (community_id);

alter table public.community_profile_fields enable row level security;

drop policy if exists "community_profile_fields_select" on public.community_profile_fields;
create policy "community_profile_fields_select" on public.community_profile_fields
  for select to authenticated
  using (public.is_community_member(community_id, auth.uid()) or public.is_community_admin(community_id, auth.uid()));

drop policy if exists "community_profile_fields_manage_admin" on public.community_profile_fields;
create policy "community_profile_fields_manage_admin" on public.community_profile_fields
  for all to authenticated
  using (public.is_community_admin(community_id, auth.uid()))
  with check (public.is_community_admin(community_id, auth.uid()));

-- -----------------------------------------------------------------------------
-- community_profile_values: a member's answer to one custom field.
-- `value` is jsonb so a single column can hold any field type's shape:
-- text/textarea/date/dropdown/url -> string, number -> number,
-- multiselect -> array of strings, checkbox -> boolean.
-- -----------------------------------------------------------------------------
create table if not exists public.community_profile_values (
  id uuid primary key default gen_random_uuid(),
  field_id uuid not null references public.community_profile_fields (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  community_id uuid not null references public.communities (id) on delete cascade,
  value jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (field_id, profile_id)
);

drop trigger if exists set_updated_at on public.community_profile_values;
create trigger set_updated_at before update on public.community_profile_values
  for each row execute function public.set_updated_at();

create index if not exists idx_community_profile_values_profile on public.community_profile_values (profile_id);
create index if not exists idx_community_profile_values_community on public.community_profile_values (community_id);

alter table public.community_profile_values enable row level security;

drop policy if exists "community_profile_values_select" on public.community_profile_values;
create policy "community_profile_values_select" on public.community_profile_values
  for select to authenticated
  using (
    profile_id = auth.uid()
    or public.is_community_member(community_id, auth.uid())
    or public.is_community_admin(community_id, auth.uid())
  );

drop policy if exists "community_profile_values_manage_own" on public.community_profile_values;
create policy "community_profile_values_manage_own" on public.community_profile_values
  for all to authenticated
  using (profile_id = auth.uid() and public.is_community_member(community_id, auth.uid()))
  with check (profile_id = auth.uid() and public.is_community_member(community_id, auth.uid()));

drop policy if exists "community_profile_values_delete_admin" on public.community_profile_values;
create policy "community_profile_values_delete_admin" on public.community_profile_values
  for delete to authenticated
  using (public.is_community_admin(community_id, auth.uid()));
