-- Lock comments in one-way (staff_post_only) spaces.
--
-- staff_post_only already stops ordinary members from creating posts in a
-- broadcast space (see *_staff_post_only_spaces.sql). This extends that to
-- comments: in a one-way space only staff may comment too, so an Announcements
-- space is genuinely broadcast — staff post and reply, members read (and can
-- still react, which is governed by post_reactions, not this policy).
--
-- Rebuilds comments_insert_member on top of the paywall-aware version from
-- 20260729185900_space_paywall.sql: the is_community_member + has_space_access
-- checks are preserved verbatim (so paid spaces still require a subscription to
-- comment), with the staff-only-when-one-way clause layered on. The space's
-- staff_post_only flag is reached by joining through the comment's post.

drop policy if exists "comments_insert_member" on public.comments;
create policy "comments_insert_member" on public.comments
  for insert to authenticated
  with check (
    author_id = auth.uid()
    and exists (
      select 1
      from public.posts p
      join public.spaces s on s.id = p.space_id
      where p.id = post_id
        and public.is_community_member(p.community_id, auth.uid())
        and public.has_space_access(p.space_id, auth.uid())
        and (
          -- Open space: any member may comment.
          not s.staff_post_only
          -- One-way space: only staff may comment.
          or public.is_community_staff(p.community_id, auth.uid())
        )
    )
  );
