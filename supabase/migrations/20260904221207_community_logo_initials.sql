-- =============================================================================
-- Relate — let a community choose the letters in its logo
--
-- A community with no logo image gets a lettered circle instead, and those
-- letters are derived from its name: first letter of the first word, first
-- letter of the last. "Squidge Over Skool" therefore reads SS, quietly dropping
-- the word in the middle, and there was no way to say otherwise.
--
-- logo_initials is that override. Null means keep deriving them, which is every
-- community that exists today, so nothing changes appearance on deploy.
--
-- Capped at four characters because this is drawn inside a circle at sizes down
-- to 24px: past four it stops being a monogram and starts being text that does
-- not fit. Trimmed to null when blank so "set it back to automatic" is just
-- clearing the field.
--
-- Written through the ordinary owner/admin update policy on communities, like
-- logo_url and accent_color. It is a display choice, not a privileged one: the
-- guarded columns are the plan, the domain and the homepage feature.
--
-- Safe to re-run.
-- =============================================================================

alter table public.communities
  add column if not exists logo_initials text;

alter table public.communities
  drop constraint if exists communities_logo_initials_length;

alter table public.communities
  add constraint communities_logo_initials_length
  check (logo_initials is null or char_length(btrim(logo_initials)) between 1 and 4);

comment on column public.communities.logo_initials is
  'Letters shown in the lettered logo instead of ones derived from the name. Null = derive.';
