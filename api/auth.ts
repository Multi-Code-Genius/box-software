import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { VerifyOtpResponse } from "@/types/auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

export const requestOtp = async (data: { phone: string; name: string }) => {
  try {
    const response = await api("/api/v2/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: data.phone,
        name: data.name,
      }),
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
    mutationFn: requestOtp,
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
  });
};

export const verifyOtp = async (data: { phone: string; otp: string }) => {
  try {
    const response = await api("/api/v2/auth/verify-otp", {
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

  return useMutation<VerifyOtpResponse, Error, { phone: string; otp: string }>({
    mutationFn: async (data: { phone: string; otp: string }) => {
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
  });
};
