-- Per-community contact info: the block a community owner writes to show on
-- their community's contact page (/c/<slug>/contact) — a phone/WhatsApp number,
-- opening hours, an address, whatever they want visitors to see. Stored as the
-- same sanitised HTML/Markdown as the rest of the app and rendered through
-- <RichText>. Null = nothing shown above the contact form.
--
-- No new RLS: `communities` already restricts updates to the owner and admins
-- and is world-readable for the communities a visitor can see.
alter table public.communities
  add column if not exists contact_info text;
