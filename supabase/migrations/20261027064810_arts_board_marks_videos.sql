-- =============================================================================
-- Relate — 64 Arts board: videos on a square
--
-- video_urls: up to six videos of the family doing the art (a child singing,
-- say), played inside the flipped card. Each is either the member's own
-- upload (the 'uploads' bucket, or the space's private 'space-files' folder)
-- or a link to a video on a platform the card knows how to embed (YouTube,
-- Vimeo, Instagram, TikTok, Facebook; see src/lib/school/video-links.ts).
-- The server action checks which before storing; the table only caps the
-- count. Like the photos, they stay on the family's private board unless the
-- family shares the square.
--
-- Safe to re-run.
-- =============================================================================

alter table public.arts_board_marks
  add column if not exists video_urls text[] not null default '{}';

alter table public.arts_board_marks
  drop constraint if exists arts_board_marks_video_count;
alter table public.arts_board_marks
  add constraint arts_board_marks_video_count
  check (coalesce(array_length(video_urls, 1), 0) <= 6);
