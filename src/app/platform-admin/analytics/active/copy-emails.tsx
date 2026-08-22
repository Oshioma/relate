"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

// Copies every address on the page in one go. The reason this list exists is
// usually "email these people", and hand-selecting sixty addresses is the part
// that makes an operator give up and go to the database instead.
export function CopyEmails({ emails }: { emails: string[] }) {
  const [copied, setCopied] = useState(false);

  if (emails.length === 0) return null;

  async function copy() {
    try {
      await navigator.clipboard.writeText(emails.join(", "));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be refused (insecure context, permissions). The
      // addresses are all on screen and selectable, so this is a convenience
      // that's allowed to fail quietly rather than an error worth shouting.
    }
  }

  return (
    <Button size="sm" variant="secondary" onClick={copy}>
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : `Copy ${emails.length} address${emails.length === 1 ? "" : "es"}`}
    </Button>
  );
}
