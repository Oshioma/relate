-- =============================================================================
-- Relate — in-app notifications
--
-- Run this in the Supabase SQL editor after supabase/schema.sql. Safe to
-- re-run.
--
-- Notifications are only ever written by the SECURITY DEFINER trigger
-- functions below — there is no INSERT policy for the `authenticated` role,
-- so nothing client-side can spoof a notification into someone else's list.
-- Delivery is in-app only (no email/SMTP setup required): a bell icon shows
-- an unread count, refreshed on page load/navigation, not in real time.
-- =============================================================================

do $$ begin
  create type public.notification_type as enum ('comment', 'post', 'membership');
exception when duplicate_object then null; end $$;

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  community_id uuid references public.communities (id) on delete cascade,
  type public.notification_type not null,
  title text not null,
  body text,
  link text,
  actor_id uuid references public.profiles (id) on delete set null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_notifications_user_created on public.notifications (user_id, created_at desc);
create index if not exists idx_notifications_user_unread on public.notifications (user_id) where not read;

alter table public.notifications enable row level security;

drop policy if exists "notifications_select_own" on public.notifications;
create policy "notifications_select_own" on public.notifications
  for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "notifications_update_own" on public.notifications;
create policy "notifications_update_own" on public.notifications
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "notifications_delete_own" on public.notifications;
create policy "notifications_delete_own" on public.notifications
  for delete to authenticated
  using (user_id = auth.uid());

-- -----------------------------------------------------------------------------
-- Comment on your post
-- -----------------------------------------------------------------------------
create or replace function public.notify_new_comment()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_post_author uuid;
  v_post_title text;
  v_community_id uuid;
  v_link text;
  v_actor_name text;
begin
  select p.author_id, p.title, p.community_id,
         '/c/' || c.slug || '/spaces/' || s.slug || '/posts/' || p.id
    into v_post_author, v_post_title, v_community_id, v_link
  from public.posts p
  join public.communities c on c.id = p.community_id
  join public.spaces s on s.id = p.space_id
  where p.id = new.post_id;

  if v_post_author is null or v_post_author = new.author_id then
    return new;
  end if;

  select coalesce(full_name, username) into v_actor_name from public.profiles where id = new.author_id;

  insert into public.notifications (user_id, community_id, type, title, body, link, actor_id)
  values (
    v_post_author,
    v_community_id,
    'comment',
    v_actor_name || ' commented on "' || v_post_title || '"',
    left(new.body, 140),
    v_link,
    new.author_id
  );

  return new;
end;
$$;

drop trigger if exists trg_notify_new_comment on public.comments;
create trigger trg_notify_new_comment
  after insert on public.comments
  for each row execute function public.notify_new_comment();

-- -----------------------------------------------------------------------------
-- New post (discussion, announcement, or resource) in a space you can view
-- -----------------------------------------------------------------------------
create or replace function public.notify_new_post()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_community_slug text;
  v_space_slug text;
  v_link text;
  v_actor_name text;
  v_verb text;
begin
  select slug into v_community_slug from public.communities where id = new.community_id;
  select slug into v_space_slug from public.spaces where id = new.space_id;
  v_link := '/c/' || v_community_slug || '/spaces/' || v_space_slug || '/posts/' || new.id;

  select coalesce(full_name, username) into v_actor_name from public.profiles where id = new.author_id;
  v_verb := case when new.post_type = 'announcement' then ' posted an announcement: "' else ' posted: "' end;

  insert into public.notifications (user_id, community_id, type, title, body, link, actor_id)
  select
    m.user_id,
    new.community_id,
    'post',
    v_actor_name || v_verb || new.title || '"',
    left(coalesce(new.body, ''), 140),
    v_link,
    new.author_id
  from public.community_memberships m
  where m.community_id = new.community_id
    and m.status = 'active'
    and m.user_id != new.author_id
    and public.can_view_space(new.space_id, m.user_id);

  return new;
end;
$$;

drop trigger if exists trg_notify_new_post on public.posts;
create trigger trg_notify_new_post
  after insert on public.posts
  for each row execute function public.notify_new_post();

-- -----------------------------------------------------------------------------
-- Added to a community (skips the owner row created alongside the community
-- itself — you obviously know you just created it)
-- -----------------------------------------------------------------------------
create or replace function public.notify_membership_added()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_community_name text;
  v_community_slug text;
begin
  if new.status != 'active' or new.role = 'owner' then
    return new;
  end if;

  select name, slug into v_community_name, v_community_slug from public.communities where id = new.community_id;

  insert into public.notifications (user_id, community_id, type, title, link)
  values (
    new.user_id,
    new.community_id,
    'membership',
    'You joined ' || v_community_name,
    '/c/' || v_community_slug
  );

  return new;
end;
$$;

drop trigger if exists trg_notify_membership_added on public.community_memberships;
create trigger trg_notify_membership_added
  after insert on public.community_memberships
  for each row execute function public.notify_membership_added();

-- -----------------------------------------------------------------------------
-- Role changed
-- -----------------------------------------------------------------------------
create or replace function public.notify_role_changed()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_community_name text;
  v_community_slug text;
begin
  if new.status != 'active' or old.role = new.role then
    return new;
  end if;

  select name, slug into v_community_name, v_community_slug from public.communities where id = new.community_id;

  insert into public.notifications (user_id, community_id, type, title, link)
  values (
    new.user_id,
    new.community_id,
    'membership',
    'You are now ' || new.role || ' in ' || v_community_name,
    '/c/' || v_community_slug
  );

  return new;
end;
$$;

drop trigger if exists trg_notify_role_changed on public.community_memberships;
create trigger trg_notify_role_changed
  after update on public.community_memberships
  for each row execute function public.notify_role_changed();
