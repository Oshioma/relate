-- =============================================================================
-- Relate — Member Directory, Stage 1e: member connections (future-ready)
--
-- Run this after supabase/direct-messages.sql (uses its is_blocked_between()
-- helper). Safe to re-run.
--
-- Schema + RLS only — no UI or app code reads/writes this yet. Modeled as a
-- LinkedIn-style connection request: requester sends, addressee accepts or
-- declines.
-- =============================================================================

do $$ begin
  create type public.connection_status as enum ('pending', 'accepted', 'declined');
exception when duplicate_object then null; end $$;

create table if not exists public.member_connections (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles (id) on delete cascade,
  addressee_id uuid not null references public.profiles (id) on delete cascade,
  status public.connection_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (requester_id, addressee_id),
  constraint member_connections_not_self check (requester_id != addressee_id)
);

drop trigger if exists set_updated_at on public.member_connections;
create trigger set_updated_at before update on public.member_connections
  for each row execute function public.set_updated_at();

create index if not exists idx_member_connections_requester on public.member_connections (requester_id);
create index if not exists idx_member_connections_addressee on public.member_connections (addressee_id);

alter table public.member_connections enable row level security;

drop policy if exists "member_connections_select_participant" on public.member_connections;
create policy "member_connections_select_participant" on public.member_connections
  for select to authenticated
  using (auth.uid() in (requester_id, addressee_id));

drop policy if exists "member_connections_insert_requester" on public.member_connections;
create policy "member_connections_insert_requester" on public.member_connections
  for insert to authenticated
  with check (
    requester_id = auth.uid()
    and not public.is_blocked_between(requester_id, addressee_id)
  );

drop policy if exists "member_connections_update_participant" on public.member_connections;
create policy "member_connections_update_participant" on public.member_connections
  for update to authenticated
  using (auth.uid() in (requester_id, addressee_id))
  with check (auth.uid() in (requester_id, addressee_id));

drop policy if exists "member_connections_delete_participant" on public.member_connections;
create policy "member_connections_delete_participant" on public.member_connections
  for delete to authenticated
  using (auth.uid() in (requester_id, addressee_id));
