import { cn, isVideoUrl } from "@/lib/utils";

// A post's photos. One fills a banner, as before; two or three sit side by
// side as equal tiles; a fourth and beyond collapse into a "+N" on the last
// visible tile so the card never grows taller than a row.
export function PostGallery({
  urls,
  className,
  singleAspect = "aspect-[16/10]",
  interactive = false,
}: {
  urls: string[];
  className?: string;
  // Aspect for a lone photo/video banner; tiles are always square-ish.
  singleAspect?: string;
  // Show video controls (the post page) rather than a still (lists).
  interactive?: boolean;
}) {
  if (urls.length === 0) return null;

  if (urls.length === 1) {
    const [url] = urls;
    return (
      <div className={cn("w-full overflow-hidden bg-muted", singleAspect, className)}>
        {isVideoUrl(url) ? (
          <video controls={interactive} preload="metadata" src={url} className="h-full w-full object-cover" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" className="h-full w-full object-cover" />
        )}
      </div>
    );
  }

  const shown = urls.slice(0, 3);
  const hidden = urls.length - shown.length;

  return (
    <div className={cn("grid gap-1.5", shown.length === 2 ? "grid-cols-2" : "grid-cols-3", className)}>
      {shown.map((url, i) => (
        <div key={url + i} className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
          {isVideoUrl(url) ? (
            <video controls={interactive} preload="metadata" src={url} className="h-full w-full object-cover" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="h-full w-full object-cover" />
          )}
          {hidden > 0 && i === shown.length - 1 && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-xl font-semibold text-white">
              +{hidden}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

// A post's topic tags as soft pills.
export function TagChips({ tags, className }: { tags: string[]; className?: string }) {
  if (tags.length === 0) return null;
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {tags.map((tag) => (
        <span key={tag} className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
          {tag}
        </span>
      ))}
    </div>
  );
}
