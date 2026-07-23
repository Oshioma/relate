-- =============================================================================
-- Relate — per-community "public events" toggle
--
-- Whether a community's events are visible to signed-out visitors is now its
-- own switch, independent of any other public setting. Defaults to off, so an
-- admin opts in explicitly on the community admin page. The community still
-- has to be reachable by guests at all (is_public) for the events to surface,
-- which is why the helper ANDs the two together.
-- =============================================================================

alter table public.communities
  add column if not exists events_public boolean not null default false;

-- True only when guests can reach the community AND its events are opted in.
create or replace function public.is_community_events_public(p_community_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce(
    (select c.is_public and c.events_public from public.communities c where c.id = p_community_id),
    false
  );
$$;

-- Replace the anon events policy: guests now see a community's events only
-- when the toggle is on (previously: whenever the community was public).
drop policy if exists "events_select_anon" on public.events;
create policy "events_select_anon" on public.events
  for select to anon
  using (public.is_community_events_public(community_id));
