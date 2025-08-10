import { fetcher } from "@/lib/fetcher";
import {
  Optimize,
  TaskOutputRead,
  TaskOutputReadBase,
} from "@/features/optimization/types";

export const optimize = async (data: Optimize) => {
  return await fetcher("/optimization", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getTasks = async () => {
  return await fetcher<TaskOutputReadBase[]>("/optimization/tasks", {
    method: "GET",
  });
};

export const getTask = async (taskId: number) => {
  return await fetcher<TaskOutputRead>(`/optimization/tasks/${taskId}`, {
    method: "GET",
  });
};

export const deleteTask = async (taskId: number) => {
  return await fetcher(`/optimization/tasks/${taskId}`, {
    method: "DELETE",
  });
};
