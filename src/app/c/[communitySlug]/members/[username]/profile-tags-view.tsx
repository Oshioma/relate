import { Badge } from "@/components/ui/badge";

function TagGroup({ label, tags }: { label: string; tags: string[] }) {
  if (tags.length === 0) return null;

  return (
    <div>
      <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <Badge key={tag} tone="neutral">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export function ProfileTagsView({
  interests,
  skills,
  needsHelpWith,
  canHelpWith,
}: {
  interests: string[];
  skills: string[];
  needsHelpWith: string[];
  canHelpWith: string[];
}) {
  if (interests.length === 0 && skills.length === 0 && needsHelpWith.length === 0 && canHelpWith.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <TagGroup label="Interests" tags={interests} />
      <TagGroup label="Skills" tags={skills} />
      <TagGroup label="Needs help with" tags={needsHelpWith} />
      <TagGroup label="Can help with" tags={canHelpWith} />
    </div>
  );
}
