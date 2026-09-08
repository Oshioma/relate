-- =============================================================================
-- Relate — draft spaces (built for Custom Pages, honest for every type).
--
-- Saving a Custom Page published it, because there was no other state a space
-- could be in. Writing one therefore meant writing it in public: members
-- watched half-finished paragraphs appear and disappear in a space that was
-- already in their sidebar.
--
-- `published` gives a space somewhere to be written. Default TRUE, so every
-- space that exists today stays exactly as visible as it is now, and only the
-- new-page path (see createSpace) starts anything at false.
--
-- A DRAFT IS ENFORCED IN THE DATABASE, NOT THE UI. Hiding a draft in the nav
-- and leaving the row readable would make "draft" a decoration — the space
-- would still be one guessed URL away. So all three read paths are closed
-- here, and the app layer is left with nothing to get wrong:
--
--   1. can_see_space_shell — the signed-in visibility gate every content
--      policy reaches through can_view_space. A draft resolves to staff-only,
--      whatever its visibility says.
--   2. has_space_access    — the paywall gate. It answers before consulting
--      the shell for a PAID space, so without a branch of its own a draft paid
--      space would still open for anyone holding a subscription.
--   3. spaces_select_anon  — signed-out readers, who match on
--      `visibility = 'public'` alone and would otherwise see a draft public
--      page, which is the worst of the three.
--
-- Staff keep seeing drafts everywhere, because somebody has to write them.
--
-- Safe to re-run.
-- =============================================================================

alter table public.spaces
  add column if not exists published boolean not null default true;

-- 1. Signed-in visibility. Same three-way rule as before, with a draft short-
-- circuiting to staff-only ahead of it.
create or replace function public.can_see_space_shell(p_space_id uuid, p_user_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select case
    when not s.published then public.is_community_staff(s.community_id, p_user_id)
    when s.visibility = 'public' then true
    when s.visibility = 'members' then public.is_community_member(s.community_id, p_user_id)
    when s.visibility = 'private' then public.is_community_staff(s.community_id, p_user_id)
    else false
  end
  from public.spaces s
  where s.id = p_space_id;
$$;

-- 2. Access gate. Staff still pass first (they write the drafts); the new
-- branch sits immediately after, so it is reached by everyone else BEFORE the
-- paid-subscription branch that would otherwise let a subscriber in.
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
    when not s.published then false
    when s.price_cents > 0 then public.has_active_space_subscription(p_space_id, p_user_id)
    else public.can_see_space_shell(p_space_id, p_user_id)
  end
  -- left join guarantees exactly one row even when the space id doesn't exist,
  -- so `s.id is null` is reachable rather than collapsing to zero rows.
  from (select 1) _
  left join (select id, community_id, price_cents, published from public.spaces where id = p_space_id) s on true;
$$;

-- 3. Signed-out readers. A draft is never public, whatever its visibility.
drop policy if exists "spaces_select_anon" on public.spaces;
create policy "spaces_select_anon" on public.spaces
  for select to anon
  using (visibility = 'public' and published);
