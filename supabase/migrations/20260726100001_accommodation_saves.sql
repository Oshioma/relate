-- =============================================================================
-- Relate — Accommodation: per-member saves (bookmarks)
--
-- Mirrors business_saves (see business_directory_enhancements.sql): a member
-- bookmarks a stay, only ever sees or manages their own rows, so the view's
-- "Saved" filter reflects that viewer alone. Safe to re-run.
-- =============================================================================

create table if not exists public.accommodation_saves (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.accommodation_listings (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (listing_id, user_id)
);

create index if not exists idx_accommodation_saves_user on public.accommodation_saves (user_id);

alter table public.accommodation_saves enable row level security;

drop policy if exists "accommodation_saves_select_self" on public.accommodation_saves;
create policy "accommodation_saves_select_self" on public.accommodation_saves
  for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "accommodation_saves_insert_self" on public.accommodation_saves;
create policy "accommodation_saves_insert_self" on public.accommodation_saves
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.accommodation_listings l
      where l.id = accommodation_saves.listing_id
        and public.is_community_member(l.community_id, auth.uid())
    )
  );

drop policy if exists "accommodation_saves_delete_self" on public.accommodation_saves;
create policy "accommodation_saves_delete_self" on public.accommodation_saves
  for delete to authenticated
  using (user_id = auth.uid());
