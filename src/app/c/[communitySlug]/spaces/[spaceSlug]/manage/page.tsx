import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck } from "lucide-react";
import { loadGuidedJourneyPage } from "@/lib/data/guided-journey-page";
import { displayName, getSpaceAdminData } from "@/lib/data/guided-journey";
import { MENTOR_LEVELS, REPORT_REASONS, mentorLevelLabel } from "@/lib/guided-journey/config";
import { GUIDED_JOURNEY_PRESETS } from "@/lib/guided-journey/presets";
import { deleteTemplate, moderateStory, resetSpaceToPreset, reviewReport, staffEndJourney, staffUpdateMentor } from "../journey-actions";
import { JourneyShell } from "@/components/guided-journey/journey-shell";
import { DuplicateSpaceForm, SpaceSettingsForm, TemplateForm } from "@/components/guided-journey/manage-forms";
import { Avatar } from "@/components/ui/avatar";
import { cn, formatRelativeTime } from "@/lib/utils";

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "settings", label: "Settings" },
  { key: "templates", label: "Templates" },
  { key: "mentors", label: "Mentors" },
  { key: "requests", label: "Requests" },
  { key: "journeys", label: "Journeys" },
  { key: "reports", label: "Reports" },
  { key: "gallery", label: "Gallery" },
  { key: "duplicate", label: "Duplicate" },
] as const;

// Community staff's control room for one guided-journey space. Moderators see
// everything and moderate; settings and duplication are admin-only (RLS agrees).
export default async function ManagePage({
  params,
  searchParams,
}: {
  params: Promise<{ communitySlug: string; spaceSlug: string }>;
  searchParams: Promise<{ tab?: string; created?: string }>;
}) {
  const ctx = await loadGuidedJourneyPage(params);
  if (!ctx.isStaff || !ctx.userId) notFound();
  const { tab: rawTab, created } = await searchParams;
  const tab = TABS.some((t) => t.key === rawTab) ? rawTab! : "overview";
  const data = await getSpaceAdminData(ctx.supabase, ctx.space.id);
  const { config } = ctx;
  const hidden = { community_slug: ctx.community.slug, space_slug: ctx.space.slug };

  const openReports = data.reports.filter((r) => r.status === "open");
  const activeJourneys = data.journeys.filter((j) => j.status === "active");
  const completedJourneys = data.journeys.filter((j) => j.status === "completed");
  const pendingRequests = data.requests.filter((r) => r.status === "pending");
  const availableMentors = data.mentors.filter((m) => m.status === "active" && !m.is_paused && m.activeBeginners < m.capacity);

  const adminCommunities = ctx.isAdmin
    ? (
        await ctx.supabase
          .from("community_memberships")
          .select("community:community_id (id, name)")
          .eq("user_id", ctx.userId)
          .eq("status", "active")
          .in("role", ["owner", "admin"])
      ).data ?? []
    : [];
  const communities = (adminCommunities as unknown as { community: { id: string; name: string } | null }[])
    .map((r) => r.community)
    .filter((c): c is { id: string; name: string } => Boolean(c));

  const smallBtn = "rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground transition hover:border-accent";

  return (
    <JourneyShell ctx={ctx} active="manage" wide title={`Manage ${ctx.space.name}`} intro={`Preset: ${ctx.preset.label}. Everything here changes wording and data — no code changes needed.`}>
      {created && <p className="mb-6 rounded-2xl bg-accent-soft px-4 py-3 text-sm font-medium text-accent">Your new space is ready. Adjust its wording, photos and templates below.</p>}
      <nav className="-mx-4 mb-8 overflow-x-auto px-4 sm:mx-0 sm:px-0" aria-label="Manage sections">
        <ul className="flex min-w-max gap-1.5">
          {TABS.map((t) => (
            <li key={t.key}>
              <Link
                href={`${ctx.basePath}/manage?tab=${t.key}`}
                aria-current={tab === t.key ? "page" : undefined}
                className={cn("inline-block rounded-full px-3.5 py-1.5 text-sm font-medium transition", tab === t.key ? "bg-accent text-accent-foreground" : "bg-muted text-foreground hover:bg-border")}
              >
                {t.label}
                {t.key === "reports" && openReports.length > 0 && <span className="ml-1.5 rounded-full bg-danger px-1.5 text-[10px] text-danger-foreground">{openReports.length}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {tab === "overview" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label={`Available ${config.terms.mentors}`} value={availableMentors.length} sub={`${data.mentors.length} in total`} />
          <Stat label="Pending requests" value={pendingRequests.length} />
          <Stat label="Active journeys" value={activeJourneys.length} />
          <Stat label="Completed journeys" value={completedJourneys.length} />
          <Stat label="Open reports" value={openReports.length} warn={openReports.length > 0} />
          <Stat label="Published stories" value={data.stories.filter((s) => s.status === "published").length} />
          <Stat label="Templates" value={data.templates.length} />
        </div>
      )}

      {tab === "settings" &&
        (ctx.isAdmin ? (
          <div className="space-y-6">
            <SpaceSettingsForm
              hidden={hidden}
              spaceId={ctx.space.id}
              userId={ctx.userId}
              config={config}
              acceptingMentors={ctx.settings?.accepting_mentors ?? true}
              acceptingBeginners={ctx.settings?.accepting_beginners ?? true}
            />
            <form action={resetSpaceToPreset} className="flex flex-wrap items-center gap-3 rounded-2xl border border-dashed border-border p-4 text-sm">
              <HiddenInputs base={hidden} />
              <span className="text-muted-foreground">Start over from a preset (clears your wording changes; templates and journeys are kept):</span>
              <select name="preset_key" defaultValue={ctx.preset.key} className="rounded-md border border-border bg-card px-3 py-1.5 text-sm">
                {GUIDED_JOURNEY_PRESETS.map((p) => (
                  <option key={p.key} value={p.key}>
                    {p.label}
                  </option>
                ))}
              </select>
              <button type="submit" className={smallBtn}>
                Reset wording
              </button>
            </form>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Only community admins can change settings.</p>
        ))}

      {tab === "templates" && (
        <div className="space-y-5">
          {data.templates.map((t) => (
            <details key={t.id} className="rounded-2xl border border-border bg-card p-4 sm:p-5">
              <summary className="cursor-pointer">
                <span className="font-semibold text-foreground">{t.title}</span>{" "}
                <span className="text-xs text-muted-foreground">
                  · {t.milestones.length} milestones{t.is_active ? "" : " · hidden"}
                </span>
              </summary>
              <div className="mt-4">
                <TemplateForm hidden={hidden} spaceId={ctx.space.id} userId={ctx.userId!} template={t} />
                <form action={deleteTemplate} className="mt-3">
                  <HiddenInputs base={hidden} extra={{ template_id: t.id }} />
                  <button type="submit" className="text-xs text-muted-foreground hover:text-danger">
                    Delete template (journeys already started keep their milestones)
                  </button>
                </form>
              </div>
            </details>
          ))}
          <div className="rounded-2xl border border-accent/40 bg-accent-soft/40 p-4 sm:p-5">
            <p className="mb-3 font-semibold text-foreground">New template</p>
            <TemplateForm hidden={hidden} spaceId={ctx.space.id} userId={ctx.userId} template={null} />
          </div>
        </div>
      )}

      {tab === "mentors" && (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          {data.mentors.length === 0 ? (
            <p className="p-5 text-sm text-muted-foreground">No {config.terms.mentors} yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {data.mentors.map((m) => (
                <li key={m.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div className="flex items-center gap-3">
                    <Avatar src={m.profile.avatar_url} name={displayName(m.profile)} size={36} />
                    <div>
                      <p className="flex items-center gap-1 text-sm font-semibold text-foreground">
                        {displayName(m.profile)}
                        {m.is_verified && <BadgeCheck className="h-4 w-4 text-accent" aria-label="Verified" />}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {mentorLevelLabel(m.level, config)} · {m.activeBeginners}/{m.capacity} supported · {m.completedJourneys} completed
                        {m.is_paused ? " · paused" : ""}
                        {m.status === "suspended" ? " · suspended" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <form action={staffUpdateMentor} className="flex items-center gap-1.5">
                      <HiddenInputs base={hidden} extra={{ mentor_profile_id: m.id }} />
                      <select name="level" defaultValue={m.level} aria-label="Level" className="rounded-md border border-border bg-card px-2 py-1 text-xs">
                        {MENTOR_LEVELS.map((l) => (
                          <option key={l.value} value={l.value}>
                            {mentorLevelLabel(l.value, config)}
                          </option>
                        ))}
                      </select>
                      <button type="submit" className={smallBtn}>
                        Set
                      </button>
                    </form>
                    <form action={staffUpdateMentor}>
                      <HiddenInputs base={hidden} extra={{ mentor_profile_id: m.id, is_verified: m.is_verified ? "false" : "true" }} />
                      <button type="submit" className={smallBtn}>
                        {m.is_verified ? "Remove verification" : "Verify"}
                      </button>
                    </form>
                    <form action={staffUpdateMentor}>
                      <HiddenInputs base={hidden} extra={{ mentor_profile_id: m.id, status: m.status === "active" ? "suspended" : "active" }} />
                      <button type="submit" className={cn(smallBtn, m.status === "active" && "hover:border-danger hover:text-danger")}>
                        {m.status === "active" ? "Suspend" : "Reinstate"}
                      </button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {tab === "requests" && (
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {data.requests.length === 0 && <li className="p-5 text-sm text-muted-foreground">No requests yet.</li>}
          {data.requests.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 p-4 text-sm">
              <span>
                <strong className="text-foreground">{displayName(r.beginner)}</strong> → <strong className="text-foreground">{displayName(r.mentor)}</strong>
                {r.template ? <span className="text-muted-foreground"> · {r.template.title}</span> : null}
              </span>
              <span className="text-xs text-muted-foreground">
                {r.status} · {formatRelativeTime(r.created_at)}
              </span>
            </li>
          ))}
        </ul>
      )}

      {tab === "journeys" && (
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {data.journeys.length === 0 && <li className="p-5 text-sm text-muted-foreground">No journeys yet.</li>}
          {data.journeys.map((j) => (
            <li key={j.id} className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
              <div>
                <Link href={`${ctx.basePath}/journeys/${j.id}`} className="font-semibold text-foreground hover:underline">
                  {j.title}
                </Link>
                <p className="text-xs text-muted-foreground">
                  {j.status} · {config.terms.mentor}: {displayName(j.mentor)} · started {formatRelativeTime(j.started_at)}
                  {j.is_group ? " · group" : ""}
                </p>
              </div>
              {j.status === "active" && (
                <form action={staffEndJourney}>
                  <HiddenInputs base={hidden} extra={{ journey_id: j.id, reason: "Ended by the community team" }} />
                  <button type="submit" className={cn(smallBtn, "hover:border-danger hover:text-danger")}>
                    End (staff)
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}

      {tab === "reports" && (
        <div className="space-y-4">
          {data.reports.length === 0 && <p className="rounded-2xl border border-dashed border-border p-5 text-sm text-muted-foreground">No reports. 🌱</p>}
          {data.reports.map((r) => (
            <article key={r.id} className={cn("rounded-2xl border bg-card p-4", r.status === "open" ? "border-danger/40" : "border-border")}>
              <p className="text-sm font-semibold text-foreground">
                {REPORT_REASONS.find((x) => x.value === r.reason)?.label ?? r.reason}
                <span className="ml-2 text-xs font-normal text-muted-foreground">
                  {r.status} · {formatRelativeTime(r.created_at)}
                </span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                By {displayName(r.reporter)}
                {r.reported ? ` · about ${displayName(r.reported)}` : ""}
                {r.journey_id ? (
                  <>
                    {" · "}
                    <Link href={`${ctx.basePath}/journeys/${r.journey_id}`} className="text-accent hover:underline">
                      open journey
                    </Link>
                  </>
                ) : null}
                {r.story_id ? (
                  <>
                    {" · "}
                    <Link href={`${ctx.basePath}/stories/${r.story_id}`} className="text-accent hover:underline">
                      open story
                    </Link>
                  </>
                ) : null}
              </p>
              {r.details && <p className="mt-2 whitespace-pre-line text-sm text-foreground">{r.details}</p>}
              {r.staff_note && <p className="mt-2 text-xs italic text-muted-foreground">Staff note: {r.staff_note}</p>}
              <form action={reviewReport} className="mt-3 flex flex-wrap items-center gap-2">
                <HiddenInputs base={hidden} extra={{ report_id: r.id }} />
                <input name="staff_note" placeholder="Note (optional)" defaultValue={r.staff_note ?? ""} className="min-w-0 flex-1 rounded-full border border-border bg-card px-3 py-1 text-xs" aria-label="Staff note" />
                <button type="submit" name="status" value="resolved" className={smallBtn}>
                  Resolved
                </button>
                <button type="submit" name="status" value="dismissed" className={smallBtn}>
                  Dismiss
                </button>
                {r.status !== "open" && (
                  <button type="submit" name="status" value="open" className={smallBtn}>
                    Reopen
                  </button>
                )}
              </form>
            </article>
          ))}
          <p className="text-xs text-muted-foreground">
            To act on a person: suspend them as a {config.terms.mentor} in the Mentors tab, end a journey in Journeys, hide an update from the journey page, or manage their
            community membership in the community admin.
          </p>
        </div>
      )}

      {tab === "gallery" && (
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {data.stories.length === 0 && <li className="p-5 text-sm text-muted-foreground">No published stories yet.</li>}
          {data.stories.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
              <div>
                <Link href={`${ctx.basePath}/stories/${s.id}`} className="font-semibold text-foreground hover:underline">
                  {s.title}
                </Link>
                <p className="text-xs text-muted-foreground">
                  {displayName(s.author)} · {s.status}
                  {s.hidden_reason ? ` · ${s.hidden_reason}` : ""}
                </p>
              </div>
              <form action={moderateStory} className="flex items-center gap-2">
                <HiddenInputs base={hidden} extra={{ story_id: s.id, hide: s.status === "hidden" ? "false" : "true" }} />
                {s.status !== "hidden" && <input name="reason" placeholder="Reason" className="rounded-full border border-border bg-card px-3 py-1 text-xs" aria-label="Reason" />}
                <button type="submit" className={smallBtn}>
                  {s.status === "hidden" ? "Restore" : "Hide"}
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}

      {tab === "duplicate" &&
        (ctx.isAdmin ? (
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-sm text-muted-foreground">
              Make a new guided-journey space from this one — in {ctx.community.name} or another community you run. For example, duplicate &ldquo;Adopt a Beginner&rdquo; as
              &ldquo;Adopt a New Sailor&rdquo; with the sailing preset, then change the photos and milestones.
            </p>
            <DuplicateSpaceForm
              hidden={hidden}
              spaceId={ctx.space.id}
              communities={communities.length > 0 ? communities : [{ id: ctx.community.id, name: ctx.community.name }]}
              currentCommunityId={ctx.community.id}
              presets={GUIDED_JOURNEY_PRESETS.map((p) => ({ key: p.key, label: p.label, spaceName: p.spaceName }))}
              currentPreset={ctx.preset.key}
              spaceName={ctx.space.name}
            />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Only community admins can duplicate spaces.</p>
        ))}
    </JourneyShell>
  );
}

function HiddenInputs({ base, extra }: { base: Record<string, string>; extra?: Record<string, string> }) {
  return (
    <>
      {Object.entries({ ...base, ...extra }).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
    </>
  );
}

function Stat({ label, value, sub, warn = false }: { label: string; value: number; sub?: string; warn?: boolean }) {
  return (
    <div className={cn("rounded-2xl border bg-card p-5", warn ? "border-danger/40" : "border-border")}>
      <p className="text-3xl font-semibold text-foreground">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}
