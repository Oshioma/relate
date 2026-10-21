-- =============================================================================
-- Relate — who can join, asked separately from who can find the community
--
-- `privacy` has answered two questions at once: is the community LISTED, and
-- how do people JOIN. public = listed + anyone joins; private = unlisted + ask
-- and staff approve; invite_only = hidden + invitation. So a listed community
-- couldn't vet its members, and an unlisted one couldn't let anyone with the
-- link straight in.
--
-- `join_policy` is the second question on its own: 'open' | 'approval' |
-- 'invite'. NULL means "whatever privacy implies", which is exactly the rule
-- every community has followed until now — so every existing row is NULL and
-- behaves as it did. Only an admin choosing a different combination writes it.
--
-- Hidden (invite_only) stays invitation only whatever the column says: a
-- community that doesn't resolve for strangers has nobody to let in.
--
-- Supported combinations:
--   public      + open (NULL)      listed, anyone joins
--   public      + approval         listed, ask to join
--   private     + open             unlisted, anyone with the link joins
--   private     + approval (NULL)  unlisted, ask to join
--   invite_only + (ignored)        hidden, invitation only
--
-- Safe to re-run.
-- =============================================================================

alter table public.communities
  add column if not exists join_policy text;

alter table public.communities
  drop constraint if exists communities_join_policy_check;
alter table public.communities
  add constraint communities_join_policy_check check (join_policy is null or join_policy in ('open', 'approval', 'invite'));

comment on column public.communities.join_policy is
  'How people join: open | approval | invite. NULL = follow privacy (public open, private approval, invite_only invite). Ignored for invite_only. See community_join_policy().';

-- The one place the rule lives. RLS below, and the app's join buttons (via
-- src/lib/join-policy.ts), ask this.
create or replace function public.community_join_policy(p_community_id uuid)
returns text
language sql
security definer
stable
set search_path = public
as $$
  select case
    when c.privacy = 'invite_only' then 'invite'
    when c.join_policy is not null then c.join_policy
    when c.privacy = 'public' then 'open'
    else 'approval'
  end
  from public.communities c
  where c.id = p_community_id;
$$;

grant execute on function public.community_join_policy(uuid) to anon, authenticated;

-- Join requests: now any community whose policy is approval, listed or not.
create or replace function public.is_community_request_joinable(p_community_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce(public.community_join_policy(p_community_id) = 'approval', false);
$$;

-- Self-join: any community whose policy is open. Same pinned role and status
-- as before (20260905121810_community_join_requests), so a self-inserted row
-- can still only ever be an ordinary active member or a pending request.
drop policy if exists "memberships_insert" on public.community_memberships;
create policy "memberships_insert" on public.community_memberships
  for insert to authenticated
  with check (
    (
      user_id = auth.uid()
      and role = 'member'
      and status = 'active'
      and coalesce(public.community_join_policy(community_id) = 'open', false)
    )
    or (
      user_id = auth.uid()
      and role = 'member'
      and status = 'requested'
      and public.is_community_request_joinable(community_id)
    )
    or public.is_community_admin(community_id, auth.uid())
  );
