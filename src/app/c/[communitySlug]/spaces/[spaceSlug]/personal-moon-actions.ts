"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isValidCivil, isValidTimeZone, parseIsoDate } from "@/lib/true-calendar/dates";
import { HIGHLIGHT_KINDS, periodWording } from "@/lib/true-calendar/personal-moon";
import { parseTime } from "@/lib/true-calendar/zodiac";

// Personal Moon birth details: one private row per member. Every write is the
// signed-in member's own row (row security refuses anything else anyway).

export type BirthSaveResult = { ok: true } | { error: string };

function refresh(spacePath: string) {
  if (/^\/c\/[a-z0-9-]+\/spaces\/[a-z0-9-]+$/i.test(spacePath)) revalidatePath(spacePath);
}

const clean = (v: FormDataEntryValue | null, max: number) => {
  const s = typeof v === "string" ? v.trim() : "";
  return s ? s.slice(0, max) : null;
};

export async function saveBirthProfile(spacePath: string, form: FormData): Promise<BirthSaveResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be signed in." };

  const date = parseIsoDate(clean(form.get("birth_date"), 10));
  if (!date || !isValidCivil(date) || date.year < 1700 || date.year > 2200) return { error: "Enter your date of birth (between 1700 and 2200)." };
  const timeText = clean(form.get("birth_time"), 5);
  if (timeText && !parseTime(timeText)) return { error: "Enter the birth time as hours and minutes, e.g. 14:30, or leave it empty." };
  const birthTz = clean(form.get("birth_time_zone"), 80);
  if (birthTz && !isValidTimeZone(birthTz)) return { error: "That birthplace timezone isn't recognised." };
  const displayTz = clean(form.get("display_time_zone"), 80);
  if (displayTz && !isValidTimeZone(displayTz)) return { error: "That timezone isn't recognised." };

  const wording: Record<string, { title: string; guidance: string }> = {};
  for (const k of HIGHLIGHT_KINDS) {
    const title = clean(form.get(`${k}_title`), 80);
    const guidance = clean(form.get(`${k}_guidance`), 600);
    if (title || guidance) wording[k] = { title: title ?? "", guidance: guidance ?? "" };
  }
  // Keep only wording that differs from ours, so a later change to our
  // defaults reaches everyone who didn't customise.
  const merged = periodWording(wording);
  const custom: Record<string, { title: string; guidance: string }> = {};
  for (const k of HIGHLIGHT_KINDS) if (wording[k]) custom[k] = merged[k];

  const { error } = await supabase.from("calendar_birth_profiles").upsert(
    {
      user_id: user.id,
      birth_date: clean(form.get("birth_date"), 10)!,
      birth_time: timeText,
      birth_place: clean(form.get("birth_place"), 200),
      birth_time_zone: birthTz,
      display_time_zone: displayTz,
      period_wording: custom,
    },
    { onConflict: "user_id" }
  );
  if (error) return { error: /relation .* does not exist|calendar_birth_profiles/.test(error.message) ? "Personal Moon isn't switched on yet: the database update hasn't been applied." : "Couldn't save your details. Please try again." };
  refresh(spacePath);
  return { ok: true };
}

export async function deleteBirthProfile(spacePath: string): Promise<BirthSaveResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be signed in." };
  const { error } = await supabase.from("calendar_birth_profiles").delete().eq("user_id", user.id);
  if (error) return { error: "Couldn't delete your details. Please try again." };
  refresh(spacePath);
  return { ok: true };
}
