-- =============================================================================
-- Relate — TIME PERIODS, and why they are a table rather than a flag
--
-- A period is the Mesozoic, the Bronze Age, the Middle Palaeolithic: a named
-- stretch of time that gives the events inside it context. It is not an event.
-- "Bronze Age" did not happen on a day, nobody recorded it, and filing it in
-- timeline_events to get it drawn would have put a thing that is not a record of
-- an occurrence into the table of records of occurrences — and then every
-- window query, every filter, every count of "how many events does this
-- community have" would have had to remember to exclude it.
--
-- So periods get their own table. What they DO share is the part worth sharing:
--
--   A PERIOD BOUNDARY IS A DATE CLAIM.
--
-- The Iron Age starts around 1200 BCE in the Near East, around 800 BCE in
-- Britain, and the West African iron-working sequence is not derived from
-- either. Those are three sourced claims about one period — exactly the shape
-- timeline_date_claims already has: a start, an end, a precision, the source
-- that asserts it, the dating method, the viewpoint it belongs to, and the
-- evidence that produced it. Building a second claims table would have meant a
-- second sources join, a second citation table, a second set of RLS policies
-- and a second "Why this date?" panel, all to express something the first set
-- already expresses exactly.
--
-- Hence this migration generalises date claims to hang off EITHER an event or a
-- period, and adds the two things a period boundary needs that an event date
-- did not: which region it describes, and whether it runs to the present.
--
-- WHAT IS DELIBERATELY ABSENT: a start_year and end_year on the period itself.
-- A column like that becomes the answer — the one date the UI reads and the
-- claims become decoration. The envelope a band is drawn between is computed
-- from the claims at render time. There are a dozen or two periods in a
-- community and they are fetched in one query, so there is nothing to cache and
-- nothing that can drift out of agreement with the sources.
--
-- Also absent, here as everywhere in this feature: any column that rates a
-- claim. No confidence, no score, no stars.
--
-- Additive and safe to re-run. Nothing is dropped, nothing is rewritten; the
-- one existing constraint that changes is event_id's NOT NULL, which becomes a
-- two-way check that a claim belongs to exactly one of an event or a period.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Periods
-- ---------------------------------------------------------------------------

create table if not exists public.timeline_periods (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities (id) on delete cascade,
  created_by uuid not null references public.profiles (id) on delete cascade,

  slug text not null,
  name text not null,
  -- "Age of Dinosaurs" and "Mesozoic Era" are one period with two names, not
  -- two periods. Aliases live here so search can find either and the card can
  -- show the common name beside the formal one — and so that seeding the same
  -- period twice under different names is impossible.
  aliases text[] not null default '{}',

  summary text not null default '',
  description text not null default '',

  -- WHAT KIND OF PERIODISATION THIS IS, which is the single most useful thing
  -- to know about a period and the thing a timeline normally hides:
  --
  --   formal_scientific — ratified by a standards body. The Mesozoic has a
  --                       defined base at a named rock section.
  --   archaeological    — a technological/material convention, used
  --                       differently in different regions. Bronze Age.
  --   historical        — a convention of historians. "Medieval".
  --   educational       — an umbrella this timeline (or common teaching
  --                       practice) uses for a stretch nobody has ratified.
  --                       "Early Human Ancestors".
  --
  -- Free text, validated in the app against PERIOD_TYPES, like every other
  -- taxonomy in this schema.
  period_type text not null default 'educational',

  -- Whose framework this is — "Mainstream palaeontology and geology",
  -- "Mainstream archaeology". The point of the column: a description of the
  -- Mesozoic is a reading of the fossil record by a discipline, and saying
  -- which discipline is the difference between reporting a consensus and
  -- asserting a fact. Null = unstated.
  framework text,

  -- The three questions a period card has to be able to answer separately,
  -- because collapsing them is how a reconstruction turns into a fact:
  --   defining_criteria — what makes this period this period at all
  --   evidence          — what has actually been dug up or measured
  --   interpretation    — what that is taken to mean, and by whom
  defining_criteria text,
  evidence text,
  interpretation text,

  -- Set only for a period that IS regional ("Nok iron working"). A period whose
  -- boundaries merely differ by region is one period with regional boundary
  -- claims; see timeline_date_claims.region.
  region text,

  -- A tie-break for which bands to draw when several are equally eligible.
  -- NOT a ranking of importance or a visibility switch: semantic zoom decides
  -- what is worth showing from duration and viewport, and this only orders
  -- what survives that. Higher shows first.
  display_priority smallint not null default 0,

  -- The same moderation pattern events use.
  status text not null default 'published' check (status in ('published', 'pending', 'rejected')),
  reviewed_by uuid references public.profiles (id) on delete set null,
  reviewed_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (community_id, slug)
);

comment on table public.timeline_periods is
  'Named stretches of time that give events context — Mesozoic, Bronze Age, Middle Palaeolithic. Has no start or end column on purpose: its boundaries are rows in timeline_date_claims, because different regions and disciplines place them differently and a period with one authoritative range would hide that.';

drop trigger if exists set_updated_at on public.timeline_periods;
create trigger set_updated_at before update on public.timeline_periods
  for each row execute function public.set_updated_at();

create index if not exists idx_timeline_periods_community
  on public.timeline_periods (community_id, status);
create index if not exists idx_timeline_periods_slug
  on public.timeline_periods (community_id, slug);
-- Search by name or by any alias, without a second table.
create index if not exists idx_timeline_periods_aliases
  on public.timeline_periods using gin (aliases);

-- ---------------------------------------------------------------------------
-- How periods relate to each other
--
-- Mesozoic contains Jurassic. Bronze Age and Iron Age are neighbours. Neither
-- relationship is a tree: the Cenozoic contains the Quaternary, and the Middle
-- Palaeolithic sits inside the same stretch of time without belonging to either
-- hierarchy — geological, archaeological and historical periodisations are
-- parallel systems that overlap, and forcing them into one parent pointer would
-- have required picking a winner.
--
-- Hence an edge table rather than a parent_id: a period can have several
-- parents in several systems, or none.
-- ---------------------------------------------------------------------------

create table if not exists public.timeline_period_links (
  community_id uuid not null references public.communities (id) on delete cascade,
  -- 'contains': from is the wider period, to is inside it.
  -- 'related':  a pointer worth following, in no particular direction.
  from_period_id uuid not null references public.timeline_periods (id) on delete cascade,
  to_period_id uuid not null references public.timeline_periods (id) on delete cascade,
  relation text not null default 'contains' check (relation in ('contains', 'related')),
  created_at timestamptz not null default now(),

  primary key (from_period_id, to_period_id, relation),
  constraint timeline_period_links_not_self check (from_period_id <> to_period_id)
);

comment on table public.timeline_period_links is
  'Edges between periods — "contains" for hierarchy, "related" for a pointer worth following. An edge table rather than a parent_id because geological, archaeological and historical periodisations overlap without nesting inside one another.';

create index if not exists idx_timeline_period_links_to
  on public.timeline_period_links (to_period_id, relation);
create index if not exists idx_timeline_period_links_community
  on public.timeline_period_links (community_id);

-- ---------------------------------------------------------------------------
-- Date claims, generalised
-- ---------------------------------------------------------------------------

alter table public.timeline_date_claims
  add column if not exists period_id uuid references public.timeline_periods (id) on delete cascade;

comment on column public.timeline_date_claims.period_id is
  'Set when this claim is a PERIOD BOUNDARY rather than the date of an event. Exactly one of event_id and period_id is set.';

-- A claim used to be required to have an event. It is now required to have
-- exactly one subject, which is the same rule with one more kind of subject —
-- and still forbids the two failure modes the NOT NULL was there to prevent: a
-- claim about nothing, and (newly) a claim about two things at once.
alter table public.timeline_date_claims
  alter column event_id drop not null;

alter table public.timeline_date_claims
  drop constraint if exists timeline_date_claims_one_subject;
alter table public.timeline_date_claims
  add constraint timeline_date_claims_one_subject
  check ((event_id is null) <> (period_id is null));

-- WHICH REGION THIS BOUNDARY IS FOR.
--
-- The column that makes a single Iron Age honest. Free text for the same reason
-- category is: a community may need a region we did not think of, and a closed
-- list of regions is a political claim of its own. Null = the claim is not
-- regional, which is every claim on an ordinary event.
alter table public.timeline_date_claims
  add column if not exists region text;

comment on column public.timeline_date_claims.region is
  'Which region this claim describes — "Near East", "Britain", "West Africa". Null when the claim is not regional. Two regional claims on one period are two regions disagreeing, not two periods.';

-- RUNS TO THE PRESENT.
--
-- The Cenozoic has a start and no end. Writing end_year = 2026 would have
-- invented a boundary; writing end_year = null alone would have made it a point
-- claim, drawn as a tick rather than as a band that reaches the right edge. So
-- the openness is stated rather than encoded as a number, and the renderer
-- reads the present from the clock as it already does for the "Today" line.
alter table public.timeline_date_claims
  add column if not exists is_ongoing boolean not null default false;

comment on column public.timeline_date_claims.is_ongoing is
  'This span has no end: it runs to the present. Kept as a flag rather than as end_year = this year, which would be a boundary nobody claimed.';

alter table public.timeline_date_claims
  drop constraint if exists timeline_date_claims_ongoing_has_no_end;
alter table public.timeline_date_claims
  add constraint timeline_date_claims_ongoing_has_no_end
  check (not is_ongoing or end_year is null);

create index if not exists idx_timeline_date_claims_period
  on public.timeline_date_claims (period_id, start_position);
create index if not exists idx_timeline_date_claims_region
  on public.timeline_date_claims (community_id, region);

-- ---------------------------------------------------------------------------
-- The two triggers on date claims both assumed an event
-- ---------------------------------------------------------------------------

-- Revision history can now hang off a period as well as an event, because a
-- silently edited period boundary is exactly as bad as a silently edited event
-- date — and with the event_id NOT NULL still in place, a period claim's insert
-- would have failed on it.
alter table public.timeline_revisions
  add column if not exists period_id uuid references public.timeline_periods (id) on delete cascade;

alter table public.timeline_revisions
  alter column event_id drop not null;

alter table public.timeline_revisions
  drop constraint if exists timeline_revisions_entity_check;
alter table public.timeline_revisions
  add constraint timeline_revisions_entity_check
  check (entity in ('event', 'claim', 'period'));

alter table public.timeline_revisions
  drop constraint if exists timeline_revisions_has_subject;
alter table public.timeline_revisions
  add constraint timeline_revisions_has_subject
  check (event_id is not null or period_id is not null);

create index if not exists idx_timeline_revisions_period
  on public.timeline_revisions (period_id, created_at desc);

create or replace function public.timeline_record_revision()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_entity text := tg_argv[0];
  -- Generated columns and timestamps are noise in a history: they change
  -- because something else changed, and listing them would bury the edit.
  v_ignored text[] := array['created_at', 'updated_at', 'start_position', 'end_position', 'start_era', 'end_era'];
  v_old jsonb := '{}'::jsonb;
  v_new jsonb := '{}'::jsonb;
  v_changes jsonb := '{}'::jsonb;
  v_key text;
  v_event_id uuid;
  v_period_id uuid;
  v_claim_id uuid;
  v_community_id uuid;
  v_action text;
begin
  -- Both early exits are nested inside the DELETE branch rather than written as
  -- `tg_op = 'DELETE' and old.…`. PL/pgSQL hands a whole boolean expression to
  -- the SQL executor as one query and substitutes OLD when it is PLANNED, not
  -- when it is evaluated — so an `and` guard does not protect a reference to
  -- OLD, and mentioning old.event_id in a condition alongside tg_op = 'DELETE'
  -- raises `record "old" has no field "event_id"` on every INSERT. There is no
  -- short-circuit to rely on here; the nesting is the guard.
  if tg_op = 'DELETE' then
    -- A subject's deletion takes its history with it (the cascades above), so
    -- there is nothing to write and nowhere to hang it.
    if v_entity in ('event', 'period') then
      return null;
    end if;

    -- The same applies to a claim deleted BY that cascade rather than on its
    -- own. Deleting an event removes the event row first and the claims after
    -- it, so a revision written here would reference a parent that is already
    -- gone and the foreign key would abort the whole delete — taking "delete
    -- this event" with it. Checking the parent still exists distinguishes the
    -- two cases: a claim removed on its own has a subject to hang its history
    -- on, a cascaded one does not and needs none.
    if old.event_id is not null and not exists (
      select 1 from public.timeline_events e where e.id = old.event_id
    ) then
      return null;
    end if;
    if old.period_id is not null and not exists (
      select 1 from public.timeline_periods p where p.id = old.period_id
    ) then
      return null;
    end if;
  end if;

  if tg_op = 'INSERT' then
    v_new := to_jsonb(new);
    v_action := 'created';
  elsif tg_op = 'DELETE' then
    v_old := to_jsonb(old);
    v_action := 'deleted';
  else
    v_old := to_jsonb(old);
    v_new := to_jsonb(new);
    v_action := 'updated';
  end if;

  for v_key in select key from jsonb_object_keys(v_old || v_new) as key loop
    continue when v_key = any(v_ignored);
    if (v_old -> v_key) is distinct from (v_new -> v_key) then
      v_changes := v_changes || jsonb_build_object(
        v_key,
        jsonb_build_object('from', coalesce(v_old -> v_key, 'null'::jsonb), 'to', coalesce(v_new -> v_key, 'null'::jsonb))
      );
    end if;
  end loop;

  -- An update that changed nothing we track is not an edit.
  if v_changes = '{}'::jsonb then
    return null;
  end if;

  v_community_id := coalesce((v_new ->> 'community_id')::uuid, (v_old ->> 'community_id')::uuid);
  if v_entity = 'event' then
    v_event_id := coalesce((v_new ->> 'id')::uuid, (v_old ->> 'id')::uuid);
  elsif v_entity = 'period' then
    v_period_id := coalesce((v_new ->> 'id')::uuid, (v_old ->> 'id')::uuid);
  else
    v_event_id := coalesce((v_new ->> 'event_id')::uuid, (v_old ->> 'event_id')::uuid);
    v_period_id := coalesce((v_new ->> 'period_id')::uuid, (v_old ->> 'period_id')::uuid);
    v_claim_id := coalesce((v_new ->> 'id')::uuid, (v_old ->> 'id')::uuid);
  end if;

  insert into public.timeline_revisions (community_id, event_id, period_id, claim_id, entity, action, actor_id, changes)
  values (v_community_id, v_event_id, v_period_id, v_claim_id, v_entity, v_action, auth.uid(), v_changes);

  return null;
end;
$$;

drop trigger if exists timeline_periods_revision on public.timeline_periods;
create trigger timeline_periods_revision
  after insert or update or delete on public.timeline_periods
  for each row execute function public.timeline_record_revision('period');

-- "Editing a published event's dates sends it back for approval" has nothing to
-- say about a period boundary — there is no event to send back. Guarded rather
-- than left to update zero rows, so the intent is on the record.
create or replace function public.timeline_claim_requires_review()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_event_id uuid;
  v_actor uuid := auth.uid();
begin
  if v_actor is null then
    return null;
  end if;

  if tg_op = 'DELETE' then
    v_event_id := old.event_id;
  else
    v_event_id := new.event_id;
  end if;

  -- A period boundary claim. Periods are staff-written (see RLS below), so
  -- there is no member contribution to queue for review.
  if v_event_id is null then
    return null;
  end if;

  update public.timeline_events e
     set status = 'pending', reviewed_by = null, reviewed_at = null
   where e.id = v_event_id
     and e.status = 'published'
     and not public.is_community_staff(e.community_id, v_actor);

  return null;
end;
$$;

-- ---------------------------------------------------------------------------
-- RLS
--
-- Periods read like events: a member of the community sees them, a signed-out
-- visitor sees them where the community already lets strangers read. They WRITE
-- unlike events, though: an event is one community's record of one thing and any
-- member may contribute one, whereas a period is the frame every event on the
-- strip is read against. Staff only, so the contribution flow does not need a
-- moderation queue for something nobody has asked to contribute.
-- ---------------------------------------------------------------------------

-- THE GRANT IS NOT OPTIONAL, AND IT IS NOT AUTOMATIC ENOUGH TO LEAVE OUT.
--
-- Supabase grants anon/authenticated on new public tables through default
-- privileges, so every earlier table in this schema got them without saying so.
-- This migration cannot rely on that, because the date-claim policies below now
-- read timeline_periods — and a policy expression is evaluated with the
-- privileges of the role running the query. Without the grant, every read of
-- every date claim in the product fails with "permission denied for table
-- timeline_periods": not the periods feature degrading, the timeline going
-- down. It is stated here so it holds wherever this runs.
grant all on public.timeline_periods to anon, authenticated, service_role;
grant all on public.timeline_period_links to anon, authenticated, service_role;

alter table public.timeline_periods enable row level security;
alter table public.timeline_period_links enable row level security;

drop policy if exists "timeline_periods_select" on public.timeline_periods;
create policy "timeline_periods_select" on public.timeline_periods
  for select to authenticated
  using (
    (
      status = 'published'
      and (
        public.is_community_member(community_id, auth.uid())
        or public.is_community_guest_readable(community_id)
      )
    )
    or public.is_community_staff(community_id, auth.uid())
  );

drop policy if exists "timeline_periods_select_anon" on public.timeline_periods;
create policy "timeline_periods_select_anon" on public.timeline_periods
  for select to anon
  using (status = 'published' and public.is_community_guest_readable(community_id));

drop policy if exists "timeline_periods_insert_staff" on public.timeline_periods;
create policy "timeline_periods_insert_staff" on public.timeline_periods
  for insert to authenticated
  with check (
    created_by = auth.uid()
    and public.community_has_timeline(community_id)
    and public.is_community_staff(community_id, auth.uid())
  );

drop policy if exists "timeline_periods_update_staff" on public.timeline_periods;
create policy "timeline_periods_update_staff" on public.timeline_periods
  for update to authenticated
  using (public.is_community_staff(community_id, auth.uid()))
  with check (public.is_community_staff(community_id, auth.uid()));

drop policy if exists "timeline_periods_delete_staff" on public.timeline_periods;
create policy "timeline_periods_delete_staff" on public.timeline_periods
  for delete to authenticated
  using (public.is_community_staff(community_id, auth.uid()));

-- Links are part of the periods they join: readable when the periods are,
-- writable by staff.
drop policy if exists "timeline_period_links_select" on public.timeline_period_links;
create policy "timeline_period_links_select" on public.timeline_period_links
  for select to authenticated
  using (
    exists (
      select 1 from public.timeline_periods p
      where p.id = timeline_period_links.from_period_id
    )
  );

drop policy if exists "timeline_period_links_select_anon" on public.timeline_period_links;
create policy "timeline_period_links_select_anon" on public.timeline_period_links
  for select to anon
  using (
    exists (
      select 1 from public.timeline_periods p
      where p.id = timeline_period_links.from_period_id
    )
  );

drop policy if exists "timeline_period_links_write_staff" on public.timeline_period_links;
create policy "timeline_period_links_write_staff" on public.timeline_period_links
  for insert to authenticated
  with check (
    public.community_has_timeline(community_id)
    and public.is_community_staff(community_id, auth.uid())
  );

drop policy if exists "timeline_period_links_delete_staff" on public.timeline_period_links;
create policy "timeline_period_links_delete_staff" on public.timeline_period_links
  for delete to authenticated
  using (public.is_community_staff(community_id, auth.uid()));

-- Date claims: the four policies that asked "does this claim's EVENT exist"
-- now ask "does this claim's SUBJECT exist". Written as two exists() rather
-- than one join so each reads as the rule it is, and so a claim with neither
-- subject — impossible under the check constraint above — would be readable by
-- nobody rather than by everybody.

drop policy if exists "timeline_date_claims_select" on public.timeline_date_claims;
create policy "timeline_date_claims_select" on public.timeline_date_claims
  for select to authenticated
  using (
    exists (
      select 1 from public.timeline_events e
      where e.id = timeline_date_claims.event_id
    )
    or exists (
      select 1 from public.timeline_periods p
      where p.id = timeline_date_claims.period_id
    )
  );

drop policy if exists "timeline_date_claims_select_anon" on public.timeline_date_claims;
create policy "timeline_date_claims_select_anon" on public.timeline_date_claims
  for select to anon
  using (
    exists (
      select 1 from public.timeline_events e
      where e.id = timeline_date_claims.event_id
    )
    or exists (
      select 1 from public.timeline_periods p
      where p.id = timeline_date_claims.period_id
    )
  );

drop policy if exists "timeline_date_claims_insert_member" on public.timeline_date_claims;
create policy "timeline_date_claims_insert_member" on public.timeline_date_claims
  for insert to authenticated
  with check (
    created_by = auth.uid()
    and public.community_has_timeline(community_id)
    and public.is_community_member(community_id, auth.uid())
    and (
      exists (
        select 1 from public.timeline_events e
        where e.id = timeline_date_claims.event_id
          and e.community_id = timeline_date_claims.community_id
      )
      or (
        -- A period boundary is staff work, for the same reason the period is.
        public.is_community_staff(community_id, auth.uid())
        and exists (
          select 1 from public.timeline_periods p
          where p.id = timeline_date_claims.period_id
            and p.community_id = timeline_date_claims.community_id
        )
      )
    )
  );
