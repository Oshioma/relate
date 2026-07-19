import Link from "next/link";
import { Mail } from "lucide-react";
import { NavLink } from "@/components/layout/nav-link";
import { cn } from "@/lib/utils";

function MailIcon({ count, className }: { count: number; className?: string }) {
  return (
    <span className="relative inline-flex">
      <Mail className={cn("h-4 w-4", className)} />
      {count > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-medium leading-none text-danger-foreground">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </span>
  );
}

// For desktop sidebars, alongside the other NavLink items.
export function MessagesNavLink({ count }: { count: number }) {
  return (
    <NavLink href="/messages" icon={<MailIcon count={count} />}>
      Messages
    </NavLink>
  );
}

// For mobile top bars, icon-only.
export function MessagesIconLink({ count }: { count: number }) {
  return (
    <Link href="/messages" className="text-muted-foreground">
      <MailIcon count={count} className="h-5 w-5" />
    </Link>
  );
}
