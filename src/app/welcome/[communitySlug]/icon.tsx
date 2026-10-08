import { communityIconResponse } from "@/lib/community-icon";

// The signed-out welcome page lives outside /c/[communitySlug], so without
// this it fell back to the app-wide favicon and the tab icon changed the
// moment a visitor signed in or out. Same icon as the community's own pages.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon({ params }: { params: Promise<{ communitySlug: string }> }) {
  const { communitySlug } = await params;
  return communityIconResponse(communitySlug);
}
