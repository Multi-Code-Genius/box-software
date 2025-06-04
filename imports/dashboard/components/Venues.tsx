"use client";
import { useEffect, useState } from "react";

import { useDashboardStore } from "@/store/dashboardStore";
import { Loader2 } from "lucide-react";
import { getDashboardData, useDashboardData } from "@/api/dashboard";
import { useVenueStore } from "@/store/venueStore";
import { useVenues } from "@/api/vanue";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Venues = () => {
  const { venues, setVenues } = useVenueStore();
  const { setDashboardData } = useDashboardStore();
  const { selectedvenueId, setSelectedvenueId, setVenue, venue } =
    useVenueStore();

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
        setVenue(data.venues[0]);
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
    setVenue(venue);
    console.log("Selected venue Data:", venue);
  };

  return (
    <>
      <Carousel className="w-[90%] relative left-20">
        <CarouselPrevious className="z-16" />
        <CarouselContent className="-ml-1">
          {venues?.map((venue) => (
            <CarouselItem
              key={venue.id}
              className="pl-1 md:basis-1/2 lg:basis-1/5"
            >
              <div
                className={`border rounded-lg px-6 py-3  cursor-pointer shadow-md flex items-center justify-center gap-5 transition h-full ${
                  selectedvenueId === venue.id
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent bg-card hover:text-accent-foreground"
                }`}
                onClick={() => handleSelectVenue(venue)}
              >
                <p className="text-sm">{venue.name}</p>
                {selectedvenueId === venue.id && dashboardLoading && (
                  <Loader2 className="h-4 w-4 animate-spin text-accent-foreground" />
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselNext />
      </Carousel>
    </>
  );
};

export default Venues;
