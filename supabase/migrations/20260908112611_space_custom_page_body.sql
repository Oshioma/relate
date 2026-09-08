-- =============================================================================
-- Relate — a real body for Custom Page spaces.
--
-- A space with space_type = 'custom' is a standalone page: no post form, no
-- feed, its content rendered as sanitised HTML/Markdown. Until now that content
-- was stored in spaces.description — the same column the Spaces grid prints as
-- a two-line card blurb (toPlainText + line-clamp-2) and the masthead prints as
-- a subtitle. One column cannot be both a whole page and a one-line summary:
-- writing the page made the card nonsense, and writing a good card meant having
-- no page.
--
-- body splits them. A custom page renders `body ?? description`, so every page
-- written before this keeps rendering from description exactly as it did and
-- NOTHING needs backfilling; the first save through the new editor writes body,
-- and description goes back to being the short summary the cards want.
--
-- Null for every other space type, which has no use for it — a discussion feed
-- is its posts, not a body.
--
-- Safe to re-run.
-- =============================================================================

alter table public.spaces
  add column if not exists body text;
