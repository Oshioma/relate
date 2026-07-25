-- =============================================================================
-- Relate — Business Directory: claiming a listing + structured opening hours
--
-- Safe to re-run.
--
-- Two additions:
--   1. Claiming — a member can claim a listing they own. Claims are staff-
--      approved (like verify/feature). An approved claim sets businesses.claimed_by,
--      and from then on the claimant counts as an "owner" alongside the member who
--      first added the listing: they can edit it, manage its photos and reply to
--      reviews. Existing owner-or-staff policies are widened to include claimed_by.
--   2. Structured opening hours — an optional per-day jsonb schedule powering a
--      reliable "Open now" badge. The free-text opening_hours column stays as the
--      human-readable display value (regenerated from the schedule when set).
-- =============================================================================

alter table public.businesses add column if not exists claimed_by uuid references public.profiles (id) on delete set null;

-- Per-day hours: { "0".."6" (Sun..Sat): { "closed": bool, "open": "HH:MM", "close": "HH:MM" } }.
-- Null means "not provided" — fall back to parsing the free-text opening_hours.
alter table public.businesses add column if not exists opening_hours_structured jsonb;

-- claimed_by is privileged like verified/featured: only staff may change it
-- (through the approval flow), so a member editing their listing can't silently
-- reassign ownership. Extends the existing trigger function.
create or replace function public.enforce_business_privileged_fields()
returns trigger as $$
begin
  if not public.is_community_staff(new.community_id, auth.uid()) then
    new.verified := old.verified;
    new.featured := old.featured;
    new.claimed_by := old.claimed_by;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- Widen listing update/delete to the claimant as well as the original author
-- and staff. (Insert is unchanged — you still add a listing as yourself.)
drop policy if exists "businesses_update_author_or_staff" on public.businesses;
create policy "businesses_update_author_or_staff" on public.businesses
  for update to authenticated
  using (created_by = auth.uid() or claimed_by = auth.uid() or public.is_community_staff(community_id, auth.uid()))
  with check (created_by = auth.uid() or claimed_by = auth.uid() or public.is_community_staff(community_id, auth.uid()));

drop policy if exists "businesses_delete_author_or_staff" on public.businesses;
create policy "businesses_delete_author_or_staff" on public.businesses
  for delete to authenticated
  using (created_by = auth.uid() or claimed_by = auth.uid() or public.is_community_staff(community_id, auth.uid()));

-- Widen the photo policies so a claimant manages photos too.
drop policy if exists "business_images_insert_author_or_staff" on public.business_images;
create policy "business_images_insert_author_or_staff" on public.business_images
  for insert to authenticated
  with check (
    created_by = auth.uid()
    and exists (
      select 1 from public.businesses b
      where b.id = business_images.business_id
        and public.is_community_member(b.community_id, auth.uid())
        and (b.created_by = auth.uid() or b.claimed_by = auth.uid() or public.is_community_staff(b.community_id, auth.uid()))
    )
  );

drop policy if exists "business_images_update_author_or_staff" on public.business_images;
create policy "business_images_update_author_or_staff" on public.business_images
  for update to authenticated
  using (
    exists (
      select 1 from public.businesses b
      where b.id = business_images.business_id
        and (b.created_by = auth.uid() or b.claimed_by = auth.uid() or public.is_community_staff(b.community_id, auth.uid()))
    )
  );

drop policy if exists "business_images_delete_author_or_staff" on public.business_images;
create policy "business_images_delete_author_or_staff" on public.business_images
  for delete to authenticated
  using (
    exists (
      select 1 from public.businesses b
      where b.id = business_images.business_id
        and (b.created_by = auth.uid() or b.claimed_by = auth.uid() or public.is_community_staff(b.community_id, auth.uid()))
    )
  );

-- A claimant is an "owner" for review replies too.
drop policy if exists "business_review_replies_insert_owner_or_staff" on public.business_review_replies;
create policy "business_review_replies_insert_owner_or_staff" on public.business_review_replies
  for insert to authenticated
  with check (
    author_id = auth.uid()
    and exists (
      select 1 from public.businesses b
      where b.id = business_review_replies.business_id
        and (b.created_by = auth.uid() or b.claimed_by = auth.uid() or public.is_community_staff(b.community_id, auth.uid()))
    )
  );

-- business_claims -------------------------------------------------------------
-- A member's request to be recognised as a listing's owner. Staff approve or
-- reject, mirroring how verify/feature are staff-gated.
create table if not exists public.business_claims (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  community_id uuid not null references public.communities (id) on delete cascade,
  claimant_id uuid not null references public.profiles (id) on delete cascade,
  message text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  resolved_by uuid references public.profiles (id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  unique (business_id, claimant_id)
);

create index if not exists idx_business_claims_business on public.business_claims (business_id, status);
create index if not exists idx_business_claims_community on public.business_claims (community_id, status);

alter table public.business_claims enable row level security;

-- The claimant sees their own claims; staff see every claim in their community.
drop policy if exists "business_claims_select_own_or_staff" on public.business_claims;
create policy "business_claims_select_own_or_staff" on public.business_claims
  for select to authenticated
  using (claimant_id = auth.uid() or public.is_community_staff(community_id, auth.uid()));

-- A member may open a claim on a listing that isn't already claimed.
drop policy if exists "business_claims_insert_self" on public.business_claims;
create policy "business_claims_insert_self" on public.business_claims
  for insert to authenticated
  with check (
    claimant_id = auth.uid()
    and exists (
      select 1 from public.businesses b
      where b.id = business_claims.business_id
        and b.community_id = business_claims.community_id
        and b.claimed_by is null
        and public.is_community_member(b.community_id, auth.uid())
    )
  );

-- Only staff resolve claims (approve/reject).
drop policy if exists "business_claims_update_staff" on public.business_claims;
create policy "business_claims_update_staff" on public.business_claims
  for update to authenticated
  using (public.is_community_staff(community_id, auth.uid()))
  with check (public.is_community_staff(community_id, auth.uid()));

-- The claimant can withdraw a pending claim; staff can remove any.
drop policy if exists "business_claims_delete_own_or_staff" on public.business_claims;
create policy "business_claims_delete_own_or_staff" on public.business_claims
  for delete to authenticated
  using (claimant_id = auth.uid() or public.is_community_staff(community_id, auth.uid()));
