import { Fragment } from "react";

// Renders guide copy that refers to other parts of the page: `{dest:paje}`
// becomes a link to the Paje section (named as the destination is currently
// named), `{tides}` a link to the community's tides page. Unknown tokens are
// left as their plain words, so a renamed key degrades to text, not a 404.
export function LinkedText({
  text,
  names,
  tidesHref,
}: {
  text: string;
  names: Record<string, string>;
  tidesHref: string | null;
}) {
  const parts = text.split(/(\{dest:[a-z-]+\}|\{tides\})/g);
  return (
    <>
      {parts.map((part, i) => {
        const dest = part.match(/^\{dest:([a-z-]+)\}$/);
        if (dest) {
          const name = names[dest[1]];
          if (!name) return <Fragment key={i}>{dest[1]}</Fragment>;
          return (
            <a key={i} href={`#${dest[1]}`} className="font-medium text-accent hover:underline">
              {name}
            </a>
          );
        }
        if (part === "{tides}") {
          return tidesHref ? (
            <a key={i} href={tidesHref} className="font-medium text-accent hover:underline">
              Tides &amp; Weather
            </a>
          ) : (
            <Fragment key={i}>tides</Fragment>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

// The same copy as plain text, for structured data and meta descriptions.
export function plainText(text: string, names: Record<string, string>): string {
  return text.replace(/\{dest:([a-z-]+)\}/g, (_, key: string) => names[key] ?? key).replace(/\{tides\}/g, "Tides & Weather");
}
