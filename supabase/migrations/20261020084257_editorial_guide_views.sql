-- =============================================================================
-- Relate — editorial guide view counter
--
-- Lets a community's staff see whether anyone is reading its editorial guides
-- ("Where to Stay in Zanzibar", the hotel guides). The guide page sends one
-- beacon from the browser after it loads, so crawlers that don't run
-- JavaScript and link prefetches aren't counted.
--
-- One row per guide, per reader, per day: `visitor_id` is a random id the
-- browser keeps in localStorage (no name, email, IP or user id is stored), so a
-- reader who reloads or comes back the same day counts once. "Views" below are
-- therefore daily readers, not raw page loads. Staff reading their own
-- community's guides are not counted, and nor are drafts.
--
-- The table has no policies: writes go through record_editorial_guide_view()
-- and reads through editorial_guide_view_stats(), which only staff may call.
-- =============================================================================

create table if not exists public.editorial_guide_views (
  guide_id uuid not null references public.editorial_guides(id) on delete cascade,
  community_id uuid not null references public.communities(id) on delete cascade,
  visitor_id text not null check (char_length(visitor_id) between 8 and 64),
  viewed_on date not null default (now() at time zone 'utc')::date,
  signed_in boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (guide_id, viewed_on, visitor_id)
);

create index if not exists editorial_guide_views_community_day
  on public.editorial_guide_views (community_id, viewed_on);

alter table public.editorial_guide_views enable row level security;

-- Record one view. Anyone may call it (guests read the guides too); it only
-- counts published guides, skips the community's own staff, and repeats on the
-- same day are absorbed by the primary key.
create or replace function public.record_editorial_guide_view(p_guide_id uuid, p_visitor_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_community uuid;
begin
  if p_visitor_id is null or char_length(p_visitor_id) not between 8 and 64 or p_visitor_id !~ '^[A-Za-z0-9_-]+$' then
    return;
  end if;

  select g.community_id into v_community
  from public.editorial_guides g
  where g.id = p_guide_id and g.status = 'published';
  if v_community is null then
    return;
  end if;

  if auth.uid() is not null and public.is_community_staff(v_community, auth.uid()) then
    return;
  end if;

  insert into public.editorial_guide_views (guide_id, community_id, visitor_id, signed_in)
  values (p_guide_id, v_community, p_visitor_id, auth.uid() is not null)
  on conflict do nothing;
end;
$$;

revoke all on function public.record_editorial_guide_view(uuid, text) from public;
grant execute on function public.record_editorial_guide_view(uuid, text) to anon, authenticated;

-- Readers per guide for one community: today, the last 7 and 30 days (both
-- including today) and all time, plus distinct readers over the last 30 days.
-- Staff only; anyone else gets no rows.
create or replace function public.editorial_guide_view_stats(p_community_id uuid)
returns table (
  guide_id uuid,
  today bigint,
  last_7_days bigint,
  last_30_days bigint,
  all_time bigint,
  readers_30_days bigint
)
language sql
security definer
stable
set search_path = public
as $$
  with d as (select (now() at time zone 'utc')::date as today)
  select
    g.id,
    count(v.*) filter (where v.viewed_on = d.today),
    count(v.*) filter (where v.viewed_on > d.today - 7),
    count(v.*) filter (where v.viewed_on > d.today - 30),
    count(v.*),
    count(distinct v.visitor_id) filter (where v.viewed_on > d.today - 30)
  from public.editorial_guides g
  cross join d
  left join public.editorial_guide_views v on v.guide_id = g.id
  where g.community_id = p_community_id
    and public.is_community_staff(p_community_id, auth.uid())
  group by g.id;
$$;

revoke all on function public.editorial_guide_view_stats(uuid) from public;
-- Supabase grants new functions to anon directly, not only via public.
revoke execute on function public.editorial_guide_view_stats(uuid) from anon;
grant execute on function public.editorial_guide_view_stats(uuid) to authenticated;
