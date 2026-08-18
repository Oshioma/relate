-- =============================================================================
-- Relate — Accommodation: claiming a stay listing
--
-- Safe to re-run.
--
-- The directory has had this since 20260725170000/20260725210000: a curator adds
-- a listing on someone else's behalf, and the real owner claims it. Stays had no
-- equivalent — accommodation_listings.listed_by was both "who added it" and "who
-- may edit it", so a host whose place was listed for them could never take it
-- over. This mirrors the business flow, one table and one column at a time:
--
--   * listed_by  — the member who added the stay. Attribution; grants no
--                  ownership of its own once someone else has claimed it.
--   * claimed_by — the stay's HOST, set when staff approve a claim.
--
-- Manage rights (edit the listing, flip its availability, delete it, reply to
-- reviews) follow the same hand-off rule as businesses:
--   host (claimed_by) if the stay is claimed;
--   otherwise the lister (listed_by) maintains it while it is unclaimed;
--   plus community staff and platform super admins, always.
--
-- As with businesses, any signed-in user may *open* a claim — "claim your place"
-- is an onboarding path for a host who hasn't joined the community yet. Staff
-- still approve every claim before claimed_by is set, so the control point is
-- unchanged.
-- =============================================================================

alter table public.accommodation_listings
  add column if not exists claimed_by uuid references public.profiles (id) on delete set null;

create index if not exists idx_accommodation_listings_claimed_by on public.accommodation_listings (claimed_by);

-- claimed_by is privileged: only staff (or a super admin) may change it, through
-- the approval flow below. Without this a host editing their own stay could
-- hand ownership to anyone by posting a different value.
create or replace function public.enforce_accommodation_privileged_fields()
returns trigger as $$
begin
  if not (public.is_community_staff(new.community_id, auth.uid()) or public.is_super_admin(auth.uid())) then
    new.claimed_by := old.claimed_by;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_enforce_accommodation_privileged_fields on public.accommodation_listings;
create trigger trg_enforce_accommodation_privileged_fields
  before update on public.accommodation_listings
  for each row execute function public.enforce_accommodation_privileged_fields();

-- Shared predicate for the child tables (review replies). security definer so it
-- can read the listing regardless of the caller's row visibility.
create or replace function public.can_manage_accommodation_listing(p_listing_id uuid, p_uid uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.accommodation_listings l
    where l.id = p_listing_id
      and (
        l.claimed_by = p_uid
        or (l.claimed_by is null and l.listed_by = p_uid)
        or public.is_community_staff(l.community_id, p_uid)
        or public.is_super_admin(p_uid)
      )
  );
$$;

-- accommodation_listings: update/delete follow the hand-off rule. Inlined on the
-- row's own columns (not can_manage_accommodation_listing) to avoid a
-- self-referential subquery in the table's own policy. Insert is unchanged — you
-- still add a stay as yourself, as a member of the community.
drop policy if exists "accommodation_listings_update_lister_or_staff" on public.accommodation_listings;
create policy "accommodation_listings_update_lister_or_staff" on public.accommodation_listings
  for update to authenticated
  using (
    claimed_by = auth.uid()
    or (claimed_by is null and listed_by = auth.uid())
    or public.is_community_staff(community_id, auth.uid())
    or public.is_super_admin(auth.uid())
  )
  with check (
    claimed_by = auth.uid()
    or (claimed_by is null and listed_by = auth.uid())
    or public.is_community_staff(community_id, auth.uid())
    or public.is_super_admin(auth.uid())
  );

drop policy if exists "accommodation_listings_delete_lister_or_staff" on public.accommodation_listings;
create policy "accommodation_listings_delete_lister_or_staff" on public.accommodation_listings
  for delete to authenticated
  using (
    claimed_by = auth.uid()
    or (claimed_by is null and listed_by = auth.uid())
    or public.is_community_staff(community_id, auth.uid())
    or public.is_super_admin(auth.uid())
  );

-- A reply speaks for the stay, so replying follows the same rule.
drop policy if exists "accommodation_review_replies_insert_host_or_staff" on public.accommodation_review_replies;
create policy "accommodation_review_replies_insert_host_or_staff" on public.accommodation_review_replies
  for insert to authenticated
  with check (
    author_id = auth.uid()
    and public.can_manage_accommodation_listing(accommodation_review_replies.listing_id, auth.uid())
  );

-- Shared-place reviews (20260802163252): the accommodation arm of "who owns a
-- facet of this place" now means the host, or the lister while unclaimed.
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
          or exists (
            select 1 from public.accommodation_listings a
            where a.place_id = p.id
              and (a.claimed_by = auth.uid() or (a.claimed_by is null and a.listed_by = auth.uid()))
          )
        )
    )
  );

-- accommodation_claims ---------------------------------------------------------
-- A request to be recognised as a stay's host. Staff approve or reject; an
-- approved claim sets accommodation_listings.claimed_by. Mirrors business_claims.
create table if not exists public.accommodation_claims (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.accommodation_listings (id) on delete cascade,
  community_id uuid not null references public.communities (id) on delete cascade,
  claimant_id uuid not null references public.profiles (id) on delete cascade,
  message text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  resolved_by uuid references public.profiles (id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  unique (listing_id, claimant_id)
);

create index if not exists idx_accommodation_claims_listing on public.accommodation_claims (listing_id, status);
create index if not exists idx_accommodation_claims_community on public.accommodation_claims (community_id, status);

alter table public.accommodation_claims enable row level security;

-- The claimant sees their own claims; staff see every claim in their community.
drop policy if exists "accommodation_claims_select_own_or_staff" on public.accommodation_claims;
create policy "accommodation_claims_select_own_or_staff" on public.accommodation_claims
  for select to authenticated
  using (claimant_id = auth.uid() or public.is_community_staff(community_id, auth.uid()));

-- Any signed-in user may open a claim on a stay that isn't already claimed —
-- membership isn't required, since claiming is how a host joins in the first
-- place. Staff still approve before ownership is granted.
drop policy if exists "accommodation_claims_insert_self" on public.accommodation_claims;
create policy "accommodation_claims_insert_self" on public.accommodation_claims
  for insert to authenticated
  with check (
    claimant_id = auth.uid()
    and exists (
      select 1
      from public.accommodation_listings l
      where l.id = accommodation_claims.listing_id
        and l.community_id = accommodation_claims.community_id
        and l.claimed_by is null
    )
  );

-- Only staff resolve claims (approve/reject).
drop policy if exists "accommodation_claims_update_staff" on public.accommodation_claims;
create policy "accommodation_claims_update_staff" on public.accommodation_claims
  for update to authenticated
  using (public.is_community_staff(community_id, auth.uid()))
  with check (public.is_community_staff(community_id, auth.uid()));

-- The claimant can withdraw their own claim; staff can remove any.
drop policy if exists "accommodation_claims_delete_own_or_staff" on public.accommodation_claims;
create policy "accommodation_claims_delete_own_or_staff" on public.accommodation_claims
  for delete to authenticated
  using (claimant_id = auth.uid() or public.is_community_staff(community_id, auth.uid()));

-- Notifications ----------------------------------------------------------------
-- Same pair as notify_business_claims (20260728093532): staff hear about a new
-- claim, the claimant hears the verdict. Both link to the stay's detail page,
-- where staff approve or reject inline.
create or replace function public.notify_new_accommodation_claim()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_listing_name text;
  v_link text;
  v_actor_name text;
begin
  if new.status != 'pending' then
    return new;
  end if;

  select l.name,
         '/c/' || c.slug || '/spaces/' || s.slug || '/stays/' || l.id
    into v_listing_name, v_link
  from public.accommodation_listings l
  join public.communities c on c.id = l.community_id
  join public.spaces s on s.id = l.space_id
  where l.id = new.listing_id;

  select coalesce(full_name, username) into v_actor_name from public.profiles where id = new.claimant_id;

  insert into public.notifications (user_id, community_id, type, title, body, link, actor_id)
  select
    m.user_id,
    new.community_id,
    'claim',
    v_actor_name || ' wants to claim "' || v_listing_name || '"',
    left(new.message, 140),
    v_link,
    new.claimant_id
  from public.community_memberships m
  where m.community_id = new.community_id
    and m.status = 'active'
    and m.role in ('owner', 'admin', 'moderator')
    and m.user_id != new.claimant_id;

  return new;
end;
$$;

drop trigger if exists trg_notify_new_accommodation_claim on public.accommodation_claims;
create trigger trg_notify_new_accommodation_claim
  after insert on public.accommodation_claims
  for each row execute function public.notify_new_accommodation_claim();

create or replace function public.notify_accommodation_claim_resolved()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_listing_name text;
  v_link text;
begin
  -- Only when a pending claim transitions to a resolved state.
  if new.status = old.status or new.status not in ('approved', 'rejected') then
    return new;
  end if;

  -- Don't ping the claimant if they somehow resolved their own claim.
  if new.resolved_by = new.claimant_id then
    return new;
  end if;

  select l.name,
         '/c/' || c.slug || '/spaces/' || s.slug || '/stays/' || l.id
    into v_listing_name, v_link
  from public.accommodation_listings l
  join public.communities c on c.id = l.community_id
  join public.spaces s on s.id = l.space_id
  where l.id = new.listing_id;

  insert into public.notifications (user_id, community_id, type, title, link, actor_id)
  values (
    new.claimant_id,
    new.community_id,
    'claim',
    'Your claim on "' || v_listing_name || '" was ' || new.status,
    v_link,
    new.resolved_by
  );

  return new;
end;
$$;

drop trigger if exists trg_notify_accommodation_claim_resolved on public.accommodation_claims;
create trigger trg_notify_accommodation_claim_resolved
  after update on public.accommodation_claims
  for each row execute function public.notify_accommodation_claim_resolved();
