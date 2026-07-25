"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, getProfile } from "@/lib/data/profile";
import type { TemplateDefaultItem } from "@/lib/template-defaults";

// Replaces the whole default-spaces list for one community type. The control
// panel sends the full desired list on every edit; we delete this template's
// rows and re-insert in order. RLS also restricts writes to super admins, but
// the explicit check turns a silently-empty write into a clear error.
export async function saveTemplateDefaultSpaces(
  templateKey: string,
  items: TemplateDefaultItem[]
): Promise<{ error: string } | undefined> {
  const supabase = await createClient();

  const user = await getCurrentUser(supabase);
  if (!user) return { error: "You need to be signed in." };
  const profile = await getProfile(supabase, user.id);
  if (!profile?.is_super_admin) return { error: "Only a platform super admin can edit type defaults." };

  const del = await supabase.from("template_default_spaces").delete().eq("template_key", templateKey);
  if (del.error) return { error: del.error.message };

  if (items.length) {
    const ins = await supabase.from("template_default_spaces").insert(
      items.map((it, i) => ({
        template_key: templateKey,
        name: it.name,
        description: it.description,
        space_type: it.space_type,
        builtin_key: it.builtin_key,
        show_in_nav: it.show_in_nav,
        sort_order: i,
      }))
    );
    if (ins.error) return { error: ins.error.message };
  }

  revalidatePath("/platform-admin");
  return undefined;
}
