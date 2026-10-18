import { communityIconResponse } from "@/lib/community-icon";

// Per-community browser icon. Being an `icon` file in the [communitySlug]
// segment, this overrides the app-wide favicon (src/app/icon.tsx) for every
// page under a given community (including on its subdomain or custom domain,
// which the proxy rewrites onto this tree). The welcome page has its own copy
// of this route so the tab stays the same before and after signing in.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon({ params }: { params: Promise<{ communitySlug: string }> }) {
  const { communitySlug } = await params;
  return communityIconResponse(communitySlug);
}
