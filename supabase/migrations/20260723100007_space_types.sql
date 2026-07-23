-- =============================================================================
-- Relate — Space Builder, Stage 1: space types
--
-- Safe to re-run. Adds a `space_type` column to the existing `spaces` table —
-- no new table, no RLS changes (spaces' existing policies already cover it).
--
-- Every space still behaves as a plain discussion feed today except
-- 'resources' (which now renders that space's resources instead of posts —
-- resources.space_id already existed, this just makes it reachable from the
-- space itself). The remaining types (journal, directory, challenges,
-- growth_journey, qa, gallery) are real, admin-choosable categories with
-- their own icon and description, but get dedicated behavior in later
-- rounds — see the Community Builder wizard PR history for context.
-- =============================================================================

do $$ begin
  create type public.space_type as enum (
    'discussion', 'journal', 'gallery', 'resources', 'directory', 'challenges', 'growth_journey', 'qa', 'custom'
  );
exception when duplicate_object then null; end $$;

alter table public.spaces add column if not exists space_type public.space_type not null default 'discussion';
