-- =============================================================================
-- The True Calendar: Personal Moon birth details.
--
-- One row per member: their date of birth (required) and, if they choose,
-- birth time, birthplace and timezones, plus their own wording for the three
-- highlighted Moon periods. Used only to work out their Sun sign in the
-- browser; the Moon's sign changes are calculated, never stored.
--
-- Private: only the member can read or change their row. There is no rule for
-- researchers, reviewers or admins, and nothing else joins to this table.
-- Deleting the member's profile deletes it.
--
-- Safe to re-run.
-- =============================================================================

create table if not exists public.calendar_birth_profiles (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  birth_date date not null check (birth_date between date '1700-01-01' and date '2200-12-31'),
  birth_time time,
  birth_place text check (birth_place is null or char_length(birth_place) <= 200),
  birth_time_zone text check (birth_time_zone is null or char_length(birth_time_zone) <= 80),
  display_time_zone text check (display_time_zone is null or char_length(display_time_zone) <= 80),
  -- {"preceding": {"title": "...", "guidance": "..."}, "sun": {...}, "following": {...}}
  period_wording jsonb not null default '{}'::jsonb check (jsonb_typeof(period_wording) = 'object' and pg_column_size(period_wording) <= 8000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.calendar_birth_profiles enable row level security;

revoke all on public.calendar_birth_profiles from anon;

drop policy if exists "calendar_birth_profiles_own_select" on public.calendar_birth_profiles;
create policy "calendar_birth_profiles_own_select" on public.calendar_birth_profiles
  for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "calendar_birth_profiles_own_insert" on public.calendar_birth_profiles;
create policy "calendar_birth_profiles_own_insert" on public.calendar_birth_profiles
  for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists "calendar_birth_profiles_own_update" on public.calendar_birth_profiles;
create policy "calendar_birth_profiles_own_update" on public.calendar_birth_profiles
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "calendar_birth_profiles_own_delete" on public.calendar_birth_profiles;
create policy "calendar_birth_profiles_own_delete" on public.calendar_birth_profiles
  for delete to authenticated
  using (user_id = auth.uid());

create or replace function public.calendar_birth_profiles_touch()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists calendar_birth_profiles_touch on public.calendar_birth_profiles;
create trigger calendar_birth_profiles_touch before update on public.calendar_birth_profiles
  for each row execute function public.calendar_birth_profiles_touch();
