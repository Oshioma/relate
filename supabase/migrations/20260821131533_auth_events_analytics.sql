-- =============================================================================
-- Relate — auth & membership event log (platform analytics)
--
-- The platform-admin tabs could show WHO exists (profiles, memberships) but
-- not WHAT HAPPENED: nothing recorded that someone signed up, signed in, or
-- joined a community, and nothing attributed a signup to the community it
-- came from. This adds a single append-only event log, `auth_events`, plus the
-- triggers/RPC that fill it, so the super admin can answer "did anyone new
-- sign up to <community> this week?" — for every community on the platform,
-- private ones included (the admin surfaces read it with the service-role
-- client, which bypasses RLS the same way the rest of that tab does).
--
-- Events captured
--   signup            a new auth.users row (trigger on auth.users)
--   login             a successful password sign-in (RPC, called by the app)
--   email_confirmed   the confirmation link was actually clicked (RPC)
--   join              a membership became active (trigger)
--   invited           a membership row was created as 'invited' (trigger)
--   leave             an active membership was removed or downgraded (trigger)
--
-- Community attribution
--   Signups and logins carry no community column of their own, so the app
--   passes the context it already knows — the invite code, the /c/<slug> it
--   came from, or the host (custom domain / <slug>.<apex> subdomain) — and
--   auth_event_community_id() below resolves it to a community id with
--   security-definer rights, so a private community resolves just as well as
--   a public one. Membership events know their community directly.
--
-- Everything that writes here is wrapped so analytics can never break the
-- flow it observes: a failing insert is swallowed, and a signup/join still
-- succeeds.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- auth_events
-- -----------------------------------------------------------------------------
create table if not exists public.auth_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  -- Nulled rather than cascaded when the account or community is deleted, so
  -- historical counts stay honest (a spam sweep shouldn't rewrite last month's
  -- signup numbers). community_slug keeps the label readable afterwards.
  user_id uuid references public.profiles (id) on delete set null,
  community_id uuid references public.communities (id) on delete set null,
  community_slug text,
  -- Where the event happened: 'invite' | 'community_page' | 'custom_domain' |
  -- 'subdomain' | 'platform' (see src/lib/auth-events.ts), or for membership
  -- events the membership role.
  source text,
  path text,
  host text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint auth_events_type_check check (
    event_type in ('signup', 'login', 'email_confirmed', 'join', 'invited', 'leave')
  )
);

create index if not exists idx_auth_events_created on public.auth_events (created_at desc);
create index if not exists idx_auth_events_community on public.auth_events (community_id, created_at desc);
create index if not exists idx_auth_events_type on public.auth_events (event_type, created_at desc);
create index if not exists idx_auth_events_user on public.auth_events (user_id, created_at desc);

alter table public.auth_events enable row level security;

-- Read: super admins only. There is deliberately NO insert/update/delete
-- policy — rows arrive through the security-definer trigger/RPC below (or the
-- service-role client), never through a direct client write.
drop policy if exists "auth_events_select_super_admin" on public.auth_events;
create policy "auth_events_select_super_admin" on public.auth_events
  for select to authenticated
  using (public.is_super_admin(auth.uid()));

-- Where a member's account came from, denormalised onto the profile so the
-- per-user admin page can show it without scanning the event log.
alter table public.profiles add column if not exists signup_community_id uuid
  references public.communities (id) on delete set null;
alter table public.profiles add column if not exists signup_source text;

-- -----------------------------------------------------------------------------
-- Community attribution helper
--
-- Resolves the community a signup/login belongs to from whatever context the
-- app could see. Security definer: an invite code or private-community slug
-- must resolve even for a visitor who can't read that community's row yet.
-- -----------------------------------------------------------------------------
create or replace function public.auth_event_community_id(
  p_community_slug text,
  p_invite_code text,
  p_host text
)
returns uuid
language plpgsql
security definer
stable
set search_path = public
as $$
declare
  v_id uuid;
  v_host text;
begin
  if coalesce(p_invite_code, '') <> '' then
    select ci.community_id into v_id from public.community_invites ci where ci.code = p_invite_code;
    if v_id is not null then return v_id; end if;
  end if;

  if coalesce(p_community_slug, '') <> '' then
    select c.id into v_id from public.communities c where c.slug = lower(p_community_slug);
    if v_id is not null then return v_id; end if;
  end if;

  -- Only a *verified* custom domain maps a host to a community; the automatic
  -- <slug>.<apex> subdomain is resolved app-side and arrives as p_community_slug.
  if coalesce(p_host, '') <> '' then
    v_host := lower(split_part(p_host, ':', 1));
    select c.id into v_id
      from public.communities c
     where c.custom_domain = v_host
       and c.custom_domain_verified_at is not null;
  end if;

  return v_id;
end;
$$;

-- -----------------------------------------------------------------------------
-- signup — trigger on auth.users
--
-- A separate trigger from handle_new_user() so account creation is never at
-- the mercy of analytics. Named so it sorts AFTER on_auth_user_created (which
-- creates the profile row the FK points at); triggers on the same event fire
-- in name order.
--
-- The context comes from raw_user_meta_data, which the signup form supplies.
-- That is client-influenced data, so it is only ever used to attribute an
-- event — never to grant anything.
-- -----------------------------------------------------------------------------
create or replace function public.log_signup_auth_event()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  v_community uuid;
  v_source text;
begin
  begin
    v_source := coalesce(nullif(meta ->> 'signup_source', ''), 'platform');
    v_community := public.auth_event_community_id(
      meta ->> 'signup_community_slug',
      meta ->> 'signup_invite_code',
      meta ->> 'signup_host'
    );

    insert into public.auth_events (event_type, user_id, community_id, community_slug, source, path, host)
    values (
      'signup',
      new.id,
      v_community,
      (select c.slug from public.communities c where c.id = v_community),
      v_source,
      left(meta ->> 'signup_path', 300),
      left(meta ->> 'signup_host', 200)
    );

    update public.profiles
       set signup_community_id = coalesce(v_community, signup_community_id),
           signup_source = v_source
     where id = new.id;
  exception when others then
    -- Never block a signup because the event log misbehaved.
    null;
  end;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_signup_event on auth.users;
create trigger on_auth_user_created_signup_event
  after insert on auth.users
  for each row execute function public.log_signup_auth_event();

-- -----------------------------------------------------------------------------
-- join / invited / leave — trigger on community_memberships
--
-- Instrumenting the table rather than the app catches every path into a
-- community: the join button, redeem_invite(), an admin adding someone, and
-- the owner membership created with the community itself.
-- -----------------------------------------------------------------------------
create or replace function public.log_membership_auth_event()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_type text;
  v_user uuid;
  v_community uuid;
  v_role text;
  v_status text;
begin
  if tg_op = 'INSERT' then
    v_user := new.user_id;
    v_community := new.community_id;
    v_role := new.role::text;
    v_status := new.status::text;
    v_type := case new.status when 'active' then 'join' when 'invited' then 'invited' else null end;
  elsif tg_op = 'UPDATE' then
    v_user := new.user_id;
    v_community := new.community_id;
    v_role := new.role::text;
    v_status := new.status::text;
    if new.status = 'active' and old.status is distinct from 'active' then
      v_type := 'join';
    elsif old.status = 'active' and new.status is distinct from 'active' then
      v_type := 'leave';
    end if;
  else
    v_user := old.user_id;
    v_community := old.community_id;
    v_role := old.role::text;
    v_status := old.status::text;
    -- A community being deleted cascades its memberships away; that is not
    -- everyone "leaving", so only log when the community still exists.
    if old.status = 'active' and exists (select 1 from public.communities c where c.id = old.community_id) then
      v_type := 'leave';
    end if;
  end if;

  if v_type is not null then
    begin
      insert into public.auth_events (event_type, user_id, community_id, community_slug, source, metadata)
      values (
        v_type,
        v_user,
        v_community,
        (select c.slug from public.communities c where c.id = v_community),
        v_role,
        jsonb_build_object('role', v_role, 'status', v_status)
      );
    exception when others then
      null;
    end;
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

drop trigger if exists on_membership_auth_event on public.community_memberships;
create trigger on_membership_auth_event
  after insert or update or delete on public.community_memberships
  for each row execute function public.log_membership_auth_event();

-- -----------------------------------------------------------------------------
-- login / email_confirmed — RPC called by the app
--
-- Runs as the signed-in user (security definer only so it can write a table
-- nobody has an insert policy on). It can only ever record an event for
-- auth.uid(), and only the two self-reportable types, so there is nothing to
-- forge beyond one's own sign-in. Also refreshes profiles.last_active_at,
-- which the admin surfaces display.
-- -----------------------------------------------------------------------------
create or replace function public.record_auth_event(
  p_event_type text,
  p_source text default null,
  p_path text default null,
  p_host text default null,
  p_community_slug text default null,
  p_invite_code text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_community uuid;
begin
  if v_uid is null then
    return;
  end if;

  if p_event_type not in ('login', 'email_confirmed') then
    raise exception 'record_auth_event: unsupported event type %', p_event_type;
  end if;

  v_community := public.auth_event_community_id(p_community_slug, p_invite_code, p_host);

  insert into public.auth_events (event_type, user_id, community_id, community_slug, source, path, host)
  values (
    p_event_type,
    v_uid,
    v_community,
    (select c.slug from public.communities c where c.id = v_community),
    nullif(p_source, ''),
    left(p_path, 300),
    left(p_host, 200)
  );

  update public.profiles set last_active_at = now() where id = v_uid;
end;
$$;

grant execute on function public.record_auth_event(text, text, text, text, text, text) to authenticated;

-- -----------------------------------------------------------------------------
-- Backfill
--
-- Without this the new tab opens empty and looks broken on a platform that
-- already has members. Every existing profile gets a 'signup' event at its
-- created_at, and every existing membership a 'join' at its own — flagged
-- backfilled:true in metadata so they're distinguishable from live events.
-- Guarded on "no backfill rows yet", so re-running the migration is a no-op.
-- -----------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from public.auth_events where metadata ->> 'backfilled' = 'true') then
    insert into public.auth_events (event_type, user_id, community_id, community_slug, source, metadata, created_at)
    select 'signup', p.id, null, null, 'backfill', jsonb_build_object('backfilled', true), p.created_at
    from public.profiles p;

    insert into public.auth_events (event_type, user_id, community_id, community_slug, source, metadata, created_at)
    select
      case m.status when 'active' then 'join' when 'invited' then 'invited' else 'join' end,
      m.user_id,
      m.community_id,
      c.slug,
      m.role::text,
      jsonb_build_object('backfilled', true, 'role', m.role::text, 'status', m.status::text),
      m.created_at
    from public.community_memberships m
    join public.communities c on c.id = m.community_id;
  end if;
end $$;
