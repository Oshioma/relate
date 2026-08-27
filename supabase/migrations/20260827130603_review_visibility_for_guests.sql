-- =============================================================================
-- Relate — reviews are readable wherever the listing is
--
-- 20260723190000_public_spaces_anon.sql opened every public-space listing table
-- to signed-out visitors, but the review tables (created later) never got the
-- matching anon policies — so a guest sees a fundi or directory listing with
-- its rating badge missing and "no reviews yet" under it, while a member sees a
-- full page of reviews. Reviews are part of the listing: whoever may read the
-- listing may read its reviews and the owner's replies.
--
-- Two fixes here, same principle ("visibility follows the listing's space"):
--
-- 1. Anon select policies for all six review tables (business, accommodation,
--    place — reviews and replies), each gated on `can_view_space(space_id,
--    null)`, which is true only for spaces marked Public. Members-only and
--    private spaces stay hidden from guests, as everywhere else.
--
-- 2. place_reviews / place_review_replies had a stricter authenticated select
--    than the per-facet tables they replaced: community members only, where
--    business_reviews and accommodation_reviews used can_view_space. Left
--    alone, a signed-out guest would now see reviews that a signed-in
--    non-member cannot — so those two policies are rewritten to the same
--    facet-based can_view_space gate. A place has no space of its own; it is
--    visible through whichever facet (directory listing or stay) the viewer
--    can see.
--
-- Writing is untouched: every insert/update/delete policy stays
-- `to authenticated`, so guests still can't review, edit, or reply.
--
-- Safe to re-run: every policy is dropped first.
-- =============================================================================

-- business_reviews ------------------------------------------------------------
drop policy if exists "business_reviews_select_anon" on public.business_reviews;
create policy "business_reviews_select_anon" on public.business_reviews
  for select to anon
  using (
    exists (
      select 1 from public.businesses b
      where b.id = business_reviews.business_id
        and public.can_view_space(b.space_id, null::uuid)
    )
  );

drop policy if exists "business_review_replies_select_anon" on public.business_review_replies;
create policy "business_review_replies_select_anon" on public.business_review_replies
  for select to anon
  using (
    exists (
      select 1 from public.businesses b
      where b.id = business_review_replies.business_id
        and public.can_view_space(b.space_id, null::uuid)
    )
  );

-- accommodation_reviews -------------------------------------------------------
drop policy if exists "accommodation_reviews_select_anon" on public.accommodation_reviews;
create policy "accommodation_reviews_select_anon" on public.accommodation_reviews
  for select to anon
  using (
    exists (
      select 1 from public.accommodation_listings l
      where l.id = accommodation_reviews.listing_id
        and public.can_view_space(l.space_id, null::uuid)
    )
  );

drop policy if exists "accommodation_review_replies_select_anon" on public.accommodation_review_replies;
create policy "accommodation_review_replies_select_anon" on public.accommodation_review_replies
  for select to anon
  using (
    exists (
      select 1 from public.accommodation_listings l
      where l.id = accommodation_review_replies.listing_id
        and public.can_view_space(l.space_id, null::uuid)
    )
  );

-- place_reviews ---------------------------------------------------------------
-- A place is visible through its facets, so its reviews follow whichever facet
-- the viewer can see. The authenticated policy drops its members-only gate to
-- match business_reviews/accommodation_reviews (and not rank guests above
-- signed-in non-members).
drop policy if exists "place_reviews_select" on public.place_reviews;
create policy "place_reviews_select" on public.place_reviews
  for select to authenticated
  using (
    exists (select 1 from public.businesses b
            where b.place_id = place_reviews.place_id
              and public.can_view_space(b.space_id, auth.uid()))
    or exists (select 1 from public.accommodation_listings l
               where l.place_id = place_reviews.place_id
                 and public.can_view_space(l.space_id, auth.uid()))
  );

drop policy if exists "place_reviews_select_anon" on public.place_reviews;
create policy "place_reviews_select_anon" on public.place_reviews
  for select to anon
  using (
    exists (select 1 from public.businesses b
            where b.place_id = place_reviews.place_id
              and public.can_view_space(b.space_id, null::uuid))
    or exists (select 1 from public.accommodation_listings l
               where l.place_id = place_reviews.place_id
                 and public.can_view_space(l.space_id, null::uuid))
  );

drop policy if exists "place_review_replies_select" on public.place_review_replies;
create policy "place_review_replies_select" on public.place_review_replies
  for select to authenticated
  using (
    exists (select 1 from public.businesses b
            where b.place_id = place_review_replies.place_id
              and public.can_view_space(b.space_id, auth.uid()))
    or exists (select 1 from public.accommodation_listings l
               where l.place_id = place_review_replies.place_id
                 and public.can_view_space(l.space_id, auth.uid()))
  );

drop policy if exists "place_review_replies_select_anon" on public.place_review_replies;
create policy "place_review_replies_select_anon" on public.place_review_replies
  for select to anon
  using (
    exists (select 1 from public.businesses b
            where b.place_id = place_review_replies.place_id
              and public.can_view_space(b.space_id, null::uuid))
    or exists (select 1 from public.accommodation_listings l
               where l.place_id = place_review_replies.place_id
                 and public.can_view_space(l.space_id, null::uuid))
  );
