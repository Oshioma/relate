-- =============================================================================
-- Relate — a ledger of what each community spends on AI
--
-- Communities without a paid or comped plan get a free monthly AI allowance
-- (src/lib/usage/ai-spend.ts). Enforcing it needs to know what a community has
-- spent this month, and the lesson rows can't answer that: a deleted lesson
-- takes its cost with it, and a lesson written but never saved has no row at
-- all. So every paid AI call writes one line here when it happens, and the
-- allowance is checked against the sum.
--
-- amount_usd is an ESTIMATE at list prices (the same rates as the platform
-- admin's Usage & costs tab), recorded at the time so a later price change
-- never rewrites what a community was told it had used.
--
-- ref makes recording idempotent: a video job finishing is seen by whichever
-- request polls it next, and two polls racing must not charge it twice.
--
-- Service-role only. RLS is on with no policies, so nobody signed in can read
-- or write it directly; the app reads and writes it from server code.
--
-- Safe to re-run.
-- =============================================================================

create table if not exists public.ai_spend (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities (id) on delete cascade,
  user_id uuid references public.profiles (id) on delete set null,
  -- 'lesson' (Claude writing a lesson or level) or 'video' (transcription
  -- and proxy download for a lesson from a video).
  kind text not null,
  amount_usd numeric(12, 6) not null check (amount_usd >= 0),
  ref text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists ai_spend_community_created_idx
  on public.ai_spend (community_id, created_at);

alter table public.ai_spend enable row level security;
