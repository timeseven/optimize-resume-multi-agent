import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getResumes,
  createResume,
  deleteResume,
} from "@/features/resumes/services/resumeApi";
export const useGetResumes = () => {
  return useQuery({
    queryKey: ["resumes"],
    queryFn: getResumes,
  });
};

export const useCreateResume = () => {
  return useMutation({
    mutationFn: (formData: FormData) => createResume(formData),
  });
};

export const useDeleteResume = () => {
  return useMutation({
    mutationFn: (resumeId: number) => deleteResume(resumeId),
  });
};
