"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import { startConversation } from "@/app/messages/actions";
import { Button } from "@/components/ui/button";

export function MessageButton({ profileId }: { profileId: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={isPending}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const result = await startConversation(profileId);
            if (result.error || !result.conversationId) {
              setError(result.error ?? "Couldn't start a conversation.");
            } else {
              router.push(`/messages/${result.conversationId}`);
            }
          });
        }}
      >
        <Mail className="h-3.5 w-3.5" />
        {isPending ? "Opening…" : "Message"}
      </Button>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
