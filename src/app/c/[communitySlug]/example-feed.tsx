import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import type { ExampleFeedPost } from "@/lib/feed-examples";
import { FeedItemImage } from "./feed-item-image";

// The empty-feed stand-in: a short notice saying these are examples, then a few
// example posts in the owner's voice. Deliberately not FeedItemCard — these
// have no row behind them, so no link, smiles or comments, and every card
// carries an "Example" badge so nobody mistakes one for a real post.
export function ExampleFeed({
  posts,
  owner,
  notice,
  action,
}: {
  posts: ExampleFeedPost[];
  owner: { name: string; avatarUrl: string | null };
  notice: string;
  action?: ReactNode;
}) {
  return (
    <div className="space-y-5">
      <Card className="border-dashed">
        <CardContent className="flex flex-wrap items-center gap-3 pt-5">
          <Sparkles className="h-4 w-4 shrink-0 text-accent" aria-hidden />
          <p className="min-w-0 flex-1 text-sm text-muted-foreground">{notice}</p>
          {action}
        </CardContent>
      </Card>

      {posts.map((post) => (
        <div key={post.key}>
          <div className="mb-2 flex items-center gap-1.5">
            <span className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Example post</span>
          </div>
          <Card className="overflow-hidden opacity-95">
            <FeedItemImage src={post.imageUrl} alt="" />
            <CardContent className="pt-5">
              <div className="flex items-start gap-3">
                <Avatar src={owner.avatarUrl} name={owner.name} size={32} />
                <div className="min-w-0 flex-1">
                  <h3 className="break-words text-sm font-semibold text-foreground">{post.title}</h3>
                  <p className="mt-1 break-words text-xs text-muted-foreground">
                    {owner.name} · {post.ago}
                  </p>
                  <p className="mt-2 break-words text-sm text-foreground">{post.body}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
