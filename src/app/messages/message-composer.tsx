"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { sendMessage } from "./actions";
import { Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function MessageComposer({ conversationId }: { conversationId: string }) {
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSend() {
    const trimmed = body.trim();
    if (!trimmed) return;

    setError(null);
    startTransition(async () => {
      const result = await sendMessage(conversationId, trimmed);
      if (result.error) {
        setError(result.error);
      } else {
        setBody("");
        router.refresh();
      }
    });
  }

  return (
    <div className="border-t border-border bg-card p-3">
      <div className="flex items-end gap-2">
        <Textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleSend();
            }
          }}
          rows={1}
          placeholder="Write a message…"
          className="resize-none"
        />
        <Button type="button" onClick={handleSend} disabled={isPending || !body.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  );
}
