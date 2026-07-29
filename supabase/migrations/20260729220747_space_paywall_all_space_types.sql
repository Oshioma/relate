-- =============================================================================
-- Relate — Per-space paywalls for ALL space types (one gate to rule them all)
--
-- The first two paywall migrations repointed content policies table-by-table
-- (posts/comments/resources, then courses/marketplace) from can_view_space()
-- onto has_space_access(). Every other space type (businesses, guides, clubs,
-- jobs, accommodation, recommendations, volunteer projects, challenges, journal,
-- live sessions, map landmarks, post reactions, …) still gates its content on
-- can_view_space(), so its reads and writes ignored the subscription.
--
-- Rather than re-list ~35 more policies (and miss the next space type someone
-- adds), we invert the relationship between the two gates:
--
--   * can_see_space_shell(space, user)  — pure VISIBILITY (the old
--     can_view_space body: public / members / private). Controls whether the
--     space's shell is listed and openable, so a paid space can still be seen
--     and show its paywall.
--   * has_space_access(space, user)     — visibility AND, for a paid space, an
--     active subscription (staff always pass). The real content gate.
--   * can_view_space(space, user)       — now simply delegates to
--     has_space_access. Because every existing content policy already calls
--     can_view_space, they ALL become paywall-aware at once — current types and
--     any added later — with no per-policy churn.
--
-- The only caller that must keep pure-visibility semantics is the space shell
-- (spaces_select), which we point at can_see_space_shell below. For FREE spaces
-- has_space_access == can_see_space_shell, so nothing changes for them. Paid
-- spaces are never public (spaces_public_is_free), so the anon policies — which
-- only ever match public spaces — need no change.
--
-- Note: this also makes the new-post / live notification triggers (which filter
-- recipients by can_view_space) access-aware — a member who hasn't subscribed to
-- a paid space no longer gets notified about content they can't open. That's
-- the intended behaviour.
--
-- Safe to re-run.
-- =============================================================================

-- 1. Pure visibility — the original can_view_space body, under a new name.
create or replace function public.can_see_space_shell(p_space_id uuid, p_user_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select case s.visibility
    when 'public' then true
    when 'members' then public.is_community_member(s.community_id, p_user_id)
    when 'private' then public.is_community_staff(s.community_id, p_user_id)
    else false
  end
  from public.spaces s
  where s.id = p_space_id;
$$;

-- 2. Access gate — same logic as before, but its free/else branch now calls
-- can_see_space_shell (NOT can_view_space) so that step 3 can't recurse.
create or replace function public.has_space_access(p_space_id uuid, p_user_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select case
    when s.id is null then false
    when public.is_community_staff(s.community_id, p_user_id) then true
    when s.price_cents > 0 then public.has_active_space_subscription(p_space_id, p_user_id)
    else public.can_see_space_shell(p_space_id, p_user_id)
  end
  -- left join guarantees exactly one row even when the space id doesn't exist,
  -- so `s.id is null` is reachable rather than collapsing to zero rows.
  from (select 1) _
  left join (select id, community_id, price_cents from public.spaces where id = p_space_id) s on true;
$$;

-- 3. can_view_space becomes the access-aware gate. Every content policy that
-- already calls it (all space types, current and future) now enforces the
-- paywall automatically. No recursion: this -> has_space_access -> (else)
-- can_see_space_shell, which calls neither.
create or replace function public.can_view_space(p_space_id uuid, p_user_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select public.has_space_access(p_space_id, p_user_id);
$$;

-- 4. Keep the space SHELL visible on pure visibility, so a member of a paid
-- space can still open it and be shown the paywall (otherwise the space would
-- vanish for non-subscribers and there'd be nothing to pay from).
drop policy if exists "spaces_select" on public.spaces;
create policy "spaces_select" on public.spaces
  for select to authenticated
  using (public.can_see_space_shell(id, auth.uid()));
