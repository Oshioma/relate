-- =============================================================================
-- Relate — Guided Journey spaces ("Adopt a Beginner")
--
-- One reusable space type for every "someone experienced takes a beginner
-- under their wing" programme: Adopt a Beginner (gardening), Adopt a New
-- Sailor, Adopt a Beginner Cook… The application code is the same for all of
-- them; what differs lives in data:
--
--   guided_journey_spaces     one row per space: preset + config overrides
--                             (terminology, hero, stages, onboarding question
--                             labels/options, gallery wording, safety copy)
--   journey_templates         "My First Tomatoes": a starting set of
--                             milestones a mentor and beginner copy and adapt
--   journey_beginner_profiles a member's answers to the short onboarding
--   journey_mentor_profiles   a member who offers to help, with capacity,
--                             pause switch and a level (experienced /
--                             community / first-harvest helper) that is
--                             distinct from staff verification
--   mentorship_requests       beginner asks → mentor explicitly accepts or
--                             declines. Nobody is ever assigned automatically.
--   journeys                  the shared journey created on acceptance
--   journey_participants      who is on it (one mentor, one or more
--                             beginners — group journeys use the same shape)
--   journey_milestones        the journey's own copy of the milestones,
--                             editable for crop and climate
--   journey_updates           weekly progress posts (photos, question,
--                             problems, milestone status) and the replies
--   journey_stories           opt-in public "growing stories" for the
--                             community gallery
--   journey_reports           members flag people or content to staff
--
-- Reused rather than rebuilt: profiles (no second profile system — these rows
-- only hold what the journey needs), direct messages for private chat,
-- notifications (+ their email/push triggers), member_blocks /
-- is_blocked_between for blocking, and the 'uploads' storage bucket for
-- photos (URLs are stored here, files live there).
--
-- Status transitions that must be atomic or must check more than one row
-- (accepting a request creates a journey and its participants and copies
-- milestones; capacity is checked against live journeys) go through
-- SECURITY DEFINER functions at the bottom, and guard triggers stop members
-- from editing staff-owned or status columns directly.
--
-- Safe to re-run.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Helpers
-- -----------------------------------------------------------------------------

-- The community a space belongs to. SECURITY DEFINER so RLS policies on the
-- tables below can ask without recursing through spaces' own policies.
create or replace function public.space_community_id(p_space_id uuid)
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select community_id from public.spaces where id = p_space_id;
$$;

-- True when the caller is staff (owner/admin/moderator) of the space's community.
create or replace function public.is_space_staff(p_space_id uuid, p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.is_community_staff(public.space_community_id(p_space_id), p_user_id), false);
$$;

-- -----------------------------------------------------------------------------
-- guided_journey_spaces: the per-space configuration
-- -----------------------------------------------------------------------------
create table if not exists public.guided_journey_spaces (
  space_id uuid primary key references public.spaces (id) on delete cascade,
  -- Which built-in preset the config overrides are layered on
  -- (src/lib/guided-journey/presets.ts): 'gardening', 'sailing', 'cooking', …
  preset_key text not null default 'gardening',
  -- Partial overrides of the preset, validated in TypeScript
  -- (src/lib/guided-journey/config.ts). Unknown keys are ignored there.
  config jsonb not null default '{}'::jsonb,
  -- Admin switches: pause new mentor sign-ups / new beginner requests space-wide.
  accepting_mentors boolean not null default true,
  accepting_beginners boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint guided_journey_spaces_config_object check (jsonb_typeof(config) = 'object')
);

drop trigger if exists set_updated_at on public.guided_journey_spaces;
create trigger set_updated_at before update on public.guided_journey_spaces
  for each row execute function public.set_updated_at();

alter table public.guided_journey_spaces enable row level security;

drop policy if exists "guided_journey_spaces_select" on public.guided_journey_spaces;
create policy "guided_journey_spaces_select" on public.guided_journey_spaces
  for select to authenticated
  using (public.can_view_space(space_id, auth.uid()));

drop policy if exists "guided_journey_spaces_select_anon" on public.guided_journey_spaces;
create policy "guided_journey_spaces_select_anon" on public.guided_journey_spaces
  for select to anon
  using (public.can_view_space(space_id, null));

-- Configuration is an admin job (same bar as editing the space itself).
drop policy if exists "guided_journey_spaces_write_admin" on public.guided_journey_spaces;
create policy "guided_journey_spaces_write_admin" on public.guided_journey_spaces
  for all to authenticated
  using (public.is_community_admin(public.space_community_id(space_id), auth.uid()))
  with check (public.is_community_admin(public.space_community_id(space_id), auth.uid()));

-- -----------------------------------------------------------------------------
-- journey_templates: starting milestones for a kind of journey
-- -----------------------------------------------------------------------------
create table if not exists public.journey_templates (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  -- What is being learned: "Tomatoes", "Dinghy basics". Drives matching and
  -- the gallery's subject filter.
  subject text,
  summary text,
  cover_image_url text,
  -- Deliberately approximate: "About 10 weeks — longer in cooler climates".
  duration_label text,
  expected_weeks integer check (expected_weeks is null or expected_weeks between 1 and 104),
  -- [{ "title": "...", "description": "..." }, …] — copied into
  -- journey_milestones when a journey starts, then edited per journey.
  milestones jsonb not null default '[]'::jsonb check (jsonb_typeof(milestones) = 'array'),
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_journey_templates_space on public.journey_templates (space_id, sort_order);

drop trigger if exists set_updated_at on public.journey_templates;
create trigger set_updated_at before update on public.journey_templates
  for each row execute function public.set_updated_at();

alter table public.journey_templates enable row level security;

drop policy if exists "journey_templates_select" on public.journey_templates;
create policy "journey_templates_select" on public.journey_templates
  for select to authenticated
  using (public.can_view_space(space_id, auth.uid()));

drop policy if exists "journey_templates_select_anon" on public.journey_templates;
create policy "journey_templates_select_anon" on public.journey_templates
  for select to anon
  using (is_active and public.can_view_space(space_id, null));

drop policy if exists "journey_templates_write_staff" on public.journey_templates;
create policy "journey_templates_write_staff" on public.journey_templates
  for all to authenticated
  using (public.is_space_staff(space_id, auth.uid()))
  with check (public.is_space_staff(space_id, auth.uid()));

-- -----------------------------------------------------------------------------
-- journey_mentor_profiles
-- -----------------------------------------------------------------------------
create table if not exists public.journey_mentor_profiles (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  -- Self-described standing, never inferred: 'experienced' (years of
  -- practice), 'community' (a member happy to help), 'first_harvest' (has
  -- completed one journey here and can help with exactly that).
  level text not null default 'community' check (level in ('experienced', 'community', 'first_harvest')),
  -- Staff-only: a verified professional / vetted expert. Separate from level
  -- so community advice is never presented as professional expertise.
  is_verified boolean not null default false,
  verified_note text,
  experience text[] not null default '{}',      -- what they have grown / done
  preferred_topics text[] not null default '{}', -- what they like helping with
  country text,
  region text,
  climate text,
  years_experience integer check (years_experience is null or years_experience between 0 and 90),
  languages text[] not null default '{}',
  help_mode text not null default 'either' check (help_mode in ('online', 'local', 'either')),
  capacity integer not null default 1 check (capacity between 1 and 20),
  group_mentoring boolean not null default false,
  availability text,
  intro text check (intro is null or char_length(intro) <= 2000),
  photos text[] not null default '{}',
  is_paused boolean not null default false,
  -- Staff-only eligibility switch. A suspended mentor is hidden from discovery.
  status text not null default 'active' check (status in ('active', 'suspended')),
  -- Direct mentoring is adult-only. Relate keeps no date of birth, so this is
  -- an explicit self-declaration, required to exist at all.
  adult_confirmed_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (space_id, user_id)
);

create index if not exists idx_journey_mentor_profiles_space on public.journey_mentor_profiles (space_id) where status = 'active';

drop trigger if exists set_updated_at on public.journey_mentor_profiles;
create trigger set_updated_at before update on public.journey_mentor_profiles
  for each row execute function public.set_updated_at();

-- Members may edit their own profile but not the staff-owned columns.
create or replace function public.journey_mentor_profiles_guard()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if current_user not in ('authenticated', 'anon') then
    return new; -- service role, migrations and SECURITY DEFINER functions
  end if;
  if public.is_space_staff(new.space_id, auth.uid()) then
    return new;
  end if;
  if tg_op = 'INSERT' then
    new.is_verified := false;
    new.verified_note := null;
    new.status := 'active';
  else
    new.is_verified := old.is_verified;
    new.verified_note := old.verified_note;
    new.status := old.status;
    new.space_id := old.space_id;
    new.user_id := old.user_id;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_journey_mentor_profiles_guard on public.journey_mentor_profiles;
create trigger trg_journey_mentor_profiles_guard before insert or update on public.journey_mentor_profiles
  for each row execute function public.journey_mentor_profiles_guard();

alter table public.journey_mentor_profiles enable row level security;

-- Members of the space see active, unblocked mentors; you always see your own;
-- staff see everyone (including suspended) to manage eligibility.
drop policy if exists "journey_mentor_profiles_select" on public.journey_mentor_profiles;
create policy "journey_mentor_profiles_select" on public.journey_mentor_profiles
  for select to authenticated
  using (
    user_id = auth.uid()
    or public.is_space_staff(space_id, auth.uid())
    or (
      status = 'active'
      and public.can_view_space(space_id, auth.uid())
      and public.is_community_member(public.space_community_id(space_id), auth.uid())
      and not public.is_blocked_between(user_id, auth.uid())
    )
  );

drop policy if exists "journey_mentor_profiles_insert_self" on public.journey_mentor_profiles;
create policy "journey_mentor_profiles_insert_self" on public.journey_mentor_profiles
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and public.can_view_space(space_id, auth.uid())
    and public.is_community_member(public.space_community_id(space_id), auth.uid())
    and exists (
      select 1 from public.guided_journey_spaces g
      where g.space_id = journey_mentor_profiles.space_id and g.accepting_mentors
    )
  );

drop policy if exists "journey_mentor_profiles_update_self_or_staff" on public.journey_mentor_profiles;
create policy "journey_mentor_profiles_update_self_or_staff" on public.journey_mentor_profiles
  for update to authenticated
  using (user_id = auth.uid() or public.is_space_staff(space_id, auth.uid()))
  with check (user_id = auth.uid() or public.is_space_staff(space_id, auth.uid()));

drop policy if exists "journey_mentor_profiles_delete_self_or_staff" on public.journey_mentor_profiles;
create policy "journey_mentor_profiles_delete_self_or_staff" on public.journey_mentor_profiles
  for delete to authenticated
  using (user_id = auth.uid() or public.is_space_staff(space_id, auth.uid()));

-- -----------------------------------------------------------------------------
-- journey_beginner_profiles
-- -----------------------------------------------------------------------------
create table if not exists public.journey_beginner_profiles (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  country text,
  region text,
  -- Optional and approximate ("north London"). Never a street address: the UI
  -- says so and only the people they ask for help can read it.
  approx_location text check (approx_location is null or char_length(approx_location) <= 120),
  setting text[] not null default '{}',   -- balcony, pots, garden… (per-space options)
  interests text[] not null default '{}', -- vegetables, herbs… (per-space options)
  experience text,                        -- complete beginner / tried before / some
  help_mode text not null default 'either' check (help_mode in ('online', 'local', 'either')),
  languages text[] not null default '{}',
  space_photo_url text,
  notes text check (notes is null or char_length(notes) <= 2000),
  adult_confirmed_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (space_id, user_id)
);

drop trigger if exists set_updated_at on public.journey_beginner_profiles;
create trigger set_updated_at before update on public.journey_beginner_profiles
  for each row execute function public.set_updated_at();

alter table public.journey_beginner_profiles enable row level security;

-- -----------------------------------------------------------------------------
-- mentorship_requests
-- -----------------------------------------------------------------------------
create table if not exists public.mentorship_requests (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces (id) on delete cascade,
  beginner_id uuid not null references public.profiles (id) on delete cascade,
  mentor_id uuid not null references public.profiles (id) on delete cascade,
  template_id uuid references public.journey_templates (id) on delete set null,
  -- Set when the beginner asks to join an existing group journey.
  requested_journey_id uuid,
  message text check (message is null or char_length(message) <= 2000),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined', 'withdrawn')),
  response_message text check (response_message is null or char_length(response_message) <= 2000),
  journey_id uuid,
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  check (beginner_id <> mentor_id)
);

-- One open request per beginner→mentor pair at a time.
create unique index if not exists uq_mentorship_requests_pending
  on public.mentorship_requests (space_id, beginner_id, mentor_id) where status = 'pending';
create index if not exists idx_mentorship_requests_mentor on public.mentorship_requests (mentor_id, status);
create index if not exists idx_mentorship_requests_beginner on public.mentorship_requests (beginner_id, status);

alter table public.mentorship_requests enable row level security;

drop policy if exists "mentorship_requests_select" on public.mentorship_requests;
create policy "mentorship_requests_select" on public.mentorship_requests
  for select to authenticated
  using (
    beginner_id = auth.uid()
    or mentor_id = auth.uid()
    or public.is_space_staff(space_id, auth.uid())
  );

-- A beginner may ask a mentor who is active, not paused, not blocked either
-- way, and only once they have a beginner profile (with its adult declaration)
-- in this space. Accept / decline / withdraw go through the functions below.
drop policy if exists "mentorship_requests_insert_beginner" on public.mentorship_requests;
create policy "mentorship_requests_insert_beginner" on public.mentorship_requests
  for insert to authenticated
  with check (
    beginner_id = auth.uid()
    and status = 'pending'
    and journey_id is null
    and responded_at is null
    and response_message is null
    and public.can_view_space(space_id, auth.uid())
    and public.is_community_member(public.space_community_id(space_id), auth.uid())
    and not public.is_blocked_between(beginner_id, mentor_id)
    and exists (
      select 1 from public.guided_journey_spaces g
      where g.space_id = mentorship_requests.space_id and g.accepting_beginners
    )
    and exists (
      select 1 from public.journey_beginner_profiles b
      where b.space_id = mentorship_requests.space_id and b.user_id = auth.uid()
    )
    and exists (
      select 1 from public.journey_mentor_profiles m
      where m.space_id = mentorship_requests.space_id
        and m.user_id = mentorship_requests.mentor_id
        and m.status = 'active'
        and not m.is_paused
    )
  );

-- Beginner profile visibility: yourself, staff, and the mentors you have asked
-- (or are on a journey with). Defined here because it reads mentorship_requests.
drop policy if exists "journey_beginner_profiles_select" on public.journey_beginner_profiles;
create policy "journey_beginner_profiles_select" on public.journey_beginner_profiles
  for select to authenticated
  using (
    user_id = auth.uid()
    or public.is_space_staff(space_id, auth.uid())
    or exists (
      select 1 from public.mentorship_requests r
      where r.space_id = journey_beginner_profiles.space_id
        and r.beginner_id = journey_beginner_profiles.user_id
        and r.mentor_id = auth.uid()
    )
  );

drop policy if exists "journey_beginner_profiles_insert_self" on public.journey_beginner_profiles;
create policy "journey_beginner_profiles_insert_self" on public.journey_beginner_profiles
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and public.can_view_space(space_id, auth.uid())
    and public.is_community_member(public.space_community_id(space_id), auth.uid())
  );

drop policy if exists "journey_beginner_profiles_update_self" on public.journey_beginner_profiles;
create policy "journey_beginner_profiles_update_self" on public.journey_beginner_profiles
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "journey_beginner_profiles_delete_self_or_staff" on public.journey_beginner_profiles;
create policy "journey_beginner_profiles_delete_self_or_staff" on public.journey_beginner_profiles
  for delete to authenticated
  using (user_id = auth.uid() or public.is_space_staff(space_id, auth.uid()));

-- -----------------------------------------------------------------------------
-- journeys + journey_participants
-- -----------------------------------------------------------------------------
create table if not exists public.journeys (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces (id) on delete cascade,
  template_id uuid references public.journey_templates (id) on delete set null,
  mentor_id uuid not null references public.profiles (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  subject text,
  cover_image_url text,
  duration_label text,
  expected_weeks integer check (expected_weeks is null or expected_weeks between 1 and 104),
  -- How often the beginner is expected to post. Weekly by default; the pair
  -- can agree something else ('weekly', 'fortnightly', 'monthly', free text).
  update_frequency text not null default 'weekly' check (char_length(update_frequency) <= 60),
  is_group boolean not null default false,
  max_beginners integer check (max_beginners is null or max_beginners between 1 and 20),
  status text not null default 'active' check (status in ('active', 'completed', 'ended')),
  mentor_acknowledgement text check (mentor_acknowledgement is null or char_length(mentor_acknowledgement) <= 2000),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  ended_at timestamptz,
  ended_by uuid references public.profiles (id) on delete set null,
  end_reason text check (end_reason is null or char_length(end_reason) <= 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_journeys_space on public.journeys (space_id, status);
create index if not exists idx_journeys_mentor on public.journeys (mentor_id, status);

drop trigger if exists set_updated_at on public.journeys;
create trigger set_updated_at before update on public.journeys
  for each row execute function public.set_updated_at();

alter table public.mentorship_requests
  drop constraint if exists mentorship_requests_journey_id_fkey;
alter table public.mentorship_requests
  add constraint mentorship_requests_journey_id_fkey
  foreign key (journey_id) references public.journeys (id) on delete set null;
alter table public.mentorship_requests
  drop constraint if exists mentorship_requests_requested_journey_id_fkey;
alter table public.mentorship_requests
  add constraint mentorship_requests_requested_journey_id_fkey
  foreign key (requested_journey_id) references public.journeys (id) on delete set null;

create table if not exists public.journey_participants (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid not null references public.journeys (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null check (role in ('mentor', 'beginner')),
  joined_at timestamptz not null default now(),
  -- Set when a beginner leaves a group journey (the journey carries on).
  left_at timestamptz,
  -- In-person meetings need BOTH sides to opt in; each person sets only their own.
  in_person_ok boolean not null default false,
  -- The beginner's (or mentor's) reflection at the end.
  reflection text check (reflection is null or char_length(reflection) <= 4000),
  unique (journey_id, user_id)
);

create index if not exists idx_journey_participants_user on public.journey_participants (user_id);

-- Any participant, past or present (history stays readable to those who were
-- on it). SECURITY DEFINER so policies on journey_participants can use it.
create or replace function public.is_journey_participant(p_journey_id uuid, p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.journey_participants
    where journey_id = p_journey_id and user_id = p_user_id
  );
$$;

-- A current participant on a journey that is still open for writing.
create or replace function public.is_active_journey_participant(p_journey_id uuid, p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.journey_participants p
    join public.journeys j on j.id = p.journey_id
    where p.journey_id = p_journey_id
      and p.user_id = p_user_id
      and p.left_at is null
      and j.status in ('active', 'completed')
  );
$$;

create or replace function public.journey_space_id(p_journey_id uuid)
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select space_id from public.journeys where id = p_journey_id;
$$;

-- Status, mentor and space can only change through the functions below (or
-- staff/service role). Participants may edit the descriptive columns.
create or replace function public.journeys_guard()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if current_user not in ('authenticated', 'anon') then
    return new;
  end if;
  if public.is_space_staff(old.space_id, auth.uid()) then
    new.space_id := old.space_id;
    return new;
  end if;
  new.space_id := old.space_id;
  new.mentor_id := old.mentor_id;
  new.status := old.status;
  new.started_at := old.started_at;
  new.completed_at := old.completed_at;
  new.ended_at := old.ended_at;
  new.ended_by := old.ended_by;
  new.end_reason := old.end_reason;
  new.is_group := old.is_group;
  -- Only the mentor writes the acknowledgement.
  if auth.uid() is distinct from old.mentor_id then
    new.mentor_acknowledgement := old.mentor_acknowledgement;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_journeys_guard on public.journeys;
create trigger trg_journeys_guard before update on public.journeys
  for each row execute function public.journeys_guard();

alter table public.journeys enable row level security;

-- Participants and staff see a journey. Open group journeys are also visible
-- to members of the space, so beginners can find one to ask to join.
drop policy if exists "journeys_select" on public.journeys;
create policy "journeys_select" on public.journeys
  for select to authenticated
  using (
    public.is_journey_participant(id, auth.uid())
    or public.is_space_staff(space_id, auth.uid())
    or (
      is_group
      and status = 'active'
      and public.can_view_space(space_id, auth.uid())
      and public.is_community_member(public.space_community_id(space_id), auth.uid())
      and not public.is_blocked_between(mentor_id, auth.uid())
    )
  );

drop policy if exists "journeys_update_participant_or_staff" on public.journeys;
create policy "journeys_update_participant_or_staff" on public.journeys
  for update to authenticated
  using (public.is_active_journey_participant(id, auth.uid()) or public.is_space_staff(space_id, auth.uid()))
  with check (public.is_active_journey_participant(id, auth.uid()) or public.is_space_staff(space_id, auth.uid()));

drop policy if exists "journeys_delete_staff" on public.journeys;
create policy "journeys_delete_staff" on public.journeys
  for delete to authenticated
  using (public.is_space_staff(space_id, auth.uid()));

-- Participants: each person edits only their own in-person switch and reflection.
create or replace function public.journey_participants_guard()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if current_user not in ('authenticated', 'anon') then
    return new;
  end if;
  new.journey_id := old.journey_id;
  new.user_id := old.user_id;
  new.role := old.role;
  new.joined_at := old.joined_at;
  new.left_at := old.left_at;
  return new;
end;
$$;

drop trigger if exists trg_journey_participants_guard on public.journey_participants;
create trigger trg_journey_participants_guard before update on public.journey_participants
  for each row execute function public.journey_participants_guard();

alter table public.journey_participants enable row level security;

drop policy if exists "journey_participants_select" on public.journey_participants;
create policy "journey_participants_select" on public.journey_participants
  for select to authenticated
  using (
    public.is_journey_participant(journey_id, auth.uid())
    or public.is_space_staff(public.journey_space_id(journey_id), auth.uid())
    or exists (
      select 1 from public.journeys j
      where j.id = journey_participants.journey_id and j.is_group and j.status = 'active'
        and public.can_view_space(j.space_id, auth.uid())
        and public.is_community_member(public.space_community_id(j.space_id), auth.uid())
    )
  );

drop policy if exists "journey_participants_update_self" on public.journey_participants;
create policy "journey_participants_update_self" on public.journey_participants
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- -----------------------------------------------------------------------------
-- journey_milestones
-- -----------------------------------------------------------------------------
create table if not exists public.journey_milestones (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid not null references public.journeys (id) on delete cascade,
  position integer not null default 0,
  title text not null check (char_length(title) between 1 and 160),
  description text check (description is null or char_length(description) <= 2000),
  status text not null default 'pending' check (status in ('pending', 'done')),
  completed_at timestamptz,
  completed_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_journey_milestones_journey on public.journey_milestones (journey_id, position);

alter table public.journey_milestones enable row level security;

drop policy if exists "journey_milestones_select" on public.journey_milestones;
create policy "journey_milestones_select" on public.journey_milestones
  for select to authenticated
  using (
    public.is_journey_participant(journey_id, auth.uid())
    or public.is_space_staff(public.journey_space_id(journey_id), auth.uid())
  );

drop policy if exists "journey_milestones_write_participant" on public.journey_milestones;
create policy "journey_milestones_write_participant" on public.journey_milestones
  for all to authenticated
  using (public.is_active_journey_participant(journey_id, auth.uid()))
  with check (public.is_active_journey_participant(journey_id, auth.uid()));

-- -----------------------------------------------------------------------------
-- journey_updates: progress posts and replies
-- -----------------------------------------------------------------------------
create table if not exists public.journey_updates (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid not null references public.journeys (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  -- Replies (the mentor's advice, a follow-up question) point at their update.
  parent_id uuid references public.journey_updates (id) on delete cascade,
  body text check (body is null or char_length(body) <= 4000),
  question text check (question is null or char_length(question) <= 2000),
  problems text check (problems is null or char_length(problems) <= 2000),
  milestone_id uuid references public.journey_milestones (id) on delete set null,
  photos text[] not null default '{}',
  -- Staff moderation: hidden from participants, kept for review.
  is_hidden boolean not null default false,
  created_at timestamptz not null default now(),
  edited_at timestamptz,
  check (coalesce(body, '') <> '' or coalesce(question, '') <> '' or cardinality(photos) > 0)
);

create index if not exists idx_journey_updates_journey on public.journey_updates (journey_id, created_at);

create or replace function public.journey_updates_guard()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if current_user not in ('authenticated', 'anon') then
    return new;
  end if;
  new.journey_id := old.journey_id;
  new.author_id := old.author_id;
  new.parent_id := old.parent_id;
  new.created_at := old.created_at;
  if public.is_space_staff(public.journey_space_id(old.journey_id), auth.uid()) and auth.uid() is distinct from old.author_id then
    -- Staff moderate; they don't rewrite someone else's words.
    new.body := old.body;
    new.question := old.question;
    new.problems := old.problems;
    new.photos := old.photos;
    new.milestone_id := old.milestone_id;
  elsif auth.uid() = old.author_id then
    if not public.is_space_staff(public.journey_space_id(old.journey_id), auth.uid()) then
      new.is_hidden := old.is_hidden;
    end if;
    new.edited_at := now();
  end if;
  return new;
end;
$$;

drop trigger if exists trg_journey_updates_guard on public.journey_updates;
create trigger trg_journey_updates_guard before update on public.journey_updates
  for each row execute function public.journey_updates_guard();

alter table public.journey_updates enable row level security;

drop policy if exists "journey_updates_select" on public.journey_updates;
create policy "journey_updates_select" on public.journey_updates
  for select to authenticated
  using (
    public.is_space_staff(public.journey_space_id(journey_id), auth.uid())
    or (public.is_journey_participant(journey_id, auth.uid()) and (not is_hidden or author_id = auth.uid()))
  );

drop policy if exists "journey_updates_insert_participant" on public.journey_updates;
create policy "journey_updates_insert_participant" on public.journey_updates
  for insert to authenticated
  with check (
    author_id = auth.uid()
    and is_hidden = false
    and public.is_active_journey_participant(journey_id, auth.uid())
  );

drop policy if exists "journey_updates_update_author_or_staff" on public.journey_updates;
create policy "journey_updates_update_author_or_staff" on public.journey_updates
  for update to authenticated
  using (author_id = auth.uid() or public.is_space_staff(public.journey_space_id(journey_id), auth.uid()))
  with check (author_id = auth.uid() or public.is_space_staff(public.journey_space_id(journey_id), auth.uid()));

drop policy if exists "journey_updates_delete_author_or_staff" on public.journey_updates;
create policy "journey_updates_delete_author_or_staff" on public.journey_updates
  for delete to authenticated
  using (author_id = auth.uid() or public.is_space_staff(public.journey_space_id(journey_id), auth.uid()));

-- -----------------------------------------------------------------------------
-- journey_stories: opt-in public stories for the gallery
-- -----------------------------------------------------------------------------
create table if not exists public.journey_stories (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid not null references public.journeys (id) on delete cascade,
  space_id uuid not null references public.spaces (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  mentor_id uuid references public.profiles (id) on delete set null,
  title text not null check (char_length(title) between 1 and 160),
  subject text,
  region text,
  climate text,
  method text,
  conditions text check (conditions is null or char_length(conditions) <= 4000),
  problems text check (problems is null or char_length(problems) <= 4000),
  solutions text check (solutions is null or char_length(solutions) <= 4000),
  lessons text check (lessons is null or char_length(lessons) <= 4000),
  results text check (results is null or char_length(results) <= 4000),
  before_photo_url text,
  after_photo_url text,
  photos text[] not null default '{}',
  duration_weeks integer check (duration_weeks is null or duration_weeks between 0 and 520),
  -- The mentor's own consent to be named (and quoted) on the public story.
  -- Without it the story says "with a community mentor".
  show_mentor boolean not null default false,
  mentor_acknowledgement text check (mentor_acknowledgement is null or char_length(mentor_acknowledgement) <= 2000),
  status text not null default 'draft' check (status in ('draft', 'published', 'hidden')),
  hidden_reason text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (journey_id, author_id)
);

create index if not exists idx_journey_stories_space on public.journey_stories (space_id, status, published_at desc);

drop trigger if exists set_updated_at on public.journey_stories;
create trigger set_updated_at before update on public.journey_stories
  for each row execute function public.set_updated_at();

create or replace function public.journey_stories_guard()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  v_staff boolean;
begin
  if current_user not in ('authenticated', 'anon') then
    return new;
  end if;
  v_staff := public.is_space_staff(coalesce(old.space_id, new.space_id), auth.uid());

  if tg_op = 'INSERT' then
    -- The story's space and mentor always come from the journey itself.
    select j.space_id, j.mentor_id into new.space_id, new.mentor_id
    from public.journeys j where j.id = new.journey_id;
    new.show_mentor := false;
    new.mentor_acknowledgement := null;
    if new.status = 'hidden' then new.status := 'draft'; end if;
    if new.status = 'published' then new.published_at := now(); end if;
    return new;
  end if;

  new.journey_id := old.journey_id;
  new.space_id := old.space_id;
  new.author_id := old.author_id;
  new.mentor_id := old.mentor_id;

  if auth.uid() is distinct from old.mentor_id then
    new.show_mentor := old.show_mentor;
    new.mentor_acknowledgement := old.mentor_acknowledgement;
  end if;

  if auth.uid() = old.mentor_id and auth.uid() is distinct from old.author_id and not v_staff then
    -- The mentor controls only their own consent and words.
    new.title := old.title; new.subject := old.subject; new.region := old.region;
    new.climate := old.climate; new.method := old.method; new.conditions := old.conditions;
    new.problems := old.problems; new.solutions := old.solutions; new.lessons := old.lessons;
    new.results := old.results; new.before_photo_url := old.before_photo_url;
    new.after_photo_url := old.after_photo_url; new.photos := old.photos;
    new.duration_weeks := old.duration_weeks; new.status := old.status;
  end if;

  if not v_staff then
    -- Only staff hide or un-hide a story.
    if old.status = 'hidden' or new.status = 'hidden' then
      new.status := old.status;
      new.hidden_reason := old.hidden_reason;
    end if;
  end if;

  if new.status = 'published' and old.status <> 'published' then
    new.published_at := now();
  end if;
  return new;
end;
$$;

drop trigger if exists trg_journey_stories_guard on public.journey_stories;
create trigger trg_journey_stories_guard before insert or update on public.journey_stories
  for each row execute function public.journey_stories_guard();

alter table public.journey_stories enable row level security;

drop policy if exists "journey_stories_select" on public.journey_stories;
create policy "journey_stories_select" on public.journey_stories
  for select to authenticated
  using (
    author_id = auth.uid()
    or mentor_id = auth.uid()
    or public.is_space_staff(space_id, auth.uid())
    or (status = 'published' and public.can_view_space(space_id, auth.uid()))
  );

drop policy if exists "journey_stories_select_anon" on public.journey_stories;
create policy "journey_stories_select_anon" on public.journey_stories
  for select to anon
  using (status = 'published' and public.can_view_space(space_id, null));

-- Only a beginner on a completed journey writes its story.
drop policy if exists "journey_stories_insert_beginner" on public.journey_stories;
create policy "journey_stories_insert_beginner" on public.journey_stories
  for insert to authenticated
  with check (
    author_id = auth.uid()
    and exists (
      select 1
      from public.journey_participants p
      join public.journeys j on j.id = p.journey_id
      where p.journey_id = journey_stories.journey_id
        and p.user_id = auth.uid()
        and p.role = 'beginner'
        and j.status = 'completed'
    )
  );

drop policy if exists "journey_stories_update" on public.journey_stories;
create policy "journey_stories_update" on public.journey_stories
  for update to authenticated
  using (author_id = auth.uid() or mentor_id = auth.uid() or public.is_space_staff(space_id, auth.uid()))
  with check (author_id = auth.uid() or mentor_id = auth.uid() or public.is_space_staff(space_id, auth.uid()));

drop policy if exists "journey_stories_delete" on public.journey_stories;
create policy "journey_stories_delete" on public.journey_stories
  for delete to authenticated
  using (author_id = auth.uid() or public.is_space_staff(space_id, auth.uid()));

-- -----------------------------------------------------------------------------
-- journey_reports: members flag people or content to staff
-- -----------------------------------------------------------------------------
create table if not exists public.journey_reports (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces (id) on delete cascade,
  reporter_id uuid not null references public.profiles (id) on delete cascade,
  reported_user_id uuid references public.profiles (id) on delete set null,
  journey_id uuid references public.journeys (id) on delete set null,
  update_id uuid references public.journey_updates (id) on delete set null,
  story_id uuid references public.journey_stories (id) on delete set null,
  reason text not null check (reason in ('harassment', 'unsafe', 'inappropriate', 'spam', 'misleading_advice', 'other')),
  details text check (details is null or char_length(details) <= 2000),
  status text not null default 'open' check (status in ('open', 'resolved', 'dismissed')),
  staff_note text,
  reviewed_by uuid references public.profiles (id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_journey_reports_space on public.journey_reports (space_id, status, created_at desc);

alter table public.journey_reports enable row level security;

drop policy if exists "journey_reports_select" on public.journey_reports;
create policy "journey_reports_select" on public.journey_reports
  for select to authenticated
  using (reporter_id = auth.uid() or public.is_space_staff(space_id, auth.uid()));

drop policy if exists "journey_reports_insert_member" on public.journey_reports;
create policy "journey_reports_insert_member" on public.journey_reports
  for insert to authenticated
  with check (
    reporter_id = auth.uid()
    and status = 'open'
    and reviewed_by is null
    and public.can_view_space(space_id, auth.uid())
  );

drop policy if exists "journey_reports_update_staff" on public.journey_reports;
create policy "journey_reports_update_staff" on public.journey_reports
  for update to authenticated
  using (public.is_space_staff(space_id, auth.uid()))
  with check (public.is_space_staff(space_id, auth.uid()));

-- -----------------------------------------------------------------------------
-- Functions for the multi-row transitions
-- -----------------------------------------------------------------------------

-- Beginners a mentor is currently supporting in this space (across 1:1 and
-- group journeys). Capacity is checked against this at acceptance time.
create or replace function public.mentor_active_beginner_count(p_space_id uuid, p_mentor_id uuid)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::integer
  from public.journey_participants p
  join public.journeys j on j.id = p.journey_id
  where j.space_id = p_space_id
    and j.mentor_id = p_mentor_id
    and j.status = 'active'
    and p.role = 'beginner'
    and p.left_at is null;
$$;

-- Per-mentor counts for discovery cards and recognition, without exposing
-- anyone's journeys: how many beginners each mentor supports right now, and how
-- many journeys they have seen through to completion. Members of the space only.
create or replace function public.mentor_journey_stats(p_space_id uuid)
returns table (mentor_id uuid, active_beginners integer, completed_journeys integer)
language sql
stable
security definer
set search_path = public
as $$
  select
    m.user_id,
    public.mentor_active_beginner_count(p_space_id, m.user_id),
    (select count(*)::integer from public.journeys j
      where j.space_id = p_space_id and j.mentor_id = m.user_id and j.status = 'completed')
  from public.journey_mentor_profiles m
  where m.space_id = p_space_id
    and public.can_view_space(p_space_id, auth.uid())
    and public.is_community_member(public.space_community_id(p_space_id), auth.uid());
$$;

-- The mentor answers a request. Accepting creates the shared journey (or adds
-- the beginner to the mentor's group journey) in one transaction, copying the
-- template's milestones — or p_milestones, the space's default list, when the
-- request has no template. Returns the journey id (null on decline).
create or replace function public.respond_to_mentorship_request(
  p_request_id uuid,
  p_accept boolean,
  p_message text default null,
  p_group_journey_id uuid default null,
  p_milestones jsonb default null,
  p_default_title text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_req public.mentorship_requests%rowtype;
  v_mentor public.journey_mentor_profiles%rowtype;
  v_tpl public.journey_templates%rowtype;
  v_journey_id uuid;
  v_target uuid;
  v_milestones jsonb;
  v_group public.journeys%rowtype;
  v_group_count integer;
begin
  select * into v_req from public.mentorship_requests where id = p_request_id for update;
  if v_req.id is null then
    raise exception 'Request not found';
  end if;
  if v_req.mentor_id is distinct from auth.uid() then
    raise exception 'Only the mentor can answer this request';
  end if;
  if v_req.status <> 'pending' then
    raise exception 'This request has already been answered';
  end if;

  if not p_accept then
    update public.mentorship_requests
      set status = 'declined', response_message = nullif(trim(p_message), ''), responded_at = now()
      where id = p_request_id;
    return null;
  end if;

  if public.is_blocked_between(v_req.beginner_id, v_req.mentor_id) then
    raise exception 'You can''t mentor this member';
  end if;

  select * into v_mentor from public.journey_mentor_profiles
    where space_id = v_req.space_id and user_id = v_req.mentor_id;
  if v_mentor.id is null or v_mentor.status <> 'active' then
    raise exception 'Your mentor profile is not active in this space';
  end if;
  if public.mentor_active_beginner_count(v_req.space_id, v_req.mentor_id) >= v_mentor.capacity then
    raise exception 'You have no free places right now — raise your capacity or finish a journey first';
  end if;

  v_target := coalesce(p_group_journey_id, v_req.requested_journey_id);

  if v_target is not null then
    select * into v_group from public.journeys where id = v_target for update;
    if v_group.id is null or v_group.space_id <> v_req.space_id or v_group.mentor_id <> v_req.mentor_id
       or v_group.status <> 'active' or not v_group.is_group then
      raise exception 'That group journey is not available';
    end if;
    select count(*) into v_group_count from public.journey_participants
      where journey_id = v_target and role = 'beginner' and left_at is null;
    if v_group.max_beginners is not null and v_group_count >= v_group.max_beginners then
      raise exception 'That group journey is full';
    end if;
    insert into public.journey_participants (journey_id, user_id, role)
      values (v_target, v_req.beginner_id, 'beginner')
      on conflict (journey_id, user_id) do update set left_at = null;
    v_journey_id := v_target;
  else
    if v_req.template_id is not null then
      select * into v_tpl from public.journey_templates where id = v_req.template_id and space_id = v_req.space_id;
    end if;
    v_milestones := coalesce(
      case when v_tpl.id is not null and jsonb_array_length(v_tpl.milestones) > 0 then v_tpl.milestones end,
      p_milestones,
      '[]'::jsonb
    );

    insert into public.journeys (space_id, template_id, mentor_id, title, subject, cover_image_url, duration_label, expected_weeks)
    values (
      v_req.space_id,
      v_tpl.id,
      v_req.mentor_id,
      coalesce(v_tpl.title, nullif(trim(p_default_title), ''), 'Our journey'),
      v_tpl.subject,
      v_tpl.cover_image_url,
      v_tpl.duration_label,
      v_tpl.expected_weeks
    )
    returning id into v_journey_id;

    insert into public.journey_participants (journey_id, user_id, role)
    values (v_journey_id, v_req.mentor_id, 'mentor'), (v_journey_id, v_req.beginner_id, 'beginner');

    insert into public.journey_milestones (journey_id, position, title, description)
    select v_journey_id, (m.ord - 1)::integer, left(m.value ->> 'title', 160), nullif(m.value ->> 'description', '')
    from jsonb_array_elements(v_milestones) with ordinality as m(value, ord)
    where coalesce(trim(m.value ->> 'title'), '') <> '';
  end if;

  update public.mentorship_requests
    set status = 'accepted', response_message = nullif(trim(p_message), ''), responded_at = now(), journey_id = v_journey_id
    where id = p_request_id;

  return v_journey_id;
end;
$$;

-- The beginner takes back a request the mentor hasn't answered yet.
create or replace function public.withdraw_mentorship_request(p_request_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.mentorship_requests
    set status = 'withdrawn', responded_at = now()
    where id = p_request_id and beginner_id = auth.uid() and status = 'pending';
  if not found then
    raise exception 'Request not found or already answered';
  end if;
end;
$$;

-- A mentor opens a group journey that several beginners can ask to join.
create or replace function public.create_group_journey(
  p_space_id uuid,
  p_template_id uuid,
  p_title text,
  p_max_beginners integer,
  p_milestones jsonb default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_mentor public.journey_mentor_profiles%rowtype;
  v_tpl public.journey_templates%rowtype;
  v_journey_id uuid;
  v_milestones jsonb;
begin
  select * into v_mentor from public.journey_mentor_profiles where space_id = p_space_id and user_id = auth.uid();
  if v_mentor.id is null or v_mentor.status <> 'active' or not v_mentor.group_mentoring then
    raise exception 'Turn on group mentoring in your mentor profile first';
  end if;
  if p_template_id is not null then
    select * into v_tpl from public.journey_templates where id = p_template_id and space_id = p_space_id;
  end if;
  v_milestones := coalesce(
    case when v_tpl.id is not null and jsonb_array_length(v_tpl.milestones) > 0 then v_tpl.milestones end,
    p_milestones,
    '[]'::jsonb
  );

  insert into public.journeys (space_id, template_id, mentor_id, title, subject, cover_image_url, duration_label, expected_weeks, is_group, max_beginners)
  values (
    p_space_id, v_tpl.id, auth.uid(),
    coalesce(nullif(trim(p_title), ''), v_tpl.title, 'Group journey'),
    v_tpl.subject, v_tpl.cover_image_url, v_tpl.duration_label, v_tpl.expected_weeks,
    true, greatest(1, least(coalesce(p_max_beginners, v_mentor.capacity), 20))
  )
  returning id into v_journey_id;

  insert into public.journey_participants (journey_id, user_id, role) values (v_journey_id, auth.uid(), 'mentor');

  insert into public.journey_milestones (journey_id, position, title, description)
  select v_journey_id, (m.ord - 1)::integer, left(m.value ->> 'title', 160), nullif(m.value ->> 'description', '')
  from jsonb_array_elements(v_milestones) with ordinality as m(value, ord)
  where coalesce(trim(m.value ->> 'title'), '') <> '';

  return v_journey_id;
end;
$$;

-- Either participant celebrates the finish. The mentor may add an
-- acknowledgement at the same time.
create or replace function public.complete_journey(p_journey_id uuid, p_acknowledgement text default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_journey public.journeys%rowtype;
begin
  select * into v_journey from public.journeys where id = p_journey_id for update;
  if v_journey.id is null then
    raise exception 'Journey not found';
  end if;
  if not exists (
    select 1 from public.journey_participants
    where journey_id = p_journey_id and user_id = auth.uid() and left_at is null
  ) then
    raise exception 'Only people on this journey can complete it';
  end if;
  if v_journey.status <> 'active' then
    raise exception 'This journey is not active';
  end if;

  update public.journeys
    set status = 'completed',
        completed_at = now(),
        mentor_acknowledgement = case
          when auth.uid() = v_journey.mentor_id and nullif(trim(p_acknowledgement), '') is not null
            then trim(p_acknowledgement)
          else mentor_acknowledgement
        end
    where id = p_journey_id;
end;
$$;

-- Either side can end a mentoring relationship at any time, no reason needed.
-- On a group journey a beginner leaving just removes them; the mentor ending
-- it (or anyone on a 1:1) closes the whole journey.
create or replace function public.end_journey(p_journey_id uuid, p_reason text default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_journey public.journeys%rowtype;
  v_role text;
begin
  select * into v_journey from public.journeys where id = p_journey_id for update;
  if v_journey.id is null then
    raise exception 'Journey not found';
  end if;
  select role into v_role from public.journey_participants
    where journey_id = p_journey_id and user_id = auth.uid() and left_at is null;
  if v_role is null and not public.is_space_staff(v_journey.space_id, auth.uid()) then
    raise exception 'Only people on this journey can end it';
  end if;
  if v_journey.status <> 'active' then
    raise exception 'This journey is not active';
  end if;

  if v_journey.is_group and v_role = 'beginner' then
    update public.journey_participants set left_at = now()
      where journey_id = p_journey_id and user_id = auth.uid();
    return;
  end if;

  update public.journeys
    set status = 'ended', ended_at = now(), ended_by = auth.uid(), end_reason = nullif(trim(p_reason), '')
    where id = p_journey_id;
end;
$$;

revoke all on function public.respond_to_mentorship_request(uuid, boolean, text, uuid, jsonb, text) from public, anon;
revoke all on function public.withdraw_mentorship_request(uuid) from public, anon;
revoke all on function public.create_group_journey(uuid, uuid, text, integer, jsonb) from public, anon;
revoke all on function public.complete_journey(uuid, text) from public, anon;
revoke all on function public.end_journey(uuid, text) from public, anon;
revoke all on function public.mentor_journey_stats(uuid) from public, anon;
grant execute on function public.respond_to_mentorship_request(uuid, boolean, text, uuid, jsonb, text) to authenticated;
grant execute on function public.withdraw_mentorship_request(uuid) to authenticated;
grant execute on function public.create_group_journey(uuid, uuid, text, integer, jsonb) to authenticated;
grant execute on function public.complete_journey(uuid, text) to authenticated;
grant execute on function public.end_journey(uuid, text) to authenticated;
grant execute on function public.mentor_journey_stats(uuid) to authenticated;
