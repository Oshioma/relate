-- =============================================================================
-- Relate — Crop Guides: community medicinal-use log
--
-- Safe to re-run.
--
-- A member-authored, staff-moderated log of what a crop is traditionally used
-- for medicinally — keyed by ailment so the library can be searched by ailment
-- ("what helps a cough?"). Community-scoped and moderated exactly like
-- crop_community_tips: members submit, staff approve, everyone sees approved
-- entries (authors/staff also see their own pending ones).
--
-- This is community-shared traditional knowledge, not medical advice — the UI
-- surfaces a disclaimer accordingly.
-- =============================================================================

create table if not exists public.crop_medicinal_uses (
  id uuid primary key default gen_random_uuid(),
  crop_id uuid not null references public.crops (id) on delete cascade,
  community_id uuid not null references public.communities (id) on delete cascade,
  created_by uuid not null references public.profiles (id) on delete cascade,
  ailment text not null,             -- what it's used for, e.g. "cough", "digestion"
  part_used text,                    -- leaf, root, flower, seed, bark…
  preparation text,                  -- tea, tincture, poultice, raw…
  description text,                  -- how it's used / notes
  approved boolean not null default false,   -- staff-only, enforced by trigger
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.crop_medicinal_uses;
create trigger set_updated_at before update on public.crop_medicinal_uses
  for each row execute function public.set_updated_at();

create index if not exists idx_crop_medicinal_crop_community on public.crop_medicinal_uses (crop_id, community_id);
-- Case-insensitive ailment search (search-by-ailment) benefits from this.
create index if not exists idx_crop_medicinal_ailment on public.crop_medicinal_uses (community_id, lower(ailment));

-- `approved` may only be set/kept true by community staff (mirrors
-- enforce_crop_tip_privileged_fields): members submit, moderators publish.
create or replace function public.enforce_crop_medicinal_privileged_fields()
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

drop trigger if exists enforce_crop_medicinal_privileged_fields on public.crop_medicinal_uses;
create trigger enforce_crop_medicinal_privileged_fields before insert or update on public.crop_medicinal_uses
  for each row execute function public.enforce_crop_medicinal_privileged_fields();

alter table public.crop_medicinal_uses enable row level security;

-- Members see approved entries; authors and staff also see pending ones.
drop policy if exists "crop_medicinal_select" on public.crop_medicinal_uses;
create policy "crop_medicinal_select" on public.crop_medicinal_uses
  for select to authenticated
  using (
    public.is_community_member(community_id, auth.uid())
    and (approved or created_by = auth.uid() or public.is_community_staff(community_id, auth.uid()))
  );

drop policy if exists "crop_medicinal_insert_self" on public.crop_medicinal_uses;
create policy "crop_medicinal_insert_self" on public.crop_medicinal_uses
  for insert to authenticated
  with check (created_by = auth.uid() and public.is_community_member(community_id, auth.uid()));

drop policy if exists "crop_medicinal_update_author_or_staff" on public.crop_medicinal_uses;
create policy "crop_medicinal_update_author_or_staff" on public.crop_medicinal_uses
  for update to authenticated
  using (created_by = auth.uid() or public.is_community_staff(community_id, auth.uid()))
  with check (created_by = auth.uid() or public.is_community_staff(community_id, auth.uid()));

drop policy if exists "crop_medicinal_delete_author_or_staff" on public.crop_medicinal_uses;
create policy "crop_medicinal_delete_author_or_staff" on public.crop_medicinal_uses
  for delete to authenticated
  using (created_by = auth.uid() or public.is_community_staff(community_id, auth.uid()));
