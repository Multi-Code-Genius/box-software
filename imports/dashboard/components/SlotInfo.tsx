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
import { useState } from "react";
import { format, differenceInMinutes } from "date-fns";

const SlotInfo = () => {
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("All");
  const { data } = useDashboardStore();

  const getHour = (date: Date) => date.getHours();

  const formatTime = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `${format(startDate, "h:mma")} - ${format(endDate, "h:mma")}`;
  };

  const getAvailability = (status: string) => {
    switch (status) {
      case "PENDING":
      case "CONFIRMED":
        return "booked";
      case "CANCELLED":
        return "cancelled";
      default:
        return "available";
    }
  };

  const getIcon = (availability: string) => {
    switch (availability) {
      case "available":
        return <div className="bg-green-500 h-2 w-2 rounded-full" />;
      case "booked":
        return <div className="bg-red-500 h-2 w-2 rounded-full" />;
      case "cancelled":
        return <div className="bg-gray-500 h-2 w-2 rounded-full" />;
      default:
        return <div className="bg-yellow-500 h-2 w-2 rounded-full" />;
    }
  };

  const slots =
    data?.bookingsThisMonth?.map((slot: any) => {
      const start = new Date(slot.startTime);
      const end = new Date(slot.endTime);
      const duration = differenceInMinutes(end, start);
      const availability = getAvailability(slot.status);

      return {
        time: formatTime(slot.startTime, slot.endTime),
        duration: `${duration} mins slot`,
        price: `$${slot.totalAmount}`,
        availability,
        icon: getIcon(availability),
        original: slot,
      };
    }) || [];

  const applyTimeFilter = (slot: (typeof slots)[0]) => {
    const hour = getHour(new Date(slot.original.startTime));
    switch (selectedTimeFilter) {
      case "Morning":
        return hour >= 5 && hour < 12;
      case "Evening":
        return hour >= 17 && hour < 20;
      case "Night":
        return hour >= 20 || hour < 5;
      default:
        return true;
    }
  };

  const filteredSlots = slots
    .filter((slot) =>
      showAvailableOnly ? slot.availability === "available" : true
    )
    .filter(applyTimeFilter);

  return (
    <div>
      <div className="flex justify-between border-b py-3 px-5 items-center">
        <p className="text-base font-bold">Today's slot Info</p>
        <div>
          {["All", "Morning", "Evening", "Night"].map((label, idx) => (
            <button
              key={label}
              onClick={() => setSelectedTimeFilter(label)}
              className={`border py-1 px-4 cursor-pointer text-sm ${
                idx === 0 ? "rounded-l-md" : ""
              } ${idx === 3 ? "rounded-r-md" : ""} ${
                selectedTimeFilter === label ? "bg-gray-200 font-semibold" : ""
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 py-4">
        <div className="flex justify-between pb-3">
          <div className="font-medium flex gap-2 items-center">
            Total all slots
            <div className="w-5 h-5 bg-gray-200 rounded-full flex justify-center items-center text-xs">
              {filteredSlots.length}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showAvailableOnly}
              onChange={(e) => setShowAvailableOnly(e.target.checked)}
            />
            <p className="font-medium text-sm">Show only Available slot</p>
          </div>
        </div>

        <div className="overflow-y-auto">
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {filteredSlots.map((slot, index) => (
              <Card key={index} className="gap-2.5 py-5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="capitalize flex items-center border rounded-lg py-1 px-4 gap-2 text-xs">
                      {slot.icon}
                      {slot.availability}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <p className="font-medium">{slot.time}</p>
                  <p>{slot.duration}</p>
                  <p className="text-2xl font-bold">{slot.price}</p>
                </CardContent>
                <CardFooter>
                  <Button
                    disabled={slot.availability === "booked"}
                    className="mx-auto px-8"
                  >
                    Book Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlotInfo;
