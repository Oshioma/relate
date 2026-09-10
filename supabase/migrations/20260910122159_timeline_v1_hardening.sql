-- =============================================================================
-- Relate — Timeline V1 hardening
--
-- Six changes, all of them in service of one idea: the product records what
-- sources SAY and how they arrived at it, and never positions itself as the
-- authority on whether a date is right.
--
--   1. CONFIDENCE IS GONE. A "high / medium / low confidence" field asked
--      Relate to rate a historical, scientific or religious claim. That is not
--      ours to rate, and a badge saying so ends the enquiry it should have
--      started. Its replacement is not another field — it is the evidence and
--      the dating method, which were already here and are now what the UI
--      leads with.
--
--   2. THE SOURCE'S OWN WORDING SURVIVES. original_date_text keeps "13.799 ±
--      0.021 billion years ago", "10 AH", "the third year of the reign of…"
--      exactly as written, independent of the number the timeline positions
--      against. Normalising for an axis must never be allowed to destroy the
--      notation, so that calendar conversion can be added later without having
--      lost the input.
--
--   3. PRECISION IS THE SOURCE'S, NOT THE SYSTEM'S. The old date_precision
--      conflated "how coarse is this" with "how old is this", so anything
--      ancient was rounded on the way to the screen. It is now a UNIT the
--      source used plus the number of DECIMALS it gave in that unit — so
--      66.043 Ma stays 66.043 Ma, and "c. 300,000 years ago" never becomes
--      300,000.000.
--
--   4. ± UNCERTAINTY IS ITS OWN THING. A scientific tolerance and a historical
--      range are different claims: "13.799 ± 0.021 Ga" says one moment known
--      to a tolerance, "2600–2500 BCE" says somewhere in a hundred years. The
--      range keeps using start/end; the tolerance gets its own two columns.
--
--   5. EVENTS CAN SAY WHAT KIND OF RECORD THEY ARE. Historical event,
--      scientific model, religious account, hypothesis, planned future event.
--      This describes the KIND of claim, not its credibility, and nothing
--      assigns it automatically.
--
--   6. EDITS ARE ON THE RECORD. timeline_revisions keeps who changed what,
--      when, and from what to what — because contested chronology is the point
--      of this feature, and a silent edit to a date claim is the one change
--      that most needs to be visible.
--
-- Plus one enforcement rule: a member who edits a published event's dates
-- sends it back for approval. That is a trigger, not a convention, so it
-- holds however the write arrives.
--
-- Safe to re-run.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Confidence, removed
-- ---------------------------------------------------------------------------

alter table public.timeline_date_claims drop column if exists confidence;

-- ---------------------------------------------------------------------------
-- 2. The source's own wording
--
-- display_text was doing this job under a name that invited it to be used as a
-- label override instead — and a label that can disagree with the number
-- underneath it is a bug waiting to happen. Renamed to what it is actually
-- for; the normalised label is now always derived from the numbers, so the two
-- can never contradict each other.
-- ---------------------------------------------------------------------------

alter table public.timeline_date_claims
  add column if not exists original_date_text text not null default '';

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'timeline_date_claims' and column_name = 'display_text'
  ) then
    update public.timeline_date_claims
       set original_date_text = display_text
     where original_date_text = '' and display_text <> '';
    alter table public.timeline_date_claims drop column display_text;
  end if;
end $$;

comment on column public.timeline_date_claims.original_date_text is
  'The date exactly as the source expresses it — "c. 2560 BCE", "10 AH", "13.799 ± 0.021 billion years ago". Never derived, never overwritten by normalisation. Blank = the source gave nothing worth quoting.';

-- ---------------------------------------------------------------------------
-- 3. Precision as a unit plus decimals
--
-- The old values map one-to-one onto units, so this is a rename of the
-- vocabulary rather than a reinterpretation of any stored row. `exact_date`
-- becomes `day`, which is what it always meant.
-- ---------------------------------------------------------------------------

alter table public.timeline_date_claims
  drop constraint if exists timeline_date_claims_date_precision_check;

update public.timeline_date_claims
   set date_precision = case date_precision
     when 'exact_date' then 'day'
     when 'thousands' then 'thousand_years'
     when 'millions' then 'million_years'
     when 'billions' then 'billion_years'
     else date_precision
   end;

alter table public.timeline_date_claims
  add constraint timeline_date_claims_date_precision_check
  check (date_precision in (
    'day', 'month', 'year', 'decade', 'century', 'millennium',
    'thousand_years', 'million_years', 'billion_years'
  ));

comment on column public.timeline_date_claims.date_precision is
  'The UNIT the source expressed this date in. Paired with precision_decimals, which says how many decimal places it gave in that unit. See DATE_UNITS in src/lib/timeline/time.ts.';

-- How many decimals the source gave IN THAT UNIT. 13.799 Ga is
-- (billion_years, 3); 4.54 Ga is (billion_years, 2); 1066 CE is (year, 0).
-- This is the whole of "preserve the precision the source supplied, and invent
-- none it didn't": the renderer prints exactly this many places, so a value can
-- neither be rounded away nor padded out.
alter table public.timeline_date_claims
  add column if not exists precision_decimals smallint not null default 0
  constraint timeline_date_claims_precision_decimals_range check (precision_decimals between 0 and 9);

comment on column public.timeline_date_claims.precision_decimals is
  'Decimal places the source gave in date_precision''s unit. 0 for "66 million years ago", 3 for "66.043 million years ago". Drives display exactly; never inferred from the age of the thing.';

-- ---------------------------------------------------------------------------
-- 4. ± uncertainty, kept apart from a date range
--
-- Stored in YEARS rather than in the source's unit, so every comparison — is
-- this claim's window inside that one's, how far apart are they — is a
-- subtraction rather than a unit negotiation. The unit comes back at render
-- time from date_precision, which is where it is needed and only there.
--
-- Asymmetric on purpose: most sources publish ±x, but some publish +x / −y and
-- flattening those into one number would be inventing a symmetry the source
-- didn't claim.
-- ---------------------------------------------------------------------------

alter table public.timeline_date_claims
  add column if not exists uncertainty_plus double precision
    constraint timeline_date_claims_uncertainty_plus_positive check (uncertainty_plus is null or uncertainty_plus >= 0),
  add column if not exists uncertainty_minus double precision
    constraint timeline_date_claims_uncertainty_minus_positive check (uncertainty_minus is null or uncertainty_minus >= 0);

comment on column public.timeline_date_claims.uncertainty_plus is
  'Source-stated tolerance above the value, IN YEARS. "13.799 ± 0.021 Ga" stores 21000000 here and in uncertainty_minus. Not the same fact as end_year, which is a proposed RANGE.';

-- ---------------------------------------------------------------------------
-- 5. What kind of record an event is
--
-- Free text, validated in the app (TIMELINE_EVENT_TYPES), like every other
-- taxonomy in this schema — a community that needs a word we didn't think of
-- keeps it. Null means nobody has said, which is the honest default and the
-- only one anything sets automatically.
-- ---------------------------------------------------------------------------

alter table public.timeline_events
  add column if not exists event_type text,
  add column if not exists event_type_note text;

comment on column public.timeline_events.event_type is
  'What KIND of record this is — historical event, scientific model, religious account, hypothesis, planned future event. Describes the claim, never rates it. Null = unstated.';

-- ---------------------------------------------------------------------------
-- 6. Revision history
--
-- Written by triggers rather than by the application, so an edit cannot reach
-- the row without reaching the record of the edit.
--
-- event_id cascades: history is part of the event, and when the event goes the
-- history goes with it. claim_id deliberately carries NO foreign key — a claim
-- being deleted is exactly the moment its history matters most, and an FK would
-- make that row impossible to write.
-- ---------------------------------------------------------------------------

create table if not exists public.timeline_revisions (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities (id) on delete cascade,
  event_id uuid not null references public.timeline_events (id) on delete cascade,
  -- Set when the change was to a date claim rather than to the event itself.
  -- Intentionally not a foreign key; see above.
  claim_id uuid,
  entity text not null check (entity in ('event', 'claim')),
  action text not null check (action in ('created', 'updated', 'deleted')),
  -- Null when the write came from a service-role job or the SQL console rather
  -- than from a person.
  actor_id uuid references public.profiles (id) on delete set null,
  -- { "<column>": { "from": <old>, "to": <new> }, … } — only the columns that
  -- actually changed. The application turns this into a sentence; SQL is the
  -- wrong place to write English.
  changes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- The event page's history panel, newest first.
create index if not exists idx_timeline_revisions_event
  on public.timeline_revisions (event_id, created_at desc);
create index if not exists idx_timeline_revisions_community
  on public.timeline_revisions (community_id, created_at desc);

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
    -- An event's deletion takes its history with it (the cascade above), so
    -- there is nothing to write and nowhere to hang it.
    if v_entity = 'event' then
      return null;
    end if;

    -- The same applies to a claim deleted BY that cascade rather than on its
    -- own. Deleting an event removes the event row first and the claims after
    -- it, so a revision written here would reference a parent that is already
    -- gone and the foreign key would abort the whole delete — taking "delete
    -- this event" with it. Checking the parent still exists distinguishes the
    -- two cases: a claim removed on its own has an event to hang its history
    -- on, a cascaded one does not and needs none.
    if not exists (select 1 from public.timeline_events e where e.id = old.event_id) then
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
  else
    v_event_id := coalesce((v_new ->> 'event_id')::uuid, (v_old ->> 'event_id')::uuid);
    v_claim_id := coalesce((v_new ->> 'id')::uuid, (v_old ->> 'id')::uuid);
  end if;

  insert into public.timeline_revisions (community_id, event_id, claim_id, entity, action, actor_id, changes)
  values (v_community_id, v_event_id, v_claim_id, v_entity, v_action, auth.uid(), v_changes);

  return null;
end;
$$;

drop trigger if exists timeline_events_revision on public.timeline_events;
create trigger timeline_events_revision
  after insert or update or delete on public.timeline_events
  for each row execute function public.timeline_record_revision('event');

drop trigger if exists timeline_date_claims_revision on public.timeline_date_claims;
create trigger timeline_date_claims_revision
  after insert or update or delete on public.timeline_date_claims
  for each row execute function public.timeline_record_revision('claim');

alter table public.timeline_revisions enable row level security;

-- Staff read it; nobody writes it directly. There is deliberately no insert,
-- update or delete policy — the trigger above runs as definer and is the only
-- way a row gets here, which is what makes the history trustworthy.
drop policy if exists "timeline_revisions_select_staff" on public.timeline_revisions;
create policy "timeline_revisions_select_staff" on public.timeline_revisions
  for select to authenticated
  using (public.is_community_staff(community_id, auth.uid()));

-- ---------------------------------------------------------------------------
-- 7. Editing a published event's dates sends it back for approval
--
-- The event table's own RLS already stops a member from writing a published
-- row. Claims were the gap: adding or changing a date on an already-approved
-- event is editing that event, and it went live with nobody looking. This
-- closes it in the database rather than in a server action, so it holds
-- whichever way the write arrives.
--
-- Staff are unaffected — approving something and then correcting a typo in it
-- should not queue it behind themselves. A null auth.uid() (service role, SQL
-- console, a backfill) is left alone for the same reason.
-- ---------------------------------------------------------------------------

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

  update public.timeline_events e
     set status = 'pending', reviewed_by = null, reviewed_at = null
   where e.id = v_event_id
     and e.status = 'published'
     and not public.is_community_staff(e.community_id, v_actor);

  return null;
end;
$$;

drop trigger if exists timeline_date_claims_review on public.timeline_date_claims;
create trigger timeline_date_claims_review
  after insert or update or delete on public.timeline_date_claims
  for each row execute function public.timeline_claim_requires_review();

-- ---------------------------------------------------------------------------
-- 8. Finding a source somebody already added
--
-- Reuse is the whole point of sources being their own records: a community that
-- ends up with "Herodotus — Histories" and "Herodotus Histories" as unrelated
-- rows has lost the ability to ask "what else does this source date?".
-- Autocomplete is what prevents that, so it has to be fast enough to run on
-- every keystroke.
--
-- Trigram indexes make an infix ILIKE an index scan instead of a sequential
-- one. pg_trgm is available on Supabase, but a restricted project could refuse
-- it — and a search that is merely un-indexed is a far better outcome than a
-- migration chain that will not apply. Hence the guard: take the fast path
-- where the extension exists, and fall back to the ordinary index otherwise.
-- ---------------------------------------------------------------------------

create index if not exists idx_timeline_sources_community_title
  on public.timeline_sources (community_id, lower(title));

do $$
begin
  create extension if not exists pg_trgm;
  execute 'create index if not exists idx_timeline_sources_title_trgm on public.timeline_sources using gin (title gin_trgm_ops)';
  execute 'create index if not exists idx_timeline_sources_author_trgm on public.timeline_sources using gin (author gin_trgm_ops)';
exception
  when insufficient_privilege or feature_not_supported or undefined_file then
    raise notice 'pg_trgm unavailable — timeline source autocomplete will use the btree index only';
end $$;
