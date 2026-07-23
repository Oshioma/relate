-- Community-owner feature preferences.
--
-- Two-level control over the optional nav features (events, concierge):
--   1. AVAILABILITY  (super admin): feature_defaults + community_features.
--      Decides which features a community is *allowed* to use.
--   2. PREFERENCE    (community owner): community_feature_prefs, below.
--      Within what the super admin allows, the owner turns features on/off
--      for their own community.
-- Effective state = available AND owner-enabled (see src/lib/data/features.ts).
-- A missing pref row means "on" (the owner hasn't opted out), so an
-- available feature stays visible until the owner turns it off.

create table if not exists public.community_feature_prefs (
  community_id uuid not null references public.communities (id) on delete cascade,
  feature_key text not null,
  enabled boolean not null default true,
  updated_at timestamptz not null default now(),
  primary key (community_id, feature_key)
);

drop trigger if exists set_updated_at on public.community_feature_prefs;
create trigger set_updated_at before update on public.community_feature_prefs
  for each row execute function public.set_updated_at();

create index if not exists idx_community_feature_prefs_community on public.community_feature_prefs (community_id);

alter table public.community_feature_prefs enable row level security;

-- Readable by any authenticated user: the layout resolves feature state for
-- every viewer to build the nav (mirrors feature_defaults/community_features).
drop policy if exists "community_feature_prefs_select" on public.community_feature_prefs;
create policy "community_feature_prefs_select" on public.community_feature_prefs
  for select to authenticated
  using (true);

-- Only the community's OWNER may set its preferences. The super admin's
-- authority lives in community_features (availability), not here.
drop policy if exists "community_feature_prefs_write" on public.community_feature_prefs;
create policy "community_feature_prefs_write" on public.community_feature_prefs
  for all to authenticated
  using (
    exists (
      select 1 from public.community_memberships m
      where m.community_id = community_feature_prefs.community_id
        and m.user_id = auth.uid()
        and m.status = 'active'
        and m.role = 'owner'
    )
  )
  with check (
    exists (
      select 1 from public.community_memberships m
      where m.community_id = community_feature_prefs.community_id
        and m.user_id = auth.uid()
        and m.status = 'active'
        and m.role = 'owner'
    )
  );
