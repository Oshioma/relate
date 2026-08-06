-- Stage 2: one review stream per place.
--
-- A hotel with a restaurant currently collects two sets of reviews and two
-- ratings — one on the stay, one on the directory listing — and they disagree.
-- A guest writing "lovely place, great food" has no idea which of the two pages
-- they landed on, and neither number is the truth about the place.
--
-- Reviews now belong to the place, not to the facet, so both pages show the
-- same conversation and the same rating.
--
-- A side effect worth knowing: deleting a directory listing no longer destroys
-- its reviews. They belong to the place, which still exists as long as any
-- facet does. That is the intended behaviour — the reviews were about the
-- place, not about the row.

create table if not exists public.place_reviews (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references public.places (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  body text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- One review per member per place, as each facet enforced for itself.
  unique (place_id, author_id)
);

create table if not exists public.place_review_replies (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.place_reviews (id) on delete cascade,
  place_id uuid not null references public.places (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (review_id)
);

create index if not exists idx_place_reviews_place on public.place_reviews (place_id, created_at desc);
create index if not exists idx_place_review_replies_place on public.place_review_replies (place_id);

drop trigger if exists set_updated_at on public.place_reviews;
create trigger set_updated_at before update on public.place_reviews
  for each row execute function public.set_updated_at();
drop trigger if exists set_updated_at on public.place_review_replies;
create trigger set_updated_at before update on public.place_review_replies
  for each row execute function public.set_updated_at();

-- Backfill. Both sources are folded in; where the same member reviewed both
-- facets of one place, the more recently updated review wins rather than one
-- silently clobbering the other. `distinct on` needs the ordering to start with
-- the conflict key, hence the subquery.
insert into public.place_reviews (place_id, author_id, rating, body, created_at, updated_at)
select distinct on (place_id, author_id) place_id, author_id, rating, body, created_at, updated_at
from (
  select b.place_id, r.author_id, r.rating, r.body, r.created_at, r.updated_at
  from public.business_reviews r
  join public.businesses b on b.id = r.business_id
  where b.place_id is not null
  union all
  select a.place_id, r.author_id, r.rating, r.body, r.created_at, r.updated_at
  from public.accommodation_reviews r
  join public.accommodation_listings a on a.id = r.listing_id
  where a.place_id is not null
) merged
order by place_id, author_id, updated_at desc
on conflict (place_id, author_id) do nothing;

-- Replies follow their review, matched back by place and author. A review that
-- lost the dedupe above takes its reply with it; the surviving review keeps
-- whichever reply belonged to it.
insert into public.place_review_replies (review_id, place_id, author_id, body, created_at, updated_at)
select distinct on (pr.id) pr.id, pr.place_id, src.author_id, src.body, src.created_at, src.updated_at
from (
  select b.place_id, r.author_id as review_author, rep.author_id, rep.body, rep.created_at, rep.updated_at
  from public.business_review_replies rep
  join public.business_reviews r on r.id = rep.review_id
  join public.businesses b on b.id = rep.business_id
  where b.place_id is not null
  union all
  select a.place_id, r.author_id as review_author, rep.author_id, rep.body, rep.created_at, rep.updated_at
  from public.accommodation_review_replies rep
  join public.accommodation_reviews r on r.id = rep.review_id
  join public.accommodation_listings a on a.id = rep.listing_id
  where a.place_id is not null
) src
join public.place_reviews pr on pr.place_id = src.place_id and pr.author_id = src.review_author
order by pr.id, src.updated_at desc
on conflict (review_id) do nothing;

alter table public.place_reviews enable row level security;
alter table public.place_review_replies enable row level security;

-- Visibility follows the place, which follows community membership. The facet
-- policies still govern the listings themselves; this governs the conversation
-- about the place, which is the same conversation wherever you read it from.
drop policy if exists "place_reviews_select" on public.place_reviews;
create policy "place_reviews_select" on public.place_reviews
  for select to authenticated
  using (
    exists (select 1 from public.places p where p.id = place_reviews.place_id
            and public.is_community_member(p.community_id, auth.uid()))
  );

drop policy if exists "place_reviews_insert_self" on public.place_reviews;
create policy "place_reviews_insert_self" on public.place_reviews
  for insert to authenticated
  with check (
    author_id = auth.uid()
    and exists (select 1 from public.places p where p.id = place_reviews.place_id
                and public.is_community_member(p.community_id, auth.uid()))
  );

drop policy if exists "place_reviews_update_self" on public.place_reviews;
create policy "place_reviews_update_self" on public.place_reviews
  for update to authenticated
  using (author_id = auth.uid())
  with check (author_id = auth.uid());

drop policy if exists "place_reviews_delete_self_or_staff" on public.place_reviews;
create policy "place_reviews_delete_self_or_staff" on public.place_reviews
  for delete to authenticated
  using (
    author_id = auth.uid()
    or exists (select 1 from public.places p where p.id = place_reviews.place_id
               and public.is_community_staff(p.community_id, auth.uid()))
  );

drop policy if exists "place_review_replies_select" on public.place_review_replies;
create policy "place_review_replies_select" on public.place_review_replies
  for select to authenticated
  using (
    exists (select 1 from public.places p where p.id = place_review_replies.place_id
            and public.is_community_member(p.community_id, auth.uid()))
  );

-- Replying is the listing owner's or staff's right, as it was per-facet: anyone
-- who owns a facet of this place, or staff.
drop policy if exists "place_review_replies_write" on public.place_review_replies;
create policy "place_review_replies_write" on public.place_review_replies
  for all to authenticated
  using (
    author_id = auth.uid()
    or exists (select 1 from public.places p where p.id = place_review_replies.place_id
               and public.is_community_staff(p.community_id, auth.uid()))
  )
  with check (
    author_id = auth.uid()
    and exists (
      select 1 from public.places p
      where p.id = place_review_replies.place_id
        and (
          public.is_community_staff(p.community_id, auth.uid())
          or exists (select 1 from public.businesses b where b.place_id = p.id and (b.claimed_by = auth.uid() or b.created_by = auth.uid()))
          or exists (select 1 from public.accommodation_listings a where a.place_id = p.id and a.listed_by = auth.uid())
        )
    )
  );
