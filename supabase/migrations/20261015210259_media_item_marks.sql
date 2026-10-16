-- =============================================================================
-- Relate — Books & Media: "we've read it", and a family's note
--
-- A shelf of reviews says what a thing is like; it doesn't say whether this
-- family has got to it yet, or what the children made of it. One row per
-- family (per member) per item: a tick for read/watched/listened, and a short
-- note — "she loved it, he found it slow" — which is the kind of thing a
-- community of families actually wants from each other.
--
-- VISIBILITY. The note is shared with the community, not private: anyone who
-- can see the item can see every family's tick and note, with the family's
-- name beside it. That is the point of writing one. (Lesson saves, by
-- contrast, are private: a reading list is not a submission.) Only the row's
-- own family may write or remove it.
--
-- Writing is scoped to what you can already see: the insert policy re-checks
-- can_view_space on the item's space.
--
-- Safe to re-run.
-- =============================================================================

create table if not exists public.media_item_marks (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.space_media_items (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  -- Read it / watched it / listened to it, depending on what it is.
  done boolean not null default false,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (item_id, user_id)
);

alter table public.media_item_marks
  drop constraint if exists media_item_marks_note_length;
alter table public.media_item_marks
  add constraint media_item_marks_note_length
  check (note is null or char_length(note) <= 600);

create index if not exists idx_media_item_marks_item
  on public.media_item_marks (item_id, updated_at desc);

drop trigger if exists set_updated_at on public.media_item_marks;
create trigger set_updated_at before update on public.media_item_marks
  for each row execute function public.set_updated_at();

alter table public.media_item_marks enable row level security;

-- Visible to whoever can see the item (see the header).
drop policy if exists "media_item_marks_select" on public.media_item_marks;
create policy "media_item_marks_select" on public.media_item_marks
  for select to authenticated
  using (
    exists (
      select 1 from public.space_media_items m
      where m.id = media_item_marks.item_id
        and public.can_view_space(m.space_id, auth.uid())
    )
  );

drop policy if exists "media_item_marks_select_anon" on public.media_item_marks;
create policy "media_item_marks_select_anon" on public.media_item_marks
  for select to anon
  using (
    exists (
      select 1 from public.space_media_items m
      where m.id = media_item_marks.item_id
        and public.can_view_space(m.space_id, null::uuid)
    )
  );

drop policy if exists "media_item_marks_insert_own" on public.media_item_marks;
create policy "media_item_marks_insert_own" on public.media_item_marks
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.space_media_items m
      where m.id = media_item_marks.item_id
        and public.can_view_space(m.space_id, auth.uid())
    )
  );

drop policy if exists "media_item_marks_update_own" on public.media_item_marks;
create policy "media_item_marks_update_own" on public.media_item_marks
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "media_item_marks_delete_own" on public.media_item_marks;
create policy "media_item_marks_delete_own" on public.media_item_marks
  for delete to authenticated
  using (user_id = auth.uid());
