"use client";

import { LayoutGrid, NotebookPen, User, UsersRound } from "lucide-react";
import { ReactNode } from "react";
import { TbLogout } from "react-icons/tb";
import ProfileBedge from "./components/ProfileBedge";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

const Dashboard = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  return (
    <>
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <button
                data-drawer-target="logo-sidebar"
                data-drawer-toggle="logo-sidebar"
                aria-controls="logo-sidebar"
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <span className="sr-only">Open sidebar</span>
              </button>
              <a href="" className="flex ms-2 md:me-24">
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                  BrandName
                </span>
              </a>
            </div>
            <ProfileBedge />
          </div>
        </div>
      </nav>
      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li
              onClick={() => router.push("/dashboard")}
              className="flex items-center cursor-pointer  p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <LayoutGrid className="h-5 w-5 text-gray-800" />
              <span className="ms-3">Dashboard</span>
            </li>

            <li
              onClick={() => router.push("/client")}
              className="flex items-center cursor-pointer  p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <UsersRound className="h-5 w-5" />
              <span className="flex-1 ms-3 whitespace-nowrap">Client</span>
            </li>

            <li
              onClick={() => router.push("/booking")}
              className="flex items-center cursor-pointer  p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <NotebookPen className="h-5 w-5" />
              <span className="flex-1 ms-3 whitespace-nowrap">Bookings</span>
            </li>

            {/* <li
              onClick={() => router.push("/account")}
              className="flex items-center cursor-pointer  p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <User className="h-5 w-5" />
              <span className="flex-1 ms-3 whitespace-nowrap">Account</span>
            </li> */}

            <li
              onClick={() => useAuthStore.getState().logout()}
              className="flex items-center cursor-pointer  p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <TbLogout className="h-5 w-5" />
              <span className="flex-1 ms-3 whitespace-nowrap">Logout</span>
            </li>
          </ul>
        </div>
      </aside>
      <div className="mt-16 mb-2.5 ml-64 mr-2.5 ">{children}</div>
    </>
  );
};

export default Dashboard;
