// Opens a clean, printable copy of one lesson in a new window.
//
// Printing the page itself would carry the whole dashboard onto the paper,
// so this builds a standalone document containing just the lesson. Every
// value is escaped: lesson text is model-written and image credits come
// from third-party catalogues, so none of it is trusted as markup.

import { ageBandLabel, type LessonRow } from "@/lib/school/lesson-types";

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
  section { page-break-inside: avoid; }
  button { font: inherit; padding: 8px 16px; margin-bottom: 20px; cursor: pointer; }
  @media print { button { display: none; } body { margin: 0; } }
`;

export function printLesson(row: LessonRow): void {
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

  win.document.write(
    `<!doctype html><html><head><meta charset="utf-8">` +
      `<title>${escapeHtml(lesson.title)}</title>` +
      `<style>${STYLES}</style></head><body>` +
      `<button onclick="window.print()">Print / save as PDF</button>` +
      `<h1>${escapeHtml(lesson.title)}</h1>` +
      `<div class="meta">${escapeHtml(lesson.subject)} · ${escapeHtml(
        ageBandLabel(row.age_band)
      )}</div>` +
      `<p class="summary">${escapeHtml(lesson.summary)}</p>` +
      `<h3>By the end they can</h3><ul>${lesson.objectives
        .map((o) => `<li>${escapeHtml(o)}</li>`)
        .join("")}</ul>` +
      vocabulary +
      sections +
      `<h3>Activity</h3><div class="activity"><p><b>${escapeHtml(
        lesson.activity.title
      )}</b></p>${materials}${paragraphs(lesson.activity.instructions)}</div>` +
      `<h3>Questions</h3><ol>${lesson.questions
        .map(
          (q) =>
            `<li>${escapeHtml(q.question)}<br><span class="answer">${escapeHtml(
              q.answer
            )}</span></li>`
        )
        .join("")}</ol>` +
      discussion +
      `</body></html>`
  );
  win.document.close();
}
