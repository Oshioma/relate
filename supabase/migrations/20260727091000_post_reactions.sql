-- =============================================================================
-- Relate — Post reactions
--
-- Lets members react to a discussion post with an emoji (a smile, to start).
-- Modelled on recommendation_votes: one row per (post, member, emoji), so a
-- member can toggle a given reaction on a post exactly once. Storing the emoji
-- (rather than assuming a single kind) leaves room to offer more reactions
-- later without another migration. Safe to re-run.
-- =============================================================================

create table if not exists public.post_reactions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  emoji text not null default '😊',
  created_at timestamptz not null default now(),
  unique (post_id, user_id, emoji)
);

create index if not exists idx_post_reactions_post on public.post_reactions (post_id);

alter table public.post_reactions enable row level security;

-- Anyone who can see the post can see its reactions.
drop policy if exists "post_reactions_select" on public.post_reactions;
create policy "post_reactions_select" on public.post_reactions
  for select to authenticated
  using (
    exists (
      select 1 from public.posts p
      where p.id = post_reactions.post_id
        and public.can_view_space(p.space_id, auth.uid())
    )
  );

-- A member of the community can add their own reaction.
drop policy if exists "post_reactions_insert_self" on public.post_reactions;
create policy "post_reactions_insert_self" on public.post_reactions
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.posts p
      where p.id = post_reactions.post_id
        and public.is_community_member(p.community_id, auth.uid())
    )
  );

-- A member can remove their own reaction; staff can remove any.
drop policy if exists "post_reactions_delete_self_or_staff" on public.post_reactions;
create policy "post_reactions_delete_self_or_staff" on public.post_reactions
  for delete to authenticated
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.posts p
      where p.id = post_reactions.post_id
        and public.is_community_staff(p.community_id, auth.uid())
    )
  );
