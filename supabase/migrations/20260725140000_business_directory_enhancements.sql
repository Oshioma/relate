-- =============================================================================
-- Relate — Business Directory: photos, reviews, owner replies, saves
--
-- Follow-up work flagged in business-directory.sql ("Claiming a listing, photos
-- and reviews are follow-up work"). Safe to re-run.
--
-- Four new tables, all scoped to a business and secured by joining back to
-- public.businesses for the space/community, exactly like the guides child
-- tables (guide_ratings/guide_comments) reach through public.guides. Reuses the
-- existing can_view_space / is_community_member / is_community_staff helpers and
-- the set_updated_at trigger function.
--
--   business_images         gallery photos for a listing (the source of truth;
--                           businesses.image_url stays as a denormalised cover)
--   business_reviews        one star+text review per member per listing
--   business_review_replies one owner/staff reply per review
--   business_saves          per-member bookmarks
-- =============================================================================

-- business_images -------------------------------------------------------------
create table if not exists public.business_images (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  url text not null,
  -- CSS object-position ("50% 25%") chosen by dragging the preview, so each
  -- photo's crop framing is preserved. Mirrors businesses.image_position.
  position text,
  sort_order integer not null default 0,
  created_by uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists idx_business_images_business on public.business_images (business_id, sort_order);

-- Backfill: seed the gallery from each listing's existing single cover image so
-- the first photo shown on the detail page matches today's card thumbnail.
insert into public.business_images (business_id, url, position, sort_order, created_by)
select b.id, b.image_url, b.image_position, 0, b.created_by
from public.businesses b
where b.image_url is not null
  and not exists (select 1 from public.business_images bi where bi.business_id = b.id);

alter table public.business_images enable row level security;

drop policy if exists "business_images_select" on public.business_images;
create policy "business_images_select" on public.business_images
  for select to authenticated
  using (
    exists (
      select 1 from public.businesses b
      where b.id = business_images.business_id
        and public.can_view_space(b.space_id, auth.uid())
    )
  );

drop policy if exists "business_images_insert_author_or_staff" on public.business_images;
create policy "business_images_insert_author_or_staff" on public.business_images
  for insert to authenticated
  with check (
    created_by = auth.uid()
    and exists (
      select 1 from public.businesses b
      where b.id = business_images.business_id
        and public.is_community_member(b.community_id, auth.uid())
        and (b.created_by = auth.uid() or public.is_community_staff(b.community_id, auth.uid()))
    )
  );

drop policy if exists "business_images_update_author_or_staff" on public.business_images;
create policy "business_images_update_author_or_staff" on public.business_images
  for update to authenticated
  using (
    exists (
      select 1 from public.businesses b
      where b.id = business_images.business_id
        and (b.created_by = auth.uid() or public.is_community_staff(b.community_id, auth.uid()))
    )
  );

drop policy if exists "business_images_delete_author_or_staff" on public.business_images;
create policy "business_images_delete_author_or_staff" on public.business_images
  for delete to authenticated
  using (
    exists (
      select 1 from public.businesses b
      where b.id = business_images.business_id
        and (b.created_by = auth.uid() or public.is_community_staff(b.community_id, auth.uid()))
    )
  );

-- business_reviews ------------------------------------------------------------
-- One 1-5 star review (with optional text) per member per listing. Mirrors
-- guide_ratings for the rating half and guide_comments for the text half, folded
-- into a single row so "a review" is one thing a member owns and can edit.
create table if not exists public.business_reviews (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  body text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id, author_id)
);

drop trigger if exists set_updated_at on public.business_reviews;
create trigger set_updated_at before update on public.business_reviews
  for each row execute function public.set_updated_at();

create index if not exists idx_business_reviews_business on public.business_reviews (business_id, created_at desc);

alter table public.business_reviews enable row level security;

drop policy if exists "business_reviews_select" on public.business_reviews;
create policy "business_reviews_select" on public.business_reviews
  for select to authenticated
  using (
    exists (
      select 1 from public.businesses b
      where b.id = business_reviews.business_id
        and public.can_view_space(b.space_id, auth.uid())
    )
  );

drop policy if exists "business_reviews_insert_self" on public.business_reviews;
create policy "business_reviews_insert_self" on public.business_reviews
  for insert to authenticated
  with check (
    author_id = auth.uid()
    and exists (
      select 1 from public.businesses b
      where b.id = business_reviews.business_id
        and public.is_community_member(b.community_id, auth.uid())
    )
  );

drop policy if exists "business_reviews_update_self" on public.business_reviews;
create policy "business_reviews_update_self" on public.business_reviews
  for update to authenticated
  using (author_id = auth.uid())
  with check (author_id = auth.uid());

drop policy if exists "business_reviews_delete_self_or_staff" on public.business_reviews;
create policy "business_reviews_delete_self_or_staff" on public.business_reviews
  for delete to authenticated
  using (
    author_id = auth.uid()
    or exists (
      select 1 from public.businesses b
      where b.id = business_reviews.business_id
        and public.is_community_staff(b.community_id, auth.uid())
    )
  );

-- business_review_replies -----------------------------------------------------
-- A single public reply to a review, from the listing's own creator (the
-- "owner") or community staff — like a Google Business response. One per review.
create table if not exists public.business_review_replies (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.business_reviews (id) on delete cascade,
  business_id uuid not null references public.businesses (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (review_id)
);

drop trigger if exists set_updated_at on public.business_review_replies;
create trigger set_updated_at before update on public.business_review_replies
  for each row execute function public.set_updated_at();

create index if not exists idx_business_review_replies_business on public.business_review_replies (business_id);

alter table public.business_review_replies enable row level security;

drop policy if exists "business_review_replies_select" on public.business_review_replies;
create policy "business_review_replies_select" on public.business_review_replies
  for select to authenticated
  using (
    exists (
      select 1 from public.businesses b
      where b.id = business_review_replies.business_id
        and public.can_view_space(b.space_id, auth.uid())
    )
  );

-- Only the listing owner (businesses.created_by) or staff may reply.
drop policy if exists "business_review_replies_insert_owner_or_staff" on public.business_review_replies;
create policy "business_review_replies_insert_owner_or_staff" on public.business_review_replies
  for insert to authenticated
  with check (
    author_id = auth.uid()
    and exists (
      select 1 from public.businesses b
      where b.id = business_review_replies.business_id
        and (b.created_by = auth.uid() or public.is_community_staff(b.community_id, auth.uid()))
    )
  );

drop policy if exists "business_review_replies_update_author_or_staff" on public.business_review_replies;
create policy "business_review_replies_update_author_or_staff" on public.business_review_replies
  for update to authenticated
  using (
    author_id = auth.uid()
    or exists (
      select 1 from public.businesses b
      where b.id = business_review_replies.business_id
        and public.is_community_staff(b.community_id, auth.uid())
    )
  );

drop policy if exists "business_review_replies_delete_author_or_staff" on public.business_review_replies;
create policy "business_review_replies_delete_author_or_staff" on public.business_review_replies
  for delete to authenticated
  using (
    author_id = auth.uid()
    or exists (
      select 1 from public.businesses b
      where b.id = business_review_replies.business_id
        and public.is_community_staff(b.community_id, auth.uid())
    )
  );

-- business_saves --------------------------------------------------------------
-- Per-member bookmarks. Only the member who saved a listing can see or manage
-- their own row, so a "Saved" filter reflects that viewer alone.
create table if not exists public.business_saves (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (business_id, user_id)
);

create index if not exists idx_business_saves_user on public.business_saves (user_id);

alter table public.business_saves enable row level security;

drop policy if exists "business_saves_select_self" on public.business_saves;
create policy "business_saves_select_self" on public.business_saves
  for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "business_saves_insert_self" on public.business_saves;
create policy "business_saves_insert_self" on public.business_saves
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.businesses b
      where b.id = business_saves.business_id
        and public.is_community_member(b.community_id, auth.uid())
    )
  );

drop policy if exists "business_saves_delete_self" on public.business_saves;
create policy "business_saves_delete_self" on public.business_saves
  for delete to authenticated
  using (user_id = auth.uid());
