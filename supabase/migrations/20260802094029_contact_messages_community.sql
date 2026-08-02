-- Scope contact-form submissions to a community.
--
-- contact_messages started life platform-only (super-admin inbox). A message
-- left through a community's own contact page (/c/<slug>/contact) carries that
-- community's id here; a platform message (the marketing /contact page) leaves
-- it null. This lets a community's owner and admins read their own messages
-- without seeing anyone else's, while the super admin still sees everything.
alter table public.contact_messages
  add column if not exists community_id uuid references public.communities (id) on delete cascade;

create index if not exists idx_contact_messages_community
  on public.contact_messages (community_id, created_at desc);

-- A community's owner and admins may read the messages addressed to their
-- community. (The existing super-admin select policy is OR'd with this one, so
-- the super admin keeps full visibility.)
drop policy if exists "contact_messages_select_community_staff" on public.contact_messages;
create policy "contact_messages_select_community_staff" on public.contact_messages
  for select to authenticated
  using (
    community_id is not null and (
      exists (
        select 1 from public.communities c
        where c.id = contact_messages.community_id
          and c.owner_id = auth.uid()
      )
      or exists (
        select 1 from public.community_memberships m
        where m.community_id = contact_messages.community_id
          and m.user_id = auth.uid()
          and m.status = 'active'
          and m.role in ('owner', 'admin')
      )
    )
  );
