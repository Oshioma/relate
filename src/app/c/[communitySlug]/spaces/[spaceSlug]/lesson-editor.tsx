"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SUBJECTS, type StoredLesson, type Subject } from "@/lib/school/lesson-types";

// Hand-editing a written lesson. The model gets things wrong, and a teaching
// library nobody can correct is one nobody trusts.
//
// Pictures are deliberately not editable here — they are found, not written.
// The lesson page has "Find pictures" and a Remove on each one; this keeps them
// on the draft untouched so an edit never silently drops them.

const field =
  "w-full min-w-0 rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground " +
  "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
      {children}
    </h4>
  );
}

function RemoveButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="mt-1 shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-danger"
    >
      <X className="h-3.5 w-3.5" />
    </button>
  );
}

function AddButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <Button type="button" size="sm" variant="secondary" onClick={onClick} className="justify-self-start">
      <Plus className="h-3.5 w-3.5" />
      {children}
    </Button>
  );
}

// A list of plain strings — objectives, discussion prompts, materials.
function StringList({
  values,
  placeholder,
  addLabel,
  onChange,
}: {
  values: string[];
  placeholder: string;
  addLabel: string;
  onChange: (next: string[]) => void;
}) {
  return (
    <div className="grid gap-2">
      {values.map((value, i) => (
        <div key={i} className="flex items-start gap-2">
          <input
            className={field}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(values.map((v, j) => (j === i ? e.target.value : v)))}
          />
          <RemoveButton onClick={() => onChange(values.filter((_, j) => j !== i))} label="Remove" />
        </div>
      ))}
      <AddButton onClick={() => onChange([...values, ""])}>{addLabel}</AddButton>
    </div>
  );
}

export function LessonEditor({
  lesson,
  saving,
  onCancel,
  onSave,
}: {
  lesson: StoredLesson;
  saving: boolean;
  onCancel: () => void;
  onSave: (next: StoredLesson) => void;
}) {
  const [draft, setDraft] = useState<StoredLesson>(lesson);

  // Drops the empty rows someone left behind rather than saving blanks.
  function clean(next: StoredLesson): StoredLesson {
    return {
      ...next,
      objectives: (next.objectives ?? []).filter((o) => o.trim()),
      discussion: (next.discussion ?? []).filter((d) => d.trim()),
      vocabulary: (next.vocabulary ?? []).filter((v) => v.word.trim()),
      questions: (next.questions ?? []).filter((q) => q.question.trim()),
      sections: (next.sections ?? []).filter((s) => s.heading.trim() || s.body.trim()),
      activity: {
        ...next.activity,
        materials: (next.activity?.materials ?? []).filter((m) => m.trim()),
      },
    };
  }

  return (
    <div className="grid gap-5">
      <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
        <div>
          <FieldLabel>Title</FieldLabel>
          <input
            className={field}
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          />
        </div>
        <div>
          <FieldLabel>Subject</FieldLabel>
          <select
            className={field}
            value={draft.subject}
            onChange={(e) => setDraft({ ...draft, subject: e.target.value as Subject })}
          >
            {SUBJECTS.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <FieldLabel>Summary</FieldLabel>
        <textarea
          className={`${field} min-h-[72px] resize-y`}
          value={draft.summary}
          onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
        />
      </div>

      <div>
        <FieldLabel>By the end they can</FieldLabel>
        <StringList
          values={draft.objectives ?? []}
          placeholder="They will be able to…"
          addLabel="Add"
          onChange={(objectives) => setDraft({ ...draft, objectives })}
        />
      </div>

      <div>
        <FieldLabel>Words to know</FieldLabel>
        <div className="grid gap-2">
          {(draft.vocabulary ?? []).map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <input
                className={`${field} sm:max-w-[200px]`}
                placeholder="Word"
                value={item.word}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    vocabulary: draft.vocabulary.map((v, j) =>
                      j === i ? { ...v, word: e.target.value } : v
                    ),
                  })
                }
              />
              <input
                className={field}
                placeholder="What it means"
                value={item.meaning}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    vocabulary: draft.vocabulary.map((v, j) =>
                      j === i ? { ...v, meaning: e.target.value } : v
                    ),
                  })
                }
              />
              <RemoveButton
                label="Remove word"
                onClick={() =>
                  setDraft({ ...draft, vocabulary: draft.vocabulary.filter((_, j) => j !== i) })
                }
              />
            </div>
          ))}
          <AddButton
            onClick={() =>
              setDraft({ ...draft, vocabulary: [...(draft.vocabulary ?? []), { word: "", meaning: "" }] })
            }
          >
            Add word
          </AddButton>
        </div>
      </div>

      <div>
        <FieldLabel>Teaching sections</FieldLabel>
        <div className="grid gap-3">
          {(draft.sections ?? []).map((section, i) => (
            <div key={i} className="rounded-lg border border-border bg-muted p-3">
              <div className="mb-2 flex items-start gap-2">
                <span className="mt-1.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-card text-[11px] font-semibold text-muted-foreground">
                  {i + 1}
                </span>
                <input
                  className={field}
                  placeholder="Heading"
                  value={section.heading}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      sections: draft.sections.map((s, j) =>
                        j === i ? { ...s, heading: e.target.value } : s
                      ),
                    })
                  }
                />
                <RemoveButton
                  label="Remove section"
                  onClick={() =>
                    setDraft({ ...draft, sections: draft.sections.filter((_, j) => j !== i) })
                  }
                />
              </div>
              <textarea
                className={`${field} min-h-[120px] resize-y leading-relaxed`}
                placeholder="What you teach here. Blank line between paragraphs."
                value={section.body}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    sections: draft.sections.map((s, j) =>
                      j === i ? { ...s, body: e.target.value } : s
                    ),
                  })
                }
              />
              {section.image && (
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  Picture kept: {section.image.title}
                </p>
              )}
            </div>
          ))}
          <AddButton
            onClick={() =>
              setDraft({
                ...draft,
                sections: [
                  ...(draft.sections ?? []),
                  { heading: "", body: "", image_query: "", image: null },
                ],
              })
            }
          >
            Add section
          </AddButton>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-muted p-4">
        <FieldLabel>Activity</FieldLabel>
        <div className="grid gap-2">
          <input
            className={field}
            placeholder="Activity title"
            value={draft.activity?.title ?? ""}
            onChange={(e) =>
              setDraft({ ...draft, activity: { ...draft.activity, title: e.target.value } })
            }
          />
          <textarea
            className={`${field} min-h-[100px] resize-y`}
            placeholder="Steps to follow"
            value={draft.activity?.instructions ?? ""}
            onChange={(e) =>
              setDraft({ ...draft, activity: { ...draft.activity, instructions: e.target.value } })
            }
          />
          <div>
            <p className="mb-1.5 text-[11px] text-muted-foreground">Materials</p>
            <StringList
              values={draft.activity?.materials ?? []}
              placeholder="Something you need"
              addLabel="Add"
              onChange={(materials) =>
                setDraft({ ...draft, activity: { ...draft.activity, materials } })
              }
            />
          </div>
        </div>
      </div>

      <div>
        <FieldLabel>Questions</FieldLabel>
        <div className="grid gap-2">
          {(draft.questions ?? []).map((item, i) => (
            <div key={i} className="rounded-lg border border-border bg-muted p-3">
              <div className="mb-2 flex items-start gap-2">
                <input
                  className={field}
                  placeholder="Question"
                  value={item.question}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      questions: draft.questions.map((q, j) =>
                        j === i ? { ...q, question: e.target.value } : q
                      ),
                    })
                  }
                />
                <RemoveButton
                  label="Remove question"
                  onClick={() =>
                    setDraft({ ...draft, questions: draft.questions.filter((_, j) => j !== i) })
                  }
                />
              </div>
              <input
                className={field}
                placeholder="Answer"
                value={item.answer}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    questions: draft.questions.map((q, j) =>
                      j === i ? { ...q, answer: e.target.value } : q
                    ),
                  })
                }
              />
            </div>
          ))}
          <AddButton
            onClick={() =>
              setDraft({ ...draft, questions: [...(draft.questions ?? []), { question: "", answer: "" }] })
            }
          >
            Add question
          </AddButton>
        </div>
      </div>

      <div>
        <FieldLabel>Talk about it</FieldLabel>
        <StringList
          values={draft.discussion ?? []}
          placeholder="An open question"
          addLabel="Add"
          onChange={(discussion) => setDraft({ ...draft, discussion })}
        />
      </div>

      <div className="flex items-center gap-2 border-t border-border pt-4">
        <Button
          type="button"
          size="sm"
          onClick={() => onSave(clean(draft))}
          disabled={saving || draft.title.trim().length === 0}
        >
          {saving ? "Saving…" : "Save changes"}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
