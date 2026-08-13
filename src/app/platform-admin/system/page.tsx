import { redirect } from "next/navigation";
import { CheckCircle2, XCircle, AlertTriangle, MinusCircle, Database } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, getProfile } from "@/lib/data/profile";
import { getSystemCheck, type CheckStatus, type SystemCheckItem } from "@/lib/data/system-check";

export const dynamic = "force-dynamic";

const STATUS_META: Record<CheckStatus, { label: string; className: string; Icon: typeof CheckCircle2 }> = {
  ok: { label: "OK", className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", Icon: CheckCircle2 },
  partial: { label: "Incomplete", className: "bg-amber-500/10 text-amber-600 dark:text-amber-400", Icon: AlertTriangle },
  error: { label: "Missing", className: "bg-danger/10 text-danger", Icon: XCircle },
  off: { label: "Not set", className: "bg-muted text-muted-foreground", Icon: MinusCircle },
};

function StatusPill({ status }: { status: CheckStatus }) {
  const { label, className, Icon } = STATUS_META[status];
  return (
    <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

export default async function PlatformSystemCheckPage() {
  // Re-verify: this panel reads server env and pings the database via the
  // service-role client.
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  if (!user) redirect("/login?next=/platform-admin/system");
  const profile = await getProfile(supabase, user.id);
  if (!profile?.is_super_admin) redirect("/dashboard");

  const report = await getSystemCheck();
  const core = report.items.filter((i) => i.core);
  const integrations = report.items.filter((i) => !i.core);
  const allGood = report.summary.coreOk && report.summary.issues === 0;

  return (
    <div>
      <p className="mb-6 text-sm text-muted-foreground">
        Whether each integration is wired up in this deployment. Only shows whether a value is <strong>set</strong> — never the
        keys themselves. Reflects the environment this server is running with right now.
      </p>

      {/* Overall banner */}
      <div
        className={`mb-8 flex items-start gap-3 rounded-lg border p-4 ${
          allGood ? "border-emerald-500/30 bg-emerald-500/5" : "border-amber-500/30 bg-amber-500/5"
        }`}
      >
        {allGood ? (
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
        )}
        <div>
          <p className="text-sm font-medium text-foreground">
            {allGood ? "Everything essential is in order." : `${report.summary.issues} thing${report.summary.issues === 1 ? "" : "s"} need attention.`}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Core config {report.summary.coreConfigured}/{report.summary.coreTotal} · Database{" "}
            {report.database.ok ? "reachable" : "unreachable"} · Integrations on {report.summary.integrationsOn}/
            {report.summary.integrationsTotal}
          </p>
        </div>
      </div>

      {/* Database ping */}
      <div className="mb-8 flex items-center justify-between gap-3 rounded-lg border border-border p-4">
        <div className="flex items-start gap-3">
          <Database className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-foreground">Database connection</p>
            <p className="text-xs text-muted-foreground">
              {report.database.ok
                ? "Live query against Supabase succeeded."
                : `Query failed: ${report.database.error ?? "unknown error"}`}
            </p>
          </div>
        </div>
        <StatusPill status={report.database.ok ? "ok" : "error"} />
      </div>

      <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">Core configuration</h2>
      <div className="mb-8 space-y-3">
        {core.map((item) => (
          <CheckCard key={item.key} item={item} />
        ))}
      </div>

      <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
        Integrations ({report.summary.integrationsOn}/{report.summary.integrationsTotal} on)
      </h2>
      <div className="space-y-3">
        {integrations.map((item) => (
          <CheckCard key={item.key} item={item} />
        ))}
      </div>
    </div>
  );
}

function CheckCard({ item }: { item: SystemCheckItem }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <div className="mb-2 flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-foreground">{item.label}</p>
        <StatusPill status={item.status} />
      </div>
      <p className="mb-3 text-xs text-muted-foreground">{item.description}</p>
      <div className="flex flex-wrap gap-1.5">
        {item.vars.map((v) => (
          <span
            key={v.name}
            className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-[11px] ${
              v.set
                ? "border-border text-foreground"
                : v.optional
                  ? "border-dashed border-border text-muted-foreground"
                  : "border-danger/40 text-danger"
            }`}
            title={v.isPublic ? "Public (shipped to the browser)" : "Server-side only"}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${v.set ? "bg-emerald-500" : v.optional ? "bg-muted-foreground/40" : "bg-danger"}`} />
            {v.name}
            {v.optional && !v.set ? " (optional)" : ""}
          </span>
        ))}
      </div>
    </div>
  );
}
