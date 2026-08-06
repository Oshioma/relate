-- =============================================================================
-- Contact-form submissions
--
-- The public /contact form both emails the support inbox and lands a row here,
-- so a Resend outage never silently drops a message and the super admin has a
-- durable record. Writes happen only from the server action via the
-- service-role client (after honeypot + rate-limit checks), so there is NO
-- insert policy for anon/authenticated — RLS denies direct client inserts by
-- default and the trusted server path bypasses RLS.
-- =============================================================================

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  -- The signed-in user who sent it, when there was one — the form is open to
  -- logged-out visitors too, so this is nullable.
  user_id uuid references public.profiles (id) on delete set null,
  name text not null,
  email text not null,
  message text not null,
  -- Lightweight triage flag for the super admin's inbox view.
  handled boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_contact_messages_created_at
  on public.contact_messages (created_at desc);

alter table public.contact_messages enable row level security;

-- Only a platform super admin may read submissions. There is deliberately no
-- insert/update/delete policy: the server action writes with the service-role
-- client, and no browser client should touch this table directly.
drop policy if exists "contact_messages_select_super_admin" on public.contact_messages;
create policy "contact_messages_select_super_admin" on public.contact_messages
  for select to authenticated
  using (public.is_super_admin(auth.uid()));
