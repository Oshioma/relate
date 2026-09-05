-- =============================================================================
-- Relate — request to join a private community
--
-- Builds on the 'requested' membership_status added in the previous migration:
-- the RLS that lets a visitor create such a row (and stops them promoting it
-- themselves), plus the two notifications that make the request visible to
-- staff and the decision visible to the person who asked.
--
-- Who may request: a 'private' community only. 'public' is self-join, so a
-- request there would be a pointless extra step; 'invite_only' is "Hidden" and
-- doesn't resolve for a non-member at all, so there is nobody to do the asking.
-- is_community_request_joinable is the one place that rule lives.
--
-- SECURITY FIX, folded in here because it is the same policy: the old
-- memberships_insert self-join branch constrained *who* the row was for and
-- *which* community, but not the role or status it carried —
--
--     (user_id = auth.uid() and public.is_community_public(community_id))
--
-- — so any authenticated user could insert themselves into any public community
-- as role 'owner' with status 'active', and every RLS helper below
-- (is_community_admin and friends) would then agree they were staff. The
-- branch now pins role = 'member' and status = 'active', which is exactly what
-- joinCommunity has always written. Admin-authored rows are unaffected: they go
-- through the is_community_admin branch, which still allows any role.
--
-- Safe to re-run.
-- =============================================================================

-- Which communities accept a join request. Kept as a function so the policy and
-- any future caller share one definition of the rule.
create or replace function public.is_community_request_joinable(p_community_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.communities c
    where c.id = p_community_id
      and c.privacy = 'private'
  );
$$;

drop policy if exists "memberships_insert" on public.community_memberships;
create policy "memberships_insert" on public.community_memberships
  for insert to authenticated
  with check (
    -- self-join a public community, as an ordinary active member and nothing else
    (
      user_id = auth.uid()
      and role = 'member'
      and status = 'active'
      and public.is_community_public(community_id)
    )
    -- or ask to join a private one: a row that grants nothing until staff act
    or (
      user_id = auth.uid()
      and role = 'member'
      and status = 'requested'
      and public.is_community_request_joinable(community_id)
    )
    -- or an owner/admin adding/inviting someone else
    or public.is_community_admin(community_id, auth.uid())
  );

-- A pending request must not be self-approvable. The previous USING clause let
-- a user update any row of their own, and the WITH CHECK only required
-- role = 'member' — which a 'requested' row already is — so the requester could
-- have set their own status to 'active' and walked in. Excluding 'requested'
-- rows from the self branch closes that: only the admin branch can move a
-- request out of the state it was created in. Withdrawing is a DELETE, which
-- memberships_delete_admin_or_self already allows for one's own row.
--
-- Every other branch is the shipped policy from admins_can_manage_staff.
drop policy if exists "memberships_update_admin_or_self" on public.community_memberships;
create policy "memberships_update_admin_or_self" on public.community_memberships
  for update to authenticated
  using (
    (user_id = auth.uid() and status <> 'requested')
    or public.is_community_owner(community_id, auth.uid())
    or (
      public.is_community_admin(community_id, auth.uid())
      and role <> 'owner'
      and (role = 'member' or public.community_allows_admin_staff_mgmt(community_id))
    )
  )
  with check (
    (user_id = auth.uid() and role = 'member')
    or public.is_community_owner(community_id, auth.uid())
    or (
      public.is_community_admin(community_id, auth.uid())
      and role <> 'owner'
      and (role = 'member' or public.community_allows_admin_staff_mgmt(community_id))
    )
  );

-- -----------------------------------------------------------------------------
-- Notifications
-- -----------------------------------------------------------------------------

-- Staff are told someone asked. notify_staff_new_member covers the 'active'
-- case and returns early for anything else, so a request would otherwise be
-- silent — the whole point of the feature is that an admin finds out without
-- being told off-platform. The link goes to the admin page, where the request
-- is actionable.
create or replace function public.notify_staff_join_request()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_community_name text;
  v_community_slug text;
  v_actor_name text;
begin
  if new.status != 'requested' then
    return new;
  end if;

  select name, slug into v_community_name, v_community_slug
  from public.communities where id = new.community_id;

  select coalesce(full_name, username) into v_actor_name
  from public.profiles where id = new.user_id;

  insert into public.notifications (user_id, community_id, type, title, link, actor_id)
  select
    m.user_id,
    new.community_id,
    'membership',
    coalesce(v_actor_name, 'Someone') || ' asked to join ' || v_community_name,
    '/c/' || v_community_slug || '/admin',
    new.user_id
  from public.community_memberships m
  where m.community_id = new.community_id
    and m.status = 'active'
    and m.role in ('owner', 'admin')
    and m.user_id != new.user_id;

  return new;
end;
$$;

drop trigger if exists trg_notify_staff_join_request on public.community_memberships;
create trigger trg_notify_staff_join_request
  after insert on public.community_memberships
  for each row execute function public.notify_staff_join_request();

-- The requester is told the answer. Approval is an UPDATE, and both
-- notify_membership_added ("You joined X") and notify_staff_new_member fire on
-- INSERT only, so without this the person who asked would be let in with no
-- sign that anything had happened. A decline deletes the row and is not
-- announced — there is nothing useful to say, and saying it invites an argument
-- with the admin who declined.
create or replace function public.notify_join_request_approved()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_community_name text;
  v_community_slug text;
begin
  if old.status != 'requested' or new.status != 'active' then
    return new;
  end if;

  select name, slug into v_community_name, v_community_slug
  from public.communities where id = new.community_id;

  insert into public.notifications (user_id, community_id, type, title, link)
  values (
    new.user_id,
    new.community_id,
    'membership',
    'You''re now a member of ' || v_community_name,
    '/c/' || v_community_slug
  );

  return new;
end;
$$;

drop trigger if exists trg_notify_join_request_approved on public.community_memberships;
create trigger trg_notify_join_request_approved
  after update on public.community_memberships
  for each row execute function public.notify_join_request_approved();
