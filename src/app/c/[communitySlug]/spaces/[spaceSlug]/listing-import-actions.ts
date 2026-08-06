"use server";

import { createClient } from "@/lib/supabase/server";
import { importListingDraft } from "@/lib/listing-import";
import { getCommunityAccommodationSpace } from "@/lib/data/accommodation";
import { BUSINESS_CATEGORIES } from "@/lib/business-categories";
import type { ListingImportKind, ListingImportResult } from "@/lib/listing-draft";

// Backs the "paste a link" box on the new-listing forms. The draft it returns
// never touches the database — it only pre-fills the form the member then
// reviews and submits, so the existing create actions stay the single place
// where a listing is validated and written.
export async function importListingFromLink({
  url,
  kind,
  spaceId,
}: {
  url: string;
  kind: ListingImportKind;
  spaceId: string;
}): Promise<ListingImportResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You need to be signed in." };

  if (typeof url !== "string" || url.trim().length === 0 || url.length > 2000) {
    return { ok: false, error: "Paste a link first." };
  }
  if (kind !== "business" && kind !== "accommodation") {
    return { ok: false, error: "Unknown listing type." };
  }

  // The space tells us which community we're in — needed to find where a
  // misplaced stay should go instead. RLS decides whether the caller can see it.
  const { data: space } = await supabase.from("spaces").select("community_id").eq("id", spaceId).maybeSingle();

  // The category the model may choose from is the space's real option list —
  // built-ins plus whatever staff added — read server-side so a suggested
  // category is always one createBusiness will accept.
  let categories = BUSINESS_CATEGORIES.map((c) => c.value as string);
  if (kind === "business" && spaceId) {
    const { data } = await supabase.from("business_custom_categories").select("slug").eq("space_id", spaceId);
    if (data) categories = [...categories, ...data.map((c) => c.slug)];
  }

  const result = await importListingDraft({ rawUrl: url, kind, categories });

  // A place to stay pasted into the directory form isn't an error — the member
  // simply started in the wrong half of the app. Hand them a way through that
  // keeps the link, so the Accommodation space can re-read it as a stay and
  // fill in price, rooms and amenities the directory form has no fields for.
  if (result.ok && result.warning && space?.community_id) {
    const [staySpace, { data: community }] = await Promise.all([
      getCommunityAccommodationSpace(supabase, space.community_id),
      supabase.from("communities").select("slug").eq("id", space.community_id).maybeSingle(),
    ]);
    const communitySlug = community?.slug;
    if (staySpace && communitySlug) {
      result.handoff = {
        href: `/c/${communitySlug}/spaces/${staySpace.slug}?import=${encodeURIComponent(url.trim())}`,
        label: `This is a place to stay — taking you to ${staySpace.name}…`,
      };
      // The warning told the member to go somewhere else; we're taking them
      // there instead, so it would only flash up as a scolding on the way out.
      // It stays for communities with no Accommodation space, where there is
      // nowhere to send them and the explanation is all we have.
      result.warning = undefined;
    }
  }

  return result;
}
