-- =============================================================================
-- Relate — Space Builder: Challenges
--
-- Run this after supabase/space-types.sql. Safe to re-run.
--
-- A space with space_type = 'challenges' hosts one or more time-boxed
-- programs (challenges) that members can join. `challenge_participants` is
-- a simple join table — no daily check-ins/progress tracking in this round,
-- just "who's doing this challenge together."
-- =============================================================================

create table if not exists public.challenges (
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
  constraint challenge_dates_check check (end_date >= start_date)
);

drop trigger if exists set_updated_at on public.challenges;
create trigger set_updated_at before update on public.challenges
  for each row execute function public.set_updated_at();

create index if not exists idx_challenges_space on public.challenges (space_id, start_date desc);

alter table public.challenges enable row level security;

drop policy if exists "challenges_select" on public.challenges;
create policy "challenges_select" on public.challenges
  for select to authenticated
  using (public.can_view_space(space_id, auth.uid()));

drop policy if exists "challenges_manage_admin" on public.challenges;
create policy "challenges_manage_admin" on public.challenges
  for all to authenticated
  using (public.is_community_admin(community_id, auth.uid()))
  with check (public.is_community_admin(community_id, auth.uid()));

-- -----------------------------------------------------------------------------
-- challenge_participants: who has joined which challenge.
-- -----------------------------------------------------------------------------
create table if not exists public.challenge_participants (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references public.challenges (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  joined_at timestamptz not null default now(),
  unique (challenge_id, user_id)
);

create index if not exists idx_challenge_participants_challenge on public.challenge_participants (challenge_id);
create index if not exists idx_challenge_participants_user on public.challenge_participants (user_id);

alter table public.challenge_participants enable row level security;

drop policy if exists "challenge_participants_select" on public.challenge_participants;
create policy "challenge_participants_select" on public.challenge_participants
  for select to authenticated
  using (
    exists (
      select 1 from public.challenges c
      where c.id = challenge_participants.challenge_id
        and public.can_view_space(c.space_id, auth.uid())
    )
  );

drop policy if exists "challenge_participants_insert_self" on public.challenge_participants;
create policy "challenge_participants_insert_self" on public.challenge_participants
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.challenges c
      where c.id = challenge_participants.challenge_id
        and public.is_community_member(c.community_id, auth.uid())
    )
  );

drop policy if exists "challenge_participants_delete_self_or_admin" on public.challenge_participants;
create policy "challenge_participants_delete_self_or_admin" on public.challenge_participants
  for delete to authenticated
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.challenges c
      where c.id = challenge_participants.challenge_id
        and public.is_community_admin(c.community_id, auth.uid())
    )
  );
