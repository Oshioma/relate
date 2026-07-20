"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile, type ProfileFormState } from "./actions";
import { Input, Textarea, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { ImageUpload } from "@/components/ui/image-upload";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction] = useActionState<ProfileFormState, FormData>(updateProfile, undefined);
  const router = useRouter();

  async function handleAvatarUploaded(url: string) {
    const supabase = createClient();
    await supabase.from("profiles").update({ avatar_url: url }).eq("id", profile.id);
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <div>
        <Label>Avatar</Label>
        <div className="mt-2">
          <ImageUpload
            bucket="avatars"
            basePath={`${profile.id}/avatar`}
            currentUrl={profile.avatar_url}
            onUploaded={handleAvatarUploaded}
            label="Avatar"
          />
        </div>
      </div>

      <form action={formAction} className="space-y-4">
        <div>
          <Label htmlFor="full_name">Full name</Label>
          <Input id="full_name" name="full_name" defaultValue={profile.full_name ?? ""} placeholder="Jane Doe" />
        </div>

        <div>
          <Label htmlFor="username">Username</Label>
          <Input id="username" name="username" defaultValue={profile.username} required minLength={3} maxLength={30} />
        </div>

        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" name="bio" rows={3} defaultValue={profile.bio ?? ""} placeholder="A little about you…" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="profession">Profession</Label>
            <Input id="profession" name="profession" defaultValue={profile.profession ?? ""} placeholder="Architect" />
          </div>
          <div>
            <Label htmlFor="company">Company</Label>
            <Input id="company" name="company" defaultValue={profile.company ?? ""} placeholder="Acme Studio" />
          </div>
        </div>

        <div>
          <Label htmlFor="website">Website</Label>
          <Input id="website" name="website" type="text" defaultValue={profile.website ?? ""} placeholder="example.com" />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-foreground">Social links</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input id="linkedin" name="linkedin" type="text" defaultValue={profile.social_links.linkedin ?? ""} placeholder="linkedin.com/in/…" />
            </div>
            <div>
              <Label htmlFor="twitter">Twitter / X</Label>
              <Input id="twitter" name="twitter" type="text" defaultValue={profile.social_links.twitter ?? ""} placeholder="x.com/…" />
            </div>
            <div>
              <Label htmlFor="instagram">Instagram</Label>
              <Input id="instagram" name="instagram" type="text" defaultValue={profile.social_links.instagram ?? ""} placeholder="instagram.com/…" />
            </div>
            <div>
              <Label htmlFor="facebook">Facebook</Label>
              <Input id="facebook" name="facebook" type="text" defaultValue={profile.social_links.facebook ?? ""} placeholder="facebook.com/…" />
            </div>
          </div>
        </div>

        {state?.error && <p className="text-sm text-danger">{state.error}</p>}

        <SubmitButton pendingText="Saving…" className="w-auto">
          Save changes
        </SubmitButton>
      </form>
    </div>
  );
}
