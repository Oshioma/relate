# Relate

A multi-tenant community platform — one app, many communities. Each
community has its own spaces, members, posts, events, and resources.
Built with Next.js (App Router), Tailwind CSS, and Supabase (Auth +
Postgres + Storage).

## Stack

- **Next.js 16** (App Router, Turbopack)
- **Tailwind CSS v4**
- **Supabase** — Postgres + Auth (`@supabase/ssr`, `@supabase/supabase-js`)
- **Vercel** for deployment

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project (this
   should be a **new, separate project** — not shared with any other app).
2. In **Project Settings → API**, copy the **Project URL** and the
   **anon public key**.

## 2. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in the two values from
step 1:

```bash
cp .env.local.example .env.local
```

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

When you deploy to Vercel, add the same variables in **Project Settings →
Environment Variables**, setting `NEXT_PUBLIC_SITE_URL` to your production
URL.

## 3. Apply the database schema

Open the Supabase SQL editor for your project and run, in order:

1. `supabase/schema.sql` — tables, enums, triggers, and Row Level Security
   policies for every table (`profiles`, `communities`,
   `community_memberships`, `spaces`, `posts`, `comments`, `events`,
   `resources`).
2. Sign up for an account in the running app (see step 4) — this creates
   your `auth.users` row and, via trigger, your `profiles` row.
3. Open `supabase/seed.sql`, replace the placeholder email
   (`you@example.com`) with the address you just signed up with, and run
   it. This creates the three starter communities (Kushukuru, Zanzibar,
   Farming) with you as owner, plus example spaces, a welcome post, an
   event, and a resource in each.

Both SQL files are safe to re-run.

## Storage (avatars, community logos & covers)

Run `supabase/storage.sql` in the SQL editor too. It creates two public
buckets and locks writes down by path, reusing the same RLS approach as
the rest of the schema:

- `avatars` — one image per user at `<user_id>/avatar.<ext>`. A user can
  only write to their own folder (checked via `auth.uid()`).
- `community-assets` — logos and covers at `<community_id>/logo.<ext>` and
  `<community_id>/cover.<ext>`. Only that community's owner/admin can
  write (checked via the same `is_community_admin()` helper used
  elsewhere).

Both buckets are public for reads, so `<img>` tags load straight from the
Storage CDN URL with no signed-URL step. Uploads happen directly from the
browser to Supabase Storage (see `src/components/ui/image-upload.tsx`),
not through a Vercel serverless function, so there's no request-body size
limit to worry about beyond the bucket's own `file_size_limit` (8MB).

Profile avatars are managed at `/settings`; community logo/cover images
are managed from a community's `/admin` page (owners/admins only).

## Invitations

Run `supabase/invites.sql` too. An owner/admin generates a shareable
link from a community's `/admin` page (optionally capping it to N uses
and/or an expiry, and choosing whether it grants `member` or
`moderator`), and copies the link out to share however they like (DM,
group chat, email themselves, etc) — no email-sending required for this
path.

Anyone who opens `/invite/<code>`:

- while **signed in** is added to the community immediately and
  redirected there.
- while **signed out** sees a "You're invited to &lt;community&gt;" preview
  with sign-in/sign-up buttons; both carry the invite link forward as a
  `next` param (including through email confirmation) so they land back
  on the invite and get redeemed automatically once authenticated.

The `community_invites` table itself is only readable by that
community's admins via RLS — the preview and redemption logic instead
run through two `SECURITY DEFINER` functions
(`get_invite_preview`/`redeem_invite`) so a not-yet-a-member visitor can
validate and redeem a code without needing broader table access.

### Email invites

Run `supabase/email-invites.sql` too (adds an `email` column to
`community_invites`). This is a second, optional invite path — from the
same `/admin` page, an owner/admin can type an email address and Relate
sends an actual invite email via Supabase Auth's admin API
(`auth.admin.inviteUserByEmail`), pre-scoped to one use.

This path needs a secret the other invite features don't:

1. In your Supabase project, go to **Project Settings → API → Project
   API keys** and copy the **`service_role`** key (not the `anon` key).
2. Set it as `SUPABASE_SERVICE_ROLE_KEY` — locally in `.env.local`, and
   in Vercel's Project → Environment Variables for production. **Never**
   prefix it with `NEXT_PUBLIC_` and never commit a real value — it
   bypasses Row Level Security entirely. It's only ever read server-side,
   from `src/lib/supabase/admin.ts`, and only after the caller has
   already been authorized by a normal RLS-protected insert (see
   `sendEmailInvite` in `src/app/c/[communitySlug]/admin/invites-actions.ts`).
3. The email itself uses Supabase's built-in "Invite user" template —
   customize it under **Authentication → Email Templates** if you want
   different branding/copy. On Supabase's default shared email service
   there are low hourly sending limits; for real usage, configure a
   custom SMTP provider under **Project Settings → Auth → SMTP Settings**.

If the target email already has an account, `inviteUserByEmail` fails
(Supabase won't re-invite an existing user) — the invite link is still
created either way, so you can copy it from the list and share it
directly as a fallback.

## Notifications

Run `supabase/notifications.sql` too. Delivery is in-app only (a bell
icon with an unread count, refreshed on page load/navigation — not real
time, no email). The `notifications` table has no `INSERT` policy at
all, so nothing client-side can write into someone else's list — rows
are only ever created by `SECURITY DEFINER` trigger functions, fired on:

- a comment on a post you authored
- a new post (discussion, announcement, or resource) in any space you
  can currently view, from anyone else in that community
- you being added to a community (skips the owner row created alongside
  a brand new community — you know you just made it)
- your role in a community changing

Open the bell (`/notifications`) and everything currently unread is
marked read as you view it.

## Event RSVPs

Run `supabase/event-rsvps.sql` too. Attending is just row presence in
`event_rsvps` — RSVPing inserts a row, canceling deletes it (no separate
going/interested/declined states). Any active member can RSVP to an
event in their community; the events page shows an attendee avatar
stack + count per event, and a toggle button on upcoming events (past
events show who attended but drop the button).

## Space types

Run `supabase/space-types.sql` too. Adds a `space_type` column to
`spaces` (Discussion, Journal, Gallery, Resources, Directory,
Challenges, Growth Journey, Q&A, Custom), chosen when a space is
created and editable afterward from Admin. Every type still renders
the plain discussion feed today except **Resources** and **Journal**
(below) — the rest are real, admin-choosable categories with their
own icon, and get dedicated behavior (member Directory search, a
Growth Journey timeline, Challenges) in follow-up rounds.

The Admin page's Spaces section is now a real builder: rename,
change type/visibility, duplicate, delete, drag to reorder, or hide
from navigation.

## Journal spaces

Run `supabase/space-journal.sql` too, after `space-types.sql` and
`community-custom-fields.sql` (it reuses that migration's
`profile_field_type` enum). A `journal`-type space no longer shows the
posts feed: from Admin (expand a Journal space in the Spaces list),
owners/admins define the fields every entry should ask for — same
field types as custom profile fields (text, long text, number, date,
dropdown, multi-select, checkbox, URL), reorderable and deletable.
Members then log entries against those fields on the space's own
page; each entry stores its answers as jsonb keyed by field id
(`space_journal_entries.data`) so renaming a field doesn't orphan
past entries. Entries are visible to anyone who can see the space
(same `can_view_space` rule as posts); editing/deleting an entry is
limited to its author or community staff.

## Member Directory (in progress)

This has been built in stages — **Stages 1 through 7** are all in
place (schema/RLS, settings UI, community admin custom fields, the
enhanced member profile page, the Member Directory itself, 1:1
messaging, and contribution-score triggers). Run these six files, in
this order, after `supabase/schema.sql`:

1. `supabase/member-profile-extensions.sql` — adds professional fields
   (profession, company, website, social links) and privacy switches
   (`hide_profile`, `hide_online_status`, `hide_communities`,
   `hide_social_links`, `hide_business_profile`, `is_discoverable`) to
   `profiles`; adds `business_profiles` (one optional business profile per
   user), `member_interests`, `member_skills`, `member_help_requests`
   ("needs help with" / "available to help with", distinguished by
   `kind`), and `member_locations` (opt-in, approximate only — city/
   region/country text, never a precise address or geocoding).
2. `supabase/community-custom-fields.sql` — lets a community owner/admin
   define unlimited custom profile fields scoped to their community
   (`community_profile_fields`: text/textarea/number/date/dropdown/
   multiselect/checkbox/url) and stores each member's answers
   (`community_profile_values`).
3. `supabase/member-contribution.sql` — `member_contribution_scores` is
   an append-only points ledger; a trigger keeps a fast-sortable running
   total in `profiles.contribution_score`. Nothing awards points yet —
   that's wired up once the directory that displays the score exists.
4. `supabase/direct-messages.sql` — simple 1:1 `conversations` +
   `direct_messages` (no group chat), plus `member_blocks` (also used to
   stop blocked members from messaging each other).
5. `supabase/member-connections.sql` — depends on `direct-messages.sql`
   (uses its `is_blocked_between()` helper). LinkedIn-style connection
   requests; schema + RLS only, no UI yet — explicitly future-ready per
   the spec this was built against.
6. `supabase/contribution-triggers.sql` — depends on
   `member-contribution.sql`. Awards real points for creating a post,
   leaving a comment, sharing a resource, hosting an event, and
   RSVPing to one — see the Stage 7 section below for details.

A key privacy design decision worth knowing: `hide_profile` doesn't
block the existing `profiles_select_authenticated` policy outright
(that would break showing post/comment authors and member lists across
the app) — instead, a `shares_active_community()` helper lets anyone who
already shares an active community membership with you still see your
profile, while non-community strangers can't, once `hide_profile` is
set.

**Stage 2** adds a settings UI for everything Stage 1's schema
introduced:

- `/settings` — professional info (profession, company, website, social
  links), tag editors for interests/skills/needs-help-with/can-help-with
  (backed by `member_interests`/`member_skills`/`member_help_requests`),
  an approximate-location opt-in form (`member_locations`), and privacy
  toggles for every `hide_*`/`is_discoverable` column on `profiles`.
- `/settings/business` — create, edit, or remove your one optional
  `business_profiles` row: logo (reuses the `avatars` storage bucket),
  description, website, industry, location, comma-separated services/
  products, and contact/social links.
- `/settings/blocked` — lists everyone you've blocked with an unblock
  action. Blocking itself is available to any member from a community's
  members page (not just admins) via a new "block" icon next to each
  other member, calling straight into `member_blocks`.

**Stage 3** adds the community admin UI for custom profile fields, on
the community's `/admin` page under "Custom profile fields":

- Owners/admins can define unlimited fields scoped to their community
  (label, type — text/textarea/number/date/dropdown/multiselect/
  checkbox/url — options for dropdown/multiselect, required toggle),
  reorder them, and delete them. RLS (`is_community_admin`) is the only
  enforcement — the server actions don't duplicate the admin check.
- Members filling in answers to these fields, and displaying them on a
  member's profile, comes with Stage 4's enhanced profile page —
  fields without a UI to answer them yet is expected at this stage.

**Stage 4** adds the enhanced member profile page, at
`/c/[communitySlug]/members/[username]` (linked from each row on the
members list):

- Header: avatar, name, username, profession/company, approximate
  location (only if `is_visible`), bio, contribution score (just the
  number — never a "level"), online status, website, and social links.
- Interests, skills, needs-help-with, and can-help-with, read from
  Stage 1's tag tables.
- That community's custom profile fields (Stage 3): if it's your own
  profile, an editable form (backed by a new `saveProfileFieldValues`
  action that re-fetches the field definitions server-side rather than
  trusting the client); otherwise a read-only view that skips any
  field the member hasn't answered.
- Business profile summary, communities in common, recent activity
  (posts/comments in this community), resources shared, and events
  hosted/attended — each scoped to the current community.
- Every `hide_*` privacy toggle from Stage 2 gates its corresponding
  section for other viewers (never for your own profile): social
  links, online status, business profile, and communities. The
  underlying `profiles` row visibility itself is still governed by
  `hide_profile` + `shares_active_community()` from Stage 1 — a
  profile that isn't visible to you at all 404s before any of this
  renders.

**Stage 5** turns the community's `/members` page into the Member
Directory itself:

- **Discovery sections** (each a horizontal row of cards, hidden
  entirely when empty): Recommended for you (shared interests/skills/
  profession, scored and ranked), New members, Members near you (only
  when *you* have an approximate location set and visible — matches
  others in the same country), Recently active, Top contributors
  (sorted by `contribution_score` — still just a number, never a
  "level"), and Businesses.
- **Searchable, filterable, sortable roster** below the discovery
  sections: instant client-side search across name/username/bio/
  profession/company/interests/skills/needs-help/can-help, a role
  filter, and a sort dropdown (recently active / top contributors /
  newest / name).
- `is_discoverable` (Stage 2) governs the **discovery sections only** —
  a member who opts out disappears from all six of them. It does
  *not* remove them from the plain searchable roster below: that list
  doubles as the admin member-management view (role changes, removal,
  blocking), and hiding a member from it would break moderation, not
  just discovery. This is a deliberate scope decision, not an
  oversight.
- New `src/lib/data/member-directory.ts`: `getDirectoryMembers` batch-
  fetches each member's interests/skills/help-topics/location/business
  profile alongside their membership row (a handful of `.in(...)`
  queries, not N+1), plus the pure ranking/filtering functions behind
  each section and the search match.

**Stage 6** adds simple 1:1 direct messaging on top of Stage 1's
`conversations`/`direct_messages`/`member_blocks` schema:

- `/messages` — conversation list, most recent first, with an unread
  count badge per conversation.
- `/messages/[conversationId]` — the thread: messages bubble by
  sender, a composer at the bottom, and unread messages from the other
  participant are marked read server-side on render (same
  mark-as-read-on-view pattern as `/notifications`).
- A **Message** button on the enhanced member profile page (Stage 4)
  calls a new `startConversation` action that finds or creates the
  canonical `conversations` row for the two participants
  (`user_one_id < user_two_id`, enforced by both the DB check
  constraint and the action). If the two members have blocked each
  other, RLS rejects the insert and the button surfaces that as an
  error instead of a silent failure.
- No group chat, no read receipts beyond the unread badge, and no
  attachments yet — the schema was built future-ready for attachments
  but this stage only sends plain text. No realtime: sending or
  reading a message calls a server action and then `router.refresh()`,
  the same pattern used everywhere else in this app; a websocket/
  Realtime-subscription upgrade is a possible future enhancement, not
  part of this stage.
- A `MessagesNavLink`/`MessagesIconLink` pair (mirroring the existing
  notification bell) shows an unread-DM badge in both the dashboard and
  community sidebars.

**Stage 7** wires real point-earning events into the contribution score
ledger built in Stage 1c. Run `supabase/contribution-triggers.sql`
after `member-contribution.sql` — it adds `SECURITY DEFINER` triggers
so that creating a post (+5), leaving a comment (+2), sharing a
resource (+5), hosting an event (+5), or RSVPing to one (+2) each
insert a row into `member_contribution_scores`, which the existing
Stage 1c trigger folds into `profiles.contribution_score`. No app code
changes needed — every page that already reads `contribution_score`
(the member profile page, Top Contributors) picks these up
automatically. Deliberately append-only: deleting the underlying post/
comment/resource/event/RSVP does not claw back points, consistent with
the ledger's own append-only design. Reactions and accepted-answers
are still future scoring sources per the original spec — this app has
no reactions/likes feature yet to hang a trigger off of.

### Email confirmation redirect (if enabled)

New Supabase projects require email confirmation by default. In
**Authentication → URL Configuration**, set:

- **Site URL**: your app's URL (e.g. `http://localhost:3000` in
  development, your Vercel URL in production)
- **Redirect URLs**: add `<site-url>/auth/confirm` (and your production
  equivalent)

The confirmation email links to `/auth/confirm`, which exchanges the
token for a session and redirects into the app.

## 4. Run the app

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`, sign up, then follow step 3 above to seed
the starter communities.

## Multi-tenant design

Every piece of community content (`spaces`, `posts`, `comments`, `events`,
`resources`) is scoped to a `community_id` (directly or via a join), and
every table has Row Level Security enabled. Access is enforced in Postgres
— not just in the UI — via a handful of `SECURITY DEFINER` helper
functions (`is_community_member`, `is_community_admin`,
`is_community_staff`, `can_view_space`, …) used inside the RLS policies.
This means:

- Anyone can create a community and becomes its `owner` automatically
  (see the `on_community_created` trigger) — try it at `/communities/new`.
- Membership `role` (`owner` / `admin` / `moderator` / `member`) and
  `status` (`active` / `invited` / `banned`) gate what a user can do
  inside a given community.
- A space's `visibility` (`public` / `members` / `private`) controls who
  can see its posts and resources.

This is the foundation for eventually letting other people create and
sell their own communities on the same platform, without any schema
changes.

## Project structure

```
src/
  app/
    page.tsx                        Logged-out landing page
    login/, signup/                 Auth pages (Supabase email/password)
    auth/                           Server actions + email confirmation route
    dashboard/                      Logged-in home: your communities + discovery
    settings/                       Profile settings: identity, professional info, social
                                     links, interests/skills/help topics, location opt-in,
                                     privacy toggles
    settings/business/              Optional business profile (create/edit/remove)
    settings/blocked/               Blocked members list + unblock
    communities/new/                Create a community (you become its owner)
    invite/[code]/                  Invite link preview + auto-redemption
    notifications/                  In-app notifications list
    messages/                       Conversation list; messages/[conversationId]/ is the thread
    c/[communitySlug]/              Everything scoped to one community
      spaces/, spaces/[spaceSlug]/  Spaces + posts + comments
      events/, resources/, admin/     Admin also handles branding, invites,
                                       and custom profile fields
      members/                       Member Directory: search/filter/sort + discovery
                                      sections (new/recommended/near you/active/top/business)
      members/[username]/            Enhanced member profile page
  components/
    ui/                             Shared primitives (Button, Card, Avatar, ImageUpload, …)
    layout/                         Nav, sidebar links, mobile tab bar, logout, notification +
                                     message unread bells
  lib/
    supabase/                       Browser/server/proxy/admin (service-role) Supabase clients
    data/                           Typed data-access functions per domain
  types/database.ts                 Hand-written types mirroring schema.sql
supabase/
  schema.sql                        Tables, enums, triggers, RLS policies
  seed.sql                          Starter communities, spaces, sample content
  storage.sql                       Storage buckets + RLS (avatars, community-assets)
  invites.sql                       Invite links table, RLS, and redemption functions
  email-invites.sql                 Adds the `email` column used by email invites
  notifications.sql                 Notifications table, RLS, and trigger functions
  event-rsvps.sql                   Event RSVPs table + RLS
  space-types.sql                   Adds space_type to spaces (Space Builder)
  space-journal.sql                 Journal fields + entries for journal-type spaces
  member-profile-extensions.sql     Profile fields/privacy, business profiles, interests,
                                     skills, help requests, locations (Member Directory Stage 1)
  community-custom-fields.sql       Per-community custom profile fields + values
  member-contribution.sql           Contribution score ledger + running-total trigger
  direct-messages.sql               1:1 messaging + blocking
  member-connections.sql            Connection requests (future-ready, no UI yet)
  contribution-triggers.sql         Awards real contribution-score points
```

## Notes on Next.js 16

This project was generated on Next.js 16, which renamed `middleware.ts` to
`proxy.ts` (see `src/proxy.ts`) and made `cookies()`, `headers()`,
`params`, and `searchParams` asynchronous everywhere. Keep that in mind
when adding new dynamic routes or reading cookies in a Server Component.

## Deployment

Push to GitHub and import the repo in Vercel. Add the environment
variables from step 2, then deploy — no other configuration is required.
Supabase Storage (for avatar/logo uploads) is intentionally not wired up
yet; it's a natural next milestone once the MVP is validated.
