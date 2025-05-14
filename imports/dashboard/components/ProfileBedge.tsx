"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Pencil,
  Building2,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  X,
} from "lucide-react";
import Edit from "@/imports/dashboard/components/Edit";
import { useAuthStore } from "@/store/authStore";
import { LogoutConfirmModal } from "./LogoutModel";
import { fetchUserData } from "../api/api";
import { useUserStore } from "@/store/userStore";

const ProfileBedge: React.FC = () => {
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const { logout } = useAuthStore();
  const { setUser, user } = useUserStore();
  const sidenavRef = useRef<HTMLDivElement>(null);
  const mainHeadRef = useRef<HTMLDivElement>(null);
  type IconProps = React.ComponentType<React.SVGProps<SVGSVGElement>>;

  const icons: [string, IconProps][] = [
    ["Venue Manage", Building2],
    ["Customers", Users],
    ["Settings", Settings],
    ["Help", HelpCircle],
    ["Logout", LogOut],
  ];

  useEffect(() => {
    if (show) {
      sidenavRef.current!.style.transform = "translateX(0)";
    } else {
      sidenavRef.current!.style.transform = "translateX(100%)";
    }
  }, [show]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      mainHeadRef.current &&
      !mainHeadRef.current.contains(event.target as Node) &&
      sidenavRef.current &&
      !sidenavRef.current.contains(event.target as Node)
    ) {
      setShow(false);
      setOpen(false);
    }
  };

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
  }, []);

  useEffect(() => {
    if (open || show) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, show]);

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleClick = (label: string) => {
    if (label === "Logout") setShowLogoutModal(true);
    logout();
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    console.log("User logged out");
  };

  return (
    <div className="flex relative items-center" ref={mainHeadRef}>
      <div className="flex items-center ms-3">
        <div>
          <button
            type="button"
            className="flex text-sm  rounded-full   relative cursor-pointer"
            aria-expanded="false"
            onClick={() => {
              setShow(!show);
              setOpen(!open);
            }}
          >
            <span className="sr-only">Open user menu</span>

            <img
              className="w-10 h-10 rounded-full"
              src={user?.profile_pic || "/images/profile.jpg"}
              alt="profile"
            />
          </button>

          <div
            ref={sidenavRef}
            className={`absolute top-[-12px] right-[-20px]  w-[400px] h-[100vh] bg-white shadow-xl dark:bg-gray-700 overflow-hidden transform transition-transform duration-300 ease-in-out ${
              show ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div
              className="absolute right-0 h-8 w-8 bg-black rounded-full flex items-center justify-center m-3  cursor-pointer"
              onClick={() => setShow(false)}
            >
              <p className="text-lg font-bold text-white ">X</p>
            </div>
            <div className="h-full flex flex-col items-center p-10">
              <div className="w-full mb-6 rounded shadow p-4 mt-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xl font-semibold">Account</p>
                  <Pencil
                    className="w-5 h-5 cursor-pointer"
                    onClick={() => setShowEditModal(true)}
                  />
                </div>

                <div className="mb-6 space-y-1 flex items-center gap-4">
                  <img
                    className="w-10 h-10 rounded-full text-[10px]"
                    src={user?.profile_pic || "/images/profile.jpg"}
                    alt="Profile"
                  />
                  <div>
                    <div className="text-gray-700 dark:text-gray-300 font-medium">
                      {user?.name || "User"}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                      {!isNaN(Number(user?.mobileNumber))
                        ? user?.mobileNumber
                        : ""}
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4 w-full">
                {icons.map(([label, Icon], i) => (
                  <div
                    key={i}
                    onClick={() => handleClick(label)}
                    className="flex items-center gap-2 cursor-pointer hover:text-slate-600 dark:hover:text-gray-300 bg-gray-100 p-5 rounded-lg shadow-md"
                  >
                    <Icon className="w-5 h-5" />
                    <p>{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
