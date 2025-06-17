"use client";

import { useVenues } from "@/api/vanue";
import { Button } from "@/components/ui/button";
import { ChartAreaInteractive } from "@/imports/dashboard/components/chart-area-interactive";
import { DataTable } from "@/imports/dashboard/components/data-table";
import { SectionCards } from "@/imports/dashboard/components/section-cards";
import Venues from "@/imports/dashboard/components/Venues";
import { useDashboardStore } from "@/store/dashboardStore";
import {  Mosaic } from "react-loading-indicators";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDashboardData } from "@/api/dashboard";
import { useVenueStore } from "@/store/venueStore";

export default function DashBoardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const { data, isLoading } = useVenues();

  const { setVenues } = useVenueStore();
  const { setDashboardData } = useDashboardStore();
  const { selectedvenueId, setSelectedvenueId, setVenue } = useVenueStore();

  const {
    data: dashboardData,
    isLoading : inPending,
    refetch,
  } = useDashboardData(selectedvenueId);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (data?.venues?.length) {
      setVenues(data.venues);

      if (!selectedvenueId) {
        const defaultvenueId = data.venues[0].id;
        setVenue(data.venues[0]);
        setSelectedvenueId(defaultvenueId);
        localStorage.setItem("venueId", defaultvenueId);
      }
    }
  }, [data, selectedvenueId, setSelectedvenueId, setVenue, setVenues]);

  useEffect(() => {
    if (dashboardData) {
      setDashboardData(dashboardData);
    }
  }, [dashboardData, setDashboardData]);

  useEffect(() => {
    if (selectedvenueId) {
      refetch();
    }
  }, [selectedvenueId, refetch]);

  const handleClick = () => {
    router.push("/addVenues");
  };

  if (!mounted || isLoading || inPending) {
    return (
      <div className="flex justify-center items-center h-screen">
      <Mosaic color={["#3d4293","#4e54b5","#7277c4", "#2e326f",   ]} />

      </div>
    );
  }
  if (!data?.venues?.length) {
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
          {/* {dashboardData?.ThisMonthBookings && (
            <DataTable data={dashboardData.ThisMonthBookings} />
          )} */}
          <DataTable />
        </div>
      </div>
    </div>
  );
}
