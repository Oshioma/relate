import { MemberCard } from "./member-card";
import type { DirectoryMember } from "@/lib/data/member-directory";

export function DiscoverySection({
  title,
  members,
  communitySlug,
}: {
  title: string;
  members: DirectoryMember[];
  communitySlug: string;
}) {
  if (members.length === 0) return null;

  return (
    <div className="mb-6">
      <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">{title}</h2>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {members.map((member) => (
          <div key={member.membershipId} className="w-48 shrink-0">
            <MemberCard member={member} communitySlug={communitySlug} />
          </div>
        ))}
      </div>
    </div>
  );
}
