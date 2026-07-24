-- Per-community visibility for the Members list/page, independent of the
-- community's own public/private/invite_only setting. Reuses
-- public.space_visibility since the same three tiers apply: 'public' (any
-- signed-in visitor, including guests who haven't joined), 'members' (active
-- members only), 'private' (staff only). The page always requires a
-- signed-in user regardless of this setting. A future paid-tier value can
-- extend this enum once the platform has a payments/subscription concept —
-- not needed yet.
--
-- Defaults to 'members' so, out of the box, only people who've actually
-- joined the community can see who else is in it.

alter table public.communities
  add column if not exists members_visibility public.space_visibility not null default 'members';
