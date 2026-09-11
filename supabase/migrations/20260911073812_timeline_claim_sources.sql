-- =============================================================================
-- Relate — Timeline: more than one source on a date claim
--
-- A claim has always had a single source_id: the work that ASSERTS the date.
-- That was right and it stays. What it could not express is everything else a
-- reader needs in order to weigh the claim —
--
--   · the further evidence that supports it,
--   · the published criticism that disputes it,
--   · the context that explains where it came from.
--
-- Those were going into prose, which means they could not be linked, counted,
-- followed, or reused across claims. A timeline built to teach people to check
-- sources should be able to hold the source that disagrees.
--
-- SO: source_id keeps its job, and this table holds the rest. Additive on
-- purpose. Every existing query, filter and count still reads source_id and
-- still means exactly what it meant before.
--
-- WHY A `relation` AND NOT JUST A LIST. "Supports" and "disputes" are different
-- facts, and a reader who cannot tell them apart is worse off than one with no
-- list at all — a critique sitting silently in a row of citations reads as
-- corroboration. Naming the relationship is the whole value of the table.
--
-- Safe to re-run.
-- =============================================================================

create table if not exists public.timeline_claim_sources (
  id uuid primary key default gen_random_uuid(),

  claim_id uuid not null references public.timeline_date_claims (id) on delete cascade,
  source_id uuid not null references public.timeline_sources (id) on delete cascade,

  -- Denormalised from the claim so RLS can answer without a join, the same way
  -- every other table in this feature carries it.
  community_id uuid not null references public.communities (id) on delete cascade,
  created_by uuid not null references public.profiles (id) on delete cascade,

  -- What this source DOES to the claim. Not a score, and never rendered as
  -- one: "disputes" says a published work argues against this date, not that
  -- the date is wrong.
  relation text not null default 'supports'
    check (relation in ('supports', 'disputes', 'context')),

  -- Why this source is attached to THIS claim. The field that stops a citation
  -- list becoming a pile of titles nobody can act on.
  note text check (note is null or length(note) <= 2000),

  sort_order integer not null default 0,

  created_at timestamptz not null default now()
);

-- One row per source per claim. Attaching the same work twice is always a
-- mistake rather than an intent, and the relationship is a property of the
-- pairing, not something a source can hold two of at once.
create unique index if not exists idx_timeline_claim_sources_unique
  on public.timeline_claim_sources (claim_id, source_id);

create index if not exists idx_timeline_claim_sources_claim
  on public.timeline_claim_sources (claim_id, sort_order);

create index if not exists idx_timeline_claim_sources_source
  on public.timeline_claim_sources (source_id);

comment on table public.timeline_claim_sources is
  'Further sources on a date claim beyond the one that asserts it — supporting evidence, published criticism, and context. The asserting source stays on timeline_date_claims.source_id.';
comment on column public.timeline_claim_sources.relation is
  'supports | disputes | context. A fact about what the source does, never a rating of the claim.';

-- A source and a claim must belong to the same community. The foreign keys
-- check only that the rows exist, not whose they are — the same hole the
-- citation chain had, and closed the same way. Nothing leaks today because
-- every read is community-filtered, but a column that can hold another
-- community's id is a leak waiting for the first query written without the
-- filter.
create or replace function public.timeline_claim_source_same_community()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.timeline_date_claims c
    where c.id = new.claim_id and c.community_id = new.community_id
  ) then
    raise exception 'That date claim belongs to a different community'
      using errcode = 'check_violation';
  end if;

  if not exists (
    select 1 from public.timeline_sources s
    where s.id = new.source_id and s.community_id = new.community_id
  ) then
    raise exception 'That source belongs to a different community'
      using errcode = 'check_violation';
  end if;

  return new;
end;
$$;

drop trigger if exists timeline_claim_sources_same_community on public.timeline_claim_sources;
create trigger timeline_claim_sources_same_community
  before insert or update of claim_id, source_id, community_id
  on public.timeline_claim_sources
  for each row
  execute function public.timeline_claim_source_same_community();

-- ---------------------------------------------------------------------------
-- RLS — mirrors timeline_date_claims exactly, because these rows are part of
-- the claim. Anyone who can read the claim can read what it cites; the claim's
-- author and staff can change it.
-- ---------------------------------------------------------------------------

alter table public.timeline_claim_sources enable row level security;

drop policy if exists "timeline_claim_sources_select" on public.timeline_claim_sources;
create policy "timeline_claim_sources_select" on public.timeline_claim_sources
  for select to authenticated
  using (
    exists (
      select 1 from public.timeline_date_claims c
      where c.id = timeline_claim_sources.claim_id
    )
  );

drop policy if exists "timeline_claim_sources_select_anon" on public.timeline_claim_sources;
create policy "timeline_claim_sources_select_anon" on public.timeline_claim_sources
  for select to anon
  using (
    exists (
      select 1 from public.timeline_date_claims c
      where c.id = timeline_claim_sources.claim_id
    )
  );

drop policy if exists "timeline_claim_sources_insert_member" on public.timeline_claim_sources;
create policy "timeline_claim_sources_insert_member" on public.timeline_claim_sources
  for insert to authenticated
  with check (
    created_by = auth.uid()
    and public.community_has_timeline(community_id)
    and public.is_community_member(community_id, auth.uid())
  );

drop policy if exists "timeline_claim_sources_update_author_or_staff" on public.timeline_claim_sources;
create policy "timeline_claim_sources_update_author_or_staff" on public.timeline_claim_sources
  for update to authenticated
  using (created_by = auth.uid() or public.is_community_staff(community_id, auth.uid()))
  with check (created_by = auth.uid() or public.is_community_staff(community_id, auth.uid()));

drop policy if exists "timeline_claim_sources_delete_author_or_staff" on public.timeline_claim_sources;
create policy "timeline_claim_sources_delete_author_or_staff" on public.timeline_claim_sources
  for delete to authenticated
  using (created_by = auth.uid() or public.is_community_staff(community_id, auth.uid()));
