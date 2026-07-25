-- Per-community-type default spaces, editable by a super admin at
-- /platform-admin.
--
-- Generalises the place-only place_default_spaces table to every community
-- template. Each row is one default item for a template: usually a space
-- (space_type set, builtin_key null), or one of the built-in nav features
-- (builtin_key = 'events' | 'concierge', space_type ignored) so Events and
-- Search can be ordered in the list like any other space.
--
-- Intentionally NOT seeded. The control panel and the creation wizard fall
-- back to the hard-coded defaults in src/lib/community-templates.ts when a
-- template has no rows here, so behaviour is identical until a super admin
-- edits a type — at which point that type's full list is materialised.

create table if not exists public.template_default_spaces (
  id uuid primary key default gen_random_uuid(),
  template_key text not null,
  name text not null,
  description text not null default '',
  space_type text not null default 'discussion',
  builtin_key text,
  show_in_nav boolean not null default true,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.template_default_spaces;
create trigger set_updated_at before update on public.template_default_spaces
  for each row execute function public.set_updated_at();

create index if not exists idx_template_default_spaces_template
  on public.template_default_spaces (template_key);

alter table public.template_default_spaces enable row level security;

-- Readable by any authenticated user: the creation wizard reads a template's
-- list to seed a new community's spaces.
drop policy if exists "template_default_spaces_select" on public.template_default_spaces;
create policy "template_default_spaces_select" on public.template_default_spaces
  for select to authenticated
  using (true);

-- Only a platform super admin may edit the defaults.
drop policy if exists "template_default_spaces_write" on public.template_default_spaces;
create policy "template_default_spaces_write" on public.template_default_spaces
  for all to authenticated
  using (public.is_super_admin(auth.uid()))
  with check (public.is_super_admin(auth.uid()));

-- Replaced by the generalised table above. Its only contents were the place
-- template's seeded defaults, which the code fallback reproduces, so nothing
-- meaningful is lost.
drop table if exists public.place_default_spaces;
