-- =============================================================================
-- Relate — 64 Arts board: a family's done squares and notes
--
-- One row per family (per member account) per art per board: a tick that
-- circles the square, and an optional note on how it went. The arts are
-- numbered 1–64 in the traditional order (see src/lib/arts/sixty-four-arts.ts),
-- so a row stores the number rather than pointing at a table of arts.
--
-- VISIBILITY. A family's board is their own: only that family can read or
-- write its rows. (Books & Media notes are shared because the point is to
-- tell other families; here the point is a family's own progress.)
--
-- Writing is scoped to boards you can already see and belong to: the insert
-- policy re-checks can_view_space and active membership.
--
-- Also adds the "Real Karma Sutra" board to the Squidge Over Skool homeschool
-- community, when that community exists (it won't on a fresh local database).
--
-- Safe to re-run.
-- =============================================================================

create table if not exists public.arts_board_marks (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  art_number integer not null,
  done boolean not null default false,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (space_id, user_id, art_number)
);

alter table public.arts_board_marks
  drop constraint if exists arts_board_marks_art_number_range;
alter table public.arts_board_marks
  add constraint arts_board_marks_art_number_range
  check (art_number between 1 and 64);

alter table public.arts_board_marks
  drop constraint if exists arts_board_marks_note_length;
alter table public.arts_board_marks
  add constraint arts_board_marks_note_length
  check (note is null or char_length(note) <= 1000);

create index if not exists idx_arts_board_marks_board
  on public.arts_board_marks (space_id, user_id);

drop trigger if exists set_updated_at on public.arts_board_marks;
create trigger set_updated_at before update on public.arts_board_marks
  for each row execute function public.set_updated_at();

alter table public.arts_board_marks enable row level security;

drop policy if exists "arts_board_marks_select_own" on public.arts_board_marks;
create policy "arts_board_marks_select_own" on public.arts_board_marks
  for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "arts_board_marks_insert_own" on public.arts_board_marks;
create policy "arts_board_marks_insert_own" on public.arts_board_marks
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.spaces s
      where s.id = arts_board_marks.space_id
        and s.space_type = 'arts_board'
        and public.can_view_space(s.id, auth.uid())
        and public.is_community_member(s.community_id, auth.uid())
    )
  );

drop policy if exists "arts_board_marks_update_own" on public.arts_board_marks;
create policy "arts_board_marks_update_own" on public.arts_board_marks
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "arts_board_marks_delete_own" on public.arts_board_marks;
create policy "arts_board_marks_delete_own" on public.arts_board_marks
  for delete to authenticated
  using (user_id = auth.uid());

-- --- The Real Karma Sutra board in Squidge Over Skool ------------------------

insert into public.spaces (community_id, name, slug, description, visibility, space_type, sort_order, show_in_nav, nav_group)
select
  c.id,
  'Real Karma Sutra',
  'real-karma-sutra',
  'The 64 arts of ancient India, from singing and carpentry to riddles and secret codes. Flip a square, try it together, and circle it on your family''s board.',
  'members',
  'arts_board',
  coalesce((select max(s.sort_order) + 1 from public.spaces s where s.community_id = c.id), 0),
  true,
  case when exists (
    select 1 from public.community_nav_groups g where g.community_id = c.id and g.key = 'learn'
  ) then 'learn' end
from public.communities c
where c.slug = 'squidgeoverskool'
  and not exists (
    select 1 from public.spaces s where s.community_id = c.id and s.slug = 'real-karma-sutra'
  );
