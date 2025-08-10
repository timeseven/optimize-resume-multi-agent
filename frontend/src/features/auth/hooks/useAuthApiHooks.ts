import { useMutation, useQuery } from "@tanstack/react-query";

import {
  signin,
  signout,
  signup,
  getMe,
} from "@/features/auth/services/authApi";
import { SignProps } from "@/features/auth/types";

export const useSignin = () => {
  return useMutation({
    mutationFn: (data: SignProps) => signin(data),
  });
};

export const useSignout = () => {
  return useMutation({
    mutationFn: () => signout(),
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: (data: SignProps) => signup(data),
  });
};

export const useGetMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });
};
