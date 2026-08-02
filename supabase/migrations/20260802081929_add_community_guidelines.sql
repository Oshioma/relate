-- Per-community guidelines: a house-rules / code-of-conduct block the owner and
-- admins write in the community admin page, and every visitor can read at
-- /c/<slug>/guidelines. Stored as the same sanitised HTML/Markdown the rest of
-- the app uses (rendered through <RichText>, never dangerouslySetInnerHTML).
--
-- Null = no guidelines set yet; the read page and its footer link stay hidden
-- until an admin writes something.
--
-- No new RLS: `communities` already restricts updates to the owner and admins,
-- and is already world-readable for the communities a visitor can see — the
-- exact audience that should be able to read the guidelines.
alter table public.communities
  add column if not exists guidelines text;
