-- =============================================================================
-- Relate — Space Builder, Stage 2: Journal spaces
--
-- Run this after supabase/space-types.sql AND supabase/community-custom-fields.sql
-- (reuses the public.profile_field_type enum that file creates). Safe to re-run.
--
-- A space with space_type = 'journal' gets its own set of admin-defined fields
-- (space_journal_fields — same shape as community_profile_fields, just scoped
-- to a space instead of a community) and members log entries against them
-- (space_journal_entries — one row per entry, answers keyed by field id in a
-- jsonb blob, same "structure normalized, answers jsonb" split used for
-- member profile values).
-- =============================================================================

create table if not exists public.space_journal_fields (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces (id) on delete cascade,
  label text not null,
  field_type public.profile_field_type not null default 'text',
  -- Only meaningful for dropdown/multiselect: array of option strings.
  options jsonb not null default '[]'::jsonb,
  is_required boolean not null default false,
  sort_order integer not null default 0,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (space_id, label)
);

drop trigger if exists set_updated_at on public.space_journal_fields;
create trigger set_updated_at before update on public.space_journal_fields
  for each row execute function public.set_updated_at();

create index if not exists idx_space_journal_fields_space on public.space_journal_fields (space_id);

alter table public.space_journal_fields enable row level security;

drop policy if exists "space_journal_fields_select" on public.space_journal_fields;
create policy "space_journal_fields_select" on public.space_journal_fields
  for select to authenticated
  using (public.can_view_space(space_id, auth.uid()));

drop policy if exists "space_journal_fields_manage_admin" on public.space_journal_fields;
create policy "space_journal_fields_manage_admin" on public.space_journal_fields
  for all to authenticated
  using (
    exists (
      select 1 from public.spaces s
      where s.id = space_journal_fields.space_id
        and public.is_community_admin(s.community_id, auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.spaces s
      where s.id = space_journal_fields.space_id
        and public.is_community_admin(s.community_id, auth.uid())
    )
  );

-- -----------------------------------------------------------------------------
-- space_journal_entries: one row per logged entry. `data` is jsonb keyed by
-- the field's id (stable across field renames) -> string/number/boolean/
-- array-of-strings depending on that field's type.
-- -----------------------------------------------------------------------------
create table if not exists public.space_journal_entries (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces (id) on delete cascade,
  community_id uuid not null references public.communities (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.space_journal_entries;
create trigger set_updated_at before update on public.space_journal_entries
  for each row execute function public.set_updated_at();

create index if not exists idx_space_journal_entries_space on public.space_journal_entries (space_id, created_at desc);
create index if not exists idx_space_journal_entries_author on public.space_journal_entries (author_id);

alter table public.space_journal_entries enable row level security;

drop policy if exists "space_journal_entries_select" on public.space_journal_entries;
create policy "space_journal_entries_select" on public.space_journal_entries
  for select to authenticated
  using (public.can_view_space(space_id, auth.uid()));

drop policy if exists "space_journal_entries_insert_member" on public.space_journal_entries;
create policy "space_journal_entries_insert_member" on public.space_journal_entries
  for insert to authenticated
  with check (
    author_id = auth.uid()
    and public.is_community_member(community_id, auth.uid())
    and public.can_view_space(space_id, auth.uid())
  );

drop policy if exists "space_journal_entries_update_author_or_staff" on public.space_journal_entries;
create policy "space_journal_entries_update_author_or_staff" on public.space_journal_entries
  for update to authenticated
  using (author_id = auth.uid() or public.is_community_staff(community_id, auth.uid()))
  with check (author_id = auth.uid() or public.is_community_staff(community_id, auth.uid()));

drop policy if exists "space_journal_entries_delete_author_or_staff" on public.space_journal_entries;
create policy "space_journal_entries_delete_author_or_staff" on public.space_journal_entries
  for delete to authenticated
  using (author_id = auth.uid() or public.is_community_staff(community_id, auth.uid()));
