-- =============================================================================
-- Relate — Live chat: video call invites inside direct messages
--
-- Lets either participant in a 1:1 conversation drop a video-call invite into
-- the chat — "start now" or "scheduled for later" — so inviting a member to a
-- call is a one-tap action from the same place they're already talking.
--
-- A call is modelled as a special direct_messages row (kind = 'call') so it
-- flows through the existing conversation feed, RLS, realtime stream and
-- unread-count machinery with no parallel table to keep in sync. The room name
-- is the join secret at the video layer, so it's always generated server-side
-- (see startVideoCall / scheduleVideoCall), never taken from the client.
-- =============================================================================

alter table public.direct_messages
  add column if not exists kind text not null default 'text',
  add column if not exists call_room text,
  add column if not exists call_scheduled_at timestamptz,
  add column if not exists call_status text;

-- 'text' is an ordinary message; 'call' is a video-call invite card.
alter table public.direct_messages
  drop constraint if exists direct_messages_kind_check;
alter table public.direct_messages
  add constraint direct_messages_kind_check check (kind in ('text', 'call'));

-- Null for text messages. For calls: 'active' (started now, joinable),
-- 'scheduled' (starts later) or 'cancelled' (called off / no longer joinable).
alter table public.direct_messages
  drop constraint if exists direct_messages_call_status_check;
alter table public.direct_messages
  add constraint direct_messages_call_status_check
  check (call_status is null or call_status in ('active', 'scheduled', 'cancelled'));

-- Either participant can update a call row's status — used to cancel a
-- scheduled call. The stock update policy only lets the *recipient* touch a
-- row (that's for marking read and would exclude the host cancelling their own
-- invite), so calls get their own participant-scoped policy. Additive with the
-- existing policies (Postgres ORs them), and scoped to kind = 'call' so it
-- can't be used to edit message text.
drop policy if exists "direct_messages_update_call_status" on public.direct_messages;
create policy "direct_messages_update_call_status" on public.direct_messages
  for update to authenticated
  using (
    kind = 'call'
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_id and auth.uid() in (c.user_one_id, c.user_two_id)
    )
  )
  with check (
    kind = 'call'
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_id and auth.uid() in (c.user_one_id, c.user_two_id)
    )
  );

-- Stream messages live so a call invite (or a message) shows up for the other
-- person without a refresh — that's what makes inviting to a call feel instant.
-- RLS still applies to the realtime stream (direct_messages_select_participant),
-- so a subscriber only ever receives rows for conversations they're in.
-- REPLICA IDENTITY FULL ensures UPDATE payloads (e.g. a call flipped to
-- 'cancelled') carry every column, so the client can re-render the card.
do $$ begin
  create publication supabase_realtime;
exception when duplicate_object then null; end $$;

do $$ begin
  alter publication supabase_realtime add table public.direct_messages;
exception when duplicate_object then null; end $$;

alter table public.direct_messages replica identity full;
