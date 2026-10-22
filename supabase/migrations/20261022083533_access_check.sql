-- =============================================================================
-- Relate — Access Check: "can this person open this space, and why?"
--
-- For community admins answering "why can't X get in?" without guessing or
-- signing in as them. access_check(space, user) runs the SAME functions RLS
-- uses (can_see_space_shell, has_space_access, the subscription checks) for
-- the person asked about, and returns yes/no facts only:
--
--   * no post, comment, lesson, file or message content, ever;
--   * tier names only for tiers linked to the space (the admin can read those);
--   * counts, not titles, for paid courses.
--
-- Only an admin of the space's community may ask, and only about that
-- community: the person checked must be a member of it (any status) or the
-- community's owner, or null for "a visitor who isn't signed in". Every check
-- is logged in access_check_log so a community can see who looked up whom.
--
-- Safe to re-run.
-- =============================================================================

create table if not exists public.access_check_log (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities (id) on delete cascade,
  space_id uuid not null references public.spaces (id) on delete cascade,
  checked_by uuid not null references auth.users (id) on delete cascade,
  -- null = checked as a signed-out visitor.
  subject_user_id uuid references auth.users (id) on delete set null,
  can_discover boolean not null,
  can_open boolean not null,
  created_at timestamptz not null default now()
);

create index if not exists access_check_log_community_idx on public.access_check_log (community_id, created_at desc);

alter table public.access_check_log enable row level security;

-- Admins of the community read its log. Nobody writes it directly: rows only
-- come from access_check() below.
drop policy if exists "access_check_log_select_admin" on public.access_check_log;
create policy "access_check_log_select_admin" on public.access_check_log
  for select to authenticated
  using (public.is_community_admin(community_id, auth.uid()));

create or replace function public.access_check(p_space_id uuid, p_user_id uuid)
returns jsonb
language plpgsql
security definer
volatile
set search_path = public
as $$
declare
  v_caller uuid := auth.uid();
  v_space record;
  v_status text;
  v_role text;
  v_is_owner boolean;
  v_discover boolean;
  v_open boolean;
  v_gated boolean;
  v_result jsonb;
begin
  select s.id, s.community_id, s.visibility::text as visibility, s.price_cents,
         c.privacy::text as privacy, c.owner_id
    into v_space
    from public.spaces s
    join public.communities c on c.id = s.community_id
   where s.id = p_space_id;

  if v_space.id is null or v_caller is null or not public.is_community_admin(v_space.community_id, v_caller) then
    raise exception 'Only an admin of this community can check access.' using errcode = '42501';
  end if;

  v_is_owner := p_user_id is not null and v_space.owner_id = p_user_id;
  if p_user_id is not null then
    select m.status::text, m.role::text into v_status, v_role
      from public.community_memberships m
     where m.community_id = v_space.community_id and m.user_id = p_user_id;
    -- Only people connected to this community can be looked up.
    if v_status is null and not v_is_owner then
      raise exception 'That person isn''t a member of this community.' using errcode = '42501';
    end if;
  end if;

  v_discover := coalesce(public.can_see_space_shell(p_space_id, p_user_id), false);
  v_open := coalesce(public.has_space_access(p_space_id, p_user_id), false);
  v_gated := v_space.visibility <> 'public'
    and (v_space.price_cents > 0 or exists (select 1 from public.tier_spaces ts where ts.space_id = p_space_id));

  v_result := jsonb_build_object(
    'community_privacy', v_space.privacy,
    'visibility', v_space.visibility,
    'gated', v_gated,
    'own_price_cents', v_space.price_cents,
    'membership_status', case when v_is_owner then 'active' else coalesce(v_status, 'none') end,
    'role', case when v_is_owner then 'owner' else v_role end,
    'is_member', p_user_id is not null and public.is_community_member(v_space.community_id, p_user_id),
    'is_staff', p_user_id is not null and public.is_community_staff(v_space.community_id, p_user_id),
    'can_discover', v_discover,
    'can_open', v_open,
    'has_space_subscription', p_user_id is not null and public.has_active_space_subscription(p_space_id, p_user_id),
    'has_tier_subscription', p_user_id is not null and public.has_active_tier_for_space(p_space_id, p_user_id),
    'unlocking_tiers', coalesce((
      select jsonb_agg(jsonb_build_object('id', t.id, 'name', t.name, 'archived', t.archived_at is not null) order by t.name)
        from public.tier_spaces ts
        join public.community_tiers t on t.id = ts.tier_id
       where ts.space_id = p_space_id
    ), '[]'::jsonb),
    'paid_courses', (
      select count(*) from public.courses co
       where co.space_id = p_space_id and co.price_cents > 0 and co.status = 'published'
    ),
    'paid_courses_enrolled', case when p_user_id is null then 0 else (
      select count(*) from public.courses co
        join public.course_enrollments e on e.course_id = co.id and e.user_id = p_user_id
       where co.space_id = p_space_id and co.price_cents > 0 and co.status = 'published'
    ) end
  );

  insert into public.access_check_log (community_id, space_id, checked_by, subject_user_id, can_discover, can_open)
  values (v_space.community_id, p_space_id, v_caller, p_user_id, v_discover, v_open);

  return v_result;
end;
$$;

revoke all on function public.access_check(uuid, uuid) from public, anon;
grant execute on function public.access_check(uuid, uuid) to authenticated;
