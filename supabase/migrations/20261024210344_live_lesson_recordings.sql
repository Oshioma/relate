-- =============================================================================
-- Relate — recording live course lessons (Growth and Pro plans)
--
-- The host presses Record in a live lesson's video room (8x8 JaaS). When the
-- room ends, JaaS posts RECORDING_UPLOADED to /api/jaas/webhook with a link
-- that works for 24 hours; the app copies the .mp4 into the private
-- 'course-recordings' bucket and the lesson plays it as its playback. Only
-- people who can open the lesson get a (short-lived, signed) link to it.
--
--   'session_recording'   new plan feature, on Growth and Pro. Gates the
--                         Record button (the JaaS token) and the copy.
--
--   course_live_rooms     which lesson a JaaS room belongs to. Room names are
--                         an HMAC of the lesson id, so the webhook can't work
--                         the lesson out from the name; the app notes the pair
--                         when it hands out a room. Service role only.
--
--   course_lesson_recordings
--                         one row per recording JaaS reports: copied, or
--                         failed with the reason and the 24-hour link so the
--                         team can still download it by hand. The newest
--                         'saved' one is the lesson's playback.
--
-- Safe to re-run.
-- =============================================================================

-- --- Plan feature --------------------------------------------------------------
update public.platform_plans
set features = array_append(features, 'session_recording')
where slug in ('growth', 'pro') and not ('session_recording' = any(features));

-- --- Rooms ----------------------------------------------------------------------
create table if not exists public.course_live_rooms (
  room_name text primary key,
  lesson_id uuid not null references public.course_lessons (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists idx_course_live_rooms_lesson on public.course_live_rooms (lesson_id);

-- No policies: only the service role (the app's server) reads or writes it.
alter table public.course_live_rooms enable row level security;

-- --- Recordings -------------------------------------------------------------------
create table if not exists public.course_lesson_recordings (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.course_lessons (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  community_id uuid not null references public.communities (id) on delete cascade,
  -- JaaS's idempotencyKey: the same event delivered twice is one recording.
  idempotency_key text not null unique,
  jaas_session_id text,
  status text not null default 'copying',
  storage_path text,
  -- The JaaS download link (valid 24 hours), kept when the copy fails.
  source_url text,
  error text,
  duration_seconds integer,
  recorded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint course_lesson_recordings_status_check check (status in ('copying', 'saved', 'failed'))
);

create index if not exists idx_course_lesson_recordings_lesson on public.course_lesson_recordings (lesson_id, created_at desc);

drop trigger if exists set_updated_at on public.course_lesson_recordings;
create trigger set_updated_at before update on public.course_lesson_recordings
  for each row execute function public.set_updated_at();

alter table public.course_lesson_recordings enable row level security;

-- The team sees how each recording went (Manage shows it). Members never read
-- this table: the course page hands them a signed link instead.
drop policy if exists "course_lesson_recordings_select_staff" on public.course_lesson_recordings;
create policy "course_lesson_recordings_select_staff" on public.course_lesson_recordings
  for select to authenticated
  using (public.is_community_staff(community_id, auth.uid()));

drop policy if exists "course_lesson_recordings_delete_staff" on public.course_lesson_recordings;
create policy "course_lesson_recordings_delete_staff" on public.course_lesson_recordings
  for delete to authenticated
  using (public.is_community_staff(community_id, auth.uid()));

-- --- Storage ----------------------------------------------------------------------
-- Private, and no object policies: the server writes with the service role and
-- serves signed links. 5 GB per file (an hour of video is well under 1 GB).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('course-recordings', 'course-recordings', false, 5368709120, array['video/mp4'])
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;
