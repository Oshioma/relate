-- =============================================================================
-- Relate — enum value for the Books & Media space type
--
-- A Books & Media space is a family's (or a homeschool group's) shelf of
-- books, videos and other media that somebody has actually looked at: paste a
-- link, the app reads the page and Claude fills in the title, a description,
-- a suggested age range and what a parent would want to know before handing it
-- to a child — language, violence, frightening scenes and the rest. Members
-- then file it as good for kids, or as not suitable with the reason why.
--
-- Only the enum value lives here — Postgres refuses to use a value added in
-- the same transaction, so the CHECK rebuild and the table come in the next
-- two migrations. Idempotent.
-- =============================================================================

alter type public.space_type add value if not exists 'books_media';
