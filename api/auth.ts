import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { VerifyOtpResponse } from "@/types/auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

export const requestOtp = async (email: { number: string }) => {
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
    mutationFn: (email: { number: string }) => requestOtp(email),
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (data) => {
      toast.error(data.message);
    },
  });
};

export const verifyOtp = async (data: { number: string; otp: string }) => {
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
  const router = useRouter();

  return useMutation<VerifyOtpResponse, Error, { number: string; otp: string }>(
    {
      mutationFn: async (data: { number: string; otp: string }) => {
        const response = await verifyOtp(data);
        return response;
      },
      onSuccess: async (data: VerifyOtpResponse) => {
        toast.success(data.message);

        if (data.token) {
          await useAuthStore
            .getState()
            .saveToken(data.token)
            .then(() => {
              router.push("/dashboard");
            });
        }
      },
      onError: (error: Error) => {
        toast.error(error.message);
        console.log("Login Failed", error.message);
      },
    }
  );
};
