-- =============================================================================
-- Relate — a community's own owner can never be refused their seat
--
-- enforce_community_plan_limits treats every incoming membership the same way,
-- including the one handle_new_community creates for the founder in the same
-- statement as the community itself. When the admins cap has no room, that row
-- is refused, the whole INSERT rolls back, and creating a community fails
-- outright — the person is told to "upgrade the plan to add another admin"
-- while trying to make their first community, which is not a thing they can
-- act on and not a cap that was protecting anything.
--
-- The cap exists to stop a community growing past what its plan pays for.
-- A founder is not growth: they are the community. There is exactly one row
-- per community that can match (owner_id is a single column), the owner still
-- COUNTS toward the caps for everyone added after them, and nobody else's seat
-- is affected — so this removes a failure mode without widening any limit.
--
-- Everything else about the trigger is unchanged; the body below is the shipped
-- one from 20260821142228_plan_grace_and_limit_enforcement.sql with the owner
-- exemption added directly after the platform-operator bypass.
--
-- Safe to re-run.
-- =============================================================================

create or replace function public.enforce_community_plan_limits()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_limit integer;
  v_count integer;
  v_adds_member boolean;
  v_adds_staff boolean;
  v_was_staff boolean;
begin
  -- A platform operator is the escape hatch for anything the caps get wrong.
  if public.is_super_admin(auth.uid()) then
    return new;
  end if;

  -- A community's own owner is never an addition to it. This row is written by
  -- handle_new_community inside the same statement that creates the community,
  -- so refusing it doesn't enforce a cap — it makes the community impossible to
  -- create. At most one row per community can match, and the owner still counts
  -- toward the caps for everyone admitted after them.
  if new.status = 'active'
     and exists (
       select 1
       from public.communities c
       where c.id = new.community_id
         and c.owner_id = new.user_id
     )
  then
    return new;
  end if;

  v_adds_member := new.status = 'active' and (tg_op = 'INSERT' or old.status is distinct from 'active');

  v_was_staff := tg_op = 'UPDATE' and old.status = 'active' and old.role in ('owner', 'admin');
  v_adds_staff := new.status = 'active' and new.role in ('owner', 'admin') and not v_was_staff;

  if v_adds_member then
    v_limit := public.community_plan_limit(new.community_id, 'members');
    if v_limit is not null then
      select count(*) into v_count
      from public.community_memberships m
      where m.community_id = new.community_id
        and m.status = 'active'
        and (tg_op = 'INSERT' or m.id <> new.id);

      if v_count >= v_limit then
        raise exception 'plan_limit: this community has reached its plan''s limit of % members. Its owner can upgrade the plan to add more.', v_limit
          using errcode = 'P0001';
      end if;
    end if;
  end if;

  if v_adds_staff then
    v_limit := public.community_plan_limit(new.community_id, 'admins');
    if v_limit is not null then
      select count(*) into v_count
      from public.community_memberships m
      where m.community_id = new.community_id
        and m.status = 'active'
        and m.role in ('owner', 'admin')
        and (tg_op = 'INSERT' or m.id <> new.id);

      if v_count >= v_limit then
        raise exception 'plan_limit: this community''s plan includes % admin(s). Upgrade the plan to add another, or use the Moderator role instead.', v_limit
          using errcode = 'P0001';
      end if;
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_plan_limits on public.community_memberships;
create trigger enforce_plan_limits
  before insert or update on public.community_memberships
  for each row execute function public.enforce_community_plan_limits();
