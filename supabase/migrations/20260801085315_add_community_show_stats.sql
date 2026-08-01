-- Whether the community header shows its counts (members, events, businesses,
-- posts).
--
-- A stat strip exists to argue that a community is busy, so it only helps once
-- the numbers are flattering — "2 Members" makes the case against. Whether that
-- point has been reached is a judgement about the community, not something the
-- app should guess from a threshold, so it's the owner's switch.
--
-- Defaults to false, including for communities that exist already: a small
-- community showing its size by default is exactly the situation this is meant
-- to avoid, so the safe state is off until someone turns it on.
--
-- No new RLS: `communities` already restricts updates to the owner and admins.
alter table public.communities
  add column if not exists show_stats boolean not null default false;
