-- =============================================================================
-- "14,600 YEARS AGO" IS NOT "14,600 BCE"
--
-- They differ by 1,950 years, and that gap is exactly the size that
-- manufactures a correlation which is not there. A tradition placed at 12,650
-- BCE sits at the end of the Younger Dryas; the same figure mis-entered as
-- 14,600 BCE sits nowhere near it. A reader would see a coincidence, and the
-- coincidence would be arithmetic.
--
-- The conversion helper has always been right — "before present" in the
-- sciences means before 1950, and astronomicalFromYearsAgo subtracts from
-- 1950. An audit of all 46 "years ago" claims already seeded found no drift.
-- What was missing is any record of WHICH CONVENTION THE SOURCE USED, and that
-- omission is what lets the error in:
--
--   * A geologist writing "14,600 BP" counts from 1950.
--   * Churchward writing "about 12,000 years ago" in 1926 counts from 1926.
--   * Ussher writing "4004 BC" counts from nothing — it is a calendar year.
--
-- Those are three different statements, and until now the database stored only
-- the answer, never the question. A later editor reading "10,074 BCE" on the
-- Mu record has no way to know it was reached by subtracting from 1926 rather
-- than from 1950 — so the next person to revise it will subtract from 1950 and
-- silently move the claim by twenty-four years. On a deep-time claim the same
-- mistake moves it by two millennia.
--
-- WHAT THIS ADDS
--
--   date_convention           — HOW THE SOURCE EXPRESSED IT. Not how we store
--                               it; storage is always an astronomical year.
--                               This is the source's own frame, kept so the
--                               claim can be re-derived and so the UI can say
--                               "12,000 years ago (counted from 1926)" rather
--                               than presenting our arithmetic as the source's
--                               words.
--
--   convention_reference_year — WHAT "AGO" COUNTS FROM. 1950 for a scientific
--                               BP date; the year of writing for a source that
--                               says "years ago" and means ago from itself.
--                               Meaningless for a calendar date, and the check
--                               below says so.
--
-- Neither is required, and both are null on every existing row — which
-- correctly means "nobody has recorded the convention", not "it is BCE".
--
-- AND MOTIFS, which are a different problem sharing one migration because both
-- are groundwork for the same dataset.
--
-- Comparing flood traditions is the whole educational point, and it cannot be
-- done on dates: most traditions have none, and the ones that do got them from
-- later chronographers. What CAN be compared is structure — a warning, a
-- vessel, a mountain, birds released, a sign afterwards. Those are properties
-- of the STORY, so they sit on the event beside tags and people rather than on
-- a claim, and they use the same text[] shape the events table already uses
-- for tags, people and civilisations. No new parallel model.
--
-- THE RULE THAT MAKES THEM WORTH HAVING: a motif is only recorded when the
-- cited source actually contains it. An unmarked motif means "not found in the
-- source", never "absent from the tradition" — a comparison table filled in
-- from memory would invent parallels, which is precisely the failure this
-- dataset exists to avoid.
--
-- Additive. Nothing existing changes value.
-- =============================================================================

alter table public.timeline_date_claims
  add column if not exists date_convention text,
  add column if not exists convention_reference_year double precision;

comment on column public.timeline_date_claims.date_convention is
  'HOW THE SOURCE EXPRESSED THE DATE — a calendar year, a "before present" figure, or "N years ago" relative to its own writing. Storage is always an astronomical year; this keeps the frame that produced it, so the claim can be re-derived and so the UI never presents our arithmetic as the source''s wording. Null = not recorded.';

comment on column public.timeline_date_claims.convention_reference_year is
  'What "ago" is counted back from: 1950 for a scientific before-present date, the year of writing for a source that means ago from itself. Null for a calendar date, which counts from nothing.';

alter table public.timeline_date_claims
  drop constraint if exists timeline_date_claims_convention;
alter table public.timeline_date_claims
  add constraint timeline_date_claims_convention check (
    date_convention is null or date_convention in (
      'calendar',    -- The source gave a year: "4004 BC", "1650". Counts from nothing.
      'before_present', -- A scientific BP figure. Counts from 1950 by definition.
      'years_ago',   -- "About 12,000 years ago" — counts from when the SOURCE was written.
      'relative',    -- "Nine thousand years before Solon" — counts from another event.
      'unknown'
    )
  );

-- A reference year is required exactly where "ago" means something, and
-- forbidden where it does not. coalesce because `x in (...)` is NULL rather
-- than false when x is null, and a CHECK rejects only on FALSE — the same trap
-- that let a dateless claim through the positionless constraint.
alter table public.timeline_date_claims
  drop constraint if exists timeline_date_claims_reference_year;
alter table public.timeline_date_claims
  add constraint timeline_date_claims_reference_year check (
    case
      when coalesce(date_convention, '') in ('years_ago', 'before_present')
        then convention_reference_year is not null
      when coalesce(date_convention, '') = 'calendar'
        then convention_reference_year is null
      else true
    end
  );

-- ---------------------------------------------------------------------------
-- MORE KINDS OF TEMPORAL CLAIM
--
-- The cosmology work established that a claim has to say what KIND of
-- statement about time it is. Flood traditions need more kinds than cosmology
-- did, and two of them are the whole reason this dataset can be honest:
--
--   proposed_correlation — "this tradition may line up with that dated event".
--                          A claim about a RELATIONSHIP, made by a named
--                          person, and the single most abused move in this
--                          subject. Stored as its own kind so it can never be
--                          read as a dating of the tradition itself.
--
--   date_of_first_known_record — when the story was first written down, which
--                          is a fact about a manuscript and not about the
--                          event. A tradition can carry three dates at once:
--                          when it says the flood happened, when somebody
--                          wrote it down, and when a modern researcher
--                          proposes it correlates with. Collapsing those is
--                          the error this table exists to prevent.
--
-- And two more positionless kinds, because "in the time of the ancestors" and
-- "in the world before this one" are real answers that a BCE year would
-- falsify. They join the four that may carry no start_year.
-- ---------------------------------------------------------------------------

alter table public.timeline_date_claims
  drop constraint if exists timeline_date_claims_temporal_type;
alter table public.timeline_date_claims
  add constraint timeline_date_claims_temporal_type check (
    temporal_claim_type is null or temporal_claim_type in (
      -- Positioned.
      'absolute_date', 'approximate_date', 'date_range', 'years_ago',
      'calculated_date', 'relative_date', 'before_event', 'after_event',
      'explicit_date', 'traditional_date', 'genealogical_date',
      'archaeological_date', 'geological_date', 'radiometric_date',
      'estimated_range', 'proposed_correlation', 'date_of_first_known_record',
      -- Positionless. These may have no start_year.
      'cyclic', 'eternal', 'no_beginning', 'primordial', 'previous_world', 'unknown'
    )
  );

alter table public.timeline_date_claims
  drop constraint if exists timeline_date_claims_start_or_positionless;
alter table public.timeline_date_claims
  add constraint timeline_date_claims_start_or_positionless check (
    start_year is not null
    or coalesce(temporal_claim_type, '') in (
      'cyclic', 'eternal', 'no_beginning', 'primordial', 'previous_world', 'unknown'
    )
  );

-- ---------------------------------------------------------------------------
-- What the STORY contains, for comparing traditions that share no dates
-- ---------------------------------------------------------------------------

alter table public.timeline_events
  add column if not exists motifs text[] not null default '{}';

comment on column public.timeline_events.motifs is
  'Structural elements the CITED SOURCE actually contains — a divine warning, a vessel, a mountain refuge, birds released, a sign afterwards. Validated in the app against NARRATIVE_MOTIFS. An absent motif means "not found in the source", never "absent from the tradition": these are for comparing what accounts say, and a table filled in from memory would invent the parallels it exists to test.';

create index if not exists idx_timeline_events_motifs
  on public.timeline_events using gin (motifs);
