-- Lets the owner or an admin keep a community's guidelines page live while
-- hiding its "Community guidelines" link from the sidebar and mobile menu —
-- the page stays reachable at /c/<slug>/guidelines for anyone with the link.
--
-- Defaults to true so every community that already has guidelines keeps its
-- link. No new RLS: `communities` already restricts updates to the owner and
-- admins.
alter table public.communities
  add column if not exists guidelines_show_in_nav boolean not null default true;
