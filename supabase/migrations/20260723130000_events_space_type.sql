-- =============================================================================
-- Relate — Events as a space type
--
-- Adds 'events' to the space_type enum so community admins can manage the
-- Events nav item (reorder, show/hide) from the same Spaces panel as every
-- other space, instead of only through a platform super admin's on/off
-- toggle (see 20260723100035_platform_admin.sql). The events table itself is
-- unchanged — it stays community-scoped, not space-scoped, same as before.
-- A space with this type is a nav pointer to /c/[slug]/events, not a content
-- container (see src/app/c/[communitySlug]/spaces/[spaceSlug]/page.tsx,
-- which redirects 'events'-type spaces there instead of rendering space
-- content).
--
-- Safe to re-run.
-- =============================================================================

alter type public.space_type add value if not exists 'events';
