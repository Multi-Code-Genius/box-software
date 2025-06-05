"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import BookingPage from "@/imports/booking/pages/BookingPage";
import { useVenues } from "@/api/vanue";
import { Venue } from "@/types/auth";

const SchedulePage = () => {
  const params = useParams();
  const id = params?.id;
  const { data: venues, isLoading, isError } = useVenues();

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
      <p className="font-bold text-3xl pb-2">Bookings</p>
      <p className="text-sm">Booking for: {venue.name}</p>
      <BookingPage venue={venue} />
    </div>
  );
};

export default SchedulePage;
