"use client";

import { useDashboardData } from "@/api/dashboard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useVenueStore } from "@/store/venueStore";
import { Loader2 } from "lucide-react";

const Venues = () => {
  const { venues } = useVenueStore();

  const { selectedvenueId, setSelectedvenueId, setVenue } = useVenueStore();

  const { isLoading: dashboardLoading } = useDashboardData(selectedvenueId);

  const handleSelectVenue = (venue: any) => {
    setSelectedvenueId(venue.id);
    localStorage.setItem("venueId", venue.id);
    setVenue(venue);
  };

  return (
    <>
      <Carousel className="w-[90%] relative left-20">
        <CarouselPrevious className="z-16" />
        <CarouselContent className="-ml-1">
          {venues?.map((venue) => (
            <CarouselItem
              key={venue.id}
              className="pl-3 md:basis-1/2 lg:basis-1/5"
            >
              <div
                className={`border rounded-lg px-6 py-3 font-semibold  cursor-pointer shadow-md flex items-center justify-center gap-5 transition h-full ${
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
