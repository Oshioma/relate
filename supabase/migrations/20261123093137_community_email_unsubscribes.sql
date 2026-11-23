-- =============================================================================
-- Relate — "Unsubscribe" from a community's emails
--
-- Gmail and Yahoo expect bulk-style mail (onboarding, invites, welcome, "we've
-- moved") to carry a one-click List-Unsubscribe header, and mark mail without
-- one down as likely spam. Pressing it (in the inbox or on the link at the
-- foot of the email) adds a row here, and src/lib/email.ts skips any later
-- community email to that address. Keyed by lower-cased address because many
-- invitees have no account yet. Notification emails reuse
-- notification_email_preferences instead.
--
-- No policies: only the server (service role) reads or writes it. Safe to
-- re-run.
-- =============================================================================

create table if not exists public.community_email_unsubscribes (
  community_id uuid not null references public.communities (id) on delete cascade,
  email text not null check (email = lower(email)),
  created_at timestamptz not null default now(),
  primary key (community_id, email)
);

alter table public.community_email_unsubscribes enable row level security;
