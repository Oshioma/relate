"use client";

import { useState, useTransition } from "react";
import { Check, X, Search, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { explainAccessCheck, type AccessCheckAnswer } from "@/lib/access/check";
import { runAccessCheck } from "./actions";

const SELECT_CLASS =
  "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

// "Why can't they get in?" Pick a person and a space; the database runs the
// same rules it enforces and answers yes or no, with the rule that decided and
// what would change it. It never shows anything they've posted or read.
export function AccessCheck({
  people,
  spaces,
}: {
  people: { id: string; name: string; status: string }[];
  spaces: { id: string; name: string }[];
}) {
  const [personId, setPersonId] = useState("");
  const [spaceId, setSpaceId] = useState(spaces[0]?.id ?? "");
  const [answer, setAnswer] = useState<{ who: string; space: string; result: AccessCheckAnswer } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function check() {
    setError(null);
    startTransition(async () => {
      const res = await runAccessCheck(spaceId, personId || null);
      if ("error" in res) {
        setAnswer(null);
        setError(res.error);
        return;
      }
      setAnswer({
        who: people.find((p) => p.id === personId)?.name ?? "A visitor",
        space: spaces.find((s) => s.id === spaceId)?.name ?? "this space",
        result: explainAccessCheck(res.facts, { visitor: !personId }),
      });
    });
  }

  return (
    <section id="access-check" className="mt-10 scroll-mt-20">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
        <KeyRound className="h-4 w-4 text-accent" />
        Access Check
      </h2>
      <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
        Someone says they can&apos;t get in? Check one person against one space. The answer comes from the same rules
        the database enforces, shows nothing they&apos;ve posted or read, and is noted in the community&apos;s check log.
      </p>

      <div className="mt-4 grid gap-3 rounded-lg border border-border bg-card p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <div>
          <Label htmlFor="access-check-person">Person</Label>
          <select id="access-check-person" value={personId} onChange={(e) => setPersonId(e.target.value)} className={SELECT_CLASS}>
            <option value="">A visitor who isn&apos;t signed in</option>
            {people.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
                {p.status !== "active" ? ` (${p.status})` : ""}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="access-check-space">Space</Label>
          <select id="access-check-space" value={spaceId} onChange={(e) => setSpaceId(e.target.value)} className={SELECT_CLASS}>
            {spaces.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <Button onClick={check} disabled={pending || !spaceId} className="h-10">
          <Search className="h-4 w-4" />
          {pending ? "Checking…" : "Check"}
        </Button>
      </div>

      {error && <p className="mt-3 text-sm text-danger">{error}</p>}

      {answer && (
        <div className="mt-4 rounded-lg border border-border bg-card p-4" aria-live="polite">
          <p className="text-sm font-semibold text-foreground">
            {answer.who} and {answer.space}
          </p>
          <ul className="mt-3 space-y-2">
            {answer.result.lines.map((line) => (
              <li key={line.label} className="flex items-start gap-2 text-sm">
                <span
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                    line.yes ? "bg-accent-soft text-accent" : "bg-muted text-muted-foreground"
                  )}
                >
                  {line.yes ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                </span>
                <span>
                  <span className="font-medium text-foreground">
                    {line.label}: {line.yes ? "yes" : "no"}.
                  </span>{" "}
                  <span className="text-muted-foreground">{line.because}</span>
                </span>
              </li>
            ))}
          </ul>
          {answer.result.unlock && (
            <p className="mt-3 rounded-md bg-muted px-3 py-2 text-sm text-foreground">
              <span className="font-medium">What would let them in:</span> {answer.result.unlock}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
