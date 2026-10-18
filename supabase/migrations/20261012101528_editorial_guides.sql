-- =============================================================================
-- Relate — editorial guides (e.g. "Where to Stay in Zanzibar")
--
-- A community's professionally curated, long-form travel guide. This is not
-- the member-written wiki in public.guides (a Guides *space*): an editorial
-- guide is written by the community's admins, readable by anyone (signed in or
-- not) once published, and never edited by members. Member knowledge reaches
-- it through the community's existing spaces (recommendations, chat, the
-- directory and accommodation listings) and their moderation, never by writing
-- into the guide itself.
--
-- The guide's built-in content ships with the app (src/lib/guides/…), keyed by
-- slug. This table records that a community *has* the guide, whether it is
-- published, when its editors last reviewed it, and `content`: the admins'
-- per-destination overrides of that built-in copy, edited from the guide's
-- admin page. An empty object means "use the built-in content as-is".
--
-- Recommendations link to the community's own directory and accommodation
-- listings by slug at render time, so nothing here stores a business id that
-- would differ between environments.
--
-- editorial_guide_updates holds short, dated "local knowledge" notes staff add
-- under a destination (a new restaurant, a beach-access change, a road
-- closure). Each has an optional expiry so old notes stop presenting
-- themselves as current conditions.
--
-- Safe to re-run.
-- =============================================================================

create table if not exists public.editorial_guides (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities (id) on delete cascade,
  slug text not null,
  title text not null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  content jsonb not null default '{}'::jsonb,
  last_reviewed_on date,
  updated_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (community_id, slug)
);

drop trigger if exists set_updated_at on public.editorial_guides;
create trigger set_updated_at before update on public.editorial_guides
  for each row execute function public.set_updated_at();

alter table public.editorial_guides enable row level security;

-- Published guides are public reading, including for signed-out visitors (the
-- whole point is to be found in search). Drafts are visible to staff only.
drop policy if exists "editorial_guides_select_published" on public.editorial_guides;
create policy "editorial_guides_select_published" on public.editorial_guides
  for select to anon, authenticated
  using (status = 'published');

drop policy if exists "editorial_guides_select_staff" on public.editorial_guides;
create policy "editorial_guides_select_staff" on public.editorial_guides
  for select to authenticated
  using (public.is_community_staff(community_id, auth.uid()));

drop policy if exists "editorial_guides_manage_admin" on public.editorial_guides;
create policy "editorial_guides_manage_admin" on public.editorial_guides
  for all to authenticated
  using (public.is_community_admin(community_id, auth.uid()))
  with check (public.is_community_admin(community_id, auth.uid()));

-- -----------------------------------------------------------------------------
-- editorial_guide_updates: dated local-knowledge notes under a destination.
-- -----------------------------------------------------------------------------
create table if not exists public.editorial_guide_updates (
  id uuid primary key default gen_random_uuid(),
  guide_id uuid not null references public.editorial_guides (id) on delete cascade,
  community_id uuid not null references public.communities (id) on delete cascade,
  destination_key text,
  kind text not null default 'other' check (kind in ('restaurant', 'beach_access', 'accommodation', 'seasonal', 'event', 'road', 'other')),
  body text not null check (char_length(body) between 1 and 600),
  noted_on date not null default current_date,
  expires_on date,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_editorial_guide_updates_guide on public.editorial_guide_updates (guide_id, noted_on desc);

alter table public.editorial_guide_updates enable row level security;

drop policy if exists "editorial_guide_updates_select" on public.editorial_guide_updates;
create policy "editorial_guide_updates_select" on public.editorial_guide_updates
  for select to anon, authenticated
  using (
    exists (
      select 1 from public.editorial_guides g
      where g.id = editorial_guide_updates.guide_id
        and (g.status = 'published' or public.is_community_staff(g.community_id, auth.uid()))
    )
  );

drop policy if exists "editorial_guide_updates_manage_staff" on public.editorial_guide_updates;
create policy "editorial_guide_updates_manage_staff" on public.editorial_guide_updates
  for all to authenticated
  using (public.is_community_staff(community_id, auth.uid()))
  with check (
    public.is_community_staff(community_id, auth.uid())
    and exists (
      select 1 from public.editorial_guides g
      where g.id = editorial_guide_updates.guide_id
        and g.community_id = editorial_guide_updates.community_id
    )
  );


-- -----------------------------------------------------------------------------
-- Give Mzungu Zanzibar its "Where to Stay in Zanzibar" guide. Looked up by the
-- community's slug, so this is a no-op in any environment without it, and
-- re-running never overwrites what its admins have since edited. It goes live
-- published (merging this is the editorial sign-off); admins can switch it
-- back to draft from the guide's admin page.
-- -----------------------------------------------------------------------------
insert into public.editorial_guides (community_id, slug, title, status, last_reviewed_on)
select c.id, 'where-to-stay-in-zanzibar', 'Where to Stay in Zanzibar', 'published', current_date
from public.communities c
where c.slug = 'mzunguzanzibar'
on conflict (community_id, slug) do nothing;
