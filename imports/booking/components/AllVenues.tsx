"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IndianRupee, Loader2, Map, MapPinned, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useVenueStore } from "@/store/venueStore";
import { useVenues } from "@/api/vanue";

const AllVenues = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const { venues, setVenues } = useVenueStore();
  const { data, isLoading } = useVenues();
  const router = useRouter();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (data?.venues) {
      setVenues(data.venues);
    }
  }, [data, setVenues]);

  if (!hasMounted) return null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-48">
        <Loader2 className="animate-spin text-gray-500 mx-2" size={32} />
        Loading Venues...
      </div>
    );
  }

  const handleGameClick = (venue: { id: string; name: string }) => {
    localStorage.setItem("venueId", venue.id);
    router.push(
      `/schedule/${venue.id}?id=${venue.id}&name=${encodeURIComponent(
        venue.name
      )}`
    );
  };

  if (!venues?.length) {
    return (
      <div className="pt-10 text-base text-center text-muted-foreground">
        No Venues found.
      </div>
    );
  }

  return (
    <div className="p-7">
      <h2 className="font-bold text-2xl pb-5">Venues Details</h2>

      <div className="flex gap-6 flex-wrap">
        {venues.map((venue) => (
          <Card
            key={venue.id}
            className="w-[370px] gap-3 shadow-xl cursor-pointer"
            onClick={() => handleGameClick(venue)}
          >
            <CardHeader className="gap-0">
              <CardTitle className="text-lg">{venue.name}</CardTitle>
              <CardDescription className="text-lg">
                {venue.category}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="flex items-center gap-2">
                <MapPinned size={18} />
                Address: {venue.address}
              </p>
              <p className="flex items-center gap-2">
                <Users size={18} />
                Capacity: {venue?.game_info.maxPlayers}
              </p>
              <p className="flex items-center gap-2">
                <IndianRupee size={18} />
                Price: {venue.hourly_price}
              </p>
              <p className="flex items-center gap-2">
                <Map size={18} />
                {venue.location.city}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AllVenues;
