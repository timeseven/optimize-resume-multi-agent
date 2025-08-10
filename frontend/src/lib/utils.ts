import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Cookies from "js-cookie";
import { StateStorage } from "zustand/middleware";
import { Draft } from "immer";
import { format } from "date-fns";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const cookieStorage: StateStorage = {
  getItem: (key: string): string | null => {
    return Cookies.get(key) ?? null;
  },
  setItem: (key: string, value: string) => {
    Cookies.set(key, value, { path: "/", expires: 365 });
  },
  removeItem: (key: string) => {
    Cookies.remove(key, { path: "/" });
  },
};

// Manual persist
export const forcePersist = <T extends object>(store: {
  getState: () => T;
  setState: (
    nextStateOrUpdater: T | ((state: Draft<T>) => void),
    shouldReplace: true
  ) => void;
}) => {
  const snapshot = store.getState();
  store.setState(snapshot, true);
};

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  );
};

export const formatDate = (input: string | Date): string => {
  const date = input instanceof Date ? input : new Date(input);
  return format(date, "d MMM yyyy"); // e.g., 6 Aug 2025
};

export const getAnalysisStatus = (count: number) => {
  if (count === 0) return { text: "Never analyzed", color: "text-gray-500" };
  if (count === 1) return { text: "1 analysis", color: "text-blue-600" };
  return { text: `${count} analyses`, color: "text-green-600" };
};

export const getScoreColor = (score: number) => {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-600";
};

export const getScoreBackground = (score: number) => {
  if (score >= 80) return "bg-green-100";
  if (score >= 60) return "bg-yellow-100";
  return "bg-red-100";
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "destructive";
    case "medium":
      return "secondary";
    default:
      return "outline";
  }
};
