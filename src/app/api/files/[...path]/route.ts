// Opens a file from a space's private folder ('space-files' bucket).
//
// Pages link to /api/files/<space id>/<uploader id>/<name> rather than to
// Storage, because the bucket has no public links. Here Storage is asked, as
// the viewer, for a link that works for one hour; its read rule is
// has_space_access(), so only people who can open the space get one, and a
// paid space's files only open for people who have paid. Everyone else gets a
// plain 404 that says nothing about whether the file exists.

import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { SPACE_FILES_BUCKET, spaceFilePathFromUrl, SPACE_FILE_URL_PREFIX } from "@/lib/space-files";

// Long enough for a video to finish playing from one link.
const SIGNED_LINK_SECONDS = 60 * 60;

const NO_STORE = { "Cache-Control": "private, no-store" };

export async function GET(_request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await context.params;
  const path = spaceFilePathFromUrl(SPACE_FILE_URL_PREFIX + segments.join("/"));
  if (!path) return new NextResponse("Not found", { status: 404, headers: NO_STORE });

  const supabase = await createClient();
  const { data, error } = await supabase.storage.from(SPACE_FILES_BUCKET).createSignedUrl(path, SIGNED_LINK_SECONDS);
  if (error || !data?.signedUrl) return new NextResponse("Not found", { status: 404, headers: NO_STORE });

  return NextResponse.redirect(data.signedUrl, { status: 302, headers: NO_STORE });
}
