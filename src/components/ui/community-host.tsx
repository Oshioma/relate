"use client";

import { createContext, useContext, type ReactNode } from "react";

// The community whose own host (subdomain or custom domain) this page is being
// served on, or null on the platform host. Link (./link.tsx) reads it to write
// this community's /c/<slug>/… links as the clean paths that host serves.
const CommunityHostContext = createContext<string | null>(null);

export function CommunityHostProvider({ slug, children }: { slug: string | null; children: ReactNode }) {
  return <CommunityHostContext.Provider value={slug}>{children}</CommunityHostContext.Provider>;
}

export function useCommunityHostSlug(): string | null {
  return useContext(CommunityHostContext);
}
