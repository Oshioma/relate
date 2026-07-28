"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isPlatformHost } from "@/lib/custom-domain";
import { isResendConfigured, sendCommunityConfirmationEmail } from "@/lib/email";

export type AuthFormState = { error: string } | undefined;

// Shown whenever a signup collides with an existing account. One account works
// across the main site and every community site, so the fix is always to sign
// in (or reset) with the original details rather than create a second one.
const ALREADY_REGISTERED_MESSAGE =
  "You already have an account with this email — maybe from joining on a community's own site. The same email and password work everywhere, so go back and sign in with those details, or use \"Forgot your password?\" on the sign-in page to reset them.";

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
// empty body (the same path that surfaced the "{}" invite error). That can
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
    return "That email and password don't match. It's one account for every community site and the main site — use the same details you first signed up with, or tap \"Forgot your password?\" below to reset it. New here? Use \"Create account\" instead.";
  }
  if (lower.includes("email not confirmed")) {
    return "Almost there — we sent you a confirmation email when you signed up. Click the link in it, then sign in again.";
  }
  return usefulAuthMessage(message, "We couldn't sign you in just now. Please try again in a moment.");
}

async function communityBySlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  slug: string
): Promise<{ name: string; logoUrl: string | null } | null> {
  const { data } = await supabase
    .from("communities")
    .select("name, logo_url")
    .eq("slug", slug)
    .maybeSingle();
  return data?.name ? { name: data.name, logoUrl: data.logo_url ?? null } : null;
}

// The community a signup is joining, inferred from where the signup happened —
// there's no separate community field on the signup form. Three signals carry a
// community: an invite link (/invite/<code>, resolved through the public
// get_invite_preview RPC), a community page (/c/<slug>), and the custom domain
// itself (a bare signup on a community's own domain, where `next` is just "/").
// Returns null when there's nothing to brand with — a bare /dashboard signup,
// the /communities/new creator flow, or a community this anon client can't see.
async function communityForSignup(
  supabase: Awaited<ReturnType<typeof createClient>>,
  next: string,
  customHost: string | null
): Promise<{ name: string; logoUrl: string | null } | null> {
  const invite = next.match(/^\/invite\/([^/?#]+)/);
  if (invite) {
    const { data } = await supabase.rpc("get_invite_preview", { p_code: decodeURIComponent(invite[1]) });
    const preview = data?.[0];
    return preview?.community_name ? { name: preview.community_name, logoUrl: preview.community_logo_url ?? null } : null;
  }

  const community = next.match(/^\/c\/([^/?#]+)/);
  if (community) {
    return communityBySlug(supabase, decodeURIComponent(community[1]));
  }

  // On a community's custom domain the visitor is joining that one community
  // even with no path context. Resolve the domain to its slug the same way the
  // proxy does, then reuse the slug lookup above.
  if (customHost) {
    const hostname = customHost.split(":")[0];
    const { data: slug } = await supabase.rpc("community_slug_for_domain", { p_domain: hostname });
    if (slug) return communityBySlug(supabase, slug);
  }

  return null;
}

type BrandedConfirmationResult = "sent" | "already-registered" | "fallback";

// Best-effort community-branded signup confirmation. Returns "sent" when the
// new member will get our own "Confirm your email to join <community>" message,
// "already-registered" when the address is taken, and "fallback" for everything
// else — no community context, Resend/admin not configured, or a transient
// failure — so the caller drops through to Supabase Auth's default signUp()
// confirmation email. Because generateLink creates the (unconfirmed) user up
// front, if we then can't email them we delete that user again so the fallback
// signUp() can recreate and email them cleanly, rather than dead-ending on
// "already registered".
async function trySendBrandedConfirmation(args: {
  supabase: Awaited<ReturnType<typeof createClient>>;
  email: string;
  password: string;
  fullName: string;
  next: string;
  customHost: string | null;
  platformOrigin: string;
  returnParam: string;
}): Promise<BrandedConfirmationResult> {
  const { supabase, email, password, fullName, next, customHost, platformOrigin, returnParam } = args;

  const community = await communityForSignup(supabase, next, customHost);
  if (!community) return "fallback";

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return "fallback";
  }

  // generateLink creates the unconfirmed user and hands back the verification
  // token without sending anything itself — the whole point, so we can wrap our
  // own email around it. redirectTo only shapes the action_link we ignore, but
  // must be an allowlisted origin, so reuse the platform confirm route.
  const { data, error } = await admin.auth.admin.generateLink({
    type: "signup",
    email,
    password,
    options: {
      data: { full_name: fullName },
      redirectTo: `${platformOrigin}/auth/confirm`,
    },
  });

  if (error || !data?.properties?.hashed_token) {
    if (error && /already.*(registered|exists)/i.test(error.message)) return "already-registered";
    if (error) console.error("[signup] generateLink failed, falling back:", error);
    return "fallback";
  }

  // Rebuild the confirmation link the way Supabase's default template would,
  // pointing at our own /auth/confirm route: token_hash + type drive the
  // app-side verifyOtp flow it already implements, custom-domain forwarding
  // (return_host) included.
  const confirmUrl =
    `${platformOrigin}/auth/confirm` +
    `?token_hash=${encodeURIComponent(data.properties.hashed_token)}` +
    `&type=signup&next=${encodeURIComponent(next)}${returnParam}`;

  const sent = await sendCommunityConfirmationEmail({
    to: email,
    communityName: community.name,
    communityLogoUrl: community.logoUrl,
    confirmUrl,
  });

  if (!sent.ok) {
    // The user exists now but has no usable link — remove it so the fallback
    // signUp() below recreates and emails them the default way instead.
    if (data.user?.id) {
      await admin.auth.admin.deleteUser(data.user.id).catch(() => undefined);
    }
    console.error("[signup] branded confirmation email failed, falling back:", sent.reason);
    return "fallback";
  }

  return "sent";
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

  // When this signup is joining a specific community and Resend is configured,
  // send our own community-branded confirmation email instead of Supabase
  // Auth's global "from Relate" template. Anything not set up or not resolvable
  // falls through to the default signUp() path below. redirect() throws, so it
  // stays here at the top level of the action, never inside a try/catch.
  if (isResendConfigured()) {
    const branded = await trySendBrandedConfirmation({
      supabase,
      email,
      password,
      fullName,
      next,
      customHost,
      platformOrigin,
      returnParam,
    });
    if (branded === "already-registered") {
      return { error: ALREADY_REGISTERED_MESSAGE };
    }
    if (branded === "sent") {
      redirect(`/signup/check-email?next=${encodeURIComponent(next)}`);
    }
    // "fallback": continue to the default signUp() path below.
  }

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
      return {
        error: ALREADY_REGISTERED_MESSAGE,
      };
    }
    // The client only ever sees a string, so log the full error (status,
    // code, opaque body) to make an unhelpful message like "0" diagnosable.
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
