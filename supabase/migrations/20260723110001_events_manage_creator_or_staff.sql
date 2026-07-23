-- =============================================================================
-- Relate — events: creator can manage their own event
--
-- Run this after supabase/migrations/*_schema.sql. Safe to re-run.
--
-- events_update_staff and events_delete_staff only ever let community staff
-- update/delete an event, even one they created themselves. Replaces both
-- with the same creator-or-staff pattern already used for
-- posts/comments/landmarks, so whoever added an event can edit its details
-- or move its map pin (and delete it) without needing a staff role.
-- =============================================================================

drop policy if exists "events_update_staff" on public.events;
drop policy if exists "events_update_creator_or_staff" on public.events;
create policy "events_update_creator_or_staff" on public.events
  for update to authenticated
  using (created_by = auth.uid() or public.is_community_staff(community_id, auth.uid()))
  with check (created_by = auth.uid() or public.is_community_staff(community_id, auth.uid()));

drop policy if exists "events_delete_staff" on public.events;
drop policy if exists "events_delete_creator_or_staff" on public.events;
create policy "events_delete_creator_or_staff" on public.events
  for delete to authenticated
  using (created_by = auth.uid() or public.is_community_staff(community_id, auth.uid()));
