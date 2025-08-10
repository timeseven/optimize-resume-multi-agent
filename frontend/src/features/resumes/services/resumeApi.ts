import { fetcher } from "@/lib/fetcher";
import { ResumeRead } from "@/features/resumes/types";

export const getResumes = async () => {
  return await fetcher<ResumeRead[]>("/resumes", {
    method: "GET",
  });
};

export const createResume = async (data: FormData) => {
  return await fetcher("/resumes", {
    method: "POST",
    body: data,
  });
};

export const deleteResume = async (resumeId: number) => {
  return await fetcher(`/resumes/${resumeId}`, { method: "DELETE" });
};
