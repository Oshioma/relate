-- =============================================================================
-- Relate — Accommodation: human-readable stay slugs
--
-- The directory got this in 20260812162755; stays were still reachable only by
-- UUID (/spaces/accommodation/stays/88efa3d0-…), which is unreadable and no use
-- to anyone handed the link. Give every stay a slug derived from its name
-- (/spaces/accommodation/stays/antos-house) on exactly the terms the directory
-- uses, so the two halves of a place behave the same way.
--
-- The slug is unique within a space (the scope the route resolves in) and is
-- assigned on insert by a trigger, so every insert path — the manual form, link
-- import, the business→stay bridge — gets one for free. Existing UUID links keep
-- working: the route resolves either form and redirects a UUID to the canonical
-- slug. Slugs are stable: renaming a stay doesn't change its slug, so links
-- already shared stay valid.
-- Safe to re-run.
-- =============================================================================

alter table public.accommodation_listings add column if not exists slug text;

-- slugify() is shared with the directory (20260812162755). One tweak while we're
-- here: drop apostrophes rather than turning them into hyphens, so "Anto's
-- House" slugs to antos-house instead of anto-s-house. Both the straight quote
-- (doubled here to escape it) and the typographic one are dropped. Slugs already
-- assigned keep their value — they're stable by design — so only new rows and
-- the backfill below see the difference.
create or replace function public.slugify(txt text)
returns text
language sql
immutable
as $$
  select trim(both '-' from regexp_replace(
    regexp_replace(lower(coalesce(txt, '')), '[''’]', '', 'g'),
    '[^a-z0-9]+', '-', 'g'
  ));
$$;

-- A slug for `p_name` unique within `p_space_id`, appending -2, -3, … on a
-- clash. `p_id` is excluded from the check so re-running over an existing row
-- is a no-op rather than bumping its own suffix.
create or replace function public.accommodation_unique_slug(p_space_id uuid, p_name text, p_id uuid)
returns text
language plpgsql
as $$
declare
  base text := public.slugify(p_name);
  candidate text;
  n int := 1;
begin
  -- Names that slugify to nothing (only symbols, or a non-Latin script) still
  -- need a stable, linkable handle.
  if base = '' then
    base := 'stay';
  end if;
  candidate := base;
  loop
    if not exists (
      select 1 from public.accommodation_listings l
      where l.space_id = p_space_id
        and l.slug = candidate
        and l.id is distinct from p_id
    ) then
      return candidate;
    end if;
    n := n + 1;
    candidate := base || '-' || n;
  end loop;
end;
$$;

-- Fill the slug on insert when the caller didn't supply one. id is already
-- populated by its default before BEFORE-insert triggers run, so the uniqueness
-- check can exclude this row.
create or replace function public.set_accommodation_slug()
returns trigger
language plpgsql
as $$
begin
  if new.slug is null or new.slug = '' then
    new.slug := public.accommodation_unique_slug(new.space_id, new.name, new.id);
  end if;
  return new;
end;
$$;

drop trigger if exists set_accommodation_slug on public.accommodation_listings;
create trigger set_accommodation_slug
  before insert on public.accommodation_listings
  for each row execute function public.set_accommodation_slug();

-- Backfill. Oldest first so the longest-lived stay keeps the clean,
-- un-suffixed slug and newer duplicates take -2, -3, … .
do $$
declare
  r record;
begin
  for r in
    select id, space_id, name
    from public.accommodation_listings
    where slug is null or slug = ''
    order by created_at
  loop
    update public.accommodation_listings
    set slug = public.accommodation_unique_slug(r.space_id, r.name, r.id)
    where id = r.id;
  end loop;
end $$;

-- Enforce the per-space uniqueness the resolver relies on. Partial index so any
-- (theoretical) rows still lacking a slug don't trip the constraint.
create unique index if not exists accommodation_listings_space_slug_key
  on public.accommodation_listings (space_id, slug)
  where slug is not null;
