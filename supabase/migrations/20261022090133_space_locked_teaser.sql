-- =============================================================================
-- Locked teasers: let a members-only space show itself, locked, to people who
-- haven't joined yet.
--
-- spaces.when_locked says what someone who can't open a space sees of it:
--
--   null      — today's behaviour, unchanged for every existing space: members
--               see paid spaces locked, visitors don't see members spaces.
--   'teaser'  — visitors (signed out, or signed in but not a member) also see
--               it in the list and sidebar, locked, with only its name, short
--               description and cover picture.
--
-- The spaces table's RLS is NOT widened. Visitors read teasers through
-- space_teasers(), which returns those few columns and nothing else: no posts,
-- no lessons, no files, no settings. A custom page's description is its page
-- body, so it is never returned. Hidden (invite-only) communities never
-- return teasers, and Admins-only spaces can't be teasers.
--
-- Safe to re-run.
-- =============================================================================

alter table public.spaces add column if not exists when_locked text;

alter table public.spaces drop constraint if exists spaces_when_locked_check;
alter table public.spaces add constraint spaces_when_locked_check
  check (when_locked is null or when_locked = 'teaser');

create or replace function public.space_teasers(p_community_id uuid)
returns table (
  id uuid,
  name text,
  slug text,
  description text,
  image_url text,
  space_type text,
  sort_order integer,
  show_in_nav boolean,
  show_as_card boolean,
  nav_group text,
  gated boolean
)
language sql
security definer
stable
set search_path = public
as $$
  select
    s.id,
    s.name,
    s.slug,
    case when s.space_type::text = 'custom' then null else s.description end,
    s.image_url,
    s.space_type::text,
    s.sort_order,
    s.show_in_nav,
    s.show_as_card,
    s.nav_group,
    (s.price_cents > 0 or exists (select 1 from public.tier_spaces ts where ts.space_id = s.id))
  from public.spaces s
  join public.communities c on c.id = s.community_id
  where s.community_id = p_community_id
    and s.when_locked = 'teaser'
    and s.visibility = 'members'
    and c.privacy <> 'invite_only'
  order by s.sort_order;
$$;

revoke all on function public.space_teasers(uuid) from public;
grant execute on function public.space_teasers(uuid) to anon, authenticated;
