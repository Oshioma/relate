-- =============================================================================
-- Relate — Feed reactions and comments
--
-- The community feed mixes activity from a dozen different tables (new
-- members, businesses, events, marketplace listings, jobs, stays,
-- recommendations, clubs, volunteer projects) into one card list. Only
-- discussion posts had a smile and a comment thread, and those live on the
-- post's own page — so a card like "New Member" had nowhere to welcome
-- someone from.
--
-- These two tables give every other feed card the same pair of affordances
-- without a reactions/comments table per activity type: the row names the
-- feed item polymorphically as (item_type, item_id) and carries the
-- community_id it appeared in, which is what RLS is written against.
--
-- Discussion posts are deliberately NOT a valid item_type here: they already
-- have post_reactions and comments, and the feed card reads those, so a post's
-- smile count is the same number wherever you look at it.
--
-- Safe to re-run.
-- =============================================================================

-- Keep the allowed types in one place so both tables agree on them. These
-- match the feed item keys built in the community feed page.
do $$ begin
  create type public.feed_item_type as enum (
    'member', 'business', 'event', 'listing', 'job',
    'stay', 'recommendation', 'club', 'volunteer'
  );
exception when duplicate_object then null; end $$;

-- -----------------------------------------------------------------------------
-- Reactions
--
-- Modelled on post_reactions: one row per (item, member, emoji), so a member
-- can toggle a given reaction on a card exactly once. Storing the emoji rather
-- than assuming a single kind leaves room for more reactions later without
-- another migration.
-- -----------------------------------------------------------------------------
create table if not exists public.feed_reactions (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities (id) on delete cascade,
  item_type public.feed_item_type not null,
  item_id uuid not null,
  user_id uuid not null references public.profiles (id) on delete cascade,
  emoji text not null default '😊',
  created_at timestamptz not null default now(),
  unique (item_type, item_id, user_id, emoji)
);

-- The feed loads reactions for a batch of item ids at once, so the lookup is
-- by id (the community column narrows it further and scopes RLS).
create index if not exists idx_feed_reactions_item on public.feed_reactions (item_id);
create index if not exists idx_feed_reactions_community on public.feed_reactions (community_id);

-- -----------------------------------------------------------------------------
-- Comments
-- -----------------------------------------------------------------------------
create table if not exists public.feed_comments (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities (id) on delete cascade,
  item_type public.feed_item_type not null,
  item_id uuid not null,
  author_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_feed_comments_item on public.feed_comments (item_id, created_at);
create index if not exists idx_feed_comments_community on public.feed_comments (community_id);

alter table public.feed_reactions enable row level security;
alter table public.feed_comments enable row level security;

-- -----------------------------------------------------------------------------
-- Policies
--
-- Visibility follows the feed itself: anyone who can see the community's feed
-- can see its reactions and comments. A public community's feed renders for
-- signed-out visitors too, so `anon` gets a read policy for public communities
-- (matching communities_select_public_anon). Writing is members-only.
--
-- `is_community_member` misses a community's owner when they hold no
-- membership row, which is how the app treats owners elsewhere (the feed's own
-- isMember check is `membership active OR owner`), so every write policy
-- accepts the owner explicitly.
-- -----------------------------------------------------------------------------

drop policy if exists "feed_reactions_select" on public.feed_reactions;
create policy "feed_reactions_select" on public.feed_reactions
  for select to authenticated
  using (
    exists (
      select 1 from public.communities c
      where c.id = feed_reactions.community_id
        and (
          c.is_public
          or c.owner_id = auth.uid()
          or public.is_community_member(c.id, auth.uid())
        )
    )
  );

drop policy if exists "feed_reactions_select_anon" on public.feed_reactions;
create policy "feed_reactions_select_anon" on public.feed_reactions
  for select to anon
  using (
    exists (
      select 1 from public.communities c
      where c.id = feed_reactions.community_id and c.is_public
    )
  );

drop policy if exists "feed_reactions_insert_self" on public.feed_reactions;
create policy "feed_reactions_insert_self" on public.feed_reactions
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and (
      public.is_community_member(community_id, auth.uid())
      or exists (
        select 1 from public.communities c
        where c.id = feed_reactions.community_id and c.owner_id = auth.uid()
      )
    )
  );

-- A member can remove their own reaction; staff can remove any.
drop policy if exists "feed_reactions_delete_self_or_staff" on public.feed_reactions;
create policy "feed_reactions_delete_self_or_staff" on public.feed_reactions
  for delete to authenticated
  using (
    user_id = auth.uid()
    or public.is_community_staff(community_id, auth.uid())
    or exists (
      select 1 from public.communities c
      where c.id = feed_reactions.community_id and c.owner_id = auth.uid()
    )
  );

drop policy if exists "feed_comments_select" on public.feed_comments;
create policy "feed_comments_select" on public.feed_comments
  for select to authenticated
  using (
    exists (
      select 1 from public.communities c
      where c.id = feed_comments.community_id
        and (
          c.is_public
          or c.owner_id = auth.uid()
          or public.is_community_member(c.id, auth.uid())
        )
    )
  );

drop policy if exists "feed_comments_select_anon" on public.feed_comments;
create policy "feed_comments_select_anon" on public.feed_comments
  for select to anon
  using (
    exists (
      select 1 from public.communities c
      where c.id = feed_comments.community_id and c.is_public
    )
  );

drop policy if exists "feed_comments_insert_self" on public.feed_comments;
create policy "feed_comments_insert_self" on public.feed_comments
  for insert to authenticated
  with check (
    author_id = auth.uid()
    and (
      public.is_community_member(community_id, auth.uid())
      or exists (
        select 1 from public.communities c
        where c.id = feed_comments.community_id and c.owner_id = auth.uid()
      )
    )
  );

-- Only the author edits their own words.
drop policy if exists "feed_comments_update_own" on public.feed_comments;
create policy "feed_comments_update_own" on public.feed_comments
  for update to authenticated
  using (author_id = auth.uid())
  with check (author_id = auth.uid());

drop policy if exists "feed_comments_delete_self_or_staff" on public.feed_comments;
create policy "feed_comments_delete_self_or_staff" on public.feed_comments
  for delete to authenticated
  using (
    author_id = auth.uid()
    or public.is_community_staff(community_id, auth.uid())
    or exists (
      select 1 from public.communities c
      where c.id = feed_comments.community_id and c.owner_id = auth.uid()
    )
  );

-- Keep updated_at honest when a member edits their comment (same trigger the
-- posts/comments tables use).
drop trigger if exists set_updated_at on public.feed_comments;
create trigger set_updated_at before update on public.feed_comments
  for each row execute function public.set_updated_at();
