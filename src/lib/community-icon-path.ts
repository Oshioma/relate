// The per-community browser-icon routes: app/c/[communitySlug]/icon (and
// apple-icon) for its pages, and app/welcome/[communitySlug]/icon for the
// signed-out landing page. Next writes them into each page's head as absolute
// paths (/c/<slug>/icon?…, /welcome/<slug>/icon?…), so on the community's own
// host the proxy must serve them exactly as written: rewriting them onto the
// /c/<slug> tree 404s, and redirecting them to the platform subdomain strips
// the slug (the subdomain's bare /icon is the platform's default icon).
const ICON_PATH = /^\/(c|welcome)\/([a-z0-9-]{2,60})\/(icon|apple-icon)(\/|$)/;

export function isCommunityIconPath(pathname: string, slug: string): boolean {
  const match = pathname.match(ICON_PATH);
  return match !== null && match[2] === slug;
}
