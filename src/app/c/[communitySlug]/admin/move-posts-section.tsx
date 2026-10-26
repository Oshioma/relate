"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightLeft } from "lucide-react";
import { movePostsBetweenSpaces } from "../spaces/[spaceSlug]/move-post-actions";
import type { MoveKind } from "@/lib/post-move";

type SpaceOption = { id: string; name: string; kind: MoveKind };

const SELECT_CLASS =
  "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

// Admin: move a whole space's posts (or only those with one tag, such as the
// Circle space they came from) into another space. Into a Guides space each
// post becomes a guide; see src/lib/post-move.ts.
export function MovePostsSection({ communitySlug, spaces, tags }: { communitySlug: string; spaces: SpaceOption[]; tags: string[] }) {
  const fromSpaces = spaces.filter((s) => s.kind === "post");
  const [from, setFrom] = useState(fromSpaces[0]?.id ?? "");
  const [to, setTo] = useState("");
  const [tag, setTag] = useState("");
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const target = spaces.find((s) => s.id === to);

  function handleMove() {
    if (!from || !target) return;
    const what = tag.trim() ? `every post tagged "${tag.trim()}"` : "every post";
    const how = target.kind === "guide" ? ` They become guides; comments come along, smiles don't.` : "";
    if (!window.confirm(`Move ${what} from this space to ${target.name}?${how}`)) return;
    setMessage(null);
    startTransition(async () => {
      const result = await movePostsBetweenSpaces(communitySlug, from, tag, target.id);
      if ("error" in result) {
        setMessage({ tone: "error", text: result.error });
      } else {
        setMessage({ tone: "ok", text: `Moved ${result.moved} ${result.moved === 1 ? "post" : "posts"} to ${target.name}.` });
        router.refresh();
      }
    });
  }

  if (fromSpaces.length === 0) return null;

  return (
    <div className="mt-3 rounded-lg border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <ArrowRightLeft className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">Move posts between spaces</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Move a space&apos;s posts, or only the ones with a tag, into another space. A single post can also be moved from its own page.
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div>
              <label htmlFor="move_from" className="mb-1 block text-xs font-medium text-muted-foreground">
                From
              </label>
              <select id="move_from" value={from} onChange={(e) => setFrom(e.target.value)} className={SELECT_CLASS}>
                {fromSpaces.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="move_tag" className="mb-1 block text-xs font-medium text-muted-foreground">
                Only posts tagged (optional)
              </label>
              <select id="move_tag" value={tag} onChange={(e) => setTag(e.target.value)} className={SELECT_CLASS}>
                <option value="">Any tag</option>
                {tags.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="move_to" className="mb-1 block text-xs font-medium text-muted-foreground">
                To
              </label>
              <select id="move_to" value={to} onChange={(e) => setTo(e.target.value)} className={SELECT_CLASS}>
                <option value="">Choose a space…</option>
                {spaces
                  .filter((s) => s.id !== from)
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                      {s.kind === "guide" ? " (as guides)" : ""}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <button
            type="button"
            onClick={handleMove}
            disabled={pending || !from || !target}
            className="mt-3 inline-flex h-10 items-center rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-60"
          >
            {pending ? "Moving posts…" : "Move posts"}
          </button>
          {message && <p className={`mt-2 text-sm ${message.tone === "error" ? "text-danger" : "text-muted-foreground"}`}>{message.text}</p>}
        </div>
      </div>
    </div>
  );
}
