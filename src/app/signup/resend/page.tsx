import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ResendConfirmationForm } from "./resend-form";

// The way out for anyone stuck between "created an account" and "confirmed
// it": the email never arrived, or the link had been spent by a mail scanner
// before they clicked it. Signing up again used to be the only thing to try,
// and it answered "you already have an account" while sending nothing.
export default async function ResendConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const next = params.next?.startsWith("/") ? params.next : "/dashboard";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="text-lg font-semibold tracking-tight text-foreground">
            Relate
          </Link>
          <h1 className="mt-4 text-xl font-semibold text-foreground">Send a new activation link</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Signed up but never got in? Enter the address you used and we&apos;ll email you a fresh confirmation link.
            The old one stops working.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <ResendConfirmationForm next={next} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
