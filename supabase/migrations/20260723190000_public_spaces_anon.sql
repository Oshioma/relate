-- =============================================================================
-- Relate — public (pre-login) read access
--
-- Lets signed-out visitors browse the parts of a community an admin has made
-- public: spaces whose visibility is 'public', the content inside them, the
-- community's events, and the concierge search — all read-only. Every write
-- policy stays `to authenticated` (see schema.sql and the per-feature
-- migrations), so anonymous visitors can read but never post, upload, review,
-- RSVP, or join.
--
-- The gate is the existing space visibility model: `can_view_space(space_id,
-- null)` is true only for spaces marked 'public' (the 'members'/'private'
-- branches resolve to false when the user id is null), so these anon policies
-- expose public-space content and nothing else. Community-scoped config
-- (events, nav, feature flags, map categories) is gated on
-- `is_community_public()`, matching how the app already treats guests.
--
-- Safe to re-run: every policy is dropped first.
-- =============================================================================

-- profiles -------------------------------------------------------------------
-- Public content (posts, guides, businesses, …) shows its author's name and
-- avatar, so guests need to read the referenced profiles. Mirrors the
-- authenticated `using (true)` — profiles hold no private contact data.
drop policy if exists "profiles_select_anon" on public.profiles;
create policy "profiles_select_anon" on public.profiles
  for select to anon
  using (true);

-- spaces ---------------------------------------------------------------------
-- Only public spaces are visible pre-login; members/private stay hidden.
drop policy if exists "spaces_select_anon" on public.spaces;
create policy "spaces_select_anon" on public.spaces
  for select to anon
  using (visibility = 'public');

-- community configuration the shell + feed read -----------------------------
drop policy if exists "community_features_select_anon" on public.community_features;
create policy "community_features_select_anon" on public.community_features
  for select to anon
  using (true);

drop policy if exists "feature_defaults_select_anon" on public.feature_defaults;
create policy "feature_defaults_select_anon" on public.feature_defaults
  for select to anon
  using (true);

drop policy if exists "community_feature_prefs_select_anon" on public.community_feature_prefs;
create policy "community_feature_prefs_select_anon" on public.community_feature_prefs
  for select to anon
  using (true);

drop policy if exists "community_nav_item_order_select_anon" on public.community_nav_item_order;
create policy "community_nav_item_order_select_anon" on public.community_nav_item_order
  for select to anon
  using (true);

drop policy if exists "community_nav_links_select_anon" on public.community_nav_links;
create policy "community_nav_links_select_anon" on public.community_nav_links
  for select to anon
  using (public.is_community_public(community_id));

-- events ---------------------------------------------------------------------
-- Public communities show their events (and event cover images) to guests.
-- event_rsvps is intentionally left login-only, so guests never see who is
-- attending.
drop policy if exists "events_select_anon" on public.events;
create policy "events_select_anon" on public.events
  for select to anon
  using (public.is_community_public(community_id));

-- space content (keyed directly on space_id) ---------------------------------
-- Each mirrors its authenticated `can_view_space(space_id, auth.uid())` policy
-- with a null user, which resolves true only for public spaces.
drop policy if exists "posts_select_anon" on public.posts;
create policy "posts_select_anon" on public.posts
  for select to anon
  using (public.can_view_space(space_id, null::uuid));

drop policy if exists "resources_select_anon" on public.resources;
create policy "resources_select_anon" on public.resources
  for select to anon
  using (public.can_view_space(space_id, null::uuid));

drop policy if exists "businesses_select_anon" on public.businesses;
create policy "businesses_select_anon" on public.businesses
  for select to anon
  using (public.can_view_space(space_id, null::uuid));

drop policy if exists "featured_business_categories_select_anon" on public.featured_business_categories;
create policy "featured_business_categories_select_anon" on public.featured_business_categories
  for select to anon
  using (public.can_view_space(space_id, null::uuid));

drop policy if exists "business_custom_categories_select_anon" on public.business_custom_categories;
create policy "business_custom_categories_select_anon" on public.business_custom_categories
  for select to anon
  using (public.can_view_space(space_id, null::uuid));

drop policy if exists "guides_select_anon" on public.guides;
create policy "guides_select_anon" on public.guides
  for select to anon
  using (public.can_view_space(space_id, null::uuid));

drop policy if exists "clubs_select_anon" on public.clubs;
create policy "clubs_select_anon" on public.clubs
  for select to anon
  using (public.can_view_space(space_id, null::uuid));

drop policy if exists "space_challenges_select_anon" on public.space_challenges;
create policy "space_challenges_select_anon" on public.space_challenges
  for select to anon
  using (public.can_view_space(space_id, null::uuid));

drop policy if exists "accommodation_listings_select_anon" on public.accommodation_listings;
create policy "accommodation_listings_select_anon" on public.accommodation_listings
  for select to anon
  using (public.can_view_space(space_id, null::uuid));

drop policy if exists "marketplace_listings_select_anon" on public.marketplace_listings;
create policy "marketplace_listings_select_anon" on public.marketplace_listings
  for select to anon
  using (public.can_view_space(space_id, null::uuid));

drop policy if exists "job_listings_select_anon" on public.job_listings;
create policy "job_listings_select_anon" on public.job_listings
  for select to anon
  using (public.can_view_space(space_id, null::uuid));

drop policy if exists "recommendations_select_anon" on public.recommendations;
create policy "recommendations_select_anon" on public.recommendations
  for select to anon
  using (public.can_view_space(space_id, null::uuid));

drop policy if exists "volunteer_projects_select_anon" on public.volunteer_projects;
create policy "volunteer_projects_select_anon" on public.volunteer_projects
  for select to anon
  using (public.can_view_space(space_id, null::uuid));

drop policy if exists "space_journal_fields_select_anon" on public.space_journal_fields;
create policy "space_journal_fields_select_anon" on public.space_journal_fields
  for select to anon
  using (public.can_view_space(space_id, null::uuid));

drop policy if exists "space_journal_entries_select_anon" on public.space_journal_entries;
create policy "space_journal_entries_select_anon" on public.space_journal_entries
  for select to anon
  using (public.can_view_space(space_id, null::uuid));

drop policy if exists "landmarks_select_anon" on public.landmarks;
create policy "landmarks_select_anon" on public.landmarks
  for select to anon
  using (public.can_view_space(space_id, null::uuid));

drop policy if exists "map_categories_select_anon" on public.map_categories;
create policy "map_categories_select_anon" on public.map_categories
  for select to anon
  using (public.is_community_public(community_id));

-- space content (reached through a parent row) -------------------------------
drop policy if exists "comments_select_anon" on public.comments;
create policy "comments_select_anon" on public.comments
  for select to anon
  using (
    exists (
      select 1 from public.posts p
      where p.id = post_id
        and public.can_view_space(p.space_id, null::uuid)
    )
  );

drop policy if exists "guide_contributors_select_anon" on public.guide_contributors;
create policy "guide_contributors_select_anon" on public.guide_contributors
  for select to anon
  using (
    exists (
      select 1 from public.guides g
      where g.id = guide_contributors.guide_id
        and public.can_view_space(g.space_id, null::uuid)
    )
  );

drop policy if exists "guide_revisions_select_anon" on public.guide_revisions;
create policy "guide_revisions_select_anon" on public.guide_revisions
  for select to anon
  using (
    exists (
      select 1 from public.guides g
      where g.id = guide_revisions.guide_id
        and public.can_view_space(g.space_id, null::uuid)
    )
  );

drop policy if exists "guide_ratings_select_anon" on public.guide_ratings;
create policy "guide_ratings_select_anon" on public.guide_ratings
  for select to anon
  using (
    exists (
      select 1 from public.guides g
      where g.id = guide_ratings.guide_id
        and public.can_view_space(g.space_id, null::uuid)
    )
  );

drop policy if exists "guide_comments_select_anon" on public.guide_comments;
create policy "guide_comments_select_anon" on public.guide_comments
  for select to anon
  using (
    exists (
      select 1 from public.guides g
      where g.id = guide_comments.guide_id
        and public.can_view_space(g.space_id, null::uuid)
    )
  );

drop policy if exists "club_members_select_anon" on public.club_members;
create policy "club_members_select_anon" on public.club_members
  for select to anon
  using (
    exists (
      select 1 from public.clubs c
      where c.id = club_members.club_id
        and public.can_view_space(c.space_id, null::uuid)
    )
  );

drop policy if exists "space_challenge_participants_select_anon" on public.space_challenge_participants;
create policy "space_challenge_participants_select_anon" on public.space_challenge_participants
  for select to anon
  using (
    exists (
      select 1 from public.space_challenges c
      where c.id = space_challenge_participants.challenge_id
        and public.can_view_space(c.space_id, null::uuid)
    )
  );

drop policy if exists "recommendation_votes_select_anon" on public.recommendation_votes;
create policy "recommendation_votes_select_anon" on public.recommendation_votes
  for select to anon
  using (
    exists (
      select 1 from public.recommendations r
      where r.id = recommendation_votes.recommendation_id
        and public.can_view_space(r.space_id, null::uuid)
    )
  );

drop policy if exists "volunteer_signups_select_anon" on public.volunteer_signups;
create policy "volunteer_signups_select_anon" on public.volunteer_signups
  for select to anon
  using (
    exists (
      select 1 from public.volunteer_projects p
      where p.id = volunteer_signups.project_id
        and public.can_view_space(p.space_id, null::uuid)
    )
  );
