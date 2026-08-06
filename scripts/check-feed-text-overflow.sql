-- =============================================================================
-- Diagnostic: which feed records carry a run of text long enough to push the
-- community feed wider than a phone screen.
--
-- Run this in the Supabase SQL editor. Read-only, safe to run any time.
--
-- Background
-- ----------
-- On mobile the feed's two columns stack into one grid track. A grid item
-- defaults to `min-width: auto`, so the track can't shrink below its
-- min-content width -- which, for a column of member-written cards, is the
-- longest run of text with no break opportunity in it: a URL, an email, a
-- name typed without spaces. One such run widened the track past the viewport,
-- so the cards ran off the right edge while the header and cover hero stayed
-- at viewport width.
--
-- The layout no longer bends to this (min-w-0 on the columns caps the track;
-- break-words folds the run), so nothing here is *breaking* any more. This is
-- for finding the records that were doing it, in case the text itself is
-- wrong -- a pasted URL where a name belongs, a mangled import.
--
-- The threshold
-- -------------
-- On a 428px viewport the feed card is 396px wide. Take off the card's padding
-- and border (42px) and the avatar plus its gap (44px) and the text has 310px.
-- At roughly 7px per character for the card's 14px type that is ~44 characters
-- before a single unbroken run stops fitting. `flagged` marks those; the query
-- lists anything from 30 up so near-misses are visible too.
--
-- What counts as unbreakable
-- --------------------------
-- Split on whitespace and on hyphens, which browsers treat as break
-- opportunities. This is an approximation: character widths vary, and browsers
-- will also break some long URLs at other punctuation. Treat `longest_run` as
-- a ranking, not a measurement.
-- =============================================================================

with settings as (
  -- Narrow to one community by slug, or leave null to scan every community.
  select null::text as community_slug
),

-- Every field the feed renders as a card title or body, in one shape.
-- Mirrors the FeedItem mapping in src/app/c/[communitySlug]/page.tsx.
feed_text as (
  select 'post'           as source, p.id, p.community_id, p.created_at, 'title' as field, p.title       as value from public.posts p
  union all
  select 'post',                     p.id, p.community_id, p.created_at, 'body',           p.body              from public.posts p
  union all
  select 'business',                 b.id, b.community_id, b.created_at, 'name',           b.name              from public.businesses b
  union all
  select 'business',                 b.id, b.community_id, b.created_at, 'description',    b.description       from public.businesses b
  union all
  select 'event',                    e.id, e.community_id, e.created_at, 'title',          e.title             from public.events e
  union all
  select 'event',                    e.id, e.community_id, e.created_at, 'description',    e.description       from public.events e
  union all
  select 'marketplace',              m.id, m.community_id, m.created_at, 'title',          m.title             from public.marketplace_listings m
  union all
  select 'marketplace',              m.id, m.community_id, m.created_at, 'description',    m.description       from public.marketplace_listings m
  union all
  select 'job',                      j.id, j.community_id, j.created_at, 'title',          j.title             from public.job_listings j
  union all
  select 'job',                      j.id, j.community_id, j.created_at, 'description',    j.description       from public.job_listings j
  union all
  select 'accommodation',            a.id, a.community_id, a.created_at, 'name',           a.name              from public.accommodation_listings a
  union all
  select 'accommodation',            a.id, a.community_id, a.created_at, 'description',    a.description       from public.accommodation_listings a
  union all
  select 'recommendation',           r.id, r.community_id, r.created_at, 'title',          r.title             from public.recommendations r
  union all
  select 'recommendation',           r.id, r.community_id, r.created_at, 'note',           r.note              from public.recommendations r
  union all
  select 'club',                     c.id, c.community_id, c.created_at, 'name',           c.name              from public.clubs c
  union all
  select 'club',                     c.id, c.community_id, c.created_at, 'description',    c.description       from public.clubs c
  union all
  select 'volunteer_project',        v.id, v.community_id, v.created_at, 'title',          v.title             from public.volunteer_projects v
  union all
  select 'volunteer_project',        v.id, v.community_id, v.created_at, 'description',    v.description       from public.volunteer_projects v
  -- The sidebar shares the same grid track, so its text can widen it too:
  -- the Growing Journey heading is a space name.
  union all
  select 'space',                    s.id, s.community_id, s.created_at, 'name',           s.name              from public.spaces s
  -- New-member cards, via the membership that puts the profile in the feed.
  union all
  select 'member',                   pr.id, cm.community_id, cm.created_at, 'full_name',   pr.full_name
    from public.community_memberships cm join public.profiles pr on pr.id = cm.user_id
  union all
  select 'member',                   pr.id, cm.community_id, cm.created_at, 'username',    pr.username
    from public.community_memberships cm join public.profiles pr on pr.id = cm.user_id
  union all
  select 'member',                   pr.id, cm.community_id, cm.created_at, 'bio',         pr.bio
    from public.community_memberships cm join public.profiles pr on pr.id = cm.user_id
  union all
  select 'member',                   pr.id, cm.community_id, cm.created_at, 'profession',  pr.profession
    from public.community_memberships cm join public.profiles pr on pr.id = cm.user_id
  union all
  select 'member',                   pr.id, cm.community_id, cm.created_at, 'company',     pr.company
    from public.community_memberships cm join public.profiles pr on pr.id = cm.user_id
),

runs as (
  select
    t.source,
    t.id,
    t.community_id,
    t.created_at,
    t.field,
    t.value,
    max(length(run)) as longest_run
  from feed_text t
  cross join lateral regexp_split_to_table(t.value, '[\s-]+') as run
  where t.value is not null
  group by t.source, t.id, t.community_id, t.created_at, t.field, t.value
)

select
  c.name as community,
  r.source,
  r.field,
  r.longest_run,
  (r.longest_run >= 44) as flagged,
  left(r.value, 160) as value,
  r.id,
  r.created_at
from runs r
join public.communities c on c.id = r.community_id
cross join settings st
where r.longest_run >= 30
  and (st.community_slug is null or c.slug = st.community_slug)
order by r.longest_run desc, c.name, r.source;

-- To see only the records that actually stopped fitting, raise the final
-- threshold from `r.longest_run >= 30` to `>= 44` -- the same bar `flagged`
-- uses.
