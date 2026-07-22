-- =============================================================================
-- Relate — Custom domains for communities
--
-- Lets a community owner serve their community on a domain they own (e.g.
-- mzunguzanzibar.com instead of relate.example/c/mzungu-zanzibar). Three
-- additive columns on `communities`:
--
--   custom_domain             the bare hostname, stored lowercase
--   custom_domain_token       TXT-record value proving the owner controls DNS
--   custom_domain_verified_at set once the TXT record has been observed;
--                             routing only activates for verified domains
--
-- Writes to these columns are blocked for anon/authenticated API requests by
-- the trigger below — they only change through the app's server actions
-- (src/app/c/[communitySlug]/admin/actions.ts), which verify the caller is
-- the community owner and then write with the service-role client. RLS
-- policies can't protect individual columns, and without this an admin of
-- one community could mark their own domain verified without ever proving
-- DNS control.
--
-- The token is readable by anyone who can select the community row. That's
-- deliberate scope-keeping, not an oversight: knowing the token is useless
-- unless you can also publish it in the domain's DNS, which only the real
-- domain owner can do.
--
-- Safe to re-run.
-- =============================================================================

alter table public.communities add column if not exists custom_domain text;
alter table public.communities add column if not exists custom_domain_token text;
alter table public.communities add column if not exists custom_domain_verified_at timestamptz;

-- One community per domain. Partial so the many null rows don't collide.
create unique index if not exists communities_custom_domain_key
  on public.communities (custom_domain)
  where custom_domain is not null;

-- Bare lowercase hostname with at least one dot: "mzunguzanzibar.com",
-- "community.example.co.tz" — never a scheme, port, path, or bare TLD.
alter table public.communities drop constraint if exists custom_domain_format;
alter table public.communities add constraint custom_domain_format check (
  custom_domain is null
  or custom_domain ~ '^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$'
);

-- -----------------------------------------------------------------------------
-- Block direct API writes to the domain columns. auth.role() is the JWT role
-- of the PostgREST request: 'anon'/'authenticated' get blocked, service-role
-- requests and direct SQL (migrations, dashboard — where auth.role() is null)
-- pass through.
-- -----------------------------------------------------------------------------
create or replace function public.protect_custom_domain_columns()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if coalesce(auth.role(), '') in ('anon', 'authenticated') then
    -- INSERT is guarded too: community creation is a plain authenticated
    -- insert, and pre-setting a "verified" domain there would skip the
    -- whole TXT check.
    if tg_op = 'INSERT' then
      if new.custom_domain is not null
        or new.custom_domain_token is not null
        or new.custom_domain_verified_at is not null
      then
        raise exception 'custom domain settings can only be changed via the community admin page';
      end if;
    elsif new.custom_domain is distinct from old.custom_domain
      or new.custom_domain_token is distinct from old.custom_domain_token
      or new.custom_domain_verified_at is distinct from old.custom_domain_verified_at
    then
      raise exception 'custom domain settings can only be changed via the community admin page';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists communities_protect_custom_domain on public.communities;
create trigger communities_protect_custom_domain
  before insert or update on public.communities
  for each row
  execute function public.protect_custom_domain_columns();

-- -----------------------------------------------------------------------------
-- Resolve a request's Host header to a community slug. Called by the Next.js
-- proxy (src/proxy.ts) on every request that arrives on a non-platform
-- domain, so it must work for signed-out visitors and for private
-- communities alike — hence security definer rather than relying on the
-- communities select policies. It only ever reveals the slug, which the
-- domain owner has already chosen to serve their whole community under.
-- Unverified domains resolve to null: DNS pointing at the platform is not
-- proof of ownership, the TXT check is.
-- -----------------------------------------------------------------------------
create or replace function public.community_slug_for_domain(p_domain text)
returns text
language sql
security definer
stable
set search_path = public
as $$
  select c.slug
  from public.communities c
  where c.custom_domain = lower(p_domain)
    and c.custom_domain_verified_at is not null;
$$;

grant execute on function public.community_slug_for_domain(text) to anon, authenticated;
