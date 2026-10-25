-- One currency per community. Every price a community sets (membership tiers,
-- course one-off prices, a space's own monthly price) is charged in it; Admin
-- -> Payments -> Currency changes it and moves every existing price over (the
-- amounts aren't converted). Stored as Stripe's lowercase ISO code.

alter table public.communities
  add column if not exists currency text not null default 'usd';

alter table public.communities drop constraint if exists communities_currency_iso;
alter table public.communities
  add constraint communities_currency_iso check (currency ~ '^[a-z]{3}$');

-- Prices were typed into free-text boxes, so tidy their codes ("GBP" -> "gbp").
update public.community_tiers set currency = lower(trim(currency)) where currency <> lower(trim(currency));
update public.courses set currency = lower(trim(currency)) where currency <> lower(trim(currency));
update public.spaces set currency = lower(trim(currency)) where currency <> lower(trim(currency));

-- Escape Space's Stripe account is in pounds: its courses were already GBP,
-- its two tiers (no subscribers yet) were still on the USD default.
update public.communities set currency = 'gbp' where slug = 'escapespace';
update public.community_tiers set currency = 'gbp'
  where community_id = (select id from public.communities where slug = 'escapespace');
update public.courses set currency = 'gbp'
  where community_id = (select id from public.communities where slug = 'escapespace');
update public.spaces set currency = 'gbp'
  where community_id = (select id from public.communities where slug = 'escapespace');

-- New tiers, courses and spaces start in their community's currency rather
-- than the column's 'usd' default, so a price set later never shows the wrong
-- code. (Price writes in the app also set it from the community.)
create or replace function public.price_currency_from_community()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  select c.currency into new.currency from public.communities c where c.id = new.community_id;
  if new.currency is null then new.currency := 'usd'; end if;
  return new;
end;
$$;

drop trigger if exists community_tiers_currency on public.community_tiers;
create trigger community_tiers_currency before insert on public.community_tiers
  for each row execute function public.price_currency_from_community();
drop trigger if exists courses_currency on public.courses;
create trigger courses_currency before insert on public.courses
  for each row execute function public.price_currency_from_community();
drop trigger if exists spaces_currency on public.spaces;
create trigger spaces_currency before insert on public.spaces
  for each row execute function public.price_currency_from_community();
