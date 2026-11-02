-- =============================================================================
-- The True Calendar: daily notes.
--
-- A dated, modern and optional suggestion for one day ("Review unfinished
-- work"), shown under "A suggestion for today" on the calendar. It belongs to
-- no culture and is never presented as a tradition's instruction: the
-- interface always labels it as a modern suggestion and shows its disclaimer.
-- Same review rules as every other research table (drafts until a reviewer
-- publishes; readers see published rows only).
--
-- Safe to re-run.
-- =============================================================================

create table if not exists public.calendar_daily_notes (
  key text primary key,
  note_date date not null,
  time_zone text,
  title text not null,
  explanation text,
  disclaimer text,
  evidence text[] not null default '{modern_interpretation}',
  confidence text check (confidence in ('high', 'medium', 'low')),
  uncertainty text,
  period_label text,
  review_status text not null default 'draft' check (review_status in ('draft', 'in_review', 'published', 'rejected')),
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_calendar_daily_notes_date on public.calendar_daily_notes (note_date);
create index if not exists idx_calendar_daily_notes_review on public.calendar_daily_notes (review_status);

alter table public.calendar_daily_notes enable row level security;

drop policy if exists "calendar_daily_notes_select" on public.calendar_daily_notes;
create policy "calendar_daily_notes_select" on public.calendar_daily_notes
  for select to authenticated
  using (review_status = 'published' or public.is_calendar_researcher(auth.uid()));

drop policy if exists "calendar_daily_notes_write" on public.calendar_daily_notes;
create policy "calendar_daily_notes_write" on public.calendar_daily_notes
  for all to authenticated
  using (public.is_calendar_researcher(auth.uid()))
  with check (public.is_calendar_researcher(auth.uid()));

drop trigger if exists calendar_guard_publish on public.calendar_daily_notes;
create trigger calendar_guard_publish before insert or update on public.calendar_daily_notes
  for each row execute function public.calendar_guard_publish();

-- Notes cite their sources like every other claim.
alter table public.calendar_claim_sources drop constraint if exists calendar_claim_sources_claim_table_check;
alter table public.calendar_claim_sources add constraint calendar_claim_sources_claim_table_check
  check (claim_table in ('calendar_cultures', 'calendar_systems', 'calendar_cycles', 'calendar_cycle_positions', 'calendar_months', 'calendar_lunar_days', 'calendar_observances', 'calendar_meanings', 'calendar_recommendations', 'calendar_date_correspondences', 'calendar_daily_notes'));
