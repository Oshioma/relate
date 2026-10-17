"use client";

import { useState, useTransition } from "react";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { copyArchivePicturesAction, importArchiveWork, installArchiveLibrary } from "./actions";

// STAFF: put the archive into this community.
//
// Step one installs every inventoried work, its marker and its dates. Step two
// imports a work's passages a chunk at a time, calling the server again until
// it reports done; the progress line is the run's own cursor. Closing the tab
// mid-import is safe: the next press resumes where the cursor stopped.
//
// A button turns to a tick once its step has finished — from the page's own
// reading of the database on load, or from this session's run — so it is
// plain at a glance what has been done.
//
// Step three copies the pictures into the community's own storage. It runs by
// itself after each import, and has its own button for pictures imported
// before copying existed.

export function ImportPanel({
  communitySlug,
  installed,
  picturesToCopy,
  importable,
}: {
  communitySlug: string;
  installed: boolean;
  picturesToCopy: number;
  importable: { workKey: string; title: string; imported: boolean }[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [log, setLog] = useState<string[]>([]);
  const [running, setRunning] = useState<string | null>(null);
  const [justInstalled, setJustInstalled] = useState(false);
  const [justImported, setJustImported] = useState<Set<string>>(() => new Set());
  const [failed, setFailed] = useState<Set<string>>(() => new Set());
  const [picturesLeft, setPicturesLeft] = useState(picturesToCopy);
  const libraryReady = installed || justInstalled;
  const say = (line: string) => setLog((current) => [...current, line]);

  function install() {
    startTransition(async () => {
      setRunning("library");
      say("Installing the library…");
      const response = await installArchiveLibrary(communitySlug);
      setRunning(null);
      if ("error" in response) return say(`Stopped: ${response.error}`);
      setJustInstalled(true);
      const r = response.result;
      say(
        `Library ready: ${r.works} works, ${r.markersAdded} new markers, ${r.claimsAdded} dates added, ${r.linksAdded} links.` +
          (r.missingAnchors.length ? ` Not on this timeline yet: ${r.missingAnchors.join(", ")}.` : "")
      );
      router.refresh();
    });
  }

  function importWork(workKey: string, title: string, restart: boolean) {
    startTransition(async () => {
      setRunning(workKey);
      setFailed((current) => without(current, workKey));
      say(`Importing ${title}…`);
      let first = true;
      for (;;) {
        const response = await importArchiveWork(communitySlug, workKey, restart && first);
        first = false;
        if ("error" in response) {
          setRunning(null);
          setFailed((current) => new Set(current).add(workKey));
          return say(`${title} stopped: ${response.error} — press import again to resume.`);
        }
        const r = response.result;
        say(`${title}: ${r.cursor} of ${r.total} passages (${r.inserted} new, ${r.updated} changed, ${r.unchanged} unchanged).`);
        if (r.done) break;
      }
      setJustImported((current) => new Set(current).add(workKey));
      say(`${title} imported.`);
      await copyPictures();
      setRunning(null);
      router.refresh();
    });
  }

  // Calls again while pictures remain; a picture that fails is reported once
  // and skipped for the rest of the run.
  async function copyPictures() {
    setRunning("pictures");
    const skip: string[] = [];
    let copied = 0;
    for (;;) {
      const response = await copyArchivePicturesAction(communitySlug, skip);
      if ("error" in response) {
        say(`Copying pictures stopped: ${response.error}`);
        break;
      }
      const r = response.result;
      copied += r.copied;
      for (const failure of r.failed) {
        skip.push(failure.key);
        say(`Picture ${failure.key} not copied: ${failure.reason}`);
      }
      setPicturesLeft(r.remaining + skip.length);
      if (r.remaining === 0 || r.copied + r.failed.length === 0) break;
    }
    if (copied > 0) say(`${copied} picture${copied === 1 ? "" : "s"} copied into this site's storage.`);
    setRunning(null);
  }

  function copyAllPictures() {
    startTransition(async () => {
      say("Copying pictures…");
      await copyPictures();
      router.refresh();
    });
  }

  return (
    <section className="mt-6 rounded-xl border border-border bg-card p-4">
      <h2 className="text-sm font-semibold text-foreground">Staff: import</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Install the library first. Each import is validated before anything is written, can be run again safely, and
        resumes where it stopped.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={install}
          className={
            libraryReady && running !== "library"
              ? "inline-flex items-center gap-1.5 rounded-lg border border-emerald-600/40 bg-emerald-600/10 px-3 py-1.5 text-sm font-medium text-emerald-700 disabled:opacity-50 dark:text-emerald-400"
              : "rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground disabled:opacity-50"
          }
          title={libraryReady ? "Run again to pick up changes to the inventory" : undefined}
        >
          {running === "library" ? (
            "Installing…"
          ) : libraryReady ? (
            <>
              <Check className="h-4 w-4" /> Library installed
            </>
          ) : (
            "Install the library"
          )}
        </button>
        {libraryReady && (
          <button
            type="button"
            disabled={pending || picturesLeft === 0}
            onClick={copyAllPictures}
            className={
              picturesLeft === 0 && running !== "pictures"
                ? "inline-flex items-center gap-1.5 rounded-lg border border-emerald-600/40 bg-emerald-600/10 px-3 py-1.5 text-sm font-medium text-emerald-700 disabled:opacity-100 dark:text-emerald-400"
                : "rounded-lg border border-border px-3 py-1.5 text-sm text-foreground hover:bg-muted disabled:opacity-50"
            }
            title="Copy the archive's pictures into this site's own storage, so they keep working if the original moves"
          >
            {running === "pictures" ? (
              "Copying pictures…"
            ) : picturesLeft === 0 ? (
              <>
                <Check className="h-4 w-4" /> Pictures copied
              </>
            ) : (
              `Copy ${picturesLeft} picture${picturesLeft === 1 ? "" : "s"}`
            )}
          </button>
        )}
        {importable.map((work) => {
          const done = (work.imported || justImported.has(work.workKey)) && !failed.has(work.workKey) && running !== work.workKey;
          return (
            <span
              key={work.workKey}
              className={
                done
                  ? "inline-flex overflow-hidden rounded-lg border border-emerald-600/40 bg-emerald-600/10"
                  : "inline-flex overflow-hidden rounded-lg border border-border"
              }
            >
              <button
                type="button"
                disabled={pending || !libraryReady}
                onClick={() => importWork(work.workKey, work.title, false)}
                className={
                  done
                    ? "inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-emerald-700 disabled:opacity-50 dark:text-emerald-400"
                    : "px-3 py-1.5 text-sm text-foreground hover:bg-muted disabled:opacity-50"
                }
              >
                {running === work.workKey ? (
                  `Importing ${work.title}…`
                ) : done ? (
                  <>
                    <Check className="h-4 w-4" /> {work.title} imported
                  </>
                ) : (
                  `Import ${work.title}`
                )}
              </button>
              <button
                type="button"
                disabled={pending || !libraryReady}
                onClick={() => importWork(work.workKey, work.title, true)}
                className="border-l border-border px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted disabled:opacity-50"
                title="Re-check every passage even if the file has not changed"
              >
                re-run
              </button>
            </span>
          );
        })}
      </div>
      {log.length > 0 && (
        <ol className="mt-3 max-h-48 overflow-y-auto rounded-lg bg-muted p-2 font-mono text-xs text-foreground" aria-live="polite">
          {log.map((line, index) => (
            <li key={index}>{line}</li>
          ))}
        </ol>
      )}
    </section>
  );
}

function without(set: Set<string>, key: string) {
  const next = new Set(set);
  next.delete(key);
  return next;
}
