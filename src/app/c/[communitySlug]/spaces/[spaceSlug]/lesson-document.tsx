"use client";

import { cn } from "@/lib/utils";
import { ageBandLabel, ageBandTint, type LessonImage, type StoredLesson } from "@/lib/school/lesson-types";

// Renders one written lesson. Shared by the lesson page and the composer's
// live preview, so a teacher sees exactly what they are about to save.
//
// Every string here is model-written and every image credit comes from a
// third-party catalogue. React escapes all of it on the way in; the printable
// copy (print-lesson.ts) escapes by hand because it builds raw HTML.

export function AgeBadge({ band }: { band: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em]",
        ageBandTint(band)
      )}
    >
      {ageBandLabel(band)}
    </span>
  );
}

function LessonFigure({ image, onRemove }: { image: LessonImage; onRemove?: () => void }) {
  return (
    <figure className="mt-2 mb-1 overflow-hidden rounded-lg border border-border bg-muted">
      {/* Plain img: these come from many public catalogues, so there is no
          fixed host list to configure in next.config. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.url}
        alt={image.title}
        loading="lazy"
        className="max-h-[320px] w-full bg-muted object-cover"
      />
      <figcaption className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-[11px] text-muted-foreground">
        <span className="min-w-0 truncate">
          <a
            href={image.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            {image.sourceName}
          </a>
          {image.creator ? ` · ${image.creator}` : ""}
          {image.license ? ` · ${image.license}` : ""}
        </span>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="shrink-0 rounded-full px-2 py-0.5 font-medium transition-colors hover:bg-border hover:text-foreground"
          >
            Remove
          </button>
        )}
      </figcaption>
    </figure>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
      {children}
    </h4>
  );
}

// Model text arrives as blank-line-separated prose; render it as paragraphs
// rather than one block with newlines collapsed.
function Prose({ text }: { text: string }) {
  return (
    <div className="grid gap-2.5">
      {text
        .split(/\n\n+/)
        .map((p) => p.trim())
        .filter(Boolean)
        .map((paragraph, i) => (
          <p key={i} className="text-sm leading-relaxed text-foreground">
            {paragraph}
          </p>
        ))}
    </div>
  );
}

export function LessonDocument({
  lesson,
  onRemoveImage,
}: {
  lesson: StoredLesson;
  // Only passed when the viewer may edit — a picture that doesn't fit the
  // lesson is the most common thing a teacher wants to take out.
  onRemoveImage?: (sectionIndex: number) => void;
}) {
  return (
    <div className="grid gap-6">
      {lesson.summary && <p className="text-sm leading-relaxed text-muted-foreground">{lesson.summary}</p>}

      {lesson.objectives?.length > 0 && (
        <section>
          <Heading>By the end they can</Heading>
          <ul className="grid gap-1.5">
            {lesson.objectives.map((objective, i) => (
              <li key={i} className="flex gap-2 text-sm leading-relaxed text-foreground">
                <span className="text-muted-foreground">•</span>
                {objective}
              </li>
            ))}
          </ul>
        </section>
      )}

      {lesson.vocabulary?.length > 0 && (
        <section>
          <Heading>Words to know</Heading>
          <dl className="grid gap-2">
            {lesson.vocabulary.map((entry, i) => (
              <div key={i} className="rounded-md bg-muted px-3 py-2">
                <dt className="text-sm font-semibold text-foreground">{entry.word}</dt>
                <dd className="text-sm leading-relaxed text-muted-foreground">{entry.meaning}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {lesson.sections?.map((section, i) => (
        <section key={i}>
          <h3 className="mb-2 text-base font-semibold tracking-tight text-foreground">{section.heading}</h3>
          {section.image && (
            <LessonFigure image={section.image} onRemove={onRemoveImage ? () => onRemoveImage(i) : undefined} />
          )}
          <Prose text={section.body} />
        </section>
      ))}

      {lesson.activity && (
        <section className="rounded-lg border border-border bg-muted p-4">
          <Heading>Activity</Heading>
          <h3 className="mb-2 text-base font-semibold tracking-tight text-foreground">{lesson.activity.title}</h3>
          <Prose text={lesson.activity.instructions} />
          {lesson.activity.materials?.length > 0 && (
            <p className="mt-3 text-xs text-muted-foreground">
              <span className="font-semibold">You&apos;ll need:</span> {lesson.activity.materials.join(", ")}
            </p>
          )}
        </section>
      )}

      {lesson.questions?.length > 0 && (
        <section>
          <Heading>Check they understood</Heading>
          <ol className="grid gap-3">
            {lesson.questions.map((entry, i) => (
              <li key={i} className="text-sm leading-relaxed">
                <p className="font-medium text-foreground">
                  {i + 1}. {entry.question}
                </p>
                <p className="mt-0.5 text-muted-foreground">{entry.answer}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {lesson.discussion?.length > 0 && (
        <section>
          <Heading>Talk about it together</Heading>
          <ul className="grid gap-1.5">
            {lesson.discussion.map((prompt, i) => (
              <li key={i} className="flex gap-2 text-sm leading-relaxed text-foreground">
                <span className="text-muted-foreground">•</span>
                {prompt}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
