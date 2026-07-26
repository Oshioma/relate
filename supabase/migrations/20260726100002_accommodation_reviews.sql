-- =============================================================================
-- Relate — Accommodation: reviews + host replies
--
-- Mirrors business_reviews / business_review_replies (see
-- business_directory_enhancements.sql): one 1-5 star review (with optional text)
-- per member per stay, plus a single public reply from the host (the lister) or
-- staff — like a Google Business response. Accommodation has no claim/ownership
-- hand-off, so "host" is simply accommodation_listings.listed_by. Safe to re-run.
-- =============================================================================

-- accommodation_reviews -------------------------------------------------------
create table if not exists public.accommodation_reviews (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.accommodation_listings (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  body text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (listing_id, author_id)
);

drop trigger if exists set_updated_at on public.accommodation_reviews;
create trigger set_updated_at before update on public.accommodation_reviews
  for each row execute function public.set_updated_at();

create index if not exists idx_accommodation_reviews_listing on public.accommodation_reviews (listing_id, created_at desc);

alter table public.accommodation_reviews enable row level security;

drop policy if exists "accommodation_reviews_select" on public.accommodation_reviews;
create policy "accommodation_reviews_select" on public.accommodation_reviews
  for select to authenticated
  using (
    exists (
      select 1 from public.accommodation_listings l
      where l.id = accommodation_reviews.listing_id
        and public.can_view_space(l.space_id, auth.uid())
    )
  );

drop policy if exists "accommodation_reviews_insert_self" on public.accommodation_reviews;
create policy "accommodation_reviews_insert_self" on public.accommodation_reviews
  for insert to authenticated
  with check (
    author_id = auth.uid()
    and exists (
      select 1 from public.accommodation_listings l
      where l.id = accommodation_reviews.listing_id
        and public.is_community_member(l.community_id, auth.uid())
    )
  );

drop policy if exists "accommodation_reviews_update_self" on public.accommodation_reviews;
create policy "accommodation_reviews_update_self" on public.accommodation_reviews
  for update to authenticated
  using (author_id = auth.uid())
  with check (author_id = auth.uid());

drop policy if exists "accommodation_reviews_delete_self_or_staff" on public.accommodation_reviews;
create policy "accommodation_reviews_delete_self_or_staff" on public.accommodation_reviews
  for delete to authenticated
  using (
    author_id = auth.uid()
    or exists (
      select 1 from public.accommodation_listings l
      where l.id = accommodation_reviews.listing_id
        and public.is_community_staff(l.community_id, auth.uid())
    )
  );

-- accommodation_review_replies ------------------------------------------------
create table if not exists public.accommodation_review_replies (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.accommodation_reviews (id) on delete cascade,
  listing_id uuid not null references public.accommodation_listings (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (review_id)
);

drop trigger if exists set_updated_at on public.accommodation_review_replies;
create trigger set_updated_at before update on public.accommodation_review_replies
  for each row execute function public.set_updated_at();

create index if not exists idx_accommodation_review_replies_listing on public.accommodation_review_replies (listing_id);

alter table public.accommodation_review_replies enable row level security;

drop policy if exists "accommodation_review_replies_select" on public.accommodation_review_replies;
create policy "accommodation_review_replies_select" on public.accommodation_review_replies
  for select to authenticated
  using (
    exists (
      select 1 from public.accommodation_listings l
      where l.id = accommodation_review_replies.listing_id
        and public.can_view_space(l.space_id, auth.uid())
    )
  );

-- Only the host (listed_by) or staff may reply.
drop policy if exists "accommodation_review_replies_insert_host_or_staff" on public.accommodation_review_replies;
create policy "accommodation_review_replies_insert_host_or_staff" on public.accommodation_review_replies
  for insert to authenticated
  with check (
    author_id = auth.uid()
    and exists (
      select 1 from public.accommodation_listings l
      where l.id = accommodation_review_replies.listing_id
        and (l.listed_by = auth.uid() or public.is_community_staff(l.community_id, auth.uid()))
    )
  );

drop policy if exists "accommodation_review_replies_update_author_or_staff" on public.accommodation_review_replies;
create policy "accommodation_review_replies_update_author_or_staff" on public.accommodation_review_replies
  for update to authenticated
  using (
    author_id = auth.uid()
    or exists (
      select 1 from public.accommodation_listings l
      where l.id = accommodation_review_replies.listing_id
        and public.is_community_staff(l.community_id, auth.uid())
    )
  );

drop policy if exists "accommodation_review_replies_delete_author_or_staff" on public.accommodation_review_replies;
create policy "accommodation_review_replies_delete_author_or_staff" on public.accommodation_review_replies
  for delete to authenticated
  using (
    author_id = auth.uid()
    or exists (
      select 1 from public.accommodation_listings l
      where l.id = accommodation_review_replies.listing_id
        and public.is_community_staff(l.community_id, auth.uid())
    )
  );
