-- =============================================================================
-- Relate — a community's verified custom domain, looked up by slug
--
-- The reverse of community_slug_for_domain. The proxy uses it to send
-- signed-out visitors who arrive on a community's automatic subdomain
-- (<slug>.relate.click), or on a /c/<slug> link on the platform, to the
-- community's own verified domain instead, so links people pass on carry the
-- community's brand. Only a verified domain is ever returned.
--
-- Called anonymously and cookie-free, like community_slug_for_domain, hence
-- security definer. It reveals nothing a visitor couldn't already see: a
-- verified domain is where the community is publicly served. Idempotent.
-- =============================================================================

create or replace function public.community_domain_for_slug(p_slug text)
returns text
language sql
security definer
stable
set search_path = public
as $$
  select c.custom_domain
  from public.communities c
  where c.slug = lower(p_slug)
    and c.custom_domain is not null
    and c.custom_domain_verified_at is not null;
$$;

grant execute on function public.community_domain_for_slug(text) to anon, authenticated;
