-- =============================================================================
-- Relate — email invites (adds an `email` column to community_invites)
--
-- Run this after supabase/invites.sql. Safe to re-run.
--
-- No new RLS is needed: the existing invites_select/insert/update/delete_admin
-- policies on community_invites already cover this column since they're
-- defined at the row level, not per-column.
-- =============================================================================

alter table public.community_invites
  add column if not exists email text;
