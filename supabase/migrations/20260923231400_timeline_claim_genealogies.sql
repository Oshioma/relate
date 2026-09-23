-- =============================================================================
-- Relate — Timeline: CLAIM GENEALOGY, OR HOW A CLAIM GOT HERE
--
-- timeline_text_passages and timeline_text_layers run DOWNWARDS: from a
-- sentence on the timeline to the object underneath it. Object, text,
-- transcription, transliteration, translation, summary, interpretation.
--
-- This runs the other way. It follows a claim FORWARDS through the people who
-- repeated it, and asks at every step: what does THIS link actually say, and
-- what did it ADD that the link before it did not contain?
--
-- WHY IT IS NEEDED, and it is not a refinement of the other one.
--
-- Some claims cannot usefully be handled as true or false. "Horus was
-- crucified" is the standard case. A reader is normally offered a choice
-- between believing it and being told it was invented, and both answers throw
-- away what actually happened — which is that there is a real Egyptian object,
-- a real nineteenth-century writer who read it a particular way, a chain of
-- books that repeated him with the hedges falling off one at a time, and a
-- modern claim that no longer resembles the object at all.
--
-- That chain is more revealing than either verdict, and unlike either verdict
-- it is a thing a database can hold.
--
-- THE COLUMN THAT DOES THE MOST WORK IS `adds`.
--
-- Claims of this kind rarely arrive whole. They accumulate. One writer supplies
-- the object; the next supplies a reading of it; the next drops the word
-- "perhaps"; the one after that adds a detail nobody before them had. Recording
-- what each link CONTRIBUTED is what turns a bibliography into an explanation,
-- and it is the difference between "here are five books" and "here is where
-- this sentence came from".
--
-- AND THE SECOND IS `citation_status`.
--
-- A chain that ends in a source nobody can find is not a chain. Following a
-- citation backwards until it stops is the whole method, and when it stops the
-- schema has to be able to say so — loudly, once, at the link where it
-- happened, rather than leaving a reader to infer it from a gap. Everything
-- downstream of a broken link rests on that link, and therefore on nothing.
--
-- WHAT IS DELIBERATELY NOT HERE.
--
-- A boolean. The verdict vocabulary has six values and none of them is true or
-- false, because the interesting ones cannot be said with two. "Horus was born
-- of a virgin" is the example that forces the point: Egyptian tradition really
-- does contain an extraordinary conception — Isis conceives Horus from Osiris
-- after Osiris has been killed — and that is genuinely not a virginal
-- conception in the Christian sense. "A related ancient tradition exists" is
-- the true sentence, and a boolean destroys it in either direction.
--
-- Also not here: a confidence score, enforced below as everywhere else.
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- A GENEALOGY: one claim, and the route it took.
--
-- Attached to an event rather than standing alone, because a claim is always a
-- claim ABOUT something and the event is what it is about. An event may carry
-- several: the Horus material has four in circulation and they have different
-- chains, different verdicts and different first appearances.
-- ---------------------------------------------------------------------------
create table if not exists public.timeline_claim_genealogies (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.timeline_events (id) on delete cascade,
  -- Denormalised from the event so RLS never has to join to answer "is this
  -- mine to see", the same as every other table in this area.
  community_id uuid not null references public.communities (id) on delete cascade,
  created_by uuid not null references public.profiles (id) on delete cascade,

  -- THE CLAIM IN THE WORDS PEOPLE ACTUALLY USE, not a tidied academic version
  -- of it. A reader arrives having met the popular phrasing, and if they cannot
  -- find that phrasing here they will not recognise that this is about the
  -- thing they came to look up.
  claim text not null,

  -- A CLAIM_VERDICTS key in taxonomy.ts. Six values, never a boolean.
  verdict text not null,

  -- Why the verdict is that one, and — as important — what it does NOT say.
  -- "No primary evidence located" is a report on searching, not a disproof, and
  -- this is where that distinction gets made in words.
  verdict_evidence text not null,

  -- WHAT WOULD CHANGE THIS ASSESSMENT. Required, and not a formality: a
  -- verdict whose conditions for being overturned nobody can state is an
  -- opinion wearing a label.
  what_would_change_this text not null,

  notes text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),

  constraint claim_genealogy_no_confidence_score
    check (verdict_evidence !~* 'confidence (score|level|rating)')
);

-- ---------------------------------------------------------------------------
-- A LINK: one party, at one remove, saying one thing.
--
-- `says` is what THIS link states — not what it is reported to state by the
-- link after it. The gap between those two is the entire reason for tracing a
-- claim rather than accepting a bibliography, and a schema that cannot hold
-- both cannot show it.
-- ---------------------------------------------------------------------------
create table if not exists public.timeline_genealogy_links (
  id uuid primary key default gen_random_uuid(),
  genealogy_id uuid not null references public.timeline_claim_genealogies (id) on delete cascade,
  community_id uuid not null references public.communities (id) on delete cascade,
  created_by uuid not null references public.profiles (id) on delete cascade,

  -- The work, where this dataset has it as a source. Null where it does not —
  -- a film or a meme is a real link with no bibliographic record here.
  source_id uuid references public.timeline_sources (id) on delete set null,

  -- A GENEALOGY_STAGES key: how far from the evidence this link stands.
  -- Plain text, not an enum, like every vocabulary column in this schema.
  stage text not null,

  -- Who said it. A person, a book, a film.
  who text not null,

  -- When. Nullable: an ancient object has no publication year, and a stage can
  -- span decades.
  year integer,

  -- Volume, page, line, figure — whatever locates the statement so somebody
  -- else can open the same page.
  reference text,

  -- What this link says. NULLABLE, and the nullability matters more here than
  -- anywhere: the links most worth tracing are frequently the ones nobody has
  -- opened, and a row that admits that is worth far more than a row that
  -- repeats what the NEXT link claims it says.
  says text,
  says_absent_reason text,

  -- What this link ADDED that its predecessor did not contain. The column this
  -- table exists for.
  adds text,

  -- A CITATION_STATUSES key. 'broken' means the citation leads to a source that
  -- cannot be located, or to a passage that is not there — and that everything
  -- after it rests on nothing.
  citation_status text,

  notes text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),

  -- A link with no text must say why it has none, exactly as a text layer with
  -- no content must, and a measurement with no figure must.
  constraint genealogy_link_says_or_reason
    check (says is not null or says_absent_reason is not null)
);

create index if not exists timeline_claim_genealogies_event_id_idx
  on public.timeline_claim_genealogies (event_id);
create index if not exists timeline_genealogy_links_genealogy_id_idx
  on public.timeline_genealogy_links (genealogy_id);
create index if not exists timeline_genealogy_links_source_id_idx
  on public.timeline_genealogy_links (source_id);

grant all on public.timeline_claim_genealogies to anon, authenticated, service_role;
grant all on public.timeline_genealogy_links to anon, authenticated, service_role;

alter table public.timeline_claim_genealogies enable row level security;
alter table public.timeline_genealogy_links enable row level security;

-- Same posture as timeline_text_passages: readable with the event it belongs
-- to, writable by members of the community that owns it, deletable by staff.
-- Uses the repo's existing helpers rather than hand-rolled joins.

drop policy if exists "timeline_claim_genealogies_select" on public.timeline_claim_genealogies;
create policy "timeline_claim_genealogies_select" on public.timeline_claim_genealogies
  for select to authenticated
  using (
    exists (
      select 1 from public.timeline_events e
      where e.id = timeline_claim_genealogies.event_id
    )
  );

drop policy if exists "timeline_claim_genealogies_select_anon" on public.timeline_claim_genealogies;
create policy "timeline_claim_genealogies_select_anon" on public.timeline_claim_genealogies
  for select to anon
  using (
    exists (
      select 1 from public.timeline_events e
      where e.id = timeline_claim_genealogies.event_id
    )
  );

drop policy if exists "timeline_claim_genealogies_insert_member" on public.timeline_claim_genealogies;
create policy "timeline_claim_genealogies_insert_member" on public.timeline_claim_genealogies
  for insert to authenticated
  with check (
    exists (
      select 1 from public.timeline_events e
      where e.id = timeline_claim_genealogies.event_id
        and public.community_has_timeline(e.community_id)
        and public.is_community_member(e.community_id, auth.uid())
    )
  );

drop policy if exists "timeline_claim_genealogies_update_member" on public.timeline_claim_genealogies;
create policy "timeline_claim_genealogies_update_member" on public.timeline_claim_genealogies
  for update to authenticated
  using (
    exists (
      select 1 from public.timeline_events e
      where e.id = timeline_claim_genealogies.event_id
        and public.is_community_member(e.community_id, auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.timeline_events e
      where e.id = timeline_claim_genealogies.event_id
        and public.is_community_member(e.community_id, auth.uid())
    )
  );

drop policy if exists "timeline_claim_genealogies_delete_staff" on public.timeline_claim_genealogies;
create policy "timeline_claim_genealogies_delete_staff" on public.timeline_claim_genealogies
  for delete to authenticated
  using (
    exists (
      select 1 from public.timeline_events e
      where e.id = timeline_claim_genealogies.event_id
        and public.is_community_staff(e.community_id, auth.uid())
    )
  );

-- Links hang off a genealogy, so every policy reaches through it to the event.

drop policy if exists "timeline_genealogy_links_select" on public.timeline_genealogy_links;
create policy "timeline_genealogy_links_select" on public.timeline_genealogy_links
  for select to authenticated
  using (
    exists (
      select 1 from public.timeline_claim_genealogies g
      where g.id = timeline_genealogy_links.genealogy_id
    )
  );

drop policy if exists "timeline_genealogy_links_select_anon" on public.timeline_genealogy_links;
create policy "timeline_genealogy_links_select_anon" on public.timeline_genealogy_links
  for select to anon
  using (
    exists (
      select 1 from public.timeline_claim_genealogies g
      where g.id = timeline_genealogy_links.genealogy_id
    )
  );

drop policy if exists "timeline_genealogy_links_insert_member" on public.timeline_genealogy_links;
create policy "timeline_genealogy_links_insert_member" on public.timeline_genealogy_links
  for insert to authenticated
  with check (
    exists (
      select 1
      from public.timeline_claim_genealogies g
      join public.timeline_events e on e.id = g.event_id
      where g.id = timeline_genealogy_links.genealogy_id
        and public.community_has_timeline(e.community_id)
        and public.is_community_member(e.community_id, auth.uid())
    )
  );

drop policy if exists "timeline_genealogy_links_update_member" on public.timeline_genealogy_links;
create policy "timeline_genealogy_links_update_member" on public.timeline_genealogy_links
  for update to authenticated
  using (
    exists (
      select 1
      from public.timeline_claim_genealogies g
      join public.timeline_events e on e.id = g.event_id
      where g.id = timeline_genealogy_links.genealogy_id
        and public.is_community_member(e.community_id, auth.uid())
    )
  )
  with check (
    exists (
      select 1
      from public.timeline_claim_genealogies g
      join public.timeline_events e on e.id = g.event_id
      where g.id = timeline_genealogy_links.genealogy_id
        and public.is_community_member(e.community_id, auth.uid())
    )
  );

drop policy if exists "timeline_genealogy_links_delete_staff" on public.timeline_genealogy_links;
create policy "timeline_genealogy_links_delete_staff" on public.timeline_genealogy_links
  for delete to authenticated
  using (
    exists (
      select 1
      from public.timeline_claim_genealogies g
      join public.timeline_events e on e.id = g.event_id
      where g.id = timeline_genealogy_links.genealogy_id
        and public.is_community_staff(e.community_id, auth.uid())
    )
  );
