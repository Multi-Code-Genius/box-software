"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDashboardStore } from "@/store/dashboardStore";
import { useState, useEffect } from "react";
import { format, differenceInMinutes } from "date-fns";
import { useDashboardData } from "@/api/dashboard";
import { IndianRupee, Loader2 } from "lucide-react";
import { useVenueStore } from "@/store/venueStore";

const SlotInfo = () => {
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("All");
  const { dashboardData } = useDashboardStore();
  const { selectedvenueId } = useVenueStore();
  const { isLoading } = useDashboardData(selectedvenueId);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  const getHour = (date: Date) => date.getHours();

  const formatTime = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `${format(startDate, "h:mma")} - ${format(endDate, "h:mma")}`;
  };

  const slots =
    dashboardData?.bookingsThisMonth?.map((slot: any) => {
      const start = new Date(slot.startTime);
      const end = new Date(slot.endTime);
      const duration = differenceInMinutes(end, start);
      const status = slot.status;
      const hourlyRate = slot.totalAmount;
      const price = Math.round((hourlyRate * duration) / 60);

      return {
        time: formatTime(slot.startTime, slot.endTime),
        duration: `${duration} mins slot`,
        price,
        status,
        isCancel: slot.isCancel,
        originalStartTime: slot.startTime,
      };
    }) || [];

  const applyTimeFilter = (slot: (typeof slots)[0]) => {
    const hour = getHour(new Date(slot.originalStartTime));
    switch (selectedTimeFilter) {
      case "Morning":
        return hour >= 5 && hour < 12; // Morning → 5 AM – 11:59 AM
      case "Afternoon":
        return hour >= 12 && hour < 16; // Afternoon → 12 PM – 4:59 PM
      case "Evening":
        return hour >= 16 && hour < 20; // Evening → 5 PM – 7:59 PM
      case "Night":
        return hour >= 20 || hour < 5; // Night → 8 PM – 4:59 AM
      default:
        return true;
    }
  };

  const filteredSlots = slots.filter(applyTimeFilter);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-48">
        <Loader2 className="animate-spin text-gray-500 mx-2" size={20} />
        Loading Slots...
      </div>
    );
  }
  return (
    <div>
      <div className="flex justify-between border-b py-3 px-5 items-center">
        <p className="text-base font-bold"> Slot info of this month</p>
        <div>
          {["All", "Morning", "Afternoon", "Evening", "Night"].map(
            (label, idx) => (
              <button
                key={label}
                onClick={() => setSelectedTimeFilter(label)}
                className={`border py-1 px-4 cursor-pointer text-sm ${
                  idx === 0 ? "rounded-l-md" : ""
                } ${idx === 4 ? "rounded-r-md" : ""} ${
                  selectedTimeFilter === label
                    ? "bg-gray-200 font-semibold"
                    : ""
                }`}
              >
                {label}
              </button>
            )
          )}
        </div>
      </div>

      <div className="px-5 py-3">
        <div className="flex justify-between pb-3">
          <div className="font-medium flex gap-2 items-center">
            Total all slots
            <div className="w-5 h-5 bg-gray-200 rounded-full flex justify-center items-center text-xs">
              {filteredSlots.length}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" />
            <p className="font-medium text-sm">Show only Available slot</p>
          </div>
        </div>

        <div className="overflow-y-auto">
          {filteredSlots.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              No slots found
            </div>
          ) : (
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {filteredSlots.map((slot, index) => (
                <Card key={index} className="gap-2.5 py-5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div
                        className={`capitalize flex items-center border rounded-lg py-1 px-4 gap-2 text-xs ${
                          slot.isCancel
                            ? "bg-red-100 text-red-700 border-red-300"
                            : "bg-green-100 text-green-700 border-green-300"
                        }`}
                      >
                        <div
                          className={`h-2 w-2 rounded-full ${
                            slot.isCancel ? "bg-red-500" : "bg-green-500" //showing dots
                          }`}
                        />
                        {slot.isCancel ? "cancelled" : "booked"}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <p className="font-medium">{slot.time}</p>
                    <p>{slot.duration}</p>
                    <p className="text-2xl font-bold">
                      {" "}
                      <IndianRupee size={18} className="inline mb-1" />
                      {slot.price}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      disabled={slot.status === "PENDING"}
                      className="mx-auto px-8"
                    >
                      Book Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SlotInfo;
