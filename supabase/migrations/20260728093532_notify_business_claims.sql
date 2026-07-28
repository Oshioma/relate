-- =============================================================================
-- Relate — notifications for business-directory ownership claims
--
-- Two SECURITY DEFINER triggers, mirroring notify_new_comment / notify_new_post:
--   1. New claim  → every active staff member of the community is notified that
--      there's a claim to review (except the claimant, if a staffer claims a
--      listing themselves).
--   2. Claim resolved → the claimant is notified their claim was approved or
--      rejected (skipped if a staffer somehow resolves their own claim).
--
-- Both link to the listing's detail page, where staff approve/reject inline.
-- The 'claim' notification type is added in the previous migration. Safe to
-- re-run.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- New claim on a listing → notify community staff
-- -----------------------------------------------------------------------------
create or replace function public.notify_new_claim()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_business_name text;
  v_link text;
  v_actor_name text;
begin
  if new.status != 'pending' then
    return new;
  end if;

  select b.name,
         '/c/' || c.slug || '/spaces/' || s.slug || '/businesses/' || b.id
    into v_business_name, v_link
  from public.businesses b
  join public.communities c on c.id = b.community_id
  join public.spaces s on s.id = b.space_id
  where b.id = new.business_id;

  select coalesce(full_name, username) into v_actor_name from public.profiles where id = new.claimant_id;

  insert into public.notifications (user_id, community_id, type, title, body, link, actor_id)
  select
    m.user_id,
    new.community_id,
    'claim',
    v_actor_name || ' wants to claim "' || v_business_name || '"',
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

drop trigger if exists trg_notify_new_claim on public.business_claims;
create trigger trg_notify_new_claim
  after insert on public.business_claims
  for each row execute function public.notify_new_claim();

-- -----------------------------------------------------------------------------
-- Claim approved or rejected → notify the claimant
-- -----------------------------------------------------------------------------
create or replace function public.notify_claim_resolved()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_business_name text;
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

  select b.name,
         '/c/' || c.slug || '/spaces/' || s.slug || '/businesses/' || b.id
    into v_business_name, v_link
  from public.businesses b
  join public.communities c on c.id = b.community_id
  join public.spaces s on s.id = b.space_id
  where b.id = new.business_id;

  insert into public.notifications (user_id, community_id, type, title, link, actor_id)
  values (
    new.claimant_id,
    new.community_id,
    'claim',
    'Your claim on "' || v_business_name || '" was ' || new.status,
    v_link,
    new.resolved_by
  );

  return new;
end;
$$;

drop trigger if exists trg_notify_claim_resolved on public.business_claims;
create trigger trg_notify_claim_resolved
  after update on public.business_claims
  for each row execute function public.notify_claim_resolved();
