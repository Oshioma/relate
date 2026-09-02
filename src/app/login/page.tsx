import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { LoginForm } from "./login-form";

// Why a confirmation link can land back here, and what actually helps:
//   • link-expired         — the token was spent or timed out. Almost always a
//                            mail scanner opening the link first, or a link
//                            that sat in the inbox past its window. A fresh
//                            link is the fix, so lead with that.
//   • confirmation-failed  — the URL carried no credential at all (truncated
//                            by a mail client, hand-edited). A fresh link
//                            fixes that too, but say what happened honestly.
function confirmationNotice(error: string | undefined): string | null {
  switch (error) {
    case "link-expired":
      return "That confirmation link has already been used or has expired — some email providers open links automatically, which uses them up. Send yourself a new one below, it only takes a moment.";
    case "confirmation-failed":
      return "That confirmation link didn't come through in one piece — email apps sometimes cut long links in half. Send yourself a new one below.";
    default:
      return null;
  }
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const next = params.next?.startsWith("/") ? params.next : "/dashboard";
  const notice = confirmationNotice(params.error);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="text-lg font-semibold tracking-tight text-foreground">
            Relate
          </Link>
          <h1 className="mt-4 text-xl font-semibold text-foreground">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            One account, every community — sign in with the same details wherever you joined.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            {notice && (
              <div className="mb-4 rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">
                <p>{notice}</p>
                <Link
                  href={`/signup/resend?next=${encodeURIComponent(next)}`}
                  className="mt-2 inline-block font-medium underline"
                >
                  Send me a new activation link
                </Link>
              </div>
            )}
            <LoginForm next={next} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
