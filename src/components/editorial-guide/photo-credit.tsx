import type { GuidePhoto } from "@/lib/guides/where-to-stay/types";

// A guide photo's caption and credit, linked to its source and licence. Kept
// free of server-only imports so the photo viewer (a client component) can
// use it too.
export function PhotoCredit({ photo }: { photo: GuidePhoto }) {
  return (
    <>
      {/[.!?)”"]$/.test(photo.caption.trim()) || !photo.caption.trim() ? photo.caption : `${photo.caption.trim()}.`}{" "}
      {/* Wraps like any text: long credits ("… (official website)") would
          otherwise push a phone-width page sideways. */}
      <span className="[overflow-wrap:anywhere]">
        Photo:{" "}
        <a href={photo.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline">
          {photo.credit}
        </a>
        ,{" "}
        {photo.licenceUrl ? (
          <a href={photo.licenceUrl} target="_blank" rel="noopener noreferrer license" className="underline-offset-2 hover:underline">
            {photo.licence}
          </a>
        ) : (
          photo.licence
        )}
      </span>
    </>
  );
}
