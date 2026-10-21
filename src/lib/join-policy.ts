// How people join a community, asked separately from whether it's listed.
// Mirrors community_join_policy() in the database (see the
// community_join_policy migration), which is what RLS enforces; this copy picks
// the right button and wording.
//
//   open     — anyone who can reach it joins straight away.
//   approval — people ask and staff decide.
//   invite   — invitation only. Always the answer for a hidden (invite_only)
//              community, whatever join_policy says.
//
// A null join_policy means "whatever privacy implies", which is how every
// community worked before the column existed.

import type { CommunityPrivacy, JoinPolicy } from "@/types/database";

export const JOIN_POLICIES: JoinPolicy[] = ["open", "approval", "invite"];

export function defaultJoinPolicy(privacy: CommunityPrivacy): JoinPolicy {
  if (privacy === "invite_only") return "invite";
  return privacy === "public" ? "open" : "approval";
}

export function joinPolicyOf(community: { privacy: CommunityPrivacy; join_policy?: JoinPolicy | string | null }): JoinPolicy {
  if (community.privacy === "invite_only") return "invite";
  const saved = community.join_policy;
  return saved && (JOIN_POLICIES as string[]).includes(saved) ? (saved as JoinPolicy) : defaultJoinPolicy(community.privacy);
}

// What to store for a chosen policy: null when it's what privacy implies anyway,
// so a community never carries an override it doesn't need.
export function storedJoinPolicy(privacy: CommunityPrivacy, chosen: JoinPolicy): JoinPolicy | null {
  if (privacy === "invite_only") return null;
  return chosen === defaultJoinPolicy(privacy) ? null : chosen;
}

export function describeJoining(policy: JoinPolicy): string {
  if (policy === "open") return "Anyone who finds it can join straight away.";
  if (policy === "approval") return "People ask to join and an admin approves them.";
  return "Only people you invite can join.";
}
