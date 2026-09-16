-- =============================================================================
-- Relate — Timeline: THE INTERPRETIVE CHAIN, KEPT IN PIECES
--
-- The timeline's founding rule is that an event has no date: dates live on
-- claims, because different sources give different dates and flattening them
-- into one number teaches the opposite of how history is known. The same rule
-- has since been applied to quantities (timeline_measurement_claims: a person
-- has no height).
--
-- This applies it to the thing it was always most needed for: WHAT A TEXT SAYS.
--
-- Between a papyrus and a sentence on a timeline there are six or seven
-- separate human acts, and every one of them can be disagreed with:
--
--     the object            a roll of papyrus in Dublin
--     the text on it        hieratic, written c. 1160 BCE
--     a transcription       Gardiner's hieroglyphic rendering, 1931
--     a transliteration     the consonants in Latin letters, with diacritics
--     a translation         Gardiner 1931, Lichtheim 1976, Wente — and they differ
--     a modern summary      somebody's close paraphrase
--     an interpretation     what it is taken to MEAN
--
-- A single `description` column collapses all seven into one voice, and a
-- reader meeting that column cannot tell which words are the papyrus's, which
-- are Gardiner's, and which are ours. That is the collapse this schema exists
-- to prevent. There is no column here called "fact".
--
-- WHY TWO TABLES.
--
-- A passage is the addressable unit, not the event. The Contendings of Horus
-- and Seth is one event and about fifteen episodes, each located at its own
-- page and line of Papyrus Chester Beatty I. One set of layers per event would
-- flatten fifteen legal arguments into one block of prose — the same mistake
-- one row up. So: an event has passages, and a passage has layers.
--
-- WHY A LAYER IS A CLAIM AND NOT A COLUMN.
--
-- The obvious design is seven columns on the passage — transcription,
-- transliteration, translation, and so on. It is wrong for one reason, and it
-- is the reason this whole feature exists: THERE IS MORE THAN ONE TRANSLATION.
-- Gardiner 1931 and Lichtheim 1976 render the same lines differently, and the
-- difference is not noise to be resolved before display; it is the single most
-- instructive thing on the page. A column holds one. A table holds three, each
-- pointing at the scholar who made it, and the interface can put them side by
-- side exactly as viewpoint comparison already does for dates.
--
-- The same argument covers interpretation. "Alternative interpretation" is not
-- a separate layer, and modelling it as one would rebuild the collapse: it is a
-- second row at layer='interpretation' with a different source and a different
-- viewpoint. Making one of them "the" interpretation and the other "the
-- alternative" is a ranking, and this codebase does not rank.
--
-- WHY content IS NULLABLE.
--
-- Copyright. Lichtheim's translation is in print and reproducing it whole would
-- be a straightforward infringement, so a translation row is often a
-- BIBLIOGRAPHIC POINTER — the citation, the page range, and no text. That row
-- is still worth having: it records that the translation exists, who made it,
-- and where to read it, which is what a reader chasing a difference needs. A
-- row with no content must say why, exactly as a measurement with no figure
-- must say why it has none.
--
-- Safe to re-run.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- A PASSAGE: a located piece of surviving evidence.
--
-- "Located" is the whole of it. `reference` is what lets a reader open the
-- same edition at the same page and check — Chester Beatty I recto 3,1–4,3;
-- Pyramid Texts utterance 356; line 9 of the 400-Year Stela. A passage with no
-- reference is a quotation floating free of the thing it came out of, which is
-- the state this schema exists to end.
-- ---------------------------------------------------------------------------
create table if not exists public.timeline_text_passages (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.timeline_events (id) on delete cascade,
  -- Denormalised from the event so RLS never has to join to answer "is this
  -- mine to see", the same way every other table in this feature carries it.
  community_id uuid not null references public.communities (id) on delete cascade,
  created_by uuid not null references public.profiles (id) on delete cascade,

  -- The publication or record in which this passage is located. Nullable
  -- because the object itself sometimes IS the source and has no edition.
  source_id uuid references public.timeline_sources (id) on delete set null,

  -- What this passage is, in plain words: "Seth states the basis of his
  -- counterclaim". A heading for a reader, never a summary of the content —
  -- the content is downstairs in its layers, in somebody's named voice.
  label text not null,

  -- WHERE IT IS. Page and line, utterance number, column, register.
  reference text,

  -- THE PHYSICAL THING, and where it is now. Separate from source_id because
  -- the papyrus and the book about the papyrus are different objects, and the
  -- commonest way to lose provenance is to let the edition stand in for the
  -- artefact.
  object_name text,
  holding_institution text,
  accession_number text,

  notes text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- A LAYER: one act of rendering, by one named party.
--
-- One row = one person's version of this passage at one remove from the
-- object. Three translations are three rows. The source on the row is WHO DID
-- THIS RENDERING, which is a different question from which source the passage
-- is published in.
-- ---------------------------------------------------------------------------
create table if not exists public.timeline_text_layers (
  id uuid primary key default gen_random_uuid(),
  passage_id uuid not null references public.timeline_text_passages (id) on delete cascade,
  community_id uuid not null references public.communities (id) on delete cascade,
  created_by uuid not null references public.profiles (id) on delete cascade,

  -- WHO MADE THIS RENDERING. Null only where nothing in particular does —
  -- a photograph of the object, an obvious reading nobody claims.
  source_id uuid references public.timeline_sources (id) on delete set null,

  -- An EVIDENCE_LAYERS key in taxonomy.ts. Deliberately plain text and not an
  -- enum, like every other vocabulary column here: a community that files
  -- something under a word we did not think of keeps it.
  layer text not null,

  -- The text itself. NULLABLE — see the header: a copyrighted translation is
  -- often recorded as a citation with no text, and that row is still evidence
  -- that the translation exists and differs.
  content text,
  content_absent_reason text,

  -- What language and script this rendering is in. Two fields, because
  -- "Egyptian" does not say whether you are looking at hieratic, at Gardiner's
  -- hieroglyphic transcription of it, or at consonants in Latin letters — and
  -- those are three different layers of exactly this chain.
  language text,
  script text,

  -- A CLAIM_VIEWPOINTS key, for the layers where a framework is in play.
  -- An interpretation belongs to somebody's account of the material; a
  -- transliteration does not, and leaving this null there is correct.
  viewpoint text,

  -- Why this rendering reads as it does, and what it does and does not
  -- establish — the same job `evidence` does on a date claim. This is where a
  -- disputed word gets explained rather than silently resolved.
  evidence text not null,
  notes text,

  sort_order integer not null default 0,
  created_at timestamptz not null default now(),

  -- A row with no text must say why it has none.
  constraint text_layer_content_or_reason
    check (content is not null or content_absent_reason is not null),

  -- Nothing in this timeline stores a confidence score, and a field called
  -- "evidence" sitting next to seven degrees of remove from an object is the
  -- most tempting place anyone has yet had to start. Enforced, not requested.
  constraint text_layer_no_confidence_score
    check (evidence !~* 'confidence (score|level|rating)')
);

create index if not exists timeline_text_passages_event_id_idx
  on public.timeline_text_passages (event_id);
create index if not exists timeline_text_passages_source_id_idx
  on public.timeline_text_passages (source_id);
create index if not exists timeline_text_layers_passage_id_idx
  on public.timeline_text_layers (passage_id);
create index if not exists timeline_text_layers_source_id_idx
  on public.timeline_text_layers (source_id);

grant all on public.timeline_text_passages to anon, authenticated, service_role;
grant all on public.timeline_text_layers to anon, authenticated, service_role;

alter table public.timeline_text_passages enable row level security;
alter table public.timeline_text_layers enable row level security;

-- Same posture as timeline_measurement_claims: readable with the event it
-- belongs to, writable by members of the community that owns it, deletable by
-- community staff. Uses the repo's existing helpers rather than hand-rolled
-- joins so the rules stay in one place.

drop policy if exists "timeline_text_passages_select" on public.timeline_text_passages;
create policy "timeline_text_passages_select" on public.timeline_text_passages
  for select to authenticated
  using (
    exists (
      select 1 from public.timeline_events e
      where e.id = timeline_text_passages.event_id
    )
  );

drop policy if exists "timeline_text_passages_select_anon" on public.timeline_text_passages;
create policy "timeline_text_passages_select_anon" on public.timeline_text_passages
  for select to anon
  using (
    exists (
      select 1 from public.timeline_events e
      where e.id = timeline_text_passages.event_id
    )
  );

drop policy if exists "timeline_text_passages_insert_member" on public.timeline_text_passages;
create policy "timeline_text_passages_insert_member" on public.timeline_text_passages
  for insert to authenticated
  with check (
    exists (
      select 1 from public.timeline_events e
      where e.id = timeline_text_passages.event_id
        and public.community_has_timeline(e.community_id)
        and public.is_community_member(e.community_id, auth.uid())
    )
  );

drop policy if exists "timeline_text_passages_update_member" on public.timeline_text_passages;
create policy "timeline_text_passages_update_member" on public.timeline_text_passages
  for update to authenticated
  using (
    exists (
      select 1 from public.timeline_events e
      where e.id = timeline_text_passages.event_id
        and public.is_community_member(e.community_id, auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.timeline_events e
      where e.id = timeline_text_passages.event_id
        and public.is_community_member(e.community_id, auth.uid())
    )
  );

drop policy if exists "timeline_text_passages_delete_staff" on public.timeline_text_passages;
create policy "timeline_text_passages_delete_staff" on public.timeline_text_passages
  for delete to authenticated
  using (
    exists (
      select 1 from public.timeline_events e
      where e.id = timeline_text_passages.event_id
        and public.is_community_staff(e.community_id, auth.uid())
    )
  );

-- Layers hang off a passage, so every policy reaches through it to the event.

drop policy if exists "timeline_text_layers_select" on public.timeline_text_layers;
create policy "timeline_text_layers_select" on public.timeline_text_layers
  for select to authenticated
  using (
    exists (
      select 1 from public.timeline_text_passages p
      where p.id = timeline_text_layers.passage_id
    )
  );

drop policy if exists "timeline_text_layers_select_anon" on public.timeline_text_layers;
create policy "timeline_text_layers_select_anon" on public.timeline_text_layers
  for select to anon
  using (
    exists (
      select 1 from public.timeline_text_passages p
      where p.id = timeline_text_layers.passage_id
    )
  );

drop policy if exists "timeline_text_layers_insert_member" on public.timeline_text_layers;
create policy "timeline_text_layers_insert_member" on public.timeline_text_layers
  for insert to authenticated
  with check (
    exists (
      select 1
      from public.timeline_text_passages p
      join public.timeline_events e on e.id = p.event_id
      where p.id = timeline_text_layers.passage_id
        and public.community_has_timeline(e.community_id)
        and public.is_community_member(e.community_id, auth.uid())
    )
  );

drop policy if exists "timeline_text_layers_update_member" on public.timeline_text_layers;
create policy "timeline_text_layers_update_member" on public.timeline_text_layers
  for update to authenticated
  using (
    exists (
      select 1
      from public.timeline_text_passages p
      join public.timeline_events e on e.id = p.event_id
      where p.id = timeline_text_layers.passage_id
        and public.is_community_member(e.community_id, auth.uid())
    )
  )
  with check (
    exists (
      select 1
      from public.timeline_text_passages p
      join public.timeline_events e on e.id = p.event_id
      where p.id = timeline_text_layers.passage_id
        and public.is_community_member(e.community_id, auth.uid())
    )
  );

drop policy if exists "timeline_text_layers_delete_staff" on public.timeline_text_layers;
create policy "timeline_text_layers_delete_staff" on public.timeline_text_layers
  for delete to authenticated
  using (
    exists (
      select 1
      from public.timeline_text_passages p
      join public.timeline_events e on e.id = p.event_id
      where p.id = timeline_text_layers.passage_id
        and public.is_community_staff(e.community_id, auth.uid())
    )
  );
