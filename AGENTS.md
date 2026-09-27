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


# Timeline research image policy

These rules apply to AI-assisted timeline research, seed creation, and future research briefs.

## Prefer multiple useful images

Do not stop after finding one image for a timeline record. When useful material exists, add multiple non-duplicate images that help a reader inspect the subject from different angles: primary object/manuscript/site evidence first, then related evidence, comparative material, historical reproductions, reconstructions, portraits, maps, or other genuinely useful context.

Multiple crops or rescans of the same photograph are not multiple pieces of evidence. Mark duplicates with `duplicateOf` where applicable.

## Related images are allowed

An image does not have to depict the exact object named by the record to be useful. Related and contextual images are allowed when they materially help the reader understand the record. Never silently present them as direct evidence.

Use this order of preference:

1. exact primary object, manuscript, inscription, site, or other direct evidence;
2. closely related ancient/historical evidence illuminating the same deity, motif, period, text, claim, or archaeological setting;
3. contextual material such as maps, portraits, later engravings, reconstructions, comparison objects, or site photographs.

## UNVERIFIED images

If the exact image-to-object, image-to-claim, attribution, or identification cannot be verified, the image may still be used when it is relevant, but it MUST be visibly marked:

- begin the caption with `UNVERIFIED —`;
- set `identificationStatus: "unverified"`;
- state specifically what is unverified;
- state what the image actually shows;
- never word the caption as though the uncertain identification were established.

`UNVERIFIED` means "useful but not verified as the exact claimed evidence." It does not mean false.

Do not downgrade a securely identified image merely because it is contextual. A securely identified site photograph can remain `secure` when the site identification is secure; however, if the UI or record could reasonably make a reader think it is the exact unverified object being discussed, use the `UNVERIFIED` treatment above.

The goal is broad visual coverage with transparent provenance, not empty records caused by an exact-image-only rule and not misleading galleries caused by weak images being presented as primary evidence.
