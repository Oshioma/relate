-- =============================================================================
-- Relate — community email templates
--
-- A community's owner/admins can write their own versions of three emails:
--   invite_new       the invite sent to an address with no Relate account yet
--   invite_existing  the invite sent to someone who already uses Relate
--   welcome          sent to a member when they join (replaces the plain
--                    "You joined <community>" notification email)
--
-- No row for a kind means the built-in email in src/lib/email.ts is used, so
-- every other community carries on exactly as before. Placeholders such as
-- {First_Name}, {Host_Name}, {Host_Email} and {Community_Name} are filled in
-- when the email is sent (src/lib/email-templates.ts).
--
-- `enabled` matters for the welcome email: off means the member gets the plain
-- notification email instead. Silent imports disable the membership triggers,
-- so they never produce the notification that sends the welcome.
-- =============================================================================

create table if not exists public.community_email_templates (
  community_id uuid not null references public.communities (id) on delete cascade,
  kind text not null check (kind in ('invite_new', 'invite_existing', 'welcome')),
  enabled boolean not null default true,
  subject text not null default '',
  -- Rich text (HTML from RichEditor) above the button, and below it.
  body_html text not null default '',
  footer_html text not null default '',
  button_label text not null default '',
  -- Optional pictures: a logo at the top (null = the community's own logo)
  -- and a wide banner image under it.
  logo_url text,
  banner_url text,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null,
  primary key (community_id, kind)
);

alter table public.community_email_templates enable row level security;

drop policy if exists "community_email_templates_select_admin" on public.community_email_templates;
create policy "community_email_templates_select_admin" on public.community_email_templates
  for select to authenticated
  using (public.is_community_admin(community_id, auth.uid()));

drop policy if exists "community_email_templates_insert_admin" on public.community_email_templates;
create policy "community_email_templates_insert_admin" on public.community_email_templates
  for insert to authenticated
  with check (public.is_community_admin(community_id, auth.uid()));

drop policy if exists "community_email_templates_update_admin" on public.community_email_templates;
create policy "community_email_templates_update_admin" on public.community_email_templates
  for update to authenticated
  using (public.is_community_admin(community_id, auth.uid()))
  with check (public.is_community_admin(community_id, auth.uid()));

drop policy if exists "community_email_templates_delete_admin" on public.community_email_templates;
create policy "community_email_templates_delete_admin" on public.community_email_templates
  for delete to authenticated
  using (public.is_community_admin(community_id, auth.uid()));

drop trigger if exists set_updated_at on public.community_email_templates;
create trigger set_updated_at before update on public.community_email_templates
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Escape Space's own wording (Oshi, 2026-10-20). A no-op on any database
-- without that community; never overwrites wording an admin has since edited.
-- -----------------------------------------------------------------------------
insert into public.community_email_templates (community_id, kind, enabled, subject, body_html, footer_html, button_label)
select c.id, t.kind, true, t.subject, t.body_html, t.footer_html, t.button_label
from public.communities c
cross join (
  values
    (
      'invite_new',
      'Niko Dey has invited you to join Escape Space Community',
      '<p>Greetings {First_Name}</p>'
        || '<p>You were sent this free, exclusive invite to join the Escape Space Community.</p>'
        || '<p>The next session commences on Friday 23 October at 7:15AM GMT. Hope you can join us.</p>'
        || '<p>Namaste<br>Escape Space Community</p>'
        || '<p>Click here to accept your invitation:</p>',
      '<p>If you think you have received this invitation in error, please ignore this email.</p>',
      'Accept Invitation'
    ),
    (
      'invite_existing',
      'Niko Dey has added you to Escape Space Community on Relate',
      '<p>Hi {First_Name}</p>'
        || '<p>{Host_Name} has invited you to join Escape Space Community of Relate</p>'
        || '<p>Click here to accept your invitation:</p>',
      '<p>If you think you have received this invitation in error, please contact '
        || '<a href="mailto:oshiwillsortit@relate.click">oshiwillsortit@relate.click</a>.</p>',
      'Accept Invitation'
    ),
    (
      'welcome',
      'Welcome to Escape Space Community',
      '<p>Hey {First_Name},</p>'
        || '<p>Congratulations and welcome to Escape Space community.</p>'
        || '<p>Take a look around the different spaces. Be sure to check out the guidelines, complete profile and set '
        || 'notifications. When your all done, start posting and commenting or start a discussion.</p>'
        || '<p>Peace, light &amp; Divinity to you {First_Name}</p>'
        || '<p>Namaste.<br>Niko Dey</p>',
      '',
      'Go to community'
    )
) as t (kind, subject, body_html, footer_html, button_label)
where c.slug = 'escapespace'
on conflict (community_id, kind) do nothing;
