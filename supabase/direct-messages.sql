-- =============================================================================
-- Relate — Member Directory, Stage 1d: direct messaging + blocking
--
-- Run this after supabase/member-profile-extensions.sql. Safe to re-run.
--
-- Simple 1:1 messaging, no group chat. A conversation is uniquely
-- identified by its two participants (user_one_id < user_two_id keeps a
-- canonical ordering so the same pair can't produce two rows).
-- =============================================================================

create table if not exists public.member_blocks (
  id uuid primary key default gen_random_uuid(),
  blocker_id uuid not null references public.profiles (id) on delete cascade,
  blocked_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (blocker_id, blocked_id),
  constraint member_blocks_not_self check (blocker_id != blocked_id)
);

alter table public.member_blocks enable row level security;

drop policy if exists "member_blocks_select_own" on public.member_blocks;
create policy "member_blocks_select_own" on public.member_blocks
  for select to authenticated
  using (blocker_id = auth.uid());

drop policy if exists "member_blocks_insert_own" on public.member_blocks;
create policy "member_blocks_insert_own" on public.member_blocks
  for insert to authenticated
  with check (blocker_id = auth.uid());

drop policy if exists "member_blocks_delete_own" on public.member_blocks;
create policy "member_blocks_delete_own" on public.member_blocks
  for delete to authenticated
  using (blocker_id = auth.uid());

create or replace function public.is_blocked_between(a uuid, b uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.member_blocks
    where (blocker_id = a and blocked_id = b)
       or (blocker_id = b and blocked_id = a)
  );
$$;

-- -----------------------------------------------------------------------------
-- conversations
-- -----------------------------------------------------------------------------
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_one_id uuid not null references public.profiles (id) on delete cascade,
  user_two_id uuid not null references public.profiles (id) on delete cascade,
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_one_id, user_two_id),
  constraint conversations_ordered_pair check (user_one_id < user_two_id)
);

create index if not exists idx_conversations_user_one on public.conversations (user_one_id);
create index if not exists idx_conversations_user_two on public.conversations (user_two_id);

alter table public.conversations enable row level security;

drop policy if exists "conversations_select_participant" on public.conversations;
create policy "conversations_select_participant" on public.conversations
  for select to authenticated
  using (auth.uid() in (user_one_id, user_two_id));

drop policy if exists "conversations_insert_participant" on public.conversations;
create policy "conversations_insert_participant" on public.conversations
  for insert to authenticated
  with check (
    auth.uid() in (user_one_id, user_two_id)
    and not public.is_blocked_between(user_one_id, user_two_id)
  );

-- -----------------------------------------------------------------------------
-- direct_messages
-- -----------------------------------------------------------------------------
create table if not exists public.direct_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_direct_messages_conversation on public.direct_messages (conversation_id, created_at);

alter table public.direct_messages enable row level security;

drop policy if exists "direct_messages_select_participant" on public.direct_messages;
create policy "direct_messages_select_participant" on public.direct_messages
  for select to authenticated
  using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id and auth.uid() in (c.user_one_id, c.user_two_id)
    )
  );

drop policy if exists "direct_messages_insert_participant" on public.direct_messages;
create policy "direct_messages_insert_participant" on public.direct_messages
  for insert to authenticated
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and auth.uid() in (c.user_one_id, c.user_two_id)
        and not public.is_blocked_between(c.user_one_id, c.user_two_id)
    )
  );

drop policy if exists "direct_messages_update_recipient" on public.direct_messages;
create policy "direct_messages_update_recipient" on public.direct_messages
  for update to authenticated
  using (
    sender_id != auth.uid()
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_id and auth.uid() in (c.user_one_id, c.user_two_id)
    )
  )
  with check (
    sender_id != auth.uid()
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_id and auth.uid() in (c.user_one_id, c.user_two_id)
    )
  );

create or replace function public.touch_conversation_last_message()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.conversations set last_message_at = new.created_at where id = new.conversation_id;
  return new;
end;
$$;

drop trigger if exists trg_touch_conversation_last_message on public.direct_messages;
create trigger trg_touch_conversation_last_message
  after insert on public.direct_messages
  for each row execute function public.touch_conversation_last_message();
