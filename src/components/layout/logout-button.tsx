"use client";

import { LogOut } from "lucide-react";
import { logout } from "@/app/auth/actions";
import { cn } from "@/lib/utils";
import { clearAllFormDrafts } from "@/lib/use-form-draft";

export function LogoutButton({ className }: { className?: string }) {
  return (
    // Saved form drafts belong to whoever was signed in, so they go first.
    <form action={logout} onSubmit={clearAllFormDrafts}>
      <button
        type="submit"
        className={cn(
          "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground w-full",
          className
        )}
      >
        <LogOut className="h-4 w-4" />
        Log out
      </button>
    </form>
  );
}
