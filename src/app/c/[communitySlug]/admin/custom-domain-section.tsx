"use client";

import { useActionState, useState } from "react";
import { Globe, CheckCircle2, Copy, Check } from "lucide-react";
import { setCustomDomain, verifyCustomDomain, removeCustomDomain, type CustomDomainState } from "./actions";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { verificationRecordName, communitySubdomainUrl, VERIFICATION_RECORD_PREFIX } from "@/lib/custom-domain";
import type { Community } from "@/types/database";

// Click-to-copy for a single registrar field. The whole value is the button
// (a fat, obvious target) and the icon flips to a check for a moment so the
// owner knows the copy worked before switching tabs.
function CopyableValue({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <button
      type="button"
      onClick={copy}
      title="Click to copy"
      className="group inline-flex max-w-full items-baseline gap-1.5 text-left"
    >
      <span className="break-all font-mono text-foreground underline decoration-dotted decoration-border underline-offset-2 group-hover:text-accent">
        {value}
      </span>
      {copied ? (
        <Check className="h-3 w-3 shrink-0 self-center text-accent" />
      ) : (
        <Copy className="h-3 w-3 shrink-0 self-center text-muted-foreground group-hover:text-accent" />
      )}
    </button>
  );
}

// Laid out as Type / Name / Value because that's exactly the three boxes a
// registrar's "add record" form shows — the owner copies field by field
// instead of decoding an arrow diagram. Name and Value are click-to-copy;
// Type is a dropdown at every registrar, so there's nothing to paste.
function RecordRow({ title, why, type, name, value }: { title: string; why: string; type: string; name: string; value: string }) {
  return (
    <div className="rounded-md bg-muted px-3 py-2.5 text-xs">
      <p className="mb-1.5 font-medium text-foreground">
        {title} <span className="font-normal text-muted-foreground">— {why}</span>
      </p>
      <div className="space-y-0.5">
        <p>
          <span className="text-muted-foreground">Type: </span>
          <span className="font-mono text-foreground">{type}</span>
        </p>
        <p>
          <span className="text-muted-foreground">Name (or Host): </span>
          <CopyableValue value={name} />
        </p>
        <p>
          <span className="text-muted-foreground">Value: </span>
          <CopyableValue value={value} />
        </p>
      </div>
    </div>
  );
}

// vercelAutomated: whether the server has Vercel API credentials, i.e.
// whether verifying also registers the domain with the host automatically —
// decides which instructions the owner sees. Comes from the server page
// because env vars aren't readable in a client component.
export function CustomDomainSection({ community, vercelAutomated }: { community: Community; vercelAutomated: boolean }) {
  const [connectState, connectAction] = useActionState<CustomDomainState, FormData>(setCustomDomain, undefined);
  const [verifyState, verifyAction] = useActionState<CustomDomainState, FormData>(verifyCustomDomain, undefined);
  const [removeState, removeAction] = useActionState<CustomDomainState, FormData>(removeCustomDomain, undefined);

  const domain = community.custom_domain;
  const verified = Boolean(domain && community.custom_domain_verified_at);
  // NEXT_PUBLIC_SITE_URL is inlined into the client bundle, so this works
  // in a client component; null while the platform runs on localhost or a
  // bare *.vercel.app host, where wildcard subdomains don't resolve.
  const subdomainUrl = communitySubdomainUrl(community.slug);

  const hiddenFields = (
    <>
      <input type="hidden" name="community_id" value={community.id} />
      <input type="hidden" name="community_slug" value={community.slug} />
    </>
  );

  return (
    <Card>
      <CardContent className="pt-5">
        <div className="flex items-start gap-2.5">
          <Globe className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
          <div>
            <p className="text-sm font-semibold text-foreground">Custom domain</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Serve {community.name} on a domain you own, like <span className="font-mono">mzunguzanzibar.com</span>,
              instead of /c/{community.slug}.
            </p>
            {subdomainUrl && (
              <p className="mt-1 text-xs text-muted-foreground">
                Already included, no setup needed:{" "}
                <a
                  href={subdomainUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono underline decoration-dotted underline-offset-2"
                >
                  {subdomainUrl.replace(/^https?:\/\//, "")}
                </a>
              </p>
            )}
          </div>
        </div>

        {!domain && (
          <form action={connectAction} className="mt-4 space-y-3">
            {hiddenFields}
            <div>
              <Label htmlFor="custom_domain">Domain</Label>
              <Input id="custom_domain" name="domain" placeholder="mzunguzanzibar.com" autoComplete="off" />
            </div>
            {connectState?.error && <p className="text-sm text-danger">{connectState.error}</p>}
            <SubmitButton pendingText="Connecting…" className="w-auto">
              Connect domain
            </SubmitButton>
          </form>
        )}

        {domain && !verified && (
          <div className="mt-4 space-y-3">
            <p className="text-sm text-foreground">
              One last step. Log in to the website where you bought <span className="font-mono">{domain}</span> (like
              GoDaddy or Namecheap), open its <strong>DNS settings</strong>, and add these two records — copy each field
              exactly:
            </p>
            <RecordRow
              title="Record 1"
              why="a secret code that proves the domain is yours"
              type="TXT"
              name={VERIFICATION_RECORD_PREFIX}
              value={community.custom_domain_token ?? ""}
            />
            <RecordRow
              title="Record 2"
              why="sends visitors to your community"
              type="A"
              name="@"
              value="76.76.21.21"
            />
            <p className="text-xs text-muted-foreground">
              &ldquo;@&rdquo; means the domain itself. If your provider wants a full name for record 1, use{" "}
              <span className="font-mono">{verificationRecordName(domain)}</span>. Save, wait a few minutes (DNS changes
              travel slowly — sometimes up to an hour), then press the button below.
              {vercelAutomated
                ? " Everything else, including the security certificate, happens automatically."
                : ` After it verifies, the platform operator adds ${domain} in Vercel → Settings → Domains to switch it on.`}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <form action={verifyAction}>
                {hiddenFields}
                <SubmitButton pendingText="Checking DNS…" className="w-auto">
                  Check verification
                </SubmitButton>
              </form>
              <RemoveForm action={removeAction} state={removeState} hiddenFields={hiddenFields} />
            </div>
          </div>
        )}

        {domain && verified && (
          <div className="mt-4 space-y-3">
            <p className="flex items-center gap-1.5 text-sm text-foreground">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />
              <a
                href={`https://${domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono underline decoration-dotted underline-offset-2"
              >
                {domain}
              </a>
              <span className="text-muted-foreground">is verified and serving this community.</span>
            </p>
            <p className="text-xs text-muted-foreground">
              {vercelAutomated
                ? "The SSL certificate can take a minute or two to be issued right after verification."
                : `If the domain doesn't load yet, the platform operator may still need to add ${domain} to the hosting project (Vercel → Settings → Domains).`}
            </p>
            <RemoveForm action={removeAction} state={removeState} hiddenFields={hiddenFields} />
          </div>
        )}

        {/* Outside the branches: verification can succeed (switching to the
            verified card above) while hosting registration fails — this
            error has to stay visible through that switch. */}
        {verifyState?.error && <p className="mt-3 text-sm text-danger">{verifyState.error}</p>}
      </CardContent>
    </Card>
  );
}

function RemoveForm({
  action,
  state,
  hiddenFields,
}: {
  action: (formData: FormData) => void;
  state: CustomDomainState;
  hiddenFields: React.ReactNode;
}) {
  return (
    <form action={action}>
      {hiddenFields}
      {state?.error && <p className="mb-2 text-sm text-danger">{state.error}</p>}
      <SubmitButton pendingText="Removing…" variant="ghost" className="w-auto text-danger">
        Remove domain
      </SubmitButton>
    </form>
  );
}
