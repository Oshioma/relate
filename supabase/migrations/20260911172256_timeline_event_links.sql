-- =============================================================================
-- RELATIONSHIPS BETWEEN RECORDS — AND THEY ARE CLAIMS TOO
--
-- The timeline can already say "these two sources disagree about when this
-- happened". It could not say "these two records are about the same thing",
-- "this one answers that one", or "later writers treat these as identical" —
-- and on the Lemuria and Atlantis datasets that is most of what there is to
-- know. Mu and Lemuria have separate origins and were merged by other people.
-- Mauritia is geographically relevant to Sclater's hypothesis and is not
-- evidence for it. Plate tectonics answers the question Sclater asked. Every
-- one of those is a relationship, and none of them is a date.
--
-- THE DESIGN DECISION THIS TABLE TURNS ON: a relationship is not a fact about
-- the world, it is something somebody asserts — exactly like a date. "Mu is
-- Lemuria" is a claim made by particular writers at a particular time, and a
-- plain edge between two rows would state it as though the database knew.
--
-- So an edge carries what a date claim carries:
--
--   relation   — WHAT kind of connection. Free text, validated in the app
--                against EVENT_RELATIONS, for the same reason category and
--                chronology are: this vocabulary will grow, and a community
--                that needs a word we did not think of should keep it.
--                (timeline_period_links uses a closed check because it has
--                exactly two kinds and always will; this one is open.)
--   viewpoint  — WHOSE framework the relationship belongs to, drawn from the
--                same vocabulary as timeline_date_claims.chronology. Theosophy
--                puts Lemuria before Atlantis; so does Steiner; those are two
--                claims about ordering, not one, and the brief that prompted
--                this asked specifically that they be stored separately.
--   source_id  — who says so, where that is a particular publication.
--   note       — why, in a sentence, in the same voice as "why this date?".
--
-- WHAT IS DELIBERATELY ABSENT: an "is the same as" relation that merges two
-- records. Nothing here collapses rows. Two records asserted to be identical
-- stay two records with an edge between them saying who asserted it, because
-- the assertion is the interesting part and merging would destroy it.
--
-- DIRECTED, AND READ FROM BOTH ENDS. An edge is stored once, from → to, and
-- the UI inverts the wording when showing it on the other record: "precedes"
-- becomes "follows". Storing both directions would mean two rows that could
-- disagree.
--
-- Additive. Nothing existing is altered.
-- =============================================================================

create table if not exists public.timeline_event_links (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities (id) on delete cascade,
  created_by uuid not null references public.profiles (id) on delete cascade,

  from_event_id uuid not null references public.timeline_events (id) on delete cascade,
  to_event_id uuid not null references public.timeline_events (id) on delete cascade,

  -- A key from EVENT_RELATIONS in src/lib/timeline/taxonomy.ts.
  relation text not null,
  -- A key from CLAIM_VIEWPOINTS — whose framework this relationship is part of.
  -- Null where the relationship is not anybody's in particular.
  viewpoint text,
  -- The source that ASSERTS the relationship, where one does.
  source_id uuid references public.timeline_sources (id) on delete set null,
  -- Why, in a sentence. Never a rating.
  note text not null default '',
  sort_order integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- A record cannot be related to itself.
  constraint timeline_event_links_not_self check (from_event_id <> to_event_id)
);

comment on table public.timeline_event_links is
  'Asserted relationships between timeline records — "later writers treat these as the same", "this answers that", "this precedes that in this tradition". Carries a source and a viewpoint because a relationship is a claim somebody makes, not a fact the database knows.';

comment on column public.timeline_event_links.viewpoint is
  'Whose framework this relationship belongs to, from the same vocabulary as timeline_date_claims.chronology. Two traditions asserting the same ordering are two rows, not one.';

drop trigger if exists set_updated_at on public.timeline_event_links;
create trigger set_updated_at before update on public.timeline_event_links
  for each row execute function public.set_updated_at();

-- One edge per (pair, kind, viewpoint). An expression index rather than a table
-- constraint because null viewpoints must not defeat uniqueness: in SQL two
-- nulls are not equal, so "Lemuria precedes Atlantis, no viewpoint" could
-- otherwise be inserted any number of times.
create unique index if not exists idx_timeline_event_links_unique
  on public.timeline_event_links (from_event_id, to_event_id, relation, coalesce(viewpoint, ''));

-- Read from either end: an edge shows on both records it joins.
create index if not exists idx_timeline_event_links_from
  on public.timeline_event_links (from_event_id);
create index if not exists idx_timeline_event_links_to
  on public.timeline_event_links (to_event_id);
create index if not exists idx_timeline_event_links_community
  on public.timeline_event_links (community_id);

-- ---------------------------------------------------------------------------
-- Both ends must belong to the community the row claims to be in
--
-- The foreign keys check that the rows exist, not whose they are — the same
-- hole timeline_claim_sources had, closed the same way. Nothing leaks today
-- because every read is community-filtered, but a column that can hold another
-- community's id is a leak waiting for the first query written without the
-- filter.
-- ---------------------------------------------------------------------------

create or replace function public.timeline_event_link_same_community()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.timeline_events e
    where e.id = new.from_event_id and e.community_id = new.community_id
  ) then
    raise exception 'That record belongs to a different community'
      using errcode = 'check_violation';
  end if;

  if not exists (
    select 1 from public.timeline_events e
    where e.id = new.to_event_id and e.community_id = new.community_id
  ) then
    raise exception 'That record belongs to a different community'
      using errcode = 'check_violation';
  end if;

  if new.source_id is not null and not exists (
    select 1 from public.timeline_sources s
    where s.id = new.source_id and s.community_id = new.community_id
  ) then
    raise exception 'That source belongs to a different community'
      using errcode = 'check_violation';
  end if;

  return new;
end;
$$;

drop trigger if exists timeline_event_links_same_community on public.timeline_event_links;
create trigger timeline_event_links_same_community
  before insert or update of from_event_id, to_event_id, source_id, community_id
  on public.timeline_event_links
  for each row
  execute function public.timeline_event_link_same_community();

-- ---------------------------------------------------------------------------
-- Grants and RLS
--
-- Supabase's default privileges would normally cover the grant, but the periods
-- migration learned the hard way that a table referenced from a policy must be
-- granted explicitly or the reads that touch it fail outright. Stated here so it
-- holds wherever this runs.
--
-- The policies mirror timeline_claim_sources: an edge is part of the records it
-- joins, so anyone who can read them can read it, any member may add one, and
-- its author or staff may change it.
-- ---------------------------------------------------------------------------

grant all on public.timeline_event_links to anon, authenticated, service_role;

alter table public.timeline_event_links enable row level security;

drop policy if exists "timeline_event_links_select" on public.timeline_event_links;
create policy "timeline_event_links_select" on public.timeline_event_links
  for select to authenticated
  using (
    exists (
      select 1 from public.timeline_events e
      where e.id = timeline_event_links.from_event_id
    )
  );

drop policy if exists "timeline_event_links_select_anon" on public.timeline_event_links;
create policy "timeline_event_links_select_anon" on public.timeline_event_links
  for select to anon
  using (
    exists (
      select 1 from public.timeline_events e
      where e.id = timeline_event_links.from_event_id
    )
  );

drop policy if exists "timeline_event_links_insert_member" on public.timeline_event_links;
create policy "timeline_event_links_insert_member" on public.timeline_event_links
  for insert to authenticated
  with check (
    created_by = auth.uid()
    and public.community_has_timeline(community_id)
    and public.is_community_member(community_id, auth.uid())
  );

drop policy if exists "timeline_event_links_update_author_or_staff" on public.timeline_event_links;
create policy "timeline_event_links_update_author_or_staff" on public.timeline_event_links
  for update to authenticated
  using (created_by = auth.uid() or public.is_community_staff(community_id, auth.uid()))
  with check (created_by = auth.uid() or public.is_community_staff(community_id, auth.uid()));

drop policy if exists "timeline_event_links_delete_author_or_staff" on public.timeline_event_links;
create policy "timeline_event_links_delete_author_or_staff" on public.timeline_event_links
  for delete to authenticated
  using (created_by = auth.uid() or public.is_community_staff(community_id, auth.uid()));
