-- =============================================================================
-- Import lessons from the standalone school app into a Lessons space,
-- using nothing but a browser.
--
-- scripts/import-school-lessons.mjs does the same job and reports per lesson,
-- but it needs a checkout and node. This needs neither: two Supabase SQL
-- editors and a copy-paste.
--
-- The two apps store the same document, pictures included, so nothing here
-- rewrites content. It only re-homes each lesson: the standalone app scoped a
-- lesson to one person, relate scopes it to a space in a community.
--
-- -----------------------------------------------------------------------------
-- STEP 1 - in the STANDALONE APP's SQL editor
--
--   select age_band, title, subject, source_text, lesson, created_at
--   from school_lessons
--   order by created_at;
--
-- Press "Download JSON". Open the file and copy everything, including the
-- outer [ and ].
--
-- -----------------------------------------------------------------------------
-- STEP 2 - in RELATE's SQL editor
--
-- Paste this whole file, then replace the PASTE THE JSON HERE line with what
-- you copied. Set the community slug on the line below if it isn't this one.
--
-- Copy only the SQL. A stray "|" on line one means a result grid came along
-- with it; the editor reads that as SQL and refuses the lot.
--
-- The JSON sits inside $json$ ... $json$, which is Postgres dollar quoting: it
-- takes the text exactly as written, so quotes, apostrophes and semicolons
-- inside your lessons need no escaping.
--
-- Safe to re-run. A lesson whose title and age band are already in the space is
-- skipped, so a half-finished import can simply be run again.
-- =============================================================================

with target as (
  -- The Lessons space to import into. Resolved by name so no ids are needed;
  -- a community with more than one takes the first in the sidebar.
  select s.id as space_id, s.community_id, c.owner_id
  from public.spaces s
  join public.communities c on c.id = s.community_id
  where c.slug = 'squidgeoverskool'      -- <= your community's slug
    and s.space_type = 'lessons'
  order by s.sort_order
  limit 1
),
incoming as (
  select value
  from jsonb_array_elements($json$

PASTE THE JSON HERE

  $json$::jsonb)
)
insert into public.space_lessons
  (space_id, community_id, created_by, age_band, title, subject, source_text, lesson, created_at)
select
  t.space_id,
  t.community_id,
  -- Imported lessons are attributed to the community's owner: the person who
  -- wrote them in the other app has a different account id here, if any.
  t.owner_id,
  coalesce(i.value->>'age_band', '8-10'),
  i.value->>'title',
  coalesce(i.value->>'subject', ''),
  -- Kept so an imported lesson can still be rewritten for another age band.
  coalesce(i.value->>'source_text', ''),
  i.value->'lesson',
  -- Keeps the library in the order the lessons were actually written, rather
  -- than stacking them all on import day.
  coalesce((i.value->>'created_at')::timestamptz, now())
from incoming i, target t
where i.value->>'title' is not null
  and not exists (
    select 1
    from public.space_lessons x
    where x.space_id = t.space_id
      and x.title = i.value->>'title'
      and x.age_band = coalesce(i.value->>'age_band', '8-10')
  );

-- What landed. An empty result means the community slug above matched nothing,
-- or that community has no Lessons space yet.
select title, age_band, subject, created_at
from public.space_lessons
order by created_at;
