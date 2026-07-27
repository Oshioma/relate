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

**A new migration's timestamp must also be newer than every migration already
on `main`, not just unique** — the CI job fails a migration whose prefix is
`<=` the newest one on the base branch, because it would otherwise apply out of
order. This bites when other migrations land on `main` after you branch. The
fix is to rebase on the latest `main` and renumber: delete the stale file,
re-run `scripts/new-migration.sh <name>` (it now sees the newer base and picks
a higher prefix), and move your SQL into the file it prints.

# Branching and pull requests

**One branch per logically-separate change.** Give each new feature or fix its
own branch, cut fresh from the latest `main`, with a unique, descriptive name.
Don't reuse a single branch for unrelated pieces of work.

**Never stack new work on a branch whose PR is already merged.** A merged pull
request is finished — it cannot track new commits, and adding them silently
edits history that's already shipped. Before committing follow-up work, check
whether the current branch's PR has merged. If it has, start over: create a new
branch from the latest `main` (a new name — do not reuse the merged branch),
put the follow-up work there, and open a new PR for it.
