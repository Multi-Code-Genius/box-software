import DashboardCard from "@/imports/dashboard/ui/components/DashboardCard";
import NewBookings from "@/imports/dashboard/ui/components/NewBookings";
import SlotInfo from "@/imports/dashboard/ui/components/SlotInfo";
import React from "react";

const DashBoardPage = () => {
  return (
    <div className="flex flex-col gap-7 p-7">
      <DashboardCard />
      <div className="flex flex-row gap-7">
        <div className="w-[70%]">
          <SlotInfo />
        </div>
        <div className="w-[30%]">
          <NewBookings />
        </div>
      </div>
    </div>
  );
};

export default DashBoardPage;
