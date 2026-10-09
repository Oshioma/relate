// Whether something was created within the last `days` days — the sidebar's
// NEW badge uses a fortnight. Kept out of components because it reads the
// clock; on a server-rendered page that's evaluated once per request.
export function isRecent(createdAt: string, days = 14, now = Date.now()): boolean {
  const created = Date.parse(createdAt);
  return Number.isFinite(created) && now - created < days * 24 * 60 * 60 * 1000;
}
