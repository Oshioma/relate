-- =============================================================================
-- Relate — Member Directory, Stage 1c: contribution score
--
-- Run this after supabase/member-profile-extensions.sql. Safe to re-run.
--
-- member_contribution_scores is an append-only ledger of point-earning
-- events (never updated/deleted, only inserted) — it's the audit trail.
-- profiles.contribution_score is a denormalized running total kept in sync
-- by the trigger below, so sorting/filtering the directory by score never
-- needs to SUM the ledger at request time.
--
-- No UI reads or writes this yet, and nothing awards points yet — the
-- actual triggers on posts/comments/resources/events (Stage 7) come once
-- the directory that displays the score exists. This file just lays the
-- foundation: the ledger table, RLS, and the total-maintaining trigger.
-- =============================================================================

create table if not exists public.member_contribution_scores (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  points integer not null,
  reason text not null,
  source_type text,
  source_id uuid,
  created_at timestamptz not null default now()
);

create index if not exists idx_member_contribution_scores_profile on public.member_contribution_scores (profile_id);

alter table public.member_contribution_scores enable row level security;

drop policy if exists "member_contribution_scores_select" on public.member_contribution_scores;
create policy "member_contribution_scores_select" on public.member_contribution_scores
  for select to authenticated
  using (true);

-- No insert/update/delete policy for `authenticated` at all: entries are
-- only ever written by SECURITY DEFINER triggers (added in a later stage
-- alongside the actions that award points), the same pattern used by
-- supabase/notifications.sql.

create or replace function public.apply_contribution_score()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set contribution_score = contribution_score + new.points
  where id = new.profile_id;

  return new;
end;
$$;

drop trigger if exists trg_apply_contribution_score on public.member_contribution_scores;
create trigger trg_apply_contribution_score
  after insert on public.member_contribution_scores
  for each row execute function public.apply_contribution_score();
