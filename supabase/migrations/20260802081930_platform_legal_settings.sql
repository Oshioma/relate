-- =============================================================================
-- Platform-wide legal documents (Terms & Conditions, Privacy Policy)
--
-- A single, platform-level place for the super admin to write the two legal
-- pages the footer links to. Not per-community — this is the platform operator's
-- own Terms/Privacy, shown at /terms and /privacy and rendered through
-- <RichText> (sanitised; never dangerouslySetInnerHTML).
--
-- Modelled as a one-row singleton: a CHECK-pinned id keeps there being exactly
-- one settings row, so callers read/write it by `id = 1` without worrying about
-- duplicates.
-- =============================================================================

create table if not exists public.platform_settings (
  -- Enforce a single row: only id = 1 is ever allowed.
  id smallint primary key default 1 check (id = 1),
  terms text,
  privacy text,
  updated_at timestamptz not null default now()
);

-- Seed the singleton so the read pages and the admin editor always have a row
-- to load (empty content = "not published yet").
insert into public.platform_settings (id) values (1)
on conflict (id) do nothing;

drop trigger if exists set_updated_at on public.platform_settings;
create trigger set_updated_at before update on public.platform_settings
  for each row execute function public.set_updated_at();

alter table public.platform_settings enable row level security;

-- Terms and Privacy are public documents: anyone, signed in or not, may read
-- them (the footer links reach them from every page, including logged-out ones).
drop policy if exists "platform_settings_select" on public.platform_settings;
create policy "platform_settings_select" on public.platform_settings
  for select
  using (true);

-- Only a platform super admin may edit them.
drop policy if exists "platform_settings_write" on public.platform_settings;
create policy "platform_settings_write" on public.platform_settings
  for all to authenticated
  using (public.is_super_admin(auth.uid()))
  with check (public.is_super_admin(auth.uid()));
