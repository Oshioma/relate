"use client";

import { useActionState } from "react";
import { Globe, CheckCircle2 } from "lucide-react";
import { setCustomDomain, verifyCustomDomain, removeCustomDomain, type CustomDomainState } from "./actions";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { verificationRecordName } from "@/lib/custom-domain";
import type { Community } from "@/types/database";

function RecordRow({ label, name, value }: { label: string; name: string; value: string }) {
  return (
    <div className="rounded-md bg-muted px-3 py-2 text-xs">
      <p className="mb-1 font-medium text-muted-foreground">{label}</p>
      <p className="break-all font-mono text-foreground">
        {name} → {value}
      </p>
    </div>
  );
}

export function CustomDomainSection({ community }: { community: Community }) {
  const [connectState, connectAction] = useActionState<CustomDomainState, FormData>(setCustomDomain, undefined);
  const [verifyState, verifyAction] = useActionState<CustomDomainState, FormData>(verifyCustomDomain, undefined);
  const [removeState, removeAction] = useActionState<CustomDomainState, FormData>(removeCustomDomain, undefined);

  const domain = community.custom_domain;
  const verified = Boolean(domain && community.custom_domain_verified_at);

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
              <span className="font-mono">{domain}</span> is connected but not verified yet. Add these DNS records at
              your domain registrar:
            </p>
            <RecordRow
              label="1. TXT record — proves you own the domain"
              name={verificationRecordName(domain)}
              value={community.custom_domain_token ?? ""}
            />
            <RecordRow label="2. A record — points the domain at the platform" name={domain} value="76.76.21.21" />
            <p className="text-xs text-muted-foreground">
              For a www subdomain use a CNAME to <span className="font-mono">cname.vercel-dns.com</span> instead of the
              A record. The platform operator also needs to add {domain} to the hosting project (Vercel → Settings →
              Domains) so it gets an SSL certificate.
            </p>
            {verifyState?.error && <p className="text-sm text-danger">{verifyState.error}</p>}
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
            <RemoveForm action={removeAction} state={removeState} hiddenFields={hiddenFields} />
          </div>
        )}
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
