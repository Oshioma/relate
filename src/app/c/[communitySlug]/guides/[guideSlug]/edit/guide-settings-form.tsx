"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFormDraft } from "@/lib/use-form-draft";
import type { EditorialGuideStatus, EditorialGuideUpdate } from "@/types/database";
import type { GuidePhoto } from "@/lib/guides/where-to-stay/types";
import { addGuideUpdate, deleteGuideUpdate, saveGuideSettings } from "./actions";

const inputClass = "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

function str(form: FormData, key: string): string {
  return String(form.get(key) ?? "").trim();
}

// Publish state, last-reviewed date, editor's note and the guide's hero
// photo. Uncontrolled fields with the house draft hook, so typing survives a
// refresh until it's saved.
export function GuideSettingsForm({
  communitySlug,
  guideSlug,
  status,
  lastReviewedOn,
  editorsNote,
  heroPhoto,
}: {
  communitySlug: string;
  guideSlug: string;
  status: EditorialGuideStatus;
  lastReviewedOn: string | null;
  editorsNote: string;
  heroPhoto: GuidePhoto | null;
}) {
  const { formRef, clearDraft } = useFormDraft(`editorial-guide-settings:${communitySlug}:${guideSlug}`);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const heroSrc = str(form, "hero_src");
    const payload = {
      status: str(form, "status"),
      lastReviewedOn: str(form, "last_reviewed_on") || null,
      editorsNote: str(form, "editors_note"),
      heroPhoto: heroSrc
        ? {
            src: heroSrc,
            alt: str(form, "hero_alt"),
            caption: str(form, "hero_caption"),
            credit: str(form, "hero_credit"),
            licence: str(form, "hero_licence"),
            licenceUrl: str(form, "hero_licence_url") || null,
            sourceUrl: str(form, "hero_source_url"),
            identificationStatus: str(form, "hero_status") === "unverified" ? "unverified" : "secure",
            width: Number(str(form, "hero_width")) || undefined,
          }
        : null,
    };
    startTransition(async () => {
      const result = await saveGuideSettings(communitySlug, guideSlug, payload);
      if ("error" in result) {
        setMessage({ tone: "error", text: result.error });
        return;
      }
      clearDraft();
      setMessage({ tone: "ok", text: "Guide settings saved." });
      router.refresh();
    });
  }

  return (
    <form ref={formRef} onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-foreground">Status</span>
          <select name="status" defaultValue={status} className={inputClass}>
            <option value="published">Published — anyone can read it</option>
            <option value="draft">Draft — staff only</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-foreground">Last reviewed by editors</span>
          <input type="date" name="last_reviewed_on" defaultValue={lastReviewedOn ?? ""} className={inputClass} />
        </label>
      </div>
      <label className="block">
        <span className="text-sm font-medium text-foreground">Editor&apos;s note (optional, shown near the top)</span>
        <textarea name="editors_note" rows={2} defaultValue={editorsNote} className={inputClass} />
      </label>
      <details className="rounded-lg border border-border p-4">
        <summary className="cursor-pointer text-sm font-semibold text-foreground">Top hero photograph</summary>
        <p className="mt-1 text-xs text-muted-foreground">Leave the URL empty to use the built-in hero. Only use real photographs of Zanzibar that you have the right to publish.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="block sm:col-span-2"><span className="text-xs font-medium text-muted-foreground">Image URL</span><input type="url" name="hero_src" defaultValue={heroPhoto?.src ?? ""} className={inputClass} /></label>
          <label className="block sm:col-span-2"><span className="text-xs font-medium text-muted-foreground">Alt text</span><input name="hero_alt" defaultValue={heroPhoto?.alt ?? ""} className={inputClass} /></label>
          <label className="block sm:col-span-2"><span className="text-xs font-medium text-muted-foreground">Caption</span><input name="hero_caption" defaultValue={heroPhoto?.caption ?? ""} className={inputClass} /></label>
          <label className="block"><span className="text-xs font-medium text-muted-foreground">Credit</span><input name="hero_credit" defaultValue={heroPhoto?.credit ?? ""} className={inputClass} /></label>
          <label className="block"><span className="text-xs font-medium text-muted-foreground">Licence</span><input name="hero_licence" defaultValue={heroPhoto?.licence ?? ""} className={inputClass} /></label>
          <label className="block"><span className="text-xs font-medium text-muted-foreground">Licence URL</span><input type="url" name="hero_licence_url" defaultValue={heroPhoto?.licenceUrl ?? ""} className={inputClass} /></label>
          <label className="block"><span className="text-xs font-medium text-muted-foreground">Source page</span><input type="url" name="hero_source_url" defaultValue={heroPhoto?.sourceUrl ?? ""} className={inputClass} /></label>
          <label className="block"><span className="text-xs font-medium text-muted-foreground">Identification</span>
            <select name="hero_status" defaultValue={heroPhoto?.identificationStatus ?? "secure"} className={inputClass}><option value="secure">Secure</option><option value="unverified">Unverified</option></select>
          </label>
          <label className="block"><span className="text-xs font-medium text-muted-foreground">Original width (px)</span><input type="number" name="hero_width" defaultValue={heroPhoto?.width ?? ""} className={inputClass} /></label>
        </div>
      </details>
      {message && <p role="status" className={message.tone === "error" ? "text-sm text-danger" : "text-sm text-accent"}>{message.text}</p>}
      <Button type="submit" disabled={pending}>
        <Save className="h-4 w-4" /> {pending ? "Saving…" : "Save settings"}
      </Button>
    </form>
  );
}

const KIND_OPTIONS: { value: EditorialGuideUpdate["kind"]; label: string }[] = [
  { value: "restaurant", label: "New restaurant / restaurant news" },
  { value: "beach_access", label: "Beach access change" },
  { value: "accommodation", label: "New accommodation" },
  { value: "seasonal", label: "Seasonal conditions" },
  { value: "event", label: "Local event" },
  { value: "road", label: "Road or transport disruption" },
  { value: "other", label: "Other" },
];

// Short, dated "local knowledge" notes shown under a destination. Each can
// expire, so old notes stop presenting themselves as current conditions.
export function GuideUpdatesManager({
  communitySlug,
  guideSlug,
  destinations,
  updates,
}: {
  communitySlug: string;
  guideSlug: string;
  destinations: { key: string; name: string }[];
  updates: EditorialGuideUpdate[];
}) {
  const { formRef, clearDraft } = useFormDraft(`editorial-guide-update:${communitySlug}:${guideSlug}`);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);
  const nameFor = (key: string | null) => destinations.find((d) => d.key === key)?.name ?? "Whole guide";

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const payload = {
      destinationKey: str(form, "destination_key") || null,
      kind: str(form, "kind"),
      body: str(form, "body"),
      notedOn: str(form, "noted_on") || today,
      expiresOn: str(form, "expires_on") || null,
    };
    startTransition(async () => {
      const result = await addGuideUpdate(communitySlug, guideSlug, payload);
      if ("error" in result) {
        setMessage({ tone: "error", text: result.error });
        return;
      }
      clearDraft();
      formEl.reset();
      setMessage({ tone: "ok", text: "Update added." });
      router.refresh();
    });
  }

  function remove(id: string) {
    if (!window.confirm("Remove this update?")) return;
    startTransition(async () => {
      const result = await deleteGuideUpdate(communitySlug, guideSlug, id);
      if ("error" in result) setMessage({ tone: "error", text: result.error });
      router.refresh();
    });
  }

  return (
    <div className="space-y-5">
      <form ref={formRef} onSubmit={submit} className="space-y-3 rounded-lg border border-border p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">Destination</span>
            <select name="destination_key" defaultValue={destinations[0]?.key ?? ""} className={inputClass}>
              {destinations.map((d) => (
                <option key={d.key} value={d.key}>{d.name}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">Type</span>
            <select name="kind" defaultValue="other" className={inputClass}>
              {KIND_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">Noted on</span>
            <input type="date" name="noted_on" defaultValue={today} className={inputClass} />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">Hide after (optional)</span>
            <input type="date" name="expires_on" className={inputClass} />
          </label>
        </div>
        <label className="block">
          <span className="text-xs font-medium text-muted-foreground">Update (up to 600 characters)</span>
          <textarea name="body" rows={3} maxLength={600} className={inputClass} placeholder="e.g. The beach road into Jambiani is being resurfaced until the end of the month — allow extra time." />
        </label>
        {message && <p role="status" className={message.tone === "error" ? "text-sm text-danger" : "text-sm text-accent"}>{message.text}</p>}
        <Button type="submit" disabled={pending}>{pending ? "Adding…" : "Add update"}</Button>
      </form>

      {updates.length > 0 && (
        <ul className="divide-y divide-border rounded-lg border border-border">
          {updates.map((u) => (
            <li key={u.id} className="flex items-start justify-between gap-3 p-3 text-sm">
              <div>
                <p className="font-medium text-foreground">
                  {nameFor(u.destination_key)} · {KIND_OPTIONS.find((o) => o.value === u.kind)?.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  Noted {u.noted_on}
                  {u.expires_on && <> · {u.expires_on < today ? "expired" : "hides after"} {u.expires_on}</>}
                </p>
                <p className="mt-1 text-foreground/90">{u.body}</p>
              </div>
              <button type="button" onClick={() => remove(u.id)} aria-label="Remove update" className="rounded p-1 text-danger hover:bg-muted">
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
