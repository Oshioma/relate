-- =============================================================================
-- Relate — per-participant "last read" markers on a conversation
--
-- Records when each participant last looked at the thread, so the direct-message
-- email notification can be suppressed while the recipient is actively reading
-- (they'll see the message arrive live over realtime). Written server-side with
-- the service-role client on conversation open and on each read-receipt, so no
-- new RLS policy is needed — participants still can't write these columns
-- directly. Nullable: an untouched conversation just has no marker yet, which
-- reads as "not currently reading". Idempotent.
-- =============================================================================

alter table public.conversations
  add column if not exists user_one_last_read_at timestamptz,
  add column if not exists user_two_last_read_at timestamptz;
