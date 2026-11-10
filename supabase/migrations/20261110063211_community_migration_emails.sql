-- =============================================================================
-- Relate — "we've moved" emails and their activation links
--
-- Adds two more kinds of community email (Admin → Emails), for members brought
-- over from another platform (Escape Space's Circle import, 2026-10):
--   migration_inactive  "we've moved"; general access, the paid tier is theirs
--                       to subscribe to
--   migration_active    "we've moved"; the admin also gives them one or more
--                       tiers free, which the activation link switches on
--
-- Each one an admin sends gets a row in community_activations: a single-use
-- token for that member. Opening /invite/activate/<token> and pressing the
-- button signs them in (they were imported with no password), gives them the
-- free tiers listed on the row, and asks them to choose a password.
--
-- A free tier is an ordinary tier_subscriptions row with status 'active', no
-- Stripe ids and no period end, so has_active_tier_for_space() lets them in
-- with no other change.
--
-- Safe to re-run.
-- =============================================================================

-- --- Two more kinds of email ---------------------------------------------------
alter table public.community_email_templates
  drop constraint if exists community_email_templates_kind_check;
alter table public.community_email_templates
  add constraint community_email_templates_kind_check
  check (kind in ('invite_new', 'invite_existing', 'welcome', 'migration_inactive', 'migration_active'));

-- --- Activation links ------------------------------------------------------------
create table if not exists public.community_activations (
  id uuid primary key default gen_random_uuid(),
  token text not null unique,
  community_id uuid not null references public.communities (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('migration_inactive', 'migration_active')),
  -- Tiers this member gets free when they activate (empty for migration_inactive).
  free_tier_ids uuid[] not null default '{}',
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '60 days'),
  used_at timestamptz
);

create index if not exists community_activations_community_idx on public.community_activations (community_id, created_at desc);
create index if not exists community_activations_user_idx on public.community_activations (user_id);

alter table public.community_activations enable row level security;

-- Admins see who has been sent what, and whether they've activated. Rows are
-- written and used only by the server (service role), after it has checked
-- the sender is one of this community's admins.
drop policy if exists "community_activations_select_admin" on public.community_activations;
create policy "community_activations_select_admin" on public.community_activations
  for select to authenticated
  using (public.is_community_admin(community_id, auth.uid()));

-- -----------------------------------------------------------------------------
-- Escape Space's own wording (Oshi, 2026-11-10). A no-op on any database
-- without that community; never overwrites wording an admin has since edited.
-- -----------------------------------------------------------------------------
insert into public.community_email_templates (community_id, kind, enabled, subject, body_html, footer_html, button_label)
select c.id, t.kind, true, t.subject, t.body_html, t.footer_html, t.button_label
from public.communities c
cross join (
  values
    (
      'migration_inactive',
      'Escape Space Community',
      '<p>Greetings {First_Name}</p>'
        || '<p>There have been some changes to Escape Space Community. We have now moved to another platform provider '
        || 'which enables me to continue delivering daily meditations along with some new features with much more quality '
        || 'service and support. I want to take this opportunity to genuinely thank you for helping me by joining this '
        || 'community when I was new to hosting platforms.</p>'
        || '<p>You will remain a member with general access to the Escape Space Community platform. However, if you were '
        || 'not regularly showing up for the daily meditation sessions you will now have to subscribe for access to the '
        || 'Daily Meditation sessions at £10 pounds per month.</p>'
        || '<p>I hope to catch up with you soon on the new Escape Space community platform on Relate platform provider.</p>'
        || '<p>Namaste<br>Niko at Escape Space Community</p>'
        || '<p>Click here to activate your new membership:</p>',
      '<p>If you think you have received this invitation in error, please ignore this email.<br>'
        || '<a href="mailto:oshiwillsortit@relate.click">oshiwillsortit@relate.click</a>.</p>',
      'Activate new membership'
    ),
    (
      'migration_active',
      'Escape Space Community',
      '<p>Greetings {First_Name}</p>'
        || '<p>There have been some changes to Escape Space Community. We have now moved to another platform provider '
        || 'which enables me to continue delivering daily meditations along with some new features with much more quality '
        || 'service and support. I want to take this opportunity to genuinely thank you for helping me by joining this '
        || 'community when I was new to hosting platforms.</p>'
        || '<p>You will remain a member with full access to the Escape Space Community platform and because you showed up '
        || 'regularly and stuck it out, you may continue the daily meditations with me for free.</p>'
        || '<p>I hope to catch up with you soon on the new Escape Space community platform on Relate platform provider.</p>'
        || '<p>Namaste<br>Niko at Escape Space Community</p>'
        || '<p>Click here to activate your new membership:</p>',
      '<p>If you think you have received this invitation in error, please ignore this email.<br>'
        || '<a href="mailto:oshiwillsortit@relate.click">oshiwillsortit@relate.click</a>.</p>',
      'Activate new membership'
    )
) as t (kind, subject, body_html, footer_html, button_label)
where c.slug = 'escapespace'
on conflict (community_id, kind) do nothing;

-- The new-member invite's small print gains the contact address, as in Oshi's
-- wording — only while it still reads exactly as first seeded.
update public.community_email_templates t
set footer_html = '<p>If you think you have received this invitation in error, please ignore this email.<br>'
  || '<a href="mailto:oshiwillsortit@relate.click">oshiwillsortit@relate.click</a>.</p>'
from public.communities c
where c.id = t.community_id
  and c.slug = 'escapespace'
  and t.kind = 'invite_new'
  and t.footer_html = '<p>If you think you have received this invitation in error, please ignore this email.</p>';

-- The next session in the new-member invite (Oshi, 2026-11-10): the old date
-- had passed. Only touches the wording if it still names the old date.
update public.community_email_templates t
set body_html = replace(t.body_html, 'Friday 23 October', 'Friday 13 November')
from public.communities c
where c.id = t.community_id
  and c.slug = 'escapespace'
  and t.kind = 'invite_new'
  and t.body_html like '%Friday 23 October%';
