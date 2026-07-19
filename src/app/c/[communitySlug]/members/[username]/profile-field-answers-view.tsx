import type { ProfileFieldWithValue } from "@/lib/data/community-profile-fields";

function formatValue(field: ProfileFieldWithValue): string | null {
  const { value } = field;
  if (value === null || value === undefined) return null;

  if (field.field_type === "checkbox") return value === true ? "Yes" : null;
  if (Array.isArray(value)) return value.length > 0 ? value.join(", ") : null;
  if (typeof value === "string") return value.trim() || null;
  return String(value);
}

export function ProfileFieldAnswersView({ fields }: { fields: ProfileFieldWithValue[] }) {
  const answered = fields
    .map((field) => ({ field, display: formatValue(field) }))
    .filter((row): row is { field: ProfileFieldWithValue; display: string } => row.display !== null);

  if (answered.length === 0) return null;

  return (
    <dl className="space-y-3">
      {answered.map(({ field, display }) => (
        <div key={field.id}>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{field.label}</dt>
          <dd className="mt-0.5 text-sm text-foreground">{display}</dd>
        </div>
      ))}
    </dl>
  );
}
