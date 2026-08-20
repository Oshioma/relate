-- =============================================================================
-- Replies to contact-form messages
--
-- The community inbox used to offer only a mailto: link, so the conversation
-- left the platform the moment staff answered and nothing was recorded. A reply
-- written in the inbox lands here: the durable record of what was said, shown
-- under its message so the next admin to open the inbox can see it's been
-- answered and how.
--
-- Like contact_messages, this table is written only by the trusted server
-- action through the service-role client (which enforces the staff check and
-- re-resolves the community), so there is deliberately NO insert/update/delete
-- policy — RLS denies direct client writes and the server path bypasses it.
-- =============================================================================

create table if not exists public.contact_message_replies (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.contact_messages (id) on delete cascade,
  -- Denormalised from the message so the read policy can gate on the community
  -- without joining back to contact_messages on every row.
  community_id uuid references public.communities (id) on delete cascade,
  -- The staff member who wrote it; kept as a record even if they later leave.
  author_id uuid references public.profiles (id) on delete set null,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_contact_message_replies_message
  on public.contact_message_replies (message_id, created_at);

alter table public.contact_message_replies enable row level security;

-- Same audience as the messages themselves: the community's owner and admins
-- read their own community's replies, and the platform super admin reads all.
-- (The sender isn't given a read here — their copy arrives as a notification or
-- an email, and a signed-out sender has no session to read with at all.)
drop policy if exists "contact_message_replies_select_staff" on public.contact_message_replies;
create policy "contact_message_replies_select_staff" on public.contact_message_replies
  for select to authenticated
  using (
    public.is_super_admin(auth.uid())
    or (
      community_id is not null and (
        exists (
          select 1 from public.communities c
          where c.id = contact_message_replies.community_id
            and c.owner_id = auth.uid()
        )
        or exists (
          select 1 from public.community_memberships m
          where m.community_id = contact_message_replies.community_id
            and m.user_id = auth.uid()
            and m.status = 'active'
            and m.role in ('owner', 'admin')
        )
      )
    )
  );
