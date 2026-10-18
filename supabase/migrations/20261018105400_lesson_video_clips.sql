-- =============================================================================
-- Relate — Lessons from part of a long video
--
-- The video worker transcribes at most three hours of one video for a lesson.
-- It used to refuse anything longer; now a teacher can pick the part to use
-- (from / to), and a longer video with no part picked uses its first three
-- hours. The lesson then plays just that part.
--
-- lesson_video_jobs.clip_start_seconds / clip_end_seconds
--   The part asked for when the job starts, replaced by the part the worker
--   actually used once it knows the video's length. Null end: to the end.
--
-- space_lessons.video_start_seconds / video_end_seconds
--   Where the lesson's video starts and stops playing. Null for every lesson
--   that uses its whole video, which is all of them before this.
--
-- All additive. Safe to re-run.
-- =============================================================================

alter table public.lesson_video_jobs
  add column if not exists clip_start_seconds integer,
  add column if not exists clip_end_seconds integer;

alter table public.lesson_video_jobs
  drop constraint if exists lesson_video_jobs_clip_check;
alter table public.lesson_video_jobs
  add constraint lesson_video_jobs_clip_check
  check (
    (clip_start_seconds is null or clip_start_seconds >= 0)
    and (clip_end_seconds is null or clip_end_seconds > coalesce(clip_start_seconds, 0))
  );

alter table public.space_lessons
  add column if not exists video_start_seconds integer,
  add column if not exists video_end_seconds integer;

alter table public.space_lessons
  drop constraint if exists space_lessons_video_clip_check;
alter table public.space_lessons
  add constraint space_lessons_video_clip_check
  check (
    (video_start_seconds is null or video_start_seconds >= 0)
    and (video_end_seconds is null or video_end_seconds > coalesce(video_start_seconds, 0))
  );

comment on column public.space_lessons.video_start_seconds is
  'Where the lesson''s video starts playing, when the lesson was written from only part of it.';
comment on column public.space_lessons.video_end_seconds is
  'Where the lesson''s video stops playing, when the lesson was written from only part of it.';
