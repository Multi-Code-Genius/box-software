"use client";

import { useVenues } from "@/api/vanue";
import { Button } from "@/components/ui/button";
import { ChartAreaInteractive } from "@/imports/dashboard/components/chart-area-interactive";
import { DataTable } from "@/imports/dashboard/components/data-table";
import { SectionCards } from "@/imports/dashboard/components/section-cards";
import Venues from "@/imports/dashboard/components/Venues";
import { useDashboardStore } from "@/store/dashboardStore";
import { Loader2 } from "lucide-react";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function DashBoardPage() {
  const router = useRouter();

  const { data: venues, isLoading } = useVenues();
  const { dashboardData } = useDashboardStore();

  const handleClick = () => {
    router.push("/addVenues");
  };

  if (!venues?.venues?.length) {
    return (
      <div className="flex flex-col justify-center items-center h-[80vh] text-center px-4">
        <Image
          src="/images/nodata.svg"
          alt="No Venues Found"
          width={700}
          height={700}
          className="mb-6"
          priority
        />
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
          No Venues Found
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
          Looks like you haven&apos;t added any venues yet. Start by creating
          your first venue to manage bookings and availability.
        </p>
        <Button
          onClick={handleClick}
          className="px-6 py-3 text-base rounded-md"
        >
          Create Your First Venue
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <Venues />
          <SectionCards />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>
          {dashboardData?.ThisMonthBookings && (
            <DataTable data={dashboardData.ThisMonthBookings} />
          )}
        </div>
      </div>
    </div>
  );
}
