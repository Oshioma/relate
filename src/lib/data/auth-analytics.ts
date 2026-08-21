import type { SupabaseClient } from "@supabase/supabase-js";
import type { AuthEvent, AuthEventType, Community, Database, Profile } from "@/types/database";

// Reads of the auth_events log for the platform-admin "Signups & logins" tab.
// Like the rest of platform-analytics, every function here must be called with
// the service-role admin client (createAdminClient) and only after the caller
// has been verified as a super admin: RLS grants super admins select on
// auth_events, but the joins onto communities and profiles below span every
// community on the platform — private and invite-only ones included, which is
// the entire point of the tab (spotting a new signup to a community nobody on
// the operator's account is a member of).
type Client = SupabaseClient<Database>;

export const AUTH_EVENT_TYPES: AuthEventType[] = [
  "signup",
  "email_confirmed",
  "login",
  "join",
  "invited",
  "leave",
];

export type AuthEventRange = "24h" | "7d" | "30d" | "90d" | "all";

export const AUTH_EVENT_RANGES: { key: AuthEventRange; label: string; days: number | null }[] = [
  { key: "24h", label: "24 hours", days: 1 },
  { key: "7d", label: "7 days", days: 7 },
  { key: "30d", label: "30 days", days: 30 },
  { key: "90d", label: "90 days", days: 90 },
  { key: "all", label: "All time", days: null },
];

export function parseAuthEventRange(value: string | undefined): AuthEventRange {
  return AUTH_EVENT_RANGES.some((r) => r.key === value) ? (value as AuthEventRange) : "30d";
}

export function rangeStart(range: AuthEventRange): string | null {
  const days = AUTH_EVENT_RANGES.find((r) => r.key === range)?.days ?? null;
  if (days === null) return null;
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

export type AuthEventCounts = Record<AuthEventType, number>;

function emptyCounts(): AuthEventCounts {
  return { signup: 0, email_confirmed: 0, login: 0, join: 0, invited: 0, leave: 0 };
}

export type CommunityAuthActivity = {
  // Null for the synthetic "no community" bucket — signups and sign-ins that
  // happened on the platform itself, with no community context to attribute.
  communityId: string | null;
  name: string;
  slug: string | null;
  privacy: string | null;
  // Total active members today, for context next to the movement in the window.
  memberCount: number;
  counts: AuthEventCounts;
  // Distinct people behind the events, so ten sign-ins by one person don't read
  // as ten people.
  uniqueUsers: number;
  lastEventAt: string | null;
  // True when the community existed before the window opened — a community
  // created inside the window has its whole membership counted as "joins",
  // which would otherwise look like a spike.
  createdInWindow: boolean;
  // Who was actually around, from presence tracking rather than events.
  presence: CommunityPresence;
};

// Presence, from member_activity_days: how many distinct people were actually
// around, per community and platform-wide. Days are UTC — the same boundary the
// rows are written on — so "today" means the current UTC day, not the viewer's.
export type ActiveUserCounts = {
  today: number;
  yesterday: number;
  last7: number;
  last30: number;
};

export type CommunityPresence = {
  activeToday: number;
  membersActiveToday: number;
  activeInWindow: number;
};

export type AuthEventFeedItem = {
  id: string;
  type: AuthEventType;
  createdAt: string;
  source: string | null;
  path: string | null;
  host: string | null;
  backfilled: boolean;
  user: Pick<Profile, "id" | "username" | "full_name" | "avatar_url"> | null;
  // The account's email address. Null when the account has since been deleted,
  // or when the lookup is unavailable. Only ever fetched for the rows actually
  // shown — see emailsForUserIds.
  email: string | null;
  communityId: string | null;
  communityName: string | null;
  communitySlug: string | null;
  communityPrivacy: string | null;
};

export type AuthEventDay = {
  day: string; // YYYY-MM-DD (UTC)
  counts: AuthEventCounts;
};

export type AuthAnalytics = {
  // Exact totals for the window, counted in the database (not derived from the
  // capped row fetch below), so the headline numbers are always right.
  totals: AuthEventCounts;
  // How many rows the breakdown below was built from, and whether that hit the
  // cap — surfaced in the UI so a truncated breakdown is never read as fact.
  rowsAnalysed: number;
  truncated: boolean;
  byCommunity: CommunityAuthActivity[];
  daily: AuthEventDay[];
  recent: AuthEventFeedItem[];
  // People who signed up in the window and are still in no community at all.
  signupsWithoutCommunity: number;
  // Distinct people seen, platform-wide.
  active: ActiveUserCounts;
  // Distinct people seen per UTC day, for the trend chart.
  dailyActive: { day: string; active: number }[];
  // False when the presence migration hasn't been pushed yet, so the UI can say
  // "not tracking yet" instead of showing a confident zero.
  presenceAvailable: boolean;
};

// Hard ceiling on the rows pulled into memory for the per-community breakdown.
// Well above a year of events for a platform of this size; the exact totals
// above stay correct even if it is ever hit.
const ROW_CAP = 50_000;

// Presence rows are (people x communities x days) — far denser than events, so
// its own, larger ceiling.
const PRESENCE_ROW_CAP = 200_000;

type EventRow = Pick<
  AuthEvent,
  "id" | "event_type" | "user_id" | "community_id" | "community_slug" | "source" | "path" | "host" | "created_at"
> & { metadata: Record<string, unknown> | null };

// Thrown when the auth_events table isn't there yet — the migration that adds
// it hasn't been pushed to this Supabase project. The tab renders a "run the
// migration" notice instead of a 500, since an operator seeing this page for
// the first time is exactly who is most likely to hit it.
export class AuthEventsNotInstalledError extends Error {
  constructor() {
    super("The auth_events table does not exist yet — push the auth_events_analytics migration.");
    this.name = "AuthEventsNotInstalledError";
  }
}

function isMissingTable(error: unknown): boolean {
  const code = (error as { code?: string } | null)?.code;
  const message = (error as { message?: string } | null)?.message ?? "";
  // 42P01 from Postgres, PGRST205 from PostgREST's schema cache.
  return code === "42P01" || code === "PGRST205" || /auth_events.*does not exist/i.test(message);
}

export async function getAuthAnalytics(admin: Client, range: AuthEventRange): Promise<AuthAnalytics> {
  try {
    return await loadAuthAnalytics(admin, range);
  } catch (error) {
    if (isMissingTable(error)) throw new AuthEventsNotInstalledError();
    throw error;
  }
}

async function loadAuthAnalytics(admin: Client, range: AuthEventRange): Promise<AuthAnalytics> {
  const since = rangeStart(range);

  const [
    totals,
    { data: rows, error: rowsError },
    { data: communities, error: communitiesError },
    memberCounts,
    presence,
  ] = await Promise.all([
      countByType(admin, since),
      (() => {
        let query = admin
          .from("auth_events")
          .select("id, event_type, user_id, community_id, community_slug, source, path, host, metadata, created_at")
          .order("created_at", { ascending: false })
          .limit(ROW_CAP);
        if (since) query = query.gte("created_at", since);
        return query;
      })(),
      admin.from("communities").select("id, name, slug, privacy, created_at"),
      activeMemberCounts(admin),
      loadPresence(admin, since),
    ]);

  if (rowsError) throw rowsError;
  if (communitiesError) throw communitiesError;

  const events = ((rows ?? []) as unknown as EventRow[]).filter(
    // Backfilled rows are synthesised history (see the migration) — they belong
    // in "all time" but would invent activity inside a recent window.
    (e) => !since || (e.metadata?.backfilled as boolean | undefined) !== true
  );

  const communityById = new Map(
    ((communities ?? []) as unknown as Pick<Community, "id" | "name" | "slug" | "privacy" | "created_at">[]).map((c) => [
      c.id,
      c,
    ])
  );

  // --- per-community aggregation --------------------------------------------
  const buckets = new Map<string, CommunityAuthActivity & { users: Set<string> }>();
  const bucketFor = (event: EventRow) => {
    const key = event.community_id ?? "__none__";
    if (!buckets.has(key)) {
      const community = event.community_id ? communityById.get(event.community_id) : undefined;
      buckets.set(key, {
        communityId: event.community_id,
        name:
          community?.name ??
          (event.community_id
            ? `Deleted community${event.community_slug ? ` (/c/${event.community_slug})` : ""}`
            : "No community — signed up on the platform"),
        slug: community?.slug ?? event.community_slug,
        privacy: community?.privacy ?? null,
        memberCount: 0,
        counts: emptyCounts(),
        uniqueUsers: 0,
        lastEventAt: null,
        createdInWindow: Boolean(since && community && community.created_at >= since),
        presence: presence.byCommunity.get(event.community_id ?? "__none__") ?? emptyPresence(),
        users: new Set<string>(),
      });
    }
    return buckets.get(key)!;
  };

  const daily = new Map<string, AuthEventCounts>();

  for (const event of events) {
    const bucket = bucketFor(event);
    bucket.counts[event.event_type] += 1;
    if (event.user_id) bucket.users.add(event.user_id);
    if (!bucket.lastEventAt || event.created_at > bucket.lastEventAt) bucket.lastEventAt = event.created_at;

    const day = event.created_at.slice(0, 10);
    if (!daily.has(day)) daily.set(day, emptyCounts());
    daily.get(day)![event.event_type] += 1;
  }

  // Communities with no events in the window still belong in the table — a
  // community that went quiet is exactly what an operator wants to spot.
  for (const community of communityById.values()) {
    if (!buckets.has(community.id)) {
      buckets.set(community.id, {
        communityId: community.id,
        name: community.name,
        slug: community.slug,
        privacy: community.privacy,
        memberCount: 0,
        counts: emptyCounts(),
        uniqueUsers: 0,
        lastEventAt: null,
        createdInWindow: Boolean(since && community.created_at >= since),
        presence: presence.byCommunity.get(community.id) ?? emptyPresence(),
        users: new Set<string>(),
      });
    }
  }

  const byCommunity: CommunityAuthActivity[] = [...buckets.values()]
    .map(({ users, ...bucket }) => ({
      ...bucket,
      uniqueUsers: users.size,
      memberCount: bucket.communityId ? (memberCounts.get(bucket.communityId) ?? 0) : 0,
    }))
    .sort((a, b) => {
      const score = (c: CommunityAuthActivity) =>
        c.counts.signup + c.counts.join + c.counts.login + c.presence.activeInWindow;
      if (score(b) !== score(a)) return score(b) - score(a);
      return b.memberCount - a.memberCount;
    });

  // --- recent feed ----------------------------------------------------------
  const feedRows = events.slice(0, 60);
  const profileIds = [...new Set(feedRows.map((e) => e.user_id).filter((id): id is string => Boolean(id)))];
  const profileById = new Map<string, Pick<Profile, "id" | "username" | "full_name" | "avatar_url">>();
  let emailById = new Map<string, string>();
  if (profileIds.length > 0) {
    const [{ data: profiles, error }, emails] = await Promise.all([
      admin.from("profiles").select("id, username, full_name, avatar_url").in("id", profileIds),
      emailsForUserIds(admin, profileIds),
    ]);
    if (error) throw error;
    for (const profile of (profiles ?? []) as Pick<Profile, "id" | "username" | "full_name" | "avatar_url">[]) {
      profileById.set(profile.id, profile);
    }
    emailById = emails;
  }

  const recent: AuthEventFeedItem[] = feedRows.map((event) => {
    const community = event.community_id ? communityById.get(event.community_id) : undefined;
    return {
      id: event.id,
      type: event.event_type,
      createdAt: event.created_at,
      source: event.source,
      path: event.path,
      host: event.host,
      backfilled: (event.metadata?.backfilled as boolean | undefined) === true,
      user: event.user_id ? (profileById.get(event.user_id) ?? null) : null,
      email: event.user_id ? (emailById.get(event.user_id) ?? null) : null,
      communityId: event.community_id,
      communityName: community?.name ?? (event.community_slug ? `/c/${event.community_slug}` : null),
      communitySlug: community?.slug ?? event.community_slug,
      communityPrivacy: community?.privacy ?? null,
    };
  });

  // Signups in the window by people who are in no community today — the "signed
  // up but never landed anywhere" number.
  const signupUserIds = new Set(
    events.filter((e) => e.event_type === "signup" && e.user_id).map((e) => e.user_id as string)
  );
  let signupsWithoutCommunity = 0;
  if (signupUserIds.size > 0) {
    const { data: memberships, error } = await admin
      .from("community_memberships")
      .select("user_id")
      .eq("status", "active")
      .in("user_id", [...signupUserIds]);
    if (error) throw error;
    const attached = new Set((memberships ?? []).map((m) => m.user_id));
    signupsWithoutCommunity = [...signupUserIds].filter((id) => !attached.has(id)).length;
  }

  return {
    totals,
    rowsAnalysed: events.length,
    truncated: (rows ?? []).length >= ROW_CAP,
    byCommunity,
    daily: [...daily.entries()]
      .map(([day, counts]) => ({ day, counts }))
      .sort((a, b) => (a.day < b.day ? -1 : 1)),
    recent,
    signupsWithoutCommunity,
    active: presence.platform,
    dailyActive: presence.daily,
    presenceAvailable: presence.available,
  };
}

function emptyPresence(): CommunityPresence {
  return { activeToday: 0, membersActiveToday: 0, activeInWindow: 0 };
}

// UTC day strings, the same boundary member_activity_days.day is written on.
function utcDay(offsetDays = 0): string {
  const date = new Date(Date.now() - offsetDays * 24 * 60 * 60 * 1000);
  return date.toISOString().slice(0, 10);
}

type PresenceRow = { user_id: string; community_id: string | null; day: string; is_member: boolean };

// Presence rows are per (person, community, day), so every count here is a
// distinct-user count over sets rather than a sum of rows — otherwise someone
// active in three communities would read as three people.
async function loadPresence(
  admin: Client,
  since: string | null
): Promise<{
  platform: ActiveUserCounts;
  byCommunity: Map<string, CommunityPresence>;
  daily: { day: string; active: number }[];
  available: boolean;
}> {
  const empty = {
    platform: { today: 0, yesterday: 0, last7: 0, last30: 0 },
    byCommunity: new Map<string, CommunityPresence>(),
    daily: [] as { day: string; active: number }[],
    available: false,
  };

  // Always cover at least 30 days so today/7d/30d are answerable, and the whole
  // window when the operator is looking at a longer one.
  const windowStart = since ? since.slice(0, 10) : null;
  const from = windowStart && windowStart < utcDay(30) ? windowStart : utcDay(30);

  const { data, error } = await admin
    .from("member_activity_days")
    .select("user_id, community_id, day, is_member")
    .gte("day", from)
    .limit(PRESENCE_ROW_CAP);

  if (error) {
    // The presence migration hasn't been pushed yet — report "not tracking"
    // rather than a confident zero, and leave the rest of the tab working.
    if (isMissingTable(error)) return empty;
    throw error;
  }

  const rows = (data ?? []) as PresenceRow[];
  const today = utcDay(0);
  const yesterday = utcDay(1);
  const day7 = utcDay(7);
  const day30 = utcDay(30);

  const platformSets = {
    today: new Set<string>(),
    yesterday: new Set<string>(),
    last7: new Set<string>(),
    last30: new Set<string>(),
  };
  const perCommunity = new Map<
    string,
    { activeToday: Set<string>; membersActiveToday: Set<string>; activeInWindow: Set<string> }
  >();
  const perDay = new Map<string, Set<string>>();

  for (const row of rows) {
    if (row.day === today) platformSets.today.add(row.user_id);
    if (row.day === yesterday) platformSets.yesterday.add(row.user_id);
    if (row.day >= day7) platformSets.last7.add(row.user_id);
    if (row.day >= day30) platformSets.last30.add(row.user_id);

    if (!perDay.has(row.day)) perDay.set(row.day, new Set());
    perDay.get(row.day)!.add(row.user_id);

    const key = row.community_id ?? "__none__";
    if (!perCommunity.has(key)) {
      perCommunity.set(key, {
        activeToday: new Set(),
        membersActiveToday: new Set(),
        activeInWindow: new Set(),
      });
    }
    const bucket = perCommunity.get(key)!;
    if (row.day === today) {
      bucket.activeToday.add(row.user_id);
      if (row.is_member) bucket.membersActiveToday.add(row.user_id);
    }
    if (!windowStart || row.day >= windowStart) bucket.activeInWindow.add(row.user_id);
  }

  return {
    platform: {
      today: platformSets.today.size,
      yesterday: platformSets.yesterday.size,
      last7: platformSets.last7.size,
      last30: platformSets.last30.size,
    },
    byCommunity: new Map(
      [...perCommunity.entries()].map(([key, sets]) => [
        key,
        {
          activeToday: sets.activeToday.size,
          membersActiveToday: sets.membersActiveToday.size,
          activeInWindow: sets.activeInWindow.size,
        },
      ])
    ),
    daily: [...perDay.entries()]
      .map(([day, users]) => ({ day, active: users.size }))
      .sort((a, b) => (a.day < b.day ? -1 : 1)),
    available: true,
  };
}

// Exact per-type totals, one head-only COUNT each — cheap, and immune to the
// row cap on the breakdown above.
async function countByType(admin: Client, since: string | null): Promise<AuthEventCounts> {
  const results = await Promise.all(
    AUTH_EVENT_TYPES.map(async (type) => {
      let query = admin
        .from("auth_events")
        .select("id", { count: "exact", head: true })
        .eq("event_type", type);
      if (since) {
        query = query.gte("created_at", since);
      }
      const { count, error } = await query;
      if (error) throw error;
      return [type, count ?? 0] as const;
    })
  );
  return { ...emptyCounts(), ...Object.fromEntries(results) };
}

// Email addresses for a specific set of accounts, via the service-role-only
// user_emails_for_ids() function (see its migration). Deliberately narrow: only
// the ids on screen, never the whole user base. An operator recognises their
// members by email, so a signup feed without it is hard to act on.
//
// Never allowed to break the page it decorates — a missing function (migration
// not pushed yet) or a failed call just means no addresses are shown.
export async function emailsForUserIds(admin: Client, userIds: string[]): Promise<Map<string, string>> {
  const emails = new Map<string, string>();
  if (userIds.length === 0) return emails;

  const { data, error } = await admin.rpc("user_emails_for_ids", { p_user_ids: userIds });
  if (error) {
    console.error("[auth-analytics] user_emails_for_ids failed:", error);
    return emails;
  }
  for (const row of (data ?? []) as { user_id: string; email: string | null }[]) {
    if (row.email) emails.set(row.user_id, row.email);
  }
  return emails;
}

async function activeMemberCounts(admin: Client): Promise<Map<string, number>> {
  const { data, error } = await admin
    .from("community_memberships")
    .select("community_id")
    .eq("status", "active");
  if (error) throw error;
  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    counts.set(row.community_id, (counts.get(row.community_id) ?? 0) + 1);
  }
  return counts;
}

// --- Single user -------------------------------------------------------------

// One person's presence over the last 30 UTC days, collapsed per community.
async function loadUserPresence(admin: Client, userId: string) {
  const empty = { lastSeenAt: null as string | null, daysActive: 0, communityIds: [] as string[], buckets: [] as
    { communityId: string | null; days: number; lastSeenAt: string }[] };

  const { data, error } = await admin
    .from("member_activity_days")
    .select("community_id, day, last_seen_at")
    .eq("user_id", userId)
    .gte("day", utcDay(30))
    .order("day", { ascending: false });

  if (error) {
    if (isMissingTable(error)) return empty;
    throw error;
  }

  const rows = (data ?? []) as { community_id: string | null; day: string; last_seen_at: string }[];
  if (rows.length === 0) return empty;

  const perCommunity = new Map<string, { communityId: string | null; days: number; lastSeenAt: string }>();
  const distinctDays = new Set<string>();
  let lastSeenAt: string | null = null;

  for (const row of rows) {
    distinctDays.add(row.day);
    if (!lastSeenAt || row.last_seen_at > lastSeenAt) lastSeenAt = row.last_seen_at;

    const key = row.community_id ?? "__none__";
    const bucket = perCommunity.get(key);
    if (!bucket) {
      perCommunity.set(key, { communityId: row.community_id, days: 1, lastSeenAt: row.last_seen_at });
    } else {
      bucket.days += 1;
      if (row.last_seen_at > bucket.lastSeenAt) bucket.lastSeenAt = row.last_seen_at;
    }
  }

  return {
    lastSeenAt,
    daysActive: distinctDays.size,
    communityIds: [...perCommunity.values()].map((b) => b.communityId).filter((id): id is string => Boolean(id)),
    buckets: [...perCommunity.values()].sort((a, b) => b.days - a.days || (a.lastSeenAt < b.lastSeenAt ? 1 : -1)),
  };
}

export type UserAuthActivity = {
  // The account's email address, for the per-user admin page.
  email: string | null;
  signupCommunity: { id: string; name: string; slug: string } | null;
  signupSource: string | null;
  lastLoginAt: string | null;
  loginCount: number;
  events: AuthEventFeedItem[];
  // Presence over the last 30 UTC days: how habitual they are, and where.
  presence: {
    lastSeenAt: string | null;
    daysActive: number;
    // Communities they actually spent time in, most days first.
    communities: { id: string | null; name: string; slug: string | null; days: number; lastSeenAt: string }[];
  };
};

// The account-level story for one person on the per-user admin page: where they
// signed up, when they last signed in, and their last few auth events.
export async function getUserAuthActivity(admin: Client, userId: string): Promise<UserAuthActivity> {
  try {
    return await loadUserAuthActivity(admin, userId);
  } catch (error) {
    // The per-user page has plenty else to show, so a missing table degrades to
    // an empty section rather than a 500.
    if (isMissingTable(error)) {
      return {
        email: null,
        signupCommunity: null,
        signupSource: null,
        lastLoginAt: null,
        loginCount: 0,
        events: [],
        presence: { lastSeenAt: null, daysActive: 0, communities: [] },
      };
    }
    throw error;
  }
}

async function loadUserAuthActivity(admin: Client, userId: string): Promise<UserAuthActivity> {
  const [{ data: rows, error }, { data: profile, error: profileError }, loginCountResult] = await Promise.all([
    admin
      .from("auth_events")
      .select("id, event_type, user_id, community_id, community_slug, source, path, host, metadata, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50),
    admin.from("profiles").select("signup_community_id, signup_source").eq("id", userId).maybeSingle(),
    // Counted rather than derived from the 50-row slice above, so a heavy user's
    // sign-in total stays exact.
    admin
      .from("auth_events")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("event_type", "login"),
  ]);
  if (error) throw error;
  if (profileError) throw profileError;
  if (loginCountResult.error) throw loginCountResult.error;

  const [presence, emails] = await Promise.all([
    loadUserPresence(admin, userId),
    emailsForUserIds(admin, [userId]),
  ]);

  const events = (rows ?? []) as unknown as EventRow[];
  const signupCommunityId = (profile as { signup_community_id?: string | null } | null)?.signup_community_id ?? null;
  const communityIds = [
    ...new Set(
      [...events.map((e) => e.community_id), ...presence.communityIds, signupCommunityId].filter(
        (id): id is string => Boolean(id)
      )
    ),
  ];
  const communityById = new Map<string, Pick<Community, "id" | "name" | "slug" | "privacy">>();
  if (communityIds.length > 0) {
    const { data: communities, error: communitiesError } = await admin
      .from("communities")
      .select("id, name, slug, privacy")
      .in("id", communityIds);
    if (communitiesError) throw communitiesError;
    for (const community of (communities ?? []) as Pick<Community, "id" | "name" | "slug" | "privacy">[]) {
      communityById.set(community.id, community);
    }
  }

  const lastLogin = events.find((e) => e.event_type === "login") ?? null;
  const signupCommunity = signupCommunityId ? (communityById.get(signupCommunityId) ?? null) : null;

  return {
    email: emails.get(userId) ?? null,
    signupCommunity: signupCommunity
      ? { id: signupCommunity.id, name: signupCommunity.name, slug: signupCommunity.slug }
      : null,
    signupSource: (profile as { signup_source?: string | null } | null)?.signup_source ?? null,
    lastLoginAt: lastLogin?.created_at ?? null,
    loginCount: loginCountResult.count ?? 0,
    presence: {
      lastSeenAt: presence.lastSeenAt,
      daysActive: presence.daysActive,
      communities: presence.buckets.map((bucket) => {
        const community = bucket.communityId ? communityById.get(bucket.communityId) : undefined;
        return {
          id: bucket.communityId,
          name: community?.name ?? (bucket.communityId ? "Deleted community" : "Platform (no community)"),
          slug: community?.slug ?? null,
          days: bucket.days,
          lastSeenAt: bucket.lastSeenAt,
        };
      }),
    },
    events: events.slice(0, 15).map((event) => {
      const community = event.community_id ? communityById.get(event.community_id) : undefined;
      return {
        id: event.id,
        type: event.event_type,
        createdAt: event.created_at,
        source: event.source,
        path: event.path,
        host: event.host,
        backfilled: (event.metadata?.backfilled as boolean | undefined) === true,
        user: null,
        email: null,
        communityId: event.community_id,
        communityName: community?.name ?? (event.community_slug ? `/c/${event.community_slug}` : null),
        communitySlug: community?.slug ?? event.community_slug,
        communityPrivacy: community?.privacy ?? null,
      };
    }),
  };
}
