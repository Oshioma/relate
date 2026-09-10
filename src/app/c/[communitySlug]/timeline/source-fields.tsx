"use client";

import { useEffect } from "react";
import { BookMarked, Quote } from "lucide-react";
import { Input, Textarea, Label } from "@/components/ui/input";
import { DateFields } from "./date-fields";
import { LinkFillBox } from "./link-fill-box";
import type { LinkedSource } from "@/lib/timeline/source-link";
import { todayIso, type SourceDraft } from "@/lib/timeline/draft";
import {
  TIMELINE_SOURCE_TYPES,
  WIKIPEDIA_SOURCE_TYPE,
  AI_CHAT_SOURCE_TYPE,
  sourceTierLabel,
  sourceTypeHint,
  sourceTypeWantsAccessDate,
} from "@/lib/timeline/taxonomy";

// ONE SOURCE, described.
//
// The form asks different questions of different kinds of source, because a
// Wikipedia article and an excavation report are not described by the same
// boxes. A Wikipedia citation needs the article title, the URL, WHICH SECTION,
// and — the one nobody remembers — the date it was read, because the article
// will have changed by the time anybody checks. An excavation report needs an
// author, a publisher and a page.
//
// What does NOT change with the kind of source: none of this is a score. The
// tier line says "Encyclopedia / Tertiary source" because that is a fact about
// what kind of document it is, in exactly the way "book" and "interview" are.
// It is shown so a learner can see how far they are standing from the evidence,
// and the wording is chosen so it cannot be read as a mark out of ten.

const QUOTATION_MAX = 2000;

export function SourceFields({
  value,
  onChange,
  onCancel,
  communitySlug,
  /** "Search existing instead" makes no sense in the underlying-source panel, which has already chosen. */
  cancelLabel = "Search existing instead",
  heading = "A new source",
}: {
  value: SourceDraft;
  onChange: (next: SourceDraft) => void;
  onCancel: () => void;
  communitySlug: string;
  cancelLabel?: string;
  heading?: string;
}) {
  const isWikipedia = value.source_type === WIKIPEDIA_SOURCE_TYPE;
  const isChat = value.source_type === AI_CHAT_SOURCE_TYPE;
  const tier = sourceTierLabel(value.source_type);
  const wantsAccessDate = sourceTypeWantsAccessDate(value.source_type) || Boolean(value.url?.trim());

  function update(patch: Partial<SourceDraft>) {
    onChange({ ...value, ...patch });
  }

  // A page that can be edited needs the date it was read, and nobody has ever
  // typed one voluntarily. Fill today in the moment the kind of source says it
  // matters — still editable, because "I read this in March" is a real answer.
  useEffect(() => {
    if (!wantsAccessDate) return;
    if (value.accessed_on) return;
    onChange({ ...value, accessed_on: todayIso() });
    // Only when the kind of source (or the presence of a link) changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wantsAccessDate]);

  // Paste a link, get a filled-in form. It fills; it never submits — page
  // metadata is often thin or wrong, and the person pasting knows more about
  // what they are citing than the page's <meta> tags do.
  function fillFromLink(found: LinkedSource): string[] {
    const got: string[] = [];
    if (found.title) got.push("title");
    if (found.author) got.push("author");
    if (found.publisher) got.push("publisher");
    if (found.published) got.push("its own date");
    // A shared conversation has no author and no publication date — its text is
    // the whole of it, so that is what comes back and what gets said.
    if (found.excerpt) got.push("the conversation itself");

    update({
      url: found.url,
      // Never overwrite something already typed — a contributor who has
      // corrected the title should not lose it to a second fetch.
      title: value.title.trim() || found.title,
      author: value.author?.trim() || found.author || "",
      publisher: value.publisher?.trim() || found.publisher || "",
      source_type: found.sourceType,
      quotation: value.quotation?.trim() || found.excerpt || "",
      // A link that was read just now HAS been accessed just now.
      accessed_on: value.accessed_on ?? todayIso(),
      published: found.published
        ? {
            mode: "calendar",
            year: found.published.year,
            era: "CE",
            month: found.published.month,
            day: found.published.day,
            unit: "million",
          }
        : value.published ?? null,
    });
    return got;
  }

  return (
    <div className="space-y-3 rounded-lg border border-border bg-background/60 p-3.5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-foreground">{heading}</p>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          {cancelLabel}
        </button>
      </div>

      {/* Start from the link. A video or a wiki page has its title, its author
          and its own publication date written into it already — asking somebody
          to retype all three is how a timeline ends up full of unsourced
          dates. */}
      <LinkFillBox
        communitySlug={communitySlug}
        label="Paste a link and we'll fill this in"
        hint="Optional — you can type the details yourself instead. Nothing is saved until you finish the form."
        onFilled={fillFromLink}
      />

      <div>
        <Label>Kind of source</Label>
        <select
          aria-label="Kind of source"
          value={value.source_type}
          onChange={(event) => update({ source_type: event.target.value })}
          className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {TIMELINE_SOURCE_TYPES.map((type) => (
            <option key={type.key} value={type.key}>
              {type.label}
            </option>
          ))}
        </select>
        {sourceTypeHint(value.source_type) && (
          <p className="mt-1 text-xs text-muted-foreground">{sourceTypeHint(value.source_type)}</p>
        )}
        {/* THE CLASSIFICATION, STATED. Wikipedia gets its own sentence because
            its classification is the thing people get wrong: an encyclopedia
            entry is a summary of other people's work, so it is never a primary
            source and never an academic or peer-reviewed one, however good the
            article is. Saying so here is a research lesson in one line. */}
        {isWikipedia ? (
          <p className="mt-1 text-xs text-muted-foreground">
            Filed as <span className="font-medium text-foreground">Encyclopedia / Tertiary source</span> — never as a
            primary, academic or peer-reviewed one. That is a fact about what an encyclopedia entry is, not a comment on
            how good this article is.
          </p>
        ) : (
          tier && (
            <p className="mt-1 text-xs text-muted-foreground">
              Filed as <span className="font-medium text-foreground">{tier}</span> — what kind of document it is, not
              how good it is.
            </p>
          )
        )}
      </div>

      <div>
        <Label>{isWikipedia ? "Wikipedia article title" : "Source title"}</Label>
        <Input
          aria-label={isWikipedia ? "Wikipedia article title" : "Source title"}
          value={value.title}
          onChange={(event) => update({ title: event.target.value })}
          placeholder={isWikipedia ? "e.g. Great Pyramid of Giza" : "e.g. The Complete Pyramids"}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {/* Wikipedia has no single author and its publisher is always the same
            two words. Asking for both produces either a blank or a guess, so
            the article's own questions are asked instead. */}
        {!isWikipedia && (
          <>
            <div>
              <Label>Author</Label>
              <Input aria-label="Author" value={value.author ?? ""} onChange={(event) => update({ author: event.target.value })} />
            </div>
            <div>
              <Label>Publisher or publication</Label>
              <Input
                aria-label="Publisher or publication"
                value={value.publisher ?? ""}
                onChange={(event) => update({ publisher: event.target.value })}
              />
            </div>
            <div>
              <Label>Book or document it&apos;s in</Label>
              <Input
                aria-label="Book or document it's in"
                value={value.work_title ?? ""}
                onChange={(event) => update({ work_title: event.target.value })}
              />
            </div>
          </>
        )}

        <div>
          <Label>{isWikipedia ? "Relevant section of the article" : "Page or reference"}</Label>
          <Input
            aria-label={isWikipedia ? "Relevant section of the article" : "Page or reference"}
            value={value.reference ?? ""}
            onChange={(event) => update({ reference: event.target.value })}
            placeholder={isWikipedia ? "e.g. Dating and construction" : "p. 108"}
          />
          {isWikipedia && (
            <p className="mt-1 text-xs text-muted-foreground">
              Optional. Which part of the article the date comes from.
            </p>
          )}
        </div>

        <div>
          <Label>{isWikipedia ? "Wikipedia URL" : "Link"}</Label>
          <Input
            aria-label={isWikipedia ? "Wikipedia URL" : "Link"}
            value={value.url ?? ""}
            onChange={(event) => update({ url: event.target.value })}
            placeholder="https://…"
          />
        </div>

        {wantsAccessDate && (
          <div>
            <Label>Date you read it</Label>
            <Input
              type="date"
              aria-label="Date you read it"
              value={value.accessed_on ?? ""}
              onChange={(event) => update({ accessed_on: event.target.value || null })}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {isWikipedia
                ? "Wikipedia changes. Whoever checks this later needs to know which version you read."
                : "A web page can change under a citation. The access date is what makes it checkable."}
            </p>
          </div>
        )}
      </div>

      {/* Kept visibly apart from the date the source is being cited FOR. */}
      {!isWikipedia && (
        <div className="rounded-lg bg-muted/60 p-3">
          <SourcePublishedFields value={value} update={update} />
        </div>
      )}

      <div>
        <Label>
          <span className="inline-flex items-center gap-1.5">
            <Quote className="h-3.5 w-3.5" /> Quotation or extract (optional)
          </span>
        </Label>
        <Textarea
          aria-label="Quotation or extract"
          rows={isChat ? 8 : 3}
          maxLength={QUOTATION_MAX}
          value={value.quotation ?? ""}
          onChange={(event) => update({ quotation: event.target.value.slice(0, QUOTATION_MAX) })}
          placeholder="“Radiocarbon determinations from the mortar cluster around 2560 BCE…”"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {isChat
            ? "Pasting a chat link fills this with the conversation. Trim it to the part that actually matters — "
            : "The sentence the date actually rests on, in the source’s own words. An extract, not a copy — "}
          {QUOTATION_MAX.toLocaleString()} characters at most
          {value.quotation ? ` (${value.quotation.length.toLocaleString()} used)` : ""}.
        </p>
      </div>

      <div>
        <Label>Notes about this source</Label>
        <Textarea
          aria-label="Notes about this source"
          rows={2}
          value={value.notes ?? ""}
          onChange={(event) => update({ notes: event.target.value })}
        />
      </div>

      {/* The nudge that makes the whole chain worth having. Deliberately not a
          warning and not a blocker: Wikipedia is a fine place to start, and the
          only thing wrong with stopping there is that you stopped. */}
      {isWikipedia && (
        <div className="flex gap-2.5 rounded-lg border border-border bg-muted/40 p-3">
          <BookMarked className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
          <div className="text-xs text-muted-foreground">
            <p className="text-sm font-semibold text-foreground">Can you find the original source?</p>
            <p className="mt-1">
              Wikipedia is a summary of other people&apos;s work, and it lists that work at the bottom of the article.
              Scroll to the references and see where the date actually comes from — a book, a paper, an excavation
              report. Once this source is saved you can add that one underneath it, and the chain will be there for the
              next person.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/** When the source itself was made — never the same field as the date it is cited for. */
function SourcePublishedFields({
  value,
  update,
}: {
  value: SourceDraft;
  update: (patch: Partial<SourceDraft>) => void;
}) {
  return (
    <>
      <DateFields
        label="When was the source itself made?"
        hint="Optional — and not the same thing as when the event happened."
        value={value.published ?? { mode: "calendar", era: "CE", month: null, day: null, unit: "million" }}
        onChange={(next) => update({ published: next })}
      />
      <label className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
        <input
          type="checkbox"
          checked={value.published_is_approximate}
          onChange={(event) => update({ published_is_approximate: event.target.checked })}
          className="h-4 w-4 rounded border-border"
        />
        The source&apos;s own date is approximate
      </label>
      <p className="mt-2 text-xs text-muted-foreground">
        A chronicle written 80 years after a battle is still evidence — but knowing the gap is part of reading it.
      </p>
    </>
  );
}
