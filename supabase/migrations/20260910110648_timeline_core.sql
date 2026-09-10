-- =============================================================================
-- Relate — the Interactive Learning Timeline
--
-- A community-scoped, collaboratively built timeline that has to hold the Big
-- Bang and next year's eclipse in the same axis, and — more importantly — has
-- to hold the fact that SOURCES DISAGREE about when things happened.
--
-- THE SHAPE
--
--   community
--     └── timeline_events            what happened
--           └── timeline_date_claims when a source says it happened  (many)
--                 └── timeline_sources  who says so                  (shared)
--
-- An event deliberately has NO date column. A date is always somebody's claim,
-- attributable to a source, with a method and a viewpoint behind it. Collapsing
-- that to `event.date` would delete the one thing this feature exists to teach.
--
-- HOW TIME IS STORED  (see src/lib/timeline/time.ts for the mirror of this)
--
-- Neither `date` nor `timestamptz` can express 13.8 billion years ago, and
-- neither should try. Every temporal value here is an ASTRONOMICAL YEAR NUMBER
-- held as `double precision`:
--
--     1 CE  =  1        1 BCE =  0        2 BCE = -1
--     Big Bang ≈ -13_799_998_000
--
-- Astronomical numbering (rather than a year + an era column) is what makes
-- arithmetic work across zero: the gap between 2 BCE and 2 CE is 3 years by
-- subtraction, no branch required. `era` is then a fact ABOUT the number, so it
-- is a generated column rather than something a writer can contradict.
--
-- A double carries 53 bits of mantissa. At 13.8e9 that leaves ~19 bits of
-- fraction — roughly a minute of resolution — and every whole year in range is
-- exact (integers are exact to 2^53). Inside human history there are ~41
-- fraction bits, far more than a day. So one column type covers the whole span
-- without a second representation to keep in step.
--
-- Month and day are stored SEPARATELY and optionally, because "1066" and
-- "14 October 1066" are different claims and the difference is the point.
-- `*_position` folds year+month+day into the single number the timeline draws
-- and range-queries against; it is generated, so it can never drift from the
-- parts it is made of. It is a POSITION, not a date: the day term is
-- approximate by a fraction of a day, which is invisible at every zoom level a
-- reader can reach and irrelevant to a claim that is itself approximate.
--
-- A claim may be a RANGE (2600–2500 BCE) by setting the end_* parts; a point
-- claim leaves them null.
--
-- PERMISSIONS
--
-- Reuses the community permission model exactly — is_community_member /
-- is_community_staff / is_community_guest_readable — and adds no second
-- framework. Staff write straight to 'published'; a member's contribution
-- lands as 'pending' and is invisible to everyone but its author and staff
-- until approved, which is the same pattern business_claims and crop_proposals
-- already use.
--
-- WHICH COMMUNITIES GET IT
--
-- community_has_timeline() is the one place that answers it — today, a School
-- community whose kind is 'homeschool'. It gates INSERTs only, never SELECTs:
-- widening it later turns the feature on for more communities, and nothing that
-- was already written can vanish if a community's kind is edited afterwards.
--
-- Safe to re-run.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Availability
-- ---------------------------------------------------------------------------

create or replace function public.community_has_timeline(p_community_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce(
    (
      select c.template_key = 'school' and c.school_kind = 'homeschool'
      from public.communities c
      where c.id = p_community_id
    ),
    false
  );
$$;

comment on function public.community_has_timeline(uuid) is
  'Whether a community may CREATE timeline content. Homeschool communities today; widen here (and in src/lib/timeline/availability.ts) to open it to other types. Never gates reads.';

-- ---------------------------------------------------------------------------
-- Sources — first-class records, not a text note on a claim
-- ---------------------------------------------------------------------------

create table if not exists public.timeline_sources (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities (id) on delete cascade,
  created_by uuid not null references public.profiles (id) on delete cascade,

  title text not null,
  author text,
  publisher text,
  -- The larger work a page reference points into (a book, a journal, a codex).
  work_title text,
  -- Page, folio, chapter, catalogue number — where in the source this is.
  reference text,
  url text,
  -- An uploaded scan/PDF in the existing 'uploads' bucket, as a public URL.
  file_url text,

  -- Validated against TIMELINE_SOURCE_TYPES in src/lib/timeline/taxonomy.ts, so
  -- adding a type stays a code-only change — same reasoning as location_type.
  source_type text not null default 'other',
  notes text,

  -- WHEN THE SOURCE WAS MADE — deliberately not the same fact as when the event
  -- it describes happened. The Anglo-Saxon Chronicle's date and the Battle of
  -- Hastings' date are two different numbers, and a student who can hold both
  -- at once has learned something. Same astronomical-year representation as a
  -- claim, so "written c. 1150 CE" and "compiled c. 700 BCE" both fit.
  published_year double precision,
  published_month smallint check (published_month between 1 and 12),
  published_day smallint check (published_day between 1 and 31),
  published_is_approximate boolean not null default false,
  -- What to print. Blank = derive it from the parts above.
  published_display text not null default '',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.timeline_sources;
create trigger set_updated_at before update on public.timeline_sources
  for each row execute function public.set_updated_at();

create index if not exists idx_timeline_sources_community
  on public.timeline_sources (community_id, title);

-- ---------------------------------------------------------------------------
-- Tracks — the parallel lanes Compare mode reads (Egypt, China, Science, …)
-- ---------------------------------------------------------------------------

create table if not exists public.timeline_tracks (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities (id) on delete cascade,
  created_by uuid references public.profiles (id) on delete set null,

  name text not null,
  slug text not null,
  -- 'region' (Ancient Egypt, Mesopotamia) or 'theme' (Science, Religion).
  -- Nothing branches on it; it groups the picker so a list of twenty lanes
  -- stays scannable.
  kind text not null default 'region' check (kind in ('region', 'theme')),
  -- '#rrggbb'. Null = fall back to the palette position in the UI.
  color text check (color is null or color ~ '^#[0-9a-fA-F]{6}$'),
  sort_order integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (community_id, slug)
);

drop trigger if exists set_updated_at on public.timeline_tracks;
create trigger set_updated_at before update on public.timeline_tracks
  for each row execute function public.set_updated_at();

create index if not exists idx_timeline_tracks_community
  on public.timeline_tracks (community_id, sort_order, name);

-- ---------------------------------------------------------------------------
-- Events — what happened. No date column, on purpose.
-- ---------------------------------------------------------------------------

create table if not exists public.timeline_events (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities (id) on delete cascade,
  created_by uuid not null references public.profiles (id) on delete cascade,

  slug text not null,
  title text not null,
  -- One line, for the label and the card.
  summary text not null default '',
  -- The long write-up, rendered through <RichText> like every other long-form
  -- field in the product.
  description text not null default '',

  -- Validated against TIMELINE_CATEGORIES in src/lib/timeline/taxonomy.ts. Free
  -- text so a community can file something under a word we did not think of.
  category text not null default 'other',
  subcategory text,
  tags text[] not null default '{}',

  -- Optional geography. Matches the lat/lng pair every other located record in
  -- this schema uses, so a map view can read these later without a migration.
  location_name text,
  lat double precision check (lat is null or (lat between -90 and 90)),
  lng double precision check (lng is null or (lng between -180 and 180)),

  image_url text,
  -- Extra media as [{ url, caption, kind }] — one shape, no second table for
  -- something never queried across.
  media jsonb not null default '[]'::jsonb,

  -- Who and what this is about, for search and for the "people" filter.
  people text[] not null default '{}',
  civilisations text[] not null default '{}',

  -- Moderation, reusing the pattern business_claims/crop_proposals established.
  -- Staff insert 'published'; a member's insert is forced to 'pending' by the
  -- RLS policy below, not merely defaulted to it.
  status text not null default 'published' check (status in ('published', 'pending', 'rejected')),
  reviewed_by uuid references public.profiles (id) on delete set null,
  reviewed_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (community_id, slug)
);

drop trigger if exists set_updated_at on public.timeline_events;
create trigger set_updated_at before update on public.timeline_events
  for each row execute function public.set_updated_at();

create index if not exists idx_timeline_events_community
  on public.timeline_events (community_id, status, created_at desc);
create index if not exists idx_timeline_events_category
  on public.timeline_events (community_id, category);
create index if not exists idx_timeline_events_tags
  on public.timeline_events using gin (tags);
create index if not exists idx_timeline_events_people
  on public.timeline_events using gin (people);
create index if not exists idx_timeline_events_civilisations
  on public.timeline_events using gin (civilisations);

-- ---------------------------------------------------------------------------
-- Date claims — the whole point
-- ---------------------------------------------------------------------------

create table if not exists public.timeline_date_claims (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.timeline_events (id) on delete cascade,
  -- Denormalised from the event so RLS and the community-scoped window query
  -- never have to join to answer "is this mine to see".
  community_id uuid not null references public.communities (id) on delete cascade,
  created_by uuid not null references public.profiles (id) on delete cascade,
  source_id uuid references public.timeline_sources (id) on delete set null,

  -- Astronomical year: 1 CE = 1, 1 BCE = 0, 2 BCE = -1. See the header.
  start_year double precision not null,
  start_month smallint check (start_month between 1 and 12),
  start_day smallint check (start_day between 1 and 31),

  -- Set for a claim that is a span ("2600–2500 BCE"), null for a point claim.
  end_year double precision,
  end_month smallint check (end_month between 1 and 12),
  end_day smallint check (end_day between 1 and 31),

  -- What the timeline actually draws and range-queries against. Generated, so
  -- it cannot disagree with the parts it is made of.
  start_position double precision generated always as (
    start_year
      + coalesce((start_month - 1)::double precision / 12, 0)
      + coalesce((start_day - 1)::double precision / 365.2425, 0)
  ) stored,
  end_position double precision generated always as (
    case when end_year is null then null else
      end_year
        + coalesce((end_month - 1)::double precision / 12, 0)
        + coalesce((end_day - 1)::double precision / 365.2425, 0)
    end
  ) stored,

  -- A fact about the number, not a second copy of it.
  start_era text generated always as (case when start_year <= 0 then 'BCE' else 'CE' end) stored,
  end_era text generated always as (
    case when end_year is null then null
         when end_year <= 0 then 'BCE'
         else 'CE' end
  ) stored,

  -- How precisely this claim is being made. Validated in the app against
  -- DATE_PRECISIONS (src/lib/timeline/time.ts); constrained here too because a
  -- nonsense precision changes how the date is RENDERED, which is a correctness
  -- problem rather than a taxonomy one.
  date_precision text not null default 'year' check (date_precision in (
    'exact_date', 'month', 'year', 'decade', 'century', 'millennium',
    'thousands', 'millions', 'billions'
  )),
  is_approximate boolean not null default false,
  -- What to print ("c. 2560 BCE"). Blank = derive it from the parts above.
  display_text text not null default '',

  -- Validated against the code lists in src/lib/timeline/taxonomy.ts.
  dating_method text,
  -- The chronology this claim belongs to — conventional, archaeological,
  -- geological, biblical, an alternative chronology. Stored so the UI can SAY
  -- whose framework a date comes from rather than presenting every number as
  -- equivalent.
  chronology text,
  confidence text check (confidence is null or confidence in ('high', 'medium', 'low', 'contested')),

  -- "Why this date?" reads these two.
  evidence text,
  notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- A range that runs backwards is a data-entry slip, not a viewpoint.
  constraint timeline_date_claims_range_ordered
    check (end_year is null or end_year >= start_year),
  -- A day without a month is not a date.
  constraint timeline_date_claims_day_needs_month
    check (start_day is null or start_month is not null),
  constraint timeline_date_claims_end_day_needs_month
    check (end_day is null or end_month is not null)
);

drop trigger if exists set_updated_at on public.timeline_date_claims;
create trigger set_updated_at before update on public.timeline_date_claims
  for each row execute function public.set_updated_at();

-- The window query: "every claim in this community between these two years".
-- Leading with community_id keeps one community's scan off another's rows.
create index if not exists idx_timeline_date_claims_window
  on public.timeline_date_claims (community_id, start_position);
create index if not exists idx_timeline_date_claims_event
  on public.timeline_date_claims (event_id, start_position);
create index if not exists idx_timeline_date_claims_source
  on public.timeline_date_claims (source_id);

-- ---------------------------------------------------------------------------
-- Which lanes an event appears in (Compare mode)
-- ---------------------------------------------------------------------------

create table if not exists public.timeline_event_tracks (
  event_id uuid not null references public.timeline_events (id) on delete cascade,
  track_id uuid not null references public.timeline_tracks (id) on delete cascade,
  community_id uuid not null references public.communities (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (event_id, track_id)
);

create index if not exists idx_timeline_event_tracks_track
  on public.timeline_event_tracks (track_id);
create index if not exists idx_timeline_event_tracks_community
  on public.timeline_event_tracks (community_id);

-- ---------------------------------------------------------------------------
-- RLS
--
-- Reads follow the community, not the row: a member of the community sees its
-- timeline, a signed-out visitor sees it only where the community already lets
-- strangers read it (is_community_guest_readable — the same door the feed and
-- events use). Pending contributions are visible to their author and to staff,
-- nobody else. Writes additionally require community_has_timeline().
-- ---------------------------------------------------------------------------

alter table public.timeline_events enable row level security;
alter table public.timeline_date_claims enable row level security;
alter table public.timeline_sources enable row level security;
alter table public.timeline_tracks enable row level security;
alter table public.timeline_event_tracks enable row level security;

-- Events ---------------------------------------------------------------------

drop policy if exists "timeline_events_select" on public.timeline_events;
create policy "timeline_events_select" on public.timeline_events
  for select to authenticated
  using (
    (
      status = 'published'
      and (
        public.is_community_member(community_id, auth.uid())
        or public.is_community_guest_readable(community_id)
      )
    )
    or created_by = auth.uid()
    or public.is_community_staff(community_id, auth.uid())
  );

drop policy if exists "timeline_events_select_anon" on public.timeline_events;
create policy "timeline_events_select_anon" on public.timeline_events
  for select to anon
  using (status = 'published' and public.is_community_guest_readable(community_id));

-- Any active member may contribute; only staff may publish outright. The
-- with-check does the forcing, so a member cannot post a published row by
-- editing the form's hidden field.
drop policy if exists "timeline_events_insert_member" on public.timeline_events;
create policy "timeline_events_insert_member" on public.timeline_events
  for insert to authenticated
  with check (
    created_by = auth.uid()
    and public.community_has_timeline(community_id)
    and public.is_community_member(community_id, auth.uid())
    and (
      public.is_community_staff(community_id, auth.uid())
      or status = 'pending'
    )
  );

-- An author may keep editing their own entry; staff may edit anything, and are
-- the only ones who can move a row's status (a member's update is checked
-- against the same "staff, or pending" rule as their insert).
drop policy if exists "timeline_events_update_author_or_staff" on public.timeline_events;
create policy "timeline_events_update_author_or_staff" on public.timeline_events
  for update to authenticated
  using (created_by = auth.uid() or public.is_community_staff(community_id, auth.uid()))
  with check (
    (
      public.is_community_staff(community_id, auth.uid())
      or (created_by = auth.uid() and status = 'pending')
    )
  );

drop policy if exists "timeline_events_delete_author_or_staff" on public.timeline_events;
create policy "timeline_events_delete_author_or_staff" on public.timeline_events
  for delete to authenticated
  using (created_by = auth.uid() or public.is_community_staff(community_id, auth.uid()));

-- Date claims ----------------------------------------------------------------
--
-- A claim is readable exactly when its event is. Expressed as an exists() on
-- the event rather than a copy of the event's rule, so the two can never drift.

drop policy if exists "timeline_date_claims_select" on public.timeline_date_claims;
create policy "timeline_date_claims_select" on public.timeline_date_claims
  for select to authenticated
  using (
    exists (
      select 1 from public.timeline_events e
      where e.id = timeline_date_claims.event_id
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
  );

drop policy if exists "timeline_date_claims_insert_member" on public.timeline_date_claims;
create policy "timeline_date_claims_insert_member" on public.timeline_date_claims
  for insert to authenticated
  with check (
    created_by = auth.uid()
    and public.community_has_timeline(community_id)
    and public.is_community_member(community_id, auth.uid())
    and exists (
      select 1 from public.timeline_events e
      where e.id = timeline_date_claims.event_id and e.community_id = timeline_date_claims.community_id
    )
  );

drop policy if exists "timeline_date_claims_update_author_or_staff" on public.timeline_date_claims;
create policy "timeline_date_claims_update_author_or_staff" on public.timeline_date_claims
  for update to authenticated
  using (created_by = auth.uid() or public.is_community_staff(community_id, auth.uid()))
  with check (created_by = auth.uid() or public.is_community_staff(community_id, auth.uid()));

drop policy if exists "timeline_date_claims_delete_author_or_staff" on public.timeline_date_claims;
create policy "timeline_date_claims_delete_author_or_staff" on public.timeline_date_claims
  for delete to authenticated
  using (created_by = auth.uid() or public.is_community_staff(community_id, auth.uid()));

-- Sources --------------------------------------------------------------------
--
-- One source is worth citing from many claims, so sources are community-wide
-- rather than owned by an event. Readable by anyone who can read the community;
-- editable by the person who added it and by staff.

drop policy if exists "timeline_sources_select" on public.timeline_sources;
create policy "timeline_sources_select" on public.timeline_sources
  for select to authenticated
  using (
    public.is_community_member(community_id, auth.uid())
    or public.is_community_guest_readable(community_id)
    or public.is_community_staff(community_id, auth.uid())
  );

drop policy if exists "timeline_sources_select_anon" on public.timeline_sources;
create policy "timeline_sources_select_anon" on public.timeline_sources
  for select to anon
  using (public.is_community_guest_readable(community_id));

drop policy if exists "timeline_sources_insert_member" on public.timeline_sources;
create policy "timeline_sources_insert_member" on public.timeline_sources
  for insert to authenticated
  with check (
    created_by = auth.uid()
    and public.community_has_timeline(community_id)
    and public.is_community_member(community_id, auth.uid())
  );

drop policy if exists "timeline_sources_update_author_or_staff" on public.timeline_sources;
create policy "timeline_sources_update_author_or_staff" on public.timeline_sources
  for update to authenticated
  using (created_by = auth.uid() or public.is_community_staff(community_id, auth.uid()))
  with check (created_by = auth.uid() or public.is_community_staff(community_id, auth.uid()));

drop policy if exists "timeline_sources_delete_author_or_staff" on public.timeline_sources;
create policy "timeline_sources_delete_author_or_staff" on public.timeline_sources
  for delete to authenticated
  using (created_by = auth.uid() or public.is_community_staff(community_id, auth.uid()));

-- Tracks ---------------------------------------------------------------------
--
-- Lanes shape how the whole community reads its timeline, so they are staff-
-- managed — the same call the nav groups and space ordering make.

drop policy if exists "timeline_tracks_select" on public.timeline_tracks;
create policy "timeline_tracks_select" on public.timeline_tracks
  for select to authenticated
  using (
    public.is_community_member(community_id, auth.uid())
    or public.is_community_guest_readable(community_id)
    or public.is_community_staff(community_id, auth.uid())
  );

drop policy if exists "timeline_tracks_select_anon" on public.timeline_tracks;
create policy "timeline_tracks_select_anon" on public.timeline_tracks
  for select to anon
  using (public.is_community_guest_readable(community_id));

drop policy if exists "timeline_tracks_write_staff" on public.timeline_tracks;
create policy "timeline_tracks_write_staff" on public.timeline_tracks
  for all to authenticated
  using (public.is_community_staff(community_id, auth.uid()))
  with check (
    public.community_has_timeline(community_id)
    and public.is_community_staff(community_id, auth.uid())
  );

-- Event ↔ track --------------------------------------------------------------

drop policy if exists "timeline_event_tracks_select" on public.timeline_event_tracks;
create policy "timeline_event_tracks_select" on public.timeline_event_tracks
  for select to authenticated
  using (
    exists (select 1 from public.timeline_events e where e.id = timeline_event_tracks.event_id)
  );

drop policy if exists "timeline_event_tracks_select_anon" on public.timeline_event_tracks;
create policy "timeline_event_tracks_select_anon" on public.timeline_event_tracks
  for select to anon
  using (
    exists (select 1 from public.timeline_events e where e.id = timeline_event_tracks.event_id)
  );

-- Filing an event into a lane is part of writing the event, so whoever may
-- write the event may file it.
drop policy if exists "timeline_event_tracks_write" on public.timeline_event_tracks;
create policy "timeline_event_tracks_write" on public.timeline_event_tracks
  for all to authenticated
  using (
    exists (
      select 1 from public.timeline_events e
      where e.id = timeline_event_tracks.event_id
        and (e.created_by = auth.uid() or public.is_community_staff(e.community_id, auth.uid()))
    )
  )
  with check (
    public.community_has_timeline(community_id)
    and exists (
      select 1 from public.timeline_events e
      where e.id = timeline_event_tracks.event_id
        and e.community_id = timeline_event_tracks.community_id
        and (e.created_by = auth.uid() or public.is_community_staff(e.community_id, auth.uid()))
    )
    and exists (
      select 1 from public.timeline_tracks t
      where t.id = track_id and t.community_id = timeline_event_tracks.community_id
    )
  );
