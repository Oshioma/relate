-- =============================================================================
-- Relate — public (pre-login) read access to the pricing catalogue
--
-- The public pricing page (/pricing, linked from the site footer) renders the
-- real plans and feature packs rather than a hardcoded copy of them, so a
-- signed-out visitor has to be able to read the active rows. Both tables' only
-- select policy was `to authenticated` (see 20260729233000_platform_plans.sql
-- and 20260730081500_feature_marketplace.sql), which left the page empty for
-- exactly the audience it's written for.
--
-- Read-only, active rows only: an inactive plan/pack a super admin is still
-- drafting stays hidden, and every write policy remains `to authenticated` and
-- super-admin gated. Nothing here is private — it's the price list.
--
-- Safe to re-run: every policy is dropped first.
-- =============================================================================

drop policy if exists "platform_plans_select_anon" on public.platform_plans;
create policy "platform_plans_select_anon" on public.platform_plans
  for select to anon
  using (is_active);

drop policy if exists "feature_packs_select_anon" on public.feature_packs;
create policy "feature_packs_select_anon" on public.feature_packs
  for select to anon
  using (is_active);
