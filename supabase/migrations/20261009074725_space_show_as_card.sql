-- Whether a space gets a photo card on its community's feed. Until now the
-- cards simply mirrored the sidebar (show_in_nav), so an admin who tidied the
-- sidebar lost the cards too. The two are now set independently.
--
-- Existing spaces start where they were (card shown iff in the sidebar), so
-- nothing on any feed changes on deploy; new spaces get a card by default.

alter table public.spaces
  add column if not exists show_as_card boolean not null default true;

update public.spaces set show_as_card = show_in_nav;
