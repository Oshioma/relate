import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, VolunteerProject, Profile } from "@/types/database";

type Client = SupabaseClient<Database>;

export type VolunteerProjectWithSignups = {
  project: VolunteerProject;
  volunteers: Profile[];
  volunteerCount: number;
  viewerSignedUp: boolean;
};

export async function getSpaceVolunteerProjects(supabase: Client, spaceId: string, viewerId: string): Promise<VolunteerProjectWithSignups[]> {
  const { data: projects, error } = await supabase
    .from("volunteer_projects")
    .select("*")
    .eq("space_id", spaceId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!projects || projects.length === 0) return [];

  const projectIds = projects.map((p) => p.id);

  const { data: signups, error: signupsError } = await supabase
    .from("volunteer_signups")
    .select("project_id, user_id, profile:user_id (*)")
    .in("project_id", projectIds);

  if (signupsError) throw signupsError;

  const byProjectId = new Map<string, { profile: Profile; userId: string }[]>();
  for (const row of signups ?? []) {
    const list = byProjectId.get(row.project_id) ?? [];
    if (row.profile) list.push({ profile: row.profile as unknown as Profile, userId: row.user_id });
    byProjectId.set(row.project_id, list);
  }

  return projects.map((project) => {
    const rows = byProjectId.get(project.id) ?? [];
    return {
      project,
      volunteers: rows.map((r) => r.profile),
      volunteerCount: rows.length,
      viewerSignedUp: rows.some((r) => r.userId === viewerId),
    };
  });
}
