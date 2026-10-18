-- =============================================================================
-- Relate — Timeline: THE TEXT ARCHIVE
--
-- timeline_text_passages and timeline_text_layers (20260916072636) already
-- hold the interpretive chain for a passage: the object, the text on it, its
-- transliteration, every translation as its own row, and every interpretation
-- under a named viewpoint. This migration does not replace any of that. It adds
-- the structure a COMPLETE text needs around those passages:
--
--     a work            the Pyramid Texts, Corpus Hermeticum, Doreal's Tablets
--     its versions      the long and short Apocryphon of John; the Arabic and
--                       the Latin Emerald Tablet — kept apart, never merged
--     its manuscripts   the physical witnesses, where they are now, when made
--     the hierarchy     book → chapter → passage, in reading order
--     witnesses         which manuscript carries which passage, and how it differs
--     passage dates     where a single passage has its own history
--     images            several per passage, each with its provenance
--     connections       passage ↔ passage, classified and argued, never scored
--     themes            navigation aids — NOT proof of a shared doctrine
--     import runs       the log that makes a large import resumable
--
-- THE TIMELINE STAYS NAVIGABLE. A work hangs off ONE timeline event — the
-- marker placed at the text's documented dates by ordinary date claims — and
-- every passage is reached from it. Passages never become events, so the
-- strip's 400-event window can never be flooded with spells.
--
-- WHY PASSAGE CONNECTIONS STORE KEYS, NOT IDS. A connection from Doreal's
-- Tablet XI to the Latin vulgate Tablet is research that can be written before
-- both texts are imported. Keys survive re-import and import order; a check in
-- the test suite reports connections whose ends are not (yet) present.
--
-- Additive only. Nothing existing is renamed, retyped or dropped. Safe to re-run.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- A WORK: one text, anchored to one timeline event.
-- ---------------------------------------------------------------------------
create table if not exists public.timeline_text_works (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities (id) on delete cascade,
  created_by uuid not null references public.profiles (id) on delete cascade,
  -- The marker on the timeline. Its date claims carry the five chronological
  -- concepts (what_is_dated says which). Nullable so an inventoried work can
  -- exist before its marker does.
  event_id uuid references public.timeline_events (id) on delete set null,

  -- Permanent key, e.g. 'egy.pyramid-texts', 'herm.corpus-hermeticum'.
  work_key text not null,
  title text not null,
  alternative_titles text[] not null default '{}',
  -- 'egyptian' | 'greek_hermetic' | 'gnostic' | 'arabic_medieval' | 'modern_esoteric'
  corpus_group text not null,
  -- How the work stands in time — a TEXT_TRADITION_CLASSES key. The check that
  -- keeps a 1930s book from being shelved as an ancient one.
  tradition_class text not null,
  civilisation text,
  geographical_origin text,
  original_language text,
  attribution text,
  attribution_note text,
  summary text,

  -- THE INVENTORY. What a complete import would contain, and on whose word.
  reference_edition text,
  expected_units integer,
  unit_label text,
  inventory_basis text,
  -- true only once the expected count has been checked against that edition
  -- or catalogue. Until then nothing may call this work complete.
  inventory_verified boolean not null default false,
  -- A TEXT_COMPLETENESS_STATUSES key.
  completeness_status text not null default 'not_started',

  -- What may be reproduced, in plain words, for the whole work.
  copyright_summary text,
  research_sources text,
  notes text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint text_work_expected_positive check (expected_units is null or expected_units >= 0)
);

create unique index if not exists timeline_text_works_key_idx
  on public.timeline_text_works (community_id, work_key);
create index if not exists timeline_text_works_event_idx
  on public.timeline_text_works (event_id);

-- ---------------------------------------------------------------------------
-- A VERSION: a recension, language version or manuscript tradition.
-- ---------------------------------------------------------------------------
create table if not exists public.timeline_text_versions (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities (id) on delete cascade,
  created_by uuid not null references public.profiles (id) on delete cascade,
  work_id uuid not null references public.timeline_text_works (id) on delete cascade,
  version_key text not null,
  label text not null,
  language text,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create unique index if not exists timeline_text_versions_key_idx
  on public.timeline_text_versions (community_id, version_key);
create index if not exists timeline_text_versions_work_idx
  on public.timeline_text_versions (work_id);

-- ---------------------------------------------------------------------------
-- A MANUSCRIPT: a physical witness — a pyramid wall, a coffin, a papyrus, a
-- codex, a printed edition used as a witness. Its date is stated the way a
-- date claim states one: a range, a precision, and the words of the catalogue.
-- ---------------------------------------------------------------------------
create table if not exists public.timeline_text_manuscripts (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities (id) on delete cascade,
  created_by uuid not null references public.profiles (id) on delete cascade,
  work_id uuid references public.timeline_text_works (id) on delete set null,
  manuscript_key text not null,
  siglum text,
  name text not null,
  -- 'inscription' | 'papyrus' | 'coffin' | 'codex' | 'tablet' | 'print' | …
  object_kind text,
  holding_institution text,
  accession_number text,
  findspot text,
  start_year double precision,
  end_year double precision,
  date_precision text,
  is_approximate boolean not null default true,
  original_date_text text,
  dating_evidence text,
  catalogue_url text,
  source_id uuid references public.timeline_sources (id) on delete set null,
  notes text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),

  constraint text_manuscript_range_ordered
    check (start_year is null or end_year is null or end_year >= start_year)
);

create unique index if not exists timeline_text_manuscripts_key_idx
  on public.timeline_text_manuscripts (community_id, manuscript_key);
create index if not exists timeline_text_manuscripts_work_idx
  on public.timeline_text_manuscripts (work_id);

-- ---------------------------------------------------------------------------
-- PASSAGES: the existing table, given a place in a work.
-- ---------------------------------------------------------------------------
alter table public.timeline_text_passages
  add column if not exists work_id uuid references public.timeline_text_works (id) on delete set null,
  add column if not exists version_id uuid references public.timeline_text_versions (id) on delete set null,
  add column if not exists parent_id uuid references public.timeline_text_passages (id) on delete set null,
  -- Permanent ID, e.g. 'egy.pt.utt.273'. Unique per community; null on the
  -- passages written before this archive existed.
  add column if not exists passage_key text,
  -- A TEXT_DIVISION_KINDS key: utterance, spell, chapter, hour, section…
  add column if not exists division_kind text,
  -- Reading order within the work. sort_order stays the order on the event.
  add column if not exists ordinal integer,
  add column if not exists summary text,
  -- A PASSAGE_VERIFICATION_STATUSES key.
  add column if not exists verification_status text not null default 'unverified',
  -- Hash of the imported content, so a re-import touches only what changed.
  add column if not exists content_hash text;

create unique index if not exists timeline_text_passages_key_idx
  on public.timeline_text_passages (community_id, passage_key);
create index if not exists timeline_text_passages_work_idx
  on public.timeline_text_passages (work_id, ordinal);
create index if not exists timeline_text_passages_parent_idx
  on public.timeline_text_passages (parent_id);

-- Layers written by an import carry a key so a re-import updates them in
-- place; layers a person wrote have none and are never touched by an import.
alter table public.timeline_text_layers
  add column if not exists import_key text,
  -- Licence of THIS rendering, e.g. 'public_domain', 'cc_by_sa', 'copyrighted_excerpt'.
  add column if not exists licence text;

create unique index if not exists timeline_text_layers_import_key_idx
  on public.timeline_text_layers (passage_id, import_key);

-- ---------------------------------------------------------------------------
-- WITNESSES: which manuscript carries which passage, and how it differs.
-- ---------------------------------------------------------------------------
create table if not exists public.timeline_passage_witnesses (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities (id) on delete cascade,
  created_by uuid not null references public.profiles (id) on delete cascade,
  passage_id uuid not null references public.timeline_text_passages (id) on delete cascade,
  manuscript_id uuid not null references public.timeline_text_manuscripts (id) on delete cascade,
  -- Where on the object: "burial chamber, west gable, cols. 1–12".
  locus text,
  variant_note text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create unique index if not exists timeline_passage_witnesses_pair_idx
  on public.timeline_passage_witnesses (passage_id, manuscript_id);
create index if not exists timeline_passage_witnesses_manuscript_idx
  on public.timeline_passage_witnesses (manuscript_id);

-- ---------------------------------------------------------------------------
-- PASSAGE DATES: only where a passage has a history of its own. Otherwise a
-- passage takes its dates from its work's timeline event and its witnesses.
-- ---------------------------------------------------------------------------
create table if not exists public.timeline_passage_dates (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities (id) on delete cascade,
  created_by uuid not null references public.profiles (id) on delete cascade,
  passage_id uuid not null references public.timeline_text_passages (id) on delete cascade,
  import_key text,
  -- A PASSAGE_DATE_ROLES key: event_described, claimed, composition,
  -- earliest_evidence, manuscript, translation_publication.
  date_role text not null,
  start_year double precision,
  end_year double precision,
  date_precision text not null,
  is_approximate boolean not null default true,
  original_date_text text not null,
  evidence text not null,
  source_id uuid references public.timeline_sources (id) on delete set null,
  created_at timestamptz not null default now(),

  constraint passage_date_range_ordered
    check (start_year is null or end_year is null or end_year >= start_year),
  constraint passage_date_no_confidence_score
    check (evidence !~* 'confidence (score|level|rating)')
);

create unique index if not exists timeline_passage_dates_import_key_idx
  on public.timeline_passage_dates (passage_id, import_key);

-- ---------------------------------------------------------------------------
-- IMAGES: several per passage or per manuscript, each checkable.
-- ---------------------------------------------------------------------------
create table if not exists public.timeline_passage_images (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities (id) on delete cascade,
  created_by uuid not null references public.profiles (id) on delete cascade,
  passage_id uuid references public.timeline_text_passages (id) on delete cascade,
  manuscript_id uuid references public.timeline_text_manuscripts (id) on delete cascade,
  work_id uuid references public.timeline_text_works (id) on delete cascade,
  import_key text not null,
  url text not null,
  -- The catalogue or file page — where the licence and the creator live.
  source_page_url text,
  institution text,
  accession_number text,
  object_date text,
  image_date text,
  caption text not null,
  creator text,
  credit text,
  licence text,
  -- A IMAGE_LICENCE_STATUSES key: open | attribution | share_alike |
  -- non_commercial | restricted | unknown.
  licence_status text not null default 'unknown',
  -- A MEDIA_KINDS key: what the picture is a picture OF.
  shows text not null,
  -- An IDENTIFICATION_STATUSES key. 'unverified' requires an UNVERIFIED — caption.
  identification_status text not null,
  what_is_unverified text,
  -- Has a person checked the image against the holding institution's record?
  verification_status text not null default 'unverified',
  duplicate_of text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),

  constraint passage_image_has_subject
    check (passage_id is not null or manuscript_id is not null or work_id is not null),
  constraint passage_image_unverified_says_so
    check (identification_status <> 'unverified' or caption like 'UNVERIFIED —%')
);

create unique index if not exists timeline_passage_images_key_idx
  on public.timeline_passage_images (community_id, import_key);
create index if not exists timeline_passage_images_passage_idx
  on public.timeline_passage_images (passage_id);
create index if not exists timeline_passage_images_manuscript_idx
  on public.timeline_passage_images (manuscript_id);
create index if not exists timeline_passage_images_work_idx
  on public.timeline_passage_images (work_id);

-- ---------------------------------------------------------------------------
-- CONNECTIONS: passage ↔ passage. Classified, argued, sourced. Never scored.
-- ---------------------------------------------------------------------------
create table if not exists public.timeline_passage_links (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities (id) on delete cascade,
  created_by uuid not null references public.profiles (id) on delete cascade,
  import_key text not null,
  from_passage_key text not null,
  to_passage_key text not null,
  -- A PASSAGE_CONNECTION_CLASSES key.
  connection_class text not null,
  -- The ten questions, each answered in words.
  similarities text not null,
  differences text not null,
  -- A COMPARABILITY key: yes | partly | no | unknown.
  wording_comparable text not null default 'unknown',
  meaning_comparable text not null default 'unknown',
  transmission_evidence text not null,
  earlier_note text,
  common_source_note text,
  contradiction_note text,
  scholarly_view text,
  alternative_view text,
  source_id uuid references public.timeline_sources (id) on delete set null,
  -- 'proposed' until a person has checked both passages and the argument.
  review_status text not null default 'proposed',
  created_at timestamptz not null default now(),

  constraint passage_link_not_self check (from_passage_key <> to_passage_key),
  constraint passage_link_no_confidence_score
    check (similarities !~* 'confidence (score|level|rating)'
       and transmission_evidence !~* 'confidence (score|level|rating)')
);

create unique index if not exists timeline_passage_links_key_idx
  on public.timeline_passage_links (community_id, import_key);
create index if not exists timeline_passage_links_from_idx
  on public.timeline_passage_links (community_id, from_passage_key);
create index if not exists timeline_passage_links_to_idx
  on public.timeline_passage_links (community_id, to_passage_key);

-- ---------------------------------------------------------------------------
-- THEMES: navigation aids.
-- ---------------------------------------------------------------------------
create table if not exists public.timeline_themes (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities (id) on delete cascade,
  created_by uuid not null references public.profiles (id) on delete cascade,
  theme_key text not null,
  label text not null,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create unique index if not exists timeline_themes_key_idx
  on public.timeline_themes (community_id, theme_key);

create table if not exists public.timeline_passage_themes (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities (id) on delete cascade,
  created_by uuid not null references public.profiles (id) on delete cascade,
  passage_id uuid not null references public.timeline_text_passages (id) on delete cascade,
  theme_id uuid not null references public.timeline_themes (id) on delete cascade,
  -- How this passage bears on the theme, in a sentence. Required: a theme tag
  -- with no reason is the start of a forced connection.
  note text not null,
  created_at timestamptz not null default now()
);

create unique index if not exists timeline_passage_themes_pair_idx
  on public.timeline_passage_themes (passage_id, theme_id);
create index if not exists timeline_passage_themes_theme_idx
  on public.timeline_passage_themes (theme_id);

-- ---------------------------------------------------------------------------
-- IMPORT RUNS: the log that makes an import repeatable and resumable.
-- ---------------------------------------------------------------------------
create table if not exists public.timeline_text_import_runs (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities (id) on delete cascade,
  created_by uuid not null references public.profiles (id) on delete cascade,
  work_key text not null,
  file_hash text not null,
  -- 'running' | 'completed' | 'failed'
  status text not null default 'running',
  -- Passages already written; a resumed run starts here.
  cursor integer not null default 0,
  total integer not null default 0,
  inserted integer not null default 0,
  updated integer not null default 0,
  unchanged integer not null default 0,
  rejected integer not null default 0,
  errors jsonb not null default '[]'::jsonb,
  started_at timestamptz not null default now(),
  finished_at timestamptz,

  constraint text_import_errors_array check (jsonb_typeof(errors) = 'array')
);

create index if not exists timeline_text_import_runs_work_idx
  on public.timeline_text_import_runs (community_id, work_key, started_at desc);

-- ---------------------------------------------------------------------------
-- RLS. One posture for every archive table: readable wherever the community's
-- timeline is readable; written by community staff, because the archive is a
-- curated import rather than a member contribution. (Passages and layers keep
-- their own, more open, policies from 20260916072636.)
-- ---------------------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array[
    'timeline_text_works',
    'timeline_text_versions',
    'timeline_text_manuscripts',
    'timeline_passage_witnesses',
    'timeline_passage_dates',
    'timeline_passage_images',
    'timeline_passage_links',
    'timeline_themes',
    'timeline_passage_themes',
    'timeline_text_import_runs'
  ]
  loop
    execute format('grant all on public.%I to anon, authenticated, service_role', t);
    execute format('alter table public.%I enable row level security', t);

    execute format('drop policy if exists %I on public.%I', t || '_select', t);
    execute format(
      'create policy %I on public.%I for select to authenticated using ('
      || 'public.is_community_member(community_id, auth.uid()) '
      || 'or public.is_community_guest_readable(community_id) '
      || 'or public.is_community_staff(community_id, auth.uid()))',
      t || '_select', t
    );

    execute format('drop policy if exists %I on public.%I', t || '_select_anon', t);
    execute format(
      'create policy %I on public.%I for select to anon using (public.is_community_guest_readable(community_id))',
      t || '_select_anon', t
    );

    execute format('drop policy if exists %I on public.%I', t || '_insert_staff', t);
    execute format(
      'create policy %I on public.%I for insert to authenticated with check ('
      || 'created_by = auth.uid() '
      || 'and public.community_has_timeline(community_id) '
      || 'and public.is_community_staff(community_id, auth.uid()))',
      t || '_insert_staff', t
    );

    execute format('drop policy if exists %I on public.%I', t || '_update_staff', t);
    execute format(
      'create policy %I on public.%I for update to authenticated '
      || 'using (public.is_community_staff(community_id, auth.uid())) '
      || 'with check (public.is_community_staff(community_id, auth.uid()))',
      t || '_update_staff', t
    );

    execute format('drop policy if exists %I on public.%I', t || '_delete_staff', t);
    execute format(
      'create policy %I on public.%I for delete to authenticated '
      || 'using (public.is_community_staff(community_id, auth.uid()))',
      t || '_delete_staff', t
    );
  end loop;
end
$$;
