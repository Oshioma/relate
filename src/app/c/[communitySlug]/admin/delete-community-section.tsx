"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { AlertTriangle } from "lucide-react";
import { deleteCommunity } from "./actions";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Community } from "@/types/database";

// Not <SubmitButton>: it spreads incoming props after its own
// disabled={pending}, so passing `disabled` here would silently override
// the pending-guard instead of combining with it. This mirrors what
// SubmitButton does, but ANDs pending with the "typed the slug" condition.
function DeleteButton({ confirmed }: { confirmed: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="danger" disabled={pending || !confirmed} className="w-auto">
      {pending ? "Deleting…" : "Delete community"}
    </Button>
  );
}

export function DeleteCommunitySection({ community }: { community: Community }) {
  const [state, formAction] = useActionState(deleteCommunity, undefined);
  const [confirmSlug, setConfirmSlug] = useState("");

  return (
    <Card className="border-danger/30">
      <CardContent className="pt-5">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
          <div>
            <p className="text-sm font-semibold text-foreground">Delete this community</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Permanently deletes {community.name} — every space, post, member, business and pin in it. This can&apos;t be undone.
            </p>
          </div>
        </div>

        <form action={formAction} className="mt-4 space-y-3">
          <input type="hidden" name="community_id" value={community.id} />
          <input type="hidden" name="community_slug" value={community.slug} />

          <div>
            <Label htmlFor="confirm_slug">
              Type <span className="font-mono">{community.slug}</span> to confirm
            </Label>
            <Input
              id="confirm_slug"
              name="confirm_slug"
              value={confirmSlug}
              onChange={(e) => setConfirmSlug(e.target.value)}
              autoComplete="off"
            />
          </div>

          {state?.error && <p className="text-sm text-danger">{state.error}</p>}

          <DeleteButton confirmed={confirmSlug === community.slug} />
        </form>
      </CardContent>
    </Card>
  );
}
