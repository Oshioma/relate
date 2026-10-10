-- =============================================================================
-- Relate — Books & Media: the family media shelf
--
-- One row per book, video, podcast or other piece of media somebody in a
-- Books & Media space has reviewed. The columns a shelf is browsed by — kind,
-- verdict, age range — are first-class; the full analysis Claude produced is
-- kept as jsonb beside them so a parent can see WHY something was flagged
-- without the app having to model every possible concern as a column.
--
-- WHO MAY ADD: any active member. In a homeschool the parents are the
-- reviewers, and a shelf only one person may add to is a list, not a library.
-- Each AI read is paid for, so the server action that runs it checks the
-- community's AI allowance first (src/lib/usage/ai-spend.ts); the insert
-- itself costs nothing. Editing and deleting are open to the item's own
-- author and to community staff, as with lessons.
--
-- SHARING ACROSS COMMUNITIES. A review of "Charlotte's Web" is as true in one
-- homeschool as in the next, so an item can be offered to every other
-- community's shelf. It is per item (share_with_other_communities, on by
-- default) rather than per community, so a family can keep a note about a
-- book that only makes sense to them. Other communities read the shared rows
-- through shared_media_items_from_other_communities() below — SECURITY
-- DEFINER, because another community's rows are otherwise invisible under
-- RLS — and only ever see what was shared, never the rest of the shelf.
--
-- Safe to re-run.
-- =============================================================================

create table if not exists public.space_media_items (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces (id) on delete cascade,
  community_id uuid not null references public.communities (id) on delete cascade,
  created_by uuid not null references public.profiles (id) on delete cascade,

  -- The link as pasted (after normalisation to http/https), and the key every
  -- spelling of the same link boils down to — see src/lib/school/lesson-link-key.ts.
  -- One review per link per space.
  url text not null,
  link_key text not null,

  -- What it is. Free text validated against MEDIA_KINDS in
  -- src/lib/media/media-types.ts, so adding a kind stays a code-only change.
  kind text not null default 'other',

  title text not null,
  -- Author, channel, studio, publisher — whoever made it.
  creator text,
  description text not null default '',
  -- A cover or thumbnail, when the page offered one. A link, never a file.
  image_url text,

  -- The suggested audience, as a range of whole years. Both null when nobody
  -- (and no model) could say.
  age_min integer,
  age_max integer,

  -- The reviewer's call: good for kids, fine with a note (a few scary scenes,
  -- a word or two), or not suitable. The reason is required reading for the
  -- last one and useful for the middle.
  verdict text not null default 'suitable',
  reason text,

  -- What a parent would want to know, as reported by the model and editable
  -- by the reviewer. profanity is a single level so the shelf can filter on
  -- it; concerns is a list of {category, level, note} for everything else
  -- (violence, scary, romance, substances, mature themes…).
  profanity text not null default 'unknown',
  concerns jsonb not null default '[]'::jsonb,
  -- Good things worth saying: the themes, subjects and reasons to pick it.
  themes text[] not null default '{}',

  -- Everything the model said, kept for the audit trail and the "why" panel.
  ai_analysis jsonb,
  ai_model text,
  ai_input_tokens integer,
  ai_output_tokens integer,

  share_with_other_communities boolean not null default true,
  -- When this row was copied in from another community's shelf, where from.
  -- Null for a review written here.
  imported_from uuid references public.space_media_items (id) on delete set null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.space_media_items
  drop constraint if exists space_media_items_kind_check;
alter table public.space_media_items
  add constraint space_media_items_kind_check
  check (kind in ('book', 'video', 'audio', 'game', 'app', 'website', 'other'));

alter table public.space_media_items
  drop constraint if exists space_media_items_verdict_check;
alter table public.space_media_items
  add constraint space_media_items_verdict_check
  check (verdict in ('suitable', 'caution', 'not_suitable'));

alter table public.space_media_items
  drop constraint if exists space_media_items_profanity_check;
alter table public.space_media_items
  add constraint space_media_items_profanity_check
  check (profanity in ('none', 'mild', 'moderate', 'strong', 'unknown'));

alter table public.space_media_items
  drop constraint if exists space_media_items_age_sane;
alter table public.space_media_items
  add constraint space_media_items_age_sane
  check (
    (age_min is null or age_min between 0 and 21)
    and (age_max is null or age_max between 0 and 21)
    and (age_min is null or age_max is null or age_min <= age_max)
  );

-- One review per link per shelf.
create unique index if not exists idx_space_media_items_link
  on public.space_media_items (space_id, link_key);
-- The shelf lists newest first, split by verdict.
create index if not exists idx_space_media_items_space
  on public.space_media_items (space_id, verdict, created_at desc);
create index if not exists idx_space_media_items_community
  on public.space_media_items (community_id, created_at desc);
-- What other communities read.
create index if not exists idx_space_media_items_shared
  on public.space_media_items (share_with_other_communities, created_at desc)
  where share_with_other_communities;

drop trigger if exists set_updated_at on public.space_media_items;
create trigger set_updated_at before update on public.space_media_items
  for each row execute function public.set_updated_at();

alter table public.space_media_items enable row level security;

drop policy if exists "space_media_items_select" on public.space_media_items;
create policy "space_media_items_select" on public.space_media_items
  for select to authenticated
  using (public.can_view_space(space_id, auth.uid()));

-- A public homeschool's shelf is readable without an account, same as its
-- lessons — a parent deciding whether to join can see what the group reads.
drop policy if exists "space_media_items_select_anon" on public.space_media_items;
create policy "space_media_items_select_anon" on public.space_media_items
  for select to anon
  using (public.can_view_space(space_id, null::uuid));

drop policy if exists "space_media_items_insert_member" on public.space_media_items;
create policy "space_media_items_insert_member" on public.space_media_items
  for insert to authenticated
  with check (
    created_by = auth.uid()
    and public.is_community_member(community_id, auth.uid())
    and public.can_view_space(space_id, auth.uid())
  );

drop policy if exists "space_media_items_update_author_or_staff" on public.space_media_items;
create policy "space_media_items_update_author_or_staff" on public.space_media_items
  for update to authenticated
  using (created_by = auth.uid() or public.is_community_staff(community_id, auth.uid()))
  with check (created_by = auth.uid() or public.is_community_staff(community_id, auth.uid()));

drop policy if exists "space_media_items_delete_author_or_staff" on public.space_media_items;
create policy "space_media_items_delete_author_or_staff" on public.space_media_items
  for delete to authenticated
  using (created_by = auth.uid() or public.is_community_staff(community_id, auth.uid()));

-- --- Reading other communities' shelves ------------------------------------
--
-- What a "Bring in media from other communities" button shows. Reads past RLS,
-- so it hands back only what was explicitly shared, and only to somebody who
-- is already inside a community of their own (an active member, or anyone on
-- a public one). An invite-only community is unlisted, so its rows come back
-- without a name or slug — the review is shared, the community is not.
create or replace function public.shared_media_items_from_other_communities(
  p_community_id uuid,
  p_limit integer default 300
)
returns table (
  id uuid,
  community_id uuid,
  community_name text,
  community_slug text,
  url text,
  kind text,
  title text,
  creator text,
  description text,
  image_url text,
  age_min integer,
  age_max integer,
  verdict text,
  reason text,
  profanity text,
  concerns jsonb,
  themes text[],
  created_at timestamptz
)
language sql
security definer
stable
set search_path = public
as $$
  select
    m.id,
    m.community_id,
    case when c.privacy = 'invite_only' then null else c.name end as community_name,
    case when c.privacy = 'invite_only' then null else c.slug end as community_slug,
    m.url,
    m.kind,
    m.title,
    m.creator,
    m.description,
    m.image_url,
    m.age_min,
    m.age_max,
    m.verdict,
    m.reason,
    m.profanity,
    m.concerns,
    m.themes,
    m.created_at
  from public.space_media_items m
  join public.communities c on c.id = m.community_id
  where m.share_with_other_communities
    and m.community_id <> p_community_id
    and (
      public.is_community_member(p_community_id, auth.uid())
      or exists (
        select 1 from public.communities own
        where own.id = p_community_id and own.privacy = 'public'
      )
    )
  order by m.created_at desc
  limit greatest(1, least(coalesce(p_limit, 300), 1000));
$$;

revoke all on function public.shared_media_items_from_other_communities(uuid, integer) from public;
grant execute on function public.shared_media_items_from_other_communities(uuid, integer) to anon, authenticated;
