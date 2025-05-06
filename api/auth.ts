import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

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

export const useRequestOtp = (
  onSuccess?: (data: unknown) => void,
  onError?: (error: unknown) => void
) => {
  return useMutation({
    mutationFn: (email: { email: string }) => requestOtp(email),
    onSuccess,
    onError,
  });
};

export const verifyOtp = async (data: { email: string; otp: number }) => {
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

export const useVerifyOtp = (
  onSuccess?: (data: unknown) => void,
  onError?: (error: unknown) => void
) => {
  return useMutation({
    mutationFn: (data: { email: string; otp: number }) => verifyOtp(data),
    onSuccess,
    onError,
  });
};
