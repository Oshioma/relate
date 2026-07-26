<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Database migrations

Migration files live in `supabase/migrations/` and are named
`<14-digit-timestamp>_<name>.sql`. Every timestamp prefix must be unique — the
CI job in `.github/workflows/check-migration-timestamps.yml` fails the PR if
two files share one.

**Never name a migration by hand.** Do not invent a timestamp (a round value
like `20260725210000` is what causes the collisions). Always create the file
with the helper, which derives a real, unique, monotonically-increasing
prefix:

```bash
scripts/new-migration.sh add_widget_table   # prints the created file's path
```

Then write your SQL into the file it prints. Because the helper bases the
prefix on the latest already-committed migration, parallel branches created the
same day no longer collide.
