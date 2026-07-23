-- =============================================================================
-- Relate — event dismissals
--
-- Run this after supabase/migrations/*_schema.sql. Safe to re-run.
--
-- Remembers event titles a community's staff have deleted, so a later AI
-- discovery run (which searches the live web again, not a cache) doesn't
-- silently re-add the same event. Matching is case-insensitive since
-- discovery already lowercases titles when deduping against the calendar.
-- =============================================================================

create table if not exists public.event_dismissals (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities (id) on delete cascade,
  title text not null,
  created_at timestamptz not null default now()
);

create unique index if not exists idx_event_dismissals_unique on public.event_dismissals (community_id, lower(title));

alter table public.event_dismissals enable row level security;

drop policy if exists "event_dismissals_select_staff" on public.event_dismissals;
create policy "event_dismissals_select_staff" on public.event_dismissals
  for select to authenticated
  using (public.is_community_staff(community_id, auth.uid()));

drop policy if exists "event_dismissals_insert_staff" on public.event_dismissals;
create policy "event_dismissals_insert_staff" on public.event_dismissals
  for insert to authenticated
  with check (public.is_community_staff(community_id, auth.uid()));
