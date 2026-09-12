-- =============================================================================
-- "NO BEGINNING" IS A TEMPORAL CLAIM, NOT A MISSING DATE
--
-- Every claim in this table has so far been obliged to carry a start_year,
-- which encodes an assumption nobody stated: that whatever is being described
-- began at a moment, and that the only question is which one. For most of
-- history that assumption is harmless. For the age of the universe it is the
-- whole argument.
--
-- The classical Steady State model of Bondi, Gold and Hoyle asserts that the
-- universe has no finite beginning. That is not an absence of information and
-- it is not a date we have failed to find — it is a positive claim about time,
-- made by named physicists in named papers, and a schema that cannot hold it
-- has quietly taken a side. The same goes for cyclic cosmologies, where our
-- expanding phase may be one of many, and for the Hindu cosmological cycles,
-- where a kalpa is a LENGTH with no position on anybody's axis.
--
-- The fix is not to invent a number for them. It is to say what kind of
-- temporal claim each row is making, and to let the ones that make no claim
-- about a position not have one.
--
-- ---------------------------------------------------------------------------
-- WHAT IS ADDED
--
--   temporal_claim_type  — WHAT KIND of claim about time this is. Nullable,
--                          and null for every row that exists today, which
--                          correctly means "nobody has said". A closed check
--                          rather than free text, for the same reason
--                          date_precision has one: this value changes how the
--                          claim is RENDERED, so a nonsense value is a
--                          correctness problem rather than a taxonomy one.
--
--   what_is_dated        — WHICH PROPOSITION this date is a date for. Five
--                          claims on "the beginning of the universe" are not
--                          five answers to one question: one dates the
--                          expansion of the observable universe, one dates the
--                          creation of the world, one dates the start of the
--                          present cosmic cycle, and one denies there is a
--                          first moment to date. Leaving that to prose would
--                          let the UI stack them as rivals, which is the exact
--                          misreading this record exists to prevent.
--
--   duration_years       — A LENGTH WITH NO POSITION. A mahayuga is 4,320,000
--                          years long and begins nowhere in particular; the
--                          lifespan of Brahma is 311.04 trillion years and is
--                          not a span between two dates. end_year cannot say
--                          this, because end_year is the far end of a range
--                          that starts somewhere. Kept from becoming a second
--                          way to write a range by the check below.
--
-- AND WHAT IS RELAXED: start_year becomes nullable, but ONLY for the four
-- types that genuinely make no claim about a position. Every other type must
-- still have one, so the invariant is exactly as strong as it was yesterday
-- for every row that exists and every ordinary claim written tomorrow. A
-- missing date is still a bug; a claimed absence of one is now sayable.
--
-- WHAT FOLLOWS FROM A NULL START, and it is the point: start_position is
-- generated from start_year, so it is null too, and a claim with no position
-- is not drawn on the axis and is not returned by the window query. That is
-- the correct behaviour rather than a limitation — an eternal universe has no
-- mark on a strip of time, and putting one there would be the very thing this
-- migration exists to avoid. The claim is read in full on its event, where it
-- belongs, with its sources and its "Why this date?" panel intact.
--
-- start_era had to be rebuilt because its case expression fell through to 'CE'
-- for a null year, which would have reported a fact about a number that is not
-- there. Generated columns hold no data of their own, so dropping and
-- recreating one loses nothing.
--
-- date_precision is deliberately left alone for these rows. It is the unit the
-- source COUNTED IN, and a claim with no position never reaches the code that
-- reads it; adding a tenth precision meaning "not applicable" would mean
-- touching the render path for every claim to serve a handful that never get
-- there.
--
-- Additive. Nothing existing changes value, and no existing row can become
-- invalid: every one of them has a start_year, which every check below allows.
-- =============================================================================

alter table public.timeline_date_claims
  add column if not exists temporal_claim_type text,
  add column if not exists duration_years double precision,
  add column if not exists what_is_dated text;

comment on column public.timeline_date_claims.temporal_claim_type is
  'WHAT KIND of claim about time this is — a date somebody read off an instrument, a date somebody calculated, a position relative to another event, a repeating cycle, or an assertion that there is no beginning at all. Null = not stated, which is every row written before this column existed. The four positionless types are the reason it exists: they are the only ones permitted a null start_year.';

comment on column public.timeline_date_claims.what_is_dated is
  'WHICH PROPOSITION this date is a date FOR. Two claims on one record are not necessarily rival answers to one question: "the expansion of the observable universe" and "the creation of the world" are different subjects that happen to share a record, and without this column a reader is shown two numbers and left to assume they compete. Null = the claim dates the record itself, which is the ordinary case.';

comment on column public.timeline_date_claims.duration_years is
  'A LENGTH OF TIME WITH NO POSITION, in years — a mahayuga is 4,320,000 years and starts nowhere in particular. Not a range: end_year is the far end of something that begins at start_year, and a row may not carry both.';

-- ---------------------------------------------------------------------------
-- The vocabulary
--
-- Closed, because each value changes how the claim is drawn and worded. The
-- first six are POSITIONED — they put the claim somewhere on the axis, and
-- differ in how that somewhere was arrived at, which is exactly the difference
-- between "we measured it" and "Ussher added up the generations in Genesis".
-- The last four are POSITIONLESS and are the reason for the whole migration.
-- ---------------------------------------------------------------------------

alter table public.timeline_date_claims
  drop constraint if exists timeline_date_claims_temporal_type;
alter table public.timeline_date_claims
  add constraint timeline_date_claims_temporal_type check (
    temporal_claim_type is null or temporal_claim_type in (
      -- Positioned.
      'absolute_date',     -- A date as such: 14 October 1066.
      'approximate_date',  -- A date the source itself hedges: "c. 2560 BCE".
      'date_range',        -- Somewhere between two dates.
      'years_ago',         -- Counted back from the present, not stated as a calendar year.
      'calculated_date',   -- Derived by somebody's arithmetic from other material — Ussher's 4004 BC.
      'relative_date',     -- Fixed against another event rather than against a calendar.
      'before_event',
      'after_event',
      -- Positionless. These four may have no start_year.
      'cyclic',            -- A repeating cycle, or a length within one.
      'eternal',           -- Asserted to have always existed.
      'no_beginning',      -- Asserted to have no first moment. Not the same as eternal, and not a gap in the record.
      'unknown'            -- Explicitly not known, as opposed to not yet filled in.
    )
  );

-- ---------------------------------------------------------------------------
-- A missing start is allowed only where it MEANS something
--
-- This is the constraint that keeps the relaxation honest. Without it,
-- "nullable start_year" would mean any claim could quietly lose its date and
-- nothing would notice.
--
-- THE coalesce IS LOAD-BEARING, and the first version of this constraint did
-- not have it. `temporal_claim_type in (...)` is NULL — not false — when the
-- type is null, and a CHECK rejects a row only on FALSE. So a claim with no
-- date AND no stated type, which is exactly the accident this constraint
-- exists to catch, sailed through: false OR NULL is NULL. Coalescing to a
-- string that is not in the list makes the test return false instead.
-- ---------------------------------------------------------------------------

alter table public.timeline_date_claims
  alter column start_year drop not null;

alter table public.timeline_date_claims
  drop constraint if exists timeline_date_claims_start_or_positionless;
alter table public.timeline_date_claims
  add constraint timeline_date_claims_start_or_positionless check (
    start_year is not null
    or coalesce(temporal_claim_type, '') in ('cyclic', 'eternal', 'no_beginning', 'unknown')
  );

-- The far end of a range with no near end is not a range.
alter table public.timeline_date_claims
  drop constraint if exists timeline_date_claims_end_needs_start;
alter table public.timeline_date_claims
  add constraint timeline_date_claims_end_needs_start check (
    end_year is null or start_year is not null
  );

-- A duration is not a second way to write a range, and a negative one is a
-- data-entry slip rather than a viewpoint.
alter table public.timeline_date_claims
  drop constraint if exists timeline_date_claims_duration_sane;
alter table public.timeline_date_claims
  add constraint timeline_date_claims_duration_sane check (
    duration_years is null or (duration_years > 0 and end_year is null)
  );

-- A day or a month without a year is not a date either. The existing
-- day-needs-month checks say nothing about this because a year was compulsory.
alter table public.timeline_date_claims
  drop constraint if exists timeline_date_claims_month_needs_year;
alter table public.timeline_date_claims
  add constraint timeline_date_claims_month_needs_year check (
    start_month is null or start_year is not null
  );

-- ---------------------------------------------------------------------------
-- start_era, rebuilt so that "no year" reports no era
--
-- It was `case when start_year <= 0 then 'BCE' else 'CE' end`, which sends a
-- null year down the else branch and answers 'CE' — a confident statement about
-- a number that does not exist. Generated columns store nothing that is not
-- derivable, so this is a rewrite, not a migration of data.
-- ---------------------------------------------------------------------------

alter table public.timeline_date_claims drop column if exists start_era;
alter table public.timeline_date_claims
  add column start_era text generated always as (
    case when start_year is null then null
         when start_year <= 0 then 'BCE'
         else 'CE' end
  ) stored;

-- ---------------------------------------------------------------------------
-- Finding the positionless claims
--
-- The window query looks up claims by start_position and will never return
-- these, which is correct. This index is for the opposite question — "show me
-- every claim in this community that makes no claim about a position" — which
-- is how a reader gets to the Steady State model at all.
-- ---------------------------------------------------------------------------

create index if not exists idx_timeline_date_claims_positionless
  on public.timeline_date_claims (community_id, temporal_claim_type)
  where start_position is null;
