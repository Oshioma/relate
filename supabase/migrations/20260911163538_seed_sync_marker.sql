-- =============================================================================
-- TELLING THE MAINTENANCE JOB'S EDITS APART FROM A PERSON'S
--
-- The seeded datasets are idempotent by slug: an event already present is
-- skipped, which is what makes running a seeder twice harmless — and also means
-- a correction to a seed file never reaches a community that took the dataset
-- before the correction was made. "Bring the seeded datasets up to date" is the
-- way back, and it must never overwrite something a person here has written.
--
-- timeline_revisions already answers "has this been edited?", because a trigger
-- records every change. The trouble is that the maintenance job's own updates
-- are recorded exactly like anybody else's, so after one correction every claim
-- it touched looks hand-edited and a second correction can never reach it. The
-- feature would work precisely once per row and then quietly stop.
--
-- WHAT THIS COLUMN IS FOR, and it is not for reading. The refresh writes the
-- current time into it in the same UPDATE that carries the correction, so the
-- revision the trigger writes CONTAINS THE KEY seed_synced_at in its changes.
-- A person editing a claim through the form never sets this column, so their
-- revision never contains that key.
--
-- That turns "who made this edit?" into an exact test on the history itself —
-- no timestamp comparisons, no tolerance windows, nothing that can go wrong
-- because two writes landed in the same second.
--
-- Additive, nullable, and null for every row that exists today, which correctly
-- means "the maintenance job has never touched this".
-- =============================================================================

alter table public.timeline_date_claims
  add column if not exists seed_synced_at timestamptz;

comment on column public.timeline_date_claims.seed_synced_at is
  'When the seeded-dataset refresh last reconciled this claim against its seed file. Its real job is to appear in timeline_revisions.changes, which is how the refresh''s own edits are told apart from a person''s. Null = never reconciled.';
