"use client";

import { useActionState, useCallback, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { saveEmailTemplate, type EmailTemplateState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { RichEditor } from "@/components/ui/rich-editor";
import { ImageUpload } from "@/components/ui/image-upload";
import { clearFormDraft, useFormDraftRef } from "@/lib/use-form-draft";
import { EMAIL_TEMPLATE_INFO, EMAIL_TEMPLATE_STARTERS, renderCommunityEmail } from "@/lib/email-templates";
import type { CommunityEmailTemplate, CommunityEmailTemplateKind } from "@/types/database";

// One of a community's three emails, edited in place. The words are rich text
// (pictures allowed); the logo and banner are uploaded beside them. Whatever is
// typed is kept in this browser until it is saved or put back to standard.
export function EmailTemplateForm({
  kind,
  communityId,
  communitySlug,
  communityName,
  communityLogoUrl,
  saved,
}: {
  kind: CommunityEmailTemplateKind;
  communityId: string;
  communitySlug: string;
  communityName: string;
  communityLogoUrl: string | null;
  saved: CommunityEmailTemplate | null;
}) {
  const info = EMAIL_TEMPLATE_INFO[kind];
  const start = saved ?? { ...EMAIL_TEMPLATE_STARTERS[kind], logo_url: null, banner_url: null, enabled: true };
  const draftKey = `email-template:${communityId}:${kind}`;
  // A save or a reset makes the stored version the truth again, so the draft
  // goes before the refreshed page can restore it over the top.
  const [state, formAction, pending] = useActionState<EmailTemplateState, FormData>(async (prev, formData) => {
    const result = await saveEmailTemplate(prev, formData);
    if (result && "ok" in result && result.ok !== "tested") clearFormDraft(draftKey);
    return result;
  }, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  const [logoUrl, setLogoUrl] = useState<string | null>(start.logo_url);
  const [bannerUrl, setBannerUrl] = useState<string | null>(start.banner_url);
  // The two rich editors keep their text in React, so a restored draft is
  // handed back as their starting value and the editors remounted to take it.
  const [bodySeed, setBodySeed] = useState(start.body_html);
  const [footerSeed, setFooterSeed] = useState(start.footer_html);
  const [editorKey, setEditorKey] = useState(0);
  const bodyMirrorRef = useRef<HTMLInputElement>(null);
  const footerMirrorRef = useRef<HTMLInputElement>(null);
  const lastBodyRef = useRef(start.body_html);
  const lastFooterRef = useRef(start.footer_html);
  const [preview, setPreview] = useState<{ subject: string; html: string } | null>(null);

  const onRestore = useCallback((values: Record<string, string | string[]>) => {
    if (typeof values.logo_url === "string") setLogoUrl(values.logo_url || null);
    if (typeof values.banner_url === "string") setBannerUrl(values.banner_url || null);
    let remount = false;
    if (typeof values.body_draft === "string") {
      lastBodyRef.current = values.body_draft;
      if (bodyMirrorRef.current) bodyMirrorRef.current.value = values.body_draft;
      setBodySeed(values.body_draft);
      remount = true;
    }
    if (typeof values.footer_draft === "string") {
      lastFooterRef.current = values.footer_draft;
      if (footerMirrorRef.current) footerMirrorRef.current.value = values.footer_draft;
      setFooterSeed(values.footer_draft);
      remount = true;
    }
    if (remount) setEditorKey((k) => k + 1);
  }, []);
  const { saveNow } = useFormDraftRef(formRef, draftKey, { onRestore });

  function setPicture(which: "logo" | "banner", url: string | null) {
    flushSync(() => (which === "logo" ? setLogoUrl(url) : setBannerUrl(url)));
    saveNow();
  }

  function showPreview() {
    const form = formRef.current;
    if (!form) return;
    const data = new FormData(form);
    setPreview(
      renderCommunityEmail({
        template: {
          kind,
          subject: String(data.get("subject") ?? ""),
          body_html: String(data.get("body_html") ?? ""),
          footer_html: String(data.get("footer_html") ?? ""),
          button_label: String(data.get("button_label") ?? ""),
          logo_url: logoUrl,
          banner_url: bannerUrl,
        },
        communityName,
        communityLogoUrl,
        values: { firstName: "Amina", hostName: "Niko Dey", hostEmail: "host@example.com" },
        buttonUrl: "#",
      })
    );
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-4 rounded-lg border border-border bg-card p-4">
      <input type="hidden" name="community_id" value={communityId} />
      <input type="hidden" name="community_slug" value={communitySlug} />
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="logo_url" value={logoUrl ?? ""} data-draft />
      <input type="hidden" name="banner_url" value={bannerUrl ?? ""} data-draft />
      {/* Draft-only mirrors of the two rich editors, so a refresh restores them; the action ignores them. */}
      <input ref={bodyMirrorRef} type="hidden" name="body_draft" defaultValue={start.body_html} data-draft />
      <input ref={footerMirrorRef} type="hidden" name="footer_draft" defaultValue={start.footer_html} data-draft />

      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-foreground">{info.title}</h3>
          <p className="text-sm text-muted-foreground">{info.description}</p>
        </div>
        <span
          className={
            saved
              ? "rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent"
              : "rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
          }
        >
          {saved ? "Your wording" : "Standard email"}
        </span>
      </div>

      {info.hasToggle && (
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <input type="checkbox" name="enabled" defaultChecked={start.enabled} className="h-4 w-4" />
          Enable welcome email
        </label>
      )}

      <div>
        <Label htmlFor={`${kind}_subject`}>Subject</Label>
        <Input id={`${kind}_subject`} name="subject" maxLength={300} defaultValue={start.subject} required />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Logo at the top</Label>
          <ImageUpload
            key={logoUrl ?? "none"}
            bucket="community-assets"
            basePath={`${communityId}/email-${kind}-logo`}
            currentUrl={logoUrl ?? communityLogoUrl}
            onUploaded={(url) => setPicture("logo", url)}
            shape="square"
            size={64}
            label="Upload logo"
            hint={logoUrl ? undefined : "Uses the community logo until you upload one."}
          />
          {logoUrl && (
            <button type="button" onClick={() => setPicture("logo", null)} className="mt-1 text-xs text-muted-foreground hover:text-foreground">
              Use the community logo instead
            </button>
          )}
        </div>
        <div>
          <Label>Banner picture (optional)</Label>
          <ImageUpload
            key={bannerUrl ?? "none"}
            bucket="community-assets"
            basePath={`${communityId}/email-${kind}-banner`}
            currentUrl={bannerUrl}
            onUploaded={(url) => setPicture("banner", url)}
            shape="square"
            size={64}
            aspect={2}
            label="Upload banner"
            hint="A wide picture under the logo, about 1200 × 600."
          />
          {bannerUrl && (
            <button type="button" onClick={() => setPicture("banner", null)} className="mt-1 text-xs text-muted-foreground hover:text-foreground">
              Remove banner
            </button>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor={`${kind}_body`}>The email</Label>
        <RichEditor
          key={`body-${editorKey}`}
          id={`${kind}_body`}
          name="body_html"
          rows={8}
          allowMedia
          defaultValue={bodySeed}
          onChange={(value) => {
            // Fires on mount too; only a real change is worth a save.
            if (value === lastBodyRef.current) return;
            lastBodyRef.current = value;
            if (bodyMirrorRef.current) bodyMirrorRef.current.value = value;
            saveNow();
          }}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          The picture button adds photos in the text. Videos can&apos;t play in an inbox, so add a link to them instead.
        </p>
      </div>

      <div>
        <Label htmlFor={`${kind}_button`}>Button</Label>
        <Input id={`${kind}_button`} name="button_label" maxLength={80} defaultValue={start.button_label} placeholder={info.defaultButton} />
        <p className="mt-1 text-xs text-muted-foreground">
          {kind === "welcome" ? "Takes them to the community." : "Opens their invitation."}
        </p>
      </div>

      <div>
        <Label htmlFor={`${kind}_footer`}>Under the button (optional)</Label>
        <RichEditor
          key={`footer-${editorKey}`}
          id={`${kind}_footer`}
          name="footer_html"
          rows={3}
          defaultValue={footerSeed}
          onChange={(value) => {
            if (value === lastFooterRef.current) return;
            lastFooterRef.current = value;
            if (footerMirrorRef.current) footerMirrorRef.current.value = value;
            saveNow();
          }}
        />
      </div>

      <div className="rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
        <p className="mb-1 font-medium text-foreground">Placeholders, filled in for each person:</p>
        <ul className="space-y-0.5">
          {info.placeholders.map((p) => (
            <li key={p.token}>
              <code className="text-foreground">{p.token}</code> — {p.meaning}
            </li>
          ))}
        </ul>
      </div>

      {state && "error" in state && <p className="text-sm text-danger">{state.error}</p>}
      {state && "ok" in state && <p className="text-sm text-accent">{state.message}</p>}

      <div className="flex flex-wrap gap-2">
        <Button type="submit" name="intent" value="save" disabled={pending}>
          {pending ? "Working…" : "Save"}
        </Button>
        <Button type="button" variant="secondary" onClick={showPreview}>
          Preview
        </Button>
        <Button type="submit" name="intent" value="test" variant="secondary" disabled={pending} formNoValidate>
          Send me a test
        </Button>
        {saved && (
          <Button type="submit" name="intent" value="reset" variant="ghost" disabled={pending} formNoValidate>
            Use the standard email
          </Button>
        )}
      </div>

      {preview && (
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-foreground">
              <span className="text-muted-foreground">Subject:</span> {preview.subject}
            </p>
            <button type="button" onClick={() => setPreview(null)} className="text-xs text-muted-foreground hover:text-foreground">
              Close preview
            </button>
          </div>
          <iframe
            title={`${info.title} preview`}
            srcDoc={preview.html}
            sandbox=""
            className="h-[640px] w-full rounded-md border border-border bg-white"
          />
          <p className="text-xs text-muted-foreground">The preview fills the placeholders with sample names.</p>
        </div>
      )}
    </form>
  );
}
