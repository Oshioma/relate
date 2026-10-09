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
  // Mzungu Zanzibar: a solid palm on a sandbank, in the community's teal,
  // inside a teal ring on white.
  mzunguzanzibar: () => (
    <svg width="32" height="32" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="16" fill="#ffffff" />
      <circle cx="16" cy="16" r="14.9" fill="none" stroke="#0a7477" strokeWidth="2.2" />
      <path d="M13.8 26.5 C14 21 14.9 16.2 16.7 12.4 L20 13.5 C18.5 17.3 17.7 21.6 17.6 26.5 Z" fill="#0a7477" />
      <path d="M18.4 12.6 C15 8.4 10 8.2 6 11.4 C9.6 10.9 12.8 11.6 15.4 12.9 C11.6 13.6 8.8 16 7.6 19.6 C11 16.4 14.6 14.2 18.4 12.6 Z" fill="#0a7477" />
      <path d="M18.4 12.6 C19.8 8 23.8 5.8 27.6 6.8 C24.6 7.6 22.6 9.2 21.4 11 C24.6 10.6 27.4 12.6 28 16.6 C25.2 13.8 22 12.7 18.4 12.6 Z" fill="#0a7477" />
      <path d="M18.4 12.6 C18 8.6 15.6 5.6 11.8 4.6 C14.2 6.8 15.6 9.2 16.2 11.6 Z" fill="#0a7477" />
      <path d="M8 26.6 C11 25 21 25 24 26.6 Z" fill="#0a7477" />
      <path d="M7.4 26.4h17.2" stroke="#0a7477" strokeWidth="2.4" strokeLinecap="round" />
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
