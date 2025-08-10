import { useQuery, useMutation } from "@tanstack/react-query";
import { getJobs, createJob, deleteJob } from "@/features/jobs/services/jobApi";
import { JobCreate } from "../types";
export const useGetJobs = () => {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: getJobs,
  });
};

export const useCreateJob = () => {
  return useMutation({
    mutationFn: (data: JobCreate) => createJob(data),
  });
};

export const useDeleteJob = () => {
  return useMutation({
    mutationFn: (jobId: number) => deleteJob(jobId),
  });
};
