-- =============================================================================
-- Relate — Accommodation: structured details, availability window, price unit
--
-- The listing model was thin (one free-text description). Add the facts guests
-- actually filter on — bedrooms, bathrooms, how many it sleeps, and amenities —
-- plus an optional availability window and a price unit so a monthly long-term
-- rental reads correctly next to a per-night holiday let. Safe to re-run.
-- =============================================================================

do $$ begin
  create type public.accommodation_price_unit as enum ('per_night', 'per_week', 'per_month');
exception when duplicate_object then null; end $$;

alter table public.accommodation_listings
  add column if not exists bedrooms integer,
  add column if not exists bathrooms integer,
  add column if not exists max_guests integer,
  add column if not exists amenities text[] not null default '{}',
  add column if not exists available_from date,
  add column if not exists available_to date,
  add column if not exists price_unit public.accommodation_price_unit not null default 'per_night';

do $$ begin
  alter table public.accommodation_listings
    add constraint accommodation_listings_bedrooms_nonneg check (bedrooms is null or bedrooms >= 0),
    add constraint accommodation_listings_bathrooms_nonneg check (bathrooms is null or bathrooms >= 0),
    add constraint accommodation_listings_max_guests_nonneg check (max_guests is null or max_guests >= 0),
    add constraint accommodation_listings_available_range check (available_from is null or available_to is null or available_from <= available_to);
exception when duplicate_object then null; end $$;
