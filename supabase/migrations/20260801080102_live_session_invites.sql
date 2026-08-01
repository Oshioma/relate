-- =============================================================================
-- Relate — Live Events: invite specific members
--
-- Broadcasting already works: scheduling or going live notifies every member
-- who can see the space (notify_live_session). This adds the other half — a
-- host hand-picking specific members to invite, whether the session is
-- scheduled ("invite to a Live Event") or already live ("invite to join now").
--
-- An invite is one row per (session, member). Inserting it fans out a personal
-- 'live_invite' notification to that member via a SECURITY DEFINER trigger
-- (members can't insert notifications for others directly under RLS), which
-- also emails and streams to the bell like every other notification. Safe to
-- re-run.
-- =============================================================================

create table if not exists public.live_session_invites (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.live_sessions (id) on delete cascade,
  community_id uuid not null references public.communities (id) on delete cascade,
  -- The invited member.
  user_id uuid not null references public.profiles (id) on delete cascade,
  -- The host who sent the invite.
  invited_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (session_id, user_id)
);

create index if not exists idx_live_session_invites_session on public.live_session_invites (session_id);
create index if not exists idx_live_session_invites_user on public.live_session_invites (user_id);

alter table public.live_session_invites enable row level security;

-- Visible to the invited member and to community staff (staff see who's been
-- invited to manage the guest list; the invitee sees their own invite). Same
-- can_view_space gate keeps it scoped to people who can see the session.
drop policy if exists "live_session_invites_select" on public.live_session_invites;
create policy "live_session_invites_select" on public.live_session_invites
  for select to authenticated
  using (
    (
      user_id = auth.uid()
      or public.is_community_staff(community_id, auth.uid())
    )
    and exists (
      select 1 from public.live_sessions ls
      where ls.id = session_id
        and public.can_view_space(ls.space_id, auth.uid())
    )
  );

-- Only staff invite, and only to sessions in their own community.
drop policy if exists "live_session_invites_insert_staff" on public.live_session_invites;
create policy "live_session_invites_insert_staff" on public.live_session_invites
  for insert to authenticated
  with check (
    public.is_community_staff(community_id, auth.uid())
    and exists (
      select 1 from public.live_sessions ls
      where ls.id = session_id and ls.community_id = community_id
    )
  );

-- Staff can also withdraw an invite.
drop policy if exists "live_session_invites_delete_staff" on public.live_session_invites;
create policy "live_session_invites_delete_staff" on public.live_session_invites
  for delete to authenticated
  using (public.is_community_staff(community_id, auth.uid()));

-- Fan out a personal invite notification when a member is invited. The body
-- reflects whether the session is live now or scheduled (localized to the
-- invitee's timezone, same helper the broadcast notifications use). Skips an
-- invite the host sends to themselves.
create or replace function public.notify_live_session_invite()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_session public.live_sessions%rowtype;
  v_community_slug text;
  v_space_slug text;
  v_tz text;
  v_body text;
begin
  select * into v_session from public.live_sessions where id = new.session_id;
  if v_session.id is null then
    return new;
  end if;

  if new.user_id is not distinct from new.invited_by then
    return new;
  end if;

  select slug into v_community_slug from public.communities where id = new.community_id;
  select slug into v_space_slug from public.spaces where id = v_session.space_id;
  select timezone into v_tz from public.profiles where id = new.user_id;

  if v_session.status = 'live' then
    v_body := 'Happening now — tap to join.';
  elsif v_session.scheduled_start is not null then
    v_body := 'Starts ' || public.format_local_time(v_session.scheduled_start, v_tz);
  else
    v_body := 'You''ve been invited to a live video call.';
  end if;

  insert into public.notifications (user_id, community_id, type, title, body, link, actor_id)
  values (
    new.user_id,
    new.community_id,
    'live_invite',
    'You''re invited: ' || v_session.title,
    v_body,
    '/c/' || v_community_slug || '/spaces/' || v_space_slug,
    new.invited_by
  );

  return new;
end;
$$;

drop trigger if exists trg_notify_live_session_invite on public.live_session_invites;
create trigger trg_notify_live_session_invite
  after insert on public.live_session_invites
  for each row execute function public.notify_live_session_invite();
