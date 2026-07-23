"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isPlatformHost } from "@/lib/custom-domain";

export type AuthFormState = { error: string } | undefined;

async function getSiteOrigin() {
  const headerList = await headers();
  return headerList.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

// The host (with port) of the origin the form was submitted from, when that
// origin is a community's custom domain rather than the platform itself.
function customDomainHost(origin: string): string | null {
  try {
    const host = new URL(origin).host;
    return isPlatformHost(host) ? null : host;
  } catch {
    return null;
  }
}

function safeNextPath(value: FormDataEntryValue | null, fallback: string) {
  const path = typeof value === "string" ? value : "";
  return path.startsWith("/") ? path : fallback;
}

export async function login(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  // On a custom domain the member is signing in to that one community, so
  // land on its feed rather than the cross-community dashboard.
  const next = safeNextPath(formData.get("next"), customDomainHost(await getSiteOrigin()) ? "/" : "/dashboard");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error("[login] signInWithPassword failed:", error);
    return { error: friendlyLoginError(error.message) };
  }

  redirect(next);
}

// Supabase auth errors usually carry a helpful sentence, but auth-js falls
// back to JSON.stringify(responseBody) when GoTrue answers with an opaque or
// empty body (e.g. a 500 when the confirmation email can't be sent). That can
// leave `message` as a meaningless token like "0", "{}", or "[object Object]".
// Never show those to a user — swap in an actionable fallback instead.
function usefulAuthMessage(message: string, fallback: string): string {
  const trimmed = message?.trim() ?? "";
  const opaque = trimmed === "" || /^(\{\}|\[object Object\]|null|undefined|-?\d+)$/.test(trimmed);
  return opaque ? fallback : trimmed;
}

// Supabase's auth errors are accurate but cryptic to someone who just
// followed an invite link ("Invalid login credentials"). Translate the two
// everyday ones; anything unusual passes through a sanity check.
function friendlyLoginError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("invalid login credentials")) {
    return "That email and password don't match an account. New here? Use \"Create account\" instead — or double-check your password.";
  }
  if (lower.includes("email not confirmed")) {
    return "Almost there — we sent you a confirmation email when you signed up. Click the link in it, then sign in again.";
  }
  return usefulAuthMessage(message, "We couldn't sign you in just now. Please try again in a moment.");
}

export async function signup(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("full_name") ?? "").trim();

  const origin = await getSiteOrigin();
  const customHost = customDomainHost(origin);
  const next = safeNextPath(formData.get("next"), customHost ? "/" : "/dashboard");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  // Confirmation links always point at the platform's own origin so custom
  // domains never need to be added to Supabase's redirect allowlist. For a
  // signup that happened on a custom domain, `return_host` tells
  // /auth/confirm to forward the (still unverified) token there, so the
  // session cookie ends up on the domain the member actually uses — see
  // src/app/auth/confirm/route.ts.
  const platformOrigin = customHost ? (process.env.NEXT_PUBLIC_SITE_URL ?? origin) : origin;
  const returnParam = customHost ? `&return_host=${encodeURIComponent(customHost)}` : "";

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${platformOrigin}/auth/confirm?next=${encodeURIComponent(next)}${returnParam}`,
    },
  });

  if (error) {
    if (error.message.toLowerCase().includes("already registered")) {
      return { error: "You already have an account with this email — go back and choose \"Sign in\" instead." };
    }
    // The client only ever sees a string, so log the full error (status,
    // code, opaque body) to make an unhelpful message like "0" diagnosable.
    // A 500 here is most often a confirmation-email delivery failure (SMTP).
    console.error("[signup] signUp failed:", error);
    return {
      error: usefulAuthMessage(error.message, "We couldn't create your account just now. Please try again in a moment."),
    };
  }

  // If email confirmation is turned off in the Supabase project, signUp
  // already returns an active session — skip straight to the app.
  if (data.session) {
    redirect(next);
  }

  redirect(`/signup/check-email?next=${encodeURIComponent(next)}`);
}

export type PasswordResetState = { error?: string; done?: boolean } | undefined;

// The escape hatch for two kinds of stuck users: anyone who forgot their
// password, and — more importantly — people invited via "Invite by email",
// whose auth account was created by inviteUserByEmail with NO password at
// all. For them "Create account" says already-registered and "Sign in" can
// never succeed; this flow is the only way in.
export async function requestPasswordReset(
  _prevState: PasswordResetState,
  formData: FormData
): Promise<PasswordResetState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email || !email.includes("@")) {
    return { error: "Enter your email address." };
  }

  // Same platform-origin routing as signup: the reset email always links to
  // the platform host (no per-domain Supabase allowlist), and /auth/confirm
  // forwards to the community domain the request came from.
  const origin = await getSiteOrigin();
  const customHost = customDomainHost(origin);
  const platformOrigin = customHost ? (process.env.NEXT_PUBLIC_SITE_URL ?? origin) : origin;
  const returnParam = customHost ? `&return_host=${encodeURIComponent(customHost)}` : "";

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${platformOrigin}/auth/confirm?next=${encodeURIComponent("/settings/password")}${returnParam}`,
  });

  // Always report success — the response must not reveal which emails have
  // accounts. Supabase rate-limits the sends on its side.
  return { done: true };
}

export type UpdatePasswordState = { error?: string; done?: boolean } | undefined;

export async function updatePassword(
  _prevState: UpdatePasswordState,
  formData: FormData
): Promise<UpdatePasswordState> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (password !== confirm) {
    return { error: "Those passwords don't match — try again." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return { error: error.message };
  }

  return { done: true };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
