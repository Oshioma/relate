// The access overview: every space against every kind of person, with the rule
// that decided each answer and whether that rule comes from the community as a
// whole or from the space itself. Pure, built on the same model as the access
// picker, the wizard and the "Who can see what?" card, so the overview page
// can never disagree with them. It explains; RLS still decides.

import {
  ACCESS_REASON_TEXT,
  describeSpaceAccess,
  explainSpaceAccess,
  findAccessIssues,
  type AccessCommunity,
  type AccessIssue,
  type AccessReason,
  type AccessSpace,
  type AccessState,
  type AccessTier,
  type AccessViewer,
} from "./model";

export type OverviewViewer = { key: string; label: string; viewer: AccessViewer; note?: string };

export type OverviewCell = {
  viewerKey: string;
  state: AccessState;
  reason: AccessReason;
  reasonText: string;
  // "community": decided by a community-wide setting (it's hidden, so nothing
  // shows to outsiders). "space": decided by this space's own access.
  // "role": the team sees everything whatever either says.
  source: "community" | "space" | "role";
};

export type OverviewRow = {
  space: AccessSpace;
  access: string;
  cells: OverviewCell[];
  issues: AccessIssue[];
  // The community-wide restriction that applies on top of the space's own
  // setting, in words, or null when there isn't one.
  inherited: string | null;
};

// Who to show as columns: visitors, free members, one column per membership
// that still matters (on sale, or archived but still unlocking something, since
// its subscribers keep access) and the team.
export function overviewViewers(tiers: AccessTier[], spaces: AccessSpace[]): OverviewViewer[] {
  const linked = new Set(spaces.flatMap((s) => s.tierIds));
  const tierViewers = tiers
    .filter((t) => !t.archived_at || linked.has(t.id))
    .map((t) => ({
      key: `tier:${t.id}`,
      label: `On ${t.name}`,
      viewer: { kind: "paid", tierIds: [t.id] } as AccessViewer,
      note: t.archived_at ? "Archived: no new subscribers, existing ones keep access." : undefined,
    }));
  return [
    { key: "visitor", label: "Visitor", viewer: { kind: "visitor" }, note: "Not signed in." },
    { key: "member", label: "Free member", viewer: { kind: "member" }, note: "Joined, no membership." },
    ...tierViewers,
    { key: "team", label: "Team", viewer: { kind: "team" }, note: "Owner, admins and moderators." },
  ];
}

function sourceOf(reason: AccessReason): OverviewCell["source"] {
  if (reason === "team") return "role";
  if (reason === "hidden_community") return "community";
  return "space";
}

export function inheritedRestriction(community: AccessCommunity, space: AccessSpace): string | null {
  if (community.privacy === "invite_only" && space.visibility === "public") {
    return "Open to everyone, but the community is invitation only, so only members ever see it.";
  }
  return null;
}

export function buildAccessOverview(
  community: AccessCommunity,
  spaces: AccessSpace[],
  tiers: AccessTier[]
): { viewers: OverviewViewer[]; rows: OverviewRow[]; communityIssues: AccessIssue[] } {
  const viewers = overviewViewers(tiers, spaces);
  const issues = findAccessIssues(community, spaces, tiers);
  const rows = spaces.map((space) => ({
    space,
    access: describeSpaceAccess(space, tiers),
    inherited: inheritedRestriction(community, space),
    issues: issues.filter((i) => i.spaceId === space.id),
    cells: viewers.map((v) => {
      const { state, reason } = explainSpaceAccess(community, space, v.viewer);
      return { viewerKey: v.key, state, reason, reasonText: ACCESS_REASON_TEXT[reason], source: sourceOf(reason) };
    }),
  }));
  return { viewers, rows, communityIssues: issues.filter((i) => !i.spaceId) };
}
