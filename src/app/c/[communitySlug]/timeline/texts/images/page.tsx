import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCommunityBySlug } from "@/lib/data/community";
import { getGallery, type GalleryImage } from "@/lib/data/timeline-texts";
import { communityHasTimeline } from "@/lib/timeline/availability";
import { passagePath, workPath } from "@/lib/timeline/texts/paths";
import { ImageFigure } from "../archive-ui";
import { TextsNav } from "../texts-nav";

// ORIGINAL IMAGES: every manuscript, inscription and early print in the
// archive, each with its institution, licence and identification status, and
// a way back to the passage or text it belongs to.

export const metadata: Metadata = { title: "Original images" };

export default async function ImagesPage({ params }: { params: Promise<{ communitySlug: string }> }) {
  const { communitySlug } = await params;
  const supabase = await createClient();
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community || !communityHasTimeline(community)) notFound();
  const images = await getGallery(supabase, community.id).catch(() => [] as GalleryImage[]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <TextsNav communitySlug={community.slug} active="images" />
      <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Original images</h1>
      <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
        Photographs of the manuscripts, inscriptions and early prints themselves. Open any image to zoom into it. Each
        says where the object is, what licence the picture carries, and whether its identification has been checked.
      </p>
      {images.length === 0 ? (
        <p className="mt-6 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">No images have been imported yet.</p>
      ) : (
        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => (
            <li key={image.id}>
              <ImageFigure image={image} />
              <p className="mt-1 text-xs">
                {image.passageKey && image.workKey ? (
                  <Link href={passagePath(community.slug, image.workKey, image.passageKey)} className="text-accent hover:underline">
                    {image.workTitle}: {image.passageLabel}
                  </Link>
                ) : image.workKey ? (
                  <Link href={workPath(community.slug, image.workKey)} className="text-accent hover:underline">
                    {image.workTitle}
                  </Link>
                ) : null}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
