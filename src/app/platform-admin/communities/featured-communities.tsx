"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { setCommunityFeatured } from "@/app/platform-admin/actions";
import { Badge } from "@/components/ui/badge";
import { SHOWCASE_COUNT } from "@/lib/homepage-showcase";

export type FeaturedCandidate = {
  id: string;
  name: string;
  slug: string;
  isPublic: boolean;
  featuredAt: string | null;
  memberCount: number;
};

// Which communities the marketing homepage shows. A super admin picks them
// here; the strip renders the most recently picked SHOWCASE_COUNT, and falls
// back to newest-public-first while nothing is picked at all.
//
// Only public communities can be picked: the strip is read by signed-out
// visitors, whose RLS never returns a private community, so a private pick
// would silently show nothing.
export function FeaturedCommunities({ communities }: { communities: FeaturedCandidate[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const featured = useMemo(
    () =>
      communities
        .filter((c) => c.featuredAt !== null)
        .sort((a, b) => (b.featuredAt ?? "").localeCompare(a.featuredAt ?? "")),
    [communities]
  );

  const candidates = useMemo(() => {
    const term = query.trim().toLowerCase();
    return communities
      .filter((c) => c.featuredAt === null && c.isPublic)
      .filter((c) => !term || c.name.toLowerCase().includes(term) || c.slug.toLowerCase().includes(term))
      .sort((a, b) => b.memberCount - a.memberCount);
  }, [communities, query]);

  function set(communityId: string, next: boolean) {
    setError(null);
    startTransition(async () => {
      const result = await setCommunityFeatured(communityId, next);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <section className="mb-8 rounded-lg border border-border p-4">
      <div className="flex items-center gap-2">
        <Star className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-sm font-medium text-foreground">Featured on relate.click</h2>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        The homepage showcase strip shows these, most recently added first — up to {SHOWCASE_COUNT} of them. Feature a
        community again to move it back to the front. While nothing is picked, the strip falls back to the newest public
        communities.
      </p>

      {error && <p className="mt-3 text-sm text-danger">{error}</p>}

      {featured.length === 0 ? (
        <p className="mt-4 rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
          Nothing picked yet — the homepage is choosing for itself.
        </p>
      ) : (
        <ol className="mt-4 divide-y divide-border border-y border-border">
          {featured.map((community, index) => (
            <li key={community.id} className="flex items-center gap-3 py-2.5">
              <span className="w-5 shrink-0 text-xs tabular-nums text-muted-foreground">{index + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{community.name}</p>
                <p className="truncate text-xs text-muted-foreground">/c/{community.slug}</p>
              </div>
              {index >= SHOWCASE_COUNT && <Badge tone="neutral">Below the strip</Badge>}
              {!community.isPublic && <Badge tone="danger">Now private — hidden</Badge>}
              <button
                type="button"
                onClick={() => set(community.id, false)}
                disabled={pending}
                className="shrink-0 text-xs text-accent underline disabled:opacity-50"
              >
                Remove
              </button>
            </li>
          ))}
        </ol>
      )}

      <div className="mt-4">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search public communities to feature…"
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
        />
        {candidates.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            {query.trim() ? "No public community matches that." : "Every public community is already featured."}
          </p>
        ) : (
          <ul className="mt-3 max-h-64 divide-y divide-border overflow-y-auto border-t border-border">
            {candidates.map((community) => (
              <li key={community.id} className="flex items-center gap-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{community.name}</p>
                  <p className="truncate text-xs text-muted-foreground">/c/{community.slug}</p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {community.memberCount} {community.memberCount === 1 ? "member" : "members"}
                </span>
                <button
                  type="button"
                  onClick={() => set(community.id, true)}
                  disabled={pending}
                  className="shrink-0 rounded-md border border-border px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted disabled:opacity-50"
                >
                  Feature
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
