import Studio from "@/components/studio";
import { listProjects } from "@/lib/projects";
import { PROJECT_TABS } from "@/lib/tabs";

export const dynamic = "force-dynamic";

/**
 * The open project and section can both be chosen on the server (`/?project=<id>&tab=relationships`),
 * so a link opens on the right screen, the first render already contains it, and hydration has
 * nothing to patch up afterwards.
 */
export default async function HomePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const [projects, params] = await Promise.all([listProjects(), searchParams]);
  const wanted = Array.isArray(params.tab) ? params.tab[0] : params.tab;
  const match = PROJECT_TABS.find(tab => tab.slug === wanted?.toLowerCase() || tab.name.toLowerCase() === wanted?.toLowerCase());
  const project = Array.isArray(params.project) ? params.project[0] : params.project;
  return <Studio initialProjects={projects} initialTab={match?.name} initialProjectId={project} />;
}
