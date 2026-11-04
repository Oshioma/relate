import { RichText } from "./rich-text";
import { htmlToPlainText, looksLikeHtml } from "./safe-html";
import { PROSE_CLASS } from "@/lib/prose";
import { cn } from "@/lib/utils";

// Text someone wrote in a box that is (or used to be) a plain textarea: a
// bio, a community or membership description. Newer text comes from the rich
// text editor as HTML and is shown with its bold, lists and links; older plain
// text keeps its paragraphs and line breaks.
export function UserText({ text, className }: { text: string; className?: string }) {
  if (looksLikeHtml(text)) return <RichText content={text} className={cn(PROSE_CLASS, className)} />;
  return <p className={cn("whitespace-pre-line", className)}>{text}</p>;
}

// The same text as one plain line, for small previews (cards, search, share
// text) where formatting has no room.
export function userTextPreview(text: string | null | undefined): string {
  const value = text ?? "";
  return looksLikeHtml(value) ? htmlToPlainText(value) : value;
}
