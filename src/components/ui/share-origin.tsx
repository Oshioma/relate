"use client";

import { createContext, useContext, type ReactNode } from "react";

// The origin shared links should use: a community's verified custom domain
// (e.g. https://mzunguzanzibar.com) when it has one, so a member browsing on
// the platform subdomain still hands out the community's own address. Null
// means "share the page's own URL as it is".
const ShareOriginContext = createContext<string | null>(null);

export function ShareOriginProvider({ origin, children }: { origin: string | null; children: ReactNode }) {
  return <ShareOriginContext.Provider value={origin}>{children}</ShareOriginContext.Provider>;
}

export function useShareOrigin(): string | null {
  return useContext(ShareOriginContext);
}
