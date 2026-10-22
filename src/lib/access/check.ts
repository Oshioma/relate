// Turns access_check()'s yes/no facts into the answer an admin reads: can this
// person find the space, open it, open its paid lessons and files, which rule
// decided that, and what would change it. Never sees content — only the facts
// the database function returns (supabase/migrations/*_access_check.sql).

export type AccessCheckFacts = {
  community_privacy: "public" | "private" | "invite_only";
  visibility: "public" | "members" | "private";
  gated: boolean;
  own_price_cents: number;
  membership_status: "none" | "active" | "invited" | "requested" | "banned";
  role: "owner" | "admin" | "moderator" | "member" | null;
  is_member: boolean;
  is_staff: boolean;
  can_discover: boolean;
  can_open: boolean;
  has_space_subscription: boolean;
  has_tier_subscription: boolean;
  unlocking_tiers: { id: string; name: string; archived: boolean }[];
  paid_courses: number;
  paid_courses_enrolled: number;
};

export type AccessCheckLine = { label: string; yes: boolean; because: string };

export type AccessCheckAnswer = {
  lines: AccessCheckLine[];
  // What would let them in, or null when nothing needs to change.
  unlock: string | null;
};

function membershipWords(f: AccessCheckFacts, visitor: boolean): string | null {
  if (visitor) return null;
  if (f.membership_status === "banned") return "They're banned from the community.";
  if (f.membership_status === "invited") return "They've been invited but haven't accepted yet.";
  if (f.membership_status === "requested") return "They've asked to join and are waiting for approval.";
  return null;
}

// `teaser`: the space is shown locked to people who haven't joined
// (spaces.when_locked). The database's can_discover is about the space itself,
// so a non-member's preview is added here.
export function explainAccessCheck(f: AccessCheckFacts, options: { visitor: boolean; teaser?: boolean }): AccessCheckAnswer {
  const visitor = options.visitor;
  const sawTeaser = Boolean(options.teaser) && !f.can_discover && f.visibility === "members" && f.community_privacy !== "invite_only";
  const status = membershipWords(f, visitor);
  const notMember = !f.is_member;

  // 1. Can they find it?
  let discoverBecause: string;
  if (f.is_staff) discoverBecause = "They're on the team, which sees every space.";
  else if (f.visibility === "public") {
    discoverBecause = f.can_discover
      ? "The space is open to everyone."
      : "The space is open to everyone, but the community is invitation only, so only members see it.";
  } else if (f.visibility === "members") {
    discoverBecause = f.can_discover
      ? "They're a member, and the space is for members."
      : sawTeaser
        ? `They see it locked (name, description and cover only), because it's shown to people who haven't joined. ${status ?? "They aren't a member."}`
        : (status ?? "The space is for members, and they aren't one.");
  } else {
    discoverBecause = "The space is Admins only.";
  }

  // 2. Can they open it?
  let openBecause: string;
  if (f.is_staff) openBecause = "They're on the team, which can open everything.";
  else if (sawTeaser) openBecause = "They need to join first.";
  else if (!f.can_discover) openBecause = "They can't see the space, so they can't open it.";
  else if (!f.gated) openBecause = f.visibility === "public" ? "The space is open to everyone." : "Members open this space for free.";
  else if (f.can_open) {
    const how = f.has_tier_subscription
      ? `Their membership (${f.unlocking_tiers.map((t) => t.name).join(", ") || "a membership"}) unlocks it.`
      : "They've paid for this space on its own.";
    openBecause = how;
  } else openBecause = "It needs a membership or purchase, and they don't have an active one.";

  const lines: AccessCheckLine[] = [
    { label: "Can find it", yes: f.can_discover || sawTeaser, because: discoverBecause },
    { label: "Can open it", yes: f.can_open, because: openBecause },
  ];

  if (f.paid_courses > 0) {
    const all = f.is_staff || (f.can_open && f.paid_courses_enrolled >= f.paid_courses);
    lines.push({
      label: "Paid course lessons",
      yes: all,
      because: f.is_staff
        ? "The team can open every lesson."
        : !f.can_open
          ? "They can't open the space, so no lessons."
          : `Enrolled in ${f.paid_courses_enrolled} of ${f.paid_courses} paid ${f.paid_courses === 1 ? "course" : "courses"} here; lessons need an enrolment.`,
    });
  }

  lines.push({
    label: "Files in posts",
    yes: f.can_open,
    because: f.can_open
      ? "They see posts here, so they see the files attached to them."
      : "They don't see posts here. Note that file links themselves aren't private yet, so a copied link still opens; that's being fixed separately.",
  });

  // 3. What would let them in?
  let unlock: string | null = null;
  if (!f.can_open && !f.is_staff) {
    if (f.visibility === "private") unlock = "Only the team gets in. Make them a moderator or admin, or change who can open the space.";
    else if (status && f.membership_status === "banned") unlock = "Unban them first. Paying doesn't get a banned member in.";
    else if (status) unlock = f.membership_status === "requested" ? "Approve their join request." : "They need to accept their invitation.";
    else if (notMember && visitor) unlock = f.community_privacy === "invite_only" ? "They need an invitation to join." : "They need to sign in and join the community.";
    else if (notMember) unlock = "They need to join the community.";
    else if (f.gated) {
      const onSale = f.unlocking_tiers.filter((t) => !t.archived).map((t) => t.name);
      const options = [
        onSale.length ? `a membership that includes it (${onSale.join(", ")})` : null,
        f.own_price_cents > 0 ? "buying the space on its own" : null,
      ].filter(Boolean);
      unlock = options.length
        ? `${options.join(" or ")}.`.replace(/^./, (c) => c.toUpperCase())
        : "Nothing on sale unlocks it right now. Add it to a membership that's on sale, or change who can open it.";
    }
  }

  return { lines, unlock };
}
