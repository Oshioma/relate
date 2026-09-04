-- =============================================================================
-- Relate — School community kind marker.
--
-- The School template (communities.template_key = 'school') seeds a different
-- starter set depending on what kind of school it is: a primary school wants
-- classes and a reading challenge, a homeschool co-op wants a shared lesson
-- library and a swap shelf, a tutoring centre wants enrolment and progress.
-- The seeded spaces already differ; this stores which kind was chosen so later
-- features (UI wording, analytics, feature gating) can differentiate them
-- without inspecting the spaces.
--
-- Plain text, validated against SCHOOL_KINDS at the application layer, exactly
-- like location_type, artist_mode and activity_kind — so adding a kind stays a
-- code-only change. Null for every non-school template and for school
-- communities created before this.
-- =============================================================================

alter table public.communities
  add column if not exists school_kind text;
