-- Optionally re-open comments in a one-way space.
--
-- staff_post_only makes a space fully broadcast: staff-only posts AND staff-only
-- comments (see *_staff_post_only_comments.sql). allow_member_comments is an
-- override for the comment half only: when a space is one-way AND
-- allow_member_comments is true, members can reply to staff posts even though
-- they still can't start one. It has no effect on a non-one-way space (members
-- can already comment there) and none on posting (always staff-only when
-- staff_post_only).
--
-- Default false preserves today's behaviour: existing one-way spaces keep
-- comments locked until an admin opts in.
--
-- Rebuilds comments_insert_member on top of the previous version, adding the
-- override as one more OR in the staff-gate clause. is_community_member and
-- has_space_access (the paywall gate) are preserved verbatim.

alter table public.spaces
  add column if not exists allow_member_comments boolean not null default false;

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
          -- One-way space that has opted comments back in: members may comment.
          or s.allow_member_comments
          -- Otherwise a one-way space is staff-only for comments too.
          or public.is_community_staff(p.community_id, auth.uid())
        )
    )
  );
