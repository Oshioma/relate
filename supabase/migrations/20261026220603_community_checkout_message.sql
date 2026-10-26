-- A community's own line on its Stripe Checkout pages, shown under the Pay
-- button (Checkout's custom_text.submit). Written in Admin -> Payments ->
-- Checkout page. Null = our default line. Stripe allows up to 1200 characters;
-- we keep it shorter so it stays one short note.
alter table public.communities add column if not exists checkout_message text;

alter table public.communities drop constraint if exists communities_checkout_message_length;
alter table public.communities
  add constraint communities_checkout_message_length check (checkout_message is null or char_length(checkout_message) <= 500);
