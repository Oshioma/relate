-- Stage 1 of merging the directory and accommodation models: a shared identity.
--
-- Today a hotel with a restaurant is two unrelated rows that happen to share a
-- name, and nothing stops a third being added tomorrow. accommodation_listings
-- .business_id links at most one business to one stay, which a beach hotel with
-- a restaurant AND a dive shop already breaks.
--
-- `places` holds what both halves agree on — who and where something is. The
-- existing tables become facets of a place: what it offers as a business, what
-- it offers as somewhere to stay. A place can have many of each, which is the
-- point.
--
-- Nothing reads place_id yet; both tables keep every column they had, so this
-- migration changes no behaviour. It exists so the next stages (duplicate
-- detection, one review stream, one page per place) have something to hang on.

create table if not exists public.places (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities (id) on delete cascade,
  name text not null,
  -- The identity both facets share. A facet may still override for itself —
  -- a hotel's restaurant can have its own phone — but this is the default.
  description text,
  address text,
  location_label text,
  website text,
  phone text,
  lat double precision,
  lng double precision,
  cover_url text,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.businesses add column if not exists place_id uuid references public.places (id) on delete set null;
alter table public.accommodation_listings add column if not exists place_id uuid references public.places (id) on delete set null;

create index if not exists idx_places_community on public.places (community_id, name);
-- Duplicate detection searches by name within a community, case-insensitively.
create index if not exists idx_places_community_name_lower on public.places (community_id, lower(name));
create index if not exists idx_businesses_place on public.businesses (place_id);
create index if not exists idx_accommodation_listings_place on public.accommodation_listings (place_id);

drop trigger if exists set_updated_at on public.places;
create trigger set_updated_at before update on public.places
  for each row execute function public.set_updated_at();

-- Backfill. Temporary columns carry the source row's id so the foreign keys can
-- be set afterwards; INSERT ... RETURNING can't hand back a column it didn't
-- insert. Both are dropped at the end.
alter table public.places add column if not exists legacy_business_id uuid;
alter table public.places add column if not exists legacy_stay_id uuid;

insert into public.places (
  community_id, name, description, address, location_label, website, phone, lat, lng, cover_url, created_by, created_at, legacy_business_id
)
select b.community_id, b.name, b.description, b.address, b.location_label, b.website, b.phone, b.lat, b.lng, b.image_url, b.created_by, b.created_at, b.id
from public.businesses b
where b.place_id is null;

update public.businesses b
set place_id = p.id
from public.places p
where p.legacy_business_id = b.id and b.place_id is null;

-- A stay already bridged to a business is the same place as that business —
-- that's exactly what the bridge meant. It shares its place rather than
-- getting a second one.
update public.accommodation_listings a
set place_id = b.place_id
from public.businesses b
where a.business_id = b.id and b.place_id is not null and a.place_id is null;

insert into public.places (
  community_id, name, description, address, location_label, website, phone, lat, lng, cover_url, created_by, created_at, legacy_stay_id
)
select a.community_id, a.name, a.description, a.address, a.location_label, a.website, a.phone, a.lat, a.lng,
       case when array_length(a.photo_urls, 1) > 0 then a.photo_urls[1] else null end,
       a.listed_by, a.created_at, a.id
from public.accommodation_listings a
where a.place_id is null;

update public.accommodation_listings a
set place_id = p.id
from public.places p
where p.legacy_stay_id = a.id and a.place_id is null;

alter table public.places drop column if exists legacy_business_id;
alter table public.places drop column if exists legacy_stay_id;

alter table public.places enable row level security;

-- A place is community-scoped, not space-scoped: it is the thing itself, and
-- its facets are what live in spaces. Visibility therefore follows community
-- membership, and the facet's own policies still govern what can be seen of it.
drop policy if exists "places_select" on public.places;
create policy "places_select" on public.places
  for select to authenticated
  using (public.is_community_member(community_id, auth.uid()));

drop policy if exists "places_insert_member" on public.places;
create policy "places_insert_member" on public.places
  for insert to authenticated
  with check (created_by = auth.uid() and public.is_community_member(community_id, auth.uid()));

drop policy if exists "places_update_author_or_staff" on public.places;
create policy "places_update_author_or_staff" on public.places
  for update to authenticated
  using (created_by = auth.uid() or public.is_community_staff(community_id, auth.uid()));

drop policy if exists "places_delete_author_or_staff" on public.places;
create policy "places_delete_author_or_staff" on public.places
  for delete to authenticated
  using (created_by = auth.uid() or public.is_community_staff(community_id, auth.uid()));
