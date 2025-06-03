import { api } from "@/lib/api";
import { User } from "@/types/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { toast } from "sonner";

const token = Cookies.get("accessToken");

export const fetchUserData = async (): Promise<User> => {
  try {
    const response = await api(`/api/v2/user/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await response;
    return data;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    throw error;
  }
};

export const useUserData = () => {
  return useQuery<User>({
    queryKey: ["userData"],
    queryFn: fetchUserData,
  });
};

export const UpdateUserData = async (user: any, id: string): Promise<any> => {
  try {
    const response = await api(`/api/v2/user/update/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const data = await response;
    return data.user;
  } catch (error) {
    console.error("Failed to update user data:", error);
    throw error;
  }
};

export const useUpdateUserMutation = () => {
  return useMutation({
    mutationFn: ({ data, id }: { data: any; id: string }) =>
      UpdateUserData(data, id),
    onSuccess: () => {
      toast.success("User updated successfully");
    },
    onError: () => {
      toast.error("Failed to update user");
    },
  });
};

export const uploadImage = async (file: File) => {
  try {
    const token = Cookies.get("accessToken");

    const userId = localStorage.getItem("userId");

    if (!userId) {
      throw new Error("User ID is not available");
    }

    const formData = new FormData();
    formData.append("profile_pic", file);

    const response = await api(`/api/user/upload-profile/${userId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const responseData = await response.json();

    const data = responseData;
    return data.user.profile_pic;
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
};
