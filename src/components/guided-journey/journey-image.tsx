import Image from "next/image";
import { Sprout } from "lucide-react";
import { cn } from "@/lib/utils";

// One way to show a guided-journey photo. Project assets (/images/…) go through
// next/image so phones get a right-sized WebP; member uploads (Supabase public
// URLs) are plain lazy <img> like the rest of the app. With no photo at all the
// frame shows a calm, on-brand placeholder rather than a broken image.
export function JourneyImage({
  src,
  alt,
  className,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
  aspect = "aspect-[4/3]",
  rounded = "rounded-2xl",
}: {
  src: string | null | undefined;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  aspect?: string;
  rounded?: string;
}) {
  if (!src) {
    return (
      <div
        className={cn(
          "flex items-center justify-center overflow-hidden bg-gradient-to-br from-accent-soft via-muted to-accent-soft text-accent",
          aspect,
          rounded,
          className
        )}
        role="img"
        aria-label={alt || "No photo yet"}
      >
        <Sprout className="h-10 w-10 opacity-60" aria-hidden />
      </div>
    );
  }

  if (src.startsWith("/")) {
    return (
      <div className={cn("relative overflow-hidden bg-muted", aspect, rounded, className)}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-muted", aspect, rounded, className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- member uploads live on Supabase storage, not a configured next/image host */}
      <img src={src} alt={alt} loading={priority ? "eager" : "lazy"} decoding="async" className="absolute inset-0 h-full w-full object-cover" />
    </div>
  );
}
