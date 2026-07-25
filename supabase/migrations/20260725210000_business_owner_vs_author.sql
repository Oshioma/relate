-- =============================================================================
-- Relate — Business Directory: separate "who added a listing" from "who owns it"
--
-- Safe to re-run.
--
-- Background: the claim feature (20260725170000) made the member who ADDED a
-- listing count as an owner alongside an approved claimant. That conflates two
-- different roles. In practice a curator adds many businesses on behalf of other
-- people and then asks each real owner to claim their own listing — so adding a
-- listing must NOT confer ownership.
--
-- New model:
--   * created_by  — the member who added the listing. Attribution only; grants
--                   no ownership. (Still the insert identity — you add as you.)
--   * claimed_by  — the listing's OWNER, set when staff approve a claim. This is
--                   the single source of truth for "owner" (messaging, replies).
--
-- Manage rights (edit the listing, manage its photos, reply to reviews, delete)
-- follow a hand-off rule:
--   owner (claimed_by) if the listing is claimed;
--   otherwise the adder (created_by) may maintain it while it is unclaimed;
--   plus community staff and platform super admins, always.
-- Once a claim is approved, the adder loses manage rights and the owner takes
-- over. claimed_by stays staff-managed (via the approval flow), unchanged.
-- =============================================================================

-- Shared predicate for the child tables (images, review replies). security
-- definer so it can read businesses regardless of the caller's row visibility.
create or replace function public.can_manage_business(p_business_id uuid, p_uid uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.businesses b
    where b.id = p_business_id
      and (
        b.claimed_by = p_uid
        or (b.claimed_by is null and b.created_by = p_uid)
        or public.is_community_staff(b.community_id, p_uid)
        or public.is_super_admin(p_uid)
      )
  );
$$;

-- Privileged fields (verified/featured/claimed_by) stay staff-managed, but a
-- platform super admin may set them too — matching their manage rights above.
create or replace function public.enforce_business_privileged_fields()
returns trigger as $$
begin
  if not (public.is_community_staff(new.community_id, auth.uid()) or public.is_super_admin(auth.uid())) then
    new.verified := old.verified;
    new.featured := old.featured;
    new.claimed_by := old.claimed_by;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- businesses: update/delete follow the hand-off rule. Inlined on the row's own
-- columns (not can_manage_business) to avoid a self-referential subquery in the
-- table's own policy. (Insert is unchanged — you still add a listing as yourself.)
drop policy if exists "businesses_update_author_or_staff" on public.businesses;
create policy "businesses_update_author_or_staff" on public.businesses
  for update to authenticated
  using (
    claimed_by = auth.uid()
    or (claimed_by is null and created_by = auth.uid())
    or public.is_community_staff(community_id, auth.uid())
    or public.is_super_admin(auth.uid())
  )
  with check (
    claimed_by = auth.uid()
    or (claimed_by is null and created_by = auth.uid())
    or public.is_community_staff(community_id, auth.uid())
    or public.is_super_admin(auth.uid())
  );

drop policy if exists "businesses_delete_author_or_staff" on public.businesses;
create policy "businesses_delete_author_or_staff" on public.businesses
  for delete to authenticated
  using (
    claimed_by = auth.uid()
    or (claimed_by is null and created_by = auth.uid())
    or public.is_community_staff(community_id, auth.uid())
    or public.is_super_admin(auth.uid())
  );

-- business_images: managing photos follows the same hand-off rule. The image
-- row's own created_by must still be the uploader.
drop policy if exists "business_images_insert_author_or_staff" on public.business_images;
create policy "business_images_insert_author_or_staff" on public.business_images
  for insert to authenticated
  with check (
    created_by = auth.uid()
    and public.can_manage_business(business_images.business_id, auth.uid())
  );

drop policy if exists "business_images_update_author_or_staff" on public.business_images;
create policy "business_images_update_author_or_staff" on public.business_images
  for update to authenticated
  using (public.can_manage_business(business_images.business_id, auth.uid()));

drop policy if exists "business_images_delete_author_or_staff" on public.business_images;
create policy "business_images_delete_author_or_staff" on public.business_images
  for delete to authenticated
  using (public.can_manage_business(business_images.business_id, auth.uid()));

-- business_review_replies: a reply speaks for the listing, so it follows the
-- same manage rule (owner while claimed, else adder, plus staff/super admin).
drop policy if exists "business_review_replies_insert_owner_or_staff" on public.business_review_replies;
create policy "business_review_replies_insert_owner_or_staff" on public.business_review_replies
  for insert to authenticated
  with check (
    author_id = auth.uid()
    and public.can_manage_business(business_review_replies.business_id, auth.uid())
  );
