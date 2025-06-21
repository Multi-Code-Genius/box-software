"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Calendar, Loader2 } from "lucide-react";
import BookingPage from "@/imports/booking/pages/BookingPage";
import { useVenues } from "@/api/vanue";
import { Venue } from "@/types/auth";

const SchedulePage = () => {
  const params = useParams();
  const id = params?.id;
  const { data: venues, isLoading, isError } = useVenues();

  const searchParams = useSearchParams();

  const ground = searchParams.get("grounds") ?? "";

  const [venue, setVenue] = useState<Venue | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!id || !venues?.venues?.length) return;
    const foundVenue = venues.venues.find((g) => String(g.id) === id);
    setVenue((foundVenue ?? null) as Venue | null);
  }, [id, venues]);

  if (!mounted) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-48">
        <Loader2 className="animate-spin text-gray-500 mx-2" size={32} />
        Loading...
      </div>
    );
  }

  if (!venue || isError) {
    return (
      <div className="flex items-center justify-center w-full h-48">
        <span className="text-gray-600 text-lg">
          {isError ? "Failed to load bookings." : "Bookings not found."}
        </span>
      </div>
    );
  }

  return (
    <div className="p-[20px] overflow-hidden">
      <div className="flex items-center gap-3 pb-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Calendar className="h-6 w-6 text-primary" />
        </div>
        <h1 className="font-bold text-2xl md:text-3xl text-foreground">
          Bookings
        </h1>
      </div>
      <div className="relative pb-2">
        <p className="text-sm pl-3 before:absolute before:left-0 before:top-1 before:h-4 before:w-1 before:bg-primary before:rounded-full">
          Booking for:{" "}
          <span className="font-semibold text-primary">{venue.name}</span>
        </p>
      </div>
      <BookingPage venue={venue} ground={ground} />
    </div>
  );
};

export default SchedulePage;
