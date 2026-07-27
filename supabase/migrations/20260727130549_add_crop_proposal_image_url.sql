-- =============================================================================
-- Relate — Crop Guides: carry a photo through the propose-a-crop flow
--
-- Safe to re-run.
--
-- Members can now attach a photo when they propose a crop, and super admins can
-- set/replace a crop's photo directly on its guide (that path is a plain update
-- to crops.image_url, already gated to super admins by the crops RLS policy).
--
-- Two changes here:
--   1. crop_proposals gains an image_url column so a proposed photo survives
--      until review.
--   2. approve_crop_proposal() copies that image_url onto the published crop, so
--      an approved proposal keeps its photo.
-- =============================================================================

alter table public.crop_proposals
  add column if not exists image_url text;

-- Recreate the promotion function so it carries image_url onto the new crop.
-- (Body identical to 20260726222051_crop_proposals.sql aside from image_url.)
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
    organic_favourite, image_url, status, created_by
  ) values (
    v_slug, p.common_name, p.scientific_name, p.family, p.category, p.difficulty, p.lifecycle,
    p.overview, p.preferred_climate, p.sun, p.water_need, p.edible_part, p.time_to_maturity_days,
    p.beginner_friendly, p.pollinator_friendly, p.nitrogen_fixer, p.drought_tolerant,
    p.organic_favourite, p.image_url, 'published', p.created_by
  )
  returning id into v_crop_id;

  update public.crop_proposals
    set status = 'approved', crop_id = v_crop_id, updated_at = now()
    where id = p_proposal_id;

  return v_crop_id;
end;
$$;

grant execute on function public.approve_crop_proposal(uuid) to authenticated;
