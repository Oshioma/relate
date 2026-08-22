import { cn } from "@/lib/utils";

// A cover photo cropped the way one screen size will crop it.
//
// Without this the crop controls are a guess: the phone setting can't change
// anything on a laptop (it lives behind `sm:`), and the wide setting can't
// change anything on a phone — so whichever one you're choosing, the header
// behind the popover sits there unmoved and the control reads as broken. The
// preview is the part that actually answers "what will this look like".
//
// `aspect` is the shape of the header being stood in for: roughly 2.9 for the
// wide band, roughly 1.15 for a phone's nearly-square one.
export function CoverCropPreview({
  url,
  positionClass,
  aspect,
  className,
}: {
  url: string;
  positionClass: string;
  aspect: number;
  className?: string;
}) {
  return (
    <div
      className={cn("overflow-hidden rounded border border-border bg-muted", className)}
      style={{ aspectRatio: aspect }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt="" className={cn("h-full w-full object-cover", positionClass)} />
    </div>
  );
}
