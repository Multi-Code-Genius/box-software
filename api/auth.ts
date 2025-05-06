import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";
import { redirect } from "next/navigation";

import { toast } from "sonner";

export const requestOtp = async (email: { email: string }) => {
  try {
    const response = await api("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(email),
    });
    const resp = await response;
    return resp;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("login Error", error.message);
    } else {
      console.log("login Error", error);
    }
  }
};

export const useRequestOtp = () => {
  return useMutation({
    mutationFn: (email: { email: string }) => requestOtp(email),
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (data) => {
      toast.error(data.message);
    },
  });
};

export const verifyOtp = async (data: { email: string; otp: string }) => {
  try {
    const response = await api("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const resp = await response;
    return resp;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("login Errror", error.message);
    } else {
      console.log("login Error", error);
    }
  }
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: (data: { email: string; otp: string }) => verifyOtp(data),
    onSuccess: async (data) => {
      toast.success(data.message);
      const typedData = data as { token: string };
      if (!typedData?.token) return;
      await useAuthStore
        .getState()
        .saveToken(typedData.token)
        .then(() => {
          redirect("/dashboard");
        });
    },

    onError: (error) => {
      toast.error(error.message);
      if (typeof error === "object" && error !== null && "message" in error) {
        console.log("Login Failed", (error as { message: string }).message);
      } else {
        console.log("Login Failed", "Please try again.");
      }
    },
  });
};
