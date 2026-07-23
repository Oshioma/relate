-- =============================================================================
-- Relate — Place-Based Community: Community Guides
--
-- Run this after supabase/place-community.sql (needs the 'guides'
-- space_type value). Safe to re-run.
--
-- A guide is a wiki-style document any active community member can edit —
-- not just its creator or staff — which is what "contributors" means here:
-- guide_contributors records everyone who has ever saved an edit.
-- guide_revisions snapshots the previous title/body before every edit, so
-- there's a real revision history to browse (and restore from). Ratings
-- and comments each get their own small table, same reasoning as
-- recommendation_votes: one table per concern rather than overloading a
-- shared one.
-- =============================================================================

create table if not exists public.guides (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces (id) on delete cascade,
  community_id uuid not null references public.communities (id) on delete cascade,
  created_by uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  body text not null,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.guides;
create trigger set_updated_at before update on public.guides
  for each row execute function public.set_updated_at();

-- featured is staff-only, mirroring enforce_business_privileged_fields in
-- business-directory.sql — without this, any contributor editing the body
-- could also silently feature their own guide.
create or replace function public.enforce_guide_privileged_fields()
returns trigger as $$
begin
  if not public.is_community_staff(new.community_id, auth.uid()) then
    new.featured := old.featured;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists enforce_guide_privileged_fields on public.guides;
create trigger enforce_guide_privileged_fields before update on public.guides
  for each row execute function public.enforce_guide_privileged_fields();

create index if not exists idx_guides_space on public.guides (space_id, created_at desc);

alter table public.guides enable row level security;

drop policy if exists "guides_select" on public.guides;
create policy "guides_select" on public.guides
  for select to authenticated
  using (public.can_view_space(space_id, auth.uid()));

drop policy if exists "guides_insert_member" on public.guides;
create policy "guides_insert_member" on public.guides
  for insert to authenticated
  with check (
    created_by = auth.uid()
    and public.is_community_member(community_id, auth.uid())
    and public.can_view_space(space_id, auth.uid())
  );

-- Any active member can edit the body/title (it's a wiki) — not just the
-- creator or staff. featured is still staff-only via the trigger above.
drop policy if exists "guides_update_member" on public.guides;
create policy "guides_update_member" on public.guides
  for update to authenticated
  using (public.is_community_member(community_id, auth.uid()))
  with check (public.is_community_member(community_id, auth.uid()));

drop policy if exists "guides_delete_creator_or_staff" on public.guides;
create policy "guides_delete_creator_or_staff" on public.guides
  for delete to authenticated
  using (created_by = auth.uid() or public.is_community_staff(community_id, auth.uid()));

-- -----------------------------------------------------------------------------
-- guide_contributors: everyone who has saved an edit to a guide.
-- -----------------------------------------------------------------------------
create table if not exists public.guide_contributors (
  id uuid primary key default gen_random_uuid(),
  guide_id uuid not null references public.guides (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  first_contributed_at timestamptz not null default now(),
  unique (guide_id, user_id)
);

create index if not exists idx_guide_contributors_guide on public.guide_contributors (guide_id);

alter table public.guide_contributors enable row level security;

drop policy if exists "guide_contributors_select" on public.guide_contributors;
create policy "guide_contributors_select" on public.guide_contributors
  for select to authenticated
  using (
    exists (
      select 1 from public.guides g
      where g.id = guide_contributors.guide_id
        and public.can_view_space(g.space_id, auth.uid())
    )
  );

drop policy if exists "guide_contributors_insert_self" on public.guide_contributors;
create policy "guide_contributors_insert_self" on public.guide_contributors
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.guides g
      where g.id = guide_contributors.guide_id
        and public.is_community_member(g.community_id, auth.uid())
    )
  );

-- -----------------------------------------------------------------------------
-- guide_revisions: append-only snapshot of the previous title/body, taken
-- right before each edit.
-- -----------------------------------------------------------------------------
create table if not exists public.guide_revisions (
  id uuid primary key default gen_random_uuid(),
  guide_id uuid not null references public.guides (id) on delete cascade,
  title text not null,
  body text not null,
  edited_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_guide_revisions_guide on public.guide_revisions (guide_id, created_at desc);

alter table public.guide_revisions enable row level security;

drop policy if exists "guide_revisions_select" on public.guide_revisions;
create policy "guide_revisions_select" on public.guide_revisions
  for select to authenticated
  using (
    exists (
      select 1 from public.guides g
      where g.id = guide_revisions.guide_id
        and public.can_view_space(g.space_id, auth.uid())
    )
  );

drop policy if exists "guide_revisions_insert_member" on public.guide_revisions;
create policy "guide_revisions_insert_member" on public.guide_revisions
  for insert to authenticated
  with check (
    exists (
      select 1 from public.guides g
      where g.id = guide_revisions.guide_id
        and public.is_community_member(g.community_id, auth.uid())
    )
  );

-- -----------------------------------------------------------------------------
-- guide_ratings: one 1-5 star rating per member per guide.
-- -----------------------------------------------------------------------------
create table if not exists public.guide_ratings (
  id uuid primary key default gen_random_uuid(),
  guide_id uuid not null references public.guides (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (guide_id, user_id)
);

drop trigger if exists set_updated_at on public.guide_ratings;
create trigger set_updated_at before update on public.guide_ratings
  for each row execute function public.set_updated_at();

create index if not exists idx_guide_ratings_guide on public.guide_ratings (guide_id);

alter table public.guide_ratings enable row level security;

drop policy if exists "guide_ratings_select" on public.guide_ratings;
create policy "guide_ratings_select" on public.guide_ratings
  for select to authenticated
  using (
    exists (
      select 1 from public.guides g
      where g.id = guide_ratings.guide_id
        and public.can_view_space(g.space_id, auth.uid())
    )
  );

drop policy if exists "guide_ratings_insert_self" on public.guide_ratings;
create policy "guide_ratings_insert_self" on public.guide_ratings
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.guides g
      where g.id = guide_ratings.guide_id
        and public.is_community_member(g.community_id, auth.uid())
    )
  );

drop policy if exists "guide_ratings_update_self" on public.guide_ratings;
create policy "guide_ratings_update_self" on public.guide_ratings
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "guide_ratings_delete_self_or_staff" on public.guide_ratings;
create policy "guide_ratings_delete_self_or_staff" on public.guide_ratings
  for delete to authenticated
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.guides g
      where g.id = guide_ratings.guide_id
        and public.is_community_staff(g.community_id, auth.uid())
    )
  );

-- -----------------------------------------------------------------------------
-- guide_comments: flat comment thread on a guide (no nested replies, same
-- shape as the existing post comments).
-- -----------------------------------------------------------------------------
create table if not exists public.guide_comments (
  id uuid primary key default gen_random_uuid(),
  guide_id uuid not null references public.guides (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.guide_comments;
create trigger set_updated_at before update on public.guide_comments
  for each row execute function public.set_updated_at();

create index if not exists idx_guide_comments_guide on public.guide_comments (guide_id, created_at asc);

alter table public.guide_comments enable row level security;

drop policy if exists "guide_comments_select" on public.guide_comments;
create policy "guide_comments_select" on public.guide_comments
  for select to authenticated
  using (
    exists (
      select 1 from public.guides g
      where g.id = guide_comments.guide_id
        and public.can_view_space(g.space_id, auth.uid())
    )
  );

drop policy if exists "guide_comments_insert_member" on public.guide_comments;
create policy "guide_comments_insert_member" on public.guide_comments
  for insert to authenticated
  with check (
    author_id = auth.uid()
    and exists (
      select 1 from public.guides g
      where g.id = guide_comments.guide_id
        and public.is_community_member(g.community_id, auth.uid())
    )
  );

drop policy if exists "guide_comments_update_author_or_staff" on public.guide_comments;
create policy "guide_comments_update_author_or_staff" on public.guide_comments
  for update to authenticated
  using (
    author_id = auth.uid()
    or exists (
      select 1 from public.guides g
      where g.id = guide_comments.guide_id
        and public.is_community_staff(g.community_id, auth.uid())
    )
  );

drop policy if exists "guide_comments_delete_author_or_staff" on public.guide_comments;
create policy "guide_comments_delete_author_or_staff" on public.guide_comments
  for delete to authenticated
  using (
    author_id = auth.uid()
    or exists (
      select 1 from public.guides g
      where g.id = guide_comments.guide_id
        and public.is_community_staff(g.community_id, auth.uid())
    )
  );
