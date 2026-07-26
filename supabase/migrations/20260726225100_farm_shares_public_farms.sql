-- =============================================================================
-- Relate — My Crops: public/private farm sharing
--
-- Safe to re-run.
--
-- A member's crops on the "My Crops" page come from the external shamba.online
-- farm app (see src/lib/farm-bridge.ts), matched by the signed-in user's email.
-- This lets a member opt in to sharing that farm with the rest of their
-- community: when is_public = true, other members can browse the member's
-- crops on their own My Crops page.
--
-- The farm bridge is keyed by EMAIL, which relate otherwise keeps in auth.users
-- (never on profiles, so `select *` on profiles can't leak it). We snapshot the
-- opted-in member's email here at toggle time so the browse path can fetch their
-- crops without touching auth.users per-request. Because that column is PII,
-- RLS restricts SELECT on this table to the member's OWN row — the community
-- browse runs server-side with the service-role client (see
-- src/lib/data/farm-shares.ts), which never exposes farm_email to the browser.
-- =============================================================================

create table if not exists public.farm_shares (
  profile_id uuid primary key references public.profiles (id) on delete cascade,
  is_public boolean not null default false,
  -- Snapshot of the member's email at opt-in, used only server-side to query
  -- the farm bridge. Never selectable by other members (RLS below).
  farm_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.farm_shares;
create trigger set_updated_at before update on public.farm_shares
  for each row execute function public.set_updated_at();

-- Fast lookup of the members who have opted in.
create index if not exists idx_farm_shares_public on public.farm_shares (profile_id) where is_public;

alter table public.farm_shares enable row level security;

-- A member can only ever read their OWN share row — the farm_email column is
-- PII. The community-browse feature reads other members' rows through the
-- service-role client, which bypasses RLS on the server.
drop policy if exists "farm_shares_select_own" on public.farm_shares;
create policy "farm_shares_select_own" on public.farm_shares
  for select to authenticated
  using (profile_id = auth.uid());

drop policy if exists "farm_shares_insert_own" on public.farm_shares;
create policy "farm_shares_insert_own" on public.farm_shares
  for insert to authenticated
  with check (profile_id = auth.uid());

drop policy if exists "farm_shares_update_own" on public.farm_shares;
create policy "farm_shares_update_own" on public.farm_shares
  for update to authenticated
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

drop policy if exists "farm_shares_delete_own" on public.farm_shares;
create policy "farm_shares_delete_own" on public.farm_shares
  for delete to authenticated
  using (profile_id = auth.uid());
