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
  (see the `on_community_created` trigger).
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
    settings/                       Profile settings (avatar, name, username, bio)
    c/[communitySlug]/              Everything scoped to one community
      spaces/, spaces/[spaceSlug]/  Spaces + posts + comments
      events/, resources/, members/, admin/  Admin also handles logo/cover upload
  components/
    ui/                             Shared primitives (Button, Card, Avatar, ImageUpload, …)
    layout/                         Nav, sidebar links, mobile tab bar, logout
  lib/
    supabase/                       Browser/server/proxy Supabase clients
    data/                           Typed data-access functions per domain
  types/database.ts                 Hand-written types mirroring schema.sql
supabase/
  schema.sql                        Tables, enums, triggers, RLS policies
  seed.sql                          Starter communities, spaces, sample content
  storage.sql                       Storage buckets + RLS (avatars, community-assets)
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
