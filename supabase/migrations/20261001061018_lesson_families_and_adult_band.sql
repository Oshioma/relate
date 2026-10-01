-- =============================================================================
-- Relate — lesson families (one page per source) and the Adult age band
--
-- Until now every age band of the same material was its own lesson: its own
-- card in the library, its own page, its own near-identical title. Writing a
-- chapter for three ages gave three cards that looked like duplicates, and an
-- older reader had to start again from scratch on a lesson that repeated
-- everything the younger one had already covered.
--
-- A FAMILY is every level written from one source. The levels show on a single
-- page, youngest first, and an older level is written to pick up where the
-- level below it left off rather than repeating it. The library shows one card
-- per family.
--
-- family_id is just a shared uuid, not a foreign key: no level owns the family,
-- so deleting the youngest one leaves the rest together rather than orphaning
-- or cascading them. A lesson on its own is a family of one, which the default
-- gives every new row for free.
--
-- The Adult band. "Go deeper (adults)" used to save as Ages 16-18, the oldest
-- band there was, so a lesson the button called adult was filed as a
-- sixth-former's. Adult is now a band of its own above 16-18, and it is the
-- band that goes beyond the source. Every existing go-deeper lesson moves to
-- it. age_band is free text validated in the app (see the space_lessons
-- migration), so the new value needs no constraint change.
--
-- Safe to re-run.
-- =============================================================================

alter table public.space_lessons
  add column if not exists family_id uuid not null default gen_random_uuid();

-- Existing lessons: each is a family of one unless something else was written
-- from the very same material in the same space, in which case they join the
-- family of the earliest. Only material long enough to be real (the app's own
-- minimum is 80 characters) is matched, so two empty sources are not a family.
with families as (
  select
    id,
    first_value(id) over (
      partition by space_id, md5(source_text)
      order by created_at, id
    ) as family
  from public.space_lessons
  where length(source_text) >= 80
)
update public.space_lessons l
set family_id = f.family
from families f
where l.id = f.id
  and l.family_id is distinct from f.family;

create index if not exists space_lessons_family_id_idx
  on public.space_lessons (family_id);

-- Go-deeper lessons were adult lessons filed under the oldest child band.
update public.space_lessons
set age_band = 'adult'
where beyond_source = true
  and age_band = '16-18';
