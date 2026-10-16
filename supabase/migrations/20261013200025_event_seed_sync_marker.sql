-- =============================================================================
-- TELLING THE MAINTENANCE JOB'S EDITS TO A RECORD APART FROM A PERSON'S
--
-- The same marker timeline_date_claims has carried since the seed_sync_marker
-- migration, now on the record itself. "Check for corrections" has learned to
-- bring a seeded record's title, summary, description and pictures into line
-- with its dataset, and it must never overwrite what a person here has written.
--
-- timeline_revisions answers "has this been edited?", but the refresh's own
-- updates are recorded exactly like anybody else's. So the refresh writes the
-- current time into this column in the same UPDATE as its correction, and the
-- revision the trigger writes then CONTAINS THE KEY seed_synced_at. A person
-- editing a record through the form never sets it, so their revisions never
-- do. See src/lib/timeline/reconcile-seeded-event.ts.
--
-- Additive, nullable, and null for every row that exists today, which
-- correctly means "the maintenance job has never touched this record's text".
-- =============================================================================

alter table public.timeline_events
  add column if not exists seed_synced_at timestamptz;

comment on column public.timeline_events.seed_synced_at is
  'When the seeded-dataset refresh last reconciled this record against its seed file. Its real job is to appear in timeline_revisions.changes, which is how the refresh''s own edits are told apart from a person''s. Null = never reconciled.';
