import { fetcher } from "@/lib/fetcher";
import { JobCreate, JobRead } from "@/features/jobs/types";

export const getJobs = async () => {
  return await fetcher<JobRead[]>("/jobs", {
    method: "GET",
  });
};

export const createJob = async (data: JobCreate) => {
  const formBody = new URLSearchParams();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formBody.append(key, String(value));
    }
  });
  return await fetcher("/jobs", {
    method: "POST",
    body: formBody,
  });
};

export const deleteJob = async (jobId: number) => {
  return await fetcher(`/jobs/${jobId}`, { method: "DELETE" });
};
