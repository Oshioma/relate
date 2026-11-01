-- =============================================================================
-- Relate — The True Calendar: cultural research database
--
-- Research about how cultures kept time lives here, shared by every True
-- Calendar space (it is reference material, not one community's posts).
-- Three layers are kept apart on purpose:
--   1. historical claims (cultures, systems, cycles, months, days,
--      observances, meanings), each linked to sources in
--      calendar_claim_sources;
--   2. rules that place a cycle on modern dates (calendar_cycles.anchor_*),
--      only usable with a sourced anchor;
--   3. modern practical interpretations (calendar_recommendations
--      .modern_interpretation), always shown as modern.
--
-- Every row has a stable text key (e.g. 'west-africa.akan') so repeated
-- imports upsert instead of duplicating, evidence tags (several allowed),
-- confidence and an uncertainty note, and a review status. Readers only ever
-- see 'published' rows.
--
-- WHO CAN WRITE. Platform super admins and people listed in
-- calendar_researchers. Only super admins and researchers with the
-- 'reviewer' role can publish (enforced by a trigger, so it holds for any
-- client). Astronomical events are never stored: they are calculated.
--
-- Safe to re-run.
-- =============================================================================

create table if not exists public.calendar_researchers (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  role text not null default 'researcher' check (role in ('researcher', 'reviewer')),
  added_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create or replace function public.is_calendar_researcher(p_user_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select p_user_id is not null and (
    public.is_super_admin(p_user_id)
    or exists (select 1 from public.calendar_researchers r where r.user_id = p_user_id)
  );
$$;

create or replace function public.is_calendar_reviewer(p_user_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select p_user_id is not null and (
    public.is_super_admin(p_user_id)
    or exists (select 1 from public.calendar_researchers r where r.user_id = p_user_id and r.role = 'reviewer')
  );
$$;

alter table public.calendar_researchers enable row level security;

drop policy if exists "calendar_researchers_select" on public.calendar_researchers;
create policy "calendar_researchers_select" on public.calendar_researchers
  for select to authenticated
  using (user_id = auth.uid() or public.is_super_admin(auth.uid()));

drop policy if exists "calendar_researchers_admin" on public.calendar_researchers;
create policy "calendar_researchers_admin" on public.calendar_researchers
  for all to authenticated
  using (public.is_super_admin(auth.uid()))
  with check (public.is_super_admin(auth.uid()));

-- Publishing is a reviewer's call. A service-role script (no auth.uid()) is
-- trusted, as everywhere else in this schema.
create or replace function public.calendar_guard_publish()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.review_status = 'published'
     and (tg_op = 'INSERT' or old.review_status is distinct from 'published')
     and auth.uid() is not null
     and not public.is_calendar_reviewer(auth.uid()) then
    raise exception 'Only a calendar reviewer can publish research'
      using errcode = '42501';
  end if;
  new.updated_at := now();
  return new;
end;
$$;

-- calendar_sources -----------------------------------------------------------

create table if not exists public.calendar_sources (
  key text primary key,
  title text not null,
  author text,
  publisher text,
  published text,
  pages text,
  url text,
  accessed_on date,
  source_type text not null default 'academic' check (source_type in ('primary_text', 'archaeological', 'academic', 'ethnographic', 'oral_history', 'reference', 'official', 'web')),
  notes text,
  evidence text[] not null default '{}',
  confidence text check (confidence in ('high', 'medium', 'low')),
  uncertainty text,
  period_label text,
  review_status text not null default 'draft' check (review_status in ('draft', 'in_review', 'published', 'rejected')),
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_calendar_sources_review on public.calendar_sources (review_status);

-- calendar_cultures ----------------------------------------------------------

create table if not exists public.calendar_cultures (
  key text primary key,
  name text not null,
  alt_names text[] not null default '{}',
  continent text not null,
  region text,
  countries text[] not null default '{}',
  related_keys text[] not null default '{}',
  period_start integer,
  period_end integer,
  continues_today text check (continues_today in ('yes', 'no', 'partly', 'unknown')),
  people text,
  places text,
  overview text,
  research_status text not null default 'not_started' check (research_status in ('not_started', 'in_progress', 'partial', 'complete')),
  sort_order integer not null default 0,
  evidence text[] not null default '{}',
  confidence text check (confidence in ('high', 'medium', 'low')),
  uncertainty text,
  period_label text,
  review_status text not null default 'draft' check (review_status in ('draft', 'in_review', 'published', 'rejected')),
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_calendar_cultures_continent on public.calendar_cultures (continent);
create index if not exists idx_calendar_cultures_research_status on public.calendar_cultures (research_status);
create index if not exists idx_calendar_cultures_review on public.calendar_cultures (review_status);

-- calendar_systems -----------------------------------------------------------

create table if not exists public.calendar_systems (
  key text primary key,
  culture_key text not null references public.calendar_cultures (key) on update cascade on delete cascade,
  name text not null,
  original_name text,
  transliteration text,
  translation text,
  kind text not null check (kind in ('lunar', 'solar', 'lunisolar', 'day_cycle', 'stellar', 'seasonal', 'other')),
  day_rule text,
  month_rule text,
  year_rule text,
  intercalation text,
  sky_and_seasons text,
  reforms text,
  description text,
  evidence text[] not null default '{}',
  confidence text check (confidence in ('high', 'medium', 'low')),
  uncertainty text,
  period_label text,
  review_status text not null default 'draft' check (review_status in ('draft', 'in_review', 'published', 'rejected')),
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_calendar_systems_culture_key on public.calendar_systems (culture_key);
create index if not exists idx_calendar_systems_review on public.calendar_systems (review_status);

-- calendar_cycles ------------------------------------------------------------

create table if not exists public.calendar_cycles (
  key text primary key,
  system_key text not null references public.calendar_systems (key) on update cascade on delete cascade,
  name text not null,
  original_name text,
  transliteration text,
  translation text,
  length_days integer not null check (length_days between 2 and 1000),
  description text,
  -- A cycle can be placed on modern dates only with a sourced anchor: the
  -- Gregorian date of one known position (0-based) of the cycle.
  anchor_date date,
  anchor_position integer,
  anchor_source_key text references public.calendar_sources (key) on update cascade on delete set null,
  anchor_note text,
  regional_note text,
  evidence text[] not null default '{}',
  confidence text check (confidence in ('high', 'medium', 'low')),
  uncertainty text,
  period_label text,
  review_status text not null default 'draft' check (review_status in ('draft', 'in_review', 'published', 'rejected')),
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_calendar_cycles_system_key on public.calendar_cycles (system_key);
create index if not exists idx_calendar_cycles_review on public.calendar_cycles (review_status);

-- calendar_cycle_positions ---------------------------------------------------

create table if not exists public.calendar_cycle_positions (
  key text primary key,
  cycle_key text not null references public.calendar_cycles (key) on update cascade on delete cascade,
  position integer not null check (position >= 0),
  name text not null,
  original_name text,
  transliteration text,
  translation text,
  meaning text,
  favourability text check (favourability in ('favourable', 'unfavourable', 'mixed', 'neutral')),
  evidence text[] not null default '{}',
  confidence text check (confidence in ('high', 'medium', 'low')),
  uncertainty text,
  period_label text,
  review_status text not null default 'draft' check (review_status in ('draft', 'in_review', 'published', 'rejected')),
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_calendar_cycle_positions_cycle_key on public.calendar_cycle_positions (cycle_key);
create index if not exists idx_calendar_cycle_positions_review on public.calendar_cycle_positions (review_status);

-- calendar_months ------------------------------------------------------------

create table if not exists public.calendar_months (
  key text primary key,
  system_key text not null references public.calendar_systems (key) on update cascade on delete cascade,
  ordinal integer not null,
  name text not null,
  original_name text,
  transliteration text,
  translation text,
  alt_names text[] not null default '{}',
  season text,
  description text,
  evidence text[] not null default '{}',
  confidence text check (confidence in ('high', 'medium', 'low')),
  uncertainty text,
  period_label text,
  review_status text not null default 'draft' check (review_status in ('draft', 'in_review', 'published', 'rejected')),
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_calendar_months_system_key on public.calendar_months (system_key);
create index if not exists idx_calendar_months_review on public.calendar_months (review_status);

-- calendar_lunar_days --------------------------------------------------------

create table if not exists public.calendar_lunar_days (
  key text primary key,
  system_key text not null references public.calendar_systems (key) on update cascade on delete cascade,
  day_number integer not null check (day_number between 1 and 30),
  name text,
  original_name text,
  transliteration text,
  translation text,
  meaning text,
  favourability text check (favourability in ('favourable', 'unfavourable', 'mixed', 'neutral')),
  evidence text[] not null default '{}',
  confidence text check (confidence in ('high', 'medium', 'low')),
  uncertainty text,
  period_label text,
  review_status text not null default 'draft' check (review_status in ('draft', 'in_review', 'published', 'rejected')),
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_calendar_lunar_days_system_key on public.calendar_lunar_days (system_key);
create index if not exists idx_calendar_lunar_days_review on public.calendar_lunar_days (review_status);

-- calendar_observances -------------------------------------------------------

create table if not exists public.calendar_observances (
  key text primary key,
  culture_key text not null references public.calendar_cultures (key) on update cascade on delete cascade,
  system_key text references public.calendar_systems (key) on update cascade on delete set null,
  name text not null,
  original_name text,
  transliteration text,
  translation text,
  kind text not null default 'festival' check (kind in ('festival', 'ritual', 'ceremony', 'agricultural', 'fishing', 'market', 'royal', 'other')),
  timing text,
  month_key text references public.calendar_months (key) on update cascade on delete set null,
  lunar_day integer check (lunar_day between 1 and 30),
  cycle_position_key text references public.calendar_cycle_positions (key) on update cascade on delete set null,
  moon_phase text check (moon_phase in ('new', 'first_crescent', 'waxing', 'first_quarter', 'full', 'waning', 'last_quarter', 'dark')),
  deities text,
  description text,
  evidence text[] not null default '{}',
  confidence text check (confidence in ('high', 'medium', 'low')),
  uncertainty text,
  period_label text,
  review_status text not null default 'draft' check (review_status in ('draft', 'in_review', 'published', 'rejected')),
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_calendar_observances_culture_key on public.calendar_observances (culture_key);
create index if not exists idx_calendar_observances_cycle_position_key on public.calendar_observances (cycle_position_key);
create index if not exists idx_calendar_observances_review on public.calendar_observances (review_status);

-- calendar_meanings ----------------------------------------------------------

create table if not exists public.calendar_meanings (
  key text primary key,
  culture_key text not null references public.calendar_cultures (key) on update cascade on delete cascade,
  system_key text references public.calendar_systems (key) on update cascade on delete set null,
  subject text not null check (subject in ('moon_phase', 'lunar_day', 'month', 'cycle_position', 'observance', 'season', 'general')),
  subject_key text,
  moon_phase text check (moon_phase in ('new', 'first_crescent', 'waxing', 'first_quarter', 'full', 'waning', 'last_quarter', 'dark')),
  meaning text not null,
  deities text,
  interpretation text not null default 'primary' check (interpretation in ('primary', 'alternative')),
  evidence text[] not null default '{}',
  confidence text check (confidence in ('high', 'medium', 'low')),
  uncertainty text,
  period_label text,
  review_status text not null default 'draft' check (review_status in ('draft', 'in_review', 'published', 'rejected')),
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_calendar_meanings_culture_key on public.calendar_meanings (culture_key);
create index if not exists idx_calendar_meanings_subject_key on public.calendar_meanings (subject_key);
create index if not exists idx_calendar_meanings_review on public.calendar_meanings (review_status);

-- calendar_recommendations ---------------------------------------------------

create table if not exists public.calendar_recommendations (
  key text primary key,
  culture_key text not null references public.calendar_cultures (key) on update cascade on delete cascade,
  system_key text references public.calendar_systems (key) on update cascade on delete set null,
  cycle_position_key text references public.calendar_cycle_positions (key) on update cascade on delete set null,
  observance_key text references public.calendar_observances (key) on update cascade on delete set null,
  lunar_day_key text references public.calendar_lunar_days (key) on update cascade on delete set null,
  meaning_key text references public.calendar_meanings (key) on update cascade on delete set null,
  moon_phase text check (moon_phase in ('new', 'first_crescent', 'waxing', 'first_quarter', 'full', 'waning', 'last_quarter', 'dark')),
  activity text not null check (activity in ('planting', 'harvesting', 'fishing', 'travel', 'trade', 'rest', 'ceremony', 'remembrance', 'community', 'other')),
  -- What the tradition did (sourced) and a modern reading of it (always
  -- labelled as modern in the interface). Never merged into one field.
  historical_practice text not null,
  modern_interpretation text,
  evidence text[] not null default '{}',
  confidence text check (confidence in ('high', 'medium', 'low')),
  uncertainty text,
  period_label text,
  review_status text not null default 'draft' check (review_status in ('draft', 'in_review', 'published', 'rejected')),
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_calendar_recommendations_culture_key on public.calendar_recommendations (culture_key);
create index if not exists idx_calendar_recommendations_cycle_position_key on public.calendar_recommendations (cycle_position_key);
create index if not exists idx_calendar_recommendations_review on public.calendar_recommendations (review_status);

-- calendar_date_correspondences ----------------------------------------------

create table if not exists public.calendar_date_correspondences (
  key text primary key,
  culture_key text not null references public.calendar_cultures (key) on update cascade on delete cascade,
  system_key text references public.calendar_systems (key) on update cascade on delete set null,
  label text not null,
  original_date text,
  gregorian_from date,
  gregorian_to date,
  certainty text not null default 'uncertain' check (certainty in ('exact', 'approximate', 'uncertain')),
  notes text,
  evidence text[] not null default '{}',
  confidence text check (confidence in ('high', 'medium', 'low')),
  uncertainty text,
  period_label text,
  review_status text not null default 'draft' check (review_status in ('draft', 'in_review', 'published', 'rejected')),
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_calendar_date_correspondences_culture_key on public.calendar_date_correspondences (culture_key);
create index if not exists idx_calendar_date_correspondences_review on public.calendar_date_correspondences (review_status);

create unique index if not exists idx_calendar_cycle_positions_unique on public.calendar_cycle_positions (cycle_key, position);
create unique index if not exists idx_calendar_months_unique on public.calendar_months (system_key, ordinal);
create unique index if not exists idx_calendar_lunar_days_unique on public.calendar_lunar_days (system_key, day_number);

-- calendar_claim_sources -------------------------------------------------------
-- Which source supports (or disputes) which claim. Claims are addressed by
-- table and key so one source can back claims of any kind.

create table if not exists public.calendar_claim_sources (
  id uuid primary key default gen_random_uuid(),
  claim_table text not null check (claim_table in ('calendar_cultures', 'calendar_systems', 'calendar_cycles', 'calendar_cycle_positions', 'calendar_months', 'calendar_lunar_days', 'calendar_observances', 'calendar_meanings', 'calendar_recommendations', 'calendar_date_correspondences')),
  claim_key text not null,
  source_key text not null references public.calendar_sources (key) on update cascade on delete cascade,
  locator text not null default '',
  quote text,
  relation text not null default 'supports' check (relation in ('supports', 'disputes', 'context')),
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (claim_table, claim_key, source_key, locator)
);

create index if not exists idx_calendar_claim_sources_claim on public.calendar_claim_sources (claim_table, claim_key);

-- calendar_research_reviews ------------------------------------------------------

create table if not exists public.calendar_research_reviews (
  id uuid primary key default gen_random_uuid(),
  claim_table text not null,
  claim_key text not null,
  status text not null check (status in ('draft', 'in_review', 'published', 'rejected')),
  notes text,
  reviewer_id uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_calendar_research_reviews_claim on public.calendar_research_reviews (claim_table, claim_key);

-- calendar_import_runs -------------------------------------------------------------

create table if not exists public.calendar_import_runs (
  id uuid primary key default gen_random_uuid(),
  format_version text not null,
  dry_run boolean not null,
  summary jsonb not null default '{}',
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

-- calendar_user_bookmarks ------------------------------------------------------
-- A member's saved dates and traditions, private to them.

create table if not exists public.calendar_user_bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  space_id uuid not null references public.spaces (id) on delete cascade,
  kind text not null check (kind in ('date', 'culture')),
  date_iso text,
  culture_key text,
  note text check (note is null or char_length(note) <= 500),
  created_at timestamptz not null default now(),
  check ((kind = 'date' and date_iso is not null) or (kind = 'culture' and culture_key is not null))
);

create unique index if not exists idx_calendar_user_bookmarks_unique
  on public.calendar_user_bookmarks (user_id, space_id, kind, coalesce(date_iso, ''), coalesce(culture_key, ''));

-- Row-level security ----------------------------------------------------------------

alter table public.calendar_sources enable row level security;

drop policy if exists "calendar_sources_select" on public.calendar_sources;
create policy "calendar_sources_select" on public.calendar_sources
  for select to authenticated
  using (review_status = 'published' or public.is_calendar_researcher(auth.uid()));

drop policy if exists "calendar_sources_write" on public.calendar_sources;
create policy "calendar_sources_write" on public.calendar_sources
  for all to authenticated
  using (public.is_calendar_researcher(auth.uid()))
  with check (public.is_calendar_researcher(auth.uid()));

drop trigger if exists calendar_guard_publish on public.calendar_sources;
create trigger calendar_guard_publish before insert or update on public.calendar_sources
  for each row execute function public.calendar_guard_publish();

alter table public.calendar_cultures enable row level security;

drop policy if exists "calendar_cultures_select" on public.calendar_cultures;
create policy "calendar_cultures_select" on public.calendar_cultures
  for select to authenticated
  using (review_status = 'published' or public.is_calendar_researcher(auth.uid()));

drop policy if exists "calendar_cultures_write" on public.calendar_cultures;
create policy "calendar_cultures_write" on public.calendar_cultures
  for all to authenticated
  using (public.is_calendar_researcher(auth.uid()))
  with check (public.is_calendar_researcher(auth.uid()));

drop trigger if exists calendar_guard_publish on public.calendar_cultures;
create trigger calendar_guard_publish before insert or update on public.calendar_cultures
  for each row execute function public.calendar_guard_publish();

alter table public.calendar_systems enable row level security;

drop policy if exists "calendar_systems_select" on public.calendar_systems;
create policy "calendar_systems_select" on public.calendar_systems
  for select to authenticated
  using (review_status = 'published' or public.is_calendar_researcher(auth.uid()));

drop policy if exists "calendar_systems_write" on public.calendar_systems;
create policy "calendar_systems_write" on public.calendar_systems
  for all to authenticated
  using (public.is_calendar_researcher(auth.uid()))
  with check (public.is_calendar_researcher(auth.uid()));

drop trigger if exists calendar_guard_publish on public.calendar_systems;
create trigger calendar_guard_publish before insert or update on public.calendar_systems
  for each row execute function public.calendar_guard_publish();

alter table public.calendar_cycles enable row level security;

drop policy if exists "calendar_cycles_select" on public.calendar_cycles;
create policy "calendar_cycles_select" on public.calendar_cycles
  for select to authenticated
  using (review_status = 'published' or public.is_calendar_researcher(auth.uid()));

drop policy if exists "calendar_cycles_write" on public.calendar_cycles;
create policy "calendar_cycles_write" on public.calendar_cycles
  for all to authenticated
  using (public.is_calendar_researcher(auth.uid()))
  with check (public.is_calendar_researcher(auth.uid()));

drop trigger if exists calendar_guard_publish on public.calendar_cycles;
create trigger calendar_guard_publish before insert or update on public.calendar_cycles
  for each row execute function public.calendar_guard_publish();

alter table public.calendar_cycle_positions enable row level security;

drop policy if exists "calendar_cycle_positions_select" on public.calendar_cycle_positions;
create policy "calendar_cycle_positions_select" on public.calendar_cycle_positions
  for select to authenticated
  using (review_status = 'published' or public.is_calendar_researcher(auth.uid()));

drop policy if exists "calendar_cycle_positions_write" on public.calendar_cycle_positions;
create policy "calendar_cycle_positions_write" on public.calendar_cycle_positions
  for all to authenticated
  using (public.is_calendar_researcher(auth.uid()))
  with check (public.is_calendar_researcher(auth.uid()));

drop trigger if exists calendar_guard_publish on public.calendar_cycle_positions;
create trigger calendar_guard_publish before insert or update on public.calendar_cycle_positions
  for each row execute function public.calendar_guard_publish();

alter table public.calendar_months enable row level security;

drop policy if exists "calendar_months_select" on public.calendar_months;
create policy "calendar_months_select" on public.calendar_months
  for select to authenticated
  using (review_status = 'published' or public.is_calendar_researcher(auth.uid()));

drop policy if exists "calendar_months_write" on public.calendar_months;
create policy "calendar_months_write" on public.calendar_months
  for all to authenticated
  using (public.is_calendar_researcher(auth.uid()))
  with check (public.is_calendar_researcher(auth.uid()));

drop trigger if exists calendar_guard_publish on public.calendar_months;
create trigger calendar_guard_publish before insert or update on public.calendar_months
  for each row execute function public.calendar_guard_publish();

alter table public.calendar_lunar_days enable row level security;

drop policy if exists "calendar_lunar_days_select" on public.calendar_lunar_days;
create policy "calendar_lunar_days_select" on public.calendar_lunar_days
  for select to authenticated
  using (review_status = 'published' or public.is_calendar_researcher(auth.uid()));

drop policy if exists "calendar_lunar_days_write" on public.calendar_lunar_days;
create policy "calendar_lunar_days_write" on public.calendar_lunar_days
  for all to authenticated
  using (public.is_calendar_researcher(auth.uid()))
  with check (public.is_calendar_researcher(auth.uid()));

drop trigger if exists calendar_guard_publish on public.calendar_lunar_days;
create trigger calendar_guard_publish before insert or update on public.calendar_lunar_days
  for each row execute function public.calendar_guard_publish();

alter table public.calendar_observances enable row level security;

drop policy if exists "calendar_observances_select" on public.calendar_observances;
create policy "calendar_observances_select" on public.calendar_observances
  for select to authenticated
  using (review_status = 'published' or public.is_calendar_researcher(auth.uid()));

drop policy if exists "calendar_observances_write" on public.calendar_observances;
create policy "calendar_observances_write" on public.calendar_observances
  for all to authenticated
  using (public.is_calendar_researcher(auth.uid()))
  with check (public.is_calendar_researcher(auth.uid()));

drop trigger if exists calendar_guard_publish on public.calendar_observances;
create trigger calendar_guard_publish before insert or update on public.calendar_observances
  for each row execute function public.calendar_guard_publish();

alter table public.calendar_meanings enable row level security;

drop policy if exists "calendar_meanings_select" on public.calendar_meanings;
create policy "calendar_meanings_select" on public.calendar_meanings
  for select to authenticated
  using (review_status = 'published' or public.is_calendar_researcher(auth.uid()));

drop policy if exists "calendar_meanings_write" on public.calendar_meanings;
create policy "calendar_meanings_write" on public.calendar_meanings
  for all to authenticated
  using (public.is_calendar_researcher(auth.uid()))
  with check (public.is_calendar_researcher(auth.uid()));

drop trigger if exists calendar_guard_publish on public.calendar_meanings;
create trigger calendar_guard_publish before insert or update on public.calendar_meanings
  for each row execute function public.calendar_guard_publish();

alter table public.calendar_recommendations enable row level security;

drop policy if exists "calendar_recommendations_select" on public.calendar_recommendations;
create policy "calendar_recommendations_select" on public.calendar_recommendations
  for select to authenticated
  using (review_status = 'published' or public.is_calendar_researcher(auth.uid()));

drop policy if exists "calendar_recommendations_write" on public.calendar_recommendations;
create policy "calendar_recommendations_write" on public.calendar_recommendations
  for all to authenticated
  using (public.is_calendar_researcher(auth.uid()))
  with check (public.is_calendar_researcher(auth.uid()));

drop trigger if exists calendar_guard_publish on public.calendar_recommendations;
create trigger calendar_guard_publish before insert or update on public.calendar_recommendations
  for each row execute function public.calendar_guard_publish();

alter table public.calendar_date_correspondences enable row level security;

drop policy if exists "calendar_date_correspondences_select" on public.calendar_date_correspondences;
create policy "calendar_date_correspondences_select" on public.calendar_date_correspondences
  for select to authenticated
  using (review_status = 'published' or public.is_calendar_researcher(auth.uid()));

drop policy if exists "calendar_date_correspondences_write" on public.calendar_date_correspondences;
create policy "calendar_date_correspondences_write" on public.calendar_date_correspondences
  for all to authenticated
  using (public.is_calendar_researcher(auth.uid()))
  with check (public.is_calendar_researcher(auth.uid()));

drop trigger if exists calendar_guard_publish on public.calendar_date_correspondences;
create trigger calendar_guard_publish before insert or update on public.calendar_date_correspondences
  for each row execute function public.calendar_guard_publish();

alter table public.calendar_claim_sources enable row level security;

drop policy if exists "calendar_claim_sources_select" on public.calendar_claim_sources;
create policy "calendar_claim_sources_select" on public.calendar_claim_sources
  for select to authenticated
  using (true);

drop policy if exists "calendar_claim_sources_write" on public.calendar_claim_sources;
create policy "calendar_claim_sources_write" on public.calendar_claim_sources
  for all to authenticated
  using (public.is_calendar_researcher(auth.uid()))
  with check (public.is_calendar_researcher(auth.uid()));

alter table public.calendar_research_reviews enable row level security;

drop policy if exists "calendar_research_reviews_researchers" on public.calendar_research_reviews;
create policy "calendar_research_reviews_researchers" on public.calendar_research_reviews
  for all to authenticated
  using (public.is_calendar_researcher(auth.uid()))
  with check (public.is_calendar_researcher(auth.uid()));

alter table public.calendar_import_runs enable row level security;

drop policy if exists "calendar_import_runs_researchers" on public.calendar_import_runs;
create policy "calendar_import_runs_researchers" on public.calendar_import_runs
  for all to authenticated
  using (public.is_calendar_researcher(auth.uid()))
  with check (public.is_calendar_researcher(auth.uid()));

alter table public.calendar_user_bookmarks enable row level security;

drop policy if exists "calendar_user_bookmarks_own" on public.calendar_user_bookmarks;
create policy "calendar_user_bookmarks_own" on public.calendar_user_bookmarks
  for all to authenticated
  using (user_id = auth.uid())
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.spaces s
      where s.id = calendar_user_bookmarks.space_id
        and s.space_type = 'true_calendar'
        and public.can_view_space(s.id, auth.uid())
    )
  );

-- The catalogue: the 80 research targets from Oshi's brief, as entries with a
-- name and region only. These are research targets, not claims that 80
-- complete calendars survive: every one starts as 'not_started' and says so.
-- Existing rows are left alone, so research already imported is never reset.

insert into public.calendar_cultures (key, name, continent, region, sort_order, research_status, review_status)
values
  ('africa.east.swahili', 'Swahili', 'Africa', 'East Africa', 0, 'not_started', 'published'),
  ('africa.east.borana-oromo', 'Borana Oromo', 'Africa', 'East Africa', 1, 'not_started', 'published'),
  ('africa.east.oromo-other', 'Other Oromo traditions', 'Africa', 'East Africa', 2, 'not_started', 'published'),
  ('africa.east.maasai', 'Maasai', 'Africa', 'East Africa', 3, 'not_started', 'published'),
  ('africa.east.samburu', 'Samburu', 'Africa', 'East Africa', 4, 'not_started', 'published'),
  ('africa.east.turkana', 'Turkana', 'Africa', 'East Africa', 5, 'not_started', 'published'),
  ('africa.east.rendille', 'Rendille', 'Africa', 'East Africa', 6, 'not_started', 'published'),
  ('africa.east.somali', 'Somali', 'Africa', 'East Africa', 7, 'not_started', 'published'),
  ('africa.east.afar', 'Afar', 'Africa', 'East Africa', 8, 'not_started', 'published'),
  ('africa.east.amhara', 'Amhara', 'Africa', 'East Africa', 9, 'not_started', 'published'),
  ('africa.east.tigrayan', 'Tigrayan', 'Africa', 'East Africa', 10, 'not_started', 'published'),
  ('africa.east.sidama', 'Sidama', 'Africa', 'East Africa', 11, 'not_started', 'published'),
  ('africa.east.konso', 'Konso', 'Africa', 'East Africa', 12, 'not_started', 'published'),
  ('africa.east.dinka', 'Dinka', 'Africa', 'East Africa', 13, 'not_started', 'published'),
  ('africa.east.nuer', 'Nuer', 'Africa', 'East Africa', 14, 'not_started', 'published'),
  ('africa.east.luo', 'Luo', 'Africa', 'East Africa', 15, 'not_started', 'published'),
  ('africa.east.baganda', 'Baganda', 'Africa', 'East Africa', 16, 'not_started', 'published'),
  ('africa.east.banyankole', 'Banyankole', 'Africa', 'East Africa', 17, 'not_started', 'published'),
  ('africa.east.sukuma', 'Sukuma', 'Africa', 'East Africa', 18, 'not_started', 'published'),
  ('africa.east.hadza', 'Hadza', 'Africa', 'East Africa', 19, 'not_started', 'published'),
  ('africa.north.ancient-egyptian', 'Ancient Egyptian', 'Africa', 'North Africa and the Nile', 20, 'not_started', 'published'),
  ('africa.north.nubian-kushite', 'Nubian / Kushite', 'Africa', 'North Africa and the Nile', 21, 'not_started', 'published'),
  ('africa.north.ancient-libyan', 'Ancient Libyan', 'Africa', 'North Africa and the Nile', 22, 'not_started', 'published'),
  ('africa.north.amazigh', 'Amazigh / Berber', 'Africa', 'North Africa and the Nile', 23, 'not_started', 'published'),
  ('africa.west.yoruba', 'Yoruba', 'Africa', 'West Africa', 24, 'not_started', 'published'),
  ('africa.west.igbo', 'Igbo', 'Africa', 'West Africa', 25, 'not_started', 'published'),
  ('africa.west.akan', 'Akan / Asante', 'Africa', 'West Africa', 26, 'not_started', 'published'),
  ('africa.west.dogon', 'Dogon', 'Africa', 'West Africa', 27, 'not_started', 'published'),
  ('europe.athenian-greek', 'Athenian Greek', 'Europe', 'Mediterranean and Europe', 28, 'not_started', 'published'),
  ('europe.spartan', 'Spartan', 'Europe', 'Mediterranean and Europe', 29, 'not_started', 'published'),
  ('europe.macedonian', 'Macedonian', 'Europe', 'Mediterranean and Europe', 30, 'not_started', 'published'),
  ('europe.ancient-roman', 'Ancient Roman', 'Europe', 'Mediterranean and Europe', 31, 'not_started', 'published'),
  ('europe.etruscan', 'Etruscan', 'Europe', 'Mediterranean and Europe', 32, 'not_started', 'published'),
  ('europe.celtic-irish', 'Celtic Irish', 'Europe', 'Mediterranean and Europe', 33, 'not_started', 'published'),
  ('europe.welsh', 'Welsh', 'Europe', 'Mediterranean and Europe', 34, 'not_started', 'published'),
  ('europe.norse', 'Norse', 'Europe', 'Mediterranean and Europe', 35, 'not_started', 'published'),
  ('europe.germanic', 'Germanic', 'Europe', 'Mediterranean and Europe', 36, 'not_started', 'published'),
  ('europe.slavic', 'Slavic', 'Europe', 'Mediterranean and Europe', 37, 'not_started', 'published'),
  ('middle-east.sumerian', 'Sumerian', 'Middle East', 'Middle East', 38, 'not_started', 'published'),
  ('middle-east.babylonian', 'Babylonian', 'Middle East', 'Middle East', 39, 'not_started', 'published'),
  ('middle-east.assyrian', 'Assyrian', 'Middle East', 'Middle East', 40, 'not_started', 'published'),
  ('middle-east.ancient-hebrew', 'Ancient Hebrew', 'Middle East', 'Middle East', 41, 'not_started', 'published'),
  ('middle-east.nabataean', 'Nabataean', 'Middle East', 'Middle East', 42, 'not_started', 'published'),
  ('middle-east.pre-islamic-arabian', 'Pre-Islamic Arabian', 'Middle East', 'Middle East', 43, 'not_started', 'published'),
  ('middle-east.islamic-arabian', 'Islamic Arabian', 'Middle East', 'Middle East', 44, 'not_started', 'published'),
  ('middle-east.persian', 'Persian', 'Middle East', 'Middle East', 45, 'not_started', 'published'),
  ('asia.south.vedic-hindu', 'Vedic Hindu', 'Asia', 'South Asia', 46, 'not_started', 'published'),
  ('asia.south.tamil', 'Tamil', 'Asia', 'South Asia', 47, 'not_started', 'published'),
  ('asia.south.bengali', 'Bengali', 'Asia', 'South Asia', 48, 'not_started', 'published'),
  ('asia.south.sri-lankan-buddhist', 'Sri Lankan Buddhist', 'Asia', 'South Asia', 49, 'not_started', 'published'),
  ('asia.south.jain', 'Jain', 'Asia', 'South Asia', 50, 'not_started', 'published'),
  ('asia.south.tibetan', 'Tibetan', 'Asia', 'South Asia', 51, 'not_started', 'published'),
  ('asia.south.newar', 'Nepali Newar', 'Asia', 'South Asia', 52, 'not_started', 'published'),
  ('asia.east.chinese', 'Chinese', 'Asia', 'East and Southeast Asia', 53, 'not_started', 'published'),
  ('asia.east.japanese', 'Japanese', 'Asia', 'East and Southeast Asia', 54, 'not_started', 'published'),
  ('asia.east.korean', 'Korean', 'Asia', 'East and Southeast Asia', 55, 'not_started', 'published'),
  ('asia.east.vietnamese', 'Vietnamese', 'Asia', 'East and Southeast Asia', 56, 'not_started', 'published'),
  ('asia.east.thai', 'Thai', 'Asia', 'East and Southeast Asia', 57, 'not_started', 'published'),
  ('asia.east.burmese', 'Burmese', 'Asia', 'East and Southeast Asia', 58, 'not_started', 'published'),
  ('asia.east.khmer', 'Khmer', 'Asia', 'East and Southeast Asia', 59, 'not_started', 'published'),
  ('asia.east.balinese', 'Balinese', 'Asia', 'East and Southeast Asia', 60, 'not_started', 'published'),
  ('asia.east.javanese', 'Javanese', 'Asia', 'East and Southeast Asia', 61, 'not_started', 'published'),
  ('americas.maya', 'Maya', 'Americas', 'The Americas', 62, 'not_started', 'published'),
  ('americas.aztec-mexica', 'Aztec / Mexica', 'Americas', 'The Americas', 63, 'not_started', 'published'),
  ('americas.inca-quechua', 'Inca / Quechua', 'Americas', 'The Americas', 64, 'not_started', 'published'),
  ('americas.aymara', 'Aymara', 'Americas', 'The Americas', 65, 'not_started', 'published'),
  ('americas.dine-navajo', 'Diné / Navajo', 'Americas', 'The Americas', 66, 'not_started', 'published'),
  ('americas.lakota', 'Lakota', 'Americas', 'The Americas', 67, 'not_started', 'published'),
  ('americas.haudenosaunee', 'Haudenosaunee', 'Americas', 'The Americas', 68, 'not_started', 'published'),
  ('americas.anishinaabe-ojibwe', 'Anishinaabe / Ojibwe', 'Americas', 'The Americas', 69, 'not_started', 'published'),
  ('americas.cherokee', 'Cherokee', 'Americas', 'The Americas', 70, 'not_started', 'published'),
  ('americas.inuit', 'Inuit', 'Americas', 'The Americas', 71, 'not_started', 'published'),
  ('oceania.maori', 'Māori', 'Oceania', 'Oceania', 72, 'not_started', 'published'),
  ('oceania.hawaiian', 'Hawaiian', 'Oceania', 'Oceania', 73, 'not_started', 'published'),
  ('oceania.tahitian', 'Tahitian', 'Oceania', 'Oceania', 74, 'not_started', 'published'),
  ('oceania.samoan', 'Samoan', 'Oceania', 'Oceania', 75, 'not_started', 'published'),
  ('oceania.tongan', 'Tongan', 'Oceania', 'Oceania', 76, 'not_started', 'published'),
  ('oceania.yolngu', 'Yolŋu', 'Oceania', 'Oceania', 77, 'not_started', 'published'),
  ('oceania.torres-strait-islander', 'Torres Strait Islander', 'Oceania', 'Oceania', 78, 'not_started', 'published'),
  ('oceania.marshallese', 'Marshallese', 'Oceania', 'Oceania', 79, 'not_started', 'published')
on conflict (key) do nothing;
