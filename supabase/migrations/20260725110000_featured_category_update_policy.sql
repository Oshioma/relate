-- Fix: staff can't actually reorder the directory's nav sub-links.
--
-- featured_business_categories has RLS enabled with SELECT/INSERT/DELETE
-- policies, but no UPDATE policy. reorderFeaturedCategories writes each row's
-- sort_order with an UPDATE, so with RLS on and no matching UPDATE policy those
-- writes silently match zero rows: Postgres returns no error, the action reports
-- success, and the re-fetched rows all still have the default sort_order (0),
-- tie-broken alphabetically. The result is that dragging the sub-links under a
-- business directory space never sticks.
--
-- Add the missing UPDATE policy, scoped to community staff — the same authority
-- as the existing insert/delete policies on this table. Reordering never changes
-- community_id, so both using and with check guard on staff membership.

drop policy if exists "featured_business_categories_update_staff" on public.featured_business_categories;
create policy "featured_business_categories_update_staff" on public.featured_business_categories
  for update to authenticated
  using (public.is_community_staff(community_id, auth.uid()))
  with check (public.is_community_staff(community_id, auth.uid()));
