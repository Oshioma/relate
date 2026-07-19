import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
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
          <h1 className="mt-4 text-xl font-semibold text-foreground">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to your communities.</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            {params.error === "confirmation-failed" && (
              <p className="mb-4 rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">
                That confirmation link is invalid or expired. Try signing in, or sign up again.
              </p>
            )}
            <LoginForm next={next} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
