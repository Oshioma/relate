// Typographic styling for rendered rich text (Terms, Privacy, community
// guidelines, contact info). RichText delegates HTML content to <SafeHtml>,
// which emits raw tags — and Tailwind's preflight resets headings, lists and
// paragraph spacing to nothing. These descendant-variant classes restore
// readable formatting so a pasted document keeps its headings, bullets and
// spacing on the page. Pass as RichText's className; safe on the Markdown path
// too (it already styles itself; these just reinforce it).
export const PROSE_CLASS = [
  "space-y-3",
  "[&_h1]:text-xl [&_h1]:font-semibold [&_h1]:text-foreground [&_h1]:mt-6",
  "[&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-6",
  "[&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-4",
  "[&_h4]:text-sm [&_h4]:font-semibold [&_h4]:text-foreground [&_h4]:mt-4",
  "[&_p]:leading-relaxed",
  "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1",
  "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1",
  "[&_li]:leading-relaxed",
  "[&_a]:text-accent [&_a]:underline",
  "[&_strong]:font-semibold [&_b]:font-semibold",
  "[&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground",
  "[&_hr]:my-6 [&_hr]:border-border",
  "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs",
].join(" ");
