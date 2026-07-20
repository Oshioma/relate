"use client";

import { useActionState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { upsertBusinessProfile, deleteBusinessProfile, type BusinessFormState } from "./actions";
import { Input, Textarea, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ui/image-upload";
import { createClient } from "@/lib/supabase/client";
import type { BusinessProfile } from "@/types/database";

export function BusinessForm({ profileId, business }: { profileId: string; business: BusinessProfile | null }) {
  const [state, formAction] = useActionState<BusinessFormState, FormData>(upsertBusinessProfile, undefined);
  const [isDeleting, startDelete] = useTransition();
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const router = useRouter();

  async function handleLogoUploaded(url: string) {
    const supabase = createClient();
    await supabase.from("business_profiles").update({ logo_url: url }).eq("profile_id", profileId);
    router.refresh();
  }

  function handleDelete() {
    setDeleteError(null);
    startDelete(async () => {
      const result = await deleteBusinessProfile();
      if (result.error) setDeleteError(result.error);
      else router.refresh();
    });
  }

  return (
    <div className="space-y-8">
      {business && (
        <div>
          <Label>Logo</Label>
          <div className="mt-2">
            <ImageUpload
              bucket="avatars"
              basePath={`${profileId}/business-logo`}
              currentUrl={business.logo_url}
              onUploaded={handleLogoUploaded}
              shape="square"
              label="Business logo"
            />
          </div>
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <div>
          <Label htmlFor="business_name">Business name</Label>
          <Input id="business_name" name="business_name" defaultValue={business?.business_name ?? ""} required placeholder="Acme Studio" />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" rows={3} defaultValue={business?.description ?? ""} placeholder="What does your business do?" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="website">Website</Label>
            <Input id="website" name="website" type="text" defaultValue={business?.website ?? ""} placeholder="example.com" />
          </div>
          <div>
            <Label htmlFor="industry">Industry</Label>
            <Input id="industry" name="industry" defaultValue={business?.industry ?? ""} placeholder="Design & Architecture" />
          </div>
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" defaultValue={business?.location ?? ""} placeholder="Zanzibar, Tanzania" />
        </div>

        <div>
          <Label htmlFor="services">Services (comma-separated)</Label>
          <Input id="services" name="services" defaultValue={(business?.services ?? []).join(", ")} placeholder="Consulting, Design, Training" />
        </div>

        <div>
          <Label htmlFor="products">Products (comma-separated)</Label>
          <Input id="products" name="products" defaultValue={(business?.products ?? []).join(", ")} placeholder="Course, Toolkit" />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-foreground">Contact</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="contact_email">Email</Label>
              <Input id="contact_email" name="contact_email" type="email" defaultValue={business?.contact_links.email ?? ""} placeholder="hello@acme.com" />
            </div>
            <div>
              <Label htmlFor="contact_phone">Phone</Label>
              <Input id="contact_phone" name="contact_phone" defaultValue={business?.contact_links.phone ?? ""} placeholder="+255…" />
            </div>
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-foreground">Social links</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="social_linkedin">LinkedIn</Label>
              <Input id="social_linkedin" name="social_linkedin" type="text" defaultValue={business?.social_links.linkedin ?? ""} placeholder="linkedin.com/company/…" />
            </div>
            <div>
              <Label htmlFor="social_twitter">Twitter / X</Label>
              <Input id="social_twitter" name="social_twitter" type="text" defaultValue={business?.social_links.twitter ?? ""} placeholder="x.com/…" />
            </div>
            <div>
              <Label htmlFor="social_instagram">Instagram</Label>
              <Input id="social_instagram" name="social_instagram" type="text" defaultValue={business?.social_links.instagram ?? ""} placeholder="instagram.com/…" />
            </div>
            <div>
              <Label htmlFor="social_facebook">Facebook</Label>
              <Input id="social_facebook" name="social_facebook" type="text" defaultValue={business?.social_links.facebook ?? ""} placeholder="facebook.com/…" />
            </div>
          </div>
        </div>

        {state?.error && <p className="text-sm text-danger">{state.error}</p>}

        <div className="flex items-center gap-3">
          <SubmitButton pendingText="Saving…" className="w-auto">
            {business ? "Save business profile" : "Create business profile"}
          </SubmitButton>
          {business && (
            <Button type="button" variant="ghost" onClick={handleDelete} disabled={isDeleting} className="text-danger">
              {isDeleting ? "Removing…" : "Remove business profile"}
            </Button>
          )}
        </div>
        {deleteError && <p className="text-sm text-danger">{deleteError}</p>}
      </form>
    </div>
  );
}
