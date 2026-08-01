"use server";

import { createClient } from "@/lib/supabase/server";
import { importListingDraft } from "@/lib/listing-import";
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

  // The category the model may choose from is the space's real option list —
  // built-ins plus whatever staff added — read server-side so a suggested
  // category is always one createBusiness will accept. RLS decides whether the
  // caller can see the space's categories at all.
  let categories = BUSINESS_CATEGORIES.map((c) => c.value as string);
  if (kind === "business" && spaceId) {
    const { data } = await supabase.from("business_custom_categories").select("slug").eq("space_id", spaceId);
    if (data) categories = [...categories, ...data.map((c) => c.slug)];
  }

  return importListingDraft({ rawUrl: url, kind, categories });
}
