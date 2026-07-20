"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { deleteNavLink } from "./nav-links-actions";
import type { CommunityNavLink } from "@/types/database";

function NavLinkRow({ link, communitySlug }: { link: CommunityNavLink; communitySlug: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div className="flex items-center justify-between gap-3 px-5 py-3.5">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{link.label}</p>
        <p className="truncate text-xs text-muted-foreground">{link.url}</p>
      </div>
      <div>
        <button
          type="button"
          title="Remove link"
          disabled={isPending}
          onClick={() => {
            if (!window.confirm(`Remove "${link.label}" from the sidebar?`)) return;
            setError(null);
            startTransition(async () => {
              const result = await deleteNavLink(link.id, communitySlug);
              if (result?.error) {
                setError(result.error);
              } else {
                router.refresh();
              }
            });
          }}
          className="text-muted-foreground hover:text-danger disabled:opacity-60"
        >
          <X className="h-4 w-4" />
        </button>
        {error && <p className="mt-1 text-xs text-danger">{error}</p>}
      </div>
    </div>
  );
}

export function NavLinksList({ links, communitySlug }: { links: CommunityNavLink[]; communitySlug: string }) {
  if (links.length === 0) {
    return <p className="text-sm text-muted-foreground">No custom links yet.</p>;
  }

  return (
    <div className="divide-y divide-border rounded-lg border border-border bg-card">
      {links.map((link) => (
        <NavLinkRow key={link.id} link={link} communitySlug={communitySlug} />
      ))}
    </div>
  );
}
