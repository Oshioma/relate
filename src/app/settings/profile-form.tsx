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

        {state?.error && <p className="text-sm text-danger">{state.error}</p>}

        <SubmitButton pendingText="Saving…" className="w-auto">
          Save changes
        </SubmitButton>
      </form>
    </div>
  );
}
