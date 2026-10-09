import { ImageResponse } from "next/og";
import type { ReactElement } from "react";
import { createClient } from "@/lib/supabase/server";
import { getCommunityBySlug } from "@/lib/data/community";

export const COMMUNITY_ICON_SIZE = { width: 32, height: 32 };

// A drawn mark for communities whose logo doesn't survive being shrunk to a
// browser tab — a wordmark at 32px is a smudge. Keyed by slug, alongside the
// bespoke landing pages (src/app/welcome/[communitySlug]/page.tsx).
const BESPOKE_ICONS: Record<string, () => ReactElement> = {
  // Nature's Gardeners: a tree in the logo's green.
  naturesgardeners: () => (
    <svg width="32" height="32" viewBox="0 0 32 32">
      <path d="M14 19h4v11a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1z" fill="#7a4e2d" />
      <circle cx="16" cy="10" r="8.5" fill="#3c5e19" />
      <circle cx="8.5" cy="16" r="6.5" fill="#3c5e19" />
      <circle cx="23.5" cy="16" r="6.5" fill="#3c5e19" />
      <circle cx="16" cy="18" r="6.5" fill="#3c5e19" />
      <circle cx="13" cy="8" r="2.6" fill="#4f7a22" />
    </svg>
  ),
  // Mzungu Zanzibar: a palm on a sandbank, on a tile of the community's teal.
  mzunguzanzibar: () => (
    <svg width="32" height="32" viewBox="0 0 32 32">
      <rect width="32" height="32" rx="7" fill="#0a7477" />
      <ellipse cx="16" cy="29.5" rx="12" ry="4" fill="#f2d49b" />
      <path d="M15.2 27 C15.6 21 16.6 15.5 18.6 11.2 L20.2 11.8 C18.6 16 17.8 21.2 17.6 27 Z" fill="#8a5a2b" />
      <path d="M19.4 11.5 C15.5 7.5 10 8 6.5 11 C11 10 15 10.8 19.4 11.5 Z" fill="#7fd36b" />
      <path d="M19.4 11.5 C14 11.5 9.5 14.5 8 18.5 C11.5 15.2 15.5 13 19.4 11.5 Z" fill="#7fd36b" />
      <path d="M19.4 11.5 C21 6.8 25.5 4.8 29 6 C24.8 6.8 21.8 8.8 19.4 11.5 Z" fill="#7fd36b" />
      <path d="M19.4 11.5 C24.5 9.8 28.5 12 29.5 16.5 C26.5 13.8 23.2 12.3 19.4 11.5 Z" fill="#7fd36b" />
      <path d="M19.4 11.5 C18.5 7 15.8 4 12 3.2 C15.2 5.5 17.6 8.2 19.4 11.5 Z" fill="#7fd36b" />
      <circle cx="18.6" cy="12.6" r="1.1" fill="#5a3a1c" />
      <circle cx="20.3" cy="12.9" r="1.1" fill="#5a3a1c" />
    </svg>
  ),
};

function frame(child: ReactElement, fontSize?: number) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...(fontSize && { fontSize }),
        }}
      >
        {child}
      </div>
    ),
    { ...COMMUNITY_ICON_SIZE }
  );
}

// The browser-tab icon for anything under a community — its feed and its
// signed-out welcome page alike, so the tab doesn't change as a visitor signs
// in. A bespoke mark wins; then the owner's uploaded logo, contained so a
// non-square logo isn't distorted; and with neither (or a private community a
// guest can't resolve) the same 🙏🏼 as the app-wide default, so the tab is
// never blank.
export async function communityIconResponse(communitySlug: string) {
  const bespoke = BESPOKE_ICONS[communitySlug];
  if (bespoke) return frame(bespoke());

  const supabase = await createClient();
  const community = await getCommunityBySlug(supabase, communitySlug);
  const logoUrl = community?.logo_url ?? null;
  if (!logoUrl) return frame(<span>🙏🏼</span>, 28);

  return frame(
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logoUrl}
      alt=""
      width={COMMUNITY_ICON_SIZE.width}
      height={COMMUNITY_ICON_SIZE.height}
      style={{ width: "100%", height: "100%", objectFit: "contain" }}
    />
  );
}
