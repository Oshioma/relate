import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Pin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { formatRelativeTime } from "@/lib/utils";

export interface FeedItem {
  key: string;
  createdAt: string;
  isPinned?: boolean;
  icon: LucideIcon;
  title: string;
  description: string | null;
  imageUrl: string | null;
  imagePosition?: string | null;
  typeBadge: string | null;
  detail: string | null;
  authorName: string | null;
  authorAvatar: string | null;
  spaceName: string | null;
  href: string;
}

export function FeedItemCard({ item }: { item: FeedItem }) {
  const Icon = item.icon;
  const meta = [item.authorName, formatRelativeTime(item.createdAt), item.spaceName].filter(Boolean).join(" · ");

  return (
    <Link href={item.href} className="block">
      {(item.typeBadge || item.isPinned) && (
        <div className="mb-2 flex items-center gap-1.5">
          {item.isPinned && <Pin className="h-3.5 w-3.5 text-muted-foreground" />}
          {item.typeBadge && (
            <span className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              {item.typeBadge}
            </span>
          )}
        </div>
      )}
      <Card className="overflow-hidden transition-shadow hover:shadow-sm">
        {item.imageUrl && (
          <div className="h-40 w-full bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.imageUrl}
              alt={item.title}
              className="h-full w-full object-cover"
              style={{ objectPosition: item.imagePosition ?? "50% 50%" }}
            />
          </div>
        )}
        <CardContent className="pt-5">
          <div className="flex items-start gap-3">
            {item.authorName !== null ? (
              <Avatar src={item.authorAvatar} name={item.authorName} size={32} />
            ) : (
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <Icon className="h-4 w-4" />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{meta}</p>
              {item.description && <p className="mt-2 line-clamp-2 text-sm text-foreground">{item.description}</p>}
              {item.detail && <p className="mt-1 text-xs text-muted-foreground">{item.detail}</p>}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
