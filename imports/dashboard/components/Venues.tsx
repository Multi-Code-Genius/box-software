import { useEffect, useState } from "react";

import { useDashboardStore } from "@/store/dashboardStore";
import { Loader2 } from "lucide-react";
import { getDashboardData, useDashboardData } from "@/api/dashboard";
import { useVenueStore } from "@/store/venueStore";
import { useVenues } from "@/api/vanue";

const Venues = () => {
  const { venues, setVenues } = useVenueStore();
  const { setDashboardData, selectedvenueId, setSelectedvenueId } =
    useDashboardStore();

  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    refetch,
  } = useDashboardData(selectedvenueId);

  const { data, isLoading: venuesLoading } = useVenues();

  useEffect(() => {
    if (data?.venues?.length) {
      setVenues(data.venues);

      if (!selectedvenueId) {
        const defaultvenueId = data.venues[0].id;
        setSelectedvenueId(defaultvenueId);
        localStorage.setItem("venueId", defaultvenueId);
      }
    }
  }, [data, selectedvenueId]);

  useEffect(() => {
    if (dashboardData) {
      setDashboardData(dashboardData);
      console.log("Dashboard data for game:", selectedvenueId, dashboardData);
    }
  }, [dashboardData, setDashboardData, selectedvenueId]);

  useEffect(() => {
    if (selectedvenueId) {
      refetch();
    }
  }, [selectedvenueId, refetch]);

  const handleSelectVenue = (venue: any) => {
    setSelectedvenueId(venue.id);
    localStorage.setItem("venueId", venue.id);
    console.log("Selected venue ID:", venue.id);
    console.log("Selected venue Data:", venue);
  };

  return (
    <div className="flex flex-col gap-4 pb-3 overflow-auto">
      <div className="flex gap-2">
        {venues?.map((venue) => (
          <div
            key={venue.id}
            className={`border rounded-lg px-6 py-1 cursor-pointer shadow-md flex items-center gap-2 transition ${
              selectedvenueId === venue.id
                ? "bg-gray-200 font-medium"
                : "hover:bg-gray-100"
            }`}
            onClick={() => handleSelectVenue(venue)}
          >
            <p className="text-sm">{venue.name}</p>
            {selectedvenueId === venue.id && dashboardLoading && (
              <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Venues;
