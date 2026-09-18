import Studio from "@/components/studio";
import { listProjects } from "@/lib/projects";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const projects = await listProjects();
  return <Studio initialProjects={projects} />;
}
