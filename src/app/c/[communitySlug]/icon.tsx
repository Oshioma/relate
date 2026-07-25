import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase/server";
import { getCommunityBySlug } from "@/lib/data/community";

// Per-community browser icon. Being an `icon` file in the [communitySlug]
// segment, this overrides the app-wide favicon (src/app/icon.tsx) for every
// page under a given community — so an owner's uploaded logo becomes the tab
// icon while a visitor is inside that community (including on its subdomain or
// custom domain, which the proxy rewrites onto this tree).
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon({
  params,
}: {
  params: Promise<{ communitySlug: string }>;
}) {
  const { communitySlug } = await params;
  const supabase = await createClient();
  const community = await getCommunityBySlug(supabase, communitySlug);
  const logoUrl = community?.logo_url ?? null;

  // No logo (or a private community a guest can't resolve) falls back to the
  // same 🙏🏼 mark as the app-wide default, so the tab is never left blank.
  if (!logoUrl) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 28,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          🙏🏼
        </div>
      ),
      { ...size }
    );
  }

  // Draw the logo into the 32×32 icon, contained so non-square logos aren't
  // distorted. next/og re-encodes to a crisp PNG at icon size.
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={logoUrl}
          alt=""
          width={size.width}
          height={size.height}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>
    ),
    { ...size }
  );
}
