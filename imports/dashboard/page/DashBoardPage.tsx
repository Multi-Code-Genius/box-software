"use client";
import DashboardCard from "@/imports/dashboard/components/DashboardCard";
import NewBookings from "@/imports/dashboard/components/NewBookings";
import SlotInfo from "@/imports/dashboard/components/SlotInfo";
import { useBookingStore } from "@/store/bookingStore";
import React from "react";

const DashBoardPage = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-74px)] overflow-hidden">
      <div className="p-7 pb-0">
        <DashboardCard />
      </div>
      <div className="flex flex-row gap-7 px-7 py-7 flex-1 overflow-hidden">
        <div className="w-[70%] border rounded-xl overflow-auto">
          <SlotInfo />
        </div>
        <div className="w-[30%] border rounded-xl overflow-auto ">
          <NewBookings />
        </div>
      </div>
    </div>
  );
};

export default DashBoardPage;
