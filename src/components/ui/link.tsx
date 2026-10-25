"use client";

// eslint-disable-next-line no-restricted-imports -- the one place next/link is wrapped.
import NextLink from "next/link";
import type { ComponentProps } from "react";
import { communityHostHref } from "@/lib/community-path";
import { useCommunityHostSlug } from "./community-host";

// next/link, but on a community's own host this community's /c/<slug>/… links
// are written as the clean paths that host serves (see communityHostHref), so
// neither visitors nor crawlers take a redirect on every click. Import it in
// place of next/link everywhere (eslint enforces this). It renders on the
// server too, so the clean href is in the HTML a crawler reads.
export default function Link({ href, ...props }: ComponentProps<typeof NextLink>) {
  const slug = useCommunityHostSlug();
  if (!slug) return <NextLink href={href} {...props} />;
  const clean =
    typeof href === "string"
      ? communityHostHref(href, slug)
      : href.pathname
        ? { ...href, pathname: communityHostHref(href.pathname, slug) }
        : href;
  return <NextLink href={clean} {...props} />;
}

// A plain <a> with the same href rule, for internal links that deliberately
// skip next/link (a guide's dozens of directory links, which shouldn't all be
// prefetched).
export function Anchor({ href, ...props }: ComponentProps<"a">) {
  const slug = useCommunityHostSlug();
  return <a href={slug && href ? communityHostHref(href, slug) : href} {...props} />;
}
