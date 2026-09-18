import { notFound } from "next/navigation";
import SharedProject from "@/components/shared-project";
import { getSharedProject } from "@/lib/projects";
import { healProjectImages } from "@/lib/image";

export const dynamic = "force-dynamic";

export default async function SharePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const project = await getSharedProject(token);
  if (!project) notFound();
  return <SharedProject project={healProjectImages(project)} />;
}
