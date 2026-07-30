-- =============================================================================
-- Relate — track a subscription's pending cancellation
--
-- Self-serve cancel sets a subscription to cancel at the end of the paid period
-- (Stripe cancel_at_period_end) rather than immediately, so the member keeps
-- access they've paid for. This column mirrors that flag, kept in sync by the
-- Stripe webhook, so the UI can show "cancels on <date>" and offer Resume.
--
-- Added to both member subscription tables. Default false = active/renewing.
-- Safe to re-run.
-- =============================================================================

alter table public.tier_subscriptions
  add column if not exists cancel_at_period_end boolean not null default false;

alter table public.space_subscriptions
  add column if not exists cancel_at_period_end boolean not null default false;
