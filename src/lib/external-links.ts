// Links to other sites always open in a new window, so readers never lose the
// page they came from. One click handler in the root layout
// (components/layout/external-links-new-window.tsx) applies this to every
// link on every page, including links inside posts and other rich text, so
// individual links don't each need target="_blank".

// True when href leaves the site the reader is on: an http(s) link to a
// different host. Relative links, same-host links, #anchors and non-web
// schemes (mailto:, tel:, whatsapp:) stay in the same window. A community's
// own custom domain (e.g. mzunguzanzibar.com seen from relate.click) counts
// as another site. www and the bare domain count as the same site.
export function isExternalHref(href: string, currentHost: string): boolean {
  let url: URL;
  try {
    url = new URL(href, `https://${currentHost}/`);
  } catch {
    return false;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return false;
  return bareHost(url.hostname) !== bareHost(currentHost);
}

function bareHost(host: string): string {
  return host.toLowerCase().replace(/:\d+$/, "").replace(/^www\./, "");
}

// rel for a link opened in a new window: the new page can't reach back into
// this one through window.opener.
export const EXTERNAL_LINK_REL = "noopener noreferrer";
