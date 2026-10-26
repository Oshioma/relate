// Internal links are written as /c/<slug>/… everywhere — that is the route's
// real path, and it is right on the platform host (and in local dev). On the
// community's own host (its subdomain or custom domain) the proxy serves the
// same pages at the clean path and 308-redirects /c/<slug>/… onto it, so every
// such link cost a redirect hop: for a visitor on each click, and for a
// crawler on every link it followed. This turns a link for this community into
// the clean path the host serves, and leaves everything else — other
// communities, platform pages, external URLs — exactly as written.
export function communityHostHref(href: string, slug: string): string {
  const base = `/c/${slug}`;
  if (!href.startsWith(base)) return href;
  const rest = href.slice(base.length);
  if (rest === "") return "/";
  if (rest.startsWith("/")) return rest;
  if (rest.startsWith("?") || rest.startsWith("#")) return `/${rest}`;
  // /c/<slug>-other is a different community's path.
  return href;
}
