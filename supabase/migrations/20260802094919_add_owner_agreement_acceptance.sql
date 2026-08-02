-- Community Owner Agreement acceptance record.
--
-- Creating a community now requires the owner to tick a mandatory checkbox
-- accepting the Community Owner Agreement (separate from the general Terms).
-- We record two things on the community itself so there's a clear, durable
-- record of exactly what was accepted and when:
--
--   owner_agreement_accepted_at  — the moment the owner ticked the box, set by
--     the create-community server action at insert time. Null for communities
--     created before this requirement existed.
--   owner_agreement_version      — which version of the Agreement was accepted,
--     stored as the Agreement's "last updated" date (e.g. '2026-08-02'). If the
--     Agreement is revised later, new communities record the new version while
--     old rows keep the version their owner actually agreed to.
--
-- No new RLS: these columns ride along with the community row, which already
-- restricts writes to the owner/admins and is readable by the community's
-- audience — the same as guidelines, accent_color, etc.
alter table public.communities
  add column if not exists owner_agreement_accepted_at timestamptz;

alter table public.communities
  add column if not exists owner_agreement_version text;
