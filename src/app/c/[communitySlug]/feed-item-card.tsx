import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Pin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { cn, formatRelativeTime } from "@/lib/utils";
import { FeedItemActions, type FeedItemActionsProps } from "./feed-item-actions";
import type { FeedRefType } from "@/lib/data/feed-interactions";

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
  // Identifies the row behind this card, so its smiles and comments can be
  // looked up and written back. `key` is `${itemType}-${itemId}` today, but
  // these are carried explicitly rather than parsed back out of it.
  itemType: FeedRefType;
  itemId: string;
  // When set, tints the fallback icon badge (e.g. New Member cards) so
  // different activity types are scannable at a glance.
  iconClassName?: string;
  // Everything the smile/comment footer needs. Omitted for a card that has no
  // stable row behind it to hang a reaction off.
  actions?: Omit<FeedItemActionsProps, "itemTitle">;
}

export function FeedItemCard({ item }: { item: FeedItem }) {
  const Icon = item.icon;
  const meta = [item.authorName, formatRelativeTime(item.createdAt), item.spaceName].filter(Boolean).join(" · ");

  return (
    <div>
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
        {/* Only the body links through. The smile and comment controls sit in a
            footer outside the anchor — a button nested in a link is invalid
            markup, and tapping one would navigate away mid-interaction. */}
        <Link href={item.href} className="block">
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
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground",
                    item.iconClassName
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
              )}
              {/* `break-words` throughout: titles and descriptions are typed by
                  members and routinely carry an unbroken run — a URL, an email,
                  a hashtag. Without it that run neither wraps nor shrinks, so it
                  pushes the card wider than its column instead of folding. */}
              <div className="min-w-0 flex-1">
                <h3 className="break-words text-sm font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1 break-words text-xs text-muted-foreground">{meta}</p>
                {item.description && (
                  <p className="mt-2 line-clamp-2 break-words text-sm text-foreground">{item.description}</p>
                )}
                {item.detail && <p className="mt-1 break-words text-xs text-muted-foreground">{item.detail}</p>}
              </div>
            </div>
          </CardContent>
        </Link>
        {item.actions && <FeedItemActions {...item.actions} itemTitle={item.title} />}
      </Card>
    </div>
  );
}
