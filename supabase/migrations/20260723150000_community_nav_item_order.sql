-- Per-community ordering for the built-in nav items (Events, Search).
--
-- Spaces already carry their own sort_order (public.spaces). The built-in
-- feature links are virtual — they have no row to hold a position — so this
-- table stores a sort_order for each one per community. The sidebar merges
-- spaces and these built-in items into a single ordered list (see
-- src/app/c/[communitySlug]/layout.tsx).
--
-- A missing row means "unpositioned": the layout falls back to a large
-- default so the item sorts after the spaces, preserving the original
-- Feed → spaces → Events → Search order until an admin drags things around.
-- item_key mirrors FeatureKey ('events', 'concierge') in src/types/database.ts.

create table if not exists public.community_nav_item_order (
  community_id uuid not null references public.communities (id) on delete cascade,
  item_key text not null,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (community_id, item_key)
);

drop trigger if exists set_updated_at on public.community_nav_item_order;
create trigger set_updated_at before update on public.community_nav_item_order
  for each row execute function public.set_updated_at();

create index if not exists idx_community_nav_item_order_community
  on public.community_nav_item_order (community_id);

alter table public.community_nav_item_order enable row level security;

-- Readable by any authenticated user: the layout resolves nav order for
-- every viewer to build the sidebar (mirrors community_feature_prefs).
drop policy if exists "community_nav_item_order_select" on public.community_nav_item_order;
create policy "community_nav_item_order_select" on public.community_nav_item_order
  for select to authenticated
  using (true);

-- Writable by the community's staff (owner or admin) — nav order is a layout
-- concern, same authority as reordering spaces (see spaces_update_admin).
drop policy if exists "community_nav_item_order_write" on public.community_nav_item_order;
create policy "community_nav_item_order_write" on public.community_nav_item_order
  for all to authenticated
  using (public.is_community_admin(community_id, auth.uid()))
  with check (public.is_community_admin(community_id, auth.uid()));
