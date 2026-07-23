-- =============================================================================
-- Relate — Space Builder: Challenges
--
-- Run this after supabase/space-types.sql. Safe to re-run.
--
-- Named space_challenges (not challenges) because a `challenges` table
-- already exists in this database with a much richer, unrelated shape
-- (duration_days, daily_tasks, points, badge_id, rewards, …) — leftover
-- from an earlier migration on a different codebase. Rather than touch or
-- repurpose that table, this feature gets its own tables.
--
-- A space with space_type = 'challenges' hosts one or more time-boxed
-- programs (space_challenges) that members can join. `space_challenge_participants`
-- is a simple join table — no daily check-ins/progress tracking in this
-- round, just "who's doing this challenge together."
-- =============================================================================

create table if not exists public.space_challenges (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces (id) on delete cascade,
  community_id uuid not null references public.communities (id) on delete cascade,
  title text not null,
  description text,
  start_date date not null,
  end_date date not null,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint space_challenge_dates_check check (end_date >= start_date)
);

drop trigger if exists set_updated_at on public.space_challenges;
create trigger set_updated_at before update on public.space_challenges
  for each row execute function public.set_updated_at();

create index if not exists idx_space_challenges_space on public.space_challenges (space_id, start_date desc);

alter table public.space_challenges enable row level security;

drop policy if exists "space_challenges_select" on public.space_challenges;
create policy "space_challenges_select" on public.space_challenges
  for select to authenticated
  using (public.can_view_space(space_id, auth.uid()));

drop policy if exists "space_challenges_manage_admin" on public.space_challenges;
create policy "space_challenges_manage_admin" on public.space_challenges
  for all to authenticated
  using (public.is_community_admin(community_id, auth.uid()))
  with check (public.is_community_admin(community_id, auth.uid()));

-- -----------------------------------------------------------------------------
-- space_challenge_participants: who has joined which challenge.
-- -----------------------------------------------------------------------------
create table if not exists public.space_challenge_participants (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references public.space_challenges (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  joined_at timestamptz not null default now(),
  unique (challenge_id, user_id)
);

create index if not exists idx_space_challenge_participants_challenge on public.space_challenge_participants (challenge_id);
create index if not exists idx_space_challenge_participants_user on public.space_challenge_participants (user_id);

alter table public.space_challenge_participants enable row level security;

drop policy if exists "space_challenge_participants_select" on public.space_challenge_participants;
create policy "space_challenge_participants_select" on public.space_challenge_participants
  for select to authenticated
  using (
    exists (
      select 1 from public.space_challenges c
      where c.id = space_challenge_participants.challenge_id
        and public.can_view_space(c.space_id, auth.uid())
    )
  );

drop policy if exists "space_challenge_participants_insert_self" on public.space_challenge_participants;
create policy "space_challenge_participants_insert_self" on public.space_challenge_participants
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.space_challenges c
      where c.id = space_challenge_participants.challenge_id
        and public.is_community_member(c.community_id, auth.uid())
    )
  );

drop policy if exists "space_challenge_participants_delete_self_or_admin" on public.space_challenge_participants;
create policy "space_challenge_participants_delete_self_or_admin" on public.space_challenge_participants
  for delete to authenticated
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.space_challenges c
      where c.id = space_challenge_participants.challenge_id
        and public.is_community_admin(c.community_id, auth.uid())
    )
  );
