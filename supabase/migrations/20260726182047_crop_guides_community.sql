-- =============================================================================
-- Relate — Crop Guides, Phase 4: community power
--
-- Safe to re-run. Three community-scoped layers on top of the global crop
-- library:
--
--   * crop_growing_journals — structured "I grew this" records (§19). Field
--     shapes deliberately mirror the shamba.online farm app (planted_on,
--     harvested_on, yield_kg, variety, problems, solutions, weather,
--     success_rating, photos) so a future import from that app is a field-map,
--     not a redesign. Aggregated on the crop page into grower count, average
--     yield, average days to harvest and highest-rated variety.
--   * crop_community_tips — regional/local growing tips (§22), member-authored
--     and staff-moderated (an `approved` flag locked to staff by a trigger,
--     mirroring enforce_guide_privileged_fields).
--   * crop_saves — a member's saved crops (one row per user+crop).
--
-- All three are community-scoped and use the standard is_community_member /
-- is_community_staff helpers. crops itself stays global; these reference it.
-- =============================================================================

-- crop_growing_journals -------------------------------------------------------
create table if not exists public.crop_growing_journals (
  id uuid primary key default gen_random_uuid(),
  crop_id uuid not null references public.crops (id) on delete cascade,
  community_id uuid not null references public.communities (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  variety text,
  planted_on date,
  harvested_on date,
  climate text,
  location text,
  yield_kg numeric(10, 2),
  problems text,
  solutions text,
  weather text,
  success_rating smallint check (success_rating between 1 and 5),
  photos text[] not null default '{}',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.crop_growing_journals;
create trigger set_updated_at before update on public.crop_growing_journals
  for each row execute function public.set_updated_at();

create index if not exists idx_crop_journals_crop_community on public.crop_growing_journals (crop_id, community_id);
create index if not exists idx_crop_journals_user on public.crop_growing_journals (user_id);

alter table public.crop_growing_journals enable row level security;

-- Growing journals are community knowledge: any member of the community can read
-- them (they power the aggregate stats and the entries list on the crop page).
drop policy if exists "crop_journals_select" on public.crop_growing_journals;
create policy "crop_journals_select" on public.crop_growing_journals
  for select to authenticated
  using (public.is_community_member(community_id, auth.uid()));

drop policy if exists "crop_journals_insert_self" on public.crop_growing_journals;
create policy "crop_journals_insert_self" on public.crop_growing_journals
  for insert to authenticated
  with check (user_id = auth.uid() and public.is_community_member(community_id, auth.uid()));

drop policy if exists "crop_journals_update_author" on public.crop_growing_journals;
create policy "crop_journals_update_author" on public.crop_growing_journals
  for update to authenticated
  using (user_id = auth.uid() or public.is_community_staff(community_id, auth.uid()))
  with check (user_id = auth.uid() or public.is_community_staff(community_id, auth.uid()));

drop policy if exists "crop_journals_delete_author_or_staff" on public.crop_growing_journals;
create policy "crop_journals_delete_author_or_staff" on public.crop_growing_journals
  for delete to authenticated
  using (user_id = auth.uid() or public.is_community_staff(community_id, auth.uid()));

-- crop_community_tips ---------------------------------------------------------
create table if not exists public.crop_community_tips (
  id uuid primary key default gen_random_uuid(),
  crop_id uuid not null references public.crops (id) on delete cascade,
  community_id uuid not null references public.communities (id) on delete cascade,
  created_by uuid not null references public.profiles (id) on delete cascade,
  region text,
  body text not null,
  approved boolean not null default false,   -- staff-only, enforced by trigger
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.crop_community_tips;
create trigger set_updated_at before update on public.crop_community_tips
  for each row execute function public.set_updated_at();

create index if not exists idx_crop_tips_crop_community on public.crop_community_tips (crop_id, community_id);

-- `approved` may only be set/kept true by community staff. On insert or update
-- by a non-staff member it is forced to false, so members can submit tips but
-- only moderators can publish them. Mirrors enforce_guide_privileged_fields.
create or replace function public.enforce_crop_tip_privileged_fields()
returns trigger as $$
begin
  if not public.is_community_staff(new.community_id, auth.uid()) then
    if tg_op = 'INSERT' then
      new.approved := false;
    else
      new.approved := old.approved;
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists enforce_crop_tip_privileged_fields on public.crop_community_tips;
create trigger enforce_crop_tip_privileged_fields before insert or update on public.crop_community_tips
  for each row execute function public.enforce_crop_tip_privileged_fields();

alter table public.crop_community_tips enable row level security;

-- Members see approved tips; authors and staff also see pending (unapproved) ones.
drop policy if exists "crop_tips_select" on public.crop_community_tips;
create policy "crop_tips_select" on public.crop_community_tips
  for select to authenticated
  using (
    public.is_community_member(community_id, auth.uid())
    and (approved or created_by = auth.uid() or public.is_community_staff(community_id, auth.uid()))
  );

drop policy if exists "crop_tips_insert_self" on public.crop_community_tips;
create policy "crop_tips_insert_self" on public.crop_community_tips
  for insert to authenticated
  with check (created_by = auth.uid() and public.is_community_member(community_id, auth.uid()));

drop policy if exists "crop_tips_update_author_or_staff" on public.crop_community_tips;
create policy "crop_tips_update_author_or_staff" on public.crop_community_tips
  for update to authenticated
  using (created_by = auth.uid() or public.is_community_staff(community_id, auth.uid()))
  with check (created_by = auth.uid() or public.is_community_staff(community_id, auth.uid()));

drop policy if exists "crop_tips_delete_author_or_staff" on public.crop_community_tips;
create policy "crop_tips_delete_author_or_staff" on public.crop_community_tips
  for delete to authenticated
  using (created_by = auth.uid() or public.is_community_staff(community_id, auth.uid()));

-- crop_saves ------------------------------------------------------------------
create table if not exists public.crop_saves (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  crop_id uuid not null references public.crops (id) on delete cascade,
  community_id uuid references public.communities (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (user_id, crop_id)
);

create index if not exists idx_crop_saves_user on public.crop_saves (user_id);

alter table public.crop_saves enable row level security;

-- A member manages only their own saves.
drop policy if exists "crop_saves_select_self" on public.crop_saves;
create policy "crop_saves_select_self" on public.crop_saves
  for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "crop_saves_insert_self" on public.crop_saves;
create policy "crop_saves_insert_self" on public.crop_saves
  for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists "crop_saves_delete_self" on public.crop_saves;
create policy "crop_saves_delete_self" on public.crop_saves
  for delete to authenticated
  using (user_id = auth.uid());
