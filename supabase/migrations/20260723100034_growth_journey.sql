-- =============================================================================
-- Relate — Space Builder, Stage 3: Growth Journey
--
-- Run this after supabase/space-journal.sql and supabase/contribution-triggers.sql.
-- Safe to re-run.
--
-- Growth Journey needs no new tables. A growth_journey-type space renders a
-- member's own activity in this community — posts, journal entries, and
-- events attended — aggregated straight from the tables that already hold
-- that data (src/lib/data/growth-journey.ts), grouped by month/year, with
-- an on-demand Annual Recap. Nothing here is persisted or cached.
--
-- The one real addition: journal entries didn't award contribution points
-- yet (space_journal_entries postdates contribution-triggers.sql), so this
-- adds the same kind of SECURITY DEFINER trigger the other four content
-- types already have. This is additive to the existing scoring ledger, not
-- required for Growth Journey itself to work — it just closes a gap so
-- logging a journal entry counts the same way posting or sharing a
-- resource already does.
-- =============================================================================

create or replace function public.award_points_for_journal_entry()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.member_contribution_scores (profile_id, points, reason, source_type, source_id)
  values (new.author_id, 3, 'Logged a journal entry', 'space_journal_entry', new.id);
  return new;
end;
$$;

drop trigger if exists trg_award_points_for_journal_entry on public.space_journal_entries;
create trigger trg_award_points_for_journal_entry
  after insert on public.space_journal_entries
  for each row execute function public.award_points_for_journal_entry();
