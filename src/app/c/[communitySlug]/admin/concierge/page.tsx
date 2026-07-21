import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership } from "@/lib/data/community";
import { getConciergeQueries } from "@/lib/data/concierge";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Avatar } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";

export default async function ConciergeLogPage({ params }: { params: Promise<{ communitySlug: string }> }) {
  const { communitySlug } = await params;
  const supabase = await createClient();

  const user = await getCurrentUser(supabase);
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community || !user) notFound();

  const membership = await getMembership(supabase, community.id, user.id);
  const isAdmin = membership?.status === "active" && (membership.role === "owner" || membership.role === "admin");
  if (!isAdmin) {
    redirect(`/c/${community.slug}`);
  }

  const queries = await getConciergeQueries(supabase, community.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <Link href={`/c/${community.slug}/admin`} className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" />
        Admin
      </Link>

      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Concierge queries</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Everything members have asked the AI Concierge, most recent first.</p>
        </div>
      </div>

      {queries.length === 0 ? (
        <EmptyState
          icon={<Sparkles className="h-6 w-6" />}
          title="No queries yet"
          description="Once members start asking the Concierge questions, they'll show up here."
        />
      ) : (
        <div className="divide-y divide-border rounded-lg border border-border bg-card">
          {queries.map((entry) => (
            <div key={entry.id} className="flex items-start gap-3 px-5 py-3.5">
              <Avatar src={entry.user?.avatarUrl} name={entry.user?.fullName || entry.user?.username} size={32} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">&ldquo;{entry.query}&rdquo;</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {entry.user ? entry.user.fullName || entry.user.username : "Guest"} · {formatDate(entry.createdAt)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <Badge tone={entry.resultCount > 0 ? "accent" : "neutral"}>
                  {entry.resultCount} result{entry.resultCount === 1 ? "" : "s"}
                </Badge>
                {entry.hadAnswer && <Badge tone="neutral">AI answered</Badge>}
              </div>
            </div>
          ))}
        </div>
      )}

      <Card className="mt-6">
        <CardContent className="py-4">
          <p className="text-xs text-muted-foreground">Showing the most recent {queries.length} queries.</p>
        </CardContent>
      </Card>
    </div>
  );
}
