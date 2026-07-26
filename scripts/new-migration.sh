#!/usr/bin/env bash
#
# Create a new Supabase migration with a collision-free, monotonically
# increasing timestamp prefix.
#
# WHY THIS EXISTS
# Migration files are named <14-digit-timestamp>_<name>.sql and each prefix
# must be unique across the repo (Supabase records it as the version). When a
# migration is named by hand, it tends to get a round timestamp like
# 20260725210000, so two branches/sessions created the same day collide — and
# .github/workflows/check-migration-timestamps.yml then fails the PR of
# whichever merges second. This script never invents a time: it uses the real
# UTC clock, but bumps the prefix to one greater than the latest migration
# already committed if the clock is behind or equal. The result is always
# unique AND correctly ordered.
#
# USAGE
#   scripts/new-migration.sh add_widget_table
# Prints the path of the created (empty) migration file.

set -euo pipefail

name="${1:-}"
if [ -z "$name" ]; then
  echo "usage: scripts/new-migration.sh <snake_case_name>" >&2
  exit 1
fi

# Repo root, regardless of where the script is invoked from.
cd "$(dirname "$0")/.."
dir="supabase/migrations"
mkdir -p "$dir"

now="$(date -u +%Y%m%d%H%M%S)"

# Highest existing 14-digit prefix, or empty if there are no migrations yet.
latest="$(
  ls "$dir"/*.sql 2>/dev/null \
    | sed -E 's|.*/||; s/_.*//' \
    | grep -E '^[0-9]{14}$' \
    | sort \
    | tail -1 \
    || true
)"

ts="$now"
if [ -n "$latest" ] && [ "$latest" -ge "$ts" ]; then
  # Clock is behind (or equal to) the newest committed migration — bump by one
  # so the new version is strictly greater. The prefix only has to be a unique,
  # sortable integer, so overflowing seconds past 59 is harmless.
  ts="$((latest + 1))"
fi

# Normalise the name to snake_case: lowercase, spaces/dashes -> underscore,
# drop anything that isn't [a-z0-9_].
slug="$(echo "$name" | tr '[:upper:]' '[:lower:]' | tr ' -' '__' | tr -cd 'a-z0-9_')"
if [ -z "$slug" ]; then
  echo "error: name '$name' has no usable characters" >&2
  exit 1
fi

path="$dir/${ts}_${slug}.sql"
if [ -e "$path" ]; then
  echo "error: $path already exists" >&2
  exit 1
fi

touch "$path"
echo "$path"
