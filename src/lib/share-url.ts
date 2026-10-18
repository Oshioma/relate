// Moves a link on this site onto the share origin. Links elsewhere (another
// site, or a different community's host) are returned unchanged.
export function toShareUrl(href: string, currentOrigin: string, shareOrigin: string | null): string {
  if (!shareOrigin) return href;
  try {
    const url = new URL(href, currentOrigin);
    if (url.origin !== currentOrigin) return url.toString();
    const target = new URL(shareOrigin);
    url.protocol = target.protocol;
    url.host = target.host;
    return url.toString();
  } catch {
    return href;
  }
}
