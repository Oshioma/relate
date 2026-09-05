-- =============================================================================
-- Relate — discovery categories that mean something
--
-- The first backfill (20260904233212) matched bare substrings, and several of
-- its patterns fire on ordinary English rather than on what a lesson is about:
--
--   'read'      matches already, ready, thread, spread, bread
--   'care'      matches careful, carefully — in most instructions
--   'share'     matches "share your answers", in most discussion prompts
--   'nature'    matches "the nature of"
--   'play'      matches "play a part", "playing with ideas"
--   'communit'  matches the word this whole app is built on
--   'observ'    matches any science lesson at all
--   'writ'      matches "write down your answer", on a maths worksheet
--
-- The result was Read, Help, Move and Explore on nearly every lesson, which is
-- the same as no categories at all: a filter that returns everything answers
-- nothing. There was also no cap, so a single lesson could collect all eight,
-- while the writer itself is constrained to three.
--
-- WHAT THIS DOES NOT DO
-- It does not touch a row whose categories somebody has since corrected. The
-- guard is exact: a row is only recomputed when its current value is precisely
-- what the old patterns produce for its own text. Any other value — a staff
-- override, or a lesson classified by the writer at the time it was written —
-- does not match, and is left exactly as it is.
--
-- Safe to re-run: after the first run, rows no longer match the old-pattern
-- guard, so a second run changes nothing.
-- =============================================================================

-- The two pattern sets, as functions, so the guard and the fix cannot drift
-- apart. Both are immutable text -> text[] and cost nothing to keep.

-- The old patterns, kept only so a row can be recognised as never having been
-- touched by a human. Nothing new is ever classified with these.
create or replace function public.lesson_discovery_legacy(p_text text)
returns text[] language sql immutable as $$
  select array_remove(array[
    case when p_text ~ '(build|make|craft|model|construct|design|invent|draw|paint|sculpt|sew)' then 'make' end,
    case when p_text ~ '(explore|discover|investigate|observ|experiment|find out|look for|nature|outdoor|trip|map|journey)' then 'explore' end,
    case when p_text ~ '(read|story|stories|book|poem|poetry|novel|literatur)' then 'read' end,
    case when p_text ~ '(writ|journal|diary|letter|essay|spelling|grammar)' then 'write' end,
    case when p_text ~ '(cook|bake|recipe|food|kitchen|meal|snack|ingredient)' then 'cook' end,
    case when p_text ~ '(grow|plant|seed|garden|crop|harvest|soil|compost)' then 'grow' end,
    case when p_text ~ '(move|exercise|sport|walk|run|dance|play|physical|fitness)' then 'move' end,
    case when p_text ~ '(help|kind|volunteer|communit|share|care|charit|neighbour|neighbor)' then 'help' end
  ], null)
$$;

-- Whole words only (\y), and only words that say what a lesson IS rather than
-- words that happen to appear in one. A category has to be earned by the
-- activity, not by a verb in the instructions.
create or replace function public.lesson_discovery_signals(p_text text)
returns text[] language sql immutable as $$
  with hits as (
    select 'make' as key, (select count(*) from unnest(array[
      '\ybuild(ing|s)?\y','\ybuilt\y','\ymak(e|ing)\y','\ycraft(s|ing)?\y','\yconstruct(ing|ion)?\y',
      '\ymodel\y','\yinvent(ing|ion)?\y','\ysculpt(ing|ure)?\y','\ysew(ing)?\y','\ydesign(ing)?\y',
      '\ydraw(ing)?\y','\ypaint(ing)?\y','\yprototype\y','\ywoodwork\y'
    ]) p where p_text ~ p) as n
    union all select 'explore', (select count(*) from unnest(array[
      '\yexplor(e|ing|ation)\y','\yinvestigat(e|ing|ion)\y','\yexpedition\y','\yfieldwork\y',
      '\yfield trip\y','\yscavenger hunt\y','\yrockpool(s)?\y','\yforag(e|ing)\y','\ysafari\y',
      '\ybird ?watch(ing)?\y','\yhunt for\y','\ygo outside\y','\yout in the\y'
    ]) p where p_text ~ p)
    union all select 'read', (select count(*) from unnest(array[
      '\yread(ing|er|ers)?\y','\ystory\y','\ystories\y','\ybook(s)?\y','\ypoem(s)?\y','\ypoetry\y',
      '\ynovel(s)?\y','\yliterature\y','\ychapter(s)?\y','\yfable(s)?\y','\ymyth(s)?\y'
    ]) p where p_text ~ p)
    union all select 'write', (select count(*) from unnest(array[
      '\ywrit(e|ing|er|ten)\y','\yjournal(ing)?\y','\ydiary\y','\yletter\y','\yessay(s)?\y',
      '\yrecount\y','\yspelling\y','\ygrammar\y','\ypunctuation\y','\yhandwriting\y','\ystorytelling\y'
    ]) p where p_text ~ p)
    union all select 'cook', (select count(*) from unnest(array[
      '\ycook(ing|ed)?\y','\ybak(e|ing|ed)\y','\yrecipe(s)?\y','\ykitchen\y','\ymeal(s)?\y',
      '\ysnack(s)?\y','\yingredient(s)?\y','\yedible\y','\ydough\y','\yoven\y'
    ]) p where p_text ~ p)
    union all select 'grow', (select count(*) from unnest(array[
      '\ygrow(ing|n)?\y','\yplant(s|ing|ed)?\y','\yseed(s|ling|lings)?\y','\ygarden(ing)?\y',
      '\yharvest(ing)?\y','\ycompost\y','\ysoil\y','\ysow(ing|n)?\y','\yallotment\y','\ycrop(s)?\y'
    ]) p where p_text ~ p)
    union all select 'move', (select count(*) from unnest(array[
      '\yexercis(e|ing)\y','\ysport(s)?\y','\yathletic(s)?\y','\yrunning\y','\yjumping\y',
      '\ydanc(e|ing)\y','\yyoga\y','\yfitness\y','\yphysical activity\y','\yhik(e|ing)\y',
      '\ystretch(es|ing)?\y','\yobstacle course\y'
    ]) p where p_text ~ p)
    union all select 'help', (select count(*) from unnest(array[
      '\yvolunteer(ing|s)?\y','\ycharity\y','\ycharities\y','\ykindness\y','\ydonat(e|ing|ion)\y',
      '\ylitter pick\y','\yfundrais(e|ing|er)\y','\ybefriend(ing)?\y','\yhelping others\y',
      '\ylooking after\y','\ycommunity project\y'
    ]) p where p_text ~ p)
  )
  -- At most three, strongest first, so a lesson gets the categories it is
  -- really about rather than every category it brushes against. The writer is
  -- held to the same limit.
  select coalesce(array_agg(key order by n desc, key), '{}'::text[])
  from (select key, n from hits where n > 0 order by n desc, key limit 3) ranked
$$;

-- Recompute, but only where the stored value is exactly what the old patterns
-- give for this lesson's own text — i.e. nobody has touched it since.
with signals as (
  select
    l.id,
    l.discovery_categories as current,
    lower(
      coalesce(l.title, '') || ' ' ||
      coalesce(l.subject, '') || ' ' ||
      coalesce(l.lesson->>'summary', '') || ' ' ||
      coalesce(l.lesson->'activity'->>'title', '') || ' ' ||
      coalesce(l.lesson->'activity'->>'instructions', '')
    ) as text
  from public.space_lessons l
)
update public.space_lessons l
set discovery_categories = public.lesson_discovery_signals(s.text)
from signals s
where l.id = s.id
  -- Untouched since the old backfill ran: same members, same count, any order.
  and s.current <@ public.lesson_discovery_legacy(s.text)
  and public.lesson_discovery_legacy(s.text) <@ s.current
  and public.lesson_discovery_signals(s.text) is distinct from s.current;

-- Both functions have done their one job. Classification lives in the app from
-- here on — the writer chooses, and staff correct — so leaving these behind
-- would only invite something to be classified twice, two different ways.
drop function if exists public.lesson_discovery_legacy(text);
drop function if exists public.lesson_discovery_signals(text);
