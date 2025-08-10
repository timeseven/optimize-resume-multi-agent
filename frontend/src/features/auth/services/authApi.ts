import { fetcher } from "@/lib/fetcher";
import { SignProps } from "@/features/auth/types";

export const signup = async (data: SignProps) => {
  return await fetcher("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const signin = async (data: SignProps) => {
  return await fetcher("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const signout = async () => {
  return await fetcher("/auth/logout", { method: "POST" });
};

export const getMe = async () => {
  return await fetcher("/users/me", { method: "GET" });
};
