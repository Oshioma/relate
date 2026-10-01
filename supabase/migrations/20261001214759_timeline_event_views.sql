-- =============================================================================
-- Relate — which timeline records a member has already opened
--
-- A crowded stretch of the timeline is drawn as one cluster card: a single
-- record shown by name, and "+ N records" for the rest. Which record leads is
-- the whole value of the card, and the most useful answer for a reader is one
-- they HAVE NOT LOOKED AT YET — the card becomes a way of finding what is new
-- to you rather than showing the same record every visit. (Among records equally
-- unseen, one with a picture leads; that ranking lives in the app, in
-- src/lib/timeline/cluster-lead.ts.)
--
-- Row presence is the state, like lesson_saves: opening a record inserts, and
-- the unique constraint makes opening it again a no-op the app can ignore.
-- Nothing is ever updated, so there is no update policy.
--
-- PRIVATE. What a member has read is nobody else's business, staff included;
-- there is no moderation interest in it.
--
-- Scoped to what you can already see: the insert check reads timeline_events,
-- whose own row-level security applies inside the subquery, so a record you
-- cannot see cannot be marked as seen.
--
-- Safe to re-run.
-- =============================================================================

create table if not exists public.timeline_event_views (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.timeline_events (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (event_id, user_id)
);

comment on table public.timeline_event_views is
  'Which timeline records each member has opened. Private to that member. Used to lead cluster cards with a record the reader has not seen yet.';

-- "What have I opened on this timeline", the only way this is read.
create index if not exists idx_timeline_event_views_user
  on public.timeline_event_views (user_id);
create index if not exists idx_timeline_event_views_event
  on public.timeline_event_views (event_id);

alter table public.timeline_event_views enable row level security;

drop policy if exists "timeline_event_views_select_own" on public.timeline_event_views;
create policy "timeline_event_views_select_own" on public.timeline_event_views
  for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "timeline_event_views_insert_own" on public.timeline_event_views;
create policy "timeline_event_views_insert_own" on public.timeline_event_views
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1
      from public.timeline_events e
      where e.id = timeline_event_views.event_id
    )
  );

-- So a member can clear their own history if the app ever offers it.
drop policy if exists "timeline_event_views_delete_own" on public.timeline_event_views;
create policy "timeline_event_views_delete_own" on public.timeline_event_views
  for delete to authenticated
  using (user_id = auth.uid());
