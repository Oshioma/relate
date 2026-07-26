-- =============================================================================
-- Relate — Crop Guides, Phase 2: relational crop sections
--
-- Safe to re-run.
--
-- Four global child tables hanging off crops: varieties, companions, pests and
-- diseases. Like crops these are platform-global reference data — readable by
-- everyone once the parent crop is published, writable only by a platform super
-- admin. Each SELECT policy joins back to crops so an unpublished (draft) crop's
-- sections stay hidden until it goes live, mirroring the course_prerequisites
-- select pattern.
--
-- ORGANIC-ONLY POLICY: crop_pests and crop_diseases carry ONLY organic
-- treatment fields (organic_treatments / natural_predators / prevention /
-- organic_control). There is deliberately no chemical-control column — the
-- guidance this platform stores is organic by construction, not by convention.
-- =============================================================================

-- Shared helper predicate is inlined per policy (a crop's sections are visible
-- when the crop is published, or to a super admin working on a draft).

-- -----------------------------------------------------------------------------
-- crop_varieties: unlimited named varieties per crop.
-- -----------------------------------------------------------------------------
create table if not exists public.crop_varieties (
  id uuid primary key default gen_random_uuid(),
  crop_id uuid not null references public.crops (id) on delete cascade,
  name text not null,
  image_url text,
  description text,
  growth_habit text,
  time_to_harvest text,
  yield text,
  disease_resistance text,
  best_climates text,
  flavour text,
  uses text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.crop_varieties;
create trigger set_updated_at before update on public.crop_varieties
  for each row execute function public.set_updated_at();

create index if not exists idx_crop_varieties_crop on public.crop_varieties (crop_id, sort_order);

alter table public.crop_varieties enable row level security;

drop policy if exists "crop_varieties_select" on public.crop_varieties;
create policy "crop_varieties_select" on public.crop_varieties
  for select to authenticated
  using (
    exists (
      select 1 from public.crops c
      where c.id = crop_varieties.crop_id
        and (c.status = 'published' or public.is_super_admin(auth.uid()))
    )
  );

drop policy if exists "crop_varieties_write_super_admin" on public.crop_varieties;
create policy "crop_varieties_write_super_admin" on public.crop_varieties
  for all to authenticated
  using (public.is_super_admin(auth.uid()))
  with check (public.is_super_admin(auth.uid()));

-- -----------------------------------------------------------------------------
-- crop_companions: companion-planting relationships. companion_crop_id links to
-- another crop when it exists in the library (so the graph is clickable);
-- companion_name is always set so a companion that isn't in the library yet
-- still displays.
-- -----------------------------------------------------------------------------
create table if not exists public.crop_companions (
  id uuid primary key default gen_random_uuid(),
  crop_id uuid not null references public.crops (id) on delete cascade,
  companion_crop_id uuid references public.crops (id) on delete set null,
  companion_name text not null,
  relationship text not null default 'excellent' check (relationship in ('excellent', 'neutral', 'avoid')),
  reason text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_crop_companions_crop on public.crop_companions (crop_id, sort_order);

alter table public.crop_companions enable row level security;

drop policy if exists "crop_companions_select" on public.crop_companions;
create policy "crop_companions_select" on public.crop_companions
  for select to authenticated
  using (
    exists (
      select 1 from public.crops c
      where c.id = crop_companions.crop_id
        and (c.status = 'published' or public.is_super_admin(auth.uid()))
    )
  );

drop policy if exists "crop_companions_write_super_admin" on public.crop_companions;
create policy "crop_companions_write_super_admin" on public.crop_companions
  for all to authenticated
  using (public.is_super_admin(auth.uid()))
  with check (public.is_super_admin(auth.uid()));

-- -----------------------------------------------------------------------------
-- crop_pests: organic pest guidance only (no chemical controls).
-- -----------------------------------------------------------------------------
create table if not exists public.crop_pests (
  id uuid primary key default gen_random_uuid(),
  crop_id uuid not null references public.crops (id) on delete cascade,
  name text not null,
  photo_url text,
  symptoms text,
  life_cycle text,
  damage text,
  organic_treatments text,
  natural_predators text,
  prevention text,
  severity text,               -- 'low' | 'moderate' | 'high' (free text)
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_crop_pests_crop on public.crop_pests (crop_id, sort_order);

alter table public.crop_pests enable row level security;

drop policy if exists "crop_pests_select" on public.crop_pests;
create policy "crop_pests_select" on public.crop_pests
  for select to authenticated
  using (
    exists (
      select 1 from public.crops c
      where c.id = crop_pests.crop_id
        and (c.status = 'published' or public.is_super_admin(auth.uid()))
    )
  );

drop policy if exists "crop_pests_write_super_admin" on public.crop_pests;
create policy "crop_pests_write_super_admin" on public.crop_pests
  for all to authenticated
  using (public.is_super_admin(auth.uid()))
  with check (public.is_super_admin(auth.uid()));

-- -----------------------------------------------------------------------------
-- crop_diseases: organic disease guidance only (no chemical controls).
-- -----------------------------------------------------------------------------
create table if not exists public.crop_diseases (
  id uuid primary key default gen_random_uuid(),
  crop_id uuid not null references public.crops (id) on delete cascade,
  name text not null,
  photo_url text,
  symptoms text,
  causes text,
  organic_control text,
  prevention text,
  early_signs text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_crop_diseases_crop on public.crop_diseases (crop_id, sort_order);

alter table public.crop_diseases enable row level security;

drop policy if exists "crop_diseases_select" on public.crop_diseases;
create policy "crop_diseases_select" on public.crop_diseases
  for select to authenticated
  using (
    exists (
      select 1 from public.crops c
      where c.id = crop_diseases.crop_id
        and (c.status = 'published' or public.is_super_admin(auth.uid()))
    )
  );

drop policy if exists "crop_diseases_write_super_admin" on public.crop_diseases;
create policy "crop_diseases_write_super_admin" on public.crop_diseases
  for all to authenticated
  using (public.is_super_admin(auth.uid()))
  with check (public.is_super_admin(auth.uid()));
