-- =============================================================================
-- Relate — Place-Based Community: Local Recommendations
--
-- Run this after supabase/place-community.sql (needs the 'recommendations'
-- space_type value) and supabase/business-directory.sql (a recommendation
-- can optionally link to a businesses row) and supabase/explore-map.sql (or
-- optionally to a landmarks row). Safe to re-run.
--
-- Members recommend restaurants, activities, services, professionals,
-- walks, viewpoints and contractors. Unlike the listing-style spaces
-- (Marketplace, Jobs, Accommodation), recommendations are about consensus,
-- not inventory — recommendation_votes lets other members "agree" with an
-- existing recommendation instead of only being able to post a duplicate
-- one, which is what actually makes "everything becomes searchable"
-- meaningful (a place with 12 agrees beats five near-duplicate posts).
-- =============================================================================

do $$ begin
  create type public.recommendation_category as enum (
    'restaurant', 'cafe', 'activity', 'service', 'professional', 'walk', 'viewpoint', 'contractor', 'other'
  );
exception when duplicate_object then null; end $$;

create table if not exists public.recommendations (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces (id) on delete cascade,
  community_id uuid not null references public.communities (id) on delete cascade,
  recommended_by uuid not null references public.profiles (id) on delete cascade,
  category public.recommendation_category not null default 'other',
  title text not null,
  note text,
  business_id uuid references public.businesses (id) on delete set null,
  landmark_id uuid references public.landmarks (id) on delete set null,
  location_label text,
  lat double precision,
  lng double precision,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.recommendations;
create trigger set_updated_at before update on public.recommendations
  for each row execute function public.set_updated_at();

create index if not exists idx_recommendations_space on public.recommendations (space_id, created_at desc);
create index if not exists idx_recommendations_category on public.recommendations (space_id, category);

alter table public.recommendations enable row level security;

drop policy if exists "recommendations_select" on public.recommendations;
create policy "recommendations_select" on public.recommendations
  for select to authenticated
  using (public.can_view_space(space_id, auth.uid()));

drop policy if exists "recommendations_insert_member" on public.recommendations;
create policy "recommendations_insert_member" on public.recommendations
  for insert to authenticated
  with check (
    recommended_by = auth.uid()
    and public.is_community_member(community_id, auth.uid())
    and public.can_view_space(space_id, auth.uid())
  );

drop policy if exists "recommendations_update_author_or_staff" on public.recommendations;
create policy "recommendations_update_author_or_staff" on public.recommendations
  for update to authenticated
  using (recommended_by = auth.uid() or public.is_community_staff(community_id, auth.uid()))
  with check (recommended_by = auth.uid() or public.is_community_staff(community_id, auth.uid()));

drop policy if exists "recommendations_delete_author_or_staff" on public.recommendations;
create policy "recommendations_delete_author_or_staff" on public.recommendations
  for delete to authenticated
  using (recommended_by = auth.uid() or public.is_community_staff(community_id, auth.uid()));

-- -----------------------------------------------------------------------------
-- recommendation_votes: other members "agree" with a recommendation.
-- -----------------------------------------------------------------------------
create table if not exists public.recommendation_votes (
  id uuid primary key default gen_random_uuid(),
  recommendation_id uuid not null references public.recommendations (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (recommendation_id, user_id)
);

create index if not exists idx_recommendation_votes_recommendation on public.recommendation_votes (recommendation_id);

alter table public.recommendation_votes enable row level security;

drop policy if exists "recommendation_votes_select" on public.recommendation_votes;
create policy "recommendation_votes_select" on public.recommendation_votes
  for select to authenticated
  using (
    exists (
      select 1 from public.recommendations r
      where r.id = recommendation_votes.recommendation_id
        and public.can_view_space(r.space_id, auth.uid())
    )
  );

drop policy if exists "recommendation_votes_insert_self" on public.recommendation_votes;
create policy "recommendation_votes_insert_self" on public.recommendation_votes
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.recommendations r
      where r.id = recommendation_votes.recommendation_id
        and public.is_community_member(r.community_id, auth.uid())
    )
  );

drop policy if exists "recommendation_votes_delete_self_or_staff" on public.recommendation_votes;
create policy "recommendation_votes_delete_self_or_staff" on public.recommendation_votes
  for delete to authenticated
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.recommendations r
      where r.id = recommendation_votes.recommendation_id
        and public.is_community_staff(r.community_id, auth.uid())
    )
  );
