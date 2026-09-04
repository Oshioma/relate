import { cn, initials } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: number;
  className?: string;
  // Letters to show instead of ones worked out from the name. A community can
  // set its own (see the community_logo_initials migration) because deriving
  // them takes the first and last word and drops everything between, which is
  // not always the monogram anyone would have picked. Ignored when there is an
  // image, and falls back to the derived letters when blank.
  initials?: string | null;
}

// Plain <img>, not next/image: avatar/logo URLs are arbitrary user-supplied
// hosts (external links today, Supabase Storage later), so there is no fixed
// remotePatterns allowlist to configure ahead of time.
export function Avatar({ src, name, size = 36, className, initials: override }: AvatarProps) {
  const dimension = { width: size, height: size };

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name ?? "Avatar"}
        className={cn("rounded-full object-cover shrink-0", className)}
        style={dimension}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent font-medium",
        className
      )}
      style={{ ...dimension, fontSize: size * 0.4 }}
    >
      {override?.trim().toUpperCase() || initials(name)}
    </div>
  );
}
