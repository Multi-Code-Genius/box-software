"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IndianRupee,
  Loader2,
  Map,
  MapPin,
  MapPinned,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useVenueStore } from "@/store/venueStore";
import { useVenues } from "@/api/vanue";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Mosaic } from "react-loading-indicators";

const AllVenues = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const { venues, setVenues } = useVenueStore();
  const { data, isLoading } = useVenues();
  const router = useRouter();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleClick = () => {
    router.push("/addVenues");
  };

  useEffect(() => {
    if (data?.venues) {
      setVenues(data.venues);
    }
  }, [data, setVenues]);

  if (!hasMounted) return null;

  const handleVenueClick = (
    venue: {
      id: string;
      name: string;
      ground_details: { hourly_price: number; ground: number }[];
    },
    groundIndex: number
  ) => {
    const hourlyPrice = venue?.ground_details?.[groundIndex]?.hourly_price ?? 0;
    const ground = venue?.ground_details?.[groundIndex]?.ground ?? 0;

    localStorage.setItem("venueId", venue.id);

    router.push(
      `/schedule/${venue.id}?id=${venue.id}&name=${encodeURIComponent(
        venue.name
      )}&price=${hourlyPrice}&grounds=${ground}`
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Mosaic color={["#3d4293", "#4e54b5", "#7277c4", "#2e326f"]} />
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
    <div className="p-7">
      <h2 className="font-bold text-2xl pb-5">Venues Details</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {venues.map((venue) => (
          <div key={venue.id} className="relative group">
            <Card className="gap-3 shadow-xl h-full flex flex-col">
              <CardHeader className="gap-0">
                <CardTitle className="text-lg">{venue.name || ""}</CardTitle>
                <CardDescription className="text-base">
                  {venue.category}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 flex-grow">
                <p className="flex items-center gap-2">
                  <MapPin size={18} />
                  <span className="truncate">
                    Address: {venue.address || ""}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <Users size={18} />
                  Capacity: {venue?.game_info?.maxPlayers || ""}
                </p>
                <p className="flex items-center gap-2">
                  <IndianRupee size={18} />
                  Price: {venue?.ground_details?.[0]?.hourly_price || 0}
                </p>
                <p className="flex items-center gap-2">
                  <Map size={18} />
                  {venue.location?.city || ""}
                </p>
              </CardContent>

              {venue.ground_details?.length > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-0 group-hover:h-12 transition-all duration-300 overflow-hidden bg-gradient-to-t from-black/10 via-transparent to-transparent">
                  <div className="flex justify-center gap-1 pt-2">
                    {venue.ground_details.map((_: any, index: number) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVenueClick(venue, index);
                        }}
                        className="px-3 py-1 cursor-pointer text-sm text-white bg-primary/90 hover:bg-primary rounded-t-md transition-colors"
                      >
                        Ground {index + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllVenues;
