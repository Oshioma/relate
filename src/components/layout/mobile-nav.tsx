"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Menu, X, ExternalLink, Search } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { LogoutButton } from "@/components/layout/logout-button";
import { cn } from "@/lib/utils";

export interface MobileTab {
  href: string;
  label: string;
  icon: ReactNode;
  exact?: boolean;
}

export interface MobileNavItem {
  href: string;
  label: string;
  icon: ReactNode;
  exact?: boolean;
  sub?: boolean;
}

export interface MobileExternalLink {
  id: string;
  label: string;
  url: string;
}

export type MobileNavAccount =
  | {
      kind: "user";
      name: string;
      username: string | null;
      avatarUrl: string | null;
    }
  | {
      kind: "guest";
      loginHref: string;
      signupHref: string;
    };

interface MobileNavProps {
  /** Primary destinations shown as bottom-bar tabs. A trailing "Menu" button is
   *  appended automatically to open the full drawer. */
  tabs: MobileTab[];
  communityName: string;
  communityLogoUrl: string | null;
  /** The community feed, which the drawer's logo links to — the way home. */
  communityHref: string;
  /** The full nav tree — everything the desktop sidebar shows — for the drawer. */
  items: MobileNavItem[];
  links: MobileExternalLink[];
  account: MobileNavAccount;
}

function itemIsActive(pathname: string, href: string, exact?: boolean) {
  return exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");
}

export function MobileNav({ tabs, communityName, communityLogoUrl, communityHref, items, links, account }: MobileNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  // Closing also resets the query so the sheet always reopens fresh.
  const close = () => {
    setOpen(false);
    setQuery("");
  };

  // A community can accumulate many spaces and featured categories; a filter
  // at the top of the drawer turns "scroll and hunt" into "type two letters".
  const q = query.trim().toLowerCase();
  const searching = q.length > 0;
  const filteredItems = useMemo(
    () => (searching ? items.filter((item) => item.label.toLowerCase().includes(q)) : items),
    [items, q, searching]
  );
  const filteredLinks = useMemo(
    () => (searching ? links.filter((link) => link.label.toLowerCase().includes(q)) : links),
    [links, q, searching]
  );
  const hasResults = filteredItems.length > 0 || filteredLinks.length > 0;

  // Lock body scroll while the sheet is open so the page behind doesn't move.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Close on Escape for keyboard/hardware-key users.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        {tabs.map((tab) => {
          const isActive = itemIsActive(pathname, tab.href, tab.exact);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                isActive ? "text-accent" : "text-muted-foreground"
              )}
            >
              {tab.icon}
              {tab.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className={cn(
            "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
            open ? "text-accent" : "text-muted-foreground"
          )}
        >
          <Menu className="h-5 w-5" />
          Menu
        </button>
      </nav>

      {/* Slide-out drawer: full nav parity with the desktop sidebar. */}
      <div
        className={cn(
          "fixed inset-0 z-50 md:hidden",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!open}
      >
        <div
          onClick={close}
          className={cn(
            "absolute inset-0 bg-foreground/40 backdrop-blur-sm transition-opacity duration-200",
            open ? "opacity-100" : "opacity-0"
          )}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Community menu"
          className={cn(
            "absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col bg-card shadow-xl transition-transform duration-200 ease-out",
            open ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3.5">
            <Link href={communityHref} onClick={close} className="flex min-w-0 items-center gap-2.5">
              <Avatar src={communityLogoUrl} name={communityName} size={36} />
              <span className="truncate text-base font-semibold text-foreground">{communityName}</span>
            </Link>
            <button
              type="button"
              onClick={close}
              aria-label="Close menu"
              className="-mr-1 rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="border-b border-border px-3 py-2.5">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2 focus-within:border-accent/50">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Jump to a space, category…"
                autoComplete="off"
                spellCheck={false}
                aria-label="Search this community's spaces"
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              {searching && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="-mr-1 shrink-0 rounded p-0.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain px-3 py-4">
            <div className="space-y-0.5">
              {filteredItems.map((item) => {
                const isActive = itemIsActive(pathname, item.href, item.exact);
                // A sub-item shown on its own (while searching) reads oddly with
                // the parent's indent, so drop it when the list is filtered.
                const indented = item.sub && !searching;
                return (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    onClick={close}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                      indented ? "py-1.5 pl-9 text-[13px]" : "py-2.5",
                      isActive
                        ? "bg-accent-soft text-accent"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <span className={cn("shrink-0", isActive ? "text-accent" : "text-muted-foreground")}>{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {!hasResults && (
              <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                No spaces match “{query.trim()}”.
              </p>
            )}

            {filteredLinks.length > 0 && (
              <div className={cn("space-y-0.5", !searching && "mt-3 border-t border-border pt-3")}>
                {filteredLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    onClick={close}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <ExternalLink className="h-4 w-4 shrink-0" />
                    <span className="truncate">{link.label}</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-border p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
            {account.kind === "user" ? (
              <>
                <Link href="/settings" onClick={close} className="flex items-center gap-2.5 rounded-lg px-3 py-2 hover:bg-muted">
                  <Avatar src={account.avatarUrl} name={account.name} size={32} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{account.name}</p>
                    {account.username && <p className="truncate text-xs text-muted-foreground">@{account.username}</p>}
                  </div>
                </Link>
                <Link href="/dashboard" onClick={close} className="flex items-center gap-2.5 rounded-lg px-3 py-2 hover:bg-muted">
                  <span className="text-sm font-medium text-foreground">Powered by Relate.Click</span>
                </Link>
                <LogoutButton />
              </>
            ) : (
              <div className="space-y-2 px-1 py-1">
                <p className="px-2 text-xs text-muted-foreground">Browsing {communityName} as a guest.</p>
                <Link
                  href={account.loginHref}
                  onClick={close}
                  className="flex w-full items-center justify-center rounded-lg bg-accent px-3 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
                >
                  Log in
                </Link>
                <Link
                  href={account.signupHref}
                  onClick={close}
                  className="flex w-full items-center justify-center rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
