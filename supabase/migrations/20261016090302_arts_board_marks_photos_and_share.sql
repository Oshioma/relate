-- =============================================================================
-- Relate — 64 Arts board: photos on a done square, and sharing it
--
-- photo_urls: up to four photos of what the family made, uploaded to the
-- member's own folder in the shared 'uploads' bucket (the bucket's RLS keeps
-- writes to `<their id>/…`). Over a year the board becomes a portfolio.
--
-- shared_post_id: the community post made when the family chose "Share",
-- so the card can link to it instead of offering to share twice. The post is
-- an ordinary post in one of the community's discussion spaces, written by
-- the family under the posts table's own policies. Deleting the post clears
-- the link, and the square can be shared again.
--
-- The board itself stays private (see arts_board_marks); only what a family
-- shares becomes visible to others, as a post.
--
-- Safe to re-run.
-- =============================================================================

alter table public.arts_board_marks
  add column if not exists photo_urls text[] not null default '{}';

alter table public.arts_board_marks
  add column if not exists shared_post_id uuid references public.posts (id) on delete set null;

alter table public.arts_board_marks
  drop constraint if exists arts_board_marks_photo_count;
alter table public.arts_board_marks
  add constraint arts_board_marks_photo_count
  check (coalesce(array_length(photo_urls, 1), 0) <= 4);
