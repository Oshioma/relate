import { NewJournalFieldForm } from "./new-journal-field-form";
import { JournalFieldRow } from "./journal-field-row";
import type { SpaceJournalField } from "@/types/database";

export function JournalFieldsSection({
  spaceId,
  communitySlug,
  spaceSlug,
  fields,
}: {
  spaceId: string;
  communitySlug: string;
  spaceSlug: string;
  fields: SpaceJournalField[];
}) {
  return (
    <div className="space-y-3 rounded-md border border-border bg-muted/40 p-3">
      <p className="text-xs font-medium text-muted-foreground">
        Fields every entry in this journal will ask for.
      </p>

      {fields.length > 0 && (
        <div className="divide-y divide-border rounded-md border border-border bg-card">
          {fields.map((field, index) => (
            <JournalFieldRow
              key={field.id}
              field={field}
              communitySlug={communitySlug}
              spaceSlug={spaceSlug}
              isFirst={index === 0}
              isLast={index === fields.length - 1}
            />
          ))}
        </div>
      )}

      <NewJournalFieldForm spaceId={spaceId} communitySlug={communitySlug} spaceSlug={spaceSlug} />
    </div>
  );
}
