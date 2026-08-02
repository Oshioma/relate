import type { Metadata } from "next";
import Link from "next/link";
import { RichText } from "@/components/ui/rich-text";
import { OWNER_AGREEMENT_MARKDOWN, OWNER_AGREEMENT_UPDATED_LABEL } from "@/lib/owner-agreement";

export const metadata: Metadata = { title: "Community Owner Agreement — Relate" };

// The Community Owner Agreement is fixed platform text (not admin-editable like
// the general Terms), so it renders straight from the shared constant that the
// creation wizard's acceptance checkbox also references — one source of truth.
export default function CommunityOwnerAgreementPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
        ← Relate
      </Link>
      <h1 className="mb-1 mt-4 text-2xl font-semibold tracking-tight text-foreground">Community Owner Agreement</h1>
      <p className="mb-6 text-sm text-muted-foreground">Last updated: {OWNER_AGREEMENT_UPDATED_LABEL}</p>
      <RichText content={OWNER_AGREEMENT_MARKDOWN} />
    </div>
  );
}
