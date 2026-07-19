import { Card, CardContent } from "@/components/ui/card";
import { NewProfileFieldForm } from "./new-profile-field-form";
import { ProfileFieldRow } from "./profile-field-row";
import type { CommunityProfileField } from "@/types/database";

export function ProfileFieldsSection({
  communityId,
  communitySlug,
  fields,
}: {
  communityId: string;
  communitySlug: string;
  fields: CommunityProfileField[];
}) {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <NewProfileFieldForm communityId={communityId} communitySlug={communitySlug} />
        </CardContent>
      </Card>

      {fields.length > 0 && (
        <Card>
          <CardContent className="divide-y divide-border p-0">
            {fields.map((field, index) => (
              <ProfileFieldRow
                key={field.id}
                field={field}
                communitySlug={communitySlug}
                isFirst={index === 0}
                isLast={index === fields.length - 1}
              />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
