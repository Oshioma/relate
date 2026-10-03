// Whether a link has already been made into a lesson, here or anywhere.
//
// Asked by the routes that read a link in (a page, or a video to transcribe)
// before they spend anything. Two answers, treated differently:
//
//   * In the author's own community: a hard block. The community already has
//     this lesson; staff can open every space in it, so there is always a link
//     to send them to instead.
//   * In another community: a warning. Somebody else's library is not a reason
//     to refuse this one theirs, but it is worth knowing — the author is
//     offered a way in (join, or ask to join) and can still go ahead.
//
// See lesson-link-key.ts for what counts as "the same link".

import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { CommunityPrivacy, Database } from "@/types/database";
import { createAdminClient } from "@/lib/supabase/admin";
import { lessonLinkKey } from "./lesson-link-key";
import { parseVideoLink } from "./video-links";

export type LessonHere = { id: string; title: string; href: string };

// Another community with a lesson from this link. Says nothing about the
// lesson itself — its title and contents belong to that community — and an
// invite-only community, which is unlisted, isn't named at all.
export type LessonElsewhere = {
  communityId: string;
  name: string | null;
  slug: string | null;
  privacy: CommunityPrivacy;
  // The author's own standing there, so the offer fits: nothing to join when
  // they're already in, nothing to ask when they already have.
  membership: "active" | "requested" | null;
};

export type LinkLessons = { here: LessonHere | null; elsewhere: LessonElsewhere[] };

const MAX_ELSEWHERE = 3;

// A pattern every stored spelling of the link contains, to narrow the search
// before the keys are compared. Stored links are those the reader accepted
// and video links are stored canonical, so host + path is always in there.
function containsPattern(url: string): string | null {
  const video = parseVideoLink(url);
  let needle: string;
  if (video) {
    needle = video.url.replace(/^https?:\/\/(www\.)?/i, "");
  } else {
    try {
      const parsed = new URL(/^https?:\/\//i.test(url.trim()) ? url.trim() : `https://${url.trim()}`);
      const host = parsed.hostname.toLowerCase().replace(/^(www\.|m\.|mobile\.|amp\.)/, "");
      needle = `${host}${parsed.pathname.replace(/\/+$/, "")}`;
    } catch {
      return null;
    }
  }
  return `%${needle.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
}

type Row = {
  id: string;
  title: string;
  community_id: string;
  space_id: string;
  source_url: string | null;
  video_url: string | null;
  is_public: boolean;
};

async function candidates(client: SupabaseClient<Database>, pattern: string, communityId?: string): Promise<Row[]> {
  const columns = "id, title, community_id, space_id, source_url, video_url, is_public";
  const bySource = client.from("space_lessons").select(columns).ilike("source_url", pattern).limit(200);
  const byVideo = client.from("space_lessons").select(columns).ilike("video_url", pattern).limit(200);
  const [a, b] = await Promise.all(
    communityId ? [bySource.eq("community_id", communityId), byVideo.eq("community_id", communityId)] : [bySource, byVideo]
  );
  const seen = new Set<string>();
  return [...(a.data ?? []), ...(b.data ?? [])].filter((row) => !seen.has(row.id) && !!seen.add(row.id));
}

export async function findLessonsFromLink(
  supabase: SupabaseClient<Database>,
  opts: { communityId: string; userId: string; url: string; includeElsewhere: boolean }
): Promise<LinkLessons> {
  const key = lessonLinkKey(opts.url);
  const pattern = containsPattern(opts.url);
  if (!key || !pattern) return { here: null, elsewhere: [] };
  const matches = (row: Row) => lessonLinkKey(row.source_url) === key || lessonLinkKey(row.video_url) === key;

  // Here: as the author, under RLS — staff see every lesson in their community.
  const ownRows = (await candidates(supabase, pattern, opts.communityId)).filter(matches);
  let here: LessonHere | null = null;
  if (ownRows[0]) {
    // The lesson page lives under its space, which may not be this one. Read
    // as the author first; if that comes back empty, the lesson is in their
    // own community and already visible to them, so the slugs are safe to
    // read past RLS. A link to the community's front page is no answer to
    // "where is it?", so it is only the very last resort.
    const slugsFor = async (client: SupabaseClient<Database>) => {
      const [{ data: space }, { data: community }] = await Promise.all([
        client.from("spaces").select("slug").eq("id", ownRows[0].space_id).maybeSingle(),
        client.from("communities").select("slug").eq("id", opts.communityId).maybeSingle(),
      ]);
      return { space: space?.slug ?? null, community: community?.slug ?? null };
    };
    let slugs = await slugsFor(supabase);
    if (!slugs.space || !slugs.community) {
      try {
        slugs = await slugsFor(createAdminClient());
      } catch {
        // No service key: keep what the author's read found.
      }
    }
    here = {
      id: ownRows[0].id,
      title: ownRows[0].title,
      href:
        slugs.space && slugs.community
          ? `/c/${slugs.community}/spaces/${slugs.space}/lessons/${ownRows[0].id}`
          : `/c/${slugs.community ?? ""}`,
    };
  }
  // A block needs nothing more; the author can't go ahead either way.
  if (here || !opts.includeElsewhere) return { here, elsewhere: [] };

  // Elsewhere: other communities' rows aren't visible to the author, so this
  // reads past RLS — and so hands back only the community, never the lesson.
  // Published lessons only: a draft another community hasn't shown anyone is
  // not something to tell a stranger exists.
  let admin: SupabaseClient<Database>;
  try {
    admin = createAdminClient();
  } catch {
    // No service key on this deployment: the warning is a courtesy, so go
    // without it rather than refuse the link.
    return { here: null, elsewhere: [] };
  }
  const otherIds = [
    ...new Set(
      (await candidates(admin, pattern))
        .filter((row) => row.community_id !== opts.communityId && row.is_public && matches(row))
        .map((row) => row.community_id)
    ),
  ].slice(0, MAX_ELSEWHERE);
  if (otherIds.length === 0) return { here: null, elsewhere: [] };

  const [{ data: communities }, { data: memberships }] = await Promise.all([
    admin.from("communities").select("id, name, slug, privacy").in("id", otherIds),
    admin
      .from("community_memberships")
      .select("community_id, status")
      .eq("user_id", opts.userId)
      .in("community_id", otherIds),
  ]);

  const elsewhere = (communities ?? []).map((community): LessonElsewhere => {
    const status = memberships?.find((m) => m.community_id === community.id)?.status;
    const listed = community.privacy !== "invite_only";
    return {
      communityId: community.id,
      name: listed ? community.name : null,
      slug: listed ? community.slug : null,
      privacy: community.privacy,
      membership: status === "active" ? "active" : status === "requested" ? "requested" : null,
    };
  });
  return { here: null, elsewhere };
}

// What a route answers when the link is taken: 409, with enough for the
// composer to link to the lesson or offer a way into the other community.
export function linkLessonsResponse(found: LinkLessons) {
  if (found.here) {
    return {
      error: `This community already has a lesson from this link: "${found.here.title}". Open that one instead of making it again.`,
      existingLesson: found.here,
    };
  }
  const named = found.elsewhere.filter((c) => c.name).map((c) => c.name);
  return {
    error:
      named.length > 0
        ? `${named.join(", ")} already ${named.length === 1 ? "has" : "have"} a lesson from this link.`
        : "Another community already has a lesson from this link.",
    elsewhere: found.elsewhere,
  };
}
