import { cn } from "@/lib/utils";
import type { TimelineDateClaim, TimelinePassageDate, TimelinePassageImage, TimelineSource } from "@/types/database";
import { formatClaimDate, formatYear } from "@/lib/timeline/time";
import { identificationStatusLabel, mediaKindLabel } from "@/lib/timeline/taxonomy";
import {
  PASSAGE_DATE_ROLES,
  completenessLabel,
  completenessHint,
  dateRoleFromWhatIsDated,
  imageLicenceLabel,
  imageVerificationLabel,
  passageDateRoleHint,
  traditionClassLabel,
  traditionIsModern,
} from "@/lib/timeline/texts/taxonomy";
import { ZoomableImage } from "./zoomable-image";

// Small pieces shared by the archive's pages, so a status or a date reads the
// same wherever it appears.

export function CompletenessBadge({ status }: { status: string }) {
  const complete = status === "verified_against_edition";
  return (
    <span
      title={completenessHint(status) ?? undefined}
      className={cn(
        "inline-flex shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium",
        complete ? "bg-accent-soft text-accent" : status === "not_started" ? "bg-muted/60 text-muted-foreground" : "bg-muted text-foreground"
      )}
    >
      {completenessLabel(status) ?? status}
    </span>
  );
}

/** Ancient or modern, said plainly: the check against a 1930s book reading as an ancient one. */
export function TraditionBadge({ traditionClass }: { traditionClass: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium",
        traditionIsModern(traditionClass) ? "bg-danger/10 text-danger" : "bg-muted text-muted-foreground"
      )}
    >
      {traditionClassLabel(traditionClass) ?? traditionClass}
    </span>
  );
}

export function SourceLine({ source }: { source: TimelineSource | null | undefined }) {
  if (!source) return null;
  return (
    <span className="text-xs text-muted-foreground">
      {source.author ? `${source.author}, ` : ""}
      {source.url ? (
        <a href={source.url} target="_blank" rel="noreferrer" className="hover:underline">
          {source.title}
        </a>
      ) : (
        source.title
      )}
      {source.published_year ? ` (${source.published_year})` : ""}
    </span>
  );
}

function yearSpan(start: number | null, end: number | null): string | null {
  if (start == null) return null;
  return end != null && end !== start ? `${formatYear(start)} – ${formatYear(end)}` : formatYear(start);
}

/**
 * THE FIVE CHRONOLOGICAL CONCEPTS, KEPT APART.
 *
 * The events a text describes, the date it claims, when it was composed, its
 * oldest surviving evidence, and when the version being read was published —
 * each under its own heading, never merged into "the date of the text".
 */
export function FiveDates({
  claims,
  passageDates = [],
  sourcesById,
}: {
  claims: TimelineDateClaim[];
  passageDates?: TimelinePassageDate[];
  sourcesById: Map<string, TimelineSource>;
}) {
  const rows = [
    ...claims.map((claim) => ({
      key: claim.id,
      role: dateRoleFromWhatIsDated(claim.what_is_dated),
      label: claim.what_is_dated,
      when: formatClaimDate(claim),
      original: claim.original_date_text,
      evidence: claim.evidence,
      source: claim.source_id ? sourcesById.get(claim.source_id) : undefined,
    })),
    ...passageDates.map((date) => ({
      key: date.id,
      role: date.date_role,
      label: null,
      when: yearSpan(date.start_year, date.end_year) ?? "Not placed",
      original: date.original_date_text,
      evidence: date.evidence,
      source: date.source_id ? sourcesById.get(date.source_id) : undefined,
    })),
  ];
  if (rows.length === 0) return null;
  const roles = [...PASSAGE_DATE_ROLES.map((r) => r.key as string), null];
  return (
    <dl className="divide-y divide-border rounded-xl border border-border bg-card">
      {roles.map((role) => {
        const here = rows.filter((row) => row.role === role);
        if (here.length === 0) return null;
        const label = PASSAGE_DATE_ROLES.find((r) => r.key === role)?.label ?? "Other dates";
        return (
          <div key={role ?? "other"} className="p-3 sm:p-4">
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground" title={role ? passageDateRoleHint(role) ?? undefined : undefined}>
              {label}
            </dt>
            {here.map((row) => (
              <dd key={row.key} className="mt-1.5">
                <p className="text-sm font-medium text-foreground">{row.when}</p>
                {row.label && row.label !== label && <p className="text-xs text-muted-foreground">{row.label}</p>}
                <p className="text-sm text-foreground">“{row.original}”</p>
                {row.evidence && <p className="text-xs text-muted-foreground">{row.evidence}</p>}
                <SourceLine source={row.source} />
              </dd>
            ))}
          </div>
        );
      })}
    </dl>
  );
}

export function imageMeta(image: TimelinePassageImage): string[] {
  return [
    [image.institution, image.accession_number].filter(Boolean).join(", "),
    image.object_date ? `Object: ${image.object_date}` : "",
    image.image_date ? `Photograph or print: ${image.image_date}` : "",
    `Shows: ${mediaKindLabel(image.shows) ?? image.shows} · Identification: ${identificationStatusLabel(image.identification_status) ?? image.identification_status}`,
    image.what_is_unverified ? `Not verified: ${image.what_is_unverified}` : "",
    `Licence: ${image.licence ?? "not stated"} (${imageLicenceLabel(image.licence_status) ?? image.licence_status}) · ${imageVerificationLabel(image.verification_status) ?? image.verification_status}`,
  ].filter(Boolean);
}

export function ImageFigure({ image, aside }: { image: TimelinePassageImage; aside?: React.ReactNode }) {
  return (
    <figure>
      <ZoomableImage
        image={{ url: image.url, caption: image.caption, credit: image.credit, sourcePageUrl: image.source_page_url, meta: imageMeta(image) }}
        aside={aside}
      />
      <figcaption className="mt-1.5 text-xs text-muted-foreground">
        {image.caption}
        {image.credit ? ` — ${image.credit}` : ""}
      </figcaption>
    </figure>
  );
}
