-- =============================================================================
-- Relate — Crop Guides: add the remaining narrative crop sections
--
-- Safe to re-run. Adds five more jsonb section columns to crops, matching the
-- existing soil/sowing/watering/feeding/harvest pattern (flat label -> value
-- maps rendered as blocks by the crop page):
--   * pruning        — §10 Pruning & Maintenance (pruning, training, staking…)
--   * pollination     — §11 Pollination (self-fertile, hand pollination…)
--   * task_timeline  — §14 Seasonal Task Timeline (month-by-month tasks)
--   * troubleshooting — §13 Common Problems (symptom -> likely cause/fix)
--   * biodiversity   — §16 Biodiversity (value for bees, birds, soil…)
-- =============================================================================

alter table public.crops add column if not exists pruning jsonb not null default '{}'::jsonb;
alter table public.crops add column if not exists pollination jsonb not null default '{}'::jsonb;
alter table public.crops add column if not exists task_timeline jsonb not null default '{}'::jsonb;
alter table public.crops add column if not exists troubleshooting jsonb not null default '{}'::jsonb;
alter table public.crops add column if not exists biodiversity jsonb not null default '{}'::jsonb;
