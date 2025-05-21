"use client";

import {
  LayoutGrid,
  LogOut,
  NotebookPen,
  User,
  Contact,
  UsersRound,
} from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import Header from "../components/Header";
import FooterProfile from "../components/FooterProfile";

const Dashboard = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

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
            <li
              onClick={() => router.push("/customer")}
              className="flex items-center cursor-pointer p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <Contact className="h-5 w-5" />
              <span className="flex-1 ms-3 whitespace-nowrap">Customers</span>
            </li>
          </ul>

          <div>
            <FooterProfile />
          </div>
        </div>
      </aside>

      <main className="mt-16 mb-2.5 ml-64 mr-2.5">{children}</main>
    </>
  );
};

export default Dashboard;
