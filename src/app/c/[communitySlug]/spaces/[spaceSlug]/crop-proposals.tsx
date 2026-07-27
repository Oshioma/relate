"use client";

import { useActionState, useState } from "react";
import { Sprout, Plus, X, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/ui/image-upload";
import { CROP_CATEGORIES } from "@/lib/crop-categories";
import { proposeCrop, approveCropProposal, rejectCropProposal, deleteCropProposal, type CropProposalFormState } from "./crop-guides-actions";
import { CropImageAiButtons } from "./crop-image-ai-buttons";
import type { ProposalWithAuthor } from "@/lib/data/crop-guides";

type Ctx = { communityId: string; communitySlug: string; spaceSlug: string };

const inputCls =
  "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

function authorName(a: { full_name: string | null; username: string } | null): string {
  return a?.full_name || a?.username || "A member";
}

export function CropProposals({
  ctx,
  proposals,
  viewerId,
  canPropose,
  isStaff,
  imageGenEnabled,
}: {
  ctx: Ctx;
  proposals: ProposalWithAuthor[];
  viewerId: string;
  canPropose: boolean;
  isStaff: boolean;
  imageGenEnabled: boolean;
}) {
  const [showForm, setShowForm] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  // Controlled so the AI image buttons can use the crop's name as their prompt.
  const [commonName, setCommonName] = useState("");
  const [scientificName, setScientificName] = useState("");
  // Stable per-mount id so re-picking a photo overwrites the same object rather
  // than orphaning the previous upload.
  const [uploadKey] = useState(() => Math.random().toString(36).slice(2, 10));
  const [state, formAction] = useActionState<CropProposalFormState, FormData>(proposeCrop, undefined);

  const pending = proposals.filter((p) => p.status === "pending");
  // Members see the board for transparency; the loudest signal is pending review.
  const visible = isStaff ? proposals : proposals.filter((p) => p.status !== "rejected" || p.created_by);

  const hidden = <>
    <input type="hidden" name="community_id" value={ctx.communityId} />
    <input type="hidden" name="community_slug" value={ctx.communitySlug} />
    <input type="hidden" name="space_slug" value={ctx.spaceSlug} />
  </>;

  return (
    <section className="mb-5 rounded-lg border border-dashed border-border p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
            <Sprout className="h-4 w-4 text-accent" />
            Propose a crop
            {isStaff && pending.length > 0 && <Badge tone="accent">{pending.length} to review</Badge>}
          </h2>
          <p className="text-xs text-muted-foreground">Missing a crop? Suggest it — an admin reviews it and adds it to the library.</p>
        </div>
        {canPropose && (
          <Button type="button" size="sm" onClick={() => setShowForm((v) => !v)} className="w-auto">
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? "Cancel" : "Suggest a crop"}
          </Button>
        )}
      </div>

      {showForm && (
        <form action={formAction} className="mt-4 space-y-3 rounded-md border border-border p-4">
          {hidden}
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">Common name</span>
              <input name="common_name" required value={commonName} onChange={(e) => setCommonName(e.target.value)} className={inputCls} placeholder="e.g. Moringa" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">Scientific name</span>
              <input name="scientific_name" value={scientificName} onChange={(e) => setScientificName(e.target.value)} className={inputCls} placeholder="e.g. Moringa oleifera" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">Category</span>
              <select name="category" className={inputCls} defaultValue="vegetables">
                {CROP_CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">Edible part</span>
              <input name="edible_part" className={inputCls} placeholder="e.g. Leaf, pod" />
            </label>
          </div>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">Overview</span>
            <textarea name="overview" rows={2} className={inputCls} placeholder="A sentence or two about the crop" />
          </label>
          <div>
            <span className="mb-1 block text-xs font-medium text-muted-foreground">Photo (optional)</span>
            <input type="hidden" name="image_url" value={imageUrl ?? ""} />
            <ImageUpload
              // Remount when the URL changes so the thumbnail reflects AI results.
              key={imageUrl ?? "empty"}
              bucket="uploads"
              basePath={`${viewerId}/crop-proposals/${uploadKey}`}
              currentUrl={imageUrl}
              shape="square"
              size={72}
              label="photo"
              onUploaded={(url) => setImageUrl(url)}
            />
            <CropImageAiButtons
              commonName={commonName}
              scientificName={scientificName}
              generateEnabled={imageGenEnabled}
              onImage={(url) => setImageUrl(url)}
            />
          </div>
          {state?.error && <p className="text-sm text-danger">{state.error}</p>}
          <Button type="submit" size="sm" className="w-auto">
            Submit for review
          </Button>
        </form>
      )}

      {visible.length > 0 && (
        <ul className="mt-4 space-y-2">
          {visible.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border bg-card p-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-foreground">{p.common_name}</span>
                {p.scientific_name && <span className="text-xs italic text-muted-foreground">{p.scientific_name}</span>}
                {p.status === "pending" && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    Pending
                  </span>
                )}
                {p.status === "approved" && p.crop_id && (
                  <Badge tone="accent">Added</Badge>
                )}
                {p.status === "rejected" && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <XCircle className="h-3 w-3" />
                    Not added
                  </span>
                )}
                <span className="text-xs text-muted-foreground">· {authorName(p.author)}</span>
              </div>

              <div className="flex items-center gap-2">
                {isStaff && p.status === "pending" && (
                  <>
                    <form action={approveCropProposal}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="community_slug" value={ctx.communitySlug} />
                      <input type="hidden" name="space_slug" value={ctx.spaceSlug} />
                      <button type="submit" className="flex items-center gap-1 text-xs font-medium text-accent hover:underline">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Approve
                      </button>
                    </form>
                    <form action={rejectCropProposal}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="community_slug" value={ctx.communitySlug} />
                      <input type="hidden" name="space_slug" value={ctx.spaceSlug} />
                      <button type="submit" className="text-xs font-medium text-muted-foreground hover:text-danger">
                        Reject
                      </button>
                    </form>
                  </>
                )}
                {(isStaff || p.status === "pending") && (
                  <form action={deleteCropProposal}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="community_slug" value={ctx.communitySlug} />
                    <input type="hidden" name="space_slug" value={ctx.spaceSlug} />
                    <button type="submit" className="text-muted-foreground hover:text-danger" aria-label="Remove">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </form>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
