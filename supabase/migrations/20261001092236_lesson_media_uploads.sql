-- =============================================================================
-- Relate — lessons from an uploaded video or audio file
--
-- The composer could only transcribe a YouTube / Facebook / Instagram link.
-- Plenty of teaching material is a recording on somebody's own computer — a
-- talk, a lecture, a voice memo — so the composer now also takes a file.
--
-- Two ways in, by size:
--
--   'file'    Up to the 'uploads' bucket's 200 MB limit. The browser puts the
--             file in Storage under the uploader's own folder
--             (<user-id>/lesson-media/<uuid>.<ext>), the worker fetches it from
--             its public URL, and the file is KEPT so the lesson can play it.
--   'direct'  Bigger than that. The browser sends the file straight to the
--             worker with a short-lived signed token; it is transcribed and
--             thrown away, so the lesson has nothing to play.
--   'link'    What there was before: a video link, fetched with yt-dlp.
--
-- lesson_video_jobs
--   kind          which of the three a job is.
--   file_name     the name the file had on the teacher's computer, for the list.
--   storage_path  'file' jobs only: the object in 'uploads'. Pruning an old job
--                 deletes the object too, unless a lesson still plays it.
--   source_url    now only required for links: an upload has no link, and a
--                 kept file's address is derived from storage_path rather than
--                 stored twice.
--
-- space_lessons
--   media_path    a kept upload (object path in 'uploads') to play at the top of
--                 the lesson, like video_url does for a link. Part of the
--                 lesson, not private provenance — the bucket is public anyway.
--   media_type    'video' or 'audio', so the page knows which player to use
--                 without fetching the file.
--
-- Additive. Safe to re-run.
-- =============================================================================

alter table public.lesson_video_jobs
  add column if not exists kind text not null default 'link',
  add column if not exists file_name text,
  add column if not exists storage_path text;

alter table public.lesson_video_jobs
  drop constraint if exists lesson_video_jobs_kind_check;
alter table public.lesson_video_jobs
  add constraint lesson_video_jobs_kind_check
  check (kind in ('link', 'file', 'direct'));

alter table public.lesson_video_jobs
  alter column source_url drop not null;

-- A link still has to be a real http(s) link; an upload has no link at all.
alter table public.lesson_video_jobs
  drop constraint if exists lesson_video_jobs_source_url_http;
alter table public.lesson_video_jobs
  add constraint lesson_video_jobs_source_url_http
  check ((kind = 'link' and source_url ~* '^https?://') or kind <> 'link');

alter table public.space_lessons
  add column if not exists media_path text,
  add column if not exists media_type text;

alter table public.space_lessons
  drop constraint if exists space_lessons_media_type_check;
alter table public.space_lessons
  add constraint space_lessons_media_type_check
  check (media_type is null or media_type in ('video', 'audio'));

comment on column public.space_lessons.media_path is
  'An uploaded video or audio file (object path in the public ''uploads'' bucket) played at the top of the lesson, when it was written from one.';
comment on column public.space_lessons.media_type is
  '''video'' or ''audio'' — which player media_path needs.';

-- The prune asks "does any lesson still play this file?" before deleting one.
create index if not exists idx_space_lessons_media_path
  on public.space_lessons (media_path)
  where media_path is not null;
