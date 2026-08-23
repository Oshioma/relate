-- =============================================================================
-- Relate — a private community can still show its feed
--
-- One dropdown decided two unrelated things: whether a community is LISTED for
-- strangers to find, and whether a signed-out visitor may READ it. A community
-- that doesn't want to be advertised had no way to say "but do show people what
-- we're about" — its feed was a members-only gate to everyone who arrived by
-- link, which is the one moment it might have persuaded them to join.
--
-- `feed_public` is that second question, asked on its own. Privacy keeps
-- meaning discovery: public is listed, private is link-only, invite-only
-- doesn't resolve at all. A public community's feed is open as it always was;
-- a private one opens its feed only if it says so.
--
-- Invite-only overrides it in the database, not just the form: whatever the
-- flag says, a community whose whole point is not resolving for strangers
-- doesn't start doing so because a checkbox was left ticked before the switch.
--
-- What a guest actually sees is unchanged and still per-space:
-- `can_view_space(space_id, null)` is true only for spaces marked Public, so a
-- community with the feed open and every space members-only shows an empty
-- feed. That is the setting working, not failing.
--
-- Safe to re-run.
-- =============================================================================

alter table public.communities
  add column if not exists feed_public boolean not null default false;

comment on column public.communities.feed_public is
  'Let signed-out visitors read the feed of a community that is not public. Ignored for invite_only. See is_community_guest_readable.';

-- The question "may a signed-out visitor read this community", separate from
-- "is this community listed" (is_community_public), which keeps its meaning.
create or replace function public.is_community_guest_readable(p_community_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce(
    (
      select c.privacy <> 'invite_only' and (c.is_public or c.feed_public)
      from public.communities c
      where c.id = p_community_id
    ),
    false
  );
$$;

-- The shell's nav is part of reading the feed: without it a guest lands on a
-- community with no way to reach the public spaces the feed links to. (The
-- communities row itself already resolves for anon on public AND private — see
-- private_communities_visible_in_search — so nothing there needs widening.)
drop policy if exists "community_nav_links_select_anon" on public.community_nav_links;
create policy "community_nav_links_select_anon" on public.community_nav_links
  for select to anon
  using (public.is_community_guest_readable(community_id));

-- "Show events publicly" was implicitly "…and only if the community is public".
-- It now follows the same door as the feed, so a private community that opens
-- its feed can show its events too — still only if that box is ticked.
create or replace function public.is_community_events_public(p_community_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce(
    (
      select c.events_public and c.privacy <> 'invite_only' and (c.is_public or c.feed_public)
      from public.communities c
      where c.id = p_community_id
    ),
    false
  );
$$;
