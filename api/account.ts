import { User } from "@/types/auth";
import Cookies from "js-cookie";

const token = Cookies.get("accessToken");

export const fetchUserData = async (): Promise<User> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/user`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: User = await response.json();
    localStorage.setItem("userId", data?.user?.id);
    return data;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    throw error;
  }
};

export const UpdateUserData = async (user: User): Promise<User> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/update`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error("Failed to update user data:", error);
    throw error;
  }
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

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/upload-profile/${userId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(
        `Error: ${response.status} - ${responseData.message || "Unknown error"}`
      );
    }

    const data = responseData;
    return data.user.profile_pic;
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
};
