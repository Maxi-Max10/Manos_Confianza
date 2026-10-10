import { JobsExplorer } from "@/components/JobsExplorer";
import { getPublicJobs } from "@/lib/data";

export default async function JobsPage() {
  const jobs = await getPublicJobs();
  return <JobsExplorer jobs={jobs} />;
}
