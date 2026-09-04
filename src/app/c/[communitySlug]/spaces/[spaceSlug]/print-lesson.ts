// Opens a clean, printable copy of one lesson in a new window.
//
// Two audiences, one document. The teacher's copy is the whole lesson,
// answer key included. The pack that goes home is the same material with the
// answers withheld — printing the key and sending it home with the questions
// defeats the point — plus whatever the teacher asked for and when it's due.
//
// Printing the page itself would carry the whole dashboard onto the paper,
// so this builds a standalone document containing just the lesson. Every
// value is escaped: lesson text is model-written and image credits come
// from third-party catalogues, so none of it is trusted as markup.

import { ageBandLabel, formatDueDate, type LessonRow } from "@/lib/school/lesson-types";

function escapeHtml(value: unknown): string {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[c] ?? c
  );
}

// Turns blank-line-separated text into paragraphs, escaping as it goes.
function paragraphs(value: string): string {
  return value
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${escapeHtml(p)}</p>`)
    .join("");
}

// Only ever emit an image whose URL is plainly http(s) — never a
// javascript: or data: URL that arrived from an external catalogue.
function safeImageUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:"
      ? parsed.toString()
      : null;
  } catch {
    return null;
  }
}

const STYLES = `
  body { font: 15px/1.6 Georgia, serif; max-width: 780px; margin: 40px auto;
         padding: 0 24px; color: #1f2933; }
  h1 { font-size: 30px; margin: 0 0 6px; }
  h2 { font-size: 20px; margin: 28px 0 8px; }
  h3 { font-size: 13px; text-transform: uppercase; letter-spacing: .12em;
       color: #6b7783; margin: 26px 0 8px; }
  .meta { color: #6b7783; font-size: 13px; margin-bottom: 22px; }
  .summary { font-style: italic; color: #46525d; }
  ul, ol { padding-left: 22px; }
  li { margin: 4px 0; }
  figure { margin: 12px 0; page-break-inside: avoid; }
  figure img { max-width: 100%; height: auto; border-radius: 6px; }
  figcaption { font-size: 11px; color: #8a95a0; margin-top: 4px; }
  .vocab { margin: 4px 0; }
  .vocab b { color: #1f2933; }
  .activity { background: #f4f8f5; padding: 14px 18px; border-radius: 8px;
              page-break-inside: avoid; }
  .answer { color: #6b7783; font-size: 13px; }
  .homework { border: 2px solid #1f2933; border-radius: 8px; padding: 14px 18px;
              margin-bottom: 24px; page-break-inside: avoid; }
  .homework h3 { margin-top: 0; }
  .due { font-weight: bold; }
  section { page-break-inside: avoid; }
  button { font: inherit; padding: 8px 16px; margin-bottom: 20px; cursor: pointer; }
  @media print { button { display: none; } body { margin: 0; } }
`;

export type PrintOptions = {
  // 'teacher' (the default) prints everything. 'home' withholds the answer key.
  audience?: "teacher" | "home";
  // Shown at the top of a pack going home, so the page itself says what to do.
  homework?: { note: string | null; due_on: string | null } | null;
};

export function printLesson(row: LessonRow, options: PrintOptions = {}): void {
  const forHome = options.audience === "home";
  const lesson = row.lesson;
  const win = window.open("", "_blank", "noopener,noreferrer");
  if (!win) return;

  const sections = lesson.sections
    .map((section, i) => {
      const url = section.image ? safeImageUrl(section.image.url) : null;
      const figure =
        url && section.image
          ? `<figure><img src="${escapeHtml(url)}" alt="${escapeHtml(
              section.image.title
            )}"><figcaption>${escapeHtml(
              section.image.sourceName
            )}${section.image.creator ? ` · ${escapeHtml(section.image.creator)}` : ""}${
              section.image.license ? ` · ${escapeHtml(section.image.license)}` : ""
            }</figcaption></figure>`
          : "";
      return `<section><h2>${i + 1}. ${escapeHtml(
        section.heading
      )}</h2>${figure}${paragraphs(section.body)}</section>`;
    })
    .join("");

  const vocabulary = lesson.vocabulary.length
    ? `<h3>Words to know</h3>${lesson.vocabulary
        .map(
          (v) =>
            `<div class="vocab"><b>${escapeHtml(v.word)}</b> — ${escapeHtml(
              v.meaning
            )}</div>`
        )
        .join("")}`
    : "";

  const materials = lesson.activity.materials.length
    ? `<p><b>You'll need:</b> ${escapeHtml(
        lesson.activity.materials.join(", ")
      )}</p>`
    : "";

  const discussion = lesson.discussion.length
    ? `<h3>Talk about it</h3><ul>${lesson.discussion
        .map((d) => `<li>${escapeHtml(d)}</li>`)
        .join("")}</ul>`
    : "";

  const homework = options.homework;
  const homeworkBanner =
    forHome && homework
      ? `<div class="homework"><h3>Homework</h3>${
          homework.note ? paragraphs(homework.note) : "<p>Read through this lesson together.</p>"
        }${
          homework.due_on
            ? `<p class="due">Due ${escapeHtml(formatDueDate(homework.due_on))}</p>`
            : ""
        }</div>`
      : "";

  win.document.write(
    `<!doctype html><html><head><meta charset="utf-8">` +
      `<title>${escapeHtml(lesson.title)}</title>` +
      `<style>${STYLES}</style></head><body>` +
      `<button onclick="window.print()">Print / save as PDF</button>` +
      `<h1>${escapeHtml(lesson.title)}</h1>` +
      `<div class="meta">${escapeHtml(lesson.subject)} · ${escapeHtml(
        ageBandLabel(row.age_band)
      )}</div>` +
      homeworkBanner +
      `<p class="summary">${escapeHtml(lesson.summary)}</p>` +
      `<h3>${forHome ? "What they'll get out of it" : "By the end they can"}</h3><ul>${lesson.objectives
        .map((o) => `<li>${escapeHtml(o)}</li>`)
        .join("")}</ul>` +
      vocabulary +
      sections +
      `<h3>Activity</h3><div class="activity"><p><b>${escapeHtml(
        lesson.activity.title
      )}</b></p>${materials}${paragraphs(lesson.activity.instructions)}</div>` +
      `<h3>Questions</h3><ol>${lesson.questions
        .map((q) =>
          forHome
            ? `<li>${escapeHtml(q.question)}</li>`
            : `<li>${escapeHtml(q.question)}<br><span class="answer">${escapeHtml(
                q.answer
              )}</span></li>`
        )
        .join("")}</ol>` +
      discussion +
      `</body></html>`
  );
  win.document.close();
}
