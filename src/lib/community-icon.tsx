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
  // Mzungu Zanzibar: a solid, broad-leaved palm on a sandbank, in the community's teal,
  // inside a teal ring on white.
  mzunguzanzibar: () => (
    <svg width="32" height="32" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="16" fill="#ffffff" />
      <circle cx="16" cy="16" r="14.9" fill="none" stroke="#0a7477" strokeWidth="2.2" />
      <path d="M13.6 26.5 C13.8 21 14.7 16.4 16.4 12.6 L20.2 13.8 C18.7 17.5 17.9 21.6 17.8 26.5 Z" fill="#0a7477" />
      <path d="M18.4 12.4 C15.6 6.6 9.4 6.2 5.2 10.4 C6.6 12.2 9 13.2 11.6 13 C9 14.6 7.2 17.4 7 20.8 C11.4 19.4 15.4 16.4 18.4 12.4 Z" fill="#0a7477" />
      <path d="M18.4 12.4 C20.4 6.4 26.2 4.8 29.4 7.8 C28.2 9.8 26.2 11 23.8 11.2 C26.4 12.6 28.2 15.4 28.2 18.8 C24 18 20.6 15.6 18.4 12.4 Z" fill="#0a7477" />
      <path d="M18.4 12.4 C18.6 7.6 16.2 4.2 11.6 3.6 C11.4 6.4 12.6 9 14.6 10.6 Z" fill="#0a7477" />
      <path d="M7.6 26.6 C10.6 24.6 21.4 24.6 24.4 26.6 Z" fill="#0a7477" />
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
