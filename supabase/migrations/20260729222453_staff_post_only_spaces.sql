-- Staff-only posting ("one-way") spaces.
--
-- A space with staff_post_only = true is a broadcast channel: only community
-- staff (owner/admin/moderator) can create posts in it, while ordinary members
-- can still read the feed — and comment/react, since this locks *posting*, not
-- engagement. The motivating case is a fan community's Announcements space,
-- where the artist broadcasts and fans shouldn't be able to start posts.
--
-- Enforcement is in Postgres, not just the UI: the posts INSERT policy gains a
-- clause that, when the target space is staff_post_only, additionally requires
-- the author to be staff.
--
-- This rebuilds posts_insert_member on top of the paywall-aware version from
-- 20260729185900_space_paywall.sql — the has_space_access() gate is preserved
-- verbatim, so paid ("premium") spaces keep requiring an active subscription to
-- post; the staff_post_only clause is layered on top. Read access
-- (posts_select) is left exactly as the paywall migration set it.

alter table public.spaces
  add column if not exists staff_post_only boolean not null default false;

drop policy if exists "posts_insert_member" on public.posts;
create policy "posts_insert_member" on public.posts
  for insert to authenticated
  with check (
    author_id = auth.uid()
    and public.is_community_member(community_id, auth.uid())
    -- Paywall gate (unchanged from the space_paywall migration): free spaces
    -- behave like can_view_space; paid spaces require an active subscription.
    and public.has_space_access(space_id, auth.uid())
    and (
      -- Open space (or a space that somehow lacks a row): any member may post.
      not coalesce((select s.staff_post_only from public.spaces s where s.id = posts.space_id), false)
      -- One-way space: only staff may post.
      or public.is_community_staff(community_id, auth.uid())
    )
  );
