import Link from "next/link";
import { Sprout } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cropCategoryLabel } from "@/lib/crop-categories";
import type { CropListItem } from "@/lib/data/crop-guides";

function excerpt(text: string | null, length = 120): string {
  if (!text) return "";
  const trimmed = text.trim();
  return trimmed.length > length ? `${trimmed.slice(0, length)}…` : trimmed;
}

export function CropCard({ crop, communitySlug, spaceSlug }: { crop: CropListItem; communitySlug: string; spaceSlug: string }) {
  return (
    <Link href={`/c/${communitySlug}/spaces/${spaceSlug}/crop-guides/${crop.slug}`}>
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-sm">
        <div className="flex aspect-[3/2] items-center justify-center bg-accent-soft">
          {crop.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={crop.image_url} alt={crop.common_name} className="h-full w-full object-cover" />
          ) : (
            <Sprout className="h-10 w-10 text-accent" />
          )}
        </div>
        <CardContent className="pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">{crop.common_name}</h3>
            {crop.beginner_friendly && <Badge tone="accent">Beginner</Badge>}
          </div>
          {crop.scientific_name && <p className="mt-0.5 text-xs italic text-muted-foreground">{crop.scientific_name}</p>}
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{excerpt(crop.overview)}</p>
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            <span className="rounded-full bg-muted px-2 py-0.5">{cropCategoryLabel(crop.category)}</span>
            {crop.time_to_maturity_days != null && <span className="rounded-full bg-muted px-2 py-0.5">{crop.time_to_maturity_days} days</span>}
            {crop.organic_favourite && <span className="rounded-full bg-accent-soft px-2 py-0.5 text-accent">Organic favourite</span>}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
