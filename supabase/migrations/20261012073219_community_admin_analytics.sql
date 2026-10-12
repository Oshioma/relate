-- =============================================================================
-- Relate — community analytics for community admins
--
-- The activity data already exists — member_activity_days (who was active,
-- per day), auth_events (joins and leaves), posts / comments / reactions — but
-- only the platform super admin could read it, on /platform-admin/analytics.
-- This gives a community's own owner and admins one RPC that returns their
-- community's numbers for /c/<slug>/admin/analytics.
--
-- Why one aggregate RPC rather than table reads from the app:
--   * member_activity_days and auth_events are super-admin-only under RLS, and
--     widening those policies would expose per-person rows. The function
--     returns only counts, plus a top-members list the admin can already
--     see on their member list.
--   * 90 days x every member is far more rows than PostgREST returns in one
--     page; counting in the database keeps the payload to ~90 small rows.
--
-- Access: the caller must be the community's owner (communities.owner_id, the
-- same rule the app's isCommunityAdmin uses), an active owner/admin member, or
-- a super admin. Anyone else gets insufficient_privilege.
--
-- Shape (jsonb):
--   range_days    7 | 30 | 90 (anything else is treated as 30)
--   presence      { active_today, active_7d, active_30d, member_count }
--   totals        { current: {...}, previous: {...} } — the selected period and
--                 the same-length period before it, each with
--                 active_members, joins, leaves, posts, comments, reactions
--   daily         [{ day, active, joins, leaves, posts, comments, reactions }]
--                 one row per UTC day in the period, oldest first, zero-filled
--   top_spaces    up to 5 spaces by posts + comments in the period
--   top_members   up to 10 current members by a simple engagement score
--
-- Days are UTC days, matching member_activity_days.day.
--
-- Safe to re-run.
-- =============================================================================

create or replace function public.community_analytics(p_community_id uuid, p_days integer default 30)
returns jsonb
language plpgsql
security definer
stable
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_days integer := case when p_days in (7, 30, 90) then p_days else 30 end;
  v_today date := (now() at time zone 'utc')::date;
  v_start date;
  v_prev_start date;
  v_from timestamptz;
  v_prev_from timestamptz;
  v_result jsonb;
begin
  if v_uid is null or not (
    exists (select 1 from public.communities c where c.id = p_community_id and c.owner_id = v_uid)
    or public.is_community_admin(p_community_id, v_uid)
    or public.is_super_admin(v_uid)
  ) then
    raise exception 'Only this community''s owner and admins can view its analytics.'
      using errcode = 'insufficient_privilege';
  end if;

  v_start := v_today - (v_days - 1);
  v_prev_start := v_start - v_days;
  v_from := v_start::timestamp at time zone 'utc';
  v_prev_from := v_prev_start::timestamp at time zone 'utc';

  with
  -- Everything from the start of the previous period, so one scan of each
  -- source serves both the current totals and the comparison.
  act as (
    select a.user_id, a.day
    from public.member_activity_days a
    where a.community_id = p_community_id
      and a.is_member
      and a.day >= v_prev_start
  ),
  membership_events as (
    select e.event_type, e.user_id, (e.created_at at time zone 'utc')::date as day
    from public.auth_events e
    where e.community_id = p_community_id
      and e.event_type in ('join', 'leave')
      and e.created_at >= v_prev_from
  ),
  community_posts as (
    select p.author_id, p.space_id, (p.created_at at time zone 'utc')::date as day
    from public.posts p
    where p.community_id = p_community_id
      and p.created_at >= v_prev_from
  ),
  -- Comments on posts (post pages) and on every other feed card.
  community_comments as (
    select c.author_id, po.space_id, (c.created_at at time zone 'utc')::date as day
    from public.comments c
    join public.posts po on po.id = c.post_id
    where po.community_id = p_community_id
      and c.created_at >= v_prev_from
    union all
    select fc.author_id, null::uuid, (fc.created_at at time zone 'utc')::date
    from public.feed_comments fc
    where fc.community_id = p_community_id
      and fc.created_at >= v_prev_from
  ),
  -- Smiles on posts and on every other feed card.
  community_reactions as (
    select r.user_id, (r.created_at at time zone 'utc')::date as day
    from public.post_reactions r
    join public.posts po on po.id = r.post_id
    where po.community_id = p_community_id
      and r.created_at >= v_prev_from
    union all
    select fr.user_id, (fr.created_at at time zone 'utc')::date
    from public.feed_reactions fr
    where fr.community_id = p_community_id
      and fr.created_at >= v_prev_from
  ),
  days as (
    select d::date as day
    from generate_series(v_start, v_today, interval '1 day') as d
  ),
  -- Per-day counts, each grouped once and then joined onto the calendar, so
  -- the cost is one pass per source rather than one per day.
  active_by_day as (
    select day, count(distinct user_id) as n from act where day >= v_start group by day
  ),
  joins_by_day as (
    select day, count(*) as n from membership_events
    where event_type = 'join' and day >= v_start group by day
  ),
  leaves_by_day as (
    select day, count(*) as n from membership_events
    where event_type = 'leave' and day >= v_start group by day
  ),
  posts_by_day as (
    select day, count(*) as n from community_posts where day >= v_start group by day
  ),
  comments_by_day as (
    select day, count(*) as n from community_comments where day >= v_start group by day
  ),
  reactions_by_day as (
    select day, count(*) as n from community_reactions where day >= v_start group by day
  ),
  daily as (
    select
      d.day,
      coalesce(a.n, 0) as active,
      coalesce(j.n, 0) as joins,
      coalesce(l.n, 0) as leaves,
      coalesce(p.n, 0) as posts,
      coalesce(c.n, 0) as comments,
      coalesce(r.n, 0) as reactions
    from days d
    left join active_by_day a on a.day = d.day
    left join joins_by_day j on j.day = d.day
    left join leaves_by_day l on l.day = d.day
    left join posts_by_day p on p.day = d.day
    left join comments_by_day c on c.day = d.day
    left join reactions_by_day r on r.day = d.day
  ),
  -- Per-member counts for the current period, grouped once each.
  active_by_user as (
    select user_id, count(distinct day) as n from act where day >= v_start group by user_id
  ),
  posts_by_user as (
    select author_id as user_id, count(*) as n from community_posts where day >= v_start group by author_id
  ),
  comments_by_user as (
    select author_id as user_id, count(*) as n from community_comments where day >= v_start group by author_id
  ),
  reactions_by_user as (
    select user_id, count(*) as n from community_reactions where day >= v_start group by user_id
  ),
  current_members as (
    select m.user_id
    from public.community_memberships m
    where m.community_id = p_community_id
      and m.status = 'active'
  ),
  member_scores as (
    select
      cm.user_id,
      coalesce(a.n, 0) as active_days,
      coalesce(p.n, 0) as posts,
      coalesce(c.n, 0) as comments,
      coalesce(r.n, 0) as reactions
    from current_members cm
    left join active_by_user a on a.user_id = cm.user_id
    left join posts_by_user p on p.user_id = cm.user_id
    left join comments_by_user c on c.user_id = cm.user_id
    left join reactions_by_user r on r.user_id = cm.user_id
  ),
  posts_by_space as (
    select space_id, count(*) as n from community_posts where day >= v_start group by space_id
  ),
  comments_by_space as (
    select space_id, count(*) as n from community_comments
    where day >= v_start and space_id is not null group by space_id
  ),
  space_scores as (
    select
      s.id,
      s.name,
      s.slug,
      coalesce(p.n, 0) as posts,
      coalesce(c.n, 0) as comments
    from public.spaces s
    left join posts_by_space p on p.space_id = s.id
    left join comments_by_space c on c.space_id = s.id
    where s.community_id = p_community_id
  )
  select jsonb_build_object(
    'range_days', v_days,
    'presence', jsonb_build_object(
      'active_today', (select count(distinct user_id) from act where day = v_today),
      'active_7d', (select count(distinct user_id) from act where day > v_today - 7),
      'active_30d', (
        select count(distinct a.user_id)
        from public.member_activity_days a
        where a.community_id = p_community_id and a.is_member and a.day > v_today - 30
      ),
      'member_count', (select count(*) from current_members)
    ),
    'totals', jsonb_build_object(
      'current', jsonb_build_object(
        'active_members', (select count(distinct user_id) from act where day >= v_start),
        'joins', (select count(*) from membership_events where event_type = 'join' and day >= v_start),
        'leaves', (select count(*) from membership_events where event_type = 'leave' and day >= v_start),
        'posts', (select count(*) from community_posts where day >= v_start),
        'comments', (select count(*) from community_comments where day >= v_start),
        'reactions', (select count(*) from community_reactions where day >= v_start)
      ),
      'previous', jsonb_build_object(
        'active_members', (select count(distinct user_id) from act where day < v_start),
        'joins', (select count(*) from membership_events where event_type = 'join' and day < v_start),
        'leaves', (select count(*) from membership_events where event_type = 'leave' and day < v_start),
        'posts', (select count(*) from community_posts where day < v_start),
        'comments', (select count(*) from community_comments where day < v_start),
        'reactions', (select count(*) from community_reactions where day < v_start)
      )
    ),
    'daily', coalesce(
      (select jsonb_agg(to_jsonb(d) order by d.day) from daily d),
      '[]'::jsonb
    ),
    'top_spaces', coalesce(
      (
        select jsonb_agg(to_jsonb(t) order by t.posts + t.comments desc, t.name)
        from (
          select * from space_scores
          where posts + comments > 0
          order by posts + comments desc, name
          limit 5
        ) t
      ),
      '[]'::jsonb
    ),
    'top_members', coalesce(
      (
        select jsonb_agg(to_jsonb(t) order by t.score desc, t.name)
        from (
          select
            ms.user_id,
            coalesce(nullif(pr.full_name, ''), pr.username) as name,
            pr.username,
            pr.avatar_url,
            ms.active_days,
            ms.posts,
            ms.comments,
            ms.reactions,
            -- Creating weighs more than reacting; showing up counts a little.
            ms.posts * 3 + ms.comments * 2 + ms.reactions + ms.active_days as score
          from member_scores ms
          join public.profiles pr on pr.id = ms.user_id
          where ms.posts + ms.comments + ms.reactions + ms.active_days > 0
          order by score desc, name
          limit 10
        ) t
      ),
      '[]'::jsonb
    )
  )
  into v_result;

  return v_result;
end;
$$;

revoke all on function public.community_analytics(uuid, integer) from public, anon;
grant execute on function public.community_analytics(uuid, integer) to authenticated;
