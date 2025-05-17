"use client";

import React, { useState, useEffect } from "react";
import {
  Pencil,
  Building2,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  X,
} from "lucide-react";
import Edit from "@/imports/account/components/Edit";
import { useAuthStore } from "@/store/authStore";
import { LogoutConfirmModal } from "./LogoutModel";
import { useUserStore } from "@/store/userStore";
import { fetchUserData } from "@/api/account";

interface ProfileBedgeProps {
  setShowProfile: (value: boolean) => void;
}

const ProfileBedge: React.FC<ProfileBedgeProps> = ({ setShowProfile }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const { logout } = useAuthStore();
  const { setUser, user } = useUserStore();

  type IconProps = React.ComponentType<React.SVGProps<SVGSVGElement>>;
  const icons: [string, IconProps][] = [
    ["Venue Manage", Building2],
    ["Customers", Users],
    ["Settings", Settings],
    ["Help", HelpCircle],
    ["Logout", LogOut],
  ];

  const handleClick = (label: string) => {
    if (label === "Logout") {
      setShowLogoutModal(true);
    }
  };

  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutModal(false);
    setShowProfile(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center w-[400px]">
      <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-lg w-full p-5 left-10 top-[-70px]">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Account
            </h2>
            <button
              onClick={() => setShowProfile(false)}
              className="  text-gray-500  h-6 w-6  bg-black  text-white  rounded-full flex justify-center items-center"
            >
              <X size={14} />
            </button>
          </div>
          <div className="flex items-center gap-4 justify-between">
            <div className="flex gap-4">
              <img
                className="w-12 h-12 rounded-full"
                src={user?.profile_pic || "/images/profile.jpg"}
                alt="Profile"
              />
              <div>
                <div className="text-gray-900 dark:text-white font-medium">
                  {user?.name || "User"}
                </div>
                {user?.mobileNumber && !isNaN(Number(user.mobileNumber)) && (
                  <div className="text-gray-500 dark:text-gray-400 text-sm">
                    {user.mobileNumber}
                  </div>
                )}
              </div>
            </div>
            <Pencil
              className="w-5 h-5 text-gray-600 dark:text-gray-300 cursor-pointer"
              onClick={() => setShowEditModal(true)}
            />
          </div>
        </div>

        <div className="space-y-3">
          {icons.map(([label, Icon], i) => (
            <div
              key={i}
              onClick={() => handleClick(label)}
              className="flex items-center gap-3 cursor-pointer bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-3 rounded-md transition"
            >
              <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <span className="text-gray-800 dark:text-gray-200">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {showLogoutModal && (
        <LogoutConfirmModal
          onConfirm={handleLogoutConfirm}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}

      {showEditModal && <Edit setShowEditModal={setShowEditModal} />}
    </div>
  );
};

export default ProfileBedge;
