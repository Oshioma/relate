-- =============================================================================
-- Relate — a primary discovery category, and categories that are central
--
-- TWO PROBLEMS, ONE CAUSE
--
-- 1. Everything was WRITE. Against real lesson text, 7 of 7 lessons came back
--    tagged write — including "Long Division Without Tears", whose ONLY
--    category was write. The reason is that the patterns ran over one
--    concatenation of every field, and a lesson's activity instructions nearly
--    always contain the words "write down". Answering three questions on a
--    worksheet is not a writing lesson.
--
-- 2. Nothing said which category a lesson was MAINLY about. An array of three
--    equals treats "a cooking lesson that involves some writing" and "a writing
--    lesson that mentions bread" as the same shape of thing.
--
-- WHAT CHANGES
--
-- A category must be CENTRAL to be assigned at all. Central means it shows up
-- in what the lesson says it is — its title, subject, summary or the name of
-- its activity. The activity's instructions are supporting evidence only: they
-- can strengthen a category that is already there, and can never create one on
-- their own. That is a general rule, not a patch aimed at "write", and it is
-- what stops every practical lesson being filed as literacy.
--
-- And the array becomes ORDERED. Element one is the primary category — what
-- are we mainly doing — and anything after it is secondary. No new column: the
-- array already existed, it was simply being sorted alphabetically on the way
-- out, which threw the ranking away. src/lib/school/lesson-types.ts now
-- preserves the order it is given and documents element one as primary.
--
-- WHAT IT DOES NOT DO
--
-- It does not touch a row anybody has corrected, and it makes no AI calls. The
-- guard is exact: a row is recomputed only when its current value is precisely
-- what the previous patterns produce for its own text. A staff correction, or
-- a lesson the writer classified when it was written, does not match and is
-- left alone.
--
-- Safe to re-run: after the first run the guard no longer matches.
-- =============================================================================

-- The previous patterns, re-created here only so a row can be recognised as
-- never having been touched by a human. Dropped again at the bottom.
create or replace function public.lesson_discovery_prev(p_text text)
returns text[] language sql immutable as $$
  with hits as (
    select 'make' as key, (select count(*) from unnest(array['\ybuild(ing|s)?\y','\ybuilt\y','\ymak(e|ing)\y','\ycraft(s|ing)?\y','\yconstruct(ing|ion)?\y','\ymodel\y','\yinvent(ing|ion)?\y','\ysculpt(ing|ure)?\y','\ysew(ing)?\y','\ydesign(ing)?\y','\ydraw(ing)?\y','\ypaint(ing)?\y','\yprototype\y','\ywoodwork\y']) p where p_text ~ p) as n
    union all select 'explore', (select count(*) from unnest(array['\yexplor(e|ing|ation)\y','\yinvestigat(e|ing|ion)\y','\yexpedition\y','\yfieldwork\y','\yfield trip\y','\yscavenger hunt\y','\yrockpool(s)?\y','\yforag(e|ing)\y','\ysafari\y','\ybird ?watch(ing)?\y','\yhunt for\y','\ygo outside\y','\yout in the\y']) p where p_text ~ p)
    union all select 'read', (select count(*) from unnest(array['\yread(ing|er|ers)?\y','\ystory\y','\ystories\y','\ybook(s)?\y','\ypoem(s)?\y','\ypoetry\y','\ynovel(s)?\y','\yliterature\y','\ychapter(s)?\y','\yfable(s)?\y','\ymyth(s)?\y']) p where p_text ~ p)
    union all select 'write', (select count(*) from unnest(array['\ywrit(e|ing|er|ten)\y','\yjournal(ing)?\y','\ydiary\y','\yletter\y','\yessay(s)?\y','\yrecount\y','\yspelling\y','\ygrammar\y','\ypunctuation\y','\yhandwriting\y','\ystorytelling\y']) p where p_text ~ p)
    union all select 'cook', (select count(*) from unnest(array['\ycook(ing|ed)?\y','\ybak(e|ing|ed)\y','\yrecipe(s)?\y','\ykitchen\y','\ymeal(s)?\y','\ysnack(s)?\y','\yingredient(s)?\y','\yedible\y','\ydough\y','\yoven\y']) p where p_text ~ p)
    union all select 'grow', (select count(*) from unnest(array['\ygrow(ing|n)?\y','\yplant(s|ing|ed)?\y','\yseed(s|ling|lings)?\y','\ygarden(ing)?\y','\yharvest(ing)?\y','\ycompost\y','\ysoil\y','\ysow(ing|n)?\y','\yallotment\y','\ycrop(s)?\y']) p where p_text ~ p)
    union all select 'move', (select count(*) from unnest(array['\yexercis(e|ing)\y','\ysport(s)?\y','\yathletic(s)?\y','\yrunning\y','\yjumping\y','\ydanc(e|ing)\y','\yyoga\y','\yfitness\y','\yphysical activity\y','\yhik(e|ing)\y','\ystretch(es|ing)?\y','\yobstacle course\y']) p where p_text ~ p)
    union all select 'help', (select count(*) from unnest(array['\yvolunteer(ing|s)?\y','\ycharity\y','\ycharities\y','\ykindness\y','\ydonat(e|ing|ion)\y','\ylitter pick\y','\yfundrais(e|ing|er)\y','\ybefriend(ing)?\y','\yhelping others\y','\ylooking after\y','\ycommunity project\y']) p where p_text ~ p)
  )
  select coalesce(array_agg(key order by n desc, key), '{}'::text[])
  from (select key, n from hits where n > 0 order by n desc, key limit 3) ranked
$$;

-- The patterns per category, in one place so both fields are matched the same
-- way. Returns how many distinct patterns hit the given text.
create or replace function public.lesson_discovery_hits(p_key text, p_text text)
returns integer language sql immutable as $$
  select (
    select count(*)::integer from unnest(
      case p_key
        when 'make' then array['\ybuild(ing|s)?\y','\ybuilt\y','\ymak(e|ing)\y','\ycraft(s|ing)?\y','\yconstruct(ing|ion)?\y','\ymodel\y','\yinvent(ing|ion)?\y','\ysculpt(ing|ure)?\y','\ysew(ing)?\y','\ydesign(ing)?\y','\ydraw(ing)?\y','\ypaint(ing)?\y','\yprototype\y','\ywoodwork\y']
        when 'explore' then array['\yexplor(e|ing|ation)\y','\yinvestigat(e|ing|ion)\y','\yexpedition\y','\yfieldwork\y','\yfield trip\y','\yscavenger hunt\y','\yrockpool(s)?\y','\yforag(e|ing)\y','\ysafari\y','\ybird ?watch(ing)?\y','\yobserv(e|ing|ation)\y','\yexperiment(s|ing)?\y','\ydiscover(y|ing)?\y']
        when 'read' then array['\yread(ing|er|ers)?\y','\ystory\y','\ystories\y','\ybook(s)?\y','\ypoem(s)?\y','\ypoetry\y','\ynovel(s)?\y','\yliterature\y','\ychapter(s)?\y','\yfable(s)?\y','\ymyth(s)?\y']
        -- Deliberately narrow. "write" alone is the single most misleading word
        -- in a lesson document, so it only counts where the lesson is ABOUT
        -- producing writing.
        when 'write' then array['\ywriting\y','\ywrite (a|your|an) (story|poem|recount|letter|diary|report|review|essay)\y','\yjournal(ing)?\y','\ydiary\y','\yessay(s)?\y','\yrecount\y','\yspelling\y','\ygrammar\y','\ypunctuation\y','\yhandwriting\y','\ystorytelling\y','\ycomposition\y','\ypoem(s)?\y']
        when 'cook' then array['\ycook(ing|ed)?\y','\ybak(e|ing|ed)\y','\yrecipe(s)?\y','\ykitchen\y','\ymeal(s)?\y','\ysnack(s)?\y','\yingredient(s)?\y','\yedible\y','\ydough\y','\yoven\y']
        when 'grow' then array['\ygrow(ing|n)?\y','\yplant(s|ing|ed)?\y','\yseed(s|ling|lings)?\y','\ygarden(ing)?\y','\yharvest(ing)?\y','\ycompost\y','\ysoil\y','\ysow(ing|n)?\y','\yallotment\y','\ycrop(s)?\y']
        when 'move' then array['\yexercis(e|ing)\y','\ysport(s)?\y','\yathletic(s)?\y','\yrunning\y','\yjumping\y','\ydanc(e|ing)\y','\yyoga\y','\yfitness\y','\yphysical activity\y','\yhik(e|ing)\y','\ystretch(es|ing)?\y','\yobstacle course\y']
        when 'help' then array['\yvolunteer(ing|s)?\y','\ycharity\y','\ycharities\y','\ykindness\y','\ydonat(e|ing|ion)\y','\ylitter pick\y','\yfundrais(e|ing|er)\y','\ybefriend(ing)?\y','\yhelping others\y','\ylooking after\y','\ycommunity project\y']
        else array[]::text[]
      end
    ) p where p_text ~ p
  )
$$;

-- Ranked, primary first, at most three.
--
-- p_headline is what the lesson says it IS: title, subject, summary, activity
-- title. p_body is the activity's instructions.
--
-- A category needs at least one headline hit to qualify at all — that is the
-- rule that stops "write down your answer" making a maths lesson literacy.
-- Body hits then break ties, so a cooking lesson whose instructions are full
-- of baking outranks one that mentions an oven once.
create or replace function public.lesson_discovery_ranked(p_headline text, p_body text)
returns text[] language sql immutable as $$
  with scored as (
    select
      key,
      public.lesson_discovery_hits(key, p_headline) as head,
      public.lesson_discovery_hits(key, p_body) as body
    from unnest(array['make','explore','read','write','cook','grow','move','help']) as key
  )
  select coalesce(array_agg(key order by head desc, body desc, key), '{}'::text[])
  from (
    select key, head, body from scored
    where head > 0
    order by head desc, body desc, key
    limit 3
  ) ranked
$$;

-- Recompute, but only where the stored value is exactly what the previous
-- patterns give for this lesson's own text — i.e. nobody has touched it.
with parts as (
  select
    l.id,
    l.discovery_categories as current,
    lower(
      coalesce(l.title, '') || ' ' ||
      coalesce(l.subject, '') || ' ' ||
      coalesce(l.lesson->>'summary', '') || ' ' ||
      coalesce(l.lesson->'activity'->>'title', '')
    ) as headline,
    lower(coalesce(l.lesson->'activity'->>'instructions', '')) as body
  from public.space_lessons l
)
update public.space_lessons l
set discovery_categories = public.lesson_discovery_ranked(p.headline, p.body)
from parts p
where l.id = p.id
  -- Untouched since the previous backfill: same members, same count, any order.
  and p.current <@ public.lesson_discovery_prev(p.headline || ' ' || p.body)
  and public.lesson_discovery_prev(p.headline || ' ' || p.body) <@ p.current
  and public.lesson_discovery_ranked(p.headline, p.body) is distinct from p.current;

-- Classification lives in the app from here on — the writer chooses, staff
-- correct. Leaving these behind would only invite something to be classified
-- twice, two different ways.
drop function if exists public.lesson_discovery_prev(text);
drop function if exists public.lesson_discovery_ranked(text, text);
drop function if exists public.lesson_discovery_hits(text, text);
