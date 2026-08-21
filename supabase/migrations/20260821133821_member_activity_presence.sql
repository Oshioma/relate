-- =============================================================================
-- Relate — presence tracking ("active today")
--
-- auth_events answers "who arrived?"; this answers "who is still here?".
-- Sign-in events only fire when somebody uses the sign-in form, so a member
-- who returns daily on a live session generated no signal at all — which is
-- why last_active_at read "Never active" for almost everyone.
--
-- Shape: one row per (person, community, UTC day), upserted as they browse.
-- A per-day rollup rather than an event per request keeps the table bounded
-- (people x communities x days, not requests) while still answering the
-- questions that matter exactly:
--   active today            count(distinct user_id) where day = today
--   active in <community>   ...and community_id = <it>
--   DAU / WAU / MAU         ...over a range of days
-- All of it per community, private ones included, since the admin surfaces
-- read this with the service-role client.
--
-- community_id is null for time spent outside any community (the dashboard,
-- settings, messages), so platform-wide counts stay complete.
--
-- Writes come from the proxy (src/lib/supabase/middleware.ts) via
-- record_member_activity below, throttled by a cookie to at most a handful of
-- calls per person per 15 minutes, and scheduled with after() so they never
-- delay a response.
-- =============================================================================

create table if not exists public.member_activity_days (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  -- Null = seen on the platform itself, outside any community.
  community_id uuid references public.communities (id) on delete cascade,
  day date not null default (now() at time zone 'utc')::date,
  -- Whether they were an active member of that community at the time — the
  -- difference between "12 members active today" and "12 people looked at it".
  is_member boolean not null default false,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  -- Throttled touches, not requests: a rough engagement depth, not a page count.
  hits integer not null default 1
);

-- One row per person per community per day. Two partial indexes rather than
-- one plain unique index because a null community_id would otherwise be
-- "distinct" from itself and let duplicate platform rows through.
create unique index if not exists uq_member_activity_days_community
  on public.member_activity_days (user_id, community_id, day)
  where community_id is not null;
create unique index if not exists uq_member_activity_days_platform
  on public.member_activity_days (user_id, day)
  where community_id is null;

-- The lookup the upsert does. Plain (not partial) so the planner can use it
-- whether or not community_id is null — the partial indexes above are for
-- integrity, not for this.
create index if not exists idx_member_activity_days_user_day
  on public.member_activity_days (user_id, day);
create index if not exists idx_member_activity_days_day
  on public.member_activity_days (day desc);
create index if not exists idx_member_activity_days_community_day
  on public.member_activity_days (community_id, day desc);

alter table public.member_activity_days enable row level security;

-- Read: super admins (the platform-admin tabs). Everyone else gets their own
-- rows only — nothing here exposes one member's whereabouts to another.
drop policy if exists "member_activity_days_select_super_admin" on public.member_activity_days;
create policy "member_activity_days_select_super_admin" on public.member_activity_days
  for select to authenticated
  using (public.is_super_admin(auth.uid()) or user_id = auth.uid());

-- -----------------------------------------------------------------------------
-- record_member_activity
--
-- Called on the visitor's own client, so it can only ever record the caller
-- (auth.uid()); security definer purely so it can write a table with no insert
-- policy. Signed-out visitors are a no-op — "active" means signed-in people.
-- -----------------------------------------------------------------------------
create or replace function public.record_member_activity(p_community_slug text default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_community uuid;
  v_day date := (now() at time zone 'utc')::date;
  v_member boolean := false;
begin
  if v_uid is null then
    return;
  end if;

  if coalesce(p_community_slug, '') <> '' then
    select c.id into v_community from public.communities c where c.slug = lower(p_community_slug);
  end if;

  if v_community is not null then
    v_member := public.is_community_member(v_community, v_uid);
  end if;

  update public.member_activity_days
     set last_seen_at = now(),
         hits = hits + 1,
         is_member = v_member
   where user_id = v_uid
     and day = v_day
     and community_id is not distinct from v_community;

  if not found then
    begin
      insert into public.member_activity_days (user_id, community_id, day, is_member)
      values (v_uid, v_community, v_day, v_member);
    exception when unique_violation then
      -- Two tabs landed at once; the other one won.
      update public.member_activity_days
         set last_seen_at = now(), hits = hits + 1, is_member = v_member
       where user_id = v_uid
         and day = v_day
         and community_id is not distinct from v_community;
    end;
  end if;

  -- The column the member directory and admin pages have always displayed and
  -- nothing ever wrote.
  update public.profiles set last_active_at = now() where id = v_uid;
end;
$$;

grant execute on function public.record_member_activity(text) to authenticated;

-- -----------------------------------------------------------------------------
-- Retention
--
-- The table grows with (active people x communities x days). A year of it is
-- small, but it should not grow forever — call this from pg_cron (or by hand)
-- to drop old days. Returns the number of rows removed.
-- -----------------------------------------------------------------------------
create or replace function public.prune_member_activity_days(p_keep_days integer default 400)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_deleted integer;
begin
  delete from public.member_activity_days
   where day < ((now() at time zone 'utc')::date - greatest(p_keep_days, 1));
  get diagnostics v_deleted = row_count;
  return v_deleted;
end;
$$;

-- -----------------------------------------------------------------------------
-- Seed today from what is already known
--
-- profiles.last_active_at is written from now on, but any value already there
-- (a sign-in recorded by the auth_events migration) is real evidence someone
-- was around — carry it in so the first day of the tab isn't artificially
-- empty. Community attribution is unknown for these, so they land in the
-- platform bucket.
-- -----------------------------------------------------------------------------
insert into public.member_activity_days (user_id, community_id, day, is_member, first_seen_at, last_seen_at, hits)
select p.id, null, (p.last_active_at at time zone 'utc')::date, false, p.last_active_at, p.last_active_at, 1
from public.profiles p
where p.last_active_at is not null
  and p.last_active_at >= now() - interval '30 days'
on conflict do nothing;
