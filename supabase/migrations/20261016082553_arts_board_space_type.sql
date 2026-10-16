-- =============================================================================
-- Relate — enum value for the 64 Arts board space type
--
-- An Arts Board space is an 8×8 board of the 64 classical arts of ancient
-- India (singing, carpentry, riddles, cipher writing…). Each square flips to
-- say what the art was and offers a family activity; a family marks the ones
-- they've done and the board circles them. The 64 arts themselves live in code
-- (src/lib/arts/sixty-four-arts.ts) — they are a fixed historical list, not
-- something a community edits.
--
-- Only the enum value lives here — Postgres refuses to use a value added in
-- the same transaction, so the CHECK rebuild and the table come in the next
-- two migrations. Idempotent.
-- =============================================================================

alter type public.space_type add value if not exists 'arts_board';
