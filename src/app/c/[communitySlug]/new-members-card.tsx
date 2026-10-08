import Link from "next/link";
import type { MemberRow } from "@/lib/data/community";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

// The newest faces in the community, as an avatar row. Member profiles stay
// login-gated, so the page only passes members to a signed-in viewer.
export function NewMembersCard({ members, href }: { members: MemberRow[]; href: string }) {
  if (members.length === 0) return null;

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">New members</h2>
        <Link href={href} className="text-xs font-medium text-accent hover:underline">
          See all
        </Link>
      </div>
      <ul className="grid grid-cols-5 gap-2">
        {members.slice(0, 5).map((m) => {
          const name = m.profile.full_name || m.profile.username;
          return (
            <li key={m.id}>
              <Link href={href} className="flex flex-col items-center gap-1.5 text-center">
                <Avatar src={m.profile.avatar_url} name={name} size={44} />
                <span className="w-full truncate text-xs font-medium text-foreground">{name.split(" ")[0]}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
