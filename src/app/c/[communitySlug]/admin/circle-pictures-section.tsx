"use client";

import { useState, useTransition } from "react";
import { ImageDown } from "lucide-react";
import { bringCirclePicturesIn, type CirclePicturesResult } from "./circle-pictures-actions";

// Admin card for a community that moved from Circle: copies the profile photos
// and the guide and post pictures still served by Circle into our own storage. Shown only
// while there are some left (the page passes the count).
export function CirclePicturesSection({ communitySlug, waiting }: { communitySlug: string; waiting: number }) {
  const [result, setResult] = useState<CirclePicturesResult | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="mt-3 rounded-lg border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <ImageDown className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">Pictures from Circle</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {waiting} {waiting === 1 ? "picture is" : "pictures are"} still loading from Circle (members&apos; profile photos and
            pictures in guides and posts). Copy them here so they keep working after the Circle community closes.
          </p>
          <button
            type="button"
            disabled={pending}
            onClick={() => startTransition(async () => setResult(await bringCirclePicturesIn(communitySlug)))}
            className="mt-3 inline-flex h-10 items-center rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-60"
          >
            {pending ? "Copying pictures…" : "Copy pictures from Circle"}
          </button>
          {result && "error" in result && <p className="mt-2 text-sm text-danger">{result.error}</p>}
          {result && "ok" in result && (
            <div className="mt-2 text-sm text-muted-foreground">
              <p>
                Copied {result.copied} {result.copied === 1 ? "picture" : "pictures"}.
                {result.stillToDo > 0 && ` ${result.stillToDo} still to do: press the button again.`}
              </p>
              {result.failures.length > 0 && (
                <ul className="mt-1 list-disc pl-5">
                  {result.failures.map((failure) => (
                    <li key={failure}>{failure}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
