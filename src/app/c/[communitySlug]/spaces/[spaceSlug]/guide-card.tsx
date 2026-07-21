import Link from "next/link";
import { Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRatingDisplay } from "./star-rating";
import type { GuideWithStats } from "@/lib/data/guides";

function excerpt(body: string, length = 140): string {
  const trimmed = body.trim();
  return trimmed.length > length ? `${trimmed.slice(0, length)}…` : trimmed;
}

export function GuideCard({ data, communitySlug, spaceSlug }: { data: GuideWithStats; communitySlug: string; spaceSlug: string }) {
  const { guide, avgRating, ratingCount, contributorCount } = data;

  return (
    <Link href={`/c/${communitySlug}/spaces/${spaceSlug}/guides/${guide.id}`}>
      <Card className="h-full transition-shadow hover:shadow-sm">
        <CardContent className="pt-5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">{guide.title}</h3>
            {guide.featured && <Badge tone="accent">Featured</Badge>}
          </div>

          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{excerpt(guide.body)}</p>

          <div className="mt-4 flex items-center justify-between gap-3">
            <StarRatingDisplay value={avgRating} count={ratingCount} />
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              {contributorCount} {contributorCount === 1 ? "contributor" : "contributors"}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
