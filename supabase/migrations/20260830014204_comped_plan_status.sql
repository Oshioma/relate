-- =============================================================================
-- Relate — Complimentary plans ('comped' plan status)
--
-- Lets the platform super admin put a community on a paid plan without a
-- Stripe subscription — their own communities, partners, promos. A comped
-- community has:
--
--   plan_id                      the granted plan
--   plan_status                  'comped'
--   plan_current_period_end      null (a comp never lapses into grace)
--   plan_stripe_subscription_id  null (nothing in Stripe backs it)
--
-- Written only by the super-admin server action through the service-role
-- client (src/app/platform-admin/actions.ts) — the existing
-- protect_community_plan_columns trigger already blocks anon/authenticated
-- writes, so no policy change is needed here. The Stripe webhook ignores
-- subscription events for comped rows (they carry no subscription), and a
-- comped community that later checks out a real subscription simply gets
-- overwritten with genuine Stripe state.
--
-- Safe to re-run.
-- =============================================================================

-- Same resolver as before (see 20260821142228_plan_grace_and_limit_enforcement)
-- with 'comped' added to the statuses that put the paid plan in force. Comps
-- store no period end, so the "paid-for period hasn't ended" and grace clauses
-- pass and never expire them.
create or replace function public.community_effective_plan_id(p_community_id uuid)
returns uuid
language sql
security definer
stable
set search_path = public
as $$
  select coalesce(
    (
      select c.plan_id
      from public.communities c
      where c.id = p_community_id
        and c.plan_id is not null
        and (
          (
            c.plan_status in ('active', 'trialing', 'comped')
            and (c.plan_current_period_end is null or c.plan_current_period_end > now())
          )
          or (
            c.plan_current_period_end is not null
            and c.plan_current_period_end + make_interval(days => public.plan_grace_days()) > now()
          )
        )
    ),
    (select p.id from public.platform_plans p where p.slug = 'free')
  );
$$;
