-- Editable default spaces for the Place-Based Community template.
--
-- When someone creates a "place" community in the wizard, it seeds a starting
-- set of spaces. Those defaults used to be hard-coded in
-- src/lib/community-templates.ts; this table makes them editable by a super
-- admin at /admin. The wizard reads this list for the place template and
-- falls back to the code defaults only if the table is somehow empty.
--
-- space_type mirrors the SpaceType union in src/types/database.ts (validated
-- at the application layer, hence plain text here — same as public.spaces).

create table if not exists public.place_default_spaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  space_type text not null default 'discussion',
  show_in_nav boolean not null default true,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.place_default_spaces;
create trigger set_updated_at before update on public.place_default_spaces
  for each row execute function public.set_updated_at();

-- Seed with the spaces the Place-Based Community template shipped with, so the
-- list starts populated and behavior is unchanged. Only seeds when empty, so
-- re-running never clobbers a super admin's edits.
insert into public.place_default_spaces (name, description, space_type, show_in_nav, sort_order)
select seed.name, seed.description, seed.space_type, seed.show_in_nav, seed.sort_order
from (values
  ('Chat', 'General conversation for the whole community.', 'discussion', true, 0),
  ('Business Directory', 'Local businesses with profiles, hours and reviews.', 'business_directory', true, 1),
  ('Explore Map', 'An interactive map of everything in this place.', 'map', true, 2),
  ('Marketplace', 'Buy, sell, give away and find locally.', 'marketplace', true, 3),
  ('Community Guides', 'Best coffee, hidden gems, first week here — written by members.', 'guides', true, 4),
  ('Clubs & Groups', 'Subcommunities around shared interests, from running to book club.', 'clubs', true, 5),
  ('Volunteer Hub', 'Projects, cleanups and causes members can help with.', 'volunteer_hub', true, 6),
  ('Local Recommendations', 'Restaurants, services and professionals members vouch for.', 'recommendations', true, 7)
) as seed(name, description, space_type, show_in_nav, sort_order)
where not exists (select 1 from public.place_default_spaces);

alter table public.place_default_spaces enable row level security;

-- Readable by any authenticated user: the community-creation wizard reads it
-- to seed a new place community's spaces.
drop policy if exists "place_default_spaces_select" on public.place_default_spaces;
create policy "place_default_spaces_select" on public.place_default_spaces
  for select to authenticated
  using (true);

-- Only a platform super admin may edit the defaults (mirrors feature_defaults).
drop policy if exists "place_default_spaces_write" on public.place_default_spaces;
create policy "place_default_spaces_write" on public.place_default_spaces
  for all to authenticated
  using (public.is_super_admin(auth.uid()))
  with check (public.is_super_admin(auth.uid()));
