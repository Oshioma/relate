-- =============================================================================
-- Relate — Business Directory: human-readable listing slugs
--
-- Directory listings were reachable only by their UUID
-- (/spaces/<space>/businesses/<uuid>). This gives every listing a readable
-- slug derived from its name (/spaces/<space>/businesses/mama-fatuma-tailoring),
-- which is nicer to read, remember and — now that listings can be shared —
-- nicer to hand to someone.
--
-- The slug is unique within a space (that's the scope the route resolves in),
-- assigned automatically on insert by a trigger so every insert path (manual
-- add, Google import, link import, the stay→business bridge) gets one for free.
-- Existing UUID links keep working: the route resolves either form and
-- redirects UUIDs to the canonical slug. Slugs are stable — renaming a listing
-- does not change its slug, so links stay valid.
-- Safe to re-run.
-- =============================================================================

alter table public.businesses add column if not exists slug text;

-- Lowercase, hyphenated, ASCII-only. Collapses any run of non-alphanumerics to
-- a single hyphen and trims leading/trailing hyphens.
create or replace function public.slugify(txt text)
returns text
language sql
immutable
as $$
  select trim(both '-' from regexp_replace(lower(coalesce(txt, '')), '[^a-z0-9]+', '-', 'g'));
$$;

-- A slug for `p_name` that's unique within `p_space_id`. On a clash it appends
-- -2, -3, … . `p_id` is excluded from the clash check so re-running over an
-- existing row is a no-op rather than bumping its own suffix.
create or replace function public.business_unique_slug(p_space_id uuid, p_name text, p_id uuid)
returns text
language plpgsql
as $$
declare
  base text := public.slugify(p_name);
  candidate text;
  n int := 1;
begin
  -- Names that slugify to nothing (e.g. only symbols or non-Latin scripts)
  -- still need a stable, linkable handle.
  if base = '' then
    base := 'listing';
  end if;
  candidate := base;
  loop
    if not exists (
      select 1 from public.businesses b
      where b.space_id = p_space_id
        and b.slug = candidate
        and b.id is distinct from p_id
    ) then
      return candidate;
    end if;
    n := n + 1;
    candidate := base || '-' || n;
  end loop;
end;
$$;

-- Fill the slug on insert when the caller didn't supply one. id is already
-- populated by its default before BEFORE-insert triggers run, so the
-- uniqueness check can exclude this row.
create or replace function public.set_business_slug()
returns trigger
language plpgsql
as $$
begin
  if new.slug is null or new.slug = '' then
    new.slug := public.business_unique_slug(new.space_id, new.name, new.id);
  end if;
  return new;
end;
$$;

drop trigger if exists set_business_slug on public.businesses;
create trigger set_business_slug
  before insert on public.businesses
  for each row execute function public.set_business_slug();

-- Backfill existing rows. Oldest first so the longest-lived listing keeps the
-- clean, un-suffixed slug and newer duplicates take -2, -3, … .
do $$
declare
  r record;
begin
  for r in
    select id, space_id, name
    from public.businesses
    where slug is null or slug = ''
    order by created_at
  loop
    update public.businesses
    set slug = public.business_unique_slug(r.space_id, r.name, r.id)
    where id = r.id;
  end loop;
end $$;

-- Enforce the per-space uniqueness the resolver relies on. Partial index so any
-- (theoretical) rows still lacking a slug don't trip the constraint.
create unique index if not exists businesses_space_slug_key
  on public.businesses (space_id, slug)
  where slug is not null;
