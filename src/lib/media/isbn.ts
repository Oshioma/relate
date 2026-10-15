// Finding a book's ISBN in a pasted link.
//
// A shop's product page is the link a parent has to hand, and most shops —
// Amazon above all — answer a server-side read with a bot check rather than
// the page. The ISBN in the link is enough on its own: Open Library and Google
// Books know the book by it, cover included, with no key and no scraping. So
// the link is mined for an ISBN before any page is fetched.
//
// Pure, so it runs anywhere and can be unit tested.

const ISBN10_PATH = /\/(?:dp|gp\/product|gp\/aw\/d|product|isbn|books?)\/(\d{9}[\dXx])(?=[/?#]|$)/;
const ISBN13_ANYWHERE = /(?<!\d)(97[89]\d{10})(?!\d)/;
const ISBN10_QUERY = /[?&](?:isbn|asin)=(\d{9}[\dXx]|97[89]\d{10})(?=[&#]|$)/i;

export function isValidIsbn10(value: string): boolean {
  if (!/^\d{9}[\dXx]$/.test(value)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += (10 - i) * Number(value[i]);
  const check = value[9].toUpperCase() === "X" ? 10 : Number(value[9]);
  return (sum + check) % 11 === 0;
}

export function isValidIsbn13(value: string): boolean {
  if (!/^97[89]\d{10}$/.test(value)) return false;
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += Number(value[i]) * (i % 2 === 0 ? 1 : 3);
  return (10 - (sum % 10)) % 10 === Number(value[12]);
}

// The ISBN a link carries, or null. An Amazon ASIN that is not a valid
// ISBN-10 (most non-book products) is left alone rather than looked up.
export function isbnFromUrl(raw: string): string | null {
  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(raw.trim()) ? raw.trim() : `https://${raw.trim()}`);
  } catch {
    return null;
  }
  const path = decodeURIComponent(url.pathname);
  const candidates = [
    ISBN10_PATH.exec(path)?.[1],
    ISBN10_QUERY.exec(url.search)?.[1],
    ISBN13_ANYWHERE.exec(path.replace(/-/g, ""))?.[1],
  ];
  for (const candidate of candidates) {
    if (!candidate) continue;
    const value = candidate.toUpperCase();
    if (isValidIsbn13(value) || isValidIsbn10(value)) return value;
  }
  return null;
}
