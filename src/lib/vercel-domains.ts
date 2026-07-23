import "server-only";

// Optional Vercel Domains API integration: when VERCEL_TOKEN and
// VERCEL_PROJECT_ID are set, verifying a custom domain also registers it on
// the Vercel project (routing + automatic SSL), making domain setup fully
// self-serve. Without them, everything still works — the platform operator
// just adds the domain in Vercel → Settings → Domains by hand.

export function isVercelDomainAutomationConfigured() {
  return Boolean(process.env.VERCEL_TOKEN && process.env.VERCEL_PROJECT_ID);
}

function vercelApiUrl(path: string) {
  const teamId = process.env.VERCEL_TEAM_ID;
  return `https://api.vercel.com${path}${teamId ? `?teamId=${encodeURIComponent(teamId)}` : ""}`;
}

export async function addDomainToVercelProject(
  domain: string
): Promise<{ ok: true } | { ok: false; reason: string } | { skipped: true }> {
  if (!isVercelDomainAutomationConfigured()) return { skipped: true };

  try {
    const res = await fetch(
      vercelApiUrl(`/v10/projects/${encodeURIComponent(process.env.VERCEL_PROJECT_ID!)}/domains`),
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: domain }),
        cache: "no-store",
      }
    );
    if (res.ok) return { ok: true };

    const body = (await res.json().catch(() => null)) as { error?: { code?: string; message?: string } } | null;
    const code = body?.error?.code ?? "";
    // Re-verifying an already-registered domain shouldn't read as a failure.
    if (code.includes("already_exists") || code.includes("domain_exists")) return { ok: true };
    return { ok: false, reason: body?.error?.message ?? `Vercel API responded ${res.status}` };
  } catch {
    return { ok: false, reason: "couldn't reach the Vercel API" };
  }
}

// Best-effort cleanup when an owner disconnects their domain — a leftover
// domain on the Vercel project routes to the platform landing page, which
// is harmless, so failures here are ignored rather than surfaced.
export async function removeDomainFromVercelProject(domain: string): Promise<void> {
  if (!isVercelDomainAutomationConfigured()) return;

  try {
    await fetch(
      vercelApiUrl(
        `/v9/projects/${encodeURIComponent(process.env.VERCEL_PROJECT_ID!)}/domains/${encodeURIComponent(domain)}`
      ),
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${process.env.VERCEL_TOKEN}` },
        cache: "no-store",
      }
    );
  } catch {
    // Ignore — the operator can remove it from the Vercel dashboard.
  }
}
