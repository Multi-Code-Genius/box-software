"use client";

import {
  LayoutGrid,
  LogOut,
  NotebookPen,
  User,
  UsersRound,
} from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";
import { TbLogout } from "react-icons/tb";
import ProfileBedge from "../components/ProfileBedge";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogoutConfirmModal } from "../components/LogoutModel";
import { fetchUserData } from "@/api/account";
import Header from "../components/Header";

const Dashboard = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { setUser, user } = useUserStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { logout } = useAuthStore();
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const handleOpenForm = (event: React.MouseEvent) => {
    setShowProfile((prev) => !prev);
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
  }, [setUser]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfile(false);
      }
    };

    if (showProfile) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfile]);

  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutModal(false);
    setShowProfile(false);
  };

  return (
    <>
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <Header />
          </div>
        </div>
      </nav>

      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800 flex flex-col justify-between">
          <ul className="space-y-2 font-medium">
            <li
              onClick={() => router.push("/dashboard")}
              className="flex items-center cursor-pointer p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <LayoutGrid className="h-5 w-5 text-gray-800" />
              <span className="ms-3">Dashboard</span>
            </li>

            <li
              onClick={() => router.push("/client")}
              className="flex items-center cursor-pointer p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <UsersRound className="h-5 w-5" />
              <span className="flex-1 ms-3 whitespace-nowrap">Client</span>
            </li>

            <li
              onClick={() => router.push("/booking")}
              className="flex items-center cursor-pointer p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <NotebookPen className="h-5 w-5" />
              <span className="flex-1 ms-3 whitespace-nowrap">Bookings</span>
            </li>
          </ul>

          <div
            className="border-t pt-4"
            ref={profileRef}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between gap-8 items-center">
              <div className="flex gap-3 ">
                <button
                  type="button"
                  className="cursor-pointer w-fit"
                  onClick={handleOpenForm}
                  aria-label="Open user profile"
                >
                  <Avatar>
                    <AvatarImage
                      src={user?.profile_pic || "/images/profile.jpg"}
                      alt="profile"
                      className="rounded-full"
                    />
                    <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                </button>

                <div className="text-sm">
                  <p>{user?.name || "user"}</p>
                  <p>{user?.email}</p>
                </div>
              </div>
              <div className="w-full">
                <LogOut
                  className="cursor-pointer"
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

            {showProfile && <ProfileBedge setShowProfile={setShowProfile} />}
          </div>
        </div>
      </aside>

      <main className="mt-16 mb-2.5 ml-64 mr-2.5">{children}</main>
    </>
  );
};

export default Dashboard;
