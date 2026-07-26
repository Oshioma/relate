-- =============================================================================
-- Relate — Crop Guides: the global crop knowledge base (Phase 1)
--
-- Safe to re-run.
--
-- The vision is a shared, platform-wide growing encyclopedia that EVERY farming
-- / gardening community can browse from its own "Crop Guides" space, with
-- community-specific layers (regional tips, growing journals, saved crops)
-- added on top in later phases. So `crops` is deliberately NOT community-scoped:
-- it is platform-global reference data, readable by everyone once published and
-- writable only by a platform super admin — the same two-level model already
-- used by space_type_defaults. Community-scoped layers (crop_community_tips,
-- crop_growing_journals, garden_plantings, …) arrive in their own migrations and
-- reference these global rows.
--
-- ORGANIC-ONLY POLICY: this platform's crop guidance is organic-first. The
-- feeding guide covers compost, manure, seaweed, fish emulsion, bone meal, rock
-- dust and other organic amendments — there is deliberately NO synthetic /
-- chemical column here, and later pest/disease tables will likewise carry only
-- organic treatment fields. The knowledge base cannot store what it is not meant
-- to recommend.
--
-- Dense narrative sections (soil, sowing, watering, organic feeding, harvest) are
-- stored as jsonb sub-documents rather than a table each: they are rendered as a
-- block, not cross-queried. The columns that ARE searched/filtered (category,
-- climate, badges, difficulty) are first-class columns. Relational sections that
-- get their own tables — varieties, companions, pests, diseases, calendars —
-- come in Phase 2+.
-- =============================================================================

create table if not exists public.crops (
  id uuid primary key default gen_random_uuid(),

  -- Identity ------------------------------------------------------------------
  slug text not null unique,
  common_name text not null,
  scientific_name text,
  family text,
  -- One of the crop categories in src/lib/crop-categories.ts. Kept as free text
  -- (not an enum) so new categories need no migration — the architecture is
  -- meant to scale to unlimited future categories.
  category text not null default 'vegetable',

  -- Overview badges & quick facts --------------------------------------------
  difficulty text,                 -- 'beginner' | 'moderate' | 'advanced' (free text)
  lifecycle text,                  -- 'annual' | 'biennial' | 'perennial'
  beginner_friendly boolean not null default false,
  time_to_maturity_days integer,
  average_yield text,
  preferred_climate text,
  usda_zones text,
  tropical_suitable boolean not null default false,
  pollination_type text,

  -- Badge attributes ----------------------------------------------------------
  sun text,                        -- 'full_sun' | 'partial_shade' | 'full_shade'
  water_need text,                 -- 'low' | 'moderate' | 'high'
  drought_tolerant boolean not null default false,
  pollinator_friendly boolean not null default false,
  nitrogen_fixer boolean not null default false,
  organic_favourite boolean not null default false,
  edible_part text,

  image_url text,

  -- Narrative sections (rendered as blocks, not cross-queried) -----------------
  overview text,
  soil jsonb not null default '{}'::jsonb,
  sowing jsonb not null default '{}'::jsonb,
  watering jsonb not null default '{}'::jsonb,
  feeding jsonb not null default '{}'::jsonb,   -- organic feeding only
  harvest jsonb not null default '{}'::jsonb,

  -- Publishing ----------------------------------------------------------------
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.crops;
create trigger set_updated_at before update on public.crops
  for each row execute function public.set_updated_at();

create index if not exists idx_crops_category on public.crops (category);
create index if not exists idx_crops_status on public.crops (status);
create index if not exists idx_crops_common_name on public.crops (lower(common_name));

alter table public.crops enable row level security;

-- Everyone (any authenticated user, in any community) can read published crops;
-- super admins additionally see drafts they are working on.
drop policy if exists "crops_select" on public.crops;
create policy "crops_select" on public.crops
  for select to authenticated
  using (status = 'published' or public.is_super_admin(auth.uid()));

-- Only a platform super admin may create/edit/delete global crop records. A
-- community-contribution → moderation path (letting members propose crops or
-- edits) is planned as a later phase; today the canonical library is curated.
drop policy if exists "crops_write_super_admin" on public.crops;
create policy "crops_write_super_admin" on public.crops
  for all to authenticated
  using (public.is_super_admin(auth.uid()))
  with check (public.is_super_admin(auth.uid()));
