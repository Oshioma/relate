-- Activity community kind marker.
--
-- The Activity template (communities.template_key = 'activity') is set up
-- around one activity — hiking, running, cycling, climbing, padel — chosen in
-- the wizard the same way a Place community chooses what kind of place it is.
-- The seeded spaces already differ per kind; this stores the choice on the
-- community row so later features (the meetup composer's activity preset,
-- analytics, feature gating) don't have to infer it from the spaces.
--
-- Plain text, validated against ACTIVITY_KINDS at the application layer,
-- exactly like location_type and artist_mode — so adding a kind stays a
-- code-only change. Null for every other template.

alter table public.communities
  add column if not exists activity_kind text;
