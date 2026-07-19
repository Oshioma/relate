-- =============================================================================
-- Relate — seed data
--
-- Run this AFTER:
--   1. `supabase/schema.sql` has been applied, and
--   2. you have signed up in the app at least once (so `auth.users` /
--      `public.profiles` has a row for you — the seed makes you the owner
--      of all three starter communities).
--
-- Replace the email below with the address you signed up with, then run
-- this whole file in the Supabase SQL editor. Safe to re-run.
-- =============================================================================

do $$
declare
  admin_email text := 'you@example.com'; -- <-- replace with the email you signed up with
  admin_id uuid;

  v_kushukuru_id uuid;
  v_zanzibar_id uuid;
  v_farming_id uuid;
  v_space_id uuid;
begin
  select id into admin_id from auth.users where email = admin_email limit 1;

  if admin_id is null then
    raise exception 'No auth.users row for %. Sign up in the app first, then re-run this seed with the correct email.', admin_email;
  end if;

  -- ---------------------------------------------------------------------
  -- Communities
  -- ---------------------------------------------------------------------
  insert into public.communities (name, slug, description, owner_id, is_public)
  values ('Kushukuru Community', 'kushukuru', 'A home for the Kushukuru family — stories, updates, and support for one another.', admin_id, true)
  on conflict (slug) do update set description = excluded.description
  returning id into v_kushukuru_id;

  insert into public.communities (name, slug, description, owner_id, is_public)
  values ('Zanzibar Community', 'zanzibar', 'Connecting people building and living in Zanzibar.', admin_id, true)
  on conflict (slug) do update set description = excluded.description
  returning id into v_zanzibar_id;

  insert into public.communities (name, slug, description, owner_id, is_public)
  values ('Farming Community', 'farming', 'A space for growers to share knowledge, seasons, and harvests.', admin_id, true)
  on conflict (slug) do update set description = excluded.description
  returning id into v_farming_id;

  -- ---------------------------------------------------------------------
  -- Kushukuru spaces, posts, events
  -- ---------------------------------------------------------------------
  insert into public.spaces (community_id, name, slug, description, visibility, sort_order)
  values
    (v_kushukuru_id, 'Announcements', 'announcements', 'Official updates from the community owners.', 'public', 0),
    (v_kushukuru_id, 'General', 'general', 'General discussion for everyone in Kushukuru.', 'members', 1),
    (v_kushukuru_id, 'Resources', 'resources', 'Shared documents, links, and guides.', 'members', 2)
  on conflict (community_id, slug) do nothing;

  select id into v_space_id from public.spaces where community_id = v_kushukuru_id and slug = 'announcements';
  if not exists (select 1 from public.posts where space_id = v_space_id and title = 'Welcome to Kushukuru') then
    insert into public.posts (community_id, space_id, author_id, title, body, post_type, is_pinned)
    values (v_kushukuru_id, v_space_id, admin_id, 'Welcome to Kushukuru', 'This is the very first post in our new home. Glad you''re here.', 'announcement', true);
  end if;

  if not exists (select 1 from public.events where community_id = v_kushukuru_id and title = 'Community Welcome Call') then
    insert into public.events (community_id, title, description, start_time, end_time, location, created_by)
    values (v_kushukuru_id, 'Community Welcome Call', 'A casual video call to meet everyone.', now() + interval '7 days', now() + interval '7 days' + interval '1 hour', null, admin_id);
  end if;

  -- ---------------------------------------------------------------------
  -- Zanzibar spaces, posts
  -- ---------------------------------------------------------------------
  insert into public.spaces (community_id, name, slug, description, visibility, sort_order)
  values
    (v_zanzibar_id, 'Announcements', 'announcements', 'Official updates from the community owners.', 'public', 0),
    (v_zanzibar_id, 'General', 'general', 'General discussion for everyone in Zanzibar.', 'members', 1),
    (v_zanzibar_id, 'Events', 'events-space', 'Meetups and things happening on the island.', 'members', 2)
  on conflict (community_id, slug) do nothing;

  select id into v_space_id from public.spaces where community_id = v_zanzibar_id and slug = 'announcements';
  if not exists (select 1 from public.posts where space_id = v_space_id and title = 'Welcome to Zanzibar Community') then
    insert into public.posts (community_id, space_id, author_id, title, body, post_type, is_pinned)
    values (v_zanzibar_id, v_space_id, admin_id, 'Welcome to Zanzibar Community', 'Karibu! Introduce yourself below.', 'announcement', true);
  end if;

  -- ---------------------------------------------------------------------
  -- Farming spaces, posts, resources
  -- ---------------------------------------------------------------------
  insert into public.spaces (community_id, name, slug, description, visibility, sort_order)
  values
    (v_farming_id, 'Announcements', 'announcements', 'Official updates from the community owners.', 'public', 0),
    (v_farming_id, 'General', 'general', 'General discussion for growers.', 'members', 1),
    (v_farming_id, 'Resources', 'resources', 'Guides, tools, and reference material.', 'members', 2)
  on conflict (community_id, slug) do nothing;

  select id into v_space_id from public.spaces where community_id = v_farming_id and slug = 'announcements';
  if not exists (select 1 from public.posts where space_id = v_space_id and title = 'Welcome to the Farming Community') then
    insert into public.posts (community_id, space_id, author_id, title, body, post_type, is_pinned)
    values (v_farming_id, v_space_id, admin_id, 'Welcome to the Farming Community', 'Share what you''re growing and what''s working this season.', 'announcement', true);
  end if;

  select id into v_space_id from public.spaces where community_id = v_farming_id and slug = 'resources';
  if not exists (select 1 from public.resources where space_id = v_space_id and title = 'Companion Planting Guide') then
    insert into public.resources (community_id, space_id, title, description, url, resource_type, created_by)
    values (v_farming_id, v_space_id, 'Companion Planting Guide', 'A quick reference for what to plant together.', 'https://example.com/companion-planting', 'link', admin_id);
  end if;

end $$;
