import { useQuery, useMutation } from "@tanstack/react-query";
import {
  optimize,
  getTasks,
  getTask,
  deleteTask,
} from "@/features/optimization/services/optimizationApi";
import { Optimize } from "../types";

export const useOptimize = () => {
  return useMutation({
    mutationFn: (data: Optimize) => optimize(data),
  });
};
export const useGetTasks = () => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });
};

export const useGetTask = (taskId: number) => {
  return useQuery({
    queryKey: ["task", taskId],
    queryFn: () => getTask(taskId),
    enabled: !!taskId,
  });
};

export const useDeleteTask = () => {
  return useMutation({
    mutationFn: (taskId: number) => deleteTask(taskId),
  });
};
