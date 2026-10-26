import Link from "@/components/ui/link";
import { CheckCircle2, Mail, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { safeReturnPath } from "@/lib/auth-return";
import { SetPasswordForm } from "./set-password-form";

export const metadata = { title: "Welcome" };

// Where a guest buyer lands after paying from a shareable buy link (see
// membership/paid/route.ts, which decides the state). Nothing here is trusted
// for access: it only words what already happened.
export default async function CheckoutWelcomePage({
  params,
  searchParams,
}: {
  params: Promise<{ communitySlug: string }>;
  searchParams: Promise<{ state?: string; next?: string; item?: string; to?: string; sent?: string }>;
}) {
  const { communitySlug } = await params;
  const { state, next: nextRaw, item, to, sent } = await searchParams;
  const next = safeReturnPath(nextRaw, `/c/${communitySlug}`);
  const what = item ? item.slice(0, 120) : "your purchase";

  const button = (label: string) => (
    <Link
      href={next}
      className="mt-5 inline-flex w-full items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:opacity-90"
    >
      {label}
    </Link>
  );

  let body: React.ReactNode;
  if (state === "new" || state === "in") {
    body = (
      <>
        <Heading icon={<CheckCircle2 className="h-6 w-6 text-accent" />} title="You're in!" />
        <p className="mt-2 text-base text-muted-foreground">
          Thanks for paying for {what}. You&apos;re signed in and your membership is ready.
        </p>
        {button("Start now")}
        {state === "new" && (
          <div className="mt-8 border-t border-border pt-6">
            <h2 className="text-sm font-semibold text-foreground">Set a password (optional)</h2>
            <p className="mt-1 mb-4 text-sm text-muted-foreground">
              So you can sign in on your phone or another computer with your email and password.
            </p>
            <SetPasswordForm />
          </div>
        )}
      </>
    );
  } else if (state === "email") {
    const address = to ? to.slice(0, 120) : "your email";
    body =
      sent === "0" ? (
        <>
          <Heading icon={<CheckCircle2 className="h-6 w-6 text-accent" />} title="Payment received" />
          <p className="mt-2 text-base text-muted-foreground">
            {what[0].toUpperCase() + what.slice(1)} is on the account for {address}, which you already had. Sign in to start. If
            you&apos;ve forgotten your password, use &quot;Forgot password&quot; on the sign-in page.
          </p>
          <Link
            href={`/login?next=${encodeURIComponent(next)}`}
            className="mt-5 inline-flex w-full items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:opacity-90"
          >
            Sign in
          </Link>
        </>
      ) : (
        <>
          <Heading icon={<Mail className="h-6 w-6 text-accent" />} title="Check your email" />
          <p className="mt-2 text-base text-muted-foreground">
            Payment received. {address} already has an account, so we&apos;ve added {what} to it and emailed a sign-in
            link there. Open it to start.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Rather use your password?{" "}
            <Link href={`/login?next=${encodeURIComponent(next)}`} className="text-accent underline-offset-2 hover:underline">
              Sign in here
            </Link>
          </p>
        </>
      );
  } else if (state === "pending") {
    body = (
      <>
        <Heading icon={<Clock className="h-6 w-6 text-accent" />} title="Payment on its way" />
        <p className="mt-2 text-base text-muted-foreground">
          Your bank is still sending the payment for {what}. You&apos;ll get access as soon as it arrives, usually within a few
          days. Sign in with the email you paid with to check.
        </p>
      </>
    );
  } else {
    body = (
      <>
        <Heading icon={<AlertCircle className="h-6 w-6 text-danger" />} title="Payment received, one more step" />
        <p className="mt-2 text-base text-muted-foreground">
          We got your payment but couldn&apos;t finish setting up your account just now. It usually sorts itself out within a
          minute: sign in with the email you paid with (use &quot;Forgot password&quot; if you never set one). If that
          doesn&apos;t work, contact the community&apos;s admins.
        </p>
        <Link
          href={`/login?next=${encodeURIComponent(next)}`}
          className="mt-5 inline-flex w-full items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:opacity-90"
        >
          Sign in
        </Link>
      </>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:px-6 sm:py-14">
      <Card>
        <CardContent className="pt-6">{body}</CardContent>
      </Card>
    </div>
  );
}

function Heading({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-foreground">
      {icon}
      {title}
    </h1>
  );
}
