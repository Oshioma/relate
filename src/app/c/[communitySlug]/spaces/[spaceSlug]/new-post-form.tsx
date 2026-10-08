"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { createPost } from "./actions";
import { Input, Label } from "@/components/ui/input";
import { RichEditor } from "@/components/ui/rich-editor";
import { SubmitButton } from "@/components/ui/submit-button";
import { Avatar } from "@/components/ui/avatar";
import { readDraftRaw, removeDraft, writeDraft } from "@/lib/use-form-draft";
import { MAX_POST_TAGS } from "@/lib/post-media";
import { PostImagePicker, type CropPhotoOption, type FarmCropPhotoOption } from "./post-image-picker";

interface NewPostFormProps {
  communityId: string;
  spaceId: string;
  communitySlug: string;
  spaceSlug: string;
  /** Community crop-guide photos the author can borrow an image from. */
  crops?: CropPhotoOption[];
  /** The member's own "My Crops" (farm) photos. */
  myCrops?: FarmCropPhotoOption[];
  /** The current member's avatar, offered as a one-tap photo source. */
  avatarUrl?: string | null;
  authorName?: string | null;
}

interface PostDraft {
  title: string;
  body: string;
  tags: string;
  postType: string;
  mediaUrls: string[];
}

const EMPTY: PostDraft = { title: "", body: "", tags: "", postType: "discussion", mediaUrls: [] };

const isEmpty = (d: PostDraft) => !d.title && !d.body && !d.tags && d.mediaUrls.length === 0;

// Nothing else writes this key mid-visit, so there's nothing to subscribe to.
const noSubscription = () => () => {};

function parseDraft(raw: string): PostDraft | null {
  if (!raw) return null;
  try {
    const draft = { ...EMPTY, ...(JSON.parse(raw) as Partial<PostDraft>) };
    return isEmpty(draft) ? null : draft;
  } catch {
    return null;
  }
}

export function NewPostForm({
  communityId,
  spaceId,
  communitySlug,
  spaceSlug,
  crops = [],
  myCrops = [],
  avatarUrl = null,
  authorName = null,
}: NewPostFormProps) {
  const draftKey = `post:${spaceId}`;
  // One draft per space, kept as it's typed and put back after a refresh.
  // Read as an external store: nothing on the server or during hydration,
  // the saved draft afterwards — so there's no mismatch and no effect.
  const savedRaw = useSyncExternalStore(noSubscription, () => readDraftRaw(draftKey), () => "");
  const saved = useMemo(() => parseDraft(savedRaw), [savedRaw]);
  // The feed's composer bar links here with #new-post: arriving that way, or
  // with a draft waiting, opens the composer straight away.
  const cameForComposer = useSyncExternalStore(noSubscription, () => window.location.hash === "#new-post", () => false);

  // What's been typed this visit; until then, the saved draft.
  const [edited, setEdited] = useState<PostDraft | null>(null);
  const draft = edited ?? saved ?? EMPTY;
  const [expandedChoice, setExpandedChoice] = useState<boolean | null>(null);
  const expanded = expandedChoice ?? (Boolean(saved) || cameForComposer);
  // Bumped when the draft is cleared, so the rich editor — which keeps its
  // own copy of the text — remounts empty.
  const [editorKey, setEditorKey] = useState(0);
  const [error, setError] = useState<string | null>(null);

  function update(patch: Partial<PostDraft>) {
    const next = { ...draft, ...patch };
    setEdited(next);
    if (isEmpty(next)) removeDraft(draftKey);
    else writeDraft(draftKey, next);
  }

  function reset() {
    setEdited(EMPTY);
    setEditorKey((k) => k + 1);
    removeDraft(draftKey);
  }

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await createPost(undefined, formData);
    if (result?.error) {
      setError(result.error);
    } else {
      // Posted, so the draft has done its job.
      reset();
      setExpandedChoice(false);
    }
  }

  // Collapsed, the composer is a friendly one-line prompt so the feed leads with
  // members' posts, not an empty form. Clicking it opens the full composer.
  if (!expanded) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
        <Avatar src={avatarUrl} name={authorName} size={36} />
        <button
          type="button"
          onClick={() => setExpandedChoice(true)}
          className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:border-accent/50 hover:text-foreground"
        >
          Share something with the community…
        </button>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-3 rounded-lg border border-border bg-card p-4">
      <input type="hidden" name="community_id" value={communityId} />
      <input type="hidden" name="space_id" value={spaceId} />
      <input type="hidden" name="community_slug" value={communitySlug} />
      <input type="hidden" name="space_slug" value={spaceSlug} />
      <input type="hidden" name="media_urls" value={JSON.stringify(draft.mediaUrls)} />

      <div className="flex items-start gap-3">
        <Avatar src={avatarUrl} name={authorName} size={36} className="mt-0.5" />
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <Label htmlFor="title">Title</Label>
            {/* Autofocus on expand so the member can start typing straight away. */}
            <Input
              id="title"
              name="title"
              placeholder="What's on your mind?"
              required
              autoFocus
              value={draft.title}
              onChange={(e) => update({ title: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="body">Details (optional)</Label>
            <RichEditor
              key={editorKey}
              id="body"
              name="body"
              rows={3}
              placeholder="Say more…"
              defaultValue={draft.body}
              onChange={(body) => update({ body })}
            />
          </div>

          <div>
            <Label htmlFor="tags">Tags (optional)</Label>
            <Input
              id="tags"
              name="tags"
              placeholder="e.g. Chillies, First harvest"
              value={draft.tags}
              onChange={(e) => update({ tags: e.target.value })}
            />
            <p className="mt-1 text-xs text-muted-foreground">Separate with commas — up to {MAX_POST_TAGS}.</p>
          </div>
        </div>
      </div>

      <PostImagePicker
        mediaUrls={draft.mediaUrls}
        onChange={(mediaUrls) => update({ mediaUrls })}
        crops={crops}
        myCrops={myCrops}
        avatarUrl={avatarUrl}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <select
          name="post_type"
          value={draft.postType}
          onChange={(e) => update({ postType: e.target.value })}
          className="rounded-md border border-border bg-card px-2.5 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="discussion">Discussion</option>
          <option value="announcement">Announcement</option>
          <option value="resource">Resource</option>
        </select>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              // Cancel means "I don't want this" — the draft goes with it.
              reset();
              setExpandedChoice(false);
              setError(null);
            }}
            className="rounded-md px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Cancel
          </button>
          <SubmitButton pendingText="Posting…" className="w-auto">
            Post
          </SubmitButton>
        </div>
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}
    </form>
  );
}
