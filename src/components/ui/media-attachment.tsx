import { Paperclip } from "lucide-react";
import { isImageUrl, isVideoUrl, fileNameFromUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";

// Renders an uploaded attachment appropriately for its type: images inline,
// videos with a player, everything else as a named download link.
export function MediaAttachment({ url, className }: { url: string; className?: string }) {
  if (isImageUrl(url)) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt="" className={cn("max-h-96 rounded-md border border-border", className)} />;
  }
  if (isVideoUrl(url)) {
    return <video controls preload="metadata" src={url} className={cn("max-h-96 w-full rounded-md border border-border", className)} />;
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:border-accent hover:text-foreground",
        className
      )}
    >
      <Paperclip className="h-3.5 w-3.5 shrink-0" />
      {fileNameFromUrl(url)}
    </a>
  );
}
