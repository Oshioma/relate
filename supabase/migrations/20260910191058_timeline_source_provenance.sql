-- =============================================================================
-- Relate — Timeline: where a source came from, and what it cites
--
-- Three additions, all in service of one question a learner should be able to
-- ask of anything on the timeline: HOW FAR IS THIS FROM THE EVIDENCE?
--
--   1. accessed_on — when somebody looked at it. A web page is not a fixed
--      object: a Wikipedia article cited today says something different from
--      the one cited last year, and a citation without an access date cannot
--      be checked. Every citation style in the world asks for this; the
--      product asked for none of it.
--
--   2. quotation — the passage the claim actually rests on, in the source's own
--      words. "The report says c. 2560 BCE" is an assertion; the sentence that
--      says it is evidence. Bounded at 5,000 words, which holds a whole shared
--      conversation and still stops short of "paste the chapter".
--
--   3. cited_by_source_id — the citation CHAIN. Wikipedia cites an academic
--      book, which references an excavation report. Following that chain is the
--      single most useful research habit this product can teach, and it needs
--      one column to record it.
--
-- WHY A SELF-REFERENCE RATHER THAN A JOIN TABLE. The relationship being
-- recorded is "I found this source through that one" — one route, the one the
-- learner actually took. A source reachable by two routes is a real thing and a
-- rare one, and modelling it would cost a table, its RLS and its own UI to buy
-- an edge case nobody has asked for. If that changes, this column becomes the
-- join table's first row.
--
-- Nothing here is required, and nothing already stored changes meaning.
--
-- Safe to re-run.
-- =============================================================================

alter table public.timeline_sources
  add column if not exists accessed_on date,
  add column if not exists quotation text,
  -- The source that cites THIS one: the academic book's cited_by points at the
  -- Wikipedia article somebody found it through. Reads down the chain the same
  -- way the UI draws it.
  --
  -- ON DELETE SET NULL, not cascade: deleting the Wikipedia article must not
  -- delete the excavation report somebody found through it. The chain breaks;
  -- the sources survive, because they are the community's, not the chain's.
  add column if not exists cited_by_source_id uuid references public.timeline_sources (id) on delete set null;

comment on column public.timeline_sources.accessed_on is
  'When somebody last looked at this source. Matters most for web pages, which change under a citation that has no access date.';

comment on column public.timeline_sources.quotation is
  'The passage the claim rests on, in the source''s own words — up to 5,000 words, enforced in the application. An extract, not a copy.';

comment on column public.timeline_sources.cited_by_source_id is
  'The source that cites this one — the route the contributor took to find it. Wikipedia → academic book → excavation report. Null for a source found directly.';

-- HOW LONG A QUOTATION MAY BE.
--
-- The limit a person meets is 5,000 WORDS, enforced in the application, because
-- words are the unit somebody pasting a shared conversation is thinking in and
-- a whole conversation is worth keeping whole.
--
-- This constraint is not that limit. It is the backstop for the one case a word
-- count cannot catch: a pasted megabyte of base64 arriving as a single
-- unbroken "word".
--
-- Twenty characters a word looks absurdly generous until you write the test.
-- Five thousand repetitions of "conversation" is sixty-five thousand
-- characters, and a twelve-a-word ceiling refused it — so a ceiling that close
-- to the average would have rejected a legitimate extract, which is exactly
-- what a backstop must never do. A blob is still refused by a factor of fifty.
--
-- Enforcing the word count here instead would mean splitting the string on
-- every write to buy nothing the application has not already refused.
alter table public.timeline_sources
  drop constraint if exists timeline_sources_quotation_length;
alter table public.timeline_sources
  add constraint timeline_sources_quotation_length
  check (quotation is null or length(quotation) <= 100000);

-- A source cannot cite itself. Longer cycles are still possible in principle
-- and are left to the application, which walks the chain with a depth cap —
-- enforcing acyclicity properly needs a recursive trigger on every write, which
-- is a lot of machinery for a mistake nobody has made yet.
alter table public.timeline_sources
  drop constraint if exists timeline_sources_no_self_citation;
alter table public.timeline_sources
  add constraint timeline_sources_no_self_citation
  check (cited_by_source_id is null or cited_by_source_id <> id);

-- "What did this article lead people to?" — the query the chain view runs.
create index if not exists idx_timeline_sources_cited_by
  on public.timeline_sources (cited_by_source_id)
  where cited_by_source_id is not null;

-- ---------------------------------------------------------------------------
-- A chain never crosses a community boundary.
--
-- The foreign key alone is happy with `cited_by_source_id` pointing at another
-- community's source: it checks that the id EXISTS, not whose it is. Nothing
-- would leak today — every read of the chain is already filtered by
-- community_id, so the foreign row simply wouldn't come back — but a column
-- that can hold another community's id is a leak waiting for the first query
-- somebody writes without the filter, and this feature's one non-negotiable
-- rule is that a community's records stay its own.
--
-- SECURITY DEFINER so the check sees the row it is checking. A member CAN see
-- every source in their own community, so the honest case passes either way;
-- what this buys is that a cross-community pointer fails with a sentence about
-- communities rather than one about a row that "doesn't exist".
-- ---------------------------------------------------------------------------

create or replace function public.timeline_source_citation_same_community()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.cited_by_source_id is not null and not exists (
    select 1
    from public.timeline_sources s
    where s.id = new.cited_by_source_id
      and s.community_id = new.community_id
  ) then
    raise exception 'A source can only cite another source in the same community'
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

drop trigger if exists timeline_sources_citation_same_community on public.timeline_sources;
create trigger timeline_sources_citation_same_community
  before insert or update of cited_by_source_id, community_id
  on public.timeline_sources
  for each row
  execute function public.timeline_source_citation_same_community();
