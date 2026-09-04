-- =============================================================================
-- Relate — how a lesson is found, and how long it takes
--
-- A lesson already carries a school subject. That answers "where does this
-- belong on a timetable" and not "what could we do this afternoon", which is
-- the question a family actually asks. Discovery categories are the second
-- answer: a verb rather than a department. A lesson on solar ovens is Science
-- by subject and Make plus Cook by what you would be doing.
--
-- Both are kept. Subject stays the formal taxonomy; this sits beside it.
--
-- The eight are a closed set, enforced here as well as in the app: a model
-- inventing a ninth category would quietly fragment the one axis the library is
-- browsed by. Stored as text[] rather than a join table because it is a fixed,
-- tiny vocabulary read on every card and never queried on its own.
--
-- duration_minutes is a plain integer of real minutes, not a label, so
-- "we have half an hour" is a range query rather than string matching. The UI
-- renders the buckets (15 min, 1 hour, 2+ hours) from the number.
--
-- BACKFILL: deterministic, from text the lessons already carry. No model calls
-- run here — a migration that phones an API is a migration that fails at 3am on
-- someone else's rate limit, and it would cost real money per deploy. Anything
-- these rules cannot place is left NULL and simply reads as unclassified until
-- someone edits it or the lesson is rewritten.
--
-- Safe to re-run.
-- =============================================================================

alter table public.space_lessons
  add column if not exists discovery_categories text[] not null default '{}',
  add column if not exists duration_minutes integer;

alter table public.space_lessons
  drop constraint if exists space_lessons_discovery_categories_allowed;

alter table public.space_lessons
  add constraint space_lessons_discovery_categories_allowed
  check (
    discovery_categories <@ array[
      'make', 'explore', 'read', 'write', 'cook', 'grow', 'move', 'help'
    ]::text[]
  );

alter table public.space_lessons
  drop constraint if exists space_lessons_duration_sane;

-- Five minutes to a full day. Anything outside that is a mistake, not a lesson.
alter table public.space_lessons
  add constraint space_lessons_duration_sane
  check (duration_minutes is null or duration_minutes between 5 and 480);

-- "What can we do in half an hour" and "show me everything to Make" are both
-- filters on a space's visible lessons.
create index if not exists idx_space_lessons_duration
  on public.space_lessons (space_id, duration_minutes);
create index if not exists idx_space_lessons_discovery
  on public.space_lessons using gin (discovery_categories);

-- --- Backfill ----------------------------------------------------------------
-- Matched against the title, summary and subject a lesson already has. Ordered
-- so a lesson can pick up several: these are not exclusive, and most lessons
-- genuinely are two of them.
with signals as (
  select
    l.id,
    lower(
      coalesce(l.title, '') || ' ' ||
      coalesce(l.subject, '') || ' ' ||
      coalesce(l.lesson->>'summary', '') || ' ' ||
      coalesce(l.lesson->'activity'->>'title', '') || ' ' ||
      coalesce(l.lesson->'activity'->>'instructions', '')
    ) as text
  from public.space_lessons l
  where cardinality(l.discovery_categories) = 0
)
update public.space_lessons l
set discovery_categories = c.cats
from (
  select
    s.id,
    array_remove(array[
      case when s.text ~ '(build|make|craft|model|construct|design|invent|draw|paint|sculpt|sew)' then 'make' end,
      case when s.text ~ '(explore|discover|investigate|observ|experiment|find out|look for|nature|outdoor|trip|map|journey)' then 'explore' end,
      case when s.text ~ '(read|story|stories|book|poem|poetry|novel|literatur)' then 'read' end,
      case when s.text ~ '(writ|journal|diary|letter|essay|spelling|grammar)' then 'write' end,
      case when s.text ~ '(cook|bake|recipe|food|kitchen|meal|snack|ingredient)' then 'cook' end,
      case when s.text ~ '(grow|plant|seed|garden|crop|harvest|soil|compost)' then 'grow' end,
      case when s.text ~ '(move|exercise|sport|walk|run|dance|play|physical|fitness)' then 'move' end,
      case when s.text ~ '(help|kind|volunteer|communit|share|care|charit|neighbour|neighbor)' then 'help' end
    ], null) as cats
  from signals s
) c
where l.id = c.id
  and cardinality(c.cats) > 0;

-- Duration from the shape of the lesson rather than its words: a teaching
-- section is roughly five minutes of reading and talking, the activity is the
-- long pole, and the questions are a few minutes at the end. Rounded to the
-- buckets the UI shows so the numbers do not read as false precision.
update public.space_lessons l
set duration_minutes = least(
  120,
  greatest(
    15,
    round(
      (
        coalesce(jsonb_array_length(l.lesson->'sections'), 0) * 5
        + case when l.lesson->'activity'->>'title' is not null then 20 else 0 end
        + coalesce(jsonb_array_length(l.lesson->'questions'), 0) * 2
      )::numeric / 15
    )::integer * 15
  )
)
where l.duration_minutes is null
  and jsonb_typeof(l.lesson->'sections') = 'array';
