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
      <path d="M13.7 26.5 C13.9 21 14.8 16.3 16.55 12.5 L20.1 13.65 C18.6 17.4 17.8 21.6 17.7 26.5 Z" fill="#0a7477" />
      <path d="M18.4 12.5 C15.3 7.5 9.7 7.2 5.6 10.9 C8.1 11.55 10.9 12.4 13.5 12.95 C10.3 14.1 8 16.7 7.3 20.2 C11.2 17.9 15 15.3 18.4 12.5 Z" fill="#0a7477" />
      <path d="M18.4 12.5 C20.1 7.2 25 5.3 28.5 7.3 C26.4 8.7 24.4 10.1 22.6 11.1 C25.5 11.6 27.8 14 28.1 17.7 C24.6 15.9 21.3 14.15 18.4 12.5 Z" fill="#0a7477" />
      <path d="M18.4 12.5 C18.3 8.1 15.9 4.9 11.7 4.1 C12.8 6.6 14.1 9.1 15.4 11.1 Z" fill="#0a7477" />
      <path d="M7.8 26.6 C10.8 24.8 21.2 24.8 24.2 26.6 Z" fill="#0a7477" />
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
