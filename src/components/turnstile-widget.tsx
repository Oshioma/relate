"use client";

import Script from "next/script";

// Renders the Cloudflare Turnstile challenge inside the enclosing <form>. The
// widget's implicit rendering adds a hidden <input name="cf-turnstile-response">
// to that form, so the token is submitted with the rest of the fields and the
// server action can verify it — no client state to thread through. Only mounted
// when NEXT_PUBLIC_TURNSTILE_SITE_KEY is set (see the signup form).
export function TurnstileWidget({ siteKey }: { siteKey: string }) {
  return (
    <div>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
        strategy="afterInteractive"
      />
      <div className="cf-turnstile" data-sitekey={siteKey} data-theme="auto" />
    </div>
  );
}
