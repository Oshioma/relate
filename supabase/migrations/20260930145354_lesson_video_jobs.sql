-- =============================================================================
-- Relate — Lessons from a video link
--
-- Two additions, one feature: a teacher pastes a YouTube / Facebook / Instagram
-- link, an external worker (workers/video-transcriber) downloads and
-- transcribes it, the transcript lands in the composer to be checked, and the
-- lesson it becomes can show the video it came from.
--
-- lesson_video_jobs
--   One row per transcription request. An hour-long video takes a minute or
--   three to download and transcribe — far longer than anyone should have to
--   hold a request open for — so the work runs on the worker and this row is
--   where the app keeps track of it. The composer polls it; closing the
--   composer and coming back finds it again.
--
--   The app, not the worker, writes every column here. The worker holds no
--   database credentials: the status route asks it how a job is going and
--   copies the answer in, as the person who started the job. So RLS is simply
--   "your own jobs", and the insert additionally requires staff, matching who
--   may write a lesson at all.
--
--   The transcript is private to whoever requested it. Once it becomes a
--   lesson it is that lesson's source_text, and the lesson's own rules apply.
--
-- space_lessons.video_url
--   The video to show at the top of a lesson. Separate from source_url on
--   purpose: source_url is provenance and private by default (redactSource
--   blanks it for members), whereas the video is part of the lesson — the
--   thing a child is meant to watch alongside it. Null for every lesson that
--   didn't come from a video.
--
-- All additive. Safe to re-run.
-- =============================================================================

create table if not exists public.lesson_video_jobs (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces (id) on delete cascade,
  community_id uuid not null references public.communities (id) on delete cascade,
  created_by uuid not null references public.profiles (id) on delete cascade,

  -- The link as the teacher gave it, normalised by the app.
  source_url text not null,

  -- queued → downloading → transcribing → done, or error at any point.
  status text not null default 'queued',
  -- 0..1, for a progress bar. Coarse: the worker only knows chunk boundaries.
  progress real not null default 0,
  -- A short human sentence about the current step, straight from the worker.
  message text,

  title text,
  duration_seconds integer,
  -- 'captions' when the platform already had them (free), 'whisper' when the
  -- audio had to be transcribed (paid, pennies).
  method text,
  transcript text,
  error text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint lesson_video_jobs_status_check
    check (status in ('queued', 'downloading', 'transcribing', 'done', 'error')),
  constraint lesson_video_jobs_method_check
    check (method is null or method in ('captions', 'whisper')),
  constraint lesson_video_jobs_source_url_http
    check (source_url ~* '^https?://')
);

drop trigger if exists set_updated_at on public.lesson_video_jobs;
create trigger set_updated_at before update on public.lesson_video_jobs
  for each row execute function public.set_updated_at();

-- The composer lists "your recent videos in this space", newest first.
create index if not exists idx_lesson_video_jobs_owner
  on public.lesson_video_jobs (created_by, space_id, created_at desc);

alter table public.lesson_video_jobs enable row level security;

drop policy if exists "lesson_video_jobs_select_own" on public.lesson_video_jobs;
create policy "lesson_video_jobs_select_own" on public.lesson_video_jobs
  for select to authenticated
  using (created_by = auth.uid());

-- Staff only, like writing a lesson: every job may spend money.
drop policy if exists "lesson_video_jobs_insert_staff" on public.lesson_video_jobs;
create policy "lesson_video_jobs_insert_staff" on public.lesson_video_jobs
  for insert to authenticated
  with check (
    created_by = auth.uid()
    and public.is_community_staff(community_id, auth.uid())
    and public.can_view_space(space_id, auth.uid())
  );

-- The status route copies the worker's progress in as the job's owner.
drop policy if exists "lesson_video_jobs_update_own" on public.lesson_video_jobs;
create policy "lesson_video_jobs_update_own" on public.lesson_video_jobs
  for update to authenticated
  using (created_by = auth.uid())
  with check (created_by = auth.uid());

drop policy if exists "lesson_video_jobs_delete_own" on public.lesson_video_jobs;
create policy "lesson_video_jobs_delete_own" on public.lesson_video_jobs
  for delete to authenticated
  using (created_by = auth.uid());

alter table public.space_lessons
  add column if not exists video_url text;

comment on column public.space_lessons.video_url is
  'A YouTube / Facebook / Instagram video shown at the top of the lesson, when it was written from one. Part of the lesson, not its private provenance.';

alter table public.space_lessons
  drop constraint if exists space_lessons_video_url_http;
alter table public.space_lessons
  add constraint space_lessons_video_url_http
  check (video_url is null or video_url ~* '^https?://');
