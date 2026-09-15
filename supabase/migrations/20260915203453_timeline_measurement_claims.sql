-- MEASUREMENT CLAIMS.
--
-- The timeline's founding rule is that an event has no date: dates live on
-- claims, because different sources give different dates and a timeline that
-- flattens them into one number teaches the opposite of how history is known.
--
-- A height is the same kind of problem wearing different clothes. Charles
-- Byrne was advertised at eight feet four, his articulated skeleton measures
-- about seven feet seven, and both statements are real and neither is "the"
-- height. Patrick Cotter O'Brien has a lifetime advertisement, a coffin plate
-- and two exhumations, and they disagree. Storing one number would be the
-- same mistake in a new place.
--
-- So: a person has no height. Heights live here, one row per measurement,
-- each pointing at the source that asserts it and carrying the method that
-- produced it. This is the date-claim pattern applied to a second quantity,
-- NOT a parallel data model -- it reuses timeline_events, timeline_sources
-- and the same evidence/notes discipline.
--
-- WHY value_cm IS NULLABLE. A report can be evidence that a claim was MADE
-- without any figure surviving -- "a skeleton of great size" in an 1885
-- newspaper. Dropping those rows would quietly delete the disputed half of
-- the record, which is exactly what this dataset exists not to do. A row with
-- no value must say why in value_absent_reason.

create table if not exists public.timeline_measurement_claims (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.timeline_events (id) on delete cascade,
  source_id uuid references public.timeline_sources (id) on delete set null,

  -- WHAT was measured. Not "height": the whole point is that standing height,
  -- skeletal height and reconstructed living height are different quantities
  -- that get reported as though they were one.
  what_is_measured text not null,

  -- The figure, in centimetres, and the words the source actually used.
  -- original_value_text is to a measurement what original_date_text is to a
  -- date: what was said, before anyone converted it.
  value_cm double precision,
  value_absent_reason text,
  original_value_text text not null,

  -- A range, where the source gives one (7 ft 10 in - 8 ft 1 in).
  value_low_cm double precision,
  value_high_cm double precision,

  -- MEASUREMENT_KINDS / MEASUREMENT_METHODS / EVIDENCE_STATUSES in taxonomy.ts.
  measurement_kind text not null,
  measurement_method text not null,
  evidence_status text not null,

  -- Was the body or the remains actually put against a rule by somebody whose
  -- account we have? This single boolean separates most of the real evidence
  -- in this dataset from most of the noise.
  directly_measured boolean not null default false,

  measured_on date,
  measured_by text,

  evidence text not null,
  notes text,

  created_at timestamptz not null default now(),

  -- A row with no figure must say why it has none.
  constraint measurement_value_or_reason
    check (value_cm is not null or value_absent_reason is not null),
  -- A range must be the right way round.
  constraint measurement_range_ordered
    check (value_low_cm is null or value_high_cm is null or value_low_cm <= value_high_cm),
  -- Nothing in this timeline stores a confidence score, and this table is a
  -- tempting place to start. It is enforced rather than asked for.
  constraint measurement_no_confidence_score
    check (evidence !~* 'confidence (score|level|rating)')
);

create index if not exists timeline_measurement_claims_event_id_idx
  on public.timeline_measurement_claims (event_id);
create index if not exists timeline_measurement_claims_source_id_idx
  on public.timeline_measurement_claims (source_id);

grant all on public.timeline_measurement_claims to anon, authenticated, service_role;

alter table public.timeline_measurement_claims enable row level security;

-- Same posture as timeline_event_links: readable with the event it belongs to,
-- writable by members of the community that owns it, editable by the author or
-- community staff. Uses the repo's existing helpers rather than hand-rolled
-- joins so the rules stay in one place.
drop policy if exists "timeline_measurement_claims_select" on public.timeline_measurement_claims;
create policy "timeline_measurement_claims_select" on public.timeline_measurement_claims
  for select to authenticated
  using (
    exists (
      select 1 from public.timeline_events e
      where e.id = timeline_measurement_claims.event_id
    )
  );

drop policy if exists "timeline_measurement_claims_select_anon" on public.timeline_measurement_claims;
create policy "timeline_measurement_claims_select_anon" on public.timeline_measurement_claims
  for select to anon
  using (
    exists (
      select 1 from public.timeline_events e
      where e.id = timeline_measurement_claims.event_id
    )
  );

drop policy if exists "timeline_measurement_claims_insert_member" on public.timeline_measurement_claims;
create policy "timeline_measurement_claims_insert_member" on public.timeline_measurement_claims
  for insert to authenticated
  with check (
    exists (
      select 1 from public.timeline_events e
      where e.id = timeline_measurement_claims.event_id
        and public.community_has_timeline(e.community_id)
        and public.is_community_member(e.community_id, auth.uid())
    )
  );

drop policy if exists "timeline_measurement_claims_update_staff" on public.timeline_measurement_claims;
create policy "timeline_measurement_claims_update_staff" on public.timeline_measurement_claims
  for update to authenticated
  using (
    exists (
      select 1 from public.timeline_events e
      where e.id = timeline_measurement_claims.event_id
        and public.is_community_member(e.community_id, auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.timeline_events e
      where e.id = timeline_measurement_claims.event_id
        and public.is_community_member(e.community_id, auth.uid())
    )
  );

drop policy if exists "timeline_measurement_claims_delete_staff" on public.timeline_measurement_claims;
create policy "timeline_measurement_claims_delete_staff" on public.timeline_measurement_claims
  for delete to authenticated
  using (
    exists (
      select 1 from public.timeline_events e
      where e.id = timeline_measurement_claims.event_id
        and public.is_community_staff(e.community_id, auth.uid())
    )
  );
