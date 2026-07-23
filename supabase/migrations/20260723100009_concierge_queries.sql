-- =============================================================================
-- Relate — AI Concierge query log
--
-- Run this in the Supabase SQL editor after supabase/schema.sql. Safe to
-- re-run.
--
-- Every concierge search (both Layer 1 federated search and, when
-- configured, the Layer 2 AI synthesis) gets logged here so community
-- admins/owners can see what members are asking. No answer text is stored —
-- just the query itself plus how many results it matched, keeping this a
-- lightweight usage log rather than a transcript store.
-- =============================================================================

create table if not exists public.concierge_queries (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities (id) on delete cascade,
  user_id uuid references public.profiles (id) on delete set null,
  query text not null,
  result_count integer not null default 0,
  had_answer boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_concierge_queries_community_created on public.concierge_queries (community_id, created_at desc);

alter table public.concierge_queries enable row level security;

drop policy if exists "concierge_queries_select_admin" on public.concierge_queries;
create policy "concierge_queries_select_admin" on public.concierge_queries
  for select to authenticated
  using (public.is_community_admin(community_id, auth.uid()));

drop policy if exists "concierge_queries_insert_member" on public.concierge_queries;
create policy "concierge_queries_insert_member" on public.concierge_queries
  for insert to authenticated
  with check (
    (user_id = auth.uid() or user_id is null)
    and public.is_community_member(community_id, auth.uid())
  );
