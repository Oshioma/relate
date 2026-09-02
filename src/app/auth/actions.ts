"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isPlatformHost } from "@/lib/custom-domain";
import { isResendConfigured, sendCommunityConfirmationEmail, sendPasswordResetEmail } from "@/lib/email";
import { isTurnstileConfigured, verifyTurnstileToken } from "@/lib/turnstile";
import { authEventContext, recordAuthEvent, signupContextMetadata } from "@/lib/auth-events";

// `unconfirmed` marks the one error a member can fix themselves from the
// sign-in form: the account exists but its email was never confirmed. The
// form turns it into a link to /signup/resend.
export type AuthFormState = { error: string; unconfirmed?: boolean } | undefined;

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

// The host (with port) the form was submitted from, whatever it is — the
// platform, a community subdomain, or a custom domain. Used to attribute
// signups and sign-ins to a community (see src/lib/auth-events.ts).
function hostOf(origin: string): string | null {
  try {
    return new URL(origin).host;
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
  const origin = await getSiteOrigin();
  // On a custom domain the member is signing in to that one community, so
  // land on its feed rather than the cross-community dashboard.
  const next = safeNextPath(formData.get("next"), customDomainHost(origin) ? "/" : "/dashboard");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error("[login] signInWithPassword failed:", error);
    const unconfirmed =
      error.code === "email_not_confirmed" || error.message.toLowerCase().includes("email not confirmed");
    return { error: friendlyLoginError(error.message), unconfirmed };
  }

  // Log the sign-in against the community it happened on, so the platform-admin
  // "Signups & logins" tab can show activity per community. Never allowed to
  // fail the sign-in itself, and it must run before the redirect below, which
  // throws to navigate.
  await recordAuthEvent(supabase, "login", authEventContext(next, hostOf(origin)));

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
    return "Almost there — we sent you a confirmation email when you signed up. Click the link in it, then sign in again. If it never arrived, or it said the link had expired, get a fresh one below.";
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

// -----------------------------------------------------------------------------
// Signup confirmation emails
//
// EVERY signup confirmation Relate sends is minted here with
// admin.generateLink and delivered through Resend — community-branded when
// there's a community in the picture, plain "Relate" when there isn't.
//
// It used to be the community-branded case only; a bare platform signup fell
// through to supabase.auth.signUp() and Supabase Auth's default template. That
// fallback was the bug behind "I clicked the link straight away and it says
// expired". The default template links at GoTrue's /verify endpoint, which
// spends the one-time token on a plain GET, so a mail scanner or inbox
// prefetcher opening the message burns the link before the member touches it —
// and our /auth/confirm interstitial cannot defend against that, because the
// spending happens on Supabase's host, not ours. What reaches the member is
// then either a dead `?error=access_denied&error_code=otp_expired` bounce, or a
// PKCE `?code=` that only exchanges in the very browser the form was submitted
// from. A token_hash link has neither problem. See src/lib/email.ts.
// -----------------------------------------------------------------------------

type ConfirmationSendResult = "sent" | "already-registered" | "send-failed" | "fallback";

// What we already know about an address. "unknown" means the lookup itself
// failed (e.g. the migration adding the RPC hasn't been applied yet) — it is
// deliberately distinct from "none" so the caller never treats a pre-existing
// account as one it just created.
type AccountState = "none" | "unconfirmed" | "confirmed" | "unknown";

// Read auth.users.email_confirmed_at through the service-role-only RPC (see
// supabase/migrations/20260902082906_auth_user_confirmation_state.sql). This is
// what lets a second signup attempt tell "you already have a real account, go
// sign in" apart from "you signed up but never confirmed — here's a fresh
// link", instead of refusing both with "already registered".
async function accountStateFor(
  admin: ReturnType<typeof createAdminClient>,
  email: string
): Promise<AccountState> {
  const { data, error } = await admin.rpc("auth_user_confirmation_state", { p_email: email });
  if (error) {
    console.error("[auth] auth_user_confirmation_state failed:", error);
    return "unknown";
  }
  const row = data?.[0];
  if (!row) return "none";
  return row.confirmed ? "confirmed" : "unconfirmed";
}

// Mint the confirmation link and wrap our own email around it. Returns "sent"
// on success, "already-registered" when the address is a finished account,
// "send-failed" when an existing unconfirmed account couldn't be re-emailed,
// and "fallback" when this path isn't usable at all (no service-role key, or a
// transient failure on a brand-new signup) so the caller can drop through to
// Supabase Auth's default signUp() email.
//
// generateLink creates the (unconfirmed) user up front without sending
// anything itself — the whole point, so we can send our own message. If the
// email then fails for a user this call created, we delete that user again so
// the fallback signUp() can recreate and email them cleanly rather than
// dead-ending on "already registered".
async function trySendAppMintedConfirmation(args: {
  supabase: Awaited<ReturnType<typeof createClient>>;
  email: string;
  password: string;
  fullName: string;
  next: string;
  customHost: string | null;
  platformOrigin: string;
  returnParam: string;
  // Signup-attribution keys carried into raw_user_meta_data so the auth.users
  // trigger can log which community this signup came from.
  contextMetadata: Record<string, string>;
}): Promise<ConfirmationSendResult> {
  const { supabase, email, password, fullName, next, customHost, platformOrigin, returnParam, contextMetadata } = args;

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return "fallback";
  }

  const state = await accountStateFor(admin, email);
  if (state === "confirmed") return "already-registered";

  // Branding is a nice-to-have now, not a precondition: no community context
  // just means a plain "Relate" confirmation email rather than a different
  // (and much more fragile) delivery path.
  const community = await communityForSignup(supabase, next, customHost);

  // redirectTo only shapes the action_link we ignore, but must be an
  // allowlisted origin, so reuse the platform confirm route.
  const redirectTo = `${platformOrigin}/auth/confirm`;
  const { data, error } = await admin.auth.admin.generateLink({
    type: "signup",
    email,
    password,
    options: { data: { full_name: fullName, ...contextMetadata }, redirectTo },
  });

  let tokenHash = data?.properties?.hashed_token ?? "";
  let otpType: "signup" | "magiclink" = "signup";
  // Only a user THIS call brought into being may be deleted again below.
  const createdUserId = state === "none" ? (data?.user?.id ?? null) : null;

  if (error || !tokenHash) {
    const alreadyExists =
      error?.code === "email_exists" || (error ? /already.*(registered|exists)/i.test(error.message) : false);

    if (state === "unconfirmed") {
      // GoTrue regenerates a signup link for an unconfirmed address (adopting
      // the password just typed), but don't stake the fix on that: if it
      // refuses one for an address our own lookup says is still unconfirmed,
      // mint a magic-link token instead. Any existing user can be issued one,
      // and verifying it confirms the email — which is the job here. The
      // password they typed is simply not applied in that case; they land
      // signed in and can set one from settings.
      const magic = await admin.auth.admin.generateLink({ type: "magiclink", email, options: { redirectTo } });
      tokenHash = magic.data?.properties?.hashed_token ?? "";
      otpType = "magiclink";
      if (magic.error || !tokenHash) {
        console.error("[signup] magiclink generateLink failed for unconfirmed address:", magic.error ?? error);
        return "send-failed";
      }
    } else if (alreadyExists) {
      return "already-registered";
    } else {
      if (error) console.error("[signup] generateLink failed, falling back:", error);
      return "fallback";
    }
  }

  // Rebuild the confirmation link the way Supabase's default template would,
  // pointing at our own /auth/confirm route: token_hash + type drive the
  // app-side verifyOtp flow it already implements, custom-domain forwarding
  // (return_host) included.
  const confirmUrl =
    `${platformOrigin}/auth/confirm` +
    `?token_hash=${encodeURIComponent(tokenHash)}` +
    `&type=${otpType}&next=${encodeURIComponent(next)}${returnParam}`;

  const sent = await sendCommunityConfirmationEmail({
    to: email,
    communityName: community?.name ?? null,
    communityLogoUrl: community?.logoUrl ?? null,
    confirmUrl,
  });

  if (!sent.ok) {
    console.error("[signup] confirmation email failed:", sent.reason);
    if (createdUserId) {
      // Brand-new user with no usable link — remove it so the fallback
      // signUp() below recreates and emails them the default way instead.
      await admin.auth.admin.deleteUser(createdUserId).catch(() => undefined);
      return "fallback";
    }
    // The account predates this request. Never delete it, and never drop to
    // signUp() (which would just say "already registered") — say plainly that
    // the send failed so they can try again.
    return "send-failed";
  }

  return "sent";
}

const CONFIRMATION_SEND_FAILED_MESSAGE =
  "We couldn't send your confirmation email just now — that's on us, not you. Please try again in a minute.";

export async function signup(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("full_name") ?? "").trim();

  const origin = await getSiteOrigin();
  const customHost = customDomainHost(origin);
  const next = safeNextPath(formData.get("next"), customHost ? "/" : "/dashboard");

  // Which community this signup belongs to, as far as the request can tell.
  // Passed down as user metadata and resolved to a community id by the
  // auth.users trigger, so private and invite-only communities attribute their
  // new members exactly like public ones do.
  const contextMetadata = signupContextMetadata(authEventContext(next, hostOf(origin)));

  // Bot defenses, cheapest first. The honeypot is a hidden field no human
  // fills; a filled one means a bot. Don't reveal the trap — pretend the signup
  // worked (send them to the check-email screen) while creating nothing.
  const honeypot = String(formData.get("company_website") ?? "").trim();
  if (honeypot) {
    redirect(`/signup/check-email?next=${encodeURIComponent(next)}`);
  }

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  // Cloudflare Turnstile CAPTCHA, when configured. Verified server-side so a
  // forged or missing token can't slip through — this guards both the branded
  // and default signup paths below. No-op until the env vars are set.
  if (isTurnstileConfigured()) {
    const headerList = await headers();
    const remoteIp = headerList.get("cf-connecting-ip") ?? headerList.get("x-forwarded-for")?.split(",")[0]?.trim();
    const token = String(formData.get("cf-turnstile-response") ?? "");
    const verified = await verifyTurnstileToken(token, remoteIp);
    if (!verified) {
      return { error: "Please complete the human-verification challenge, then try again." };
    }
  }

  // Confirmation links always point at the platform's own origin so custom
  // domains never need to be added to Supabase's redirect allowlist. For a
  // signup that happened on a custom domain, `return_host` tells
  // /auth/confirm to forward the (still unverified) token there, so the
  // session cookie ends up on the domain the member actually uses — see
  // src/app/auth/confirm/page.tsx.
  const platformOrigin = customHost ? (process.env.NEXT_PUBLIC_SITE_URL ?? origin) : origin;
  const returnParam = customHost ? `&return_host=${encodeURIComponent(customHost)}` : "";

  const supabase = await createClient();

  // Preferred path for every signup, community context or not: our own
  // app-minted token_hash link, wrapped in our own email. Only an unconfigured
  // Resend — or a transient failure on a brand-new address — drops to
  // Supabase Auth's default signUp() email below. redirect() throws, so it
  // stays here at the top level of the action, never inside a try/catch.
  if (isResendConfigured()) {
    const minted = await trySendAppMintedConfirmation({
      supabase,
      email,
      password,
      fullName,
      next,
      customHost,
      platformOrigin,
      returnParam,
      contextMetadata,
    });
    if (minted === "already-registered") {
      return { error: ALREADY_REGISTERED_MESSAGE };
    }
    if (minted === "send-failed") {
      return { error: CONFIRMATION_SEND_FAILED_MESSAGE };
    }
    if (minted === "sent") {
      redirect(`/signup/check-email?next=${encodeURIComponent(next)}`);
    }
    // "fallback": continue to the default signUp() path below.
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, ...contextMetadata },
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

export type ResendConfirmationState = { error?: string; done?: boolean } | undefined;

// "Send me a new activation link" — the way out for anyone whose confirmation
// email never arrived, or whose link was spent by a mail scanner before they
// could click it. Without this the only recovery was signing up again, which
// answered "you already have an account" and sent nothing at all.
//
// Deliberately email-only (no password): the address owner is the one who
// receives the link, so nothing here needs to prove anything else. It reports
// the same success whatever the address turns out to be — the response must
// not reveal which emails have accounts.
export async function resendConfirmation(
  _prevState: ResendConfirmationState,
  formData: FormData
): Promise<ResendConfirmationState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return { error: "Enter your email address." };
  }

  // Same platform-origin routing as signup: the link always points at the
  // platform host, and /auth/confirm forwards it to the community domain the
  // request came from.
  const origin = await getSiteOrigin();
  const customHost = customDomainHost(origin);
  const next = safeNextPath(formData.get("next"), customHost ? "/" : "/dashboard");
  const platformOrigin = customHost ? (process.env.NEXT_PUBLIC_SITE_URL ?? origin) : origin;
  const returnParam = customHost ? `&return_host=${encodeURIComponent(customHost)}` : "";

  const supabase = await createClient();

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    admin = null;
  }

  if (!admin || !isResendConfigured()) {
    // No service-role key or no Resend: fall back to Supabase Auth's own
    // resend, which uses the fragile default template — better than nothing.
    await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: `${platformOrigin}/auth/confirm?next=${encodeURIComponent(next)}${returnParam}` },
    });
    return { done: true };
  }

  const state = await accountStateFor(admin, email);
  // Only an account still waiting on its first confirmation gets a new link.
  // "none", "confirmed" and "unknown" fall through to the same success screen.
  if (state !== "unconfirmed") {
    return { done: true };
  }

  // A magic-link token, not a signup one: it needs no password (we don't have
  // theirs and must not change it), and verifying it confirms the address,
  // which is the whole job. It is only ever minted for an address the lookup
  // above already found, so this can't conjure accounts out of arbitrary
  // emails the way an unguarded magiclink would.
  const { data, error } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo: `${platformOrigin}/auth/confirm` },
  });

  if (error || !data?.properties?.hashed_token) {
    console.error("[resend-confirmation] generateLink failed:", error);
    return { error: CONFIRMATION_SEND_FAILED_MESSAGE };
  }

  const community = await communityForSignup(supabase, next, customHost);

  const confirmUrl =
    `${platformOrigin}/auth/confirm` +
    `?token_hash=${encodeURIComponent(data.properties.hashed_token)}` +
    `&type=magiclink&next=${encodeURIComponent(next)}${returnParam}`;

  const sent = await sendCommunityConfirmationEmail({
    to: email,
    communityName: community?.name ?? null,
    communityLogoUrl: community?.logoUrl ?? null,
    confirmUrl,
  });

  if (!sent.ok) {
    console.error("[resend-confirmation] email failed:", sent.reason);
    return { error: CONFIRMATION_SEND_FAILED_MESSAGE };
  }

  return { done: true };
}

export type PasswordResetState = { error?: string; done?: boolean } | undefined;

// The escape hatch for two kinds of stuck users: anyone who forgot their
// password, and — more importantly — people invited via "Invite by email",
// whose auth account was created by inviteUserByEmail with NO password at
// all. For them "Create account" says already-registered and "Sign in" can
// never succeed; this flow is the only way in.
// Best-effort: mint the recovery link with the Admin API and send it ourselves
// through Resend. Returns true only when our own email actually went out, so
// the caller knows whether to fall back to Supabase's default recovery email.
// The whole point is to avoid that default: it routes through GoTrue's /verify
// endpoint and a PKCE `?code=` exchange that needs a code-verifier cookie from
// the same browser the reset was requested in — so it silently fails whenever
// the email is opened on a different device (request on a laptop, open on a
// phone). admin.generateLink hands back a token_hash instead, which
// /auth/confirm verifies with verifyOtp and which carries no per-browser state,
// so it works anywhere and — routed through our interstitial — survives the
// link scanners that were pre-spending tokens.
async function trySendBrandedPasswordReset(args: {
  supabase: Awaited<ReturnType<typeof createClient>>;
  email: string;
  customHost: string | null;
  platformOrigin: string;
  returnParam: string;
}): Promise<boolean> {
  const { supabase, email, customHost, platformOrigin, returnParam } = args;

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return false;
  }

  const { data, error } = await admin.auth.admin.generateLink({
    type: "recovery",
    email,
    // redirectTo only shapes the action_link we ignore, but must be an
    // allowlisted origin, so reuse the platform confirm route.
    options: { redirectTo: `${platformOrigin}/auth/confirm` },
  });

  // No usable link — a non-existent address (the common case here) lands in
  // this branch too. Returning false lets the caller fall through; every branch
  // still reports success to the user, so which emails have accounts stays
  // hidden either way.
  if (error || !data?.properties?.hashed_token) {
    if (error) console.error("[password-reset] generateLink failed, falling back:", error);
    return false;
  }

  // A community-branded reset when the request came from a custom domain we can
  // resolve; otherwise a plain "Relate" one.
  let community: { name: string; logoUrl: string | null } | null = null;
  if (customHost) {
    const { data: slug } = await supabase.rpc("community_slug_for_domain", { p_domain: customHost.split(":")[0] });
    if (slug) community = await communityBySlug(supabase, slug);
  }

  const resetUrl =
    `${platformOrigin}/auth/confirm` +
    `?token_hash=${encodeURIComponent(data.properties.hashed_token)}` +
    `&type=recovery&next=${encodeURIComponent("/settings/password")}${returnParam}`;

  const sent = await sendPasswordResetEmail({
    to: email,
    communityName: community?.name ?? null,
    communityLogoUrl: community?.logoUrl ?? null,
    resetUrl,
  });

  if (!sent.ok) {
    console.error("[password-reset] branded email failed, falling back:", sent.reason);
    return false;
  }

  return true;
}

export async function requestPasswordReset(
  _prevState: PasswordResetState,
  formData: FormData
): Promise<PasswordResetState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
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

  // Preferred: our own token_hash recovery email (see helper). Only when Resend
  // isn't set up — or minting/sending fell through — do we drop to Supabase's
  // default recovery email, which uses the fragile PKCE `?code=` flow that
  // /auth/confirm now also handles, but which only works same-device.
  if (isResendConfigured()) {
    const sent = await trySendBrandedPasswordReset({ supabase, email, customHost, platformOrigin, returnParam });
    if (sent) {
      return { done: true };
    }
  }

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
