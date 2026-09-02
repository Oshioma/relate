import Link from "next/link";
import { MailCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const next = params.next?.startsWith("/") ? params.next : "/dashboard";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm text-center">
        <Card>
          <CardContent className="pt-8 pb-8">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent">
              <MailCheck className="h-6 w-6" />
            </div>
            <h1 className="text-lg font-semibold text-foreground">Check your inbox</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              We sent you a confirmation link. Click it, then press{" "}
              <span className="font-medium text-foreground">Confirm my email</span> to activate your account and sign
              in.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Nothing after a few minutes? Check your spam folder first.
            </p>
            <Link
              href={`/signup/resend?next=${encodeURIComponent(next)}`}
              className="mt-4 inline-block text-sm font-medium text-accent hover:underline"
            >
              Send the link again
            </Link>
            <p className="mt-4">
              <Link href="/login" className="text-sm font-medium text-muted-foreground hover:underline">
                Back to sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
