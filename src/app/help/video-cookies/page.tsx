import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

// How to give the video worker cookies, for when YouTube (or Facebook /
// Instagram) refuses it. The composer's error messages link here.
//
// A page on the site rather than only the worker's README: the README lives in
// a private repository, so a teacher following the link from the composer
// would hit a GitHub 404. Public, and listed as a platform path in proxy.ts,
// so the link works from a community's own domain and while signed out — it
// holds no secrets, only steps.

export const metadata: Metadata = { title: "Fix video downloads with cookies — Relate" };

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent">
        {n}
      </span>
      <div className="min-w-0 pt-0.5">
        <p className="font-medium text-foreground">{title}</p>
        <div className="mt-1 space-y-2 text-sm text-muted-foreground">{children}</div>
      </div>
    </li>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground">{children}</code>;
}

export default function VideoCookiesHelpPage() {
  // The worker's own address, so "check it worked" is one click. Not a
  // secret — every route but /health needs the shared key.
  const workerUrl = process.env.VIDEO_WORKER_URL?.replace(/\/+$/, "") ?? null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
        ← Relate
      </Link>
      <h1 className="mb-2 mt-4 text-2xl font-semibold tracking-tight text-foreground">
        Fix video downloads with cookies
      </h1>
      <p className="text-sm text-muted-foreground">
        YouTube sometimes blocks our video server until it&apos;s signed in. Five minutes, once — then videos
        work.
      </p>

      <ol className="mt-8 space-y-6">
        <Step n={1} title="Add the cookie extension to Chrome">
          <p>
            Install{" "}
            <a
              href="https://chromewebstore.google.com/search/Get%20cookies.txt%20LOCALLY"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1 text-accent hover:underline"
            >
              Get cookies.txt LOCALLY
              <ExternalLink className="h-3 w-3" />
            </a>
            . Then in <Code>chrome://extensions</Code> → its <strong>Details</strong>, turn on{" "}
            <strong>Allow in Incognito</strong>.
          </p>
        </Step>

        <Step n={2} title="Sign in to YouTube in an Incognito window">
          <p>
            Open Incognito (<Code>⌘ + Shift + N</Code>) and sign in to youtube.com with a <strong>spare</strong>{" "}
            Google account, not your main one.
          </p>
        </Step>

        <Step n={3} title="Copy the cookies, then close the window">
          <p>
            Go to <Code>youtube.com/robots.txt</Code>, click the extension, click <strong>Copy</strong>. Close the
            Incognito window straight away.
          </p>
        </Step>

        <Step n={4} title="Paste them into Railway">
          <p>
            <a
              href="https://railway.com/dashboard"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1 text-accent hover:underline"
            >
              Railway
              <ExternalLink className="h-3 w-3" />
            </a>{" "}
            → the video worker → <strong>Variables</strong> → <strong>New Variable</strong>. Name it{" "}
            <Code>COOKIES_TXT</Code>, paste, click <strong>Add</strong>, then <strong>Deploy</strong>.
          </p>
        </Step>

        <Step n={5} title="Try the video again">
          <p>
            Give the deploy a minute or two first.
            {workerUrl && (
              <>
                {" "}
                <a
                  href={`${workerUrl}/health`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1 text-accent hover:underline"
                >
                  Check it&apos;s ready
                  <ExternalLink className="h-3 w-3" />
                </a>{" "}
                — it should say <Code>&quot;cookies&quot;:true</Code>.
              </>
            )}
          </p>
        </Step>
      </ol>

      <div className="mt-10 space-y-2 border-t border-border pt-5 text-xs text-muted-foreground">
        <p>
          <strong className="text-foreground">Stopped working weeks later?</strong> Cookies expire — do steps 2–4
          again and replace the value.
        </p>
        <p>
          <strong className="text-foreground">Facebook or Instagram?</strong> In step 2, sign in to those too, and in
          step 3 copy from each site as well, pasting them all into the one value.
        </p>
        <p>
          <strong className="text-foreground">Still blocked?</strong> YouTube is blocking the server itself. Add a
          residential proxy in Railway as <Code>YTDLP_PROXY</Code>.
        </p>
      </div>
    </div>
  );
}
