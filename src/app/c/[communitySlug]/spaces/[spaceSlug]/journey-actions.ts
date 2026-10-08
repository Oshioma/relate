"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getGuidedJourneyContext, type GuidedJourneyContext } from "@/lib/data/guided-journey";
import { copyGuidedJourneySpace, seedGuidedJourneySpace } from "@/lib/data/guided-journey-seed";
import { configFromForm, diffConfig, textToMilestones } from "@/lib/guided-journey/config-form";
import { HELP_MODE_OPTIONS, MENTOR_LEVELS, REPORT_REASONS } from "@/lib/guided-journey/config";
import { parseList } from "@/lib/guided-journey/matching";
import { slugify } from "@/lib/utils";
import type { JourneyHelpMode, JourneyReportReason, MentorLevel } from "@/types/database";

// Server actions for guided-journey spaces ("Adopt a Beginner").
//
// Authorisation lives in RLS and the SECURITY DEFINER functions of
// 20261008191453_guided_journey_tables.sql; these actions validate input,
// translate database errors into friendly sentences and revalidate the pages.
// Every form posts community_slug + space_slug so the action can load the
// same context the page used.

export type JourneyFormState = { error?: string; ok?: string } | undefined;

const text = (fd: FormData, name: string, max = 2000) => String(fd.get(name) ?? "").trim().slice(0, max);
const nullable = (fd: FormData, name: string, max = 2000) => text(fd, name, max) || null;

function photoList(fd: FormData, name: string, max = 10): string[] {
  try {
    const parsed: unknown = JSON.parse(String(fd.get(name) ?? "[]"));
    return Array.isArray(parsed)
      ? parsed.filter((u): u is string => typeof u === "string" && /^(https?:\/\/|\/)/.test(u)).slice(0, max)
      : [];
  } catch {
    return [];
  }
}

function helpMode(raw: FormDataEntryValue | null): JourneyHelpMode {
  const value = String(raw ?? "either");
  return HELP_MODE_OPTIONS.some((o) => o.value === value) ? (value as JourneyHelpMode) : "either";
}

function friendly(message: string): string {
  if (/row-level security|violates row-level/i.test(message)) {
    return "That isn't something you can do here — you may need to join the community first, or the other person may not be available.";
  }
  if (/uq_mentorship_requests_pending|duplicate key/i.test(message)) return "You've already asked — they'll get back to you.";
  return message;
}

async function load(fd: FormData): Promise<GuidedJourneyContext | null> {
  const supabase = await createClient();
  return getGuidedJourneyContext(supabase, text(fd, "community_slug", 200), text(fd, "space_slug", 200));
}

function refresh(ctx: GuidedJourneyContext) {
  revalidatePath(ctx.basePath, "layout");
}

// --- Onboarding ------------------------------------------------------------------

export async function saveBeginnerProfile(_prev: JourneyFormState, fd: FormData): Promise<JourneyFormState> {
  const ctx = await load(fd);
  if (!ctx) return { error: "This space couldn't be found." };
  if (!ctx.userId) return { error: "Please sign in first." };
  if (!ctx.isMember) return { error: "Join the community first, then come back to start." };
  if (fd.get("adult") !== "on") return { error: "Direct mentoring is for adults (18+) for now. Please confirm to continue." };

  const allowed = (values: string[], options: { value: string }[]) => values.filter((v) => options.some((o) => o.value === v));
  const { error } = await ctx.supabase.from("journey_beginner_profiles").upsert(
    {
      space_id: ctx.space.id,
      user_id: ctx.userId,
      country: nullable(fd, "country", 80),
      region: nullable(fd, "region", 120),
      approx_location: nullable(fd, "approx_location", 120),
      setting: allowed(fd.getAll("setting").map(String), ctx.config.questions.setting.options),
      interests: allowed(fd.getAll("interests").map(String), ctx.config.questions.interests.options),
      experience: allowed([text(fd, "experience", 60)], ctx.config.questions.experience.options)[0] ?? null,
      help_mode: helpMode(fd.get("help_mode")),
      languages: parseList(text(fd, "languages", 300), 8),
      space_photo_url: photoList(fd, "space_photo", 1)[0] ?? null,
      notes: nullable(fd, "notes", 2000),
      adult_confirmed_at: new Date().toISOString(),
    },
    { onConflict: "space_id,user_id" }
  );
  if (error) return { error: friendly(error.message) };
  refresh(ctx);
  redirect(`${ctx.basePath}/mentors?welcome=1`);
}

export async function saveMentorProfile(_prev: JourneyFormState, fd: FormData): Promise<JourneyFormState> {
  const ctx = await load(fd);
  if (!ctx) return { error: "This space couldn't be found." };
  if (!ctx.userId) return { error: "Please sign in first." };
  if (!ctx.isMember) return { error: "Join the community first, then come back to start." };
  if (fd.get("adult") !== "on") return { error: "Mentors need to be adults (18+). Please confirm to continue." };

  const capacity = Number(fd.get("capacity"));
  if (!Number.isInteger(capacity) || capacity < 1 || capacity > 20) return { error: "Choose how many people you can support." };
  const levelRaw = text(fd, "level", 40);
  const level: MentorLevel = MENTOR_LEVELS.some((l) => l.value === levelRaw) ? (levelRaw as MentorLevel) : "community";
  const years = text(fd, "years_experience", 3);
  const experience = [
    ...fd.getAll("experience").map(String).filter((v) => ctx.config.questions.interests.options.some((o) => o.value === v)),
    ...parseList(text(fd, "experience_other", 400), 12),
  ];
  const intro = text(fd, "intro", 2000);
  if (!intro) return { error: "Add a short introduction so beginners know who you are." };

  const { error } = await ctx.supabase.from("journey_mentor_profiles").upsert(
    {
      space_id: ctx.space.id,
      user_id: ctx.userId,
      level,
      experience,
      preferred_topics: parseList(text(fd, "preferred_topics", 400), 12),
      country: nullable(fd, "country", 80),
      region: nullable(fd, "region", 120),
      climate: nullable(fd, "climate", 120),
      years_experience: years && Number.isInteger(Number(years)) ? Math.min(90, Math.max(0, Number(years))) : null,
      languages: parseList(text(fd, "languages", 300), 8),
      help_mode: helpMode(fd.get("help_mode")),
      capacity,
      group_mentoring: fd.get("group_mentoring") === "on",
      availability: nullable(fd, "availability", 300),
      intro,
      photos: photoList(fd, "photos", 8),
      adult_confirmed_at: new Date().toISOString(),
    },
    { onConflict: "space_id,user_id" }
  );
  if (error) return { error: friendly(error.message) };
  refresh(ctx);
  redirect(`${ctx.basePath}/requests?mentor=1`);
}

export async function setMentorPaused(fd: FormData): Promise<void> {
  const ctx = await load(fd);
  if (!ctx?.userId) return;
  await ctx.supabase
    .from("journey_mentor_profiles")
    .update({ is_paused: fd.get("paused") === "true" })
    .eq("space_id", ctx.space.id)
    .eq("user_id", ctx.userId);
  refresh(ctx);
}

// --- Requests ----------------------------------------------------------------------

export async function requestAdoption(_prev: JourneyFormState, fd: FormData): Promise<JourneyFormState> {
  const ctx = await load(fd);
  if (!ctx?.userId) return { error: "Please sign in first." };
  const mentorId = text(fd, "mentor_id", 64);
  if (!mentorId) return { error: "Choose someone to ask." };
  const { error } = await ctx.supabase.from("mentorship_requests").insert({
    space_id: ctx.space.id,
    beginner_id: ctx.userId,
    mentor_id: mentorId,
    template_id: nullable(fd, "template_id", 64),
    requested_journey_id: nullable(fd, "requested_journey_id", 64),
    message: nullable(fd, "message", 2000),
  });
  if (error) return { error: friendly(error.message) };
  refresh(ctx);
  return { ok: "Request sent. They'll be notified and can accept or decline — nothing happens without their yes." };
}

export async function withdrawRequest(fd: FormData): Promise<void> {
  const ctx = await load(fd);
  if (!ctx?.userId) return;
  await ctx.supabase.rpc("withdraw_mentorship_request", { p_request_id: text(fd, "request_id", 64) });
  refresh(ctx);
}

export async function respondToRequest(_prev: JourneyFormState, fd: FormData): Promise<JourneyFormState> {
  const ctx = await load(fd);
  if (!ctx?.userId) return { error: "Please sign in first." };
  const accept = fd.get("decision") === "accept";
  const { data, error } = await ctx.supabase.rpc("respond_to_mentorship_request", {
    p_request_id: text(fd, "request_id", 64),
    p_accept: accept,
    p_message: nullable(fd, "message", 2000),
    p_group_journey_id: nullable(fd, "group_journey_id", 64),
    // Used only when the request names no template: the space's default list.
    p_milestones: ctx.config.defaultMilestones,
    p_default_title: ctx.config.defaultJourneyTitle,
  });
  if (error) return { error: friendly(error.message) };
  refresh(ctx);
  if (accept && data) redirect(`${ctx.basePath}/journeys/${data}?started=1`);
  return { ok: "Declined kindly. They've been let know." };
}

export async function createGroupJourney(_prev: JourneyFormState, fd: FormData): Promise<JourneyFormState> {
  const ctx = await load(fd);
  if (!ctx?.userId) return { error: "Please sign in first." };
  const { data, error } = await ctx.supabase.rpc("create_group_journey", {
    p_space_id: ctx.space.id,
    p_template_id: nullable(fd, "template_id", 64),
    p_title: text(fd, "title", 120),
    p_max_beginners: Number(fd.get("max_beginners")) || 3,
    p_milestones: ctx.config.defaultMilestones,
  });
  if (error) return { error: friendly(error.message) };
  refresh(ctx);
  redirect(`${ctx.basePath}/journeys/${data}`);
}

// --- The journey -------------------------------------------------------------------

export async function postJourneyUpdate(_prev: JourneyFormState, fd: FormData): Promise<JourneyFormState> {
  const ctx = await load(fd);
  if (!ctx?.userId) return { error: "Please sign in first." };
  const journeyId = text(fd, "journey_id", 64);
  const photos = photoList(fd, "photos", 8);
  const body = nullable(fd, "body", 4000);
  const question = nullable(fd, "question", 2000);
  if (!body && !question && photos.length === 0) return { error: "Add a photo, a few words or a question." };
  const milestoneId = nullable(fd, "milestone_id", 64);

  const { error } = await ctx.supabase.from("journey_updates").insert({
    journey_id: journeyId,
    author_id: ctx.userId,
    parent_id: nullable(fd, "parent_id", 64),
    body,
    question,
    problems: nullable(fd, "problems", 2000),
    milestone_id: milestoneId,
    photos,
  });
  if (error) return { error: friendly(error.message) };

  // "This update completes a milestone" ticks it off in the same step.
  if (milestoneId && fd.get("milestone_done") === "on") {
    await ctx.supabase
      .from("journey_milestones")
      .update({ status: "done", completed_at: new Date().toISOString(), completed_by: ctx.userId })
      .eq("id", milestoneId)
      .eq("journey_id", journeyId);
  }
  refresh(ctx);
  return { ok: "Posted." };
}

export async function setMilestoneDone(fd: FormData): Promise<void> {
  const ctx = await load(fd);
  if (!ctx?.userId) return;
  const done = fd.get("done") === "true";
  await ctx.supabase
    .from("journey_milestones")
    .update(done ? { status: "done", completed_at: new Date().toISOString(), completed_by: ctx.userId } : { status: "pending", completed_at: null, completed_by: null })
    .eq("id", text(fd, "milestone_id", 64));
  refresh(ctx);
}

// Replace the journey's milestone list from the editor (one per line, "Title ::
// description"). Completed milestones keep their status when their title stays.
export async function saveMilestones(_prev: JourneyFormState, fd: FormData): Promise<JourneyFormState> {
  const ctx = await load(fd);
  if (!ctx?.userId) return { error: "Please sign in first." };
  const journeyId = text(fd, "journey_id", 64);
  const next = textToMilestones(String(fd.get("milestones") ?? ""));
  if (next.length === 0) return { error: "Keep at least one milestone." };

  const { data: current, error: readError } = await ctx.supabase.from("journey_milestones").select("*").eq("journey_id", journeyId);
  if (readError) return { error: friendly(readError.message) };
  const byTitle = new Map((current ?? []).map((m) => [m.title.toLowerCase(), m]));
  const keep = new Set<string>();

  for (const [position, m] of next.entries()) {
    const existing = byTitle.get(m.title.toLowerCase());
    if (existing && !keep.has(existing.id)) {
      keep.add(existing.id);
      const { error } = await ctx.supabase
        .from("journey_milestones")
        .update({ position, title: m.title, description: m.description || null })
        .eq("id", existing.id);
      if (error) return { error: friendly(error.message) };
    } else {
      const { error } = await ctx.supabase
        .from("journey_milestones")
        .insert({ journey_id: journeyId, position, title: m.title, description: m.description || null });
      if (error) return { error: friendly(error.message) };
    }
  }
  const remove = (current ?? []).filter((m) => !keep.has(m.id)).map((m) => m.id);
  if (remove.length > 0) await ctx.supabase.from("journey_milestones").delete().in("id", remove);
  refresh(ctx);
  return { ok: "Milestones saved." };
}

export async function saveJourneySettings(_prev: JourneyFormState, fd: FormData): Promise<JourneyFormState> {
  const ctx = await load(fd);
  if (!ctx?.userId) return { error: "Please sign in first." };
  const weeks = Number(fd.get("expected_weeks"));
  const { error } = await ctx.supabase
    .from("journeys")
    .update({
      title: text(fd, "title", 120) || ctx.config.defaultJourneyTitle,
      subject: nullable(fd, "subject", 80),
      update_frequency: text(fd, "update_frequency", 60) || "weekly",
      duration_label: nullable(fd, "duration_label", 160),
      expected_weeks: Number.isInteger(weeks) && weeks >= 1 && weeks <= 104 ? weeks : null,
      cover_image_url: photoList(fd, "cover", 1)[0] ?? null,
    })
    .eq("id", text(fd, "journey_id", 64));
  if (error) return { error: friendly(error.message) };
  refresh(ctx);
  return { ok: "Saved." };
}

export async function setInPersonConsent(fd: FormData): Promise<void> {
  const ctx = await load(fd);
  if (!ctx?.userId) return;
  await ctx.supabase
    .from("journey_participants")
    .update({ in_person_ok: fd.get("ok") === "true" })
    .eq("journey_id", text(fd, "journey_id", 64))
    .eq("user_id", ctx.userId);
  refresh(ctx);
}

export async function completeJourney(_prev: JourneyFormState, fd: FormData): Promise<JourneyFormState> {
  const ctx = await load(fd);
  if (!ctx?.userId) return { error: "Please sign in first." };
  const journeyId = text(fd, "journey_id", 64);
  const { error } = await ctx.supabase.rpc("complete_journey", {
    p_journey_id: journeyId,
    p_acknowledgement: nullable(fd, "acknowledgement", 2000),
  });
  if (error) return { error: friendly(error.message) };
  const reflection = nullable(fd, "reflection", 4000);
  if (reflection) {
    await ctx.supabase.from("journey_participants").update({ reflection }).eq("journey_id", journeyId).eq("user_id", ctx.userId);
  }
  refresh(ctx);
  redirect(`${ctx.basePath}/journeys/${journeyId}/celebrate`);
}

export async function saveReflection(_prev: JourneyFormState, fd: FormData): Promise<JourneyFormState> {
  const ctx = await load(fd);
  if (!ctx?.userId) return { error: "Please sign in first." };
  const journeyId = text(fd, "journey_id", 64);
  const { error } = await ctx.supabase
    .from("journey_participants")
    .update({ reflection: nullable(fd, "reflection", 4000) })
    .eq("journey_id", journeyId)
    .eq("user_id", ctx.userId);
  if (error) return { error: friendly(error.message) };
  const ack = fd.get("acknowledgement");
  if (ack !== null) {
    // The guard trigger only lets the mentor change this.
    await ctx.supabase.from("journeys").update({ mentor_acknowledgement: String(ack).trim().slice(0, 2000) || null }).eq("id", journeyId);
  }
  refresh(ctx);
  return { ok: "Saved." };
}

export async function endJourney(_prev: JourneyFormState, fd: FormData): Promise<JourneyFormState> {
  const ctx = await load(fd);
  if (!ctx?.userId) return { error: "Please sign in first." };
  const { error } = await ctx.supabase.rpc("end_journey", {
    p_journey_id: text(fd, "journey_id", 64),
    p_reason: nullable(fd, "reason", 1000),
  });
  if (error) return { error: friendly(error.message) };
  refresh(ctx);
  redirect(`${ctx.basePath}?ended=1`);
}

// --- Stories -------------------------------------------------------------------------

export async function saveStory(_prev: JourneyFormState, fd: FormData): Promise<JourneyFormState> {
  const ctx = await load(fd);
  if (!ctx?.userId) return { error: "Please sign in first." };
  const journeyId = text(fd, "journey_id", 64);
  const title = text(fd, "title", 160);
  if (!title) return { error: "Give your story a title." };
  const publish = fd.get("publish") === "on";
  const weeks = Number(fd.get("duration_weeks"));
  const methodRaw = text(fd, "method", 60);

  const row = {
    title,
    subject: nullable(fd, "subject", 80),
    region: nullable(fd, "region", 120),
    climate: nullable(fd, "climate", 120),
    method: ctx.config.gallery.methodOptions.some((o) => o.value === methodRaw) ? methodRaw : null,
    conditions: nullable(fd, "conditions", 4000),
    problems: nullable(fd, "problems", 4000),
    solutions: nullable(fd, "solutions", 4000),
    lessons: nullable(fd, "lessons", 4000),
    results: nullable(fd, "results", 4000),
    before_photo_url: photoList(fd, "before_photo", 1)[0] ?? null,
    after_photo_url: photoList(fd, "after_photo", 1)[0] ?? null,
    photos: photoList(fd, "photos", 12),
    duration_weeks: Number.isInteger(weeks) && weeks >= 0 ? weeks : null,
    status: (publish ? "published" : "draft") as "published" | "draft",
  };

  const { data: existing } = await ctx.supabase
    .from("journey_stories")
    .select("id, status")
    .eq("journey_id", journeyId)
    .eq("author_id", ctx.userId)
    .maybeSingle();

  if (existing?.status === "hidden") return { error: "A moderator has hidden this story. Contact the community team if you think that's a mistake." };

  const { error } = existing
    ? await ctx.supabase.from("journey_stories").update(row).eq("id", existing.id)
    : await ctx.supabase.from("journey_stories").insert({ ...row, journey_id: journeyId, space_id: ctx.space.id, author_id: ctx.userId });
  if (error) return { error: friendly(error.message) };
  refresh(ctx);
  return { ok: publish ? "Published to the community gallery. You can unpublish any time." : "Saved as a private draft." };
}

export async function setStoryMentorConsent(_prev: JourneyFormState, fd: FormData): Promise<JourneyFormState> {
  const ctx = await load(fd);
  if (!ctx?.userId) return { error: "Please sign in first." };
  const { error } = await ctx.supabase
    .from("journey_stories")
    .update({ show_mentor: fd.get("show_mentor") === "on", mentor_acknowledgement: nullable(fd, "mentor_acknowledgement", 2000) })
    .eq("id", text(fd, "story_id", 64))
    .eq("mentor_id", ctx.userId);
  if (error) return { error: friendly(error.message) };
  refresh(ctx);
  return { ok: "Saved." };
}

// --- Safety ----------------------------------------------------------------------------

export async function reportInJourneySpace(_prev: JourneyFormState, fd: FormData): Promise<JourneyFormState> {
  const ctx = await load(fd);
  if (!ctx?.userId) return { error: "Please sign in first." };
  const reason = text(fd, "reason", 40);
  if (!REPORT_REASONS.some((r) => r.value === reason)) return { error: "Choose a reason." };
  const { error } = await ctx.supabase.from("journey_reports").insert({
    space_id: ctx.space.id,
    reporter_id: ctx.userId,
    reported_user_id: nullable(fd, "reported_user_id", 64),
    journey_id: nullable(fd, "journey_id", 64),
    update_id: nullable(fd, "update_id", 64),
    story_id: nullable(fd, "story_id", 64),
    reason: reason as JourneyReportReason,
    details: nullable(fd, "details", 2000),
  });
  if (error) return { error: friendly(error.message) };
  return { ok: "Thank you. The community team has been told and will review it. The other person isn't told who reported." };
}

// --- Staff: Manage ----------------------------------------------------------------------

async function loadStaff(fd: FormData) {
  const ctx = await load(fd);
  return ctx?.isStaff ? ctx : null;
}

export async function saveSpaceSettings(_prev: JourneyFormState, fd: FormData): Promise<JourneyFormState> {
  const ctx = await load(fd);
  if (!ctx?.isAdmin) return { error: "Only community admins can change this space's settings." };
  const next = configFromForm(ctx.config, fd);
  const overrides = (diffConfig(ctx.preset.config, next) ?? {}) as Record<string, unknown>;
  const { error } = await ctx.supabase.from("guided_journey_spaces").upsert(
    {
      space_id: ctx.space.id,
      preset_key: ctx.preset.key,
      config: overrides,
      accepting_mentors: fd.get("accepting_mentors") === "on",
      accepting_beginners: fd.get("accepting_beginners") === "on",
    },
    { onConflict: "space_id" }
  );
  if (error) return { error: friendly(error.message) };
  refresh(ctx);
  return { ok: "Settings saved." };
}

export async function resetSpaceToPreset(fd: FormData): Promise<void> {
  const ctx = await load(fd);
  if (!ctx?.isAdmin) return;
  const presetKey = text(fd, "preset_key", 40) || ctx.preset.key;
  await ctx.supabase.from("guided_journey_spaces").upsert({ space_id: ctx.space.id, preset_key: presetKey, config: {} }, { onConflict: "space_id" });
  refresh(ctx);
}

export async function saveTemplate(_prev: JourneyFormState, fd: FormData): Promise<JourneyFormState> {
  const ctx = await loadStaff(fd);
  if (!ctx) return { error: "Only community staff can edit journey templates." };
  const title = text(fd, "title", 120);
  if (!title) return { error: "Give the template a title." };
  const weeks = Number(fd.get("expected_weeks"));
  const row = {
    title,
    subject: nullable(fd, "subject", 80),
    summary: nullable(fd, "summary", 600),
    cover_image_url: photoList(fd, "cover", 1)[0] ?? null,
    duration_label: nullable(fd, "duration_label", 160),
    expected_weeks: Number.isInteger(weeks) && weeks >= 1 && weeks <= 104 ? weeks : null,
    milestones: textToMilestones(String(fd.get("milestones") ?? "")),
    is_active: fd.get("is_active") === "on",
    sort_order: Number(fd.get("sort_order")) || 0,
  };
  const id = nullable(fd, "template_id", 64);
  const { error } = id
    ? await ctx.supabase.from("journey_templates").update(row).eq("id", id).eq("space_id", ctx.space.id)
    : await ctx.supabase.from("journey_templates").insert({ ...row, space_id: ctx.space.id, created_by: ctx.userId });
  if (error) return { error: friendly(error.message) };
  refresh(ctx);
  return { ok: id ? "Template saved." : "Template added." };
}

export async function deleteTemplate(fd: FormData): Promise<void> {
  const ctx = await loadStaff(fd);
  if (!ctx) return;
  await ctx.supabase.from("journey_templates").delete().eq("id", text(fd, "template_id", 64)).eq("space_id", ctx.space.id);
  refresh(ctx);
}

export async function staffUpdateMentor(fd: FormData): Promise<void> {
  const ctx = await loadStaff(fd);
  if (!ctx) return;
  const patch: { status?: "active" | "suspended"; level?: MentorLevel; is_verified?: boolean; is_paused?: boolean } = {};
  const status = text(fd, "status", 20);
  if (status === "active" || status === "suspended") patch.status = status;
  const level = text(fd, "level", 20);
  if (MENTOR_LEVELS.some((l) => l.value === level)) patch.level = level as MentorLevel;
  if (fd.get("is_verified") !== null) patch.is_verified = fd.get("is_verified") === "true";
  if (fd.get("is_paused") !== null) patch.is_paused = fd.get("is_paused") === "true";
  await ctx.supabase.from("journey_mentor_profiles").update(patch).eq("id", text(fd, "mentor_profile_id", 64)).eq("space_id", ctx.space.id);
  refresh(ctx);
}

export async function reviewReport(fd: FormData): Promise<void> {
  const ctx = await loadStaff(fd);
  if (!ctx) return;
  const status = text(fd, "status", 20);
  if (!["open", "resolved", "dismissed"].includes(status)) return;
  await ctx.supabase
    .from("journey_reports")
    .update({
      status: status as "open" | "resolved" | "dismissed",
      staff_note: nullable(fd, "staff_note", 1000),
      reviewed_by: ctx.userId,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", text(fd, "report_id", 64))
    .eq("space_id", ctx.space.id);
  refresh(ctx);
}

export async function moderateStory(fd: FormData): Promise<void> {
  const ctx = await loadStaff(fd);
  if (!ctx) return;
  const hide = fd.get("hide") === "true";
  await ctx.supabase
    .from("journey_stories")
    .update({ status: hide ? "hidden" : "published", hidden_reason: hide ? nullable(fd, "reason", 300) : null })
    .eq("id", text(fd, "story_id", 64))
    .eq("space_id", ctx.space.id);
  refresh(ctx);
}

export async function moderateUpdate(fd: FormData): Promise<void> {
  const ctx = await loadStaff(fd);
  if (!ctx) return;
  await ctx.supabase.from("journey_updates").update({ is_hidden: fd.get("hide") === "true" }).eq("id", text(fd, "update_id", 64));
  refresh(ctx);
}

export async function staffEndJourney(fd: FormData): Promise<void> {
  const ctx = await loadStaff(fd);
  if (!ctx) return;
  await ctx.supabase.rpc("end_journey", { p_journey_id: text(fd, "journey_id", 64), p_reason: nullable(fd, "reason", 1000) ?? "Ended by the community team" });
  refresh(ctx);
}

// Duplicate this space — into this community or another one the admin runs —
// optionally switching preset (e.g. gardening → sailing). Only the reusable
// configuration is copied: never members, journeys or stories.
export async function duplicateGuidedJourneySpace(_prev: JourneyFormState, fd: FormData): Promise<JourneyFormState> {
  const ctx = await load(fd);
  if (!ctx?.isAdmin || !ctx.userId) return { error: "Only community admins can duplicate this space." };
  const targetCommunityId = text(fd, "target_community_id", 64) || ctx.community.id;
  const name = text(fd, "name", 80);
  if (!name) return { error: "Name the new space." };
  const slug = slugify(name);
  if (!slug) return { error: "That name can't be turned into a URL — add some letters." };

  const { data: target } = await ctx.supabase.from("communities").select("id, slug").eq("id", targetCommunityId).maybeSingle();
  if (!target) return { error: "Choose a community you administer." };
  const { data: taken } = await ctx.supabase.from("spaces").select("id").eq("community_id", target.id).eq("slug", slug).maybeSingle();
  if (taken) return { error: "That community already has a space with this name." };
  const { data: maxSort } = await ctx.supabase
    .from("spaces")
    .select("sort_order")
    .eq("community_id", target.id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Inserted, then read back by slug: spaces' SELECT policy can't see a row
  // inside its own INSERT statement, so insert().select() is refused by RLS.
  const { error } = await ctx.supabase.from("spaces").insert({
    community_id: target.id,
    name,
    slug,
    description: nullable(fd, "description", 600),
    visibility: ctx.space.visibility,
    space_type: "guided_journey",
    sort_order: (maxSort?.sort_order ?? -1) + 1,
    show_in_nav: true,
  });
  if (error) return { error: friendly(error.message) };
  const { data: created } = await ctx.supabase.from("spaces").select("id").eq("community_id", target.id).eq("slug", slug).single();
  if (!created) return { error: "The space was created but couldn't be read back — refresh and check the community." };

  const presetKey = text(fd, "preset_key", 40) || null;
  const copied = presetKey && presetKey !== ctx.preset.key
    ? await seedGuidedJourneySpace(ctx.supabase, created.id, presetKey)
    : await copyGuidedJourneySpace(ctx.supabase, ctx.space.id, created.id);
  if (copied.error) return { error: `The space was created, but its setup wasn't copied: ${copied.error}` };

  revalidatePath(`/c/${target.slug}`, "layout");
  redirect(`/c/${target.slug}/spaces/${slug}/manage?created=1`);
}
