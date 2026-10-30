-- Each membership tier's own Stripe Checkout look, edited in its own window
-- under Admin -> Payments -> Checkout page: a line under the Pay button and a
-- picture beside the product. Null = the community's line / cover photo.
alter table public.community_tiers add column if not exists checkout_message text;
alter table public.community_tiers add column if not exists checkout_image_url text;

alter table public.community_tiers drop constraint if exists community_tiers_checkout_message_length;
alter table public.community_tiers
  add constraint community_tiers_checkout_message_length check (checkout_message is null or char_length(checkout_message) <= 500);
