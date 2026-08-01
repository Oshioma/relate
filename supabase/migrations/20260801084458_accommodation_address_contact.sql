-- Stay listings could record roughly where they are (location_label, lat/lng)
-- but never their actual address, nor how to reach the host outside the booking
-- link. Directory listings have carried all three since the start; the gap only
-- became obvious once link autofill started extracting an address, a phone
-- number and a website for a stay and had nowhere to put any of them.
--
-- All nullable: a camping spot may have none of these, and every existing row
-- predates the columns.

alter table public.accommodation_listings
  add column if not exists address text,
  add column if not exists website text,
  add column if not exists phone text;
