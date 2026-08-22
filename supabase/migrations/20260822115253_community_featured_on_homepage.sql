-- =============================================================================
-- Relate — super-admin-chosen communities on the marketing homepage
--
-- The showcase strip on relate.click ("A few communities already at home
-- here") picked itself: newest public communities first, preferring the ones
-- with a logo and a description. That is a reasonable guess and a poor shop
-- window — the platform's own front door should show the communities we'd
-- choose to show, not whoever signed up most recently.
--
-- `featured_at` is that choice: non-null means featured, and its value orders
-- the strip (most recently picked first), so re-picking a community moves it to
-- the front. With nothing picked, the page keeps the old heuristic, so the
-- strip is never empty.
--
-- Only a super admin sets this, through the service-role client in the platform
-- admin actions. A community's own owner must not be able to promote themselves
-- onto the homepage, and the RLS update policy on `communities` legitimately
-- lets them write their own row — so the column is guarded by a trigger the
-- same way custom_domain and the plan_* columns are.
--
-- Safe to re-run.
-- =============================================================================

alter table public.communities add column if not exists featured_at timestamptz;

comment on column public.communities.featured_at is
  'Non-null = featured on the marketing homepage, ordered most recent first. Service-role writes only (see protect_community_featured_column).';

-- The homepage reads featured public communities, newest pick first.
create index if not exists idx_communities_featured
  on public.communities (featured_at desc) where featured_at is not null;

-- Block direct API writes to featured_at. Mirrors protect_community_plan_columns
-- (20260729233000_platform_plans.sql): anon/authenticated are refused,
-- service-role and direct SQL pass through.
create or replace function public.protect_community_featured_column()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if coalesce(auth.role(), '') in ('anon', 'authenticated') then
    if tg_op = 'INSERT' then
      if new.featured_at is not null then
        raise exception 'only a platform super admin can feature a community';
      end if;
    elsif new.featured_at is distinct from old.featured_at then
      raise exception 'only a platform super admin can feature a community';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists communities_protect_featured on public.communities;
create trigger communities_protect_featured
  before insert or update on public.communities
  for each row
  execute function public.protect_community_featured_column();
