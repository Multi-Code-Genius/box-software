import { useUserStore } from "@/store/userStore";
import React from "react";

const Header = () => {
  const { setUser, user } = useUserStore();
  return (
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
      <a href="#" className="flex ms-2 md:me-24">
        <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
          BrandName
        </span>
      </a>
      <div className="flex flex-col px-8">
        <div className="font-medium text-xl flex gap-2">
          Welcome, <p className="font-bold">{user?.name || "User"}</p>
        </div>
        <div className="text-sm text-gray-600">
          {new Date().toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>
    </div>
  );
};

export default Header;
