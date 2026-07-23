const URL_PATTERN = /(https?:\/\/[^\s]+)/g;
// No `g` flag here — a global regex's .test() carries lastIndex state
// across calls, which would make this alternate wrong/right on repeated use.
const IS_URL = /^https?:\/\//;

// Renders plain text with any http(s) URL turned into a clickable link —
// e.g. the "Source: <url>" line AI event discovery appends to a
// description, which was previously inert plain text.
export function Linkify({ text, className }: { text: string; className?: string }) {
  const parts = text.split(URL_PATTERN);

  return (
    <p className={className} style={{ whiteSpace: "pre-line" }}>
      {parts.map((part, i) =>
        IS_URL.test(part) ? (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noreferrer"
            className="text-accent hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {part}
          </a>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </p>
  );
}
