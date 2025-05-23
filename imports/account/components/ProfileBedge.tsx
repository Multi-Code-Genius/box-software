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
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";

interface ProfileBedgeProps {
  setShowProfile: (value: boolean) => void;
  showProfile: boolean;
}

const ProfileBedge: React.FC<ProfileBedgeProps> = ({
  setShowProfile,
  showProfile,
}) => {
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);

  const router = useRouter();
  const { logout } = useAuthStore();
  const { setUser, user } = useUserStore();

  type IconProps = React.ComponentType<React.SVGProps<SVGSVGElement>>;
  const accountmenu: [string, IconProps][] = [
    ["Venue Manage", Building2],
    ["Customers", Users],
    ["Settings", Settings],
    ["Help", HelpCircle],
  ];

  const handleClick = (label: string) => {
    if (label === "Logout") {
      setShowLogoutModal(true);
    } else if (label === "Venue Manage") {
      router.push("/venue");
    }
    setShowProfile(false);
  };

  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutModal(false);
    setShowProfile(false);
  };

  return (
    <>
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className=" fixed bg-white  w-full w-[400px] p-5 left-[250px] translate-y-[-10%]  ">
          <DialogHeader className="mb-3 gap-5">
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white mx-auto">
              Account
            </DialogTitle>
            <DialogClose
              asChild
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </DialogClose>

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
                onClick={() => {
                  setShowEditModal(true);
                  setShowProfile(false);
                }}
              />
            </div>
          </DialogHeader>

          <div className="space-y-4">
            {accountmenu.map(([label, Icon], i) => (
              <div
                key={i}
                onClick={() => handleClick(label)}
                className="flex items-center gap-3 cursor-pointer bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-3 rounded-md transition"
              >
                <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <span className="text-gray-800 dark:text-gray-200">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {showLogoutModal && (
        <LogoutConfirmModal
          onConfirm={handleLogoutConfirm}
          onCancel={() => setShowLogoutModal(false)}
          open={showLogoutModal}
          onOpenChange={setShowLogoutModal}
        />
      )}

      <Edit showEditModal={showEditModal} setShowEditModal={setShowEditModal} />
    </>
  );
};

export default ProfileBedge;
