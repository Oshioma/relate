-- =============================================================================
-- Relate — deliver notifications in real time (no page refresh)
--
-- Adds the notifications table to the `supabase_realtime` publication so the
-- browser can subscribe to INSERTs and update the bell live. RLS still applies
-- to realtime: the existing notifications_select_own policy means a subscriber
-- only ever receives their own rows. INSERT is all the client needs (a new
-- notification bumps the count and prepends to the list), so the table's
-- default replica identity is sufficient — no old-row data required.
--
-- Safe to re-run. On a stock Supabase project the publication already exists;
-- the guards make this work on a bare Postgres too.
-- =============================================================================

do $$ begin
  create publication supabase_realtime;
exception when duplicate_object then null; end $$;

do $$ begin
  alter publication supabase_realtime add table public.notifications;
exception when duplicate_object then null; end $$;
