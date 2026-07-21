"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { CONCIERGE_RESULT_META, CONCIERGE_EXAMPLE_QUESTIONS } from "@/lib/concierge-result-types";
import { searchConcierge } from "./actions";
import type { ConciergeResults, ConciergeResultType } from "@/lib/data/concierge";

export function ConciergeView({ communityId, communitySlug }: { communityId: string; communitySlug: string }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ConciergeResults | null>(null);
  const [isPending, startTransition] = useTransition();

  function runSearch(q: string) {
    setQuery(q);
    startTransition(async () => {
      const res = await searchConcierge(communityId, communitySlug, q);
      setResults(res);
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) runSearch(query);
  }

  return (
    <div>
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Concierge</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Ask a question — searches businesses, events, guides, the marketplace, recommendations, discussions and more at once.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Where should I eat tonight?"
            className="w-full rounded-md border border-border bg-card py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <Button type="submit" disabled={isPending || !query.trim()} className="w-auto shrink-0">
          {isPending ? "Searching…" : "Ask"}
        </Button>
      </form>

      {!results && (
        <div className="flex flex-wrap gap-1.5">
          {CONCIERGE_EXAMPLE_QUESTIONS.map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => runSearch(question)}
              className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground hover:border-accent hover:text-foreground"
            >
              {question}
            </button>
          ))}
        </div>
      )}

      {results && (
        <div className="mt-6">
          {results.answer && (
            <Card className="mb-6 border-accent/30 bg-accent-soft">
              <CardContent className="flex items-start gap-3 py-4">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <p className="text-sm leading-relaxed text-foreground">{results.answer}</p>
              </CardContent>
            </Card>
          )}
          {results.totalCount === 0 ? (
            <EmptyState
              icon={<Search className="h-6 w-6" />}
              title="Nothing found"
              description={`No matches for "${results.query}" yet — try different words, or be the first to add it.`}
            />
          ) : (
            <div className="space-y-6">
              {(Object.keys(results.resultsByType) as ConciergeResultType[]).map((type) => {
                const items = results.resultsByType[type];
                if (!items || items.length === 0) return null;
                const meta = CONCIERGE_RESULT_META[type];
                const Icon = meta.icon;
                return (
                  <div key={type}>
                    <h2 className="mb-2 flex items-center gap-1.5 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                      <Icon className="h-3.5 w-3.5" />
                      {meta.label}
                    </h2>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <Link key={item.id} href={item.href}>
                          <Card className="transition-shadow hover:shadow-sm">
                            <CardContent className="py-3">
                              <div className="flex items-center justify-between gap-2">
                                <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
                                {item.extra && <span className="shrink-0 text-xs text-muted-foreground">{item.extra}</span>}
                              </div>
                              {item.snippet && <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{item.snippet}</p>}
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
