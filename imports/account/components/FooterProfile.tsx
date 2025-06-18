"use client";

import { fetchUserData } from "@/api/account";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Edit from "@/imports/account/components/Edit";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import {
  Building2,
  HelpCircle,
  Pencil,
  Settings,
  Users,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { TbLogout } from "react-icons/tb";
import { toast } from "sonner";
import { LogoutConfirmModal } from "./LogoutModel";

const FooterProfile = () => {
  const { setUser, user } = useUserStore();
  const { logout } = useAuthStore();
  const router = useRouter();

  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        profileRef.current &&
        avatarRef.current &&
        !profileRef.current.contains(target) &&
        !avatarRef.current.contains(target)
      ) {
        setShowProfile(false);
      }
    };

    if (showProfile) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfile]);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await fetchUserData();
        setUser(data.user);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    getUserData();
  }, [setUser]);

  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutModal(false);
    setShowProfile(false);

    router.push("/login");
    toast.success("Logout Successfully");
  };

  const accountMenu: [string, React.ElementType][] = [
    ["Venue Manage", Building2],
    ["Customers", Users],
    ["Settings", Settings],
    ["Help", HelpCircle],
  ];

  const handleMenuClick = (label: string) => {
    if (label === "Venue Manage") {
      router.push("/venue");
    }
    setShowProfile(false);
  };

  return (
    <>
      <div
        className="border-t pt-4 overflow-hidden relative"
        ref={avatarRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center">
          <div className="flex gap-3 w-full">
            <button
              type="button"
              className="cursor-pointer w-fit"
              onClick={() => setShowProfile((prev) => !prev)}
              aria-label="Open user profile"
            >
              <Avatar>
                <AvatarImage
                  src={user?.profile || "/images/profile.jpg"}
                  alt="profile"
                  className="rounded-full"
                />
                <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
            </button>

            <div className="text-[13px] w-full">
              <div className="flex justify-between">
                <p>{user?.name || "User"}</p>
                <div>
                  <TbLogout
                    className="cursor-pointer text-xl"
                    onClick={() => setShowLogoutModal(true)}
                  />
                  <LogoutConfirmModal
                    open={showLogoutModal}
                    onOpenChange={setShowLogoutModal}
                    onConfirm={handleLogoutConfirm}
                    onCancel={() => setShowLogoutModal(false)}
                  />
                </div>
              </div>
              <p>{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {showProfile && (
        <div
          ref={profileRef}
          style={{
            boxShadow:
              "rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px",
          }}
          className="fixed left-[60px] w-[400px] bottom-[70px] bg-white z-50 p-5  rounded-lg"
        >
          <div className="flex gap-5 flex-col ">
            <div className="flex justify-between items-center   ">
              <h2 className="text-2xl font-semibold text-gray-900 text-center">
                Account
              </h2>
              <button
                onClick={() => setShowProfile(false)}
                className=" text-gray-600 hover:text-gray-900 "
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex items-center gap-4 justify-between ">
              <div className="flex gap-4 items-center">
                <img
                  className="w-12 h-12 rounded-full"
                  src={user?.profile || "/images/profile.jpg"}
                  alt="Profile"
                />
                <div>
                  <div className="text-gray-900 font-medium">
                    {user?.name || "User"}
                  </div>
                  {user?.phone && !isNaN(Number(user.phone)) && (
                    <div className="text-gray-500 text-sm">{user.phone}</div>
                  )}
                </div>
              </div>
              <Pencil
                className="w-5 h-5 text-gray-600 cursor-pointer"
                onClick={() => {
                  setShowEditModal(true);
                  setShowProfile(false);
                }}
              />
            </div>

            <div className="space-y-3 ">
              {accountMenu.map(([label, Icon], i) => (
                <div
                  key={i}
                  onClick={() => handleMenuClick(label)}
                  className="flex items-center gap-3 cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-md transition"
                >
                  <Icon className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-800">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Edit showEditModal={showEditModal} setShowEditModal={setShowEditModal} />
    </>
  );
};

export default FooterProfile;
