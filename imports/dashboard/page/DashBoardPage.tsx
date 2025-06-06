"use client";

import { useVenues } from "@/api/vanue";
import { Button } from "@/components/ui/button";
import { ChartAreaInteractive } from "@/imports/dashboard/components/chart-area-interactive";
import { DataTable } from "@/imports/dashboard/components/data-table";
import { SectionCards } from "@/imports/dashboard/components/section-cards";
import Venues from "@/imports/dashboard/components/Venues";
import { useDashboardStore } from "@/store/dashboardStore";

import { useRouter } from "next/navigation";

export default function DashBoardPage() {
  const router = useRouter();

  const { data: venues, isLoading } = useVenues();
  const { data } = useDashboardStore();

  const handleClick = () => {
    router.push("/addVenues");
  };

  // if (isLoading) {
  //   return (
  //     <div className="flex justify-center py-4 h-[100vh] items-center">
  //       <Loader2 className="animate-spin text-muted-foreground mr-2" />
  //       Loading...
  //     </div>
  //   );
  // }

  if (!venues?.venues?.length) {
    return (
      <div className="flex justify-center items-center h-[100vh]">
        <Button onClick={handleClick}>Add Venues</Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <Venues />
            <SectionCards />
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>

            <DataTable data={data?.ThisMonthBookings ?? []} />
          </div>
        </div>
      </div>
    </>
  );
}
