-- =============================================================================
-- Relate — Crop Guides: community propose-a-crop flow
--
-- Safe to re-run.
--
-- The global `crops` library is curated (super-admin write). This lets members
-- CONTRIBUTE to it: a member submits a crop_proposal in their community; a
-- community staff member reviews it and, on approval, it's promoted into the
-- global crops table as a published crop. Same moderation muscle as tips/journals.
--
-- Promotion needs to write the global crops table, which members/staff can't do
-- directly (crops RLS is super-admin only), so approval goes through the
-- SECURITY DEFINER function approve_crop_proposal(): it verifies the caller is
-- community staff, then inserts the crop and links it back to the proposal. A
-- trigger blocks any attempt to mark a proposal 'approved' by hand (without a
-- crop), so the only path to approval is the function.
-- =============================================================================

create table if not exists public.crop_proposals (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities (id) on delete cascade,
  created_by uuid not null references public.profiles (id) on delete cascade,

  common_name text not null,
  scientific_name text,
  family text,
  category text not null default 'vegetable',
  difficulty text,
  lifecycle text,
  overview text,
  preferred_climate text,
  sun text,
  water_need text,
  edible_part text,
  time_to_maturity_days integer,
  beginner_friendly boolean not null default false,
  pollinator_friendly boolean not null default false,
  nitrogen_fixer boolean not null default false,
  drought_tolerant boolean not null default false,
  organic_favourite boolean not null default false,

  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewer_note text,
  crop_id uuid references public.crops (id) on delete set null,   -- set on approval

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.crop_proposals;
create trigger set_updated_at before update on public.crop_proposals
  for each row execute function public.set_updated_at();

create index if not exists idx_crop_proposals_community on public.crop_proposals (community_id, status);

-- Block hand-setting status to 'approved' — only approve_crop_proposal() does
-- that, and it always sets crop_id at the same time.
create or replace function public.enforce_crop_proposal_approval()
returns trigger as $$
begin
  if new.status = 'approved' and new.crop_id is null then
    raise exception 'A proposal can only be approved through approve_crop_proposal()';
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists enforce_crop_proposal_approval on public.crop_proposals;
create trigger enforce_crop_proposal_approval before insert or update on public.crop_proposals
  for each row execute function public.enforce_crop_proposal_approval();

alter table public.crop_proposals enable row level security;

-- Any member of the community can see its proposals (a shared proposal board;
-- helps avoid duplicates and lets people follow status).
drop policy if exists "crop_proposals_select" on public.crop_proposals;
create policy "crop_proposals_select" on public.crop_proposals
  for select to authenticated
  using (public.is_community_member(community_id, auth.uid()));

drop policy if exists "crop_proposals_insert_self" on public.crop_proposals;
create policy "crop_proposals_insert_self" on public.crop_proposals
  for insert to authenticated
  with check (created_by = auth.uid() and public.is_community_member(community_id, auth.uid()));

-- Authors may edit their own still-pending proposal; staff may review (set
-- rejected, add a note). Approval is via the function, not a direct update.
drop policy if exists "crop_proposals_update_author_or_staff" on public.crop_proposals;
create policy "crop_proposals_update_author_or_staff" on public.crop_proposals
  for update to authenticated
  using (
    (created_by = auth.uid() and status = 'pending')
    or public.is_community_staff(community_id, auth.uid())
  )
  with check (
    (created_by = auth.uid() and status = 'pending')
    or public.is_community_staff(community_id, auth.uid())
  );

drop policy if exists "crop_proposals_delete_author_or_staff" on public.crop_proposals;
create policy "crop_proposals_delete_author_or_staff" on public.crop_proposals
  for delete to authenticated
  using (created_by = auth.uid() or public.is_community_staff(community_id, auth.uid()));

-- -----------------------------------------------------------------------------
-- approve_crop_proposal: staff-only promotion of a proposal into the global
-- crops library. Runs as definer so it can write crops (which RLS otherwise
-- limits to super admins) after checking the caller is community staff.
-- -----------------------------------------------------------------------------
create or replace function public.approve_crop_proposal(p_proposal_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  p public.crop_proposals%rowtype;
  v_slug text;
  v_crop_id uuid;
begin
  select * into p from public.crop_proposals where id = p_proposal_id;
  if not found then
    raise exception 'Proposal not found';
  end if;
  if not public.is_community_staff(p.community_id, auth.uid()) then
    raise exception 'Not allowed';
  end if;
  if p.crop_id is not null then
    return p.crop_id;   -- already approved
  end if;

  -- Build a URL-safe, unique slug from the common name.
  v_slug := trim(both '-' from lower(regexp_replace(coalesce(p.common_name, ''), '[^a-zA-Z0-9]+', '-', 'g')));
  if v_slug = '' then
    v_slug := 'crop';
  end if;
  if exists (select 1 from public.crops where slug = v_slug) then
    v_slug := v_slug || '-' || substr(replace(p_proposal_id::text, '-', ''), 1, 6);
  end if;

  insert into public.crops (
    slug, common_name, scientific_name, family, category, difficulty, lifecycle,
    overview, preferred_climate, sun, water_need, edible_part, time_to_maturity_days,
    beginner_friendly, pollinator_friendly, nitrogen_fixer, drought_tolerant,
    organic_favourite, status, created_by
  ) values (
    v_slug, p.common_name, p.scientific_name, p.family, p.category, p.difficulty, p.lifecycle,
    p.overview, p.preferred_climate, p.sun, p.water_need, p.edible_part, p.time_to_maturity_days,
    p.beginner_friendly, p.pollinator_friendly, p.nitrogen_fixer, p.drought_tolerant,
    p.organic_favourite, 'published', p.created_by
  )
  returning id into v_crop_id;

  update public.crop_proposals
    set status = 'approved', crop_id = v_crop_id, updated_at = now()
    where id = p_proposal_id;

  return v_crop_id;
end;
$$;

grant execute on function public.approve_crop_proposal(uuid) to authenticated;
